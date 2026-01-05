// Chú thích: RAG Generator - kết hợp retrieved context với Gemini
import { callGemini } from '../gemini';
import { getRAGContext, type RetrieveFilters } from './retriever';
import type { RetrievedChunk } from '../../types';

// Chú thích: Response từ RAG generator
export interface RAGGeneratorResponse {
    text: string;
    sourceChunks: RetrievedChunk[];
}

// Chú thích: Generate response với RAG pipeline
export async function generateWithRAG(params: {
    query: string;
    systemPrompt: string;
    customPrompt?: string;
    filters?: RetrieveFilters;
}): Promise<RAGGeneratorResponse> {
    const { query, systemPrompt, customPrompt, filters } = params;

    // Chú thích: Step 1 - Retrieve relevant context
    const { context, chunks } = await getRAGContext(query, filters);

    if (chunks.length === 0) {
        console.warn('[rag-gen] No context found, generating without RAG');
    }

    // Chú thích: Step 2 - Generate với Gemini + context
    const response = await callGemini({
        systemPrompt,
        userMessage: query,
        context: context || undefined,
        customPrompt,
    });

    return {
        text: response.text,
        sourceChunks: chunks,
    };
}

// Chú thích: Generate câu hỏi với RAG
export async function generateQuestionsWithRAG(params: {
    topic: string;
    grade: '10' | '11' | '12';
    difficulty: string;
    count: number;
    systemPrompt: string;
    customPrompt?: string;
}): Promise<RAGGeneratorResponse> {
    const { topic, grade, difficulty, count, systemPrompt, customPrompt } = params;

    const query = `Tạo ${count} câu hỏi trắc nghiệm về chủ đề "${topic}" cho học sinh lớp ${grade}, mức độ ${difficulty}`;

    return generateWithRAG({
        query,
        systemPrompt,
        customPrompt,
        filters: { grade },
    });
}

// Chú thích: Generate đề thi với RAG
export async function generateExamWithRAG(params: {
    subject: 'cong_nghiep' | 'nong_nghiep';
    systemPrompt: string;
    customPrompt?: string;
}): Promise<RAGGeneratorResponse> {
    const { subject, systemPrompt, customPrompt } = params;

    const subjectName = subject === 'cong_nghiep' ? 'Công nghiệp' : 'Nông nghiệp';
    const query = `Tạo đề thi THPT Quốc gia môn Công nghệ ${subjectName} với 28 câu theo format chuẩn Bộ GD&ĐT`;

    return generateWithRAG({
        query,
        systemPrompt,
        customPrompt,
        filters: { topic: subjectName },
    });
}
