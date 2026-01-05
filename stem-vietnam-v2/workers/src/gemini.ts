// Chú thích: Vertex AI Gemini client cho Cloudflare Workers
import { getAccessToken, VertexAICredentials } from './gcp-auth';

// Chú thích: Interface cho response từ Gemini
export interface GeminiResponse {
    text: string;
    tokensIn: number;
    tokensOut: number;
}

// Chú thích: Vertex AI endpoint URL
function getVertexAIEndpoint(projectId: string, location: string, model: string): string {
    return `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;
}

function getVertexAIStreamEndpoint(projectId: string, location: string, model: string): string {
    return `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:streamGenerateContent?alt=sse`;
}

// Chú thích: Gọi Vertex AI với prompt
export async function callGemini(
    credentials: VertexAICredentials,
    params: {
        systemPrompt: string;
        userMessage: string;
        context?: string;
        customPrompt?: string;
    }
): Promise<GeminiResponse> {
    const { systemPrompt, userMessage, context, customPrompt } = params;

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

    // Chú thích: Vertex AI request body
    const requestBody = {
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

    const endpoint = getVertexAIEndpoint(
        credentials.projectId,
        credentials.location,
        'gemini-2.0-flash-exp'
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
            }>;
            usageMetadata?: {
                promptTokenCount: number;
                candidatesTokenCount: number;
            };
        };

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Chú thích: Log cho observability
        const latency = Date.now() - t0;
        console.log('[vertex-ai] call done', {
            latency,
            textLen: text.length,
            hasContext: !!context,
        });

        return {
            text,
            tokensIn: data.usageMetadata?.promptTokenCount || 0,
            tokensOut: data.usageMetadata?.candidatesTokenCount || 0,
        };
    } catch (error) {
        console.error('[vertex-ai] error:', error);
        throw error;
    }
}

// Chú thích: Stream response từ Vertex AI
export async function* streamGemini(
    credentials: VertexAICredentials,
    params: {
        systemPrompt: string;
        userMessage: string;
        context?: string;
    }
): AsyncGenerator<string> {
    const { systemPrompt, userMessage, context } = params;

    const accessToken = await getAccessToken(credentials);

    let fullPrompt = systemPrompt;
    if (context) {
        fullPrompt += `\n\n--- CONTEXT ---\n${context}\n--- HẾT CONTEXT ---\n`;
    }
    fullPrompt += `\n\nCâu hỏi: ${userMessage}`;

    const requestBody = {
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

    const endpoint = getVertexAIStreamEndpoint(
        credentials.projectId,
        credentials.location,
        'gemini-2.0-flash-exp'
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
