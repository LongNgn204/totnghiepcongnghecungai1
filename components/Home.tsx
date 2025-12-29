import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import TourGuide from './TourGuide';
import { homeTourSteps } from '../data/tourSteps';
import {
  ArrowRight,
  Cpu,
  Zap,
  Globe,
  Code,
  Bot,
  BookOpen,
  Lightbulb,
  Layers,
  Target,
  Users,
  Award,
  HelpCircle
} from 'lucide-react';

const Home: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('home_tour_seen');
    if (!hasSeenTour && !user) {
      // Show tour after 2 seconds for new users
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleStartLearning = () => {
    if (user) {
      navigate('/san-pham-1');
    } else {
      setShowLoginModal(true);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">

      {/* Fixed Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {['hero', 'vision', 'methodology', 'tech', 'future'].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className="w-3 h-3 rounded-full bg-slate-600 hover:bg-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={`Scroll to ${section}`}
          />
        ))}
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>
      </div>

      {/* SECTION 1: HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-5xl mx-auto w-full text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium animate-fade-in-up">
            <Award size={16} />
            <span>Giáo dục chuẩn 4.0</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight animate-fade-in-up delay-100">
            <span className="block mb-2 sm:mb-3">GIÁO DỤC CÔNG NGHỆ - STEM</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500">
              TƯ DUY KIẾN TẠO THỰC TẾ
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
            Đồng hành cùng Chương trình Giáo dục Phổ thông 2018: Đánh thức tiềm năng, rèn luyện bản lĩnh và trang bị hành trang số cho thế hệ công dân Việt Nam toàn cầu.
          </p>

          {/* Info Box */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl max-w-4xl mx-auto text-left animate-fade-in-up delay-300">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Trong kỷ nguyên AI và tự động hóa, học "thuộc lòng" không còn là chìa khóa. Chúng tôi dạy <strong>cách tư duy</strong>. Tích hợp <strong>S-T-E-M</strong> vào thực tiễn, biến công thức khô khan thành giải pháp đời sống. Chuyển dịch từ "biết kiến thức" sang "làm chủ kiến thức".
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 animate-fade-in-up delay-500">
            <button
              onClick={handleStartLearning}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 sm:gap-3"
            >
              Tìm hiểu Lộ trình <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('vision')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 rounded-lg sm:rounded-xl font-medium text-base sm:text-lg transition-all border border-slate-700/50 backdrop-blur-sm"
            >
              Khám phá thêm
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-10 animate-bounce text-slate-500 cursor-pointer" onClick={() => scrollToSection('vision')}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest">Cuộn xuống</span>
            <ArrowRight size={20} className="rotate-90" />
          </div>
        </div>
      </section>

      {/* SECTION 2: VISION & CONTEXT */}
      <section id="vision" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-2 sm:gap-3 text-orange-400 font-bold text-sm sm:text-lg">
                <Globe size={20} className="sm:w-6 sm:h-6" />
                <span>BỐI CẢNH & TẦM NHÌN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                HÀNH TRÌNH TỪ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  CHỈ THỊ 16 ĐẾN LỚP HỌC 4.0
                </span>
              </h2>
              <div className="prose prose-invert prose-lg text-slate-300">
                <p>
                  Từ Chỉ thị 16/CT-TTg đến Công văn 3089/BGDĐT-GDTrH, STEM không còn là trào lưu mà là yêu cầu bắt buộc. Chúng ta đang chứng kiến cuộc chuyển mình lịch sử của giáo dục Việt Nam.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Nội dung → Năng lực", desc: "Không chỉ học cái gì, mà làm được gì.", icon: Target, color: "text-blue-400", bg: "bg-blue-400/10" },
                  { title: "Đơn môn → Liên môn", desc: "Xóa bỏ rào cản Lý - Hóa - Sinh - Tin.", icon: Layers, color: "text-purple-400", bg: "bg-purple-400/10" },
                  { title: "Lý thuyết → Trải nghiệm", desc: "Sai lầm là một phần của sáng tạo.", icon: Lightbulb, color: "text-orange-400", bg: "bg-orange-400/10" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                    <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-red-500/20 rounded-3xl blur-3xl -z-10"></div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-slate-300">01</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Chỉ thị & Định hướng</h3>
                      <p className="text-slate-400">Nền tảng pháp lý vững chắc từ Chính phủ và Bộ GD&ĐT, tạo đà cho đổi mới căn bản, toàn diện.</p>
                    </div>
                  </div>
                  <div className="w-px h-12 bg-slate-800 ml-6"></div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-slate-300">02</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Lan tỏa Ba Miền</h3>
                      <p className="text-slate-400">Kết nối mạng lưới giáo dục hiện đại từ Hà Nội, Đà Nẵng đến TP.HCM, tạo nên làn sóng đổi mới đồng bộ.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: METHODOLOGY */}
      <section id="methodology" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 z-10 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs sm:text-sm font-medium mb-4">
              <BookOpen size={16} />
              <span>Phương pháp Sư phạm</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              HỌC THỰC CHIẾN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                5E & QUY TRÌNH KỸ THUẬT
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Áp dụng triệt để các phương pháp tiên tiến được Bộ GD&ĐT khuyến nghị.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Project-Based Learning",
                subtitle: "Học qua Dự án",
                desc: "Học sinh đóng vai kỹ sư nhí, giải quyết bài toán thực tế: Lọc nước vùng lũ, Đèn giao thông thông minh.",
                icon: Users,
                color: "text-blue-400",
                border: "border-blue-500/20"
              },
              {
                title: "Mô hình 5E",
                subtitle: "Quy trình khép kín",
                desc: "Gắn kết - Khám phá - Giải thích - Áp dụng - Đánh giá. Giúp kiến thức neo sâu vào tư duy.",
                icon: Zap,
                color: "text-yellow-400",
                border: "border-yellow-500/20"
              },
              {
                title: "Engineering Design",
                subtitle: "Tư duy Kỹ thuật",
                desc: "Hỏi -> Tưởng tượng -> Kế hoạch -> Chế tạo -> Thử nghiệm -> Cải tiến. Tư duy nhà tuyển dụng cần.",
                icon: Cpu,
                color: "text-green-400",
                border: "border-green-500/20"
              }
            ].map((card, idx) => (
              <div key={idx} className={`group bg-slate-800/40 backdrop-blur-sm border ${card.border} p-8 rounded-2xl hover:bg-slate-800/60 transition-all hover:-translate-y-2`}>
                <div className={`w-14 h-14 rounded-xl bg-slate-900/50 flex items-center justify-center ${card.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <card.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                <p className={`text-sm font-medium ${card.color} mb-4`}>{card.subtitle}</p>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex flex-wrap justify-center gap-3">
              {["Nhà chống lũ", "Cầu chịu lực", "Vật liệu tái chế", "Thực tiễn Việt Nam"].map((tag, idx) => (
                <span key={idx} className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TECHNOLOGY */}
      <section id="tech" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"></div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-4 sm:p-6 rounded-lg sm:rounded-2xl flex flex-col items-center justify-center aspect-square text-center group hover:border-red-500/50 transition-colors">
                  <Cpu size={32} className="sm:w-12 sm:h-12 text-red-500 mb-2 sm:mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-white text-sm sm:text-lg">Arduino</h4>
                  <p className="text-xs text-slate-500 mt-1">Phần cứng & Mạch</p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-4 sm:p-6 rounded-lg sm:rounded-2xl flex flex-col items-center justify-center aspect-square text-center group hover:border-blue-500/50 transition-colors sm:mt-8">
                  <Code size={32} className="sm:w-12 sm:h-12 text-blue-500 mb-2 sm:mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-white text-sm sm:text-lg">C++</h4>
                  <p className="text-xs text-slate-500 mt-1">Tư duy Logic</p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-4 sm:p-6 rounded-lg sm:rounded-2xl flex flex-col items-center justify-center aspect-square text-center group hover:border-yellow-500/50 transition-colors sm:-mt-8">
                  <Bot size={32} className="sm:w-12 sm:h-12 text-yellow-500 mb-2 sm:mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-white text-sm sm:text-lg">Python</h4>
                  <p className="text-xs text-slate-500 mt-1">Xử lý dữ liệu AI</p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-4 sm:p-6 rounded-lg sm:rounded-2xl flex flex-col items-center justify-center aspect-square text-center group hover:border-purple-500/50 transition-colors">
                  <Globe size={32} className="sm:w-12 sm:h-12 text-purple-500 mb-2 sm:mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-white text-sm sm:text-lg">IoT</h4>
                  <p className="text-xs text-slate-500 mt-1">Vạn vật kết nối</p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-2 sm:gap-3 text-red-400 font-bold text-sm sm:text-lg">
                <Code size={20} className="sm:w-6 sm:h-6" />
                <span>CÔNG NGHỆ CỐT LÕI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                LÀM CHỦ NGÔN NGỮ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500">
                  MÁY TÍNH & IoT
                </span>
              </h2>
              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-slate-300">
                <div className="pl-4 sm:pl-6 border-l-2 border-red-500/30">
                  <h4 className="text-white font-bold mb-2 text-sm sm:text-base">Phần Cứng (Hardware)</h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                    Bám sát Công nghệ 8 & 10. Sử dụng Arduino/ESP32. Học sinh tự tay xây dựng Smart Home, Robot tránh vật cản, Trạm quan trắc thời tiết. Hiểu sâu về cảm biến và cơ cấu chấp hành.
                  </p>
                </div>
                <div className="pl-4 sm:pl-6 border-l-2 border-blue-500/30">
                  <h4 className="text-white font-bold mb-2 text-sm sm:text-base">Phần Mềm (Software)</h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                    Đón đầu Tin học 10 & 11. Tiếp cận Python - ngôn ngữ số 1 thế giới. Từ thuật toán cơ bản đến giải quyết bài toán thực tế. Biến dòng code thành công cụ quyền năng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FUTURE */}
      <section id="future" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 z-10 bg-gradient-to-b from-slate-900 to-[#0f172a]">
        <div className="max-w-4xl mx-auto w-full text-center space-y-8 sm:space-y-10">
          <div className="inline-block p-3 sm:p-4 rounded-full bg-purple-500/10 text-purple-400 mb-4">
            <Bot size={40} className="sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            CHUẨN BỊ CHO TƯƠNG LAI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              NGHỀ NGHIỆP CHƯA TỒN TẠI
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
            "65% học sinh tiểu học hôm nay sẽ làm những công việc hoàn toàn mới trong tương lai." <br />
            STEM và AI là tấm vé thông hành vào kỷ nguyên số.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            <div className="bg-slate-800/30 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-700/50">
              <h4 className="font-bold text-white mb-2 text-sm sm:text-base">Hiểu bản chất AI</h4>
              <p className="text-xs sm:text-sm text-slate-400">Nắm vững Machine Learning và ứng dụng thực tế.</p>
            </div>
            <div className="bg-slate-800/30 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-700/50">
              <h4 className="font-bold text-white mb-2 text-sm sm:text-base">Đạo đức Công nghệ</h4>
              <p className="text-xs sm:text-sm text-slate-400">Sử dụng công nghệ có trách nhiệm và nhân văn.</p>
            </div>
            <div className="bg-slate-800/30 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-700/50 sm:col-span-2 md:col-span-1">
              <h4 className="font-bold text-white mb-2 text-sm sm:text-base">Tinh thần Việt Nam</h4>
              <p className="text-xs sm:text-sm text-slate-400">Giải quyết thách thức của Việt Nam bằng trí tuệ Việt.</p>
            </div>
          </div>

          <div className="pt-8 sm:pt-12 border-t border-slate-800">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400 italic mb-6 sm:mb-8">
              "Hôm nay là Học sinh - Ngày mai là Nhà kiến tạo."
            </p>
            <button
              onClick={handleStartLearning}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg sm:rounded-full font-bold text-base sm:text-lg md:text-xl transition-all shadow-xl shadow-purple-900/20 transform hover:scale-105"
            >
              Bắt Đầu Hành Trình Ngay
            </button>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Tour Guide */}
      <TourGuide
        steps={homeTourSteps}
        onComplete={() => {
          setShowTour(false);
          localStorage.setItem('home_tour_seen', 'true');
        }}
      />

      {/* Tour Guide Button */}
      {!showTour && (
        <button
          onClick={() => setShowTour(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all hover:scale-105"
          title="Xem hướng dẫn sử dụng"
        >
          <HelpCircle size={20} />
          <span className="hidden sm:inline text-sm font-medium">Hướng dẫn</span>
        </button>
      )}
    </div>
  );
};

export default Home;
