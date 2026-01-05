// Chú thích: Gemini API client - Wrapper gọi Cloudflare Workers Backend
// Đã chuyển từ gọi trực tiếp SDK sang gọi qua Backend để bảo mật và dùng Vertex AI
import { sendChatMessage, streamChatMessage } from './api';

export interface GeminiResponse {
    text: string;
    tokensIn: number;
    tokensOut: number;
}

// Chú thích: Giữ lại signature cũ để không break code hiện tại
export async function callGemini(params: {
    systemPrompt: string;
    userMessage: string;
    context?: string;
    customPrompt?: string;
}): Promise<GeminiResponse> {
    const { systemPrompt, userMessage, context, customPrompt } = params;

    // Chú thích: Combine prompts vì backend API chỉ nhận message & context
    // System prompt đã được hardcode ở backend cho nhất quán, 
    // nhưng nếu cần custom thì có thể sửa backend để nhận thêm param.
    // Hiện tại ta sẽ gộp customPrompt vào userMessage để gửi đi.

    let finalMessage = userMessage;
    if (customPrompt) {
        finalMessage += `\n\n${customPrompt}`;
    }

    // Chú thích: Gọi backend
    const result = await sendChatMessage(finalMessage, context);

    if (!result.success || !result.response) {
        throw new Error(result.error || 'Failed to get response from AI backend');
    }

    return {
        text: result.response,
        tokensIn: 0,
        tokensOut: 0
    };
}

export async function* streamGemini(params: {
    systemPrompt: string;
    userMessage: string;
    context?: string;
}): AsyncGenerator<string> {
    const { userMessage, context } = params;

    // Chú thích: Gọi stream từ backend
    const generator = streamChatMessage(userMessage, context);

    for await (const chunk of generator) {
        yield chunk;
    }
}

// Chú thích: Function legacy không còn dùng nhưng giữ để tránh lỗi import
export function initGemini(apiKey?: string): any {
    console.warn('initGemini is deprecated. Using backend API instead.');
    return null;
}

export function getModel(): any {
    console.warn('getModel is deprecated. Using backend API instead.');
    return null;
}
