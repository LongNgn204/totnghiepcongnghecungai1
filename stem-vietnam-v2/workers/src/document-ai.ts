// Chú thích: Google Document AI client cho Cloudflare Workers
// Sử dụng Document OCR processor để extract text từ PDF

import { getAccessToken, type VertexAICredentials } from './gcp-auth';

// Chú thích: Interface cho Document AI config
export interface DocumentAIConfig {
    processorId: string;
    location: string; // 'us' hoặc 'eu'
}

// Chú thích: Interface cho extracted page
export interface ExtractedPage {
    pageNumber: number;
    text: string;
    confidence?: number;
}

// Chú thích: Interface cho extracted document
export interface ExtractedDocument {
    text: string;
    pages: ExtractedPage[];
    totalPages: number;
}

// Chú thích: Extract text từ PDF buffer sử dụng Document AI
export async function extractTextFromPDF(
    credentials: VertexAICredentials,
    config: DocumentAIConfig,
    pdfBuffer: ArrayBuffer
): Promise<ExtractedDocument> {
    const accessToken = await getAccessToken(credentials);

    // Chú thích: Convert ArrayBuffer to base64
    const base64Content = arrayBufferToBase64(pdfBuffer);

    // Chú thích: Document AI endpoint
    const endpoint = `https://${config.location}-documentai.googleapis.com/v1/projects/${credentials.projectId}/locations/${config.location}/processors/${config.processorId}:process`;

    const t0 = Date.now();

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            rawDocument: {
                content: base64Content,
                mimeType: 'application/pdf',
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Document AI error: ${response.status} - ${error}`);
    }

    const data = await response.json() as {
        document: {
            text: string;
            pages?: Array<{
                pageNumber: number;
                layout?: {
                    textAnchor?: {
                        textSegments?: Array<{
                            startIndex?: string;
                            endIndex?: string;
                        }>;
                    };
                    confidence?: number;
                };
            }>;
        };
    };

    const latency = Date.now() - t0;
    console.log('[document-ai] extracted text', {
        latency,
        textLength: data.document.text?.length || 0,
        pages: data.document.pages?.length || 0,
    });

    // Chú thích: Build pages array
    const pages: ExtractedPage[] = [];
    const fullText = data.document.text || '';

    if (data.document.pages) {
        for (const page of data.document.pages) {
            // Chú thích: Extract text cho từng page dựa trên textAnchor
            let pageText = '';
            if (page.layout?.textAnchor?.textSegments) {
                for (const segment of page.layout.textAnchor.textSegments) {
                    const start = parseInt(segment.startIndex || '0');
                    const end = parseInt(segment.endIndex || '0');
                    pageText += fullText.slice(start, end);
                }
            }

            pages.push({
                pageNumber: page.pageNumber,
                text: pageText || fullText, // Fallback to full text if no segments
                confidence: page.layout?.confidence,
            });
        }
    }

    return {
        text: fullText,
        pages,
        totalPages: pages.length || 1,
    };
}

// Chú thích: Helper - Convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Chú thích: Chunk text thành các đoạn nhỏ hơn
export interface ChunkOptions {
    maxTokens?: number;      // Số tokens tối đa mỗi chunk (default: 500)
    overlapTokens?: number;  // Số tokens overlap giữa chunks (default: 100)
    separators?: string[];   // Các ký tự tách (default: ['\n\n', '\n', '. ', ' '])
}

export interface TextChunk {
    id: string;
    content: string;
    startIndex: number;
    endIndex: number;
    metadata: {
        chunkIndex: number;
        totalChunks?: number;
    };
}

// Chú thích: Estimate tokens (rough estimate: 4 chars = 1 token for Vietnamese)
function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

// Chú thích: Split text into chunks
export function chunkText(
    text: string,
    documentId: string,
    options: ChunkOptions = {}
): TextChunk[] {
    const maxTokens = options.maxTokens || 500;
    const overlapTokens = options.overlapTokens || 100;
    const separators = options.separators || ['\n\n', '\n', '. ', ' '];

    const maxChars = maxTokens * 4;
    const overlapChars = overlapTokens * 4;

    const chunks: TextChunk[] = [];
    let currentIndex = 0;
    let chunkIndex = 0;

    while (currentIndex < text.length) {
        // Chú thích: Tìm điểm cắt tốt nhất
        let endIndex = Math.min(currentIndex + maxChars, text.length);

        // Chú thích: Nếu chưa hết text, tìm separator gần nhất
        if (endIndex < text.length) {
            let bestSplit = endIndex;
            for (const sep of separators) {
                const lastSep = text.lastIndexOf(sep, endIndex);
                if (lastSep > currentIndex + maxChars * 0.5) {
                    bestSplit = lastSep + sep.length;
                    break;
                }
            }
            endIndex = bestSplit;
        }

        const content = text.slice(currentIndex, endIndex).trim();

        if (content.length > 0) {
            chunks.push({
                id: `${documentId}-chunk-${chunkIndex}`,
                content,
                startIndex: currentIndex,
                endIndex,
                metadata: {
                    chunkIndex,
                },
            });
            chunkIndex++;
        }

        // Chú thích: Move to next chunk với overlap
        currentIndex = endIndex - overlapChars;
        if (currentIndex <= chunks[chunks.length - 1]?.startIndex) {
            currentIndex = endIndex; // Tránh infinite loop
        }
    }

    // Chú thích: Update totalChunks
    for (const chunk of chunks) {
        chunk.metadata.totalChunks = chunks.length;
    }

    console.log('[document-ai] chunked text', {
        documentId,
        totalChunks: chunks.length,
        avgChunkSize: Math.round(text.length / chunks.length),
    });

    return chunks;
}
