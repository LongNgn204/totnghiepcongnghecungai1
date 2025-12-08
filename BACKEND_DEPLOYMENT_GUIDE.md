# 🚀 Backend Deployment Guide - STEM Vietnam Platform

**Date:** December 7, 2025  
**Status:** ⚠️ BACKEND NEEDED - Implementation Guide  
**Priority:** CRITICAL

---

## 📌 Current Situation

Your STEM Vietnam platform is currently **frontend-only** (React + TypeScript). According to the audit report, you need a backend API to:

1. ✅ Secure API key management (Gemini API)
2. ✅ Handle authentication & authorization
3. ✅ Implement rate limiting
4. ✅ Track user usage
5. ✅ Manage data persistence
6. ✅ Implement caching strategy

---

## 🎯 Backend Architecture Options

### Option 1: Node.js + Express (Recommended)
**Best for:** Quick deployment, JavaScript ecosystem  
**Pros:** Same language as frontend, easy to learn, good ecosystem  
**Cons:** Single-threaded, needs clustering for scale  
**Deployment:** Vercel, Railway, Heroku, AWS EC2

### Option 2: Python + FastAPI
**Best for:** AI/ML integration, data processing  
**Pros:** Great for AI, fast, modern  
**Cons:** Different language, separate deployment  
**Deployment:** Heroku, AWS, DigitalOcean

### Option 3: Cloudflare Workers
**Best for:** Serverless, edge computing  
**Pros:** Fast, cheap, no server management  
**Cons:** Limited resources, cold starts  
**Deployment:** Cloudflare

### Option 4: Firebase/Supabase
**Best for:** Quick MVP, real-time features  
**Pros:** Managed, scalable, real-time  
**Cons:** Vendor lock-in, cost at scale  
**Deployment:** Cloud-hosted

---

## 🔧 Recommended: Node.js + Express Backend

### Step 1: Create Backend Project

```bash
# Create backend directory
mkdir stem-vietnam-backend
cd stem-vietnam-backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors dotenv axios zod
npm install -D typescript @types/express @types/node nodemon ts-node
```

### Step 2: Project Structure

```
stem-vietnam-backend/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── config/
│   │   └── env.ts              # Environment variables
│   ├── routes/
│   │   ├── ai.ts               # AI endpoints
│   │   ├── auth.ts             # Authentication
│   │   ├── exams.ts            # Exam endpoints
│   │   ├── flashcards.ts       # Flashcard endpoints
│   │   └── progress.ts         # Progress tracking
│   ├── controllers/
│   │   ├── aiController.ts
│   │   ├── authController.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.ts             # JWT verification
│   │   ├── errorHandler.ts     # Error handling
│   │   └── rateLimit.ts        # Rate limiting
│   ├── services/
│   │   ├── geminiService.ts    # Gemini API wrapper
│   │   ├── authService.ts
│   │   └── ...
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── utils/
│       ├── logger.ts
│       └── validators.ts
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── tsconfig.json
└── package.json
```

### Step 3: Main Server File (src/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';
import authRoutes from './routes/auth';
import examRoutes from './routes/exams';
import flashcardRoutes from './routes/flashcards';
import progressRoutes from './routes/progress';
import { errorHandler } from './middleware/errorHandler';
import { rateLimit } from './middleware/rateLimit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(rateLimit);

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 4: Environment Variables (.env)

```env
# Server
PORT=8787
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Gemini API
GEMINI_API_KEY=your_api_key_here

# Database (if using)
DATABASE_URL=your_database_url

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Step 5: AI Service (src/services/geminiService.ts)

```typescript
import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(
    prompt: string,
    modelId: string = 'gemini-2.5-pro',
    generationConfig?: any
  ) {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}/${modelId}:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: generationConfig || {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 2048
          }
        }
      );

      return {
        success: true,
        text: response.data.candidates[0].content.parts[0].text,
        usage: response.data.usageMetadata
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Generation failed'
      };
    }
  }

  async chat(
    messages: Array<{ role: string; content: string }>,
    modelId: string = 'gemini-2.5-pro'
  ) {
    try {
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await axios.post(
        `${GEMINI_API_URL}/${modelId}:generateContent?key=${this.apiKey}`,
        {
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 2048
          }
        }
      );

      return {
        success: true,
        text: response.data.candidates[0].content.parts[0].text
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Chat failed'
      };
    }
  }
}
```

### Step 6: AI Routes (src/routes/ai.ts)

```typescript
import express from 'express';
import { GeminiService } from '../services/geminiService';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const gemini = new GeminiService(process.env.GEMINI_API_KEY!);

// Generate content
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { prompt, modelId, generationConfig } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await gemini.generateContent(prompt, modelId, generationConfig);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat endpoint
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { messages, modelId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = await gemini.chat(messages, modelId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

---

## 🌐 Deployment Options

### Option A: Vercel (Recommended for Node.js)

**Pros:** Free tier, easy deployment, good for Node.js  
**Cons:** Serverless limitations, cold starts

**Steps:**
1. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

2. Deploy:
```bash
npm install -g vercel
vercel
```

### Option B: Railway.app (Recommended)

**Pros:** Easy, good free tier, good for Node.js  
**Cons:** Limited free tier

**Steps:**
1. Push to GitHub
2. Connect GitHub to Railway
3. Add environment variables
4. Deploy

### Option C: Heroku

**Pros:** Easy, good documentation  
**Cons:** Paid tier only now

**Steps:**
```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
```

### Option D: AWS EC2

**Pros:** Scalable, full control  
**Cons:** More complex, costs more

**Steps:**
1. Launch EC2 instance
2. Install Node.js
3. Clone repository
4. Install dependencies
5. Use PM2 for process management
6. Setup Nginx as reverse proxy

---

## 📋 Deployment Checklist

### Before Deployment
- [ ] Environment variables configured
- [ ] API keys secured (not in code)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Database migrations ready (if applicable)
- [ ] Tests passing

### Deployment
- [ ] Build succeeds
- [ ] Environment variables set in hosting
- [ ] Health check endpoint working
- [ ] API endpoints responding
- [ ] HTTPS enabled
- [ ] Monitoring configured

### Post-Deployment
- [ ] Test all endpoints
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify rate limiting
- [ ] Test with frontend

---

## 🔗 Frontend Integration

Update your frontend API client:

```typescript
// utils/apiClient.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8787';

export async function generateContent(prompt: string, modelId: string = 'gemini-2.5-pro') {
  const response = await fetch(`${API_URL}/api/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    },
    body: JSON.stringify({
      prompt,
      modelId
    })
  });

  if (!response.ok) {
    throw new Error('Generation failed');
  }

  return response.json();
}
```

---

## 📊 Recommended Stack Summary

| Component | Technology | Reason |
|-----------|-----------|--------|
| Runtime | Node.js 18+ | JavaScript ecosystem |
| Framework | Express | Simple, flexible |
| Language | TypeScript | Type safety |
| Database | PostgreSQL | Reliable, scalable |
| Cache | Redis | Session & data cache |
| Hosting | Railway/Vercel | Easy, affordable |
| Monitoring | Sentry | Error tracking |
| Logging | Winston | Structured logging |

---

## 🚀 Quick Start Commands

```bash
# Create backend
mkdir stem-vietnam-backend
cd stem-vietnam-backend

# Initialize
npm init -y
npm install express cors dotenv axios zod
npm install -D typescript @types/express @types/node nodemon ts-node

# Create tsconfig.json
npx tsc --init

# Create src directory
mkdir -p src/{routes,services,middleware,types,utils}

# Start development
npm run dev

# Build for production
npm run build

# Deploy
vercel deploy
```

---

## 📞 Support

**Need help?**
- Email: stu725114073@hnue.edu.vn
- Phone: 0896636181
- Hours: T2-T7: 8:00 - 21:00

---

## ✅ Next Steps

1. **Choose hosting platform** (Railway recommended)
2. **Create backend project** using Node.js + Express
3. **Implement API endpoints** (AI, Auth, Exams, Flashcards)
4. **Setup environment variables**
5. **Deploy backend**
6. **Update frontend API URL**
7. **Test all endpoints**
8. **Monitor performance**

---

**Status:** ⚠️ BACKEND IMPLEMENTATION NEEDED  
**Priority:** CRITICAL  
**Estimated Time:** 2-3 days for basic backend

Ready to create the backend? Let me know which platform you prefer! 🚀

