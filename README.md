# STEM Vietnam - Nền Tảng Học Tập Thông Minh Với AI

**Đồ án tốt nghiệp** - Trường Đại học Sư phạm Hà Nội

Nền tảng hỗ trợ học sinh THPT ôn thi môn **Công nghệ** với AI, dựa trên chương trình SGK **Kết nối tri thức** và **Cánh Diều**.

---

## Mục Lục

1. [Giới thiệu](#giới-thiệu)
2. [Tính năng](#tính-năng)  
3. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
4. [Luồng hoạt động](#luồng-hoạt-động)
5. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
6. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
7. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
8. [Triển khai](#triển-khai)
9. [Liên hệ](#liên-hệ)

---

## Giới Thiệu

STEM Vietnam là ứng dụng web hỗ trợ học tập thông minh, tích hợp AI (Google Gemini 2.5 Pro) để:
- Chat hỏi đáp kiến thức môn Công nghệ
- Tạo đề thi THPT Quốc Gia tự động (28 câu chuẩn format)
- Flashcards học từ vựng thông minh với Spaced Repetition
- Coding Lab học lập trình cơ bản

---

## Tính Năng

### 1. Chat AI Thông Minh (Product 1)
- Hỏi đáp kiến thức với Gemini 2.5 Pro
- Upload file PDF, DOCX, hình ảnh để AI phân tích
- Trả lời có công thức LaTeX, sơ đồ Mermaid
- Lưu lịch sử chat, export ra file

### 2. Tạo Câu Hỏi (Product 2)
- Tạo câu hỏi trắc nghiệm theo chủ đề
- Phân loại theo mức độ nhận thức (Nhớ, Hiểu, Vận dụng, Vận dụng cao)
- Hỗ trợ bài giảng Công nghiệp và Nông nghiệp

### 3. Tạo Đề Thi THPT (Product 3-4)
- 28 câu đúng format thi THPT Quốc Gia
- 24 câu trắc nghiệm 4 lựa chọn
- 4 câu Đúng/Sai (mỗi câu 4 ý a-d)
- Phân bố mức độ chuẩn Bộ Giáo dục
- In đề hoặc tải PDF

### 4. Flashcards (Product 5)
- Tạo flashcard từ nội dung tùy ý
- Thuật toán Spaced Repetition SM-2
- Đồng bộ đa thiết bị qua cloud
- Thống kê tiến độ học tập

### 5. Bộ Đề Luyện Tập (Product 6)
- Bộ đề có sẵn để luyện tập
- Chấm điểm tự động
- Lưu lịch sử làm bài

### 6. Tổng Hợp Bài Giảng (Product 7)
- Tài liệu học tập theo chương trình SGK
- Phân loại theo lớp và môn học

### 7. Coding Lab (Product 8)
- Học lập trình tương tác
- Bài tập từ cơ bản đến nâng cao
- Code editor trực tiếp trong trình duyệt
- Mô phỏng Arduino

---

## Kiến Trúc Hệ Thống

```mermaid
flowchart TB
    subgraph Client["CLIENT (Browser)"]
        React["React 19 + TypeScript"]
        Zustand["Zustand State"]
        PWA["PWA + Service Worker"]
        LocalStorage["LocalStorage / IndexedDB"]
    end

    subgraph CDN["CLOUDFLARE"]
        Pages["Cloudflare Pages"]
        Workers["Cloudflare Workers"]
        D1["D1 Database (SQLite)"]
        AIGateway["AI Gateway"]
    end

    subgraph External["EXTERNAL SERVICES"]
        Gemini["Google Gemini 2.5 Pro"]
    end

    React --> Zustand
    React --> PWA
    PWA --> LocalStorage
    React --> Pages
    Pages --> Workers
    Workers --> D1
    Workers --> AIGateway
    AIGateway --> Gemini
```

### Mô tả các thành phần

| Thành phần | Vai trò |
|------------|---------|
| React + TypeScript | Frontend SPA, render UI |
| Zustand | State management nhẹ |
| PWA + Service Worker | Offline-first, caching |
| Cloudflare Pages | Hosting static files |
| Cloudflare Workers | Serverless API backend |
| D1 Database | SQLite database trên edge |
| AI Gateway | Proxy và cache API calls tới Gemini |
| Gemini 2.5 Pro | LLM xử lý ngôn ngữ tự nhiên |

---

## Luồng Hoạt Động

### Luồng Đăng Ký / Đăng Nhập

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Workers as Cloudflare Workers
    participant D1 as D1 Database

    User->>Frontend: Nhập thông tin đăng ký
    Frontend->>Workers: POST /api/auth/register
    Workers->>Workers: Hash password (bcrypt)
    Workers->>D1: INSERT INTO auth_users
    D1-->>Workers: Success
    Workers->>Workers: Tạo JWT token
    Workers-->>Frontend: Return token + user data
    Frontend->>Frontend: Lưu token vào localStorage
    Frontend-->>User: Chuyển đến Dashboard
```

### Luồng Chat AI

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Workers as Cloudflare Workers
    participant Gateway as AI Gateway
    participant Gemini

    User->>Frontend: Nhập câu hỏi
    Frontend->>Workers: POST /api/ai/chat
    Workers->>Workers: Xác thực token
    Workers->>Gateway: Forward request
    Gateway->>Gemini: Generate content
    Gemini-->>Gateway: Response (streaming)
    Gateway-->>Workers: Response
    Workers-->>Frontend: Return AI response
    Frontend->>Frontend: Render Markdown + LaTeX
    Frontend-->>User: Hiển thị câu trả lời
```

### Luồng Tạo Đề Thi

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Gemini

    User->>Frontend: Chọn môn + nhấn Tạo Đề
    Frontend->>Frontend: Xây dựng prompt template
    Frontend->>Gemini: Gọi API với prompt chi tiết
    Gemini-->>Frontend: JSON 28 câu hỏi
    Frontend->>Frontend: Parse và validate
    Frontend->>Frontend: Render đề thi
    Frontend-->>User: Hiển thị đề thi
    User->>Frontend: Nhấn In / Tải PDF
    Frontend->>Frontend: Generate PDF (html2canvas + jsPDF)
    Frontend-->>User: Download file PDF
```

### Luồng Sync Dữ Liệu

```mermaid
sequenceDiagram
    participant Client
    participant ServiceWorker as Service Worker
    participant Workers as Cloudflare Workers
    participant D1 as D1 Database

    Client->>Client: Lưu local (IndexedDB)
    Client->>ServiceWorker: Register sync event
    
    alt Online
        ServiceWorker->>Workers: POST /api/sync
        Workers->>D1: Upsert data
        D1-->>Workers: Success
        Workers-->>ServiceWorker: Sync complete
        ServiceWorker-->>Client: Update UI
    else Offline
        ServiceWorker->>ServiceWorker: Queue for later
        Note over ServiceWorker: Retry when online
    end
```

---

## Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 19.2 | UI library |
| TypeScript | 5.8 | Static typing |
| Vite | 6.4 | Build tool |
| Tailwind CSS | 3.4 | Styling |
| Zustand | 5.0 | State management |
| React Router | 7.1 | Routing |
| Zod | 3.24 | Schema validation |

### Backend
| Công nghệ | Mục đích |
|-----------|----------|
| Cloudflare Workers | Serverless runtime |
| D1 Database | SQLite on edge |
| itty-router | Lightweight router |
| bcryptjs | Password hashing |

### AI/LLM
| Công nghệ | Mục đích |
|-----------|----------|
| Google Gemini 2.5 Pro | LLM chính |
| Cloudflare AI Gateway | Proxy + caching |

### Tooling
| Công nghệ | Mục đích |
|-----------|----------|
| Vitest | Unit testing |
| Playwright | E2E testing |
| ESLint | Linting |
| Wrangler | Cloudflare CLI |

---

## Cấu Trúc Thư Mục

```
totnghiepcongnghecungai1/
|
|-- components/              # React components (64 files)
|   |-- Home.tsx             # Landing page
|   |-- Product1.tsx         # Chat AI
|   |-- Product2.tsx         # Tạo câu hỏi
|   |-- Product3.tsx         # Đề thi Công nghiệp
|   |-- Product4.tsx         # Đề thi Nông nghiệp
|   |-- Product5.tsx         # Flashcards
|   |-- Product6.tsx         # Bộ đề luyện tập
|   |-- Product7.tsx         # Bài giảng
|   |-- Product8.tsx         # Coding Lab
|   |-- CodingLab.tsx        # Code editor
|   |-- Dashboard.tsx        # Trang chủ user
|   |-- LoginModal.tsx       # Modal đăng nhập/đăng ký
|   |-- auth/                # Authentication components
|   `-- ...
|
|-- contexts/                # React contexts
|   `-- AuthContext.tsx      # Authentication state
|
|-- utils/                   # Utilities (28 files)
|   |-- geminiAPI.ts         # Gemini API client
|   |-- chatStorage.ts       # Chat persistence
|   |-- tokenManager.ts      # JWT management
|   |-- syncManager.ts       # Data sync
|   |-- pwaUtils.ts          # PWA helpers
|   `-- ...
|
|-- store/                   # Zustand stores
|   |-- chatStore.ts         # Chat state
|   |-- examStore.ts         # Exam state
|   `-- ...
|
|-- schemas/                 # Zod schemas
|   |-- form.ts              # Form validation
|   `-- ...
|
|-- workers/                 # Cloudflare Workers backend
|   |-- src/
|   |   |-- index.ts         # API routes
|   |   |-- auth-service.ts  # Authentication logic
|   |   `-- utils.ts         # Helpers
|   |-- wrangler.toml        # Workers config
|   |-- full_schema.sql      # Database schema
|   `-- ...
|
|-- data/                    # Static data
|   |-- lessons.ts           # Lesson content
|   `-- quizzes.ts           # Quiz data
|
|-- public/                  # Static assets
|   |-- service-worker.js    # PWA service worker
|   |-- manifest.json        # PWA manifest
|   `-- ...
|
|-- App.tsx                  # Root component
|-- index.tsx                # Entry point
|-- vite.config.ts           # Vite configuration
`-- package.json             # Dependencies
```

---

## Hướng Dẫn Cài Đặt

### Yêu cầu
- Node.js 18 trở lên
- npm hoặc pnpm
- Tài khoản Cloudflare (cho backend)
- Google AI API Key (cho Gemini)

### 1. Clone repository

```bash
git clone https://github.com/LongNgn204/totnghiepcongnghecungai1.git
cd totnghiepcongnghecungai1
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

```bash
cp .env.local.example .env.local
```

Chỉnh sửa file `.env.local`:

```env
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_API_URL=http://localhost:8787
```

### 4. Chạy Development Server

```bash
# Frontend
npm run dev

# Backend (trong terminal khác)
cd workers
npm install
npx wrangler dev
```

Truy cập: http://localhost:5173

### 5. Chạy Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run e2e
```

---

## Triển Khai

### Frontend (Cloudflare Pages)

```bash
npm run build
# Deploy thư mục dist/ lên Cloudflare Pages
```

Hoặc kết nối repository với Cloudflare Pages để tự động deploy khi push.

### Backend (Cloudflare Workers)

```bash
cd workers
npm install

# Tạo database D1
npx wrangler d1 create ai-hoc-tap-db

# Chạy migration
npx wrangler d1 execute ai-hoc-tap-db --remote --file=full_schema.sql

# Deploy
npx wrangler deploy
```

### Biến môi trường trên Cloudflare

Thiết lập trong Cloudflare Dashboard:
- `GEMINI_API_KEY`: API key của Google Gemini
- `ALLOWED_ORIGINS`: Domain được phép truy cập API

---

## Database Schema

```mermaid
erDiagram
    auth_users ||--o{ auth_sessions : has
    auth_users ||--o{ exams : creates
    auth_users ||--o{ flashcard_decks : owns
    auth_users ||--o{ chat_sessions : has
    auth_users ||--o{ study_sessions : tracks
    flashcard_decks ||--o{ flashcards : contains

    auth_users {
        text id PK
        text username UK
        text email UK
        text password_hash
        text display_name
        text security_question
        text security_answer_hash
        integer created_at
        integer is_admin
    }

    auth_sessions {
        text id PK
        text user_id FK
        text token UK
        integer expires_at
    }

    exams {
        text id PK
        text user_id FK
        text title
        text category
        text questions
        real score
        integer completed_at
    }

    flashcard_decks {
        text id PK
        text user_id FK
        text title
        text category
        integer created_at
    }

    flashcards {
        text id PK
        text deck_id FK
        text question
        text answer
        real ease_factor
        integer interval
    }

    chat_sessions {
        text id PK
        text user_id FK
        text title
        text messages
        integer created_at
    }

    study_sessions {
        text id PK
        text user_id FK
        text activity
        integer duration
        integer session_date
    }
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/register | Đăng ký tài khoản |
| POST | /api/auth/login | Đăng nhập |
| POST | /api/auth/logout | Đăng xuất |
| GET | /api/auth/me | Lấy thông tin user |
| PUT | /api/auth/profile | Cập nhật profile |

### Data APIs
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/exams | Lấy danh sách đề thi |
| POST | /api/exams | Lưu đề thi mới |
| GET | /api/flashcards/decks | Lấy bộ flashcard |
| POST | /api/flashcards/decks | Tạo bộ flashcard |
| GET | /api/chat/sessions | Lấy lịch sử chat |
| POST | /api/sync | Đồng bộ dữ liệu |

### AI APIs
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/ai/chat | Chat với AI |
| POST | /api/ai/generate | Tạo nội dung |

---

## Liên Hệ

| Thông tin | |
|-----------|---|
| Tác giả | Nguyễn Hoàng Long |
| Email | stu725114073@hnue.edu.vn |
| Điện thoại | 0896636181 |
| Trường | Đại học Sư phạm Hà Nội |
| Chuyên ngành | Công nghệ thông tin |

---

## License

MIT License - Tự do sử dụng cho mục đích giáo dục.

---

Phát triển bởi **Nguyễn Hoàng Long** - Đồ án tốt nghiệp ĐHSP Hà Nội 2025
