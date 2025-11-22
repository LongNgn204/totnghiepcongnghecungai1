import React, { useState } from 'react';

interface Book {
    id: string;
    title: string;
    cover: string;
    link: string;
    grade: number;
    publisher: string;
}

const booksData: Book[] = [
    // Lớp 10
    {
        id: '10-1',
        title: "Công nghệ 10 - Nông nghiệp",
        cover: "https://www.hoc10.vn/storage/images/2022/03/29/cong-nghe-10-nong-nghiep-bia-sach-624268e390978.png",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-10-nong-nghiep/1/731/-/1/",
        grade: 10,
        publisher: "Cánh Diều"
    },
    {
        id: '10-2',
        title: "Công nghệ 10 - Thiết kế và Công nghệ",
        cover: "https://www.hoc10.vn/storage/images/2022/03/29/cong-nghe-10-thiet-ke-va-cong-nghe-bia-sach-624268f742323.png",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-10-thiet-ke-va-cong-nghe/1/732/-/1/",
        grade: 10,
        publisher: "Cánh Diều"
    },
    {
        id: '10-3',
        title: "Chuyên đề học tập Công nghệ 10 - Nông nghiệp",
        cover: "https://www.hoc10.vn/storage/images/2022/03/29/chuyen-de-hoc-tap-cong-nghe-10-nong-nghiep-bia-sach-6242690a2a472.png",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-10-nong-nghiep/1/733/-/1/",
        grade: 10,
        publisher: "Cánh Diều"
    },
    {
        id: '10-4',
        title: "Chuyên đề học tập Công nghệ 10 - Thiết kế và Công nghệ",
        cover: "https://www.hoc10.vn/storage/images/2022/03/29/chuyen-de-hoc-tap-cong-nghe-10-thiet-ke-va-cong-nghe-bia-sach-6242691e20436.png",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-10-thiet-ke-va-cong-nghe/1/734/-/1/",
        grade: 10,
        publisher: "Cánh Diều"
    },
    // Lớp 11
    {
        id: '11-1',
        title: "Công nghệ 11 - Cơ khí",
        cover: "https://www.hoc10.vn/storage/images/2023/03/23/cong-nghe-11-co-khi-bia-sach-641bce7670731.png",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-11-co-khi/1/736/-/1/",
        grade: 11,
        publisher: "Cánh Diều"
    },
    {
        id: '11-2',
        title: "Công nghệ 11 - Chăn nuôi",
        cover: "https://www.hoc10.vn/storage/images/2023/03/23/cong-nghe-11-chan-nuoi-bia-sach-641bce8b7d41f.png",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-11-chan-nuoi/1/737/-/1/",
        grade: 11,
        publisher: "Cánh Diều"
    },
    {
        id: '11-3',
        title: "Chuyên đề học tập Công nghệ 11 - Cơ khí",
        cover: "https://www.hoc10.vn/storage/images/2023/03/23/chuyen-de-hoc-tap-cong-nghe-11-co-khi-bia-sach-641bcea06322e.png",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-11-co-khi/1/738/-/1/",
        grade: 11,
        publisher: "Cánh Diều"
    },
    {
        id: '11-4',
        title: "Chuyên đề học tập Công nghệ 11 - Chăn nuôi",
        cover: "https://www.hoc10.vn/storage/images/2023/03/23/chuyen-de-hoc-tap-cong-nghe-11-chan-nuoi-bia-sach-641bceb3c3755.png",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-11-chan-nuoi/1/739/-/1/",
        grade: 11,
        publisher: "Cánh Diều"
    },
    // Lớp 12
    {
        id: '12-1',
        title: "Công nghệ 12 - CN Điện - Điện tử",
        cover: "https://www.hoc10.vn/storage/images/2024/03/18/cong-nghe-12-cn-dien-dien-tu-bia-sach-65f7c32b509f6.png",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-12-cn-dien-dien-tu/1/735/-/1/",
        grade: 12,
        publisher: "Cánh Diều"
    },
    {
        id: '12-2',
        title: "Công nghệ 12 - CN Cơ khí",
        cover: "https://www.hoc10.vn/storage/images/2024/03/18/cong-nghe-12-cn-co-khi-bia-sach-65f7c34b68146.png",
        link: "https://www.hoc10.vn/doc-sach/cong-nghe-12-cn-co-khi/1/740/-/1/",
        grade: 12,
        publisher: "Cánh Diều"
    },
    {
        id: '12-3',
        title: "Chuyên đề học tập Công nghệ 12 - CN Điện - Điện tử",
        cover: "https://www.hoc10.vn/storage/images/2024/03/18/chuyen-de-hoc-tap-cong-nghe-12-cn-dien-dien-tu-bia-sach-65f7c374665a3.png",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-12-cn-dien-dien-tu/1/741/-/1/",
        grade: 12,
        publisher: "Cánh Diều"
    },
    {
        id: '12-4',
        title: "Chuyên đề học tập Công nghệ 12 - CN Cơ khí",
        cover: "https://www.hoc10.vn/storage/images/2024/03/18/chuyen-de-hoc-tap-cong-nghe-12-cn-co-khi-bia-sach-65f7c38c9c049.png",
        link: "https://www.hoc10.vn/doc-sach/chuyen-de-hoc-tap-cong-nghe-12-cn-co-khi/1/742/-/1/",
        grade: 12,
        publisher: "Cánh Diều"
    }
];

const Product8: React.FC = () => {
    const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
    const [previewBook, setPreviewBook] = useState<Book | null>(null);

    const filteredBooks = selectedGrade === 'all'
        ? booksData
        : booksData.filter(book => book.grade === selectedGrade);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <span className="text-9xl">📚</span>
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-3 flex items-center justify-center gap-3">
                        <span>📚</span>
                        Tủ sách học liệu số
                    </h2>
                    <p className="text-center text-amber-100 max-w-2xl mx-auto text-lg">
                        Kho sách giáo khoa điện tử chính thống từ bộ sách Cánh Diều
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex justify-center gap-4">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 10, label: 'Lớp 10' },
                    { id: 11, label: 'Lớp 11' },
                    { id: 12, label: 'Lớp 12' }
                ].map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedGrade(filter.id as number | 'all')}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${selectedGrade === filter.id
                            ? 'bg-amber-600 text-white shadow-md transform scale-105'
                            : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Bookshelf Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
                {filteredBooks.map(book => (
                    <div
                        key={book.id}
                        className="group relative bg-white rounded-r-lg rounded-l-sm shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 perspective-1000"
                    >
                        {/* Book Spine Effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-gray-800 to-gray-600 rounded-l-sm z-10"></div>

                        <div className="p-4 pl-6 h-full flex flex-col">
                            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-inner">
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                                    <button
                                        onClick={() => setPreviewBook(book)}
                                        className="bg-white text-amber-700 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-amber-50 transform hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <span>📖</span> Đọc ngay
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-800 line-clamp-2 mb-1 flex-grow" title={book.title}>
                                {book.title}
                            </h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                    {book.publisher}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">
                                    Lớp {book.grade}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {previewBook && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
                    <div className="bg-white p-4 flex justify-between items-center shadow-md">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            <span>📖</span>
                            {previewBook.title}
                        </h3>
                        <div className="flex items-center gap-3">
                            <a
                                href={previewBook.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 text-sm"
                            >
                                <span>🔗</span> Mở tab mới
                            </a>
                            <button
                                onClick={() => setPreviewBook(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <span className="text-2xl">❌</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-100 relative">
                        <iframe
                            src={previewBook.link}
                            className="w-full h-full border-0"
                            title={previewBook.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        {/* Fallback message if iframe is blocked */}
                        <div className="absolute inset-0 -z-10 flex items-center justify-center">
                            <div className="text-center p-8 max-w-md">
                                <div className="text-6xl mb-4">🔒</div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Không thể tải bản xem trước</h4>
                                <p className="text-gray-600 mb-6">
                                    Trang web này có thể chặn hiển thị trong ứng dụng. Vui lòng mở trong tab mới để đọc sách.
                                </p>
                                <a
                                    href={previewBook.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <span>🚀</span> Mở sách ngay
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product8;
