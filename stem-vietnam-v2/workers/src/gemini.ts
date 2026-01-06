// Chú thích: Vertex AI Gemini client cho Cloudflare Workers
// Hỗ trợ 2 model: Flash (chat nhanh) và Pro (tạo đề chất lượng)
import { getAccessToken, VertexAICredentials } from './gcp-auth';

// Chú thích: Model configuration - tách riêng cho từng use case
// Chat AI: gemini-3-flash-preview (nhanh, tìm kiếm thông tin)
// Tạo đề thi: gemini-3-pro-preview (chất lượng cao, RAG)
export const CHAT_MODEL = 'gemini-3-flash-preview';
export const EXAM_MODEL = 'gemini-3-pro-preview';

// Chú thích: Interface cho response từ Gemini
export interface GeminiResponse {
    text: string;
    tokensIn: number;
    tokensOut: number;
    groundingMetadata?: {
        searchQueries?: string[];
        webSearchQueries?: string[];
    };
}

// Chú thích: Vertex AI endpoint URL - hỗ trợ cả regional và global
function getVertexAIEndpoint(projectId: string, location: string, model: string): string {
    // Chú thích: Global endpoint không có prefix location
    const host = location === 'global'
        ? 'aiplatform.googleapis.com'
        : `${location}-aiplatform.googleapis.com`;
    return `https://${host}/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;
}

function getVertexAIStreamEndpoint(projectId: string, location: string, model: string): string {
    // Chú thích: Global endpoint không có prefix location
    const host = location === 'global'
        ? 'aiplatform.googleapis.com'
        : `${location}-aiplatform.googleapis.com`;
    return `https://${host}/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:streamGenerateContent?alt=sse`;
}

// Chú thích: Gọi Vertex AI với prompt và Google Search Grounding
export async function callGemini(
    credentials: VertexAICredentials,
    params: {
        systemPrompt: string;
        userMessage: string;
        context?: string;
        customPrompt?: string;
        useGrounding?: boolean; // Bật Google Search grounding
        model?: string; // Chú thích: Cho phép chọn model (default: CHAT_MODEL)
    }
): Promise<GeminiResponse> {
    const { systemPrompt, userMessage, context, customPrompt, useGrounding = true, model = CHAT_MODEL } = params;

    // Chú thích: Lấy access token
    const accessToken = await getAccessToken(credentials);

    // Chú thích: Build full prompt
    let fullPrompt = systemPrompt;

    if (context) {
        fullPrompt += `\n\n--- CONTEXT TỪ TÀI LIỆU ---\n${context}\n--- HẾT CONTEXT ---\n`;
    }

    if (customPrompt) {
        fullPrompt += `\n\nYêu cầu bổ sung từ người dùng: ${customPrompt}\n`;
    }

    fullPrompt += `\n\nCâu hỏi/Yêu cầu: ${userMessage}`;

    // Chú thích: Vertex AI request body với Google Search Grounding
    const requestBody: Record<string, unknown> = {
        contents: [
            {
                role: 'user',
                parts: [{ text: fullPrompt }],
            },
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
        },
    };

    // Chú thích: Thêm Google Search grounding tool để lấy thông tin mới nhất
    // Syntax cho Vertex AI Gemini 2.0: google_search
    if (useGrounding) {
        requestBody.tools = [
            {
                google_search: {}
            }
        ];
    }

    const endpoint = getVertexAIEndpoint(
        credentials.projectId,
        credentials.location,
        model
    );

    const t0 = Date.now();

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Vertex AI error: ${response.status} - ${error}`);
        }

        const data = await response.json() as {
            candidates: Array<{
                content: {
                    parts: Array<{ text: string }>;
                };
                groundingMetadata?: {
                    searchEntryPoint?: {
                        renderedContent?: string;
                    };
                    groundingChunks?: Array<{
                        web?: {
                            uri?: string;
                            title?: string;
                        };
                    }>;
                    webSearchQueries?: string[];
                };
            }>;
            usageMetadata?: {
                promptTokenCount: number;
                candidatesTokenCount: number;
            };
        };

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const groundingMetadata = data.candidates?.[0]?.groundingMetadata;

        // Chú thích: Log cho observability
        const latency = Date.now() - t0;
        console.log('[vertex-ai] call done', {
            latency,
            textLen: text.length,
            hasContext: !!context,
            hasGrounding: !!groundingMetadata,
            model: model,
            searchQueries: groundingMetadata?.webSearchQueries,
        });

        return {
            text,
            tokensIn: data.usageMetadata?.promptTokenCount || 0,
            tokensOut: data.usageMetadata?.candidatesTokenCount || 0,
            groundingMetadata: groundingMetadata ? {
                webSearchQueries: groundingMetadata.webSearchQueries,
            } : undefined,
        };
    } catch (error) {
        console.error('[vertex-ai] error:', error);
        throw error;
    }
}

// Chú thích: Stream response từ Vertex AI với Google Search Grounding
export async function* streamGemini(
    credentials: VertexAICredentials,
    params: {
        systemPrompt: string;
        userMessage: string;
        context?: string;
        useGrounding?: boolean;
        model?: string; // Chú thích: Cho phép chọn model (default: CHAT_MODEL)
    }
): AsyncGenerator<string> {
    const { systemPrompt, userMessage, context, useGrounding = true, model = CHAT_MODEL } = params;

    const accessToken = await getAccessToken(credentials);

    let fullPrompt = systemPrompt;
    if (context) {
        fullPrompt += `\n\n--- CONTEXT ---\n${context}\n--- HẾT CONTEXT ---\n`;
    }
    fullPrompt += `\n\nCâu hỏi: ${userMessage}`;

    const requestBody: Record<string, unknown> = {
        contents: [
            {
                role: 'user',
                parts: [{ text: fullPrompt }],
            },
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
        },
    };

    // Chú thích: Thêm Google Search grounding
    // Syntax cho Vertex AI Gemini 2.0: google_search
    if (useGrounding) {
        requestBody.tools = [
            {
                google_search: {}
            }
        ];
    }

    const endpoint = getVertexAIStreamEndpoint(
        credentials.projectId,
        credentials.location,
        model
    );

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Vertex AI stream error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('No response body');
    }

    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(6)) as {
                        candidates: Array<{
                            content: {
                                parts: Array<{ text: string }>;
                            };
                        }>;
                    };
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        yield text;
                    }
                } catch {
                    // Chú thích: Skip invalid JSON
                }
            }
        }
    }
}
