export const homeTourSteps = [
  {
    id: 'hero-section',
    title: '🎯 Chào mừng đến STEM Vietnam',
    description: 'Đây là trang chủ của chúng tôi. Nơi bạn sẽ khám phá nền tảng học tập AI tiên tiến nhất Việt Nam.',
    target: '#hero',
    position: 'bottom' as const,
  },
  {
    id: 'vision-section',
    title: '🌍 Tầm nhìn & Bối cảnh',
    description: 'Chúng tôi đang thực hiện cuộc chuyển mình lịch sử của giáo dục Việt Nam, từ Chỉ thị 16 đến lớp học 4.0.',
    target: '#vision',
    position: 'bottom' as const,
  },
  {
    id: 'methodology-section',
    title: '📚 Phương pháp sư phạm',
    description: 'Sử dụng mô hình 5E và quy trình kỹ thuật - phương pháp được Bộ GD&ĐT khuyến nghị.',
    target: '#methodology',
    position: 'bottom' as const,
  },
  {
    id: 'tech-section',
    title: '💻 Công nghệ cốt lõi',
    description: 'Học tập Arduino, C++, Python, IoT - những công nghệ sẽ định hình tương lai.',
    target: '#tech',
    position: 'bottom' as const,
  },
  {
    id: 'future-section',
    title: '[object Object]huẩn bị cho tương lai',
    description: 'Hôm nay là học sinh, ngày mai là nhà kiến tạo. Bắt đầu hành trình của bạn ngay bây giờ!',
    target: '#future',
    position: 'bottom' as const,
  },
];

export const dashboardTourSteps = [
  {
    id: 'dashboard-header',
    title: '[object Object]ảng điều khiển',
    description: 'Xem tổng quan về tiến độ học tập của bạn với các biểu đồ chi tiết.',
    target: 'main',
    position: 'bottom' as const,
  },
  {
    id: 'stats-cards',
    title: '📈 Thống kê nhanh',
    description: 'Xem số liệu thống kê về các hoạt động học tập của bạn.',
    target: '[data-tour="stats"]',
    position: 'bottom' as const,
  },
  {
    id: 'charts',
    title: '📉 Biểu đồ tiến độ',
    description: 'Theo dõi tiến độ học tập theo thời gian với các biểu đồ tương tác.',
    target: '[data-tour="charts"]',
    position: 'bottom' as const,
  },
];

export const product1TourSteps = [
  {
    id: 'chat-header',
    title: '💬 Chat với AI',
    description: 'Đây là công cụ chat AI 24/7 của chúng tôi. Hỏi bất kỳ câu hỏi gì về học tập!',
    target: '[data-tour="chat-input"]',
    position: 'top' as const,
  },
  {
    id: 'chat-history',
    title: '📜 Lịch sử cuộc trò chuyện',
    description: 'Xem lại các cuộc trò chuyện trước đó của bạn.',
    target: '[data-tour="chat-history"]',
    position: 'right' as const,
  },
  {
    id: 'file-upload',
    title: '📎 Tải lên tài liệu',
    description: 'Bạn có thể tải lên PDF, ảnh hoặc tài liệu khác để AI phân tích.',
    target: '[data-tour="file-upload"]',
    position: 'top' as const,
  },
  {
    id: 'model-selection',
    title: '🤖 Chọn mô hình AI',
    description: 'Chọn giữa Gemini 2.5 Pro (mạnh mẽ) hoặc Flash (nhanh).',
    target: '[data-tour="model-select"]',
    position: 'bottom' as const,
  },
];

export const product2TourSteps = [
  {
    id: 'exam-generator',
    title: '✏️ Tạo đề thi tự động',
    description: 'Nhập chủ đề và AI sẽ tạo ra một bộ đề thi hoàn chỉnh cho bạn.',
    target: '[data-tour="exam-generator"]',
    position: 'bottom' as const,
  },
  {
    id: 'question-types',
    title: '❓ Loại câu hỏi',
    description: 'Chọn loại câu hỏi: trắc nghiệm, tự luận, hoặc kết hợp.',
    target: '[data-tour="question-types"]',
    position: 'bottom' as const,
  },
  {
    id: 'difficulty-level',
    title: '⭐ Mức độ khó',
    description: 'Điều chỉnh mức độ khó của đề thi theo nhu cầu của bạn.',
    target: '[data-tour="difficulty"]',
    position: 'bottom' as const,
  },
  {
    id: 'exam-preview',
    title: '👁️ Xem trước đề thi',
    description: 'Xem trước đề thi trước khi làm bài.',
    target: '[data-tour="exam-preview"]',
    position: 'top' as const,
  },
];

export const flashcardsTourSteps = [
  {
    id: 'flashcard-deck',
    title: '🎴 Bộ thẻ ghi nhớ',
    description: 'Tạo và quản lý các bộ thẻ ghi nhớ để ôn tập hiệu quả.',
    target: '[data-tour="flashcard-deck"]',
    position: 'bottom' as const,
  },
  {
    id: 'flashcard-study',
    title: '📖 Học thẻ ghi nhớ',
    description: 'Học từng thẻ một, theo dõi tiến độ và cải thiện kỹ năng ghi nhớ.',
    target: '[data-tour="flashcard-study"]',
    position: 'bottom' as const,
  },
  {
    id: 'flashcard-stats',
    title: '📊 Thống kê học tập',
    description: 'Xem thống kê chi tiết về tiến độ học tập của bạn.',
    target: '[data-tour="flashcard-stats"]',
    position: 'bottom' as const,
  },
];

export const leaderboardTourSteps = [
  {
    id: 'leaderboard-ranking',
    title: '[object Object]ảng xếp hạng',
    description: 'Xem xếp hạng của bạn so với các học sinh khác.',
    target: '[data-tour="leaderboard"]',
    position: 'bottom' as const,
  },
  {
    id: 'leaderboard-filters',
    title: '🔍 Lọc xếp hạng',
    description: 'Lọc xếp hạng theo lớp, môn học hoặc thời gian.',
    target: '[data-tour="filters"]',
    position: 'bottom' as const,
  },
];

export const profileTourSteps = [
  {
    id: 'profile-info',
    title: '👤 Thông tin cá nhân',
    description: 'Xem và chỉnh sửa thông tin hồ sơ của bạn.',
    target: '[data-tour="profile-info"]',
    position: 'bottom' as const,
  },
  {
    id: 'profile-stats',
    title: '📊 Thống kê cá nhân',
    description: 'Xem tổng quan về hoạt động học tập của bạn.',
    target: '[data-tour="profile-stats"]',
    position: 'bottom' as const,
  },
  {
    id: 'profile-settings',
    title: '⚙️ Cài đặt',
    description: 'Quản lý cài đặt tài khoản và tùy chọn cá nhân.',
    target: '[data-tour="profile-settings"]',
    position: 'bottom' as const,
  },
];

