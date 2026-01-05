// Chú thích: Danh sách tài liệu THỰC TẾ đã có trong public/books
// Cập nhật dựa trên file đã upload - ưu tiên Cánh Diều

import type { Document } from '../../types';

// Chú thích: Các bộ sách được Bộ GD&ĐT phê duyệt
export const BOOK_PUBLISHERS = {
    CANH_DIEU: 'Cánh Diều',
    KET_NOI: 'Kết nối tri thức & cuộc sống',
    CHAN_TROI: 'Chân trời sáng tạo',
    BO_GDDT: 'Bộ GD&ĐT',
} as const;

export type BookPublisher = typeof BOOK_PUBLISHERS[keyof typeof BOOK_PUBLISHERS];

// ==================== VĂN BẢN PHÁP QUY (QUAN TRỌNG NHẤT) ====================
const POLICY_DOCUMENTS: Document[] = [
    {
        id: 'policy-ct-cong-nghe-2018',
        title: 'Chương trình GDPT môn Công nghệ (Thông tư 32/2018)',
        grade: '12', // Áp dụng cho tất cả các lớp
        topic: 'Chương trình',
        source: BOOK_PUBLISHERS.BO_GDDT,
        fileUrl: '/books/15-CT-Cong-nghe-pdf.pdf',
        createdAt: Date.now(),
    },
];

// ==================== SÁCH GIÁO KHOA - CÁNH DIỀU ====================
const SGK_CANH_DIEU: Document[] = [
    // LỚP 10
    {
        id: 'sgk-cn10-thiet-ke-cd',
        title: 'SGK Công nghệ 10 - Thiết kế và Công nghệ (Cánh Diều)',
        grade: '10',
        topic: 'Thiết kế và Công nghệ',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/Công nghệ 10- Thiết kế và công nghệ Cánh diều.pdf',
        createdAt: Date.now(),
    },
    // LỚP 11
    {
        id: 'sgk-cn11-co-khi-cd',
        title: 'SGK Công nghệ 11 - Công nghệ cơ khí (Cánh Diều)',
        grade: '11',
        topic: 'Công nghệ cơ khí',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/Sách giáo khoa Công nghệ 11 – Công nghệ cơ khí (Cánh Diều).pdf',
        createdAt: Date.now(),
    },
    {
        id: 'sgk-cn11-chan-nuoi-cd',
        title: 'SGK Công nghệ 11 - Công nghệ chăn nuôi (Cánh Diều)',
        grade: '11',
        topic: 'Công nghệ chăn nuôi',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/Sách giáo khoa Công nghệ 11 – Công nghệ chăn nuôi (Cánh Diều).pdf',
        createdAt: Date.now(),
    },
];

// ==================== CHUYÊN ĐỀ - CÁNH DIỀU ====================
const CHUYEN_DE_CANH_DIEU: Document[] = [
    // LỚP 10
    {
        id: 'cd-cn10-thiet-ke-cd',
        title: 'Chuyên đề Thiết kế và Công nghệ 10 (Cánh Diều)',
        grade: '10',
        topic: 'Chuyên đề Thiết kế',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/Chuyên đề học tập Thiết kế và Công nghệ 10 - Cánh diều.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn10-trong-trot-cd',
        title: 'Chuyên đề Công nghệ trồng trọt 10 (Cánh Diều)',
        grade: '10',
        topic: 'Chuyên đề Trồng trọt',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/Chuyên đề học tập Công nghệ trồng trọt 10 - Cánh diều.pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn10-trong-trot-2-cd',
        title: 'Chuyên đề học Công nghệ trồng trọt 10 (Cánh Diều) - Bản 2',
        grade: '10',
        topic: 'Chuyên đề Trồng trọt',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: 'https://drive.google.com/file/d/PLACEHOLDER_ID/view?usp=sharing', // Cần cập nhật link Google Drive thực tế
        createdAt: Date.now(),
    },
    // LỚP 11
    {
        id: 'cd-cn11-co-khi-cd',
        title: 'Chuyên đề Công nghệ cơ khí 11 (Cánh Diều)',
        grade: '11',
        topic: 'Chuyên đề Cơ khí',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/Chuyên đề học tập Công nghệ 11 – Công nghệ cơ khí (Cánh Diều).pdf',
        createdAt: Date.now(),
    },
    {
        id: 'cd-cn11-chan-nuoi-cd',
        title: 'Chuyên đề Công nghệ chăn nuôi 11 (Cánh Diều)',
        grade: '11',
        topic: 'Chuyên đề Chăn nuôi',
        source: BOOK_PUBLISHERS.CANH_DIEU,
        fileUrl: '/books/Chuyên đề học tập Công nghệ 11 – Công nghệ chăn nuôi (Cánh Diều).pdf',
        createdAt: Date.now(),
    },
];

// ==================== TỔNG HỢP ====================
// Chú thích: Ưu tiên theo thứ tự: Văn bản pháp quy > SGK > Chuyên đề
export const DEFAULT_LIBRARY: Document[] = [
    ...POLICY_DOCUMENTS,
    ...SGK_CANH_DIEU,
    ...CHUYEN_DE_CANH_DIEU,
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
export function getDocumentsByType(type: 'policy' | 'sgk' | 'chuyen_de'): Document[] {
    if (type === 'policy') return POLICY_DOCUMENTS;
    if (type === 'sgk') return SGK_CANH_DIEU;
    return CHUYEN_DE_CANH_DIEU;
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
    totalPolicy: POLICY_DOCUMENTS.length,
    totalSGK: SGK_CANH_DIEU.length,
    totalChuyenDe: CHUYEN_DE_CANH_DIEU.length,
    total: DEFAULT_LIBRARY.length,
};
