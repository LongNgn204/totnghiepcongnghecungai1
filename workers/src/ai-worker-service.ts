/**
 * Cloudflare AI Workers Service
 * 
 * Sử dụng Cloudflare AI Workers để gọi Llama 3.8 và các models khác
 * Không cần API key, sử dụng trực tiếp từ Cloudflare Workers
 */

export interface AIWorkerEnv {
  AI: any; // Cloudflare AI binding
  USE_AI_WORKERS?: string;
  GEMINI_API_KEY?: string; // Fallback to Gemini if needed
}

/**
 * Chuyển đổi format messages từ Gemini sang format của Llama
 */
function convertMessagesToLlamaFormat(contents: any[]): Array<{ role: string; content: string }> {
  return contents.map((msg: any) => {
    const role = msg.role === 'user' ? 'user' : 'assistant';
    // Lấy text từ parts array
    const textParts = msg.parts?.filter((p: any) => p.text).map((p: any) => p.text) || [];
    const content = textParts.join('\n');
    return { role, content };
  });
}

/**
 * Gọi Llama 3.8 qua Cloudflare AI Workers
 */
export async function callLlama38(
  ai: any,
  messages: Array<{ role: string; content: string }>,
  options?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
  }
): Promise<any> {
  try {
    // Cloudflare AI Workers format cho Llama 3.8
    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 4096,
      top_p: options?.top_p ?? 0.9,
    });

    // Format response giống Gemini để frontend không cần thay đổi nhiều
    // Cloudflare AI có thể trả về response.response, response.text, hoặc response.description
    const text = response.response || response.text || response.description || JSON.stringify(response);
    
    return {
      candidates: [
        {
          content: {
            parts: [
              {
                text: typeof text === 'string' ? text : String(text),
              },
            ],
          },
        },
      ],
      model: 'llama-3.1-8b-instruct',
      usage: {
        prompt_tokens: response.prompt_tokens || 0,
        completion_tokens: response.completion_tokens || 0,
        total_tokens: (response.prompt_tokens || 0) + (response.completion_tokens || 0),
      },
    };
  } catch (error: any) {
    console.error('Llama 3.1 8B AI Worker error:', error);
    // Log chi tiết để debug
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });
    throw new Error(`Llama AI error: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Wrapper chính: Chỉ sử dụng Llama 3.1 8B (AI Workers)
 * Chú thích: Đã loại bỏ hoàn toàn fallback Gemini
 */
export async function callAIWorker(
  modelId: string,
  contents: any[],
  env: AIWorkerEnv,
  generationConfig?: any
): Promise<any> {
  // Chỉ dùng AI Workers (Llama 3.1 8B)
  if (!env.AI) {
    throw new Error('Cloudflare AI Workers chưa được cấu hình. Vui lòng kiểm tra wrangler.toml');
  }

  try {
    // Chuyển đổi format messages
    const llamaMessages = convertMessagesToLlamaFormat(contents);
    
    // Gọi Llama 3.1 8B
    return await callLlama38(env.AI, llamaMessages, {
      temperature: generationConfig?.temperature ?? 0.7,
      max_tokens: generationConfig?.maxOutputTokens ?? 4096,
      top_p: generationConfig?.topP ?? 0.9,
    });
  } catch (error: any) {
    console.error('AI Workers error:', error);
    throw error;
  }
}

// Đã loại bỏ callGeminiFallback - chỉ dùng Llama 3.1 8B

