
/**
 * ✅ PHASE 1 - STEP 1.3: Upgraded Gemini API with Error Handling
 */

import { retryAIRequest } from './retry';
import {
  AppErrorClass,
  ErrorCode,
  createAIError,
  createErrorFromResponse,
  logError,
  getErrorMessage,
} from './errorHandler';
import { getCache, setCache, hashKey } from './cache';

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Mô hình mạnh mẽ nhất (Next Gen)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Phản hồi nhanh, độ trễ thấp (Turbo)' },
];



const API_URL = (import.meta.env.VITE_API_URL as string) || (import.meta.env.MODE === 'development' ? 'http://localhost:8787' : '') ;

/**
 * ✅ Validate model ID
 */
function validateModelId(modelId: string): void {
  if (!AVAILABLE_MODELS.find(m => m.id === modelId)) {
    throw new AppErrorClass(
      ErrorCode.MODEL_NOT_FOUND,
      `Model '${modelId}' không tìm thấy`,
      { availableModels: AVAILABLE_MODELS.map(m => m.id) },
      undefined,
      'generateContent'
    );
  }
}

/**
 * ✅ Validate prompt
 */
function validatePrompt(prompt: string): void {
  if (!prompt || typeof prompt !== 'string') {
    throw new AppErrorClass(
      ErrorCode.INVALID_PROMPT,
      'Prompt không hợp lệ. Vui lòng nhập text hợp lệ.',
      { receivedType: typeof prompt },
      undefined,
      'generateContent'
    );
  }

  if (prompt.trim().length === 0) {
    throw new AppErrorClass(
      ErrorCode.INVALID_PROMPT,
      'Prompt không được để trống.',
      null,
      undefined,
      'generateContent'
    );
  }

  if (prompt.length > 10000) {
    throw new AppErrorClass(
      ErrorCode.INVALID_PROMPT,
      'Prompt quá dài (tối đa 10000 ký tự).',
      { length: prompt.length },
      undefined,
      'generateContent'
    );
  }
}

/**
 * ✅ Gọi AI qua server proxy để tránh lộ API key
 */
export async function generateContent(
  prompt: string,
  modelId: string = 'gemini-2.5-pro'
): Promise<GeminiResponse> {
  try {
    // Validate inputs
    validatePrompt(prompt);
    validateModelId(modelId);

    // Check cache first (10 minutes TTL)
    const cacheKey = 'ai:' + hashKey(`${modelId}:${prompt}`);
    const cached = getCache<string>(cacheKey);
    if (cached) {
      return { text: cached, success: true };
    }

    const token = localStorage.getItem('auth_token');

    // Check if API URL is configured
    if (!API_URL || API_URL === 'http://localhost:8787') {
      console.warn('AI API endpoint not properly configured.');
      return {
        text: 'Xin lỗi, dịch vụ AI hiện không khả dụng. Vui lòng kiểm tra cấu hình API.',
        success: false,
        error: 'API endpoint not configured',
      };
    }

    // ✅ Retry AI request with backoff
    const response = await retryAIRequest(async () => {
      const res = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt,
          modelId,
          generationConfig: {
            temperature: 0.3,
            topK: 30,
            topP: 0.9,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw createErrorFromResponse(res, errorData, 'generateContent');
      }

      return res;
    });

    const data = await response.json();
    const text =
      data.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      '';

    if (!text) {
      throw createAIError('AI không trả về kết quả', data, 'generateContent');
    }

    // Save to cache (10 minutes)
    setCache<string>(cacheKey, text, 10 * 60 * 1000);

    return { text, success: true };
  } catch (error) {
    const message = getErrorMessage(error);
    logError(error instanceof Error ? error : new Error(message));
    return { text: '', success: false, error: message };
  }
}

/**
 * Trích xuất mã Mermaid từ response của AI
 */
export function extractMermaidCode(text: string): string {
  // Tìm code block mermaid
  const mermaidMatch = text.match(/```mermaid\n([\s\S]*?)```/);
  if (mermaidMatch) {
    return mermaidMatch[1].trim();
  }

  // Nếu không có code block, tìm từ "mindmap" đến cuối
  const mindmapMatch = text.match(/mindmap[\s\S]*/);
  if (mindmapMatch) {
    return mindmapMatch[0].trim();
  }

  return '';
}

/**
 * Trích xuất nội dung văn bản (loại bỏ code blocks)
 */
export function extractTextContent(text: string): string {
  // Loại bỏ code blocks
  return text.replace(/```[\s\S]*?```/g, '').trim();
}

/**
 * Chuyển file thành format cho Gemini API
 */
export async function fileToGenerativePart(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Gửi chat message với files tới Gemini
 */
export async function sendChatMessage(
  message: string,
  files?: File[],
  modelId: string = 'gemini-2.5-pro',
  history: any[] = []
): Promise<GeminiResponse> {
  try {
    // Check if API URL is configured
    if (!API_URL || API_URL === 'http://localhost:8787') {
      console.warn('AI API endpoint not properly configured. Using fallback response.');
      return { 
        text: 'Xin lỗi, dịch vụ AI hiện không khả dụng. Vui lòng kiểm tra cấu hình API.', 
        success: false, 
        error: 'API endpoint not configured' 
      };
    }

    // Construct the contents array from history
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add the current message
    const currentParts: any[] = [{ text: message }];

    // Add files to the current message if any
    if (files && files.length > 0) {
      for (const file of files) {
        const filePart = await fileToGenerativePart(file);
        currentParts.push(filePart as any);
      }
    }

    contents.push({ role: 'user', parts: currentParts });

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        contents,
        modelId,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusMessage = response.status === 404 
        ? 'Endpoint AI không tìm thấy. Vui lòng kiểm tra cấu hình server.'
        : response.status === 500
        ? 'Lỗi server. Vui lòng thử lại sau.'
        : `Lỗi ${response.status}`;
      throw new Error(errorData?.error || statusMessage);
    }

    const data = await response.json();
    const text = data.data?.candidates?.[0]?.content?.parts?.[0]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return { text, success: true };
  } catch (error) {
    console.error('AI Proxy Error:', error);
    return { text: '', success: false, error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API' };
  }
}
