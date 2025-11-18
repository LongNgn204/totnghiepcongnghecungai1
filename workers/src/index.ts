// Main API Router
import { Router } from 'itty-router';
import {
  corsHeaders,
  jsonResponse,
  errorResponse,
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
} from './utils';
import { requireAuth, ensureUser } from './auth';

export interface Env {
  DB: D1Database;
  GEMINI_API_KEY?: string;
  ALLOWED_ORIGINS?: string;
}

const router = Router();

// CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }));

// Health check
router.get('/api/health', () =>
  successResponse({ status: 'ok', version: '1.0.0' })
);

// ============= USERS =============

router.post('/api/users/register', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const body = await request.json();

    await ensureUser(env.DB, userId);

    if (body.name) {
      await env.DB.prepare('UPDATE users SET name = ? WHERE id = ?')
        .bind(body.name, userId)
        .run();
    }

    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    return successResponse(user, 'User registered successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/users/me', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);

    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    return successResponse(user);
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.put('/api/users/me', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const body = await request.json();

    const { name, email, avatar } = body;
    await env.DB.prepare(
      'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), avatar = COALESCE(?, avatar) WHERE id = ?'
    )
      .bind(name, email, avatar, userId)
      .run();

    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    return successResponse(user, 'Profile updated');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= EXAMS =============

router.post('/api/exams', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);

    const body = await request.json();
    const {
      id,
      title,
      category,
      grade,
      questions,
      answers,
      score,
      total_questions,
      duration,
      completed_at,
    } = body;

    await env.DB.prepare(
      `INSERT INTO exams (id, user_id, title, category, grade, questions, answers, score, total_questions, duration, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        userId,
        title,
        category,
        grade,
        JSON.stringify(questions),
        JSON.stringify(answers),
        score,
        total_questions,
        duration,
        completed_at
      )
      .run();

    return successResponse({ id }, 'Exam saved successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/exams', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const exams = await env.DB.prepare(
      'SELECT * FROM exams WHERE user_id = ? ORDER BY completed_at DESC LIMIT ? OFFSET ?'
    )
      .bind(userId, limit, offset)
      .all();

    // Parse JSON fields
    const results = exams.results.map((exam: any) => ({
      ...exam,
      questions: JSON.parse(exam.questions),
      answers: exam.answers ? JSON.parse(exam.answers) : null,
    }));

    return successResponse({
      exams: results,
      total: exams.results.length,
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/exams/:id', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;

    const exam = await env.DB.prepare(
      'SELECT * FROM exams WHERE id = ? AND user_id = ?'
    )
      .bind(id, userId)
      .first();

    if (!exam) {
      return errorResponse('Exam not found', 404);
    }

    return successResponse({
      ...exam,
      questions: JSON.parse(exam.questions as string),
      answers: exam.answers ? JSON.parse(exam.answers as string) : null,
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.delete('/api/exams/:id', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM exams WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run();

    return successResponse(null, 'Exam deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/exams/stats', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);

    const stats = await env.DB.prepare(
      `SELECT 
        COUNT(*) as total_exams,
        AVG(score) as avg_score,
        MAX(score) as max_score,
        MIN(score) as min_score,
        SUM(duration) as total_time
      FROM exams WHERE user_id = ?`
    )
      .bind(userId)
      .first();

    return successResponse(stats);
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= FLASHCARDS =============

router.post('/api/flashcards/decks', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);

    const body = await request.json();
    const { id, title, description, category, grade, is_public, color } = body;
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO flashcard_decks (id, user_id, title, description, category, grade, is_public, color, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, userId, title, description, category, grade, is_public ? 1 : 0, color, now, now)
      .run();

    return successResponse({ id }, 'Deck created successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/flashcards/decks', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);

    const decks = await env.DB.prepare(
      'SELECT * FROM flashcard_decks WHERE user_id = ? ORDER BY updated_at DESC'
    )
      .bind(userId)
      .all();

    return successResponse({ decks: decks.results });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/flashcards/decks/:id', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;

    const deck = await env.DB.prepare(
      'SELECT * FROM flashcard_decks WHERE id = ? AND user_id = ?'
    )
      .bind(id, userId)
      .first();

    if (!deck) {
      return errorResponse('Deck not found', 404);
    }

    const cards = await env.DB.prepare(
      'SELECT * FROM flashcards WHERE deck_id = ? ORDER BY created_at DESC'
    )
      .bind(id)
      .all();

    return successResponse({
      ...deck,
      cards: cards.results.map((card: any) => ({
        ...card,
        tags: card.tags ? JSON.parse(card.tags) : [],
      })),
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.delete('/api/flashcards/decks/:id', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM flashcard_decks WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run();

    return successResponse(null, 'Deck deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.post('/api/flashcards/decks/:deckId/cards', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { deckId } = request.params;
    const body = await request.json();

    const { id, question, answer, difficulty, tags } = body;
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO flashcards (id, deck_id, question, answer, difficulty, tags, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, deckId, question, answer, difficulty, JSON.stringify(tags), now)
      .run();

    // Update deck updated_at
    await env.DB.prepare('UPDATE flashcard_decks SET updated_at = ? WHERE id = ?')
      .bind(now, deckId)
      .run();

    return successResponse({ id }, 'Card created successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.put('/api/flashcards/cards/:id', async (request, env: Env) => {
  try {
    const { id } = request.params;
    const body = await request.json();

    const {
      ease_factor,
      interval,
      repetitions,
      mastery_level,
      review_count,
      correct_count,
      next_review,
      last_reviewed,
    } = body;

    await env.DB.prepare(
      `UPDATE flashcards SET 
        ease_factor = ?, interval = ?, repetitions = ?, mastery_level = ?,
        review_count = ?, correct_count = ?, next_review = ?, last_reviewed = ?
       WHERE id = ?`
    )
      .bind(
        ease_factor,
        interval,
        repetitions,
        mastery_level,
        review_count,
        correct_count,
        next_review,
        last_reviewed,
        id
      )
      .run();

    return successResponse({ id }, 'Card updated');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.delete('/api/flashcards/cards/:id', async (request, env: Env) => {
  try {
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM flashcards WHERE id = ?')
      .bind(id)
      .run();

    return successResponse(null, 'Card deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= CHAT =============

router.post('/api/chat/sessions', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);

    const body = await request.json();
    const { id, title, category, grade, messages } = body;
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO chat_sessions (id, user_id, title, category, grade, messages, message_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        userId,
        title,
        category,
        grade,
        JSON.stringify(messages),
        messages.length,
        now,
        now
      )
      .run();

    return successResponse({ id }, 'Chat session created');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/chat/sessions', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);

    const sessions = await env.DB.prepare(
      'SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 50'
    )
      .bind(userId)
      .all();

    return successResponse({
      sessions: sessions.results.map((s: any) => ({
        ...s,
        messages: JSON.parse(s.messages),
      })),
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/chat/sessions/:id', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;

    const session = await env.DB.prepare(
      'SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?'
    )
      .bind(id, userId)
      .first();

    if (!session) {
      return errorResponse('Chat session not found', 404);
    }

    return successResponse({
      ...session,
      messages: JSON.parse(session.messages as string),
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.put('/api/chat/sessions/:id', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;
    const body = await request.json();
    const { messages } = body;

    await env.DB.prepare(
      'UPDATE chat_sessions SET messages = ?, message_count = ?, updated_at = ? WHERE id = ? AND user_id = ?'
    )
      .bind(JSON.stringify(messages), messages.length, Date.now(), id, userId)
      .run();

    return successResponse(null, 'Chat updated');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.delete('/api/chat/sessions/:id', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run();

    return successResponse(null, 'Chat deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= PROGRESS =============

router.post('/api/progress/sessions', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);

    const body = await request.json();
    const { id, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date } = body;

    await env.DB.prepare(
      `INSERT INTO study_sessions (id, user_id, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, userId, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date)
      .run();

    return successResponse({ id }, 'Session recorded');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/progress/stats', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);

    const stats = await env.DB.prepare(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(duration) as total_time,
        AVG(CASE WHEN activity = 'exam' THEN score END) as avg_exam_score,
        SUM(cards_studied) as total_cards,
        SUM(questions_asked) as total_questions
      FROM study_sessions WHERE user_id = ?`
    )
      .bind(userId)
      .first();

    return successResponse(stats);
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/progress/chart/:period', async (request, env: Env) => {
  try {
    const userId = requireAuth(request);
    const { period } = request.params;
    const days = parseInt(period) || 7;

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const sessions = await env.DB.prepare(
      'SELECT * FROM study_sessions WHERE user_id = ? AND session_date >= ? ORDER BY session_date ASC'
    )
      .bind(userId, cutoff)
      .all();

    return successResponse({ sessions: sessions.results });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= LEADERBOARD =============

router.get('/api/leaderboard', async (request, env: Env) => {
  try {
    const leaderboard = await env.DB.prepare(
      `SELECT 
        u.id as user_id,
        u.name as user_name,
        COUNT(DISTINCT CASE WHEN s.activity = 'exam' THEN s.id END) as exams_completed,
        SUM(CASE WHEN s.activity = 'flashcard' THEN s.cards_studied ELSE 0 END) as flashcards_learned,
        SUM(s.duration) as study_time,
        (COUNT(DISTINCT CASE WHEN s.activity = 'exam' THEN s.id END) * 10 +
         SUM(CASE WHEN s.activity = 'flashcard' THEN s.cards_studied ELSE 0 END) +
         SUM(s.duration) / 60) as points
      FROM users u
      LEFT JOIN study_sessions s ON u.id = s.user_id
      GROUP BY u.id
      ORDER BY points DESC
      LIMIT 100`
    )
      .all();

    return successResponse({ leaderboard: leaderboard.results });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// 404
router.all('*', () => errorResponse('Not Found', 404));

// Export handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await router.handle(request, env, ctx);
    } catch (error: any) {
      return errorResponse(error.message || 'Internal Server Error', 500);
    }
  },
};
