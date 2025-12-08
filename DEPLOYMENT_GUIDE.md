# 🚀 Deployment Guide - AI Học Tập

Hướng dẫn hoàn chỉnh để deploy frontend + backend lên production.

---

## [object Object]ục lục

1. [Chuẩn bị](#chuẩn-bị)
2. [Backend Deployment (Cloudflare Workers)](#backend-deployment)
3. [Frontend Deployment (Cloudflare Pages)](#frontend-deployment)
4. [Kiểm tra Integration](#kiểm-tra-integration)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Chuẩn bị

### Yêu cầu
- [ ] Tài khoản Cloudflare (miễn phí)
- [ ] Gemini API Key từ Google
- [ ] Git repository
- [ ] Node.js 18+
- [ ] Wrangler CLI

### Cài đặt Wrangler
```bash
npm install -g wrangler
wrangler login
```

---

## 🔌 Backend Deployment

### Bước 1: Cấu hình Gemini API Key

```bash
cd workers

# Lưu API key vào Cloudflare Secret
wrangler secret put GEMINI_API_KEY

# Paste your Gemini API key when prompted
# Get it from: https://aistudio.google.com/app/apikey
```

### Bước 2: Kiểm tra Database

```bash
# Kiểm tra database đã tạo chưa
wrangler d1 list

# Nếu chưa có, tạo database
wrangler d1 create ai-hoc-tap-db

# Copy database_id từ output
# Cập nhật vào wrangler.toml
```

### Bước 3: Initialize Database Schema

```bash
# Chạy migration
wrangler d1 execute ai-hoc-tap-db --file=schema.sql

# Hoặc nếu dùng Drizzle
npm run db:init
```

### Bước 4: Cập nhật ALLOWED_ORIGINS

Mở `workers/wrangler.toml` và cập nhật:

```toml
[vars]
ALLOWED_ORIGINS = "https://your-frontend-domain.com,https://www.your-frontend-domain.com"
```

### Bước 5: Deploy Backend

```bash
cd workers

# Test locally first
wrangler dev

# Deploy to production
wrangler deploy
```

**Output mong đợi:**
```
✓ Uploaded ai-hoc-tap-api
✓ Published ai-hoc-tap-api
  https://ai-hoc-tap-api.your-account.workers.dev
```

### Bước 6: Kiểm tra Backend

```bash
# Test health endpoint
curl https://ai-hoc-tap-api.your-account.workers.dev/api/health

# Expected response
{"status":"ok","version":"2.0.0"}
```

---

## [object Object] Bước 1: Cập nhật API URL

Tạo file `.env.production`:

```bash
# .env.production
VITE_API_URL=https://ai-hoc-tap-api.your-account.workers.dev
```

Hoặc cập nhật `vite.config.ts`:

```typescript
const apiUrl = env.VITE_API_URL || 
  (mode === 'production' 
    ? 'https://ai-hoc-tap-api.your-account.workers.dev'
    : 'http://localhost:8787');
```

### Bước 2: Build Frontend

```bash
# Từ thư mục gốc
npm run build

# Output sẽ ở dist/
```

### Bước 3: Deploy to Cloudflare Pages

#### Option A: Via Wrangler CLI

```bash
# Install Wrangler Pages plugin
npm install -g @cloudflare/wrangler

# Deploy
wrangler pages deploy dist
```

#### Option B: Via Git Integration (Recommended)

1. Push code lên GitHub
2. Đi tới [Cloudflare Dashboard](https://dash.cloudflare.com)
3. **Pages** → **Create a project** → **Connect to Git**
4. Chọn repository
5. Cấu hình build:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Thêm environment variables:
   - `VITE_API_URL`: `https://ai-hoc-tap-api.your-account.workers.dev`
7. Deploy

### Bước 4: Kiểm tra Frontend

```bash
# Truy cập URL được cấp bởi Cloudflare Pages
# https://your-project.pages.dev
```

---

## 🔗 Kiểm tra Integration

### Test 1: Health Check

```bash
curl https://ai-hoc-tap-api.your-account.workers.dev/api/health
```

**Expected:**
```json
{"status":"ok","version":"2.0.0"}
```

### Test 2: Register User

```bash
curl -X POST https://ai-hoc-tap-api.your-account.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "displayName": "Test User",
    "securityQuestion": "Your pet name?",
    "securityAnswer": "Fluffy"
  }'
```

### Test 3: Login

```bash
curl -X POST https://ai-hoc-tap-api.your-account.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Expected:**
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {...}
  }
}
```

### Test 4: AI Generation

```bash
TOKEN="your-token-from-login"

curl -X POST https://ai-hoc-tap-api.your-account.workers.dev/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "Giải thích khái niệm machine learning",
    "modelId": "gemini-2.5-pro"
  }'
```

### Test 5: Frontend Integration

1. Truy cập frontend URL
2. Đăng ký tài khoản
3. Đăng nhập
4. Thử sử dụng tính năng AI
5. Kiểm tra Network tab trong DevTools

---

## 🛡️ Security Checklist

- [ ] API Key được lưu trong Cloudflare Secret (không trong code)
- [ ] ALLOWED_ORIGINS được cập nhật với domain thực
- [ ] CORS headers được kiểm tra
- [ ] SSL/TLS được bật (tự động với Cloudflare)
- [ ] Rate limiting được kiểm tra
- [ ] Database được backup
- [ ] Monitoring được cấu hình

---

## 📊 Monitoring

### Xem Logs

```bash
# Real-time logs
wrangler tail

# Hoặc trong Cloudflare Dashboard
# Workers → ai-hoc-tap-api → Logs
```

### Xem Metrics

1. Đi tới [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers** → **ai-hoc-tap-api**
3. Xem **Metrics** tab:
   - Requests
   - Errors
   - Latency
   - CPU time

---

## [object Object]

### Lỗi: "GEMINI_API_KEY is not configured"

```bash
# Kiểm tra secret
wrangler secret list

# Nếu chưa có, thêm lại
wrangler secret put GEMINI_API_KEY
```

### Lỗi: CORS Error

```bash
# Kiểm tra ALLOWED_ORIGINS trong wrangler.toml
cat workers/wrangler.toml

# Cập nhật nếu cần
# Đảm bảo frontend domain được thêm vào
```

### Lỗi: Database Connection

```bash
# Kiểm tra database ID
wrangler d1 list

# Kiểm tra schema
wrangler d1 execute ai-hoc-tap-db --command "SELECT * FROM auth_users LIMIT 1"
```

### Lỗi: Frontend không kết nối được Backend

1. Kiểm tra `VITE_API_URL` trong `.env.production`
2. Kiểm tra Network tab trong DevTools
3. Kiểm tra CORS headers
4. Kiểm tra backend logs: `wrangler tail`

### Lỗi: AI Generation Failed

```bash
# Kiểm tra Gemini API Key
wrangler secret list

# Kiểm tra API quota
# Truy cập: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

# Kiểm tra logs
wrangler tail
```

---

## 📈 Performance Optimization

### Frontend
- [ ] Enable PWA caching
- [ ] Optimize images
- [ ] Code splitting (đã cấu hình)
- [ ] Minify CSS/JS

### Backend
- [ ] Enable D1 caching
- [ ] Implement rate limiting (đã có)
- [ ] Monitor CPU time
- [ ] Optimize database queries

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build frontend
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ai-hoc-tap
          directory: dist
      
      - name: Deploy backend
        working-directory: workers
        run: |
          npm ci
          wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## ✅ Final Checklist

- [ ] Backend deployed to Cloudflare Workers
- [ ] Frontend deployed to Cloudflare Pages
- [ ] API URL configured correctly
- [ ] Gemini API Key set
- [ ] Database initialized
- [ ] CORS configured
- [ ] Security headers checked
- [ ] Monitoring enabled
- [ ] Tests passed
- [ ] Users can register and login
- [ ] AI features working

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `wrangler tail`
2. Xem Cloudflare Dashboard
3. Kiểm tra Network tab trong browser
4. Xem error messages chi tiết

---

**Chúc mừng! Ứng dụng của bạn đã sẵn sàng cho production! 🎉**

