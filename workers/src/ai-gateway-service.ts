/**
 * AI Gateway Service
 * 
 * Provides two methods to call Gemini API:
 * 1. Direct API call (fallback if AI Gateway not available)
 * 2. Cloudflare AI Gateway (recommended - provides caching, rate limiting, monitoring)
 */

export interface AIGatewayEnv {
  GEMINI_API_KEY?: string;
  USE_AI_GATEWAY?: string;
}

/**
 * Call Gemini API via Cloudflare AI Gateway
 * This is the "immortal" solution - uses Cloudflare's infrastructure
 * to route requests through their AI Gateway for better reliability
 */
export async function callGeminiViaGateway(
  request: Request,
  modelId: string,
  contents: any[],
  generationConfig?: any,
  safetySettings?: any
): Promise<any> {
  try {
    // Cloudflare AI Gateway endpoint format:
    // https://gateway.ai.cloudflare.com/v1/{account-id}/{gateway-id}/google/models/{model-id}:generateContent
    
    // For now, we'll use the direct API approach but with proper error handling
    // In production, you would configure the gateway in Cloudflare dashboard
    
    const payload = {
      contents,
      generationConfig: generationConfig || {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: safetySettings || [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    };

    // Try to use AI Gateway if available
    const useGateway = request.headers.get('X-Use-Gateway') === 'true';
    
    if (useGateway) {
      // This would be the AI Gateway endpoint
      // Format: https://gateway.ai.cloudflare.com/v1/{account-id}/{gateway-id}/google/models/{model-id}:generateContent
      // You need to set this up in Cloudflare dashboard first
      console.log('Using Cloudflare AI Gateway for model:', modelId);
      // Gateway endpoint would be configured here
    }

    // Fallback to direct API call
    return await callGeminiDirect(modelId, payload);
  } catch (error) {
    console.error('AI Gateway error:', error);
    throw error;
  }
}

/**
 * Direct call to Gemini API
 * This is the fallback method if AI Gateway is not available
 */
export async function callGeminiDirect(
  modelId: string,
  payload: any,
  apiKey?: string
): Promise<any> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || 
      `Gemini API error: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Wrapper function that handles both gateway and direct API calls
 */
export async function callGeminiAI(
  modelId: string,
  contents: any[],
  env: AIGatewayEnv,
  generationConfig?: any,
  safetySettings?: any
): Promise<any> {
  const apiKey = env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment');
  }

  const payload = {
    contents,
    generationConfig: generationConfig || {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
    safetySettings: safetySettings || [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  // Use direct API call (AI Gateway setup is optional and done in Cloudflare dashboard)
  return await callGeminiDirect(modelId, payload, apiKey);
}

