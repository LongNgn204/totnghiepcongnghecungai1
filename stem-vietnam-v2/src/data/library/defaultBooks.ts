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

// ==================== KHO TÀI LIỆU TỔNG HỢP (GOOGLE DRIVE) ====================
const MASTER_LIBRARY: Document[] = [
    {
        id: 'master-drive-link',
        title: 'KHO TÀI LIỆU CÔNG NGHỆ THPT (SGK, Chuyên đề, Sách GV)',
        grade: '12', // Hiển thị ở mọi lớp
        topic: 'Thư viện tổng hợp',
        source: BOOK_PUBLISHERS.BO_GDDT,
        fileUrl: 'https://drive.google.com/drive/folders/1EMT1HMKsmyA2yoSbDQGnOQ93YwX5J4i_?usp=sharing', // Cần cập nhật link thực tế
        createdAt: Date.now(),
    }
];

// ==================== TỔNG HỢP ====================
export const DEFAULT_LIBRARY: Document[] = [
    ...MASTER_LIBRARY
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
export function getDocumentsByType(_type: 'policy' | 'sgk' | 'chuyen_de'): Document[] {
    return DEFAULT_LIBRARY;
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
    totalPolicy: 0,
    totalSGK: 0,
    totalChuyenDe: 0,
    total: DEFAULT_LIBRARY.length,
};
