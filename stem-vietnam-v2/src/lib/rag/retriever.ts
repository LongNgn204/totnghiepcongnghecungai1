// Chú thích: RAG Retriever - hybrid search từ Cloudflare Vectorize
// Tạm thời mock cho development, sẽ integrate với Workers API sau

import type { RetrievedChunk, Document, DocumentChunk } from '../../types';

// Chú thích: Mock data cho development - sẽ thay bằng API call thực
const MOCK_DOCUMENTS: Document[] = [
    {
        id: 'doc-1',
        title: 'SGK Công nghệ 11 - Kết nối tri thức',
        grade: '11',
        topic: 'Công nghiệp',
        source: 'Kết nối tri thức',
        fileUrl: '',
        createdAt: Date.now(),
    },
];

const MOCK_CHUNKS: DocumentChunk[] = [
    {
        id: 'chunk-1',
        documentId: 'doc-1',
        content: 'Mạng máy tính là tập hợp các máy tính được kết nối với nhau thông qua các đường truyền vật lý theo một kiến trúc nhất định. Mạng máy tính cho phép chia sẻ tài nguyên và trao đổi thông tin giữa các máy tính.',
        chunkIndex: 0,
    },
    {
        id: 'chunk-2',
        documentId: 'doc-1',
        content: 'Phân loại mạng theo phạm vi địa lý: LAN (Local Area Network) - mạng cục bộ, WAN (Wide Area Network) - mạng diện rộng, MAN (Metropolitan Area Network) - mạng đô thị.',
        chunkIndex: 1,
    },
    {
        id: 'chunk-3',
        documentId: 'doc-1',
        content: 'Giao thức mạng TCP/IP gồm 4 tầng: Tầng liên kết (Network Interface), Tầng mạng (Internet), Tầng vận chuyển (Transport), Tầng ứng dụng (Application).',
        chunkIndex: 2,
    },
];

// Chú thích: Interface cho filter khi retrieve
export interface RetrieveFilters {
    grade?: '10' | '11' | '12';
    topic?: string;
    source?: string;
}

// Chú thích: Retrieve context từ Vector DB với hybrid search
// Hiện tại là mock, sẽ call Cloudflare Workers API với Vectorize
export async function retrieveContext(
    query: string,
    filters?: RetrieveFilters,
    topK: number = 5
): Promise<RetrievedChunk[]> {
    console.info('[rag] retrieving', { query: query.slice(0, 50), filters, topK });

    // Chú thích: Mock implementation - simple keyword matching
    // Production sẽ dùng embedding similarity từ Vectorize
    const queryLower = query.toLowerCase();

    const scored = MOCK_CHUNKS.map(chunk => {
        const doc = MOCK_DOCUMENTS.find(d => d.id === chunk.documentId);
        if (!doc) return null;

        // Chú thích: Filter by grade nếu có
        if (filters?.grade && doc.grade !== filters.grade) {
            return null;
        }

        // Chú thích: Simple BM25-like scoring (mock)
        const contentLower = chunk.content.toLowerCase();
        const words = queryLower.split(/\s+/);
        let score = 0;
        words.forEach(word => {
            if (contentLower.includes(word)) {
                score += 1;
            }
        });

        return {
            chunk,
            document: doc,
            score,
        };
    }).filter((item): item is RetrievedChunk => item !== null && item.score > 0);

    // Chú thích: Sort by score descending và take top-k
    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, topK);

    console.info('[rag] retrieved', { count: results.length });
    return results;
}

// Chú thích: Build context string từ retrieved chunks
export function buildContextString(chunks: RetrievedChunk[]): string {
    if (chunks.length === 0) return '';

    return chunks.map((item, idx) => {
        return `[${idx + 1}] Nguồn: ${item.document.title}\n${item.chunk.content}`;
    }).join('\n\n');
}

// Chú thích: Retrieve và build context trong 1 call
export async function getRAGContext(
    query: string,
    filters?: RetrieveFilters
): Promise<{ context: string; chunks: RetrievedChunk[] }> {
    const chunks = await retrieveContext(query, filters);
    const context = buildContextString(chunks);
    return { context, chunks };
}
