// Response helpers with CORS

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-User-ID',
  'Access-Control-Max-Age': '86400',
};

export function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export function errorResponse(message: string, status = 500): Response {
  return jsonResponse(
    {
      error: message,
      status,
      timestamp: Date.now(),
    },
    status
  );
}

export function successResponse(data: any, message?: string): Response {
  return jsonResponse({
    success: true,
    data,
    message,
    timestamp: Date.now(),
  });
}

export function notFoundResponse(resource = 'Resource'): Response {
  return errorResponse(`${resource} not found`, 404);
}

export function badRequestResponse(message = 'Bad request'): Response {
  return errorResponse(message, 400);
}

export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return errorResponse(message, 401);
}
