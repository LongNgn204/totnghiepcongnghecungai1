import type { RetrievedChunk, Document, DocumentChunk } from '../../types';

// Chú thích: Mock data cho development - mở rộng với nội dung SGK thực tế
// Production sẽ dùng Vector DB (Cloudflare Vectorize) với embeddings từ PDF
const MOCK_DOCUMENTS: Document[] = [
    {
        id: 'doc-cn11-cd',
        title: 'SGK Công nghệ 11 - Cánh Diều',
        grade: '11',
        topic: 'Mạng máy tính',
        source: 'Cánh Diều',
        fileUrl: '',
        createdAt: Date.now(),
    },
    {
        id: 'doc-cn10-kntt',
        title: 'SGK Công nghệ 10 - Kết nối tri thức',
        grade: '10',
        topic: 'Đại cương',
        source: 'Kết nối tri thức',
        fileUrl: '',
        createdAt: Date.now(),
    },
    {
        id: 'doc-cn12-cd',
        title: 'SGK Công nghệ 12 - Cánh Diều',
        grade: '12',
        topic: 'Lập trình',
        source: 'Cánh Diều',
        fileUrl: '',
        createdAt: Date.now(),
    },
];

const MOCK_CHUNKS: DocumentChunk[] = [
    // ==================== MẠNG MÁY TÍNH (Lớp 11) ====================
    {
        id: 'chunk-1',
        documentId: 'doc-cn11-cd',
        content: 'Mạng máy tính là tập hợp các máy tính được kết nối với nhau thông qua các đường truyền vật lý theo một kiến trúc nhất định. Mạng máy tính cho phép chia sẻ tài nguyên (máy in, ổ đĩa, dữ liệu) và trao đổi thông tin giữa các máy tính với nhau.',
        chunkIndex: 0,
    },
    {
        id: 'chunk-2',
        documentId: 'doc-cn11-cd',
        content: 'Phân loại mạng theo phạm vi địa lý: LAN (Local Area Network) - mạng cục bộ, phạm vi trong một tòa nhà hoặc cơ quan. WAN (Wide Area Network) - mạng diện rộng, kết nối các LAN ở xa nhau. MAN (Metropolitan Area Network) - mạng đô thị, phạm vi một thành phố.',
        chunkIndex: 1,
    },
    {
        id: 'chunk-3',
        documentId: 'doc-cn11-cd',
        content: 'Giao thức mạng TCP/IP gồm 4 tầng: Tầng liên kết (Network Interface) - xử lý kết nối vật lý. Tầng mạng (Internet) - định tuyến gói tin bằng địa chỉ IP. Tầng vận chuyển (Transport) - đảm bảo truyền dữ liệu (TCP/UDP). Tầng ứng dụng (Application) - giao tiếp với người dùng (HTTP, FTP, SMTP).',
        chunkIndex: 2,
    },
    {
        id: 'chunk-4',
        documentId: 'doc-cn11-cd',
        content: 'Địa chỉ IP (Internet Protocol) là địa chỉ logic dùng để nhận diện thiết bị trên mạng. IPv4 có 32 bit, chia thành 4 octet (VD: 192.168.1.1). IPv6 có 128 bit để giải quyết vấn đề cạn kiệt địa chỉ IPv4.',
        chunkIndex: 3,
    },
    {
        id: 'chunk-5',
        documentId: 'doc-cn11-cd',
        content: 'Router (bộ định tuyến) là thiết bị kết nối các mạng khác nhau, định tuyến gói tin giữa các mạng. Switch (bộ chuyển mạch) kết nối các thiết bị trong cùng một mạng LAN, chuyển khung dữ liệu dựa trên địa chỉ MAC.',
        chunkIndex: 4,
    },
    {
        id: 'chunk-6',
        documentId: 'doc-cn11-cd',
        content: 'Hub là thiết bị kết nối trong mạng LAN, hoạt động ở tầng vật lý. Hub gửi dữ liệu đến tất cả các cổng, trong khi Switch chỉ gửi đến cổng đích. Do đó Switch hiệu quả hơn Hub.',
        chunkIndex: 5,
    },
    {
        id: 'chunk-7',
        documentId: 'doc-cn11-cd',
        content: 'Mô hình OSI có 7 tầng: Physical (Vật lý), Data Link (Liên kết dữ liệu), Network (Mạng), Transport (Vận chuyển), Session (Phiên), Presentation (Trình bày), Application (Ứng dụng). Mô hình TCP/IP đơn giản hơn với 4 tầng.',
        chunkIndex: 6,
    },
    {
        id: 'chunk-8',
        documentId: 'doc-cn11-cd',
        content: 'DNS (Domain Name System) là hệ thống phân giải tên miền, chuyển đổi tên miền (www.google.com) thành địa chỉ IP (142.250.204.36). DHCP (Dynamic Host Configuration Protocol) tự động cấp phát địa chỉ IP cho các thiết bị trong mạng.',
        chunkIndex: 7,
    },
    // ==================== ĐẠI CƯƠNG VỀ MÁY TÍNH (Lớp 10) ====================
    {
        id: 'chunk-9',
        documentId: 'doc-cn10-kntt',
        content: 'Máy tính là thiết bị điện tử có khả năng xử lý thông tin theo chương trình được lập sẵn. Máy tính gồm 2 phần: Phần cứng (Hardware) là các bộ phận vật lý. Phần mềm (Software) là các chương trình điều khiển.',
        chunkIndex: 0,
    },
    {
        id: 'chunk-10',
        documentId: 'doc-cn10-kntt',
        content: 'Bộ xử lý trung tâm CPU (Central Processing Unit) là "bộ não" của máy tính, thực hiện các phép tính và điều khiển hoạt động. CPU gồm 3 bộ phận: CU (Control Unit) - điều khiển, ALU (Arithmetic Logic Unit) - tính toán, Registers - thanh ghi.',
        chunkIndex: 1,
    },
    {
        id: 'chunk-11',
        documentId: 'doc-cn10-kntt',
        content: 'RAM (Random Access Memory) là bộ nhớ truy cập ngẫu nhiên, lưu trữ tạm thời dữ liệu khi máy tính hoạt động. ROM (Read Only Memory) là bộ nhớ chỉ đọc, chứa chương trình khởi động BIOS. Khi tắt máy, dữ liệu trên RAM sẽ mất.',
        chunkIndex: 2,
    },
    {
        id: 'chunk-12',
        documentId: 'doc-cn10-kntt',
        content: 'Thiết bị nhập gồm: bàn phím (keyboard), chuột (mouse), máy quét (scanner), microphone. Thiết bị xuất gồm: màn hình (monitor), máy in (printer), loa (speaker). Thiết bị lưu trữ: ổ cứng HDD/SSD, USB, thẻ nhớ.',
        chunkIndex: 3,
    },
    {
        id: 'chunk-13',
        documentId: 'doc-cn10-kntt',
        content: 'Hệ điều hành (Operating System) là phần mềm quản lý tài nguyên máy tính và cung cấp giao diện cho người dùng. Các hệ điều hành phổ biến: Windows, macOS, Linux, Android, iOS.',
        chunkIndex: 4,
    },
    // ==================== LẬP TRÌNH CƠ BẢN (Lớp 12) ====================
    {
        id: 'chunk-14',
        documentId: 'doc-cn12-cd',
        content: 'Thuật toán là dãy hữu hạn các thao tác được sắp xếp theo trình tự xác định để giải quyết một bài toán. Thuật toán phải có: tính xác định (mỗi bước rõ ràng), tính dừng (kết thúc sau hữu hạn bước), tính đúng đắn.',
        chunkIndex: 0,
    },
    {
        id: 'chunk-15',
        documentId: 'doc-cn12-cd',
        content: 'Cấu trúc điều khiển trong lập trình: Tuần tự (sequential) - thực hiện lần lượt. Rẽ nhánh (selection) - if/else, switch. Lặp (iteration) - for, while, do-while. Ba cấu trúc này đủ để xây dựng mọi thuật toán.',
        chunkIndex: 1,
    },
    {
        id: 'chunk-16',
        documentId: 'doc-cn12-cd',
        content: 'Biến là vùng nhớ dùng để lưu trữ dữ liệu trong chương trình. Kiểu dữ liệu cơ bản: số nguyên (int), số thực (float/double), ký tự (char), logic (boolean). Hằng là giá trị không thay đổi trong suốt chương trình.',
        chunkIndex: 2,
    },
    {
        id: 'chunk-17',
        documentId: 'doc-cn12-cd',
        content: 'Mảng (Array) là kiểu dữ liệu lưu trữ nhiều phần tử cùng kiểu trong bộ nhớ liên tiếp. Truy cập phần tử qua chỉ số (index), bắt đầu từ 0. Mảng 1 chiều và mảng 2 chiều (ma trận) là phổ biến nhất.',
        chunkIndex: 3,
    },
    {
        id: 'chunk-18',
        documentId: 'doc-cn12-cd',
        content: 'Hàm (Function) là khối mã thực hiện một nhiệm vụ cụ thể, có thể tái sử dụng. Hàm có thể nhận tham số (parameters) và trả về kết quả (return value). Chia chương trình thành các hàm giúp code dễ đọc và bảo trì.',
        chunkIndex: 4,
    },
    {
        id: 'chunk-19',
        documentId: 'doc-cn12-cd',
        content: 'Cơ sở dữ liệu (Database) là tập hợp dữ liệu có tổ chức, lưu trữ và quản lý bằng hệ quản trị CSDL (DBMS). SQL (Structured Query Language) là ngôn ngữ truy vấn chuẩn: SELECT, INSERT, UPDATE, DELETE.',
        chunkIndex: 5,
    },
    {
        id: 'chunk-20',
        documentId: 'doc-cn12-cd',
        content: 'An toàn thông tin bao gồm: Bảo mật (Confidentiality) - chỉ người được phép mới truy cập. Toàn vẹn (Integrity) - dữ liệu không bị sửa đổi trái phép. Sẵn sàng (Availability) - hệ thống luôn hoạt động khi cần.',
        chunkIndex: 6,
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
