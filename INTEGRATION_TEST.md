# 🧪 Integration Test - Frontend & Backend

Hướng dẫn kiểm tra tích hợp giữa frontend và backend.

---

## 📋 Chuẩn bị

### Yêu cầu
- Backend đang chạy (local hoặc deployed)
- Frontend đang chạy
- Gemini API Key được cấu hình
- Postman hoặc curl (để test API)

---

## 🔧 Bước 1: Kiểm tra Backend

### 1.1 Health Check

```bash
# Local development
curl http://localhost:8787/api/health

# Production
curl https://ai-hoc-tap-api.your-account.workers.dev/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "2.0.0"
  }
}
```

### 1.2 Kiểm tra CORS

```bash
curl -i -X OPTIONS http://localhost:8787/api/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"
```

**Expected Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-User-ID, Authorization
```

---

## 👤 Bước 2: Kiểm tra Authentication

### 2.1 Register User

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "displayName": "Test User",
    "securityQuestion": "Your pet name?",
    "securityAnswer": "Fluffy"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "test@example.com",
    "displayName": "Test User"
  },
  "message": "Registration successful"
}
```

### 2.2 Login

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "token-here",
    "refreshToken": "refresh-token-here",
    "user": {
      "id": "user-id",
      "email": "test@example.com",
      "displayName": "Test User"
    }
  },
  "message": "Login successful"
}
```

### 2.3 Get Current User

```bash
TOKEN="your-token-from-login"

curl -X GET http://localhost:8787/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "test@example.com",
    "displayName": "Test User"
  }
}
```

---

## 🤖 Bước 3: Kiểm tra AI Features

### 3.1 Simple Text Generation

```bash
TOKEN="your-token-from-login"

curl -X POST http://localhost:8787/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "Giải thích khái niệm machine learning trong 100 từ",
    "modelId": "gemini-2.5-pro"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "content": {
          "parts": [
            {
              "text": "Machine learning là..."
            }
          ]
        }
      }
    ]
  }
}
```

### 3.2 Chat with History

```bash
TOKEN="your-token-from-login"

curl -X POST http://localhost:8787/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "Xin chào, bạn là ai?"
          }
        ]
      },
      {
        "role": "model",
        "parts": [
          {
            "text": "Xin chào! Tôi là một trợ lý AI..."
          }
        ]
      },
      {
        "role": "user",
        "parts": [
          {
            "text": "Bạn có thể giúp tôi học toán không?"
          }
        ]
      }
    ],
    "modelId": "gemini-2.5-pro"
  }'
```

### 3.3 Different Models

```bash
# Test Gemini 2.5 Flash
curl -X POST http://localhost:8787/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "Nhanh chóng giải thích AI",
    "modelId": "gemini-2.5-flash"
  }'
```

---

## 📝 Bước 4: Kiểm tra Data Management

### 4.1 Create Exam

```bash
TOKEN="your-token-from-login"

curl -X POST http://localhost:8787/api/exams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id": "exam-1",
    "title": "Đề thi Toán lớp 12",
    "category": "Toán",
    "grade": "12",
    "questions": [
      {
        "id": 1,
        "text": "1 + 1 = ?",
        "options": ["1", "2", "3", "4"],
        "correctAnswer": "B"
      }
    ],
    "answers": {"1": "B"},
    "score": 10,
    "total_questions": 1,
    "duration": 3600,
    "completed_at": 1700000000000
  }'
```

### 4.2 Get Exams

```bash
curl -X GET "http://localhost:8787/api/exams?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

### 4.3 Create Flashcard Deck

```bash
curl -X POST http://localhost:8787/api/flashcards/decks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id": "deck-1",
    "title": "Từ vựng Tiếng Anh",
    "description": "Bộ từ vựng cơ bản",
    "category": "English",
    "grade": "10",
    "is_public": false,
    "color": "#FF6B6B"
  }'
```

### 4.4 Add Flashcard

```bash
curl -X POST http://localhost:8787/api/flashcards/decks/deck-1/cards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id": "card-1",
    "question": "What is hello in Vietnamese?",
    "answer": "Xin chào",
    "difficulty": "easy",
    "tags": ["greeting", "basic"]
  }'
```

---

## 💾 Bước 5: Kiểm tra Sync

### 5.1 Sync Data

```bash
curl -X POST http://localhost:8787/api/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "exams": [],
    "decks": [],
    "cards": [],
    "chats": [],
    "sessions": []
  }'
```

### 5.2 Get Changes Since

```bash
# Get changes since 1 hour ago
SINCE=$(($(date +%s) * 1000 - 3600000))

curl -X GET "http://localhost:8787/api/sync/changes?since=$SINCE" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌐 Bước 6: Kiểm tra Frontend Integration

### 6.1 Test trong Browser

1. Mở DevTools (F12)
2. Đi tới Network tab
3. Đăng ký tài khoản
4. Kiểm tra requests:
   - POST `/api/auth/register` → 200
   - POST `/api/auth/login` → 200
   - GET `/api/auth/me` → 200

### 6.2 Test AI Features

1. Đi tới Chat interface
2. Gửi message
3. Kiểm tra Network tab:
   - POST `/api/ai/generate` → 200
   - Response chứa AI text

### 6.3 Test Exam Generation

1. Đi tới Exam tab
2. Click "Generate Exam"
3. Kiểm tra Network tab:
   - POST `/api/ai/generate` → 200
   - Response chứa questions

### 6.4 Test Flashcards

1. Đi tới Flashcard tab
2. Tạo deck mới
3. Kiểm tra Network tab:
   - POST `/api/flashcards/decks` → 200
   - GET `/api/flashcards/decks` → 200

---

## ⚠️ Error Handling Tests

### 7.1 Missing Authentication

```bash
# Không có token
curl -X GET http://localhost:8787/api/auth/me
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### 7.2 Invalid Token

```bash
curl -X GET http://localhost:8787/api/auth/me \
  -H "Authorization: Bearer invalid-token"
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

### 7.3 Missing Required Fields

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Thiếu các trường bắt buộc..."
}
```

### 7.4 Rate Limiting

```bash
# Gửi 50+ requests trong 15 phút
for i in {1..60}; do
  curl -X POST http://localhost:8787/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "test"}'
done
```

**Expected Response (sau 50 requests):**
```json
{
  "success": false,
  "error": "Too many requests (auth)"
}
```

---

## 📊 Bước 8: Performance Testing

### 8.1 Response Time

```bash
# Measure response time
time curl -X GET http://localhost:8787/api/health
```

**Expected:** < 100ms

### 8.2 Concurrent Requests

```bash
# 10 concurrent requests
for i in {1..10}; do
  curl -X GET http://localhost:8787/api/health &
done
wait
```

### 8.3 Large Payload

```bash
# Test with large prompt
curl -X POST http://localhost:8787/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prompt": "'"$(python3 -c "print(\"a\" * 5000)")"'",
    "modelId": "gemini-2.5-pro"
  }'
```

---

## ✅ Integration Checklist

- [ ] Health check passes
- [ ] CORS headers correct
- [ ] Registration works
- [ ] Login works
- [ ] Get current user works
- [ ] AI generation works
- [ ] Chat with history works
- [ ] Different models work
- [ ] Exam creation works
- [ ] Flashcard creation works
- [ ] Sync works
- [ ] Error handling works
- [ ] Rate limiting works
- [ ] Frontend can register
- [ ] Frontend can login
- [ ] Frontend can use AI features
- [ ] Frontend can create exams
- [ ] Frontend can create flashcards
- [ ] Response times acceptable
- [ ] Concurrent requests handled

---

## 🐛 Debugging Tips

### Check Backend Logs

```bash
# Local development
wrangler dev

# Production logs
wrangler tail
```

### Check Network Tab

1. F12 → Network tab
2. Filter by XHR
3. Click on request
4. Check:
   - Request headers
   - Request body
   - Response headers
   - Response body

### Check Browser Console

1. F12 → Console tab
2. Look for errors
3. Check API_URL configuration

### Check Database

```bash
# Query database
wrangler d1 execute ai-hoc-tap-db --command "SELECT * FROM auth_users LIMIT 1"
```

---

## 📞 Common Issues

### Issue: CORS Error

**Solution:**
1. Check ALLOWED_ORIGINS in wrangler.toml
2. Ensure frontend domain is included
3. Restart backend

### Issue: 401 Unauthorized

**Solution:**
1. Check token is valid
2. Check token is sent in Authorization header
3. Check token hasn't expired

### Issue: 500 Internal Server Error

**Solution:**
1. Check backend logs: `wrangler tail`
2. Check Gemini API Key is set
3. Check database is initialized

### Issue: AI not responding

**Solution:**
1. Check Gemini API Key
2. Check API quota
3. Check network connectivity
4. Check backend logs

---

**Chúc mừng! Nếu tất cả tests pass, integration của bạn là hoàn hảo! 🎉**

