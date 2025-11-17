<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎓 AI Hỗ Trợ Học Tập Công Nghệ - Luyện Thi THPT Quốc Gia

Nền tảng học tập thông minh sử dụng **Google Gemini 2.0 AI** để hỗ trợ học sinh ôn tập và luyện thi tốt nghiệp THPT môn Công nghệ.

Dựa trên **SGK Cánh Diều** - Chương trình GDPT 2018

---

## ✨ Tính Năng Chính

### 🏠 Trang Chủ
- Giới thiệu tổng quan về nền tảng
- Hiển thị 3 sản phẩm chính với mô tả chi tiết
- Công nghệ sử dụng (8 công nghệ hiện đại)
- Thông tin liên hệ và hỗ trợ

### 📚 Sản Phẩm 1: Hệ Thống Hóa Kiến Thức
- ✅ Chat AI thông minh với Gemini 2.0
- ✅ Upload file: PDF, DOCX, hình ảnh
- ✅ Trả lời chi tiết 500-1500 từ với sơ đồ minh họa
- ✅ Markdown rendering đầy đủ
- ✅ Lưu lịch sử chat tự động (LocalStorage)
- ✅ Export chat ra file text
- ✅ Tìm kiếm chat

### ❓ Sản Phẩm 2: Tạo Câu Hỏi Trắc Nghiệm
- ✅ Tự động tạo câu hỏi 4 lựa chọn
- ✅ Tự động tạo câu hỏi Đúng/Sai
- ✅ Phân loại mức độ: Nhận biết, Thông hiểu, Vận dụng
- ✅ Ghi rõ YCCĐ (Yêu cầu cần đạt) theo SGK
- ✅ Hiển thị kết quả bằng Mermaid diagram
- ✅ Tùy chỉnh số lượng câu hỏi

### � Sản Phẩm 3: Tạo Đề Thi THPT
- ✅ 24 câu hỏi đúng format thi THPT Quốc Gia
- ✅ Phân bổ chuẩn: 20 câu MC + 4 câu Đúng/Sai
- ✅ Nội dung: Công nghệ 10-11 (8 câu) + Điện (6 câu) + Điện tử (6 câu) + Đúng/Sai (4 câu)
- ✅ Phân bố mức độ: 42% Nhận biết, 42% Thông hiểu, 16% Vận dụng
- ✅ In đề thi với CSS tối ưu
- ✅ Tải đề thi ra file .txt

---

## 🛠️ Công Nghệ Sử Dụng

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| **Google Gemini AI** | 2.0 Flash Exp | Trí tuệ nhân tạo thế hệ mới nhất |
| **React** | 19.2.0 | Framework JavaScript hiện đại |
| **TypeScript** | Latest | Type-safe JavaScript |
| **Vite** | 6.4.1 | Build tool siêu nhanh |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **React Router** | 7.9.6 | Routing library |
| **Mermaid.js** | 11.12.1 | Tạo diagram & flowchart |
| **LocalStorage** | Web API | Lưu trữ dữ liệu client-side |

---

## 📦 Cài Đặt & Chạy Dự Án

### 1. Clone Repository
```bash
git clone [repository-url]
cd ai-hỗ-trợ-học-tập-công-nghệ-(lớp-6-12)
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình API Key
Tạo file `.env.local` trong thư mục gốc:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

**Lấy API key miễn phí tại:** https://aistudio.google.com/app/apikey

### 4. Chạy Development Server
```bash
npm run dev
```

Truy cập: `http://localhost:3000`

### 5. Build cho Production
```bash
npm run build
```

---

## 📖 Hướng Dẫn Sử Dụng

### 🏠 Trang Chủ
- Xem giới thiệu tổng quan về nền tảng
- Khám phá 3 sản phẩm chính
- Xem công nghệ sử dụng
- Liên hệ hỗ trợ

### 📚 Sản Phẩm 1: Hệ Thống Hóa Kiến Thức
1. Click "Bắt Đầu Chat" hoặc vào menu SP1
2. Nhập câu hỏi (ví dụ: "Giải thích động cơ không đồng bộ 3 pha")
3. (Tùy chọn) Click icon 📎 để upload file PDF/DOCX/hình ảnh
4. Nhấn Enter hoặc nút gửi
5. Xem câu trả lời chi tiết với:
   - Khái niệm, cấu tạo, nguyên lý
   - Công thức toán học
   - Sơ đồ minh họa (text-art)
   - Ví dụ thực tế
   - YCCĐ theo SGK
6. Click "Xuất file" để lưu lịch sử chat

### ❓ Sản Phẩm 2: Tạo Câu Hỏi Trắc Nghiệm
1. Chọn lớp: 10, 11, hoặc 12
2. Nhập chủ đề (ví dụ: "Dòng điện xoay chiều 3 pha")
3. Chọn số lượng câu trắc nghiệm 4 lựa chọn (4-10 câu)
4. Chọn số lượng câu Đúng/Sai (1-5 câu)
5. Nhấn "Tạo Câu Hỏi"
6. Xem kết quả với:
   - Câu hỏi có 4 phương án
   - Đáp án chính xác
   - Mức độ (Nhận biết/Thông hiểu/Vận dụng)
   - YCCĐ theo SGK

### 📝 Sản Phẩm 3: Tạo Đề Thi THPT
1. Click menu SP3 hoặc "Tạo Đề Thi Ngay"
2. Nhấn nút "🎯 Tạo Đề Thi THPT"
3. Chờ AI tạo đề (~30-60 giây)
4. Xem đề thi với 24 câu:
   - Câu 1-8: Công nghệ 10-11
   - Câu 9-14: Công nghệ điện lớp 12
   - Câu 15-20: Công nghệ điện tử lớp 12
   - Câu 21-24: Câu Đúng/Sai
5. Nhấn "🖨️ In Đề Thi" để in
6. Nhấn "💾 Tải Kết Quả" để lưu file .txt

---

## 📁 Cấu Trúc Dự Án

```
📦 ai-hỗ-trợ-học-tập-công-nghệ-(lớp-6-12)
├── 📂 components/
│   ├── 🏠 Home.tsx              # Trang chủ/Landing page
│   ├── 🧭 Header.tsx            # Navigation bar
│   ├── 💬 ChatInterface.tsx     # Chat AI component
│   ├── 📚 Product1.tsx          # Chat wrapper
│   ├── ❓ Product2.tsx          # Question generator
│   ├── 📝 Product3.tsx          # Exam generator
│   ├── 🎴 QuestionCard.tsx      # Question display
│   ├── 📊 MermaidDiagram.tsx    # Diagram renderer
│   └── 👥 MemberTable.tsx       # Team info
├── 📂 utils/
│   ├── 🤖 geminiAPI.ts          # Gemini API functions
│   └── 💾 chatStorage.ts        # LocalStorage helper
├── 📄 types.ts                  # TypeScript definitions
├── 📄 App.tsx                   # Main app + routing
├── 📄 index.tsx                 # Entry point
├── 🎨 index.css                 # Global CSS + markdown styles
├── 🌐 index.html                # HTML template
├── ⚙️ vite.config.ts            # Vite configuration
├── 📝 tsconfig.json             # TypeScript config
├── 📦 package.json              # Dependencies
├── 🔐 .env.local                # API keys (gitignored)
└── 📖 README.md                 # Documentation
```

---

## 🎯 Tính Năng Nổi Bật

### 🤖 AI Thông Minh
- Sử dụng Gemini 2.0 Flash Exp - model AI mới nhất của Google
- Trả lời chi tiết 500-1500 từ
- Hiểu ngữ cảnh và câu hỏi phức tạp
- Hỗ trợ đa phương tiện (text, hình ảnh, PDF)

### 🎨 Giao Diện Đẹp
- Responsive design - hoạt động mượt mà trên mọi thiết bị
- Dark mode support - bảo vệ mắt khi học đêm
- Animation mượt mà với Tailwind CSS
- Icons đẹp từ Font Awesome

### 💾 Lưu Trữ Thông Minh
- LocalStorage - không cần server
- Tự động lưu lịch sử chat
- Export dữ liệu ra file text
- Không giới hạn số lượng chat

### 📊 Markdown & Diagram
- Render markdown đầy đủ (heading, bold, code, list, table)
- Syntax highlighting cho code blocks
- Mermaid diagram cho flowchart
- CSS tối ưu cho in ấn

---

## 🎓 Mục Tiêu Giáo Dục

1. **Hỗ trợ học sinh:**
   - Giải đáp thắc mắc 24/7
   - Luyện tập với ngân hàng câu hỏi phong phú
   - Làm quen với format đề thi THPT

2. **Hỗ trợ giáo viên:**
   - Tạo câu hỏi nhanh chóng
   - Tạo đề thi chuẩn format
   - Tiết kiệm thời gian biên soạn

3. **Tuân thủ chương trình:**
   - Bám sát SGK Cánh Diều
   - Theo GDPT 2018
   - Đúng format thi THPT Quốc Gia

---

## 📞 Liên Hệ & Hỗ Trợ

### 📧 Email
**longhngn.hnue@gmail.com**

### 📱 Zalo / Điện thoại
**0896636181**

### ⏰ Giờ Hỗ Trợ
- **8:00 - 22:00** hàng ngày
- Phản hồi trong vòng **24 giờ**

### 💬 Các Vấn Đề Được Hỗ Trợ
- ✅ Cài đặt và cấu hình
- ✅ Lỗi kỹ thuật
- ✅ Hướng dẫn sử dụng
- ✅ Đề xuất tính năng mới
- ✅ Báo cáo lỗi nội dung

---

## 🤝 Đóng Góp

Chúng tôi rất hoan nghênh mọi đóng góp! Để đóng góp:

1. **Fork** repository này
2. Tạo **branch mới**: `git checkout -b feature/TinhNangMoi`
3. **Commit** thay đổi: `git commit -m 'Thêm tính năng XYZ'`
4. **Push** lên branch: `git push origin feature/TinhNangMoi`
5. Tạo **Pull Request**

---

## 📄 License

**MIT License** - Tự do sử dụng cho mục đích giáo dục

---

## 🌟 Lời Kết

> "Học tập không còn là gánh nặng khi có AI đồng hành!" 

**Chúc các em học tập hiệu quả và đạt điểm cao trong kỳ thi THPT Quốc Gia! 🎓✨**

---

*Phát triển với ❤️ bởi đội ngũ AI Education*  
*Powered by Google Gemini 2.0 AI 🤖*
