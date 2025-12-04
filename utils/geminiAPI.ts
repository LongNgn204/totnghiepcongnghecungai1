
export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Mô hình mạnh mẽ nhất (Next Gen)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Phản hồi nhanh, độ trễ thấp (Turbo)' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

/**
 * Gọi AI qua server proxy để tránh lộ API key
 */
export async function generateContent(prompt: string, modelId: string = 'gemini-2.5-pro'): Promise<GeminiResponse> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error || `${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const text = data.data?.candidates?.[0]?.content?.parts?.[0]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { text, success: true };
  } catch (error) {
    console.error('AI Proxy Error:', error);
    return { text: '', success: false, error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API' };
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
      throw new Error(errorData?.error || 'API request failed');
    }

    const data = await response.json();
    const text = data.data?.candidates?.[0]?.content?.parts?.[0]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return { text, success: true };
  } catch (error) {
    console.error('AI Proxy Error:', error);
    return { text: '', success: false, error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API' };
  }
}
