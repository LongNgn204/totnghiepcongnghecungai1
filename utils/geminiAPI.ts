// Tích hợp Gemini API để tương tác với AI

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

/**
 * Gọi Gemini API để tạo nội dung
 */
export async function generateContent(prompt: string): Promise<GeminiResponse> {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    return {
      text: '',
      success: false,
      error: 'Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local'
    };
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      text,
      success: true,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API'
    };
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
  files?: File[]
): Promise<GeminiResponse> {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    return {
      text: '',
      success: false,
      error: 'Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local'
    };
  }

  try {
    // Chuẩn bị parts cho request
    const parts: any[] = [{ text: message }];

    // Thêm files nếu có
    if (files && files.length > 0) {
      for (const file of files) {
        const filePart = await fileToGenerativePart(file);
        parts.push(filePart);
      }
    }

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: parts
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      text,
      success: true,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API'
    };
  }
}
