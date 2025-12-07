# ❓ CÂU HỎI THƯỜNG GẶP & KHẮC PHỤC SỰ CỐ

---

## PHẦN 1: KIẾN TRÚC & THIẾT KẾ

### Q1: Tại sao phải gọi API qua backend thay vì trực tiếp?

**A:** Có 3 lý do chính:

1. **Bảo mật API Key**
   - Nếu gọi trực tiếp từ frontend, API key có thể bị lộ
   - Backend proxy giữ API key an toàn trên server

2. **Rate Limiting & Usage Tracking**
   - Backend có thể track usage per user
   - Implement rate limiting để tránh abuse
   - Dễ dàng thay đổi quota mà không cần deploy frontend

3. **Error Handling & Retry Logic**
   - Backend có thể retry tự động
   - Implement exponential backoff
   - Log errors cho debugging

**Example:**
```
Frontend → Backend Proxy → Gemini API
  ✅ API key safe
  ✅ Rate limiting
  ✅ Usage tracking
```

---

### Q2: Tại sao cần token refresh?

**A:** Tokens có thời gian hết hạn. Nếu không refresh:
- User bị logout đột ngột
- Mất dữ liệu đang nhập
- User experience kém

**Solution:**
```typescript
// Backend gửi 2 tokens
{
  accessToken: "short-lived (15 mins)",
  refreshToken: "long-lived (7 days)"
}

// Frontend refresh tự động trước khi hết hạn
// Không cần user đăng nhập lại
```

---

### Q3: Có cần global state management không?

**A:** Có, vì:
1. **Prop drilling** - Truyền props qua nhiều levels
2. **Data consistency** - Cùng dữ liệu ở nhiều components
3. **Performance** - Tránh re-render không cần thiết
4. **Offline support** - Dễ sync khi online

**Recommend:** Zustand (nhẹ, dễ dùng)

---

## PHẦN 2: SECURITY

### Q4: Làm sao bảo vệ API key?

**A:** 
1. ✅ Lưu trên backend (environment variable)
2. ✅ Không commit vào Git
3. ✅ Rotate key định kỳ
4. ✅ Monitor usage
5. ✅ Rate limit per user

```bash
# .env (backend)
GEMINI_API_KEY=sk-...

# .env (frontend) - KHÔNG có API key
VITE_API_URL=http://localhost:8787
```

---

### Q5: Làm sao bảo vệ user token?

**A:**
1. ✅ Lưu trong HttpOnly cookie (không localStorage)
2. ✅ Set Secure flag (HTTPS only)
3. ✅ Set SameSite=Strict (CSRF protection)
4. ✅ Implement token refresh
5. ✅ Clear on logout

```typescript
// Backend
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000 // 15 mins
});
```

---

### Q6: Cần CORS configuration không?

**A:** Có, nếu frontend & backend ở domain khác

```typescript
// Backend (Express)
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## PHẦN 3: PERFORMANCE

### Q7: Làm sao optimize bundle size?

**A:**
1. ✅ Code splitting (lazy load routes)
2. ✅ Tree shaking (remove unused code)
3. ✅ Minification (production build)
4. ✅ Compression (gzip)
5. ✅ Image optimization (WebP)

```typescript
// Lazy load routes
const Product1 = React.lazy(() => import('./components/Product1'));

<Suspense fallback={<Loading />}>
  <Product1 />
</Suspense>
```

---

### Q8: Cần caching strategy không?

**A:** Có, 3 levels:

1. **HTTP Caching** (Browser)
```typescript
// Backend
res.set('Cache-Control', 'public, max-age=3600');
```

2. **Service Worker Caching** (Offline)
```typescript
// Cache API responses
const cache = await caches.open('api-v1');
cache.put(request, response);
```

3. **In-Memory Caching** (Frontend)
```typescript
const cache = new Map();
if (cache.has(key)) return cache.get(key);
```

---

### Q9: Làm sao handle large lists?

**A:** Dùng pagination hoặc virtual scrolling

```typescript
// Pagination
const pageSize = 10;
const page = 1;
const items = allItems.slice((page-1)*pageSize, page*pageSize);

// Virtual scrolling (cho 1000+ items)
import { FixedSizeList } from 'react-window';
<FixedSizeList height={600} itemCount={10000} itemSize={50}>
  {Row}
</FixedSizeList>
```

---

## PHẦN 4: TESTING

### Q10: Cần test gì?

**A:** 3 levels:

1. **Unit Tests** (Functions)
```typescript
describe('calculateScore', () => {
  it('should return correct score', () => {
    expect(calculateScore(10, 8)).toBe(80);
  });
});
```

2. **Integration Tests** (Components + API)
```typescript
it('should load exams from API', async () => {
  const { getByText } = render(<ExamHistory />);
  await waitFor(() => {
    expect(getByText('Exam 1')).toBeInTheDocument();
  });
});
```

3. **E2E Tests** (User flows)
```typescript
it('should create and submit exam', async () => {
  await page.goto('http://localhost:3000');
  await page.click('button:has-text("Tạo đề")');
  // ... user interactions
});
```

---

### Q11: Cần test coverage bao nhiêu?

**A:** 
- **Minimum:** 50% (critical paths)
- **Good:** 80% (most code)
- **Excellent:** 90%+ (nearly all code)

```bash
npm run test -- --coverage
```

---

## PHẦN 5: DEPLOYMENT

### Q12: Cách deploy frontend?

**A:** Options:

1. **Vercel** (recommended)
```bash
npm install -g vercel
vercel
```

2. **Netlify**
```bash
npm run build
# Deploy dist/ folder
```

3. **Docker**
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

### Q13: Cách deploy backend?

**A:** Options:

1. **Heroku**
```bash
git push heroku main
```

2. **Railway**
```bash
railway link
railway up
```

3. **Docker + VPS**
```bash
docker build -t myapp .
docker run -p 8787:8787 myapp
```

---

### Q14: Cần environment variables gì?

**A:**

**Frontend (.env):**
```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=STEM Vietnam
```

**Backend (.env):**
```
GEMINI_API_KEY=sk-...
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://example.com
NODE_ENV=production
```

---

## PHẦN 6: TROUBLESHOOTING

### Q15: API call fail với 401 Unauthorized

**Nguyên nhân:**
- Token hết hạn
- Token invalid
- Token không được gửi

**Fix:**
```typescript
// Check token exists
const token = localStorage.getItem('auth_token');
if (!token) {
  // Redirect to login
  navigate('/login');
  return;
}

// Check token expiry
const expiresAt = localStorage.getItem('token_expires_at');
if (Date.now() >= expiresAt) {
  // Refresh token
  await refreshToken();
}

// Send token in header
headers['Authorization'] = `Bearer ${token}`;
```

---

### Q16: CORS error

**Nguyên nhân:**
- Backend không allow origin
- Missing credentials flag
- Wrong headers

**Fix:**
```typescript
// Frontend
fetch(url, {
  credentials: 'include', // ✅ Send cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

### Q17: Slow API response

**Nguyên nhân:**
- Network slow
- Server overloaded
- Query inefficient

**Fix:**
```typescript
// Add timeout
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);

fetch(url, { signal: controller.signal });

// Add retry
await retryAsync(() => fetch(url), {
  maxRetries: 3,
  initialDelayMs: 1000
});

// Add caching
const cache = new Map();
if (cache.has(key)) return cache.get(key);
```

---

### Q18: Memory leak in useEffect

**Nguyên nhân:**
- Không cleanup event listeners
- Không cancel async operations
- Không clear timers

**Fix:**
```typescript
useEffect(() => {
  const handleResize = () => { /* ... */ };
  window.addEventListener('resize', handleResize);
  
  return () => {
    // ✅ Cleanup
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Cleanup async
useEffect(() => {
  let isMounted = true;
  
  fetchData().then(data => {
    if (isMounted) setData(data);
  });
  
  return () => {
    isMounted = false;
  };
}, []);
```

---

### Q19: Component re-render quá nhiều

**Nguyên nhân:**
- State update trong render
- Missing dependencies
- Unnecessary re-renders

**Fix:**
```typescript
// Use useCallback
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// Use useMemo
const memoizedValue = useMemo(() => {
  return expensiveCalculation();
}, [dependencies]);

// Use React.memo
const MyComponent = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});
```

---

### Q20: JSON parse error

**Nguyên nhân:**
- Invalid JSON from AI
- Malformed response
- Encoding issue

**Fix:**
```typescript
try {
  const data = JSON.parse(response);
} catch (error) {
  // ✅ Fallback
  console.error('Invalid JSON:', response);
  return defaultData;
}

// ✅ Validate before parse
const jsonMatch = response.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  throw new Error('No JSON found');
}

// ✅ Use schema validation
const validatedData = ExamDataSchema.parse(data);
```

---

## PHẦN 7: BEST PRACTICES

### Q21: Cách organize code?

**A:**
```
src/
├── components/
│   ├── common/
│   ├── layout/
│   ├── features/
│   └── __tests__/
├── utils/
│   ├── api/
│   ├── validation/
│   └── helpers/
├── contexts/
├── hooks/
├── store/
├── types/
└── styles/
```

---

### Q22: Cách name components?

**A:**
```typescript
// ✅ Good
<UserProfileCard />
<ExamHistoryList />
<ChatMessageInput />

// ❌ Bad
<Card />
<List />
<Input />
```

---

### Q23: Cách handle errors?

**A:**
```typescript
// ✅ Good
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  setError(message);
  toast.error(message);
}

// ❌ Bad
try {
  const data = await fetchData();
} catch (error) {
  console.log(error); // Not helpful
}
```

---

### Q24: Cách write clean code?

**A:**
1. ✅ Use TypeScript
2. ✅ Add comments cho logic phức tạp
3. ✅ Use meaningful names
4. ✅ Keep functions small
5. ✅ DRY (Don't Repeat Yourself)
6. ✅ SOLID principles

---

### Q25: Cách improve accessibility?

**A:**
1. ✅ Add ARIA labels
2. ✅ Keyboard navigation
3. ✅ Color contrast (4.5:1)
4. ✅ Focus management
5. ✅ Screen reader support
6. ✅ Semantic HTML

---

## RESOURCES

- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com
- **Zod Validation:** https://zod.dev
- **Zustand:** https://github.com/pmndrs/zustand
- **Testing Library:** https://testing-library.com
- **Vitest:** https://vitest.dev

---

**Last Updated:** 2025-12-07 03:30:00 UTC

