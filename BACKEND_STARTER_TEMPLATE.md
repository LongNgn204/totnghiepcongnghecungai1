# 🎯 Backend Starter Template - Ready to Use

**Status:** ✅ READY TO COPY & PASTE  
**Framework:** Node.js + Express + TypeScript  
**Hosting:** Railway.app (Recommended)

---

## 📦 Step 1: Create Backend Project

```bash
# Create new directory
mkdir stem-vietnam-backend
cd stem-vietnam-backend

# Initialize npm
npm init -y

# Install dependencies
npm install express cors dotenv axios zod uuid
npm install -D typescript @types/express @types/node @types/uuid nodemon ts-node

# Create directories
mkdir -p src/{routes,services,middleware,types,utils,controllers}
```

---

## 📄 Step 2: Create tsconfig.json

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
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 📄 Step 3: Create package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

---

## 📄 Step 4: Create .env File

```env
# Server
PORT=8787
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

## 📄 Step 5: Create .env.example

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

---

## 📄 Step 6: Create src/types/index.ts

```typescript
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerateRequest {
  prompt: string;
  modelId?: string;
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

export interface GenerateResponse {
  success: boolean;
  text?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
}

export interface ExamRequest {
  title: string;
  subject: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  createdAt: Date;
  lastReviewed?: Date;
  difficulty: number;
}
```

---

## 📄 Step 7: Create src/middleware/auth.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = (decoded as any).userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 📄 Step 8: Create src/middleware/errorHandler.ts

```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

## 📄 Step 9: Create src/middleware/rateLimit.ts

```typescript
import { Request, Response, NextFunction } from 'express';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000;
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  record.count++;
  next();
};
```

---

## 📄 Step 10: Create src/services/geminiService.ts

```typescript
import axios from 'axios';
import { GenerateRequest, GenerateResponse, ChatMessage } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const modelId = request.modelId || 'gemini-2.5-pro';
      
      const response = await axios.post(
        `${GEMINI_API_URL}/${modelId}:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: request.prompt }]
            }
          ],
          generationConfig: request.generationConfig || {
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
        usage: {
          promptTokens: response.data.usageMetadata.promptTokenCount,
          candidatesTokens: response.data.usageMetadata.candidatesTokenCount,
          totalTokens: response.data.usageMetadata.totalTokenCount
        }
      };
    } catch (error: any) {
      console.error('Gemini API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Generation failed'
      };
    }
  }

  async chat(messages: ChatMessage[], modelId: string = 'gemini-2.5-pro'): Promise<GenerateResponse> {
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

---

## 📄 Step 11: Create src/routes/ai.ts

```typescript
import express from 'express';
import { GeminiService } from '../services/geminiService';
import { authMiddleware } from '../middleware/auth';
import { GenerateRequest } from '../types';

const router = express.Router();
const gemini = new GeminiService(process.env.GEMINI_API_KEY!);

// Generate content
router.post('/generate', authMiddleware, async (req, res, next) => {
  try {
    const { prompt, modelId, generationConfig } = req.body as GenerateRequest;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await gemini.generateContent({
      prompt,
      modelId,
      generationConfig
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Chat endpoint
router.post('/chat', authMiddleware, async (req, res, next) => {
  try {
    const { messages, modelId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = await gemini.chat(messages, modelId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
```

---

## 📄 Step 12: Create src/routes/health.ts

```typescript
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

export default router;
```

---

## 📄 Step 13: Create src/index.ts (Main Server)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';
import healthRoutes from './routes/health';
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
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit);

// Routes
app.use('/api/ai', aiRoutes);
app.use('/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});
```

---

## 🚀 Step 14: Deploy to Railway.app

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account
5. Select your repository
6. Add environment variables:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL`
7. Deploy!

### 3. Get Your Backend URL
Railway will provide a URL like: `https://your-app.railway.app`

---

## 🔗 Step 15: Update Frontend

Update your frontend `.env`:

```env
VITE_API_URL=https://your-app.railway.app
```

Update `utils/apiClient.ts`:

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

## ✅ Testing

### Local Testing
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Test with curl
curl -X POST http://localhost:8787/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{"prompt":"Hello"}'
```

### Production Testing
```bash
curl -X GET https://your-app.railway.app/health
```

---

## [object Object] Structure Summary

```
stem-vietnam-backend/
├── src/
│   ├── index.ts                 # Main server
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── services/
│   │   └── geminiService.ts    # Gemini API wrapper
│   ├── routes/
│   │   ├── ai.ts               # AI endpoints
│   │   └── health.ts           # Health check
│   ├── middleware/
│   │   ├── auth.ts             # JWT auth
│   │   ├── errorHandler.ts     # Error handling
│   │   └── rateLimit.ts        # Rate limiting
│   └── utils/
│       └── (utility functions)
├── .env                         # Environment variables
├── .env.example                 # Example env
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🎯 Next Steps

1. ✅ Copy all files above
2. ✅ Run `npm install`
3. ✅ Create `.env` file with your API keys
4. ✅ Run `npm run dev` to test locally
5. ✅ Push to GitHub
6. ✅ Deploy to Railway.app
7. ✅ Update frontend API URL
8. ✅ Test all endpoints

---

## 📞 Support

**Email:** stu725114073@hnue.edu.vn  
**Phone:** 0896636181  
**Hours:** T2-T7: 8:00 - 21:00

---

**Status:** ✅ READY TO DEPLOY  
**Estimated Setup Time:** 30 minutes  
**Estimated Deployment Time:** 5 minutes

Ready to deploy? 🚀

