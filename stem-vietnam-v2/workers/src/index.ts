// Chú thích: Entry point cho Cloudflare Workers API (Vertex AI + Auth + Conversations + Admin + RAG)
import { callGemini, streamGemini, CHAT_MODEL, EXAM_MODEL } from './gemini';
import { VertexAICredentials } from './gcp-auth';
import { handleRegister, handleLogin, handleMe, getUserFromToken, AuthEnv } from './auth-routes';
import { getConversations, getConversation, createConversation, deleteConversation, addMessage, ConvoEnv } from './conversation-routes';
import { getUsers, getUser, deleteUser, updateUser, getStats, AdminEnv } from './admin-routes';
import { searchVectors, buildContextFromResults } from './vectorize';
import { listPDFsInFolder, listAllPDFsRecursive } from './google-drive';
import { processDocument, processLocalFile, getRAGContext, parseMetadataFromFilename, type RAGPipelineConfig, type BookMetadata } from './rag-pipeline';
import { parseFileWithOCR, isFileTypeSupported, isFileSizeValid, MAX_FILE_SIZE, getSupportedExtensions } from './file-parser';

// Chú thích: Environment interface
interface Env {
    // Vertex AI config (từ vars trong wrangler.toml)
    VERTEX_PROJECT_ID: string;
    VERTEX_LOCATION: string;
    VERTEX_LOCATION_FALLBACK: string;

    // Secrets (từ wrangler secret put)
    VERTEX_CLIENT_EMAIL: string;
    VERTEX_PRIVATE_KEY: string;
    VERTEX_PRIVATE_KEY_ID?: string;
    JWT_SECRET: string;

    // D1 Database
    DB: D1Database;

    // Vectorize (RAG Pipeline)
    VECTORIZE: VectorizeIndex;

    // Document AI Config (cần set qua wrangler secret hoặc vars)
    DOCUMENT_AI_PROCESSOR_ID?: string;
    DOCUMENT_AI_LOCATION?: string;
    DRIVE_FOLDER_ID?: string;

    // CORS
    CORS_ORIGIN: string;
}

// Chú thích: Helper để tạo credentials từ env
function getCredentials(env: Env): VertexAICredentials {
    return {
        clientEmail: env.VERTEX_CLIENT_EMAIL,
        privateKey: env.VERTEX_PRIVATE_KEY,
        privateKeyId: env.VERTEX_PRIVATE_KEY_ID,
        projectId: env.VERTEX_PROJECT_ID,
        location: env.VERTEX_LOCATION,
    };
}

const SYSTEM_PROMPTS = {
    // Chú thích: Chat AI - Chuyên gia đa năng với LaTeX support
    chat: `Bạn là **STEM AI** - trợ lý học tập thông minh hàng đầu Việt Nam.

## VỀ BẠN:
Bạn là chuyên gia giáo dục với hơn 15 năm kinh nghiệm giảng dạy các môn STEM (Khoa học, Công nghệ, Kỹ thuật, Toán học). Bạn có khả năng:
- Giải thích kiến thức phức tạp một cách đơn giản, dễ hiểu
- Đưa ra ví dụ thực tế gắn liền với đời sống Việt Nam
- Hướng dẫn từng bước (step-by-step) khi giải bài tập
- Khuyến khích tư duy phản biện và sáng tạo

## NHẬN DIỆN Ý ĐỊNH NGƯỜI DÙNG:
- **Tin tức, Sự kiện, Thời tiết** → Sử dụng Google Search và trả lời trực tiếp
- **Môn Công nghệ THPT** (lập trình, mạng, điện tử, cơ khí, nông nghiệp...) → Trả lời chi tiết theo SGK, có ví dụ
- **Toán, Lý, Hóa, Sinh** → Giải thích công thức, hướng dẫn giải bài
- **Câu hỏi tổng quát** (giải trí, lời khuyên, cuộc sống...) → Trả lời thân thiện
- **Chào hỏi bình thường** → Đáp lại tự nhiên, vui vẻ

## LÀM TOÁN VỚI LATEX:
Khi có công thức toán học, LUÔN sử dụng LaTeX:
- Inline: \`$công thức$\` — VD: $v = \\frac{s}{t}$, $a^2 + b^2 = c^2$
- Block: \`$$công thức$$\` — VD:
$$E = mc^2$$
$$\\Delta = b^2 - 4ac$$
$$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$$

**Ví dụ LaTeX đúng:**
- Phân số: $\\frac{a}{b}$
- Căn bậc 2: $\\sqrt{x}$, căn bậc n: $\\sqrt[n]{x}$
- Lũy thừa: $x^2$, $e^{-x}$
- Chỉ số: $a_1$, $x_{n+1}$
- Tổng: $\\sum_{i=1}^{n} x_i$
- Tích phân: $\\int_{0}^{\\infty} f(x) dx$
- Giới hạn: $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$
- Vector: $\\vec{v}$, ma trận: $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$

## TUYỆT ĐỐI KHÔNG:
- KHÔNG nói "tài liệu không đề cập" — bạn CÓ Google Search!
- KHÔNG từ chối hỗ trợ vì "không liên quan đến Công nghệ"
- KHÔNG trả lời qua loa, thiếu chi tiết
- KHÔNG sai công thức LaTeX syntax

## PHONG CÁCH TRẢ LỜI:
- **Markdown**: **bold**, *italic*, danh sách, bảng, code blocks
- **LaTeX**: Inline $...$ và block $$...$$
- **Mermaid**: Sơ đồ luồng, mindmap khi phù hợp
- **Giọng văn**: Chuyên nghiệp nhưng gần gũi, dễ hiểu

Bạn sẵn sàng giúp đỡ với BẤT KỲ câu hỏi nào!`,


    // Chú thích: Tạo đề thi - dùng RAG context từ thư viện
    generate: `Bạn là **Chuyên gia Biên soạn Đề thi** môn Công nghệ THPT với hơn 20 năm kinh nghiệm.

## NGUYÊN TẮC TẠO ĐỀ:
1. **Dựa trên Context** - Câu hỏi PHẢI hoàn toàn dựa trên tài liệu được cung cấp
2. **Chính xác tuyệt đối** - KHÔNG bịa đặt thông tin
3. **Phân loại mức độ** - Nhớ (30%), Hiểu (30%), Vận dụng (25%), Vận dụng cao (15%)
4. **LaTeX cho công thức** - Sử dụng $...$ và $$...$$ khi cần

## FORMAT CÂU HỎI:
**Câu X:** [Nội dung câu hỏi]
A. [Đáp án A]
B. [Đáp án B]
C. [Đáp án C]
D. [Đáp án D]

## FORMAT ĐÁP ÁN:
| Câu | Đáp án |
|-----|--------|
| 1   | A      |
| ... | ...    |

## LƯU Ý:
- Nếu context thiếu thông tin: "Tài liệu hiện tại chưa đủ để tạo câu hỏi về chủ đề này."
- Câu hỏi phải RÕ RÀNG, KHÔNG mơ hồ
- Đáp án sai phải HỢP LÝ (không quá dễ loại)
- Mỗi câu hỏi tập trung 1 ý chính`
};


// Chú thích: CORS headers
function corsHeaders(origin: string): HeadersInit {
    return {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

// Chú thích: JSON response helper
function jsonResponse(data: unknown, status: number, origin: string): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
        },
    });
}

// Chú thích: Handle chat endpoint
async function handleChat(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as {
            message: string;
            context?: string;
            systemPrompt?: string; // Chú thích: Cho phép frontend gửi systemPrompt tùy chỉnh
        };

        if (!body.message) {
            return jsonResponse({ error: 'Message is required' }, 400, env.CORS_ORIGIN);
        }

        const credentials = getCredentials(env);

        // Chú thích: Chat AI dùng CHAT_MODEL và Google Search grounding (KHÔNG dùng RAG)
        const result = await callGemini(credentials, {
            systemPrompt: body.systemPrompt || SYSTEM_PROMPTS.chat,
            userMessage: body.message,
            // KHÔNG gửi context - Chat chỉ dùng Google Search
            model: CHAT_MODEL,
            useGrounding: true, // Bật Google Search để tìm kiếm thông tin mới nhất
        });

        return jsonResponse({
            success: true,
            response: result.text,
        }, 200, env.CORS_ORIGIN);

    } catch (error) {
        console.error('[chat] error:', error);
        return jsonResponse({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, 500, env.CORS_ORIGIN);
    }
}

// Chú thích: Handle generate endpoint (tạo câu hỏi)
async function handleGenerate(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as {
            topic: string;
            count?: number;
            difficulty?: 'easy' | 'medium' | 'hard';
        };

        if (!body.topic) {
            return jsonResponse({ error: 'Topic is required' }, 400, env.CORS_ORIGIN);
        }

        const count = body.count || 1;
        const difficulty = body.difficulty || 'medium';

        const userMessage = `Tạo ${count} câu hỏi trắc nghiệm về chủ đề: ${body.topic}
Độ khó: ${difficulty}
Trả về dưới dạng JSON array.`;

        const credentials = getCredentials(env);

        // Chú thích: Tạo đề dùng EXAM_MODEL, Google Search grounding + RAG context
        const result = await callGemini(credentials, {
            systemPrompt: SYSTEM_PROMPTS.generate,
            userMessage,
            model: EXAM_MODEL,
            useGrounding: true, // Bật Google Search để tìm thêm nội dung theo từ khoá
        });

        // Chú thích: Parse JSON từ response
        let questions;
        try {
            // Chú thích: Extract JSON từ response (có thể có text thừa)
            const jsonMatch = result.text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                questions = JSON.parse(result.text);
            }
        } catch {
            questions = [{ raw: result.text }];
        }

        return jsonResponse({
            success: true,
            questions,
        }, 200, env.CORS_ORIGIN);

    } catch (error) {
        console.error('[generate] error:', error);
        return jsonResponse({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, 500, env.CORS_ORIGIN);
    }
}

// Chú thích: Handle stream chat (Server-Sent Events)
async function handleChatStream(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as {
            message: string;
            context?: string;
            systemPrompt?: string; // Chú thích: Cho phép frontend gửi systemPrompt tùy chỉnh
        };

        if (!body.message) {
            return jsonResponse({ error: 'Message is required' }, 400, env.CORS_ORIGIN);
        }

        const credentials = getCredentials(env);

        // Chú thích: Tạo ReadableStream cho SSE
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                try {
                    // Chú thích: Stream Chat dùng CHAT_MODEL và Google Search (KHÔNG dùng RAG)
                    const generator = streamGemini(credentials, {
                        systemPrompt: body.systemPrompt || SYSTEM_PROMPTS.chat,
                        userMessage: body.message,
                        // KHÔNG gửi context - Chat chỉ dùng Google Search
                        model: CHAT_MODEL,
                        useGrounding: true,
                    });

                    for await (const chunk of generator) {
                        const data = `data: ${JSON.stringify({ text: chunk })}\n\n`;
                        controller.enqueue(encoder.encode(data));
                    }

                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    const errorData = `data: ${JSON.stringify({ error: 'Stream error' })}\n\n`;
                    controller.enqueue(encoder.encode(errorData));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                ...corsHeaders(env.CORS_ORIGIN),
            },
        });

    } catch (error) {
        console.error('[stream] error:', error);
        return jsonResponse({
            error: 'Internal server error'
        }, 500, env.CORS_ORIGIN);
    }
}

// Chú thích: Main fetch handler
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        // Chú thích: Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders(env.CORS_ORIGIN),
            });
        }

        // Chú thích: Health check
        if (path === '/' || path === '/health') {
            return jsonResponse({
                status: 'ok',
                service: 'stem-vietnam-api',
                provider: 'vertex-ai',
                project: env.VERTEX_PROJECT_ID,
                location: env.VERTEX_LOCATION,
                timestamp: new Date().toISOString(),
            }, 200, env.CORS_ORIGIN);
        }

        // Chú thích: API routes
        if (request.method === 'POST') {
            switch (path) {
                case '/api/chat':
                    return handleChat(request, env);
                case '/api/chat/stream':
                    return handleChatStream(request, env);
                case '/api/generate':
                    return handleGenerate(request, env);
                // Auth routes
                case '/api/auth/register':
                    return handleRegister(request, env as unknown as AuthEnv);
                case '/api/auth/login':
                    return handleLogin(request, env as unknown as AuthEnv);
                // Conversation routes
                case '/api/conversations': {
                    const user = await getUserFromToken(request, env as unknown as AuthEnv);
                    if (!user) return jsonResponse({ error: 'Unauthorized' }, 401, env.CORS_ORIGIN);
                    return createConversation(request, user, env as unknown as ConvoEnv);
                }
            }
        }

        // GET routes
        if (request.method === 'GET') {
            // Auth me
            if (path === '/api/auth/me') {
                return handleMe(request, env as unknown as AuthEnv);
            }
            // Get all conversations
            if (path === '/api/conversations') {
                const user = await getUserFromToken(request, env as unknown as AuthEnv);
                if (!user) return jsonResponse({ error: 'Unauthorized' }, 401, env.CORS_ORIGIN);
                return getConversations(user, env as unknown as ConvoEnv);
            }
            // Get single conversation
            const convoMatch = path.match(/^\/api\/conversations\/([^/]+)$/);
            if (convoMatch) {
                const user = await getUserFromToken(request, env as unknown as AuthEnv);
                if (!user) return jsonResponse({ error: 'Unauthorized' }, 401, env.CORS_ORIGIN);
                return getConversation(convoMatch[1], user, env as unknown as ConvoEnv);
            }
        }

        // DELETE routes
        if (request.method === 'DELETE') {
            const convoMatch = path.match(/^\/api\/conversations\/([^/]+)$/);
            if (convoMatch) {
                const user = await getUserFromToken(request, env as unknown as AuthEnv);
                if (!user) return jsonResponse({ error: 'Unauthorized' }, 401, env.CORS_ORIGIN);
                return deleteConversation(convoMatch[1], user, env as unknown as ConvoEnv);
            }
            // Admin: Delete user
            const adminUserMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
            if (adminUserMatch) {
                return deleteUser(adminUserMatch[1], env as unknown as AdminEnv);
            }
        }

        // PUT routes (Admin update)
        if (request.method === 'PUT') {
            const adminUserMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
            if (adminUserMatch) {
                return updateUser(adminUserMatch[1], request, env as unknown as AdminEnv);
            }
        }

        // Admin GET routes
        if (request.method === 'GET') {
            if (path === '/api/admin/users') {
                return getUsers(env as unknown as AdminEnv);
            }
            if (path === '/api/admin/stats') {
                return getStats(env as unknown as AdminEnv);
            }
            const adminUserMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
            if (adminUserMatch) {
                return getUser(adminUserMatch[1], env as unknown as AdminEnv);
            }
        }

        // Admin RAG routes
        if (request.method === 'GET' && path === '/api/admin/rag/list') {
            // List PDFs từ Google Drive folder
            const folderId = env.DRIVE_FOLDER_ID;
            if (!folderId) {
                return jsonResponse({ error: 'DRIVE_FOLDER_ID not configured' }, 400, env.CORS_ORIGIN);
            }
            try {
                const files = await listPDFsInFolder(getCredentials(env), folderId);
                return jsonResponse({ success: true, files }, 200, env.CORS_ORIGIN);
            } catch (error) {
                return jsonResponse({
                    error: 'Failed to list files',
                    details: error instanceof Error ? error.message : 'Unknown error'
                }, 500, env.CORS_ORIGIN);
            }
        }

        if (request.method === 'POST' && path === '/api/admin/rag/process') {
            // Process một file PDF
            const body = await request.json() as { fileId: string; metadata?: BookMetadata };
            if (!body.fileId) {
                return jsonResponse({ error: 'fileId is required' }, 400, env.CORS_ORIGIN);
            }
            if (!env.DOCUMENT_AI_PROCESSOR_ID || !env.DOCUMENT_AI_LOCATION) {
                return jsonResponse({ error: 'Document AI not configured' }, 400, env.CORS_ORIGIN);
            }

            const config: RAGPipelineConfig = {
                documentAI: {
                    processorId: env.DOCUMENT_AI_PROCESSOR_ID,
                    location: env.DOCUMENT_AI_LOCATION,
                },
                driveFolderId: env.DRIVE_FOLDER_ID || '',
            };

            // Sử dụng metadata từ request hoặc parse từ filename
            const metadata = body.metadata || parseMetadataFromFilename(body.fileId, 'unknown.pdf');
            if (!metadata) {
                return jsonResponse({ error: 'Could not determine metadata' }, 400, env.CORS_ORIGIN);
            }

            try {
                const result = await processDocument(
                    getCredentials(env),
                    env.VECTORIZE,
                    config,
                    body.fileId,
                    metadata
                );
                return jsonResponse({ success: true, result }, 200, env.CORS_ORIGIN);
            } catch (error) {
                return jsonResponse({
                    error: 'Processing failed',
                    details: error instanceof Error ? error.message : 'Unknown error'
                }, 500, env.CORS_ORIGIN);
            }
        }

        if (request.method === 'POST' && path === '/api/admin/rag/search') {
            // Test RAG search
            const body = await request.json() as { query: string; filters?: { grade?: string; subject?: string } };
            if (!body.query) {
                return jsonResponse({ error: 'query is required' }, 400, env.CORS_ORIGIN);
            }

            try {
                const { context, sources } = await getRAGContext(
                    getCredentials(env),
                    env.VECTORIZE,
                    body.query,
                    body.filters
                );
                return jsonResponse({ success: true, context, sources }, 200, env.CORS_ORIGIN);
            } catch (error) {
                return jsonResponse({
                    error: 'Search failed',
                    details: error instanceof Error ? error.message : 'Unknown error'
                }, 500, env.CORS_ORIGIN);
            }
        }

        // Chú thích: Upload file và xử lý với Document AI OCR
        if (request.method === 'POST' && path === '/api/admin/rag/upload') {
            // Kiểm tra Document AI config
            if (!env.DOCUMENT_AI_PROCESSOR_ID || !env.DOCUMENT_AI_LOCATION) {
                return jsonResponse({ error: 'Document AI not configured' }, 400, env.CORS_ORIGIN);
            }

            try {
                // Parse multipart form data
                const formData = await request.formData();
                const file = formData.get('file') as File | null;
                const metadataStr = formData.get('metadata') as string | null;

                if (!file) {
                    return jsonResponse({ error: 'No file provided' }, 400, env.CORS_ORIGIN);
                }

                // Kiểm tra file type
                if (!isFileTypeSupported(file.name)) {
                    return jsonResponse({
                        error: `Unsupported file type. Supported: ${getSupportedExtensions().join(', ')}`
                    }, 400, env.CORS_ORIGIN);
                }

                // Kiểm tra file size
                if (!isFileSizeValid(file.size)) {
                    return jsonResponse({
                        error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
                    }, 400, env.CORS_ORIGIN);
                }

                // Parse metadata
                let metadata: BookMetadata;
                if (metadataStr) {
                    metadata = JSON.parse(metadataStr);
                } else {
                    // Auto-generate metadata từ filename
                    const parsed = parseMetadataFromFilename(`upload-${Date.now()}`, file.name);
                    if (!parsed) {
                        return jsonResponse({ error: 'Could not parse metadata. Please provide metadata.' }, 400, env.CORS_ORIGIN);
                    }
                    metadata = parsed;
                }

                // Read file buffer
                const fileBuffer = await file.arrayBuffer();

                // Parse file với Document AI OCR (cho PDF)
                const credentials = getCredentials(env);
                const ocrOptions = {
                    credentials,
                    documentAIConfig: {
                        processorId: env.DOCUMENT_AI_PROCESSOR_ID,
                        location: env.DOCUMENT_AI_LOCATION,
                    },
                };

                // Parse file
                const parsed = await parseFileWithOCR(fileBuffer, file.name, file.type, ocrOptions);

                // Process và index vào Vectorize
                const result = await processLocalFile(
                    credentials,
                    env.VECTORIZE,
                    fileBuffer,
                    file.name,
                    metadata
                );

                return jsonResponse({
                    success: true,
                    result,
                    parsed: {
                        fileName: parsed.metadata.fileName,
                        fileType: parsed.metadata.fileType,
                        extractedLength: parsed.metadata.extractedLength,
                    }
                }, 200, env.CORS_ORIGIN);

            } catch (error) {
                console.error('[rag-upload] error:', error);
                return jsonResponse({
                    error: 'Upload failed',
                    details: error instanceof Error ? error.message : 'Unknown error'
                }, 500, env.CORS_ORIGIN);
            }
        }

        // Chú thích: 404 for unknown routes
        return jsonResponse({ error: 'Not found' }, 404, env.CORS_ORIGIN);
    },
};
