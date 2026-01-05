// Chú thích: Entry point cho Cloudflare Workers API (Vertex AI)
import { callGemini, streamGemini } from './gemini';
import { VertexAICredentials } from './gcp-auth';

// Chú thích: Environment interface
interface Env {
    // Vertex AI config (từ vars trong wrangler.toml)
    VERTEX_PROJECT_ID: string;
    VERTEX_LOCATION: string;
    VERTEX_LOCATION_FALLBACK: string;

    // Secrets (từ wrangler secret put)
    VERTEX_CLIENT_EMAIL: string;
    VERTEX_PRIVATE_KEY: string;
    VERTEX_PRIVATE_KEY_ID?: string;

    // CORS
    CORS_ORIGIN: string;
}

// Chú thích: Helper để tạo credentials từ env
function getCredentials(env: Env): VertexAICredentials {
    return {
        clientEmail: env.VERTEX_CLIENT_EMAIL,
        privateKey: env.VERTEX_PRIVATE_KEY,
        privateKeyId: env.VERTEX_PRIVATE_KEY_ID,
        projectId: env.VERTEX_PROJECT_ID,
        location: env.VERTEX_LOCATION,
    };
}

// Chú thích: System prompts
const SYSTEM_PROMPTS = {
    chat: `Bạn là trợ lý AI chuyên về môn Công nghệ THPT Việt Nam.
Nhiệm vụ: Giải đáp thắc mắc về kiến thức Công nghệ một cách rõ ràng, chính xác.
Sử dụng tiếng Việt. Giải thích dễ hiểu, có ví dụ minh họa khi cần.
Nếu không chắc chắn, hãy nói rõ và đề xuất tìm hiểu thêm.`,

    generate: `Bạn là chuyên gia tạo đề thi môn Công nghệ THPT.
Tạo câu hỏi trắc nghiệm chất lượng cao với 4 đáp án (A, B, C, D).
Đánh dấu đáp án đúng và giải thích ngắn gọn.
Format JSON: { "question": "...", "options": ["A...", "B...", "C...", "D..."], "correct": 0, "explanation": "..." }`
};

// Chú thích: CORS headers
function corsHeaders(origin: string): HeadersInit {
    return {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

// Chú thích: JSON response helper
function jsonResponse(data: unknown, status: number, origin: string): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
        },
    });
}

// Chú thích: Handle chat endpoint
async function handleChat(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as {
            message: string;
            context?: string;
        };

        if (!body.message) {
            return jsonResponse({ error: 'Message is required' }, 400, env.CORS_ORIGIN);
        }

        const credentials = getCredentials(env);

        const result = await callGemini(credentials, {
            systemPrompt: SYSTEM_PROMPTS.chat,
            userMessage: body.message,
            context: body.context,
        });

        return jsonResponse({
            success: true,
            response: result.text,
        }, 200, env.CORS_ORIGIN);

    } catch (error) {
        console.error('[chat] error:', error);
        return jsonResponse({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, 500, env.CORS_ORIGIN);
    }
}

// Chú thích: Handle generate endpoint (tạo câu hỏi)
async function handleGenerate(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as {
            topic: string;
            count?: number;
            difficulty?: 'easy' | 'medium' | 'hard';
        };

        if (!body.topic) {
            return jsonResponse({ error: 'Topic is required' }, 400, env.CORS_ORIGIN);
        }

        const count = body.count || 1;
        const difficulty = body.difficulty || 'medium';

        const userMessage = `Tạo ${count} câu hỏi trắc nghiệm về chủ đề: ${body.topic}
Độ khó: ${difficulty}
Trả về dưới dạng JSON array.`;

        const credentials = getCredentials(env);

        const result = await callGemini(credentials, {
            systemPrompt: SYSTEM_PROMPTS.generate,
            userMessage,
        });

        // Chú thích: Parse JSON từ response
        let questions;
        try {
            // Chú thích: Extract JSON từ response (có thể có text thừa)
            const jsonMatch = result.text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                questions = JSON.parse(result.text);
            }
        } catch {
            questions = [{ raw: result.text }];
        }

        return jsonResponse({
            success: true,
            questions,
        }, 200, env.CORS_ORIGIN);

    } catch (error) {
        console.error('[generate] error:', error);
        return jsonResponse({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, 500, env.CORS_ORIGIN);
    }
}

// Chú thích: Handle stream chat (Server-Sent Events)
async function handleChatStream(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as {
            message: string;
            context?: string;
        };

        if (!body.message) {
            return jsonResponse({ error: 'Message is required' }, 400, env.CORS_ORIGIN);
        }

        const credentials = getCredentials(env);

        // Chú thích: Tạo ReadableStream cho SSE
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                try {
                    const generator = streamGemini(credentials, {
                        systemPrompt: SYSTEM_PROMPTS.chat,
                        userMessage: body.message,
                        context: body.context,
                    });

                    for await (const chunk of generator) {
                        const data = `data: ${JSON.stringify({ text: chunk })}\n\n`;
                        controller.enqueue(encoder.encode(data));
                    }

                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    const errorData = `data: ${JSON.stringify({ error: 'Stream error' })}\n\n`;
                    controller.enqueue(encoder.encode(errorData));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                ...corsHeaders(env.CORS_ORIGIN),
            },
        });

    } catch (error) {
        console.error('[stream] error:', error);
        return jsonResponse({
            error: 'Internal server error'
        }, 500, env.CORS_ORIGIN);
    }
}

// Chú thích: Main fetch handler
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        // Chú thích: Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders(env.CORS_ORIGIN),
            });
        }

        // Chú thích: Health check
        if (path === '/' || path === '/health') {
            return jsonResponse({
                status: 'ok',
                service: 'stem-vietnam-api',
                provider: 'vertex-ai',
                project: env.VERTEX_PROJECT_ID,
                location: env.VERTEX_LOCATION,
                timestamp: new Date().toISOString(),
            }, 200, env.CORS_ORIGIN);
        }

        // Chú thích: API routes
        if (request.method === 'POST') {
            switch (path) {
                case '/api/chat':
                    return handleChat(request, env);
                case '/api/chat/stream':
                    return handleChatStream(request, env);
                case '/api/generate':
                    return handleGenerate(request, env);
            }
        }

        // Chú thích: 404 for unknown routes
        return jsonResponse({ error: 'Not found' }, 404, env.CORS_ORIGIN);
    },
};
