// Chú thích: OpenRouter Client for Cloudflare Workers
// Replaces Vertex AI implementation
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'mistralai/devstral-2512:free';
// const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp:free'; // Backup option

export interface OpenRouterResponse {
    text: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export async function callOpenRouter(
    apiKey: string,
    params: {
        systemPrompt: string;
        userMessage: string;
        context?: string;
        customPrompt?: string;
        model?: string;
    }
): Promise<OpenRouterResponse> {
    const { systemPrompt, userMessage, context, customPrompt, model = DEFAULT_MODEL } = params;

    let fullSystemPrompt = systemPrompt;
    if (context) {
        fullSystemPrompt += `\n\n=== CONTEXT ===\n${context}\n=== END CONTEXT ===\n`;
    }
    if (customPrompt) {
        fullSystemPrompt += `\n\nAdditional Request: ${customPrompt}\n`;
    }

    try {
        const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://github.com/stem-vietnam', // Required by OpenRouter
                'X-Title': 'STEM Vietnam',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: fullSystemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data: any = await response.json();
        const text = data.choices?.[0]?.message?.content || '';

        return {
            text,
            usage: data.usage
        };

    } catch (error) {
        console.error('[openrouter] call error:', error);
        throw error;
    }
}

export async function* streamOpenRouter(
    apiKey: string,
    params: {
        systemPrompt: string;
        userMessage: string;
        context?: string;
        model?: string;
    }
): AsyncGenerator<string> {
    const { systemPrompt, userMessage, context, model = DEFAULT_MODEL } = params;

    let fullSystemPrompt = systemPrompt;
    if (context) {
        fullSystemPrompt += `\n\n=== CONTEXT ===\n${context}\n=== END CONTEXT ===\n`;
    }

    try {
        const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://github.com/stem-vietnam',
                'X-Title': 'STEM Vietnam',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: fullSystemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 4000,
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter stream error: ${response.status} - ${errorText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed === 'data: [DONE]') continue;
                if (trimmed.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(trimmed.slice(6));
                        const content = data.choices?.[0]?.delta?.content;
                        if (content) {
                            yield content;
                        }
                    } catch (e) {
                        // ignore parse error for partial chunks
                    }
                }
            }
        }

    } catch (error) {
        console.error('[openrouter] stream error:', error);
        throw error;
    }
}
