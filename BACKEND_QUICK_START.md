# ⚡ Backend Quick Start - 50 Minutes to Deploy

**Status:** ✅ READY TO DEPLOY  
**Time Required:** 50 minutes  
**Difficulty:** Easy

---

## [object Object] Plan

```
5 min  → Create project
10 min → Copy template files
10 min → Test locally
5 min  → Push to GitHub
5 min  → Deploy to Railway
5 min  → Update frontend
5 min  → Test integration
```

---

## 1️⃣ Create Project (5 minutes)

```bash
# Create directory
mkdir stem-vietnam-backend
cd stem-vietnam-backend

# Initialize npm
npm init -y

# Install dependencies
npm install express cors dotenv axios zod uuid
npm install -D typescript @types/express @types/node nodemon ts-node

# Create directories
mkdir -p src/{routes,services,middleware,types,utils}
```

---

## 2️⃣ Copy Template Files (10 minutes)

Copy these files from `BACKEND_STARTER_TEMPLATE.md`:

### File 1: `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### File 2: `package.json` (update scripts section)
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### File 3: `.env`
```env
PORT=8787
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### File 4: `.env.example`
```env
PORT=8787
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=
JWT_SECRET=
JWT_EXPIRY=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### File 5: `src/types/index.ts`
Copy from BACKEND_STARTER_TEMPLATE.md

### File 6: `src/middleware/auth.ts`
Copy from BACKEND_STARTER_TEMPLATE.md

### File 7: `src/middleware/errorHandler.ts`
Copy from BACKEND_STARTER_TEMPLATE.md

### File 8: `src/middleware/rateLimit.ts`
Copy from BACKEND_STARTER_TEMPLATE.md

### File 9: `src/services/geminiService.ts`
Copy from BACKEND_STARTER_TEMPLATE.md

### File 10: `src/routes/ai.ts`
Copy from BACKEND_STARTER_TEMPLATE.md

### File 11: `src/routes/health.ts`
Copy from BACKEND_STARTER_TEMPLATE.md

### File 12: `src/index.ts`
Copy from BACKEND_STARTER_TEMPLATE.md

### File 13: `.gitignore`
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

### File 14: `README.md`
```markdown
# STEM Vietnam Backend

Node.js + Express backend for STEM Vietnam platform.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

See `.env.example`

## API Endpoints

- `GET /health` - Health check
- `POST /api/ai/generate` - Generate content
- `POST /api/ai/chat` - Chat with AI

## Deployment

Deploy to Railway.app
```

---

## 3️⃣ Test Locally (10 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, test:
curl http://localhost:8787/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...,"environment":"development"}
```

---

## 4️⃣ Push to GitHub (5 minutes)

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Backend setup"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/stem-vietnam-backend.git

# Push to GitHub
git push -u origin main
```

---

## 5️⃣ Deploy to Railway (5 minutes)

### Step 1: Create Railway Account
- Go to [railway.app](https://railway.app)
- Click "Sign Up"
- Connect with GitHub

### Step 2: Create New Project
- Click "New Project"
- Select "Deploy from GitHub"
- Authorize Railway
- Select your backend repository

### Step 3: Add Environment Variables
In Railway dashboard:
1. Click "Variables"
2. Add:
   - `GEMINI_API_KEY` = your_key
   - `JWT_SECRET` = your_secret
   - `FRONTEND_URL` = https://yourdomain.com
   - `NODE_ENV` = production

### Step 4: Deploy
- Click "Deploy"
- Wait for build to complete
- Get your Railway URL (e.g., `https://stem-vietnam-backend.railway.app`)

---

## 6️⃣ Update Frontend (5 minutes)

### Update `.env` in frontend:
```env
VITE_API_URL=https://your-railway-url.railway.app
```

### Update `utils/apiClient.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export async function generateContent(prompt: string, modelId: string = 'gemini-2.5-pro') {
  const response = await fetch(`${API_URL}/api/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    },
    body: JSON.stringify({ prompt, modelId })
  });

  if (!response.ok) {
    throw new Error('Generation failed');
  }

  return response.json();
}
```

---

## 7️⃣ Test Integration (5 minutes)

### Test Health Endpoint
```bash
curl https://your-railway-url.railway.app/health
```

### Test from Frontend
1. Open your frontend app
2. Go to Chat AI feature
3. Try to send a message
4. Check browser console for errors
5. Verify response appears

---

## ✅ Verification Checklist

- [ ] Backend starts locally without errors
- [ ] Health endpoint responds
- [ ] GitHub push successful
- [ ] Railway deployment successful
- [ ] Railway URL accessible
- [ ] Environment variables set in Railway
- [ ] Frontend API URL updated
- [ ] Chat AI works from frontend
- [ ] No CORS errors
- [ ] No authentication errors

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check Node version
node --version  # Should be 18+

# Check dependencies
npm install

# Check .env file exists
ls -la .env

# Try again
npm run dev
```

### Railway deployment fails
- Check GitHub push successful
- Check `.gitignore` doesn't exclude important files
- Check `package.json` has correct scripts
- Check Railway logs for errors

### Frontend API calls fail
- Check CORS error in browser console
- Check API URL in `.env`
- Check authentication token exists
- Check Gemini API key is valid

---

## 📊 Expected Results

After deployment, you should see:

```
✅ Health endpoint: {"status":"ok",...}
✅ Chat AI: Responses from Gemini API
✅ Error handling: Proper error messages
✅ Rate limiting: 100 requests per 15 minutes
✅ Authentication: Token validation working
```

---

## 🎉 You're Done!

Your backend is now deployed and connected to your frontend!

### Next Steps
1. Monitor Railway logs
2. Test all features
3. Gather user feedback
4. Plan improvements

---

## 📞 Need Help?

**Email:** stu725114073@hnue.edu.vn  
**Phone:** 0896636181  
**Hours:** T2-T7: 8:00 - 21:00

---

**Status:** ✅ READY TO DEPLOY  
**Time:** 50 minutes  
**Difficulty:** Easy

**Let's deploy! 🚀**

