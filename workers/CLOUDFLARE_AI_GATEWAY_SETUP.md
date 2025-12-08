# Cloudflare AI Gateway Setup Guide

## 🎯 Giải pháp "Bất Tử" cho AI API

Hướng dẫn này giúp bạn thiết lập **Cloudflare AI Gateway** để gọi Gemini API một cách an toàn, đáng tin cậy, và có thể mở rộng.

### ✅ Lợi ích của Cloudflare AI Gateway

1. **Caching**: Tự động cache kết quả AI để giảm chi phí
2. **Rate Limiting**: Bảo vệ API khỏi lạm dụng
3. **Monitoring**: Theo dõi sử dụng AI chi tiết
4. **Fallback**: Tự động chuyển đổi nếu một provider bị lỗi
5. **Security**: Không lộ API key trên client
6. **Analytics**: Thống kê chi tiết về sử dụng

---

## 📋 Bước 1: Chuẩn bị

### Yêu cầu
- Tài khoản Cloudflare (miễn phí hoặc trả phí)
- Gemini API Key từ Google Cloud Console
- Wrangler CLI (đã cài đặt)

### Kiểm tra Wrangler
```bash
cd workers
wrangler --version
```

---

## 🔧 Bước 2: Cấu hình Gemini API Key

### 2.1 Lấy Gemini API Key
1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Tạo API Key mới
3. Copy key

### 2.2 Lưu API Key vào Cloudflare Secret
```bash
cd workers

# Lưu API key vào Cloudflare secret
wrangler secret put GEMINI_API_KEY

# Paste your API key when prompted
```

**Xác nhận:**
```bash
wrangler secret list
```

---

## 🚀 Bước 3: Deploy Backend

### 3.1 Kiểm tra cấu hình
```bash
cd workers

# Kiểm tra wrangler.toml
cat wrangler.toml
```

Đảm bảo có:
```toml
[[d1_databases]]
binding = "DB"
database_name = "ai-hoc-tap-db"
database_id = "5e6f80b8-02cd-4d7a-8f5e-a17fd24dd60d"

[vars]
ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:5173,https://your-domain.pages.dev"
USE_AI_GATEWAY = "true"
```

### 3.2 Deploy lên Cloudflare
```bash
cd workers

# Development (local testing)
wrangler dev

# Production deployment
wrangler deploy
```

**Output mong đợi:**
```
✓ Uploaded ai-hoc-tap-api
✓ Published ai-hoc-tap-api
  https://ai-hoc-tap-api.your-account.workers.dev
```

### 3.3 Kiểm tra deployment
```bash
# Test health endpoint
curl https://ai-hoc-tap-api.your-account.workers.dev/api/health

# Response mong đợi
{"status":"ok","version":"2.0.0"}
```

---

## 🌐 Bước 4: Cấu hình Frontend

### 4.1 Cập nhật API URL
Trong file `.env` hoặc `vite.config.ts`:

```env
VITE_API_URL=https://ai-hoc-tap-api.your-account.workers.dev
```

Hoặc trong `vite.config.ts`:
```typescript
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://ai-hoc-tap-api.your-account.workers.dev'
    )
  }
})
```

### 4.2 Kiểm tra Frontend
```bash
# Từ thư mục gốc
npm run dev

# Hoặc nếu dùng Vite
npm run dev -- --host
```

---

## 🔗 Bước 5: Kiểm tra Integration

### 5.1 Test Authentication
```bash
# Register
curl -X POST https://ai-hoc-tap-api.your-account.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "displayName": "Test User",
    "securityQuestion": "Your pet name?",
    "securityAnswer": "Fluffy"
  }'

# Login
curl -X POST https://ai-hoc-tap-api.your-account.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 5.2 Test AI Endpoint
```bash
# Lấy token từ login response
TOKEN="your-token-here"

# Test AI generation
curl -X POST https://ai-hoc-tap-api.your-account.workers.dev/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "Giải thích khái niệm machine learning",
    "modelId": "gemini-2.5-pro"
  }'
```

---

## 📊 Bước 6: Cấu hình Cloudflare AI Gateway (Optional - Advanced)

Nếu bạn muốn sử dụng Cloudflare AI Gateway Dashboard:

### 6.1 Tạo AI Gateway trong Cloudflare Dashboard
1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Chọn tài khoản của bạn
3. Đi đến **AI** → **AI Gateway**
4. Tạo gateway mới
5. Lấy Gateway ID

### 6.2 Cập nhật wrangler.toml
```toml
[[ai_gateway]]
binding = "AI_GATEWAY"
id = "your-gateway-id"
```

### 6.3 Cập nhật ai-gateway-service.ts
```typescript
// Sử dụng Cloudflare AI Gateway endpoint
const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/google/models/${modelId}:generateContent`;
```

---

## 🛡️ Bước 7: Bảo mật

### 7.1 CORS Configuration
Cập nhật `ALLOWED_ORIGINS` trong `wrangler.toml`:
```toml
[vars]
ALLOWED_ORIGINS = "https://your-frontend-domain.com,https://www.your-frontend-domain.com"
```

### 7.2 Rate Limiting
Backend đã có rate limiting tích hợp:
- Auth endpoints: 50 requests/15 minutes
- Sync endpoints: 300 requests/15 minutes

### 7.3 API Key Security
- ✅ API Key lưu trong Cloudflare Secret (không trong code)
- ✅ API Key không bao giờ gửi tới client
- ✅ Tất cả AI requests phải có authentication token

---

## [object Object]eshooting

### Lỗi: "GEMINI_API_KEY is not configured"
```bash
# Kiểm tra secret
wrangler secret list

# Nếu chưa có, thêm lại
wrangler secret put GEMINI_API_KEY
```

### Lỗi: "AI is not configured" (500)
```bash
# Kiểm tra environment variables
wrangler env list

# Kiểm tra logs
wrangler tail
```

### Lỗi: CORS issues
```bash
# Kiểm tra ALLOWED_ORIGINS
cat wrangler.toml

# Cập nhật nếu cần
# Đảm bảo frontend URL được thêm vào ALLOWED_ORIGINS
```

### Lỗi: "Unauthorized" (401)
```bash
# Kiểm tra auth token
# Đảm bảo token được gửi trong Authorization header
# Format: Authorization: Bearer <token>
```

---

## 📈 Monitoring & Analytics

### Xem logs
```bash
wrangler tail
```

### Xem metrics trong Cloudflare Dashboard
1. Đi tới **Workers** → **ai-hoc-tap-api**
2. Xem **Metrics** tab
3. Kiểm tra requests, errors, latency

---

## [object Object] Deployment Checklist

- [ ] API Key được lưu trong Cloudflare Secret
- [ ] ALLOWED_ORIGINS được cập nhật với domain thực
- [ ] Frontend VITE_API_URL trỏ tới deployed worker
- [ ] Database D1 được tạo và initialized
- [ ] Email configuration (nếu cần)
- [ ] Rate limiting được kiểm tra
- [ ] CORS headers được kiểm tra
- [ ] Security headers được kiểm tra
- [ ] SSL/TLS được bật
- [ ] Monitoring được cấu hình

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `wrangler tail`
2. Xem Cloudflare Dashboard
3. Kiểm tra network tab trong browser DevTools
4. Xem error messages chi tiết

---

## 🔄 Cập nhật Future

Khi Cloudflare AI Gateway hỗ trợ Gemini API trực tiếp, chỉ cần:
1. Cập nhật `ai-gateway-service.ts` để sử dụng gateway endpoint
2. Không cần thay đổi frontend hoặc database
3. Sẽ tự động có caching, rate limiting, monitoring

---

**Chúc mừng! Backend của bạn đã sẵn sàng với AI Gateway! 🎉**

