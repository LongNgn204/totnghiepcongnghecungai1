// Chú thích: Gemini API client - wrapper cho Google Generative AI SDK
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Chú thích: Singleton instance cho Gemini client
let geminiInstance: GoogleGenerativeAI | null = null;
let modelInstance: GenerativeModel | null = null;

// Chú thích: Khởi tạo Gemini client với API key từ env
export function initGemini(apiKey?: string): GoogleGenerativeAI {
    const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!key) {
        throw new Error('VITE_GEMINI_API_KEY is required');
    }

    if (!geminiInstance) {
        geminiInstance = new GoogleGenerativeAI(key);
    }

    return geminiInstance;
}

// Chú thích: Lấy model Gemini 2.5 Pro (hoặc fallback)
export function getModel(): GenerativeModel {
    if (!modelInstance) {
        const gemini = initGemini();
        // Chú thích: Dùng gemini-2.0-flash-exp cho tốc độ, fallback 1.5-pro nếu cần
        modelInstance = gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    }
    return modelInstance;
}

// Chú thích: Interface cho response từ Gemini
export interface GeminiResponse {
    text: string;
    tokensIn: number;
    tokensOut: number;
}

// Chú thích: Gọi Gemini với prompt và optional context từ RAG
export async function callGemini(params: {
    systemPrompt: string;
    userMessage: string;
    context?: string; // RAG context
    customPrompt?: string; // User custom prompt
}): Promise<GeminiResponse> {
    const { systemPrompt, userMessage, context, customPrompt } = params;
    const model = getModel();

    // Chú thích: Build full prompt với context và custom prompt
    let fullPrompt = systemPrompt;

    if (context) {
        fullPrompt += `\n\n--- CONTEXT TỪ TÀI LIỆU ---\n${context}\n--- HẾT CONTEXT ---\n`;
    }

    if (customPrompt) {
        fullPrompt += `\n\nYêu cầu bổ sung từ người dùng: ${customPrompt}\n`;
    }

    fullPrompt += `\n\nCâu hỏi/Yêu cầu: ${userMessage}`;

    const t0 = Date.now();

    try {
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        // Chú thích: Log nhẹ cho observability
        const latency = Date.now() - t0;
        console.info('[gemini] call done', {
            latency,
            textLen: text.length,
            hasContext: !!context
        });

        return {
            text,
            tokensIn: 0, // SDK không trả về, cần estimate nếu cần
            tokensOut: 0,
        };
    } catch (error) {
        console.error('[gemini] error:', error);
        throw error;
    }
}

// Chú thích: Stream response từ Gemini (dùng cho chat real-time)
export async function* streamGemini(params: {
    systemPrompt: string;
    userMessage: string;
    context?: string;
}): AsyncGenerator<string> {
    const { systemPrompt, userMessage, context } = params;
    const model = getModel();

    let fullPrompt = systemPrompt;
    if (context) {
        fullPrompt += `\n\n--- CONTEXT ---\n${context}\n--- HẾT CONTEXT ---\n`;
    }
    fullPrompt += `\n\nCâu hỏi: ${userMessage}`;

    const result = await model.generateContentStream(fullPrompt);

    for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
            yield text;
        }
    }
}
