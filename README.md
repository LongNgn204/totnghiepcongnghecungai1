<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" width="100%" alt="STEM Vietnam Banner" />
  
  # 🚀 STEM Vietnam - AI Learning Platform

  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Gemini](https://img.shields.io/badge/Gemini-2.5_Pro-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

  **Nền tảng học tập thông minh cho học sinh THPT Việt Nam**
  
  Hỗ trợ ôn thi môn **Công nghệ** với AI | Dựa trên SGK **Kết nối tri thức** & **Cánh Diều**

  [Demo](https://stem-vietnam.vercel.app) · [Báo lỗi](https://github.com/LongNgn204/totnghiepcongnghecungai1/issues) · [Đề xuất tính năng](https://github.com/LongNgn204/totnghiepcongnghecungai1/issues)

</div>

---

## ✨ Tính Năng Chính

<table>
<tr>
<td width="50%">

### 🤖 Chat AI Thông Minh
- Trò chuyện với **Gemini 2.5 Pro**
- Upload file PDF, DOCX, hình ảnh
- Trả lời chi tiết với sơ đồ minh họa
- Lưu lịch sử chat tự động
- Export chat ra file

</td>
<td width="50%">

### 📝 Tạo Đề Thi THPT
- **28 câu** đúng format thi THPT Quốc Gia
- 24 câu trắc nghiệm + 4 câu Đúng/Sai
- Phân bố mức độ chuẩn BGD
- Hỗ trợ cả **Công nghiệp** & **Nông nghiệp**
- In đề / Tải PDF

</td>
</tr>
<tr>
<td width="50%">

### 🎴 Flashcards Thông Minh
- Tạo flashcard từ nội dung bất kỳ
- Spaced repetition học hiệu quả
- Đồng bộ đa thiết bị
- Thống kê tiến độ học

</td>
<td width="50%">

### 💻 Coding Lab
- Học lập trình tương tác
- Bài tập từ cơ bản đến nâng cao
- Code editor trực tiếp
- Mô phỏng Arduino

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Zustand |
| **AI/LLM** | Google Gemini 2.5 Pro (via Cloudflare AI Gateway) |
| **Backend** | Cloudflare Workers, D1 Database |
| **Tooling** | Vite 6, Vitest, Playwright, ESLint |
| **Features** | PWA, Offline-first, Real-time Sync |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/LongNgn204/totnghiepcongnghecungai1.git
cd totnghiepcongnghecungai1
npm install
```

### 2. Cấu hình môi trường

```bash
cp .env.local.example .env.local
# Chỉnh sửa .env.local với API keys của bạn
```

### 3. Chạy Development Server

```bash
npm run dev
```

Truy cập: `http://localhost:5173`

### 4. Build Production

```bash
npm run build
npm run preview
```

---

## 📁 Cấu Trúc Project

```
├── components/          # React components (63 files)
│   ├── Home.tsx         # Landing page
│   ├── Product1.tsx     # Chat AI
│   ├── Product2.tsx     # Tạo câu hỏi
│   ├── Product3-4.tsx   # Tạo đề thi
│   ├── CodingLab.tsx    # Coding Lab
│   └── ...
├── utils/               # Utilities (24 files)
│   ├── geminiAPI.ts     # Gemini API client
│   ├── chatStorage.ts   # LocalStorage helper
│   └── ...
├── store/               # Zustand stores
├── workers/             # Cloudflare Workers backend
├── data/                # Static data (lessons, quizzes)
├── hooks/               # Custom React hooks
└── schemas/             # Zod validation schemas
```

---

## 📖 Hướng Dẫn Sử Dụng

### Chat AI (Sản phẩm 1)
1. Vào menu **"Hỏi AI"**
2. Nhập câu hỏi (VD: *"Giải thích động cơ không đồng bộ 3 pha"*)
3. Có thể upload file PDF/DOCX/ảnh để AI phân tích
4. Xem câu trả lời với:
   - Khái niệm, cấu tạo, nguyên lý
   - Công thức toán học (LaTeX)
   - Sơ đồ minh họa
   - YCCĐ theo SGK

### Tạo Đề Thi (Sản phẩm 3-4)
1. Chọn **Công nghiệp** hoặc **Nông nghiệp**
2. Nhấn **"🎯 Tạo Đề Thi THPT"**
3. Chờ AI tạo đề (~30-60 giây)
4. Xem đề thi với **28 câu** chuẩn format
5. **In đề** hoặc **Tải PDF**

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run e2e
```

---

## 🌐 Deployment

### Frontend (Vercel/Cloudflare Pages)

```bash
npm run build
# Deploy thư mục dist/
```

### Backend (Cloudflare Workers)

```bash
cd workers
npm install
npx wrangler deploy
```

Chi tiết: xem [`workers/README.md`](./workers/README.md)

---

## 📞 Liên Hệ & Hỗ Trợ

| | |
|---|---|
| 📧 **Email** | stu725114073@hnue.edu.vn |
| 📱 **Điện thoại** | 0896636181 |
| ⏰ **Giờ hỗ trợ** | T2-T7: 8:00 - 21:00 |

---

## 🤝 Đóng Góp

1. **Fork** repository này
2. Tạo branch mới: `git checkout -b feature/TinhNangMoi`
3. Commit: `git commit -m 'feat: Thêm tính năng XYZ'`
4. Push: `git push origin feature/TinhNangMoi`
5. Tạo **Pull Request**

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích giáo dục.

---

<div align="center">

**Phát triển với ❤️ bởi Nguyễn Hoàng Long**

*Đồ án tốt nghiệp - Trường Đại học Sư phạm Hà Nội*

Powered by **Google Gemini 2.5 Pro** 🤖

</div>
