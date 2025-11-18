# Setup Instructions

## 1. Tạo D1 Database

```bash
cd workers
npm install
npm run db:create
```

Output sẽ cho `database_id`, copy và paste vào `wrangler.toml`

## 2. Initialize Database Schema

```bash
npm run db:init
```

## 3. Test Local

```bash
npm run dev
```

## 4. Deploy to Production

```bash
npm run deploy
```

## 5. Set Secret (Gemini API Key)

```bash
wrangler secret put GEMINI_API_KEY
# Paste your Gemini API key when prompted
```

## API Endpoints

Base URL: `https://ai-hoc-tap-api.your-account.workers.dev`

### Health Check
- `GET /api/health` - Check API status

### Users
- `POST /api/users/register` - Register/login user
- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update profile

### Exams
- `POST /api/exams` - Save exam result
- `GET /api/exams` - Get all exams (with pagination)
- `GET /api/exams/:id` - Get exam details
- `DELETE /api/exams/:id` - Delete exam
- `GET /api/exams/stats` - Get exam statistics

### Flashcards
- `POST /api/flashcards/decks` - Create deck
- `GET /api/flashcards/decks` - Get all decks
- `GET /api/flashcards/decks/:id` - Get deck with cards
- `PUT /api/flashcards/decks/:id` - Update deck
- `DELETE /api/flashcards/decks/:id` - Delete deck
- `POST /api/flashcards/decks/:id/cards` - Add card to deck
- `PUT /api/flashcards/cards/:id` - Update card
- `DELETE /api/flashcards/cards/:id` - Delete card

### Chat
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions` - Get all chat sessions
- `GET /api/chat/sessions/:id` - Get chat details
- `PUT /api/chat/sessions/:id` - Add message to chat
- `DELETE /api/chat/sessions/:id` - Delete chat

### Progress
- `POST /api/progress/sessions` - Record study session
- `GET /api/progress/stats` - Get overall stats
- `GET /api/progress/chart/:period` - Get chart data (7/14/30 days)
- `GET /api/progress/streak` - Get current streak

### Shared Resources
- `POST /api/shared` - Share resource
- `GET /api/shared` - Browse public resources
- `GET /api/shared/:id` - Get shared resource
- `POST /api/shared/:id/like` - Like resource

### Study Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/join` - Join group
- `DELETE /api/groups/:id/leave` - Leave group
- `POST /api/groups/:id/messages` - Send message

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard

## Authentication

Send `X-User-ID` header with each request:
```
X-User-ID: user_1234567890_abc123xyz
```

The user_id is generated and stored in localStorage on first visit.
