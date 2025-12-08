# ⚡ Quick Start Deployment

Hướng dẫn nhanh để deploy backend lên Cloudflare Workers.

---

## [object Object] Phút Deploy

### Bước 1: Chuẩn bị (1 phút)

```bash
cd workers

# Đăng nhập Cloudflare
wrangler login

# Kiểm tra đã đăng nhập chưa
wrangler whoami
```

### Bước 2: Cấu hình API Key (1 phút)

```bash
# Lấy Gemini API Key từ: https://aistudio.google.com/app/apikey

# Lưu vào Cloudflare Secret
wrangler secret put GEMINI_API_KEY

# Paste your API key when prompted
```

### Bước 3: Deploy (2 phút)

#### Option A: Tự động (Recommended)

**Windows:**
```bash
deploy.bat
```

**macOS/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option B: Manual

```bash
# Install dependencies
npm ci

# Deploy
wrangler deploy
```

### Bước 4: Kiểm tra (1 phút)

```bash
# Test health endpoint
curl https://ai-hoc-tap-api.your-account.workers.dev/api/health

# Expected response
{"status":"ok","version":"2.0.0"}
```

---

## 📝 Cấu hình Frontend

Cập nhật `vite.config.ts` hoặc `.env`:

```env
VITE_API_URL=https://ai-hoc-tap-api.your-account.workers.dev
```

---

## ✅ Deployment Checklist

- [ ] Wrangler installed: `wrangler --version`
- [ ] Logged in: `wrangler whoami`
- [ ] Gemini API Key set: `wrangler secret list`
- [ ] Database exists: `wrangler d1 list`
- [ ] Deploy successful: `wrangler deploy`
- [ ] Health check passes: `curl .../api/health`
- [ ] Frontend updated with API URL

---

## 🔗 Useful Commands

```bash
# View logs
wrangler tail

# List secrets
wrangler secret list

# Update secret
wrangler secret put GEMINI_API_KEY

# List databases
wrangler d1 list

# Query database
wrangler d1 execute ai-hoc-tap-db --command "SELECT * FROM auth_users LIMIT 1"

# Local development
wrangler dev

# Deploy to production
wrangler deploy --env production
```

---

## [object Object]

### "GEMINI_API_KEY is not configured"

```bash
wrangler secret put GEMINI_API_KEY
```

### "Database not found"

```bash
wrangler d1 create ai-hoc-tap-db
# Copy database_id from output
# Update wrangler.toml with the ID
```

### "CORS Error"

Update `ALLOWED_ORIGINS` in `wrangler.toml`:
```toml
[vars]
ALLOWED_ORIGINS = "https://your-frontend-domain.com"
```

### "Unauthorized" (401)

Check that auth token is sent in Authorization header:
```
Authorization: Bearer <token>
```

---

## 📊 Monitor Deployment

```bash
# Real-time logs
wrangler tail

# View in Cloudflare Dashboard
# https://dash.cloudflare.com → Workers → ai-hoc-tap-api
```

---

## 🎯 Next Steps

1. ✅ Deploy backend
2. 📝 Update frontend API URL
3. 🧪 Run integration tests (see INTEGRATION_TEST.md)
4. [object Object] frontend to Cloudflare Pages
5. 📊 Monitor in Cloudflare Dashboard

---

**Done! Your backend is live! 🎉**

For detailed guide, see: `CLOUDFLARE_AI_GATEWAY_SETUP.md`

