// Chú thích: Cloudflare Vectorize client cho RAG pipeline
// Sử dụng Vertex AI Text Embeddings để tạo embeddings

import { getAccessToken, type VertexAICredentials } from './gcp-auth';

// Chú thích: Interface cho Vectorize record
export interface VectorRecord {
    id: string;
    values: number[];
    metadata: {
        bookId: string;
        title: string;
        grade: string;
        subject: 'cong_nghiep' | 'nong_nghiep';
        type: 'sgk' | 'chuyen_de' | 'de_mau';
        chapter?: string;
        section?: string;
        page?: number;
        content: string; // Text content để hiển thị
    };
}

// Chú thích: Interface cho search result
export interface SearchResult {
    id: string;
    score: number;
    metadata: VectorRecord['metadata'];
}

// Chú thích: Tạo embedding từ text sử dụng Vertex AI
export async function createEmbedding(
    credentials: VertexAICredentials,
    text: string
): Promise<number[]> {
    const accessToken = await getAccessToken(credentials);

    // Chú thích: Vertex AI Text Embeddings endpoint
    const endpoint = `https://${credentials.location}-aiplatform.googleapis.com/v1/projects/${credentials.projectId}/locations/${credentials.location}/publishers/google/models/text-embedding-005:predict`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instances: [{ content: text }],
            parameters: {
                outputDimensionality: 768, // Phải match với Vectorize index
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Embedding error: ${response.status} - ${error}`);
    }

    const data = await response.json() as {
        predictions: Array<{ embeddings: { values: number[] } }>;
    };

    return data.predictions[0].embeddings.values;
}

// Chú thích: Batch tạo embeddings (tiết kiệm API calls)
export async function createEmbeddingsBatch(
    credentials: VertexAICredentials,
    texts: string[]
): Promise<number[][]> {
    const accessToken = await getAccessToken(credentials);

    const endpoint = `https://${credentials.location}-aiplatform.googleapis.com/v1/projects/${credentials.projectId}/locations/${credentials.location}/publishers/google/models/text-embedding-005:predict`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            instances: texts.map(text => ({ content: text })),
            parameters: {
                outputDimensionality: 768,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Batch embedding error: ${response.status} - ${error}`);
    }

    const data = await response.json() as {
        predictions: Array<{ embeddings: { values: number[] } }>;
    };

    return data.predictions.map(p => p.embeddings.values);
}

// Chú thích: Insert vectors vào Vectorize index
export async function insertVectors(
    vectorize: VectorizeIndex,
    records: VectorRecord[]
): Promise<{ inserted: number }> {
    // Chú thích: Cloudflare Vectorize insert API
    const vectors = records.map(record => ({
        id: record.id,
        values: record.values,
        metadata: record.metadata,
    }));

    const result = await vectorize.insert(vectors);

    console.log('[vectorize] inserted', { count: result.count });
    return { inserted: result.count };
}

// Chú thích: Search vectors với filters
export async function searchVectors(
    vectorize: VectorizeIndex,
    credentials: VertexAICredentials,
    query: string,
    filters?: {
        grade?: string;
        subject?: string;
        type?: string;
    },
    topK: number = 5
): Promise<SearchResult[]> {
    // Chú thích: Step 1 - Tạo embedding cho query
    const queryVector = await createEmbedding(credentials, query);

    // Chú thích: Step 2 - Build filter object cho Vectorize
    const filterObj: Record<string, string> = {};
    if (filters?.grade) filterObj.grade = filters.grade;
    if (filters?.subject) filterObj.subject = filters.subject;
    if (filters?.type) filterObj.type = filters.type;

    // Chú thích: Step 3 - Query Vectorize
    const results = await vectorize.query(queryVector, {
        topK,
        filter: Object.keys(filterObj).length > 0 ? filterObj : undefined,
        returnMetadata: 'all',
    });

    console.log('[vectorize] search done', {
        query: query.slice(0, 50),
        matches: results.matches.length,
    });

    // Chú thích: Step 4 - Transform results
    return results.matches.map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata as VectorRecord['metadata'],
    }));
}

// Chú thích: Delete vectors by IDs
export async function deleteVectors(
    vectorize: VectorizeIndex,
    ids: string[]
): Promise<{ deleted: number }> {
    const result = await vectorize.deleteByIds(ids);
    console.log('[vectorize] deleted', { count: result.count });
    return { deleted: result.count };
}

// Chú thích: Get vector by ID
export async function getVector(
    vectorize: VectorizeIndex,
    id: string
): Promise<VectorRecord | null> {
    const result = await vectorize.getByIds([id]);
    if (result.length === 0) return null;

    const record = result[0];
    return {
        id: record.id,
        // Chú thích: Convert VectorFloatArray to number[]
        values: Array.from(record.values),
        metadata: record.metadata as VectorRecord['metadata'],
    };
}

// Chú thích: Build context string từ search results
export function buildContextFromResults(results: SearchResult[]): string {
    if (results.length === 0) return '';

    return results.map((result, index) => {
        const meta = result.metadata;
        const source = `[${meta.title}${meta.chapter ? ` - ${meta.chapter}` : ''}]`;
        return `--- Nguồn ${index + 1}: ${source} (relevance: ${(result.score * 100).toFixed(1)}%) ---\n${meta.content}`;
    }).join('\n\n');
}
