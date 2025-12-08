# 🚀 START DEPLOYMENT HERE

**Status**: ✅ Ready for Production  
**Time to Deploy**: 5 minutes  
**Difficulty**: Easy  

---

## 📌 What You Need

1. **Gemini API Key** - Get from: https://aistudio.google.com/app/apikey
2. **Cloudflare Account** - Free at: https://dash.cloudflare.com
3. **Wrangler CLI** - Already installed (check: `wrangler --version`)

---

## ⚡ 5-Minute Deployment

### Step 1: Navigate to Backend (30 seconds)

```bash
cd workers
```

### Step 2: Login to Cloudflare (30 seconds)

```bash
wrangler login
```

A browser window will open. Approve the login.

### Step 3: Set Gemini API Key (1 minute)

```bash
wrangler secret put GEMINI_API_KEY
```

When prompted, paste your Gemini API key and press Enter.

### Step 4: Deploy Backend (2 minutes)

**Windows:**
```bash
deploy.bat
```

**macOS/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Deploy to Cloudflare
- ✅ Test health endpoint
- ✅ Show deployed URL

### Step 5: Copy Deployed URL (30 seconds)

The script will output something like:
```
Deployed URL: https://ai-hoc-tap-api.your-account.workers.dev
```

**Copy this URL** - you'll need it for the frontend.

### Step 6: Update Frontend (1 minute)

Open `vite.config.ts` and update:

```typescript
const apiUrl = env.VITE_API_URL || 
  (mode === 'production' 
    ? 'https://ai-hoc-tap-api.your-account.workers.dev'  // ← Paste your URL here
    : 'http://localhost:8787');
```

---

## ✅ Verify Deployment

```bash
# Test health endpoint
curl https://ai-hoc-tap-api.your-account.workers.dev/api/health

# Expected response
{"status":"ok","version":"2.0.0"}
```

---

## 🎉 Done!

Your backend is now live! 

### Next Steps:

1. **Deploy Frontend** (optional):
   ```bash
   npm run build
   wrangler pages deploy dist
   ```

2. **Test Integration**:
   - Open frontend in browser
   - Try to register/login
   - Test AI features

3. **Monitor**:
   ```bash
   wrangler tail
   ```

---

## 📚 Need Help?

### Common Issues

**"GEMINI_API_KEY is not configured"**
```bash
wrangler secret put GEMINI_API_KEY
```

**"CORS Error"**
Update `ALLOWED_ORIGINS` in `workers/wrangler.toml`

**"Deployment failed"**
Check logs: `wrangler tail`

### Documentation

- **Quick Start**: `CLOUDFLARE_DEPLOYMENT_README.md`
- **Detailed Setup**: `CLOUDFLARE_AI_GATEWAY_SETUP.md`
- **Testing**: `INTEGRATION_TEST.md`
- **Architecture**: `ARCHITECTURE_DIAGRAM.md`

---

## 🎯 Success Criteria

After deployment, you should see:

- ✅ Health check returns `{"status":"ok"}`
- ✅ No errors in logs
- ✅ Frontend can call backend API
- ✅ Users can register/login
- ✅ AI features working

---

## 🚀 You're Ready!

Run the deployment script now:

**Windows:**
```bash
cd workers && deploy.bat
```

**macOS/Linux:**
```bash
cd workers && chmod +x deploy.sh && ./deploy.sh
```

---

**Questions?** See the documentation files above.

**Ready?** Let's deploy! 🎊

