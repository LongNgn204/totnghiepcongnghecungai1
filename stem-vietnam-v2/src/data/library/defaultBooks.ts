// Chú thích: Danh sách tài liệu mặc định cho Thư viện
// Bao gồm: SGK (3 bộ × 3 lớp) + Chuyên đề + Đề thi mẫu

import type { Document } from '../../types';

// Chú thích: Các bộ sách được Bộ GD&ĐT phê duyệt
export const BOOK_PUBLISHERS = {
    CANH_DIEU: 'Cánh Diều',
    KET_NOI: 'Kết nối tri thức & cuộc sống',
    CHAN_TROI: 'Chân trời sáng tạo',
} as const;

export type BookPublisher = typeof BOOK_PUBLISHERS[keyof typeof BOOK_PUBLISHERS];

// Chú thích: Loại tài liệu
export const DOCUMENT_TYPES = {
    SGK: 'Sách giáo khoa',
    CHUYEN_DE: 'Chuyên đề học tập',
    DE_THI_THPT: 'Đề thi THPT Quốc gia',
    DE_THI_GK: 'Đề thi giữa kỳ mẫu',
    DE_THI_CK: 'Đề thi cuối kỳ mẫu',
} as const;

// ==================== SÁCH GIÁO KHOA ====================
const SGK_DOCUMENTS: Document[] = [
    // === LỚP 10 ===
    {
        id: 'sgk-cn10-canh-dieu',
        title: 'SGK Công nghệ 10 - Cánh Diều',
        grade: '10',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/sgk/cong-nghe-10-canh-dieu.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'sgk-cn10-ket-noi',
        title: 'SGK Công nghệ 10 - Kết nối tri thức',
        grade: '10',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.KET_NOI,
        fileUrl: '/books/sgk/cong-nghe-10-ket-noi-tri-thuc.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'sgk-cn10-chan-troi',
        title: 'SGK Công nghệ 10 - Chân trời sáng tạo',
        grade: '10',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.CHAN_TROI,
        fileUrl: '/books/sgk/cong-nghe-10-chan-troi-sang-tao.pdf',
        createdAt: Date.now(),
    },
    // === LỚP 11 ===
    {
        id: 'sgk-cn11-canh-dieu',
        title: 'SGK Công nghệ 11 - Cánh Diều',
        grade: '11',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/sgk/cong-nghe-11-canh-dieu.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'sgk-cn11-ket-noi',
        title: 'SGK Công nghệ 11 - Kết nối tri thức',
        grade: '11',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.KET_NOI,
        fileUrl: '/books/sgk/cong-nghe-11-ket-noi-tri-thuc.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'sgk-cn11-chan-troi',
        title: 'SGK Công nghệ 11 - Chân trời sáng tạo',
        grade: '11',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.CHAN_TROI,
        fileUrl: '/books/sgk/cong-nghe-11-chan-troi-sang-tao.pdf',
        createdAt: Date.now(),
    },
    // === LỚP 12 ===
    {
        id: 'sgk-cn12-canh-dieu',
        title: 'SGK Công nghệ 12 - Cánh Diều',
        grade: '12',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/sgk/cong-nghe-12-canh-dieu.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'sgk-cn12-ket-noi',
        title: 'SGK Công nghệ 12 - Kết nối tri thức',
        grade: '12',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.KET_NOI,
        fileUrl: '/books/sgk/cong-nghe-12-ket-noi-tri-thuc.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'sgk-cn12-chan-troi',
        title: 'SGK Công nghệ 12 - Chân trời sáng tạo',
        grade: '12',
        topic: 'Công nghiệp',
        source: BOOK_PUBLISHERS.CHAN_TROI,
        fileUrl: '/books/sgk/cong-nghe-12-chan-troi-sang-tao.pdf',
        createdAt: Date.now(),
    },
];

// ==================== CHUYÊN ĐỀ HỌC TẬP ====================
const CHUYEN_DE_DOCUMENTS: Document[] = [
    // === LỚP 10 ===
    {
        id: 'cd-cn10-canh-dieu',
        title: 'Chuyên đề Công nghệ 10 - Cánh Diều',
        grade: '10',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-10-canh-dieu.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn10-ket-noi',
        title: 'Chuyên đề Công nghệ 10 - Kết nối tri thức',
        grade: '10',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.KET_NOI,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-10-ket-noi-tri-thuc.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn10-chan-troi',
        title: 'Chuyên đề Công nghệ 10 - Chân trời sáng tạo',
        grade: '10',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.CHAN_TROI,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-10-chan-troi-sang-tao.pdf',
        createdAt: Date.now(),
    },
    // === LỚP 11 ===
    {
        id: 'cd-cn11-canh-dieu',
        title: 'Chuyên đề Công nghệ 11 - Cánh Diều',
        grade: '11',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-11-canh-dieu.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn11-ket-noi',
        title: 'Chuyên đề Công nghệ 11 - Kết nối tri thức',
        grade: '11',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.KET_NOI,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-11-ket-noi-tri-thuc.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn11-chan-troi',
        title: 'Chuyên đề Công nghệ 11 - Chân trời sáng tạo',
        grade: '11',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.CHAN_TROI,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-11-chan-troi-sang-tao.pdf',
        createdAt: Date.now(),
    },
    // === LỚP 12 ===
    {
        id: 'cd-cn12-canh-dieu',
        title: 'Chuyên đề Công nghệ 12 - Cánh Diều',
        grade: '12',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-12-canh-dieu.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn12-ket-noi',
        title: 'Chuyên đề Công nghệ 12 - Kết nối tri thức',
        grade: '12',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.KET_NOI,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-12-ket-noi-tri-thuc.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn12-chan-troi',
        title: 'Chuyên đề Công nghệ 12 - Chân trời sáng tạo',
        grade: '12',
        topic: 'Chuyên đề',
        source: BOOK_PUBLISHERS.CHAN_TROI,
        fileUrl: '/books/chuyen-de/chuyen-de-cn-12-chan-troi-sang-tao.pdf',
        createdAt: Date.now(),
    },
];

// ==================== ĐỀ THI MẪU ====================
const DE_THI_DOCUMENTS: Document[] = [
    // === ĐỀ THI THPT QUỐC GIA ===
    {
        id: 'de-thpt-2024-cong-nghiep',
        title: 'Đề thi THPT QG 2024 - Công nghệ Công nghiệp',
        grade: '12',
        topic: 'Đề thi THPT',
        source: 'Bộ GD&ĐT',
        fileUrl: '/books/de-thi/thpt-2024-cong-nghiep.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'de-thpt-2024-nong-nghiep',
        title: 'Đề thi THPT QG 2024 - Công nghệ Nông nghiệp',
        grade: '12',
        topic: 'Đề thi THPT',
        source: 'Bộ GD&ĐT',
        fileUrl: '/books/de-thi/thpt-2024-nong-nghiep.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'de-thpt-2023-cong-nghiep',
        title: 'Đề thi THPT QG 2023 - Công nghệ Công nghiệp',
        grade: '12',
        topic: 'Đề thi THPT',
        source: 'Bộ GD&ĐT',
        fileUrl: '/books/de-thi/thpt-2023-cong-nghiep.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'de-thpt-2023-nong-nghiep',
        title: 'Đề thi THPT QG 2023 - Công nghệ Nông nghiệp',
        grade: '12',
        topic: 'Đề thi THPT',
        source: 'Bộ GD&ĐT',
        fileUrl: '/books/de-thi/thpt-2023-nong-nghiep.pdf',
        createdAt: Date.now(),
    },

    // === ĐỀ THI GIỮA KỲ MẪU ===
    {
        id: 'de-gk-lop10-mau',
        title: 'Đề giữa kỳ Công nghệ 10 - Mẫu chuẩn',
        grade: '10',
        topic: 'Đề giữa kỳ mẫu',
        source: 'Mẫu chuẩn',
        fileUrl: '/books/de-thi/giua-ky-lop10-mau.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'de-gk-lop11-mau',
        title: 'Đề giữa kỳ Công nghệ 11 - Mẫu chuẩn',
        grade: '11',
        topic: 'Đề giữa kỳ mẫu',
        source: 'Mẫu chuẩn',
        fileUrl: '/books/de-thi/giua-ky-lop11-mau.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'de-gk-lop12-mau',
        title: 'Đề giữa kỳ Công nghệ 12 - Mẫu chuẩn',
        grade: '12',
        topic: 'Đề giữa kỳ mẫu',
        source: 'Mẫu chuẩn',
        fileUrl: '/books/de-thi/giua-ky-lop12-mau.pdf',
        createdAt: Date.now(),
    },

    // === ĐỀ THI CUỐI KỲ MẪU ===
    {
        id: 'de-ck-lop10-mau',
        title: 'Đề cuối kỳ Công nghệ 10 - Mẫu chuẩn',
        grade: '10',
        topic: 'Đề cuối kỳ mẫu',
        source: 'Mẫu chuẩn',
        fileUrl: '/books/de-thi/cuoi-ky-lop10-mau.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'de-ck-lop11-mau',
        title: 'Đề cuối kỳ Công nghệ 11 - Mẫu chuẩn',
        grade: '11',
        topic: 'Đề cuối kỳ mẫu',
        source: 'Mẫu chuẩn',
        fileUrl: '/books/de-thi/cuoi-ky-lop11-mau.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'de-ck-lop12-mau',
        title: 'Đề cuối kỳ Công nghệ 12 - Mẫu chuẩn',
        grade: '12',
        topic: 'Đề cuối kỳ mẫu',
        source: 'Mẫu chuẩn',
        fileUrl: '/books/de-thi/cuoi-ky-lop12-mau.pdf',
        createdAt: Date.now(),
    },
];

// ==================== TỔNG HỢP ====================
export const DEFAULT_LIBRARY: Document[] = [
    ...SGK_DOCUMENTS,
    ...CHUYEN_DE_DOCUMENTS,
    ...DE_THI_DOCUMENTS,
];

// Chú thích: Helper để lấy tài liệu theo lớp
export function getDocumentsByGrade(grade: '10' | '11' | '12'): Document[] {
    return DEFAULT_LIBRARY.filter(doc => doc.grade === grade);
}

// Chú thích: Helper để lấy tài liệu theo bộ sách
export function getDocumentsByPublisher(publisher: BookPublisher): Document[] {
    return DEFAULT_LIBRARY.filter(doc => doc.source === publisher);
}

// Chú thích: Helper để lấy theo loại
export function getDocumentsByType(type: 'sgk' | 'chuyen_de' | 'de_thi'): Document[] {
    if (type === 'sgk') return SGK_DOCUMENTS;
    if (type === 'chuyen_de') return CHUYEN_DE_DOCUMENTS;
    return DE_THI_DOCUMENTS;
}

// Chú thích: Kiểm tra file PDF có tồn tại không (dùng cho UI)
export async function checkDocumentExists(fileUrl: string): Promise<boolean> {
    try {
        const response = await fetch(fileUrl, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// Chú thích: Thống kê thư viện
export const LIBRARY_STATS = {
    totalSGK: SGK_DOCUMENTS.length,
    totalChuyenDe: CHUYEN_DE_DOCUMENTS.length,
    totalDeThi: DE_THI_DOCUMENTS.length,
    total: DEFAULT_LIBRARY.length,
};
