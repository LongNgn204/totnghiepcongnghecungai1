# STEM Vietnam - Trợ Lý Học Tập Thông Minh

STEM Vietnam là nền tảng hỗ trợ học tập môn Công nghệ THPT tích hợp AI tiên tiến, giúp học sinh ôn tập, giải đáp thắc mắc và giáo viên tạo đề thi chất lượng cao dựa trên chương trình Giáo dục phổ thông mới (2018).

![STEM AI Banner](https://placehold.co/1200x300/6d28d9/ffffff?text=STEM+Vietnam+AI)

## 🌟 Tính Năng Chính

*   **🤖 STEMBot AI**: Trợ lý ảo thông minh trả lời câu hỏi, giải bài tập với kiến thức chuẩn xác từ SGK.
*   **📝 Tạo Đề Thi Với AI (RAG)**:
    *   Tự động tạo đề trắc nghiệm, đúng/sai theo cấu trúc thi THPT Quốc gia mới.
    *   **Hybrid RAG**: Kết hợp kiến thức SGK (chính xác) + Google Search (thực tế) + Đề thi mẫu (Style Mimicking).
    *   **Nguồn Minh Bạch**: Hiển thị rõ nguồn trích dẫn từ SGK hay Internet cho từng câu hỏi.
*   **💬 Chat Với Đề Thi**: Hỏi đáp trực tiếp với AI về đề thi vừa tạo để hiểu sâu hơn.
*   **📚 Thư Viện Tài Liệu**: Tích hợp sách giáo khoa, chuyên đề học tập (Cánh Diều, KNTT...) và đề thi mẫu.

## 🏗️ Kiến Trúc Hệ Thống

Hệ thống sử dụng kiến trúc **Serverless** hiện đại trên nền tảng Cloudflare và Google Cloud Vertex AI.

```mermaid
flowchart TD
    User([User: Học sinh / Giáo viên]) -->|Tương tác| Frontend[Frontend: React + Vite]
    
    subgraph "Frontend Layer (Vercel/Static)"
        Frontend -->|Chat / Tạo đề| API_Client[API Client]
    end

    subgraph "Backend Layer (Cloudflare Workers)"
        API_Client -->|POST /api/generate| Worker[Main Worker]
        
        Worker -->|1. Knowledge Retrieval| RAG_SGK{RAG: SGK & Chuyên đề}
        Worker -->|2. Style Retrieval| RAG_Exam{RAG: Đề thi mẫu}
        
        RAG_SGK -->|Query| VectorDB[Cloudflare Vectorize]
        RAG_Exam -->|Query| VectorDB
        
        Worker -->|3. Generation| Gemini[Google Gemini 2.0 Flash]
        Gemini -->|Grounding| GoogleSearch[Google Search Tool]
    end

    subgraph "Data Layer"
        VectorDB -- "Embeddings" --> D1[Cloudflare D1 (SQL)]
        D1 -- "Metadata & Chat History" --> Worker
    end

    Gemini -->|JSON Output| Worker
    Worker -->|Response| Frontend
```

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router.
*   **Backend**: Cloudflare Workers (Hono/Native), Cloudflare Vectorize (Vector DB), Cloudflare D1 (SQL Lite).
*   **AI Model**: Google Gemini 2.0 Flash (via Vertex AI).
*   **RAG**: Hybrid Search (Semantic Retrieval + Keyword Search), Google Search Grounding.

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu
- Node.js 18+
- Tài khoản Cloudflare (để chạy Backend/Wrangler)
- Google Cloud Project (để lấy Vertex AI credentials)

### 1. Clone & Cài Đặt Dependencies

```bash
git clone https://github.com/your-repo/stem-vietnam-v2.git
cd stem-vietnam-v2

# Cài đặt Frontend
npm install

# Cài đặt Backend (Workers)
cd workers
npm install
```

### 2. Cấu Hình Môi Trường (.env)

Tạo file `.env` ở root (Frontend) và `workers/.dev.vars` (Backend).

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8787
```

**Backend (workers/.dev.vars):**
```env
VERTEX_PROJECT_ID=your-project-id
VERTEX_LOCATION=us-central1
# Các biến môi trường khác...
```

### 3. Chạy Local

**Terminal 1 (Backend):**
```bash
cd workers
npx wrangler dev
```

**Terminal 2 (Frontend):**
```bash
# Ở thư mục gốc
npm run dev
```

Truy cập `http://localhost:5173` để trải nghiệm ứng dụng.

## 📂 Cấu Trúc Dự Án

```
stem-vietnam-v2/
├── public/              # Static assets (Books, Exams...)
├── src/
│   ├── components/      # React Components
│   │   ├── chat/        # Chat Interface (ChatPage, Sidebar...)
│   │   ├── forms/       # Exam Generation Forms
│   │   └── ...
│   ├── data/            # Static Data (Library index...)
│   ├── lib/             # Shared Logic (API, RAG Generator...)
│   └── types/           # TypeScript Definitions
├── workers/             # Cloudflare Workers Code
│   ├── src/
│   │   └── index.ts     # Main Worker Logic (API Handlers)
│   └── wrangler.toml    # Worker Configuration
└── README.md            # Tài liệu dự án
```

## 🤝 Đóng Góp

Dự án được phát triển bởi đội ngũ kỹ sư STEM Vietnam. Mọi đóng góp xin vui lòng tạo Pull Request hoặc Issue trên GitHub.

---
© 2026 STEM Vietnam. All rights reserved.
