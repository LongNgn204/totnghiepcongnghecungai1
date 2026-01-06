// Chú thích: RAG Pipeline - Full processing flow cho documents
// Flow: File Upload/Drive → Parse → Chunks → Embeddings → Vectorize
// Hỗ trợ: txt, md, docx, pdf (text-based), html, json

import { type VertexAICredentials } from './gcp-auth';
import { downloadFile, getFileMetadata, listPDFsInFolder, type DriveFile } from './google-drive';
import { extractTextFromPDF, chunkText, type DocumentAIConfig, type TextChunk } from './document-ai';
import { createEmbeddingsBatch, insertVectors, searchVectors, buildContextFromResults, type VectorRecord, type SearchResult } from './vectorize';
import { parseFile, isFileTypeSupported, isFileSizeValid, MAX_FILE_SIZE, type ParsedDocument } from './file-parser';

// Chú thích: Config cho RAG pipeline
export interface RAGPipelineConfig {
    documentAI: DocumentAIConfig;
    driveFolderId: string;
    chunkOptions?: {
        maxTokens?: number;
        overlapTokens?: number;
    };
}

// Chú thích: Book metadata để extract từ filename hoặc manual input
export interface BookMetadata {
    bookId: string;
    title: string;
    grade: '10' | '11' | '12';
    subject: 'cong_nghiep' | 'nong_nghiep';
    type: 'sgk' | 'chuyen_de' | 'de_mau';
    publisher?: string;
}

// Chú thích: Processing result
export interface ProcessingResult {
    fileId: string;
    fileName: string;
    success: boolean;
    chunksCreated: number;
    vectorsInserted: number;
    error?: string;
    latencyMs: number;
}

// Chú thích: Process một file PDF từ Drive vào Vectorize
export async function processDocument(
    credentials: VertexAICredentials,
    vectorize: VectorizeIndex,
    config: RAGPipelineConfig,
    fileId: string,
    metadata: BookMetadata
): Promise<ProcessingResult> {
    const t0 = Date.now();

    try {
        // Chú thích: Step 1 - Download PDF từ Drive
        console.log('[rag-pipeline] downloading', { fileId, bookId: metadata.bookId });
        const pdfBuffer = await downloadFile(credentials, fileId);

        // Chú thích: Step 2 - Extract text với Document AI
        console.log('[rag-pipeline] extracting text');
        const extracted = await extractTextFromPDF(credentials, config.documentAI, pdfBuffer);

        if (!extracted.text || extracted.text.length < 100) {
            throw new Error('Extracted text too short or empty');
        }

        // Chú thích: Step 3 - Chunk text
        console.log('[rag-pipeline] chunking text');
        const chunks = chunkText(extracted.text, metadata.bookId, config.chunkOptions);

        // Chú thích: Step 4 - Tạo embeddings (batch để tiết kiệm API calls)
        console.log('[rag-pipeline] creating embeddings', { chunks: chunks.length });
        const BATCH_SIZE = 20; // Vertex AI limit
        const allEmbeddings: number[][] = [];

        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);
            const texts = batch.map(c => c.content);
            const embeddings = await createEmbeddingsBatch(credentials, texts);
            allEmbeddings.push(...embeddings);
        }

        // Chú thích: Step 5 - Build vector records
        const vectorRecords: VectorRecord[] = chunks.map((chunk, index) => ({
            id: chunk.id,
            values: allEmbeddings[index],
            metadata: {
                bookId: metadata.bookId,
                title: metadata.title,
                grade: metadata.grade,
                subject: metadata.subject,
                type: metadata.type,
                content: chunk.content,
            },
        }));

        // Chú thích: Step 6 - Insert vào Vectorize
        console.log('[rag-pipeline] inserting vectors');
        const insertResult = await insertVectors(vectorize, vectorRecords);

        const latency = Date.now() - t0;
        console.log('[rag-pipeline] completed', {
            bookId: metadata.bookId,
            chunks: chunks.length,
            vectors: insertResult.inserted,
            latency,
        });

        return {
            fileId,
            fileName: metadata.title,
            success: true,
            chunksCreated: chunks.length,
            vectorsInserted: insertResult.inserted,
            latencyMs: latency,
        };

    } catch (error) {
        const latency = Date.now() - t0;
        console.error('[rag-pipeline] error', { fileId, error });

        return {
            fileId,
            fileName: metadata.title,
            success: false,
            chunksCreated: 0,
            vectorsInserted: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
            latencyMs: latency,
        };
    }
}

// Chú thích: Process tất cả PDFs trong một folder
export async function processAllDocuments(
    credentials: VertexAICredentials,
    vectorize: VectorizeIndex,
    config: RAGPipelineConfig,
    metadataMap: Map<string, BookMetadata> // fileId -> metadata
): Promise<{
    total: number;
    success: number;
    failed: number;
    results: ProcessingResult[];
}> {
    const files = await listPDFsInFolder(credentials, config.driveFolderId);

    console.log('[rag-pipeline] processing all', { total: files.length });

    const results: ProcessingResult[] = [];
    let success = 0;
    let failed = 0;

    for (const file of files) {
        const metadata = metadataMap.get(file.id);
        if (!metadata) {
            console.warn('[rag-pipeline] no metadata for file', { fileId: file.id, name: file.name });
            results.push({
                fileId: file.id,
                fileName: file.name,
                success: false,
                chunksCreated: 0,
                vectorsInserted: 0,
                error: 'No metadata provided',
                latencyMs: 0,
            });
            failed++;
            continue;
        }

        const result = await processDocument(credentials, vectorize, config, file.id, metadata);
        results.push(result);

        if (result.success) {
            success++;
        } else {
            failed++;
        }
    }

    return {
        total: files.length,
        success,
        failed,
        results,
    };
}

// Chú thích: Search context cho RAG
export async function getRAGContext(
    credentials: VertexAICredentials,
    vectorize: VectorizeIndex,
    query: string,
    filters?: {
        grade?: string;
        subject?: string;
        type?: string;
    },
    topK: number = 5
): Promise<{
    context: string;
    sources: SearchResult[];
}> {
    const results = await searchVectors(vectorize, credentials, query, filters, topK);
    const context = buildContextFromResults(results);

    return {
        context,
        sources: results,
    };
}

// Chú thích: Helper - Parse metadata từ filename
// Format expected: "SGK-CN10-CanhDieu.pdf" hoặc "ChuyenDe-CN11-KetNoi.pdf"
export function parseMetadataFromFilename(
    fileId: string,
    fileName: string
): BookMetadata | null {
    try {
        const baseName = fileName.replace('.pdf', '').replace('.PDF', '');
        const parts = baseName.split('-');

        if (parts.length < 3) return null;

        const typeMap: Record<string, 'sgk' | 'chuyen_de' | 'de_mau'> = {
            'sgk': 'sgk',
            'cd': 'chuyen_de',
            'chuyende': 'chuyen_de',
            'de': 'de_mau',
            'demau': 'de_mau',
        };

        const gradeMatch = baseName.match(/(\d{1,2})/);
        const grade = gradeMatch ? gradeMatch[1] : '10';

        const isNongNghiep = baseName.toLowerCase().includes('nn') ||
            baseName.toLowerCase().includes('nong');

        return {
            bookId: `book-${fileId.slice(0, 8)}`,
            title: baseName.replace(/-/g, ' '),
            grade: (grade === '10' || grade === '11' || grade === '12' ? grade : '10') as '10' | '11' | '12',
            subject: isNongNghiep ? 'nong_nghiep' : 'cong_nghiep',
            type: typeMap[parts[0].toLowerCase()] || 'sgk',
        };
    } catch {
        return null;
    }
}

// Chú thích: Process file upload trực tiếp (không cần Google Drive/Document AI)
// Hỗ trợ: txt, md, docx, pdf (limited), html, json
export async function processLocalFile(
    credentials: VertexAICredentials,
    vectorize: VectorizeIndex,
    fileBuffer: ArrayBuffer,
    fileName: string,
    metadata: BookMetadata,
    chunkOptions?: { maxTokens?: number; overlapTokens?: number }
): Promise<ProcessingResult> {
    const t0 = Date.now();

    try {
        // Chú thích: Step 1 - Kiểm tra file size
        if (!isFileSizeValid(fileBuffer.byteLength)) {
            throw new Error(`File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }

        // Chú thích: Step 2 - Parse file để lấy text
        console.log('[rag-pipeline] parsing local file', { fileName, bookId: metadata.bookId });
        const parsed = await parseFile(fileBuffer, fileName);

        if (!parsed.content || parsed.content.length < 100) {
            throw new Error('Extracted text too short or empty');
        }

        // Chú thích: Step 3 - Chunk text
        console.log('[rag-pipeline] chunking text', { textLength: parsed.content.length });
        const chunks = chunkText(parsed.content, metadata.bookId, chunkOptions);

        // Chú thích: Step 4 - Tạo embeddings (batch)
        console.log('[rag-pipeline] creating embeddings', { chunks: chunks.length });
        const BATCH_SIZE = 20;
        const allEmbeddings: number[][] = [];

        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);
            const texts = batch.map(c => c.content);
            const embeddings = await createEmbeddingsBatch(credentials, texts);
            allEmbeddings.push(...embeddings);
        }

        // Chú thích: Step 5 - Build vector records
        const vectorRecords: VectorRecord[] = chunks.map((chunk, index) => ({
            id: chunk.id,
            values: allEmbeddings[index],
            metadata: {
                bookId: metadata.bookId,
                title: metadata.title,
                grade: metadata.grade,
                subject: metadata.subject,
                type: metadata.type,
                content: chunk.content,
            },
        }));

        // Chú thích: Step 6 - Insert vào Vectorize
        console.log('[rag-pipeline] inserting vectors');
        const insertResult = await insertVectors(vectorize, vectorRecords);

        const latency = Date.now() - t0;
        console.log('[rag-pipeline] local file completed', {
            fileName,
            bookId: metadata.bookId,
            chunks: chunks.length,
            vectors: insertResult.inserted,
            latency,
        });

        return {
            fileId: `local-${Date.now()}`,
            fileName,
            success: true,
            chunksCreated: chunks.length,
            vectorsInserted: insertResult.inserted,
            latencyMs: latency,
        };

    } catch (error) {
        const latency = Date.now() - t0;
        console.error('[rag-pipeline] local file error', { fileName, error });

        return {
            fileId: `local-${Date.now()}`,
            fileName,
            success: false,
            chunksCreated: 0,
            vectorsInserted: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
            latencyMs: latency,
        };
    }
}
