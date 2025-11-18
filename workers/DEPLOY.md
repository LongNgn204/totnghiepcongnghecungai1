# 🚀 HƯỚNG DẪN TRIỂN KHAI BACKEND CLOUDFLARE WORKERS

## 📋 Tổng quan
Backend sử dụng Cloudflare Workers + D1 Database để lưu trữ:
- Đề thi và kết quả làm bài
- Flashcard decks và cards
- Chat sessions với AI
- Progress tracking và leaderboard
- Study groups và collaborative features

## 🔧 Bước 1: Cài đặt Dependencies

```bash
cd workers
npm install
```

## 🗄️ Bước 2: Tạo D1 Database

```bash
npm run db:create
```

Lệnh này sẽ tạo database và trả về `database_id`. Copy ID này!

## ⚙️ Bước 3: Cập nhật wrangler.toml

Mở file `workers/wrangler.toml` và thay thế `database_id`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "ai-hoc-tap-db"
database_id = "<PASTE_DATABASE_ID_HERE>"
```

## 🏗️ Bước 4: Khởi tạo Database Schema

```bash
npm run db:init
```

Lệnh này sẽ tạo tất cả các bảng và indexes trong D1 database.

## 🔑 Bước 5: Thêm Gemini API Key (Tùy chọn)

Nếu bạn muốn sử dụng AI features trong backend:

```bash
npx wrangler secret put GEMINI_API_KEY
# Nhập API key khi được hỏi
```

## 🧪 Bước 6: Test Local (Tùy chọn)

```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:8787

Test endpoints:
- GET http://localhost:8787/api/health
- POST http://localhost:8787/api/users/register

## 🚀 Bước 7: Deploy lên Cloudflare

```bash
npm run deploy
```

Sau khi deploy thành công, bạn sẽ nhận được URL Workers:
```
https://ai-hoc-tap-api.YOUR-ACCOUNT.workers.dev
```

## 🔗 Bước 8: Cập nhật Frontend

Mở file `.env.local` ở root project và cập nhật:

```bash
VITE_API_URL=https://ai-hoc-tap-api.YOUR-ACCOUNT.workers.dev
```

## ✅ Bước 9: Test Integration

1. Restart dev server:
```bash
npm run dev
```

2. Mở browser và vào http://localhost:5173

3. Kiểm tra SyncStatus widget (góc dưới bên phải)

4. Click "Đồng bộ ngay" để test sync

5. Vào Settings → Đồng bộ để cấu hình

## 📊 Kiểm tra Database

Xem dữ liệu trong D1:

```bash
cd workers
npx wrangler d1 execute ai-hoc-tap-db --command "SELECT * FROM users LIMIT 10"
npx wrangler d1 execute ai-hoc-tap-db --command "SELECT * FROM exams LIMIT 10"
```

## 🔄 Cập nhật Backend

Sau khi sửa code trong `workers/src/`:

```bash
cd workers
npm run deploy
```

Không cần restart frontend, Workers sẽ update ngay lập tức.

## 🐛 Troubleshooting

### Lỗi: "database_id not found"
→ Kiểm tra lại `wrangler.toml` đã cập nhật `database_id` chưa

### Lỗi: "Authorization required"
→ Chạy `npx wrangler login` để đăng nhập Cloudflare

### Lỗi: CORS
→ Kiểm tra `workers/src/utils.ts` đã có CORS headers

### Frontend không sync được
→ Kiểm tra `.env.local` có đúng `VITE_API_URL`
→ Restart dev server sau khi sửa .env

## 📝 API Endpoints

Tất cả các endpoints có trong `workers/README.txt`:

- **Users**: `/api/users/register`, `/api/users/me`
- **Exams**: `/api/exams`, `/api/exams/:id`, `/api/exams/stats`
- **Flashcards**: `/api/flashcards/decks`, `/api/flashcards/cards`
- **Chat**: `/api/chat/sessions`
- **Progress**: `/api/progress/sessions`, `/api/progress/stats`
- **Leaderboard**: `/api/leaderboard`

## 🔒 Authentication

Hiện tại sử dụng `X-User-ID` header đơn giản:
- Frontend tự động generate UUID và lưu trong localStorage
- Mỗi request gửi kèm header `X-User-ID`
- Backend auto-create user nếu chưa tồn tại

**Nâng cấp sau** (tùy chọn):
- Tích hợp Firebase Auth
- OAuth với Google/Facebook
- JWT tokens

## 💰 Chi phí

Cloudflare Workers Free tier:
- ✅ 100,000 requests/day
- ✅ D1: 5GB storage
- ✅ 10 million read rows/day
- ✅ 100,000 write rows/day

→ **Hoàn toàn đủ cho mục đích học tập!**

## 📚 Tài liệu tham khảo

- Cloudflare Workers: https://developers.cloudflare.com/workers/
- D1 Database: https://developers.cloudflare.com/d1/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

## 🎉 Hoàn tất!

Bây giờ app của bạn đã có backend đầy đủ với:
- ✅ Long-term data storage
- ✅ Auto-sync every 5 minutes
- ✅ Offline support
- ✅ Cross-device sync
- ✅ Leaderboard & progress tracking
