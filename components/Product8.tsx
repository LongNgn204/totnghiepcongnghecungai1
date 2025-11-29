import React, { useState, useMemo } from 'react';
import ProductTemplate from './layout/ProductTemplate';
import { BookOpen, GraduationCap, Filter, Sparkles, Shuffle, ExternalLink, List, CheckCircle, PlayCircle, ChevronRight, ChevronDown } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  grade: number;
  cover: string;
  link: string;
  description: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "45 phút"
  isCompleted?: boolean;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface GradeCurriculum {
  grade: number;
  title: string;
  chapters: Chapter[];
}

const booksData: Book[] = [
  {
    id: 1,
    title: "Công nghệ 10 - Thiết kế và Công nghệ",
    grade: 10,
    cover: "https://hoc10.vn/upload/sgk/canh-dieu/lop-10/cong-nghe-10-thiet-ke-va-cong-nghe/SHS/bia.jpg",
    link: "https://hoc10.vn/doc-sach/cong-nghe-10-thiet-ke-va-cong-nghe/1/0/63",
    description: "Sách giáo khoa Công nghệ 10 - Bộ Cánh Diều"
  },
  {
    id: 2,
    title: "Công nghệ 10 - Công nghệ trồng trọt",
    grade: 10,
    cover: "https://hoc10.vn/upload/sgk/canh-dieu/lop-10/cong-nghe-10-cong-nghe-trong-trot/SHS/bia.jpg",
    link: "https://hoc10.vn/doc-sach/cong-nghe-10-cong-nghe-trong-trot/1/0/64",
    description: "Sách giáo khoa Công nghệ 10 - Bộ Cánh Diều"
  },
  {
    id: 3,
    title: "Công nghệ 11 - Công nghệ cơ khí",
    grade: 11,
    cover: "https://hoc10.vn/upload/sgk/canh-dieu/lop-11/cong-nghe-11-cong-nghe-co-khi/SHS/bia.jpg",
    link: "https://hoc10.vn/doc-sach/cong-nghe-11-cong-nghe-co-khi/1/0/132",
    description: "Sách giáo khoa Công nghệ 11 - Bộ Cánh Diều"
  },
  {
    id: 4,
    title: "Công nghệ 11 - Công nghệ chăn nuôi",
    grade: 11,
    cover: "https://hoc10.vn/upload/sgk/canh-dieu/lop-11/cong-nghe-11-cong-nghe-chan-nuoi/SHS/bia.jpg",
    link: "https://hoc10.vn/doc-sach/cong-nghe-11-cong-nghe-chan-nuoi/1/0/133",
    description: "Sách giáo khoa Công nghệ 11 - Bộ Cánh Diều"
  },
  {
    id: 5,
    title: "Công nghệ 12 - Công nghệ điện - điện tử",
    grade: 12,
    cover: "https://hoc10.vn/upload/sgk/canh-dieu/lop-12/cong-nghe-12-cong-nghe-dien-dien-tu/SHS/bia.jpg",
    link: "https://hoc10.vn/doc-sach/cong-nghe-12-cong-nghe-dien-dien-tu/1/0/188",
    description: "Sách giáo khoa Công nghệ 12 - Bộ Cánh Diều"
  },
  {
    id: 6,
    title: "Công nghệ 12 - Lâm nghiệp và Thủy sản",
    grade: 12,
    cover: "https://hoc10.vn/upload/sgk/canh-dieu/lop-12/cong-nghe-12-lam-nghiep-va-thuy-san/SHS/bia.jpg",
    link: "https://hoc10.vn/doc-sach/cong-nghe-12-lam-nghiep-va-thuy-san/1/0/189",
    description: "Sách giáo khoa Công nghệ 12 - Bộ Cánh Diều"
  }
];

const curriculumData: GradeCurriculum[] = [
  {
    grade: 12,
    title: "Công nghệ Điện - Điện tử & Lâm nghiệp Thủy sản",
    chapters: [
      {
        id: "c1",
        title: "Chương 1: Giới thiệu về kĩ thuật điện",
        lessons: [
          { id: "l1", duration: "45 phút", title: "Bài 1: Khái quát về kĩ thuật điện" },
          { id: "l2", duration: "45 phút", title: "Bài 2: Một số ngành nghề trong lĩnh vực kĩ thuật điện" }
        ]
      },
      {
        id: "c2",
        title: "Chương 2: Hệ thống điện quốc gia",
        lessons: [
          { id: "l3", duration: "45 phút", title: "Bài 3: Mạng điện hạ áp dùng trong sinh hoạt" },
          { id: "l4", duration: "45 phút", title: "Bài 4: An toàn điện" }
        ]
      },
      {
        id: "c3",
        title: "Chương 3: Điện tử căn bản",
        lessons: [
          { id: "l5", duration: "45 phút", title: "Bài 5: Linh kiện điện tử thụ động" },
          { id: "l6", duration: "45 phút", title: "Bài 6: Linh kiện bán dẫn" },
          { id: "l7", duration: "45 phút", title: "Bài 7: Khuếch đại thuật toán và IC" }
        ]
      }
    ]
  },
  {
    grade: 11,
    title: "Công nghệ Cơ khí & Chăn nuôi",
    chapters: [
      {
        id: "c11_1",
        title: "Chương 1: Giới thiệu về cơ khí động lực",
        lessons: [
          { id: "l11_1", duration: "45 phút", title: "Bài 1: Khái quát về cơ khí động lực" },
          { id: "l11_2", duration: "45 phút", title: "Bài 2: Một số ngành nghề liên quan" }
        ]
      },
      {
        id: "c11_2",
        title: "Chương 2: Động cơ đốt trong",
        lessons: [
          { id: "l11_3", duration: "45 phút", title: "Bài 3: Nguyên lí làm việc của động cơ đốt trong" },
          { id: "l11_4", duration: "45 phút", title: "Bài 4: Các cơ cấu và hệ thống chính" }
        ]
      }
    ]
  },
  {
    grade: 10,
    title: "Thiết kế & Công nghệ Trồng trọt",
    chapters: [
      {
        id: "c10_1",
        title: "Chương 1: Đại cương về công nghệ",
        lessons: [
          { id: "l10_1", duration: "45 phút", title: "Bài 1: Công nghệ và đời sống" },
          { id: "l10_2", duration: "45 phút", title: "Bài 2: Hệ thống kĩ thuật" }
        ]
      },
      {
        id: "c10_2",
        title: "Chương 2: Vẽ kĩ thuật",
        lessons: [
          { id: "l10_3", duration: "45 phút", title: "Bài 3: Tiêu chuẩn trình bày bản vẽ" },
          { id: "l10_4", duration: "45 phút", title: "Bài 4: Hình chiếu vuông góc" }
        ]
      }
    ]
  }
];

const Product8: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'curriculum'>('curriculum');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['c1', 'c11_1', 'c10_1']);

  const filteredBooks = selectedGrade === 'all'
    ? booksData
    : booksData.filter(book => book.grade === selectedGrade);

  const filteredCurriculum = selectedGrade === 'all'
    ? curriculumData
    : curriculumData.filter(c => c.grade === selectedGrade);

  const totalBooks = booksData.length;
  const gradeBreakdown = useMemo(() => {
    return [10, 11, 12].map(grade => ({
      grade,
      count: booksData.filter(book => book.grade === grade).length
    }));
  }, []);

  const randomPreview = () => {
    const pool = filteredBooks.length ? filteredBooks : booksData;
    const randomBook = pool[Math.floor(Math.random() * pool.length)];
    setPreviewBook(randomBook);
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const sidebarContent = (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-600" />
          Thống kê nhanh
        </h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span>Tổng số sách</span>
            <span className="font-bold text-gray-900 dark:text-white">{totalBooks}</span>
          </div>
          {gradeBreakdown.map(({ grade, count }) => (
            <div key={grade} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span>Lớp {grade}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{count} cuốn</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 space-y-3">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Hành động nhanh
        </h4>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`w-full py-2.5 rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'curriculum' ? 'btn-primary' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}
        >
          <List className="w-4 h-4" />
          Xem lộ trình
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`w-full py-2.5 rounded-xl font-semibold shadow-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'books' ? 'btn-primary' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}
        >
          <BookOpen className="w-4 h-4" />
          Đọc sách
        </button>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-amber-500">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-amber-600" />
          Gợi ý sử dụng
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
          Kết hợp xem lộ trình học tập và đọc sách giáo khoa để nắm vững kiến thức nền tảng trước khi luyện đề.
        </p>
      </div>
    </div>
  );

  return (
    <ProductTemplate
      icon={<GraduationCap className="w-28 h-28 text-white/40" />}
      title="Sản phẩm học tập số 8: Chương trình học & Tủ sách số"
      subtitle="Lộ trình học tập chi tiết và kho SGK Cánh Diều điện tử — Đầy đủ cho lớp 10, 11, 12"
      heroGradientFrom="from-amber-600"
      heroGradientTo="to-orange-600"
      sidebar={sidebarContent}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'curriculum'
                ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                }`}
            >
              Lộ trình học
            </button>
            <button
              onClick={() => setActiveTab('books')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'books'
                ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                }`}
            >
              Tủ sách SGK
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedGrade === 'all'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                }`}
            >
              Tất cả
            </button>
            {[10, 11, 12].map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedGrade === grade
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                  }`}
              >
                Lớp {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'curriculum' ? (
          <div className="space-y-8 animate-fade-in">
            {filteredCurriculum.map((curr) => (
              <div key={curr.grade} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{curr.grade}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Chương trình Công nghệ {curr.grade}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{curr.title}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {curr.chapters.map(chapter => (
                    <div key={chapter.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="font-bold text-gray-800 dark:text-gray-200">{chapter.title}</span>
                        {expandedChapters.includes(chapter.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>

                      {expandedChapters.includes(chapter.id) && (
                        <div className="bg-white dark:bg-gray-900/50 divide-y divide-gray-100 dark:divide-gray-800">
                          {chapter.lessons.map(lesson => (
                            <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer">
                              <div className="flex items-center gap-3">
                                <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-400">{lesson.duration}</p>
                                </div>
                              </div>
                              <button className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                Học ngay
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-6xl mx-auto animate-fade-in">
            {filteredBooks.map(book => (
              <div
                key={book.id}
                className="group glass-card p-4 flex items-center gap-6 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300"
              >
                <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                      Lớp {book.grade}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                      Cánh Diều
                    </span>
                  </div>
                  <h3
                    className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer"
                    onClick={() => window.open(book.link, '_blank')}
                  >
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{book.description}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPreviewBook(book)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-sm hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" /> Đọc ngay
                    </button>
                    <button
                      onClick={() => window.open(book.link, '_blank')}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-amber-600 hover:border-amber-600 transition-all"
                      title="Mở trong tab mới"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {previewBook && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
            <div className="bg-white dark:bg-gray-900 p-4 flex justify-between items-center shadow-md border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{previewBook.title}</h3>
                <span className="px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                  Đang đọc thử
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.open(previewBook.link, '_blank')}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Mở trang gốc
                </button>
                <button
                  onClick={() => setPreviewBook(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 relative">
              <iframe
                src={previewBook.link}
                className="w-full h-full border-none"
                title={previewBook.title}
              />
            </div>
          </div>
        )}
      </div>
    </ProductTemplate>
  );
};

export default Product8;
