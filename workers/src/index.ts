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
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  updateUserProfile,
  changePassword,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  requireAuth,
  hashPassword,
  getSecurityQuestionByEmail,
  resetPasswordBySecurityQuestion,
  generateToken,
  decodeToken
} from './auth-service';
import {
  updateUserData,
  changeUserPassword as changeUserPasswordAdmin
} from './management/data-manager';
import { callAIWorker } from './ai-worker-service';

export interface Env {
  DB: D1Database;
  AI?: any; // Cloudflare AI Workers binding
  GEMINI_API_KEY?: string;
  USE_AI_WORKERS?: string;
  ALLOWED_ORIGINS?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_FROM_NAME?: string;
}

const router = Router();

// CORS preflight with allowlist
router.options('*', (request, env: Env) => {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
  const isAllowed = allowed.length === 0 || allowed.includes(origin) || allowed.includes('*');
  const headers = new Headers(corsHeaders);
  headers.set('Vary', 'Origin');
  headers.set('Access-Control-Allow-Origin', isAllowed ? origin || '*' : 'null');
  return new Response(null, { headers });
});


// Health check
router.get('/api/health', () =>
  successResponse({ status: 'ok', version: '2.0.0' })
);

// ============= AUTHENTICATION =============

// Register
router.post('/api/auth/register', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { username, email, password, displayName, securityQuestion, securityAnswer } = body;

    if (!email || !password || !displayName || !securityQuestion || !securityAnswer) {
      return badRequestResponse('Thiếu các trường bắt buộc: email, password, displayName, securityQuestion, securityAnswer');
    }

    const result = await registerUser(env.DB, {
      username,
      email,
      password,
      displayName,
      securityQuestion,
      securityAnswer
    });

    return successResponse(result, 'Registration successful');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// Login
router.post('/api/auth/login', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { username, email, password } = body;

    const identifier = username || email;

    if (!identifier || !password) {
      return badRequestResponse('Email/Username and password are required');
    }

    const result = await loginUser(env.DB, identifier, password);

    return successResponse(result, 'Login successful');
  } catch (error: any) {
    return errorResponse(error.message, 401);
  }
});

// Logout
router.post('/api/auth/logout', async (request, env: Env) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return unauthorizedResponse();
    }

    const token = authHeader.substring(7);
    await logoutUser(env.DB, token);

    return successResponse(null, 'Logout successful');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// Refresh access token
router.post('/api/auth/refresh', async (request, env: Env) => {
  try {
    const body: any = await request.json().catch(() => ({}));
    const authHeader = request.headers.get('Authorization');
    const provided = body?.refreshToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);
    if (!provided) {
      return badRequestResponse('Thiếu refresh token');
    }

    // Validate existing session
    const session = await env.DB.prepare('SELECT user_id, expires_at FROM auth_sessions WHERE token = ? AND expires_at > ?')
      .bind(provided, Date.now())
      .first();
    if (!session) {
      return unauthorizedResponse('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    }

    const userId = session.user_id as string;

    // Rotate token: delete old session and create new one
    await env.DB.prepare('DELETE FROM auth_sessions WHERE token = ?').bind(provided).run();

    const newToken = generateToken(userId);
    const now = Date.now();
    const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 days

    await env.DB.prepare(
      'INSERT INTO auth_sessions (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), userId, newToken, expiresAt, now).run();

    return successResponse({ accessToken: newToken, refreshToken: newToken, expiresAt });
  } catch (error: any) {
    return errorResponse(error.message || 'Không thể làm mới token', 400);
  }
});

// Get current user
router.get('/api/auth/me', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const user = await getUserById(env.DB, userId);

    return successResponse(user);
  } catch (error: any) {
    return unauthorizedResponse(error.message);
  }
});

// Update profile
router.put('/api/auth/profile', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { displayName, avatar, bio } = body;
    const updatedUser = await updateUserProfile(env.DB, userId, {
      displayName,
      avatar,
      bio
    });

    return successResponse(updatedUser, 'Profile updated');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// Change password
router.post('/api/auth/change-password', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return badRequestResponse('Old and new passwords are required');
    }

    await changePassword(env.DB, userId, oldPassword, newPassword);

    return successResponse(null, 'Password changed successfully');
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// Forgot password
router.post('/api/auth/forgot-password', async () => {
  return badRequestResponse('Endpoint deprecated. Use /api/auth/request-reset and /api/auth/reset-password');
});

// Request password reset code (via email in prod, returns code in dev)
router.post('/api/auth/request-reset', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { email } = body;
    if (!email) return badRequestResponse('Email là bắt buộc');

    const emailCfg = env.RESEND_API_KEY && env.EMAIL_FROM ? {
      apiKey: env.RESEND_API_KEY,
      fromEmail: env.EMAIL_FROM,
      fromName: env.EMAIL_FROM_NAME || 'AI Học Tập'
    } : undefined;

    const result = await requestPasswordReset(env.DB, email.toLowerCase(), emailCfg as any);
    return successResponse(result, 'Reset code generated');
  } catch (error: any) {
    return errorResponse(error.message || 'Lỗi hệ thống', 500);
  }
});

// Verify reset code
router.post('/api/auth/verify-reset', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { email, token } = body;
    if (!email || !token) return badRequestResponse('Email và mã xác thực là bắt buộc');
    const result = await verifyResetToken(env.DB, email.toLowerCase(), token);
    return successResponse(result, 'Mã xác thực hợp lệ');
  } catch (error: any) {
    return errorResponse(error.message || 'Mã xác thực không hợp lệ', 400);
  }
});

// Reset password with code
router.post('/api/auth/reset-password', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { email, token, newPassword } = body;
    if (!email || !token || !newPassword || newPassword.length < 6) {
      return badRequestResponse('Thiếu email, mã xác thực hoặc mật khẩu mới (>=6)');
    }
    const result = await resetPassword(env.DB, email.toLowerCase(), token, newPassword);
    return successResponse(result, 'Đổi mật khẩu thành công');
  } catch (error: any) {
    return errorResponse(error.message || 'Không thể đổi mật khẩu', 400);
  }
});

// Get security question by email (no user enumeration)
router.get('/api/auth/security-question', async (request, env: Env) => {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    if (!email) {
      return badRequestResponse('Thiếu email');
    }
    // Do not reveal whether the email exists; return a generic message
    return successResponse({ securityQuestion: 'Nếu tài khoản tồn tại, câu hỏi bảo mật sẽ được hiển thị trong quy trình xác thực tiếp theo hoặc gửi qua email.' });
  } catch (error: any) {
    // Always return success to avoid enumeration
    return successResponse({ securityQuestion: 'Nếu tài khoản tồn tại, câu hỏi bảo mật sẽ được hiển thị trong quy trình xác thực tiếp theo hoặc gửi qua email.' });
  }
});

// Reset password with security question
router.post('/api/auth/reset-by-question', async (request, env: Env) => {
  try {
    const body: any = await request.json();
    const { email, securityAnswer, newPassword } = body;

    if (!email || !securityAnswer || !newPassword) {
      return badRequestResponse('Thiếu email, câu trả lời bảo mật hoặc mật khẩu mới');
    }

    const result = await resetPasswordBySecurityQuestion(env.DB, { email, securityAnswer, newPassword });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
});

// ============= AI PROXY =============

router.post('/api/ai/generate', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB); // require auth to use AI
    const body: any = await request.json();
    // Chỉ dùng llama-3.1-8b-instruct
    const modelId = 'llama-3.1-8b-instruct';
    
    // Build contents from either explicit contents or a simple prompt
    const contents = Array.isArray(body.contents)
      ? body.contents
      : (body.prompt
          ? [{ role: 'user', parts: [{ text: String(body.prompt) }]}]
          : undefined);
    
    if (!contents) {
      return badRequestResponse('Thiếu contents hoặc prompt để gọi AI');
    }
    
    if (!env.AI) {
      return errorResponse('Cloudflare AI Workers chưa được cấu hình. Vui lòng kiểm tra wrangler.toml', 500);
    }

    // ✅ Chỉ sử dụng AI Worker Service (Llama 3.1 8B)
    try {

      // Luôn dùng Cloudflare AI Workers (Llama 3.1 8B)
      const data = await callAIWorker(
        'llama-3.1-8b-instruct', // Force llama model
        contents,
        { 
          AI: env.AI, 
          USE_AI_WORKERS: 'true',
          GEMINI_API_KEY: env.GEMINI_API_KEY // Optional fallback
        },
        body.generationConfig
      );
      return successResponse(data);
    } catch (aiError: any) {
      console.error('AI Service error:', aiError);
      return errorResponse(
        aiError.message || 'Lỗi khi gọi dịch vụ AI',
        500
      );
    }
  } catch (error: any) {
    console.error('AI proxy error:', error);
    return errorResponse(error.message || 'AI proxy error', 500);
  }
});

// ============= DASHBOARD & STATS =============

router.get('/api/dashboard/stats', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);

    // 1. Get Study Streak (Consecutive days with study_sessions)
    // This is a simplified query. For production, might need more complex logic.
    const sessions = await env.DB.prepare(
      `SELECT DISTINCT date(session_date / 1000, 'unixepoch', 'localtime') as study_day 
       FROM study_sessions 
       WHERE user_id = ? 
       ORDER BY study_day DESC LIMIT 30`
    ).bind(userId).all();

    let streak = 0;
    if (sessions.results.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let currentDay = new Date();

      // Check if studied today or yesterday to keep streak alive
      const lastStudy = sessions.results[0].study_day as string;
      if (lastStudy === today || lastStudy === yesterday) {
        streak = 1;
        for (let i = 0; i < sessions.results.length - 1; i++) {
          const d1 = new Date(sessions.results[i].study_day as string);
          const d2 = new Date(sessions.results[i + 1].study_day as string);
          const diffTime = Math.abs(d1.getTime() - d2.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    // 2. Weekly Goal Progress (Example: 10 hours/week)
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday

    const weeklyStats = await env.DB.prepare(
      `SELECT SUM(duration) as total_duration 
       FROM study_sessions 
       WHERE user_id = ? AND session_date >= ?`
    ).bind(userId, startOfWeek.getTime()).first();

    const weeklyDuration = (weeklyStats?.total_duration as number) || 0;
    const weeklyGoal = 36000; // 10 hours in seconds
    const weeklyProgress = Math.min(Math.round((weeklyDuration / weeklyGoal) * 100), 100);

    // 3. Average Score
    const scoreStats = await env.DB.prepare(
      `SELECT AVG(score) as avg_score FROM exams WHERE user_id = ?`
    ).bind(userId).first();
    const avgScore = (scoreStats?.avg_score as number) || 0;

    // 4. Recent Activity
    const recentActivity = await env.DB.prepare(
      `SELECT 'exam' as type, title, completed_at as timestamp, score as value 
       FROM exams WHERE user_id = ? 
       UNION ALL 
       SELECT 'flashcard' as type, 'Luyện tập Flashcards' as title, session_date as timestamp, cards_studied as value 
       FROM study_sessions WHERE user_id = ? AND activity = 'flashcard'
       ORDER BY timestamp DESC LIMIT 5`
    ).bind(userId, userId).all();

    // 5. Chart Data (Last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dayStart = d.getTime();
      const dayEnd = dayStart + 86400000;

      const dayStats = await env.DB.prepare(
        `SELECT SUM(duration) as duration FROM study_sessions 
         WHERE user_id = ? AND session_date >= ? AND session_date < ?`
      ).bind(userId, dayStart, dayEnd).first();

      chartData.push((dayStats?.duration as number) || 0);
    }

    return successResponse({
      streak,
      weeklyProgress,
      avgScore: parseFloat(avgScore.toFixed(1)),
      recentActivity: recentActivity.results,
      chartData
    });

  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= EXAMS =============

router.post('/api/exams', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
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

    // Also record in study_sessions
    await env.DB.prepare(
      `INSERT INTO study_sessions (id, user_id, activity, duration, score, questions_asked, subject, grade, session_date)
       VALUES (?, ?, 'exam', ?, ?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      userId,
      duration,
      score,
      total_questions,
      category,
      grade,
      completed_at
    ).run();

    return successResponse({ id }, 'Exam saved successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/exams', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';
    const grade = url.searchParams.get('grade') || '';

    let query = 'SELECT * FROM exams WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (title LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    query += ' ORDER BY completed_at DESC LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const exams = await env.DB.prepare(query).bind(...params).all();

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
    const userId = await requireAuth(request, env.DB);
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
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;

    await env.DB.prepare('DELETE FROM exams WHERE id = ? AND user_id = ?')
      .bind(id, userId)
      .run();

    return successResponse(null, 'Exam deleted');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= FLASHCARDS =============

router.post('/api/flashcards/decks', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
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
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';
    const grade = url.searchParams.get('grade') || '';

    let query = 'SELECT * FROM flashcard_decks WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const decks = await env.DB.prepare(query).bind(...params).all();

    return successResponse({ decks: decks.results });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/flashcards/decks/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
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
    const userId = await requireAuth(request, env.DB);
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
    const userId = await requireAuth(request, env.DB);
    const { deckId } = request.params;
    const body: any = await request.json();

    // Ownership check: ensure deck belongs to current user
    const deck = await env.DB.prepare('SELECT id FROM flashcard_decks WHERE id = ? AND user_id = ?')
      .bind(deckId, userId)
      .first();
    if (!deck) return unauthorizedResponse('Bạn không có quyền thêm thẻ vào bộ này');

    const { id, question, answer, difficulty, tags } = body;
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO flashcards (id, deck_id, question, answer, difficulty, tags, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, deckId, question, answer, difficulty, JSON.stringify(tags), now)
      .run();

    // Update deck updated_at
    await env.DB.prepare('UPDATE flashcard_decks SET updated_at = ? WHERE id = ? AND user_id = ?')
      .bind(now, deckId, userId)
      .run();

    return successResponse({ id }, 'Card created successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.put('/api/flashcards/cards/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;
    const body: any = await request.json();

    // Ownership check: find deck owner for this card
    const card = await env.DB.prepare('SELECT deck_id FROM flashcards WHERE id = ?').bind(id).first();
    if (!card) return errorResponse('Card not found', 404);
    const owns = await env.DB.prepare('SELECT 1 FROM flashcard_decks WHERE id = ? AND user_id = ?').bind(card.deck_id, userId).first();
    if (!owns) return unauthorizedResponse('Forbidden');

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
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;

    // Ownership check via deck
    const card = await env.DB.prepare('SELECT deck_id FROM flashcards WHERE id = ?').bind(id).first();
    if (!card) return errorResponse('Card not found', 404);
    const owns = await env.DB.prepare('SELECT 1 FROM flashcard_decks WHERE id = ? AND user_id = ?').bind(card.deck_id, userId).first();
    if (!owns) return unauthorizedResponse('Forbidden');

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
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
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
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';
    const grade = url.searchParams.get('grade') || '';

    let query = 'SELECT * FROM chat_sessions WHERE user_id = ?';
    const params = [userId];

    if (search) {
      query += ' AND (title LIKE ? OR json_extract(messages, "$[*].content") LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (grade) {
      query += ' AND grade = ?';
      params.push(grade);
    }

    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const sessions = await env.DB.prepare(query).bind(...params).all();

    return successResponse({
      sessions: sessions.results.map((s: any) => ({
        ...s,
        messages: JSON.parse(s.messages),
      })),
      total: sessions.meta.count || 0,
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.get('/api/chat/sessions/:id', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
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
    const userId = await requireAuth(request, env.DB);
    const { id } = request.params;
    const body: any = await request.json();
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
    const userId = await requireAuth(request, env.DB);
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
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
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
    const userId = await requireAuth(request, env.DB);

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
    const userId = await requireAuth(request, env.DB);
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
        au.id as user_id,
        au.display_name as user_name,
        COUNT(DISTINCT CASE WHEN s.activity = 'exam' THEN s.id END) as exams_completed,
        SUM(CASE WHEN s.activity = 'flashcard' THEN s.cards_studied ELSE 0 END) as flashcards_learned,
        SUM(s.duration) as study_time,
        (COUNT(DISTINCT CASE WHEN s.activity = 'exam' THEN s.id END) * 10 +
         SUM(CASE WHEN s.activity = 'flashcard' THEN s.cards_studied ELSE 0 END) +
         SUM(s.duration) / 60) as points
      FROM auth_users au
      LEFT JOIN study_sessions s ON au.id = s.user_id
      GROUP BY au.id
      ORDER BY points DESC
      LIMIT 100`
    )
      .all();

    return successResponse({ leaderboard: leaderboard.results });
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= SYNC API =============

// Sync data from client to server
router.post('/api/sync', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();
    const now = Date.now();

    const exams = Array.isArray(body.exams) ? body.exams : [];
    const decks = Array.isArray(body.decks) ? body.decks : [];
    const cards = Array.isArray(body.cards) ? body.cards : [];
    const chats = Array.isArray(body.chats) ? body.chats : [];
    const sessions = Array.isArray(body.sessions) ? body.sessions : [];

    // Upsert exams
    for (const e of exams) {
      const completed_at = e.completed_at || now;
      await env.DB.prepare(
        `INSERT INTO exams (id, user_id, title, category, grade, questions, answers, score, total_questions, duration, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           category = excluded.category,
           grade = excluded.grade,
           questions = excluded.questions,
           answers = excluded.answers,
           score = excluded.score,
           total_questions = excluded.total_questions,
           duration = excluded.duration,
           completed_at = excluded.completed_at`)
        .bind(
          e.id,
          userId,
          e.title,
          e.category,
          e.grade,
          JSON.stringify(e.questions || []),
          e.answers ? JSON.stringify(e.answers) : null,
          e.score ?? null,
          e.total_questions ?? null,
          e.duration ?? null,
          completed_at
        )
        .run();
    }

    // Upsert flashcard decks
    for (const d of decks) {
      const created_at = d.created_at || now;
      const updated_at = d.updated_at || now;
      await env.DB.prepare(
        `INSERT INTO flashcard_decks (id, user_id, title, description, category, grade, is_public, color, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           description = excluded.description,
           category = excluded.category,
           grade = excluded.grade,
           is_public = excluded.is_public,
           color = excluded.color,
           updated_at = excluded.updated_at`)
        .bind(
          d.id,
          userId,
          d.title,
          d.description ?? null,
          d.category ?? null,
          d.grade ?? null,
          d.is_public ? 1 : 0,
          d.color ?? null,
          created_at,
          updated_at
        )
        .run();
    }

    // Upsert flashcards (guard: deck must belong to current user)
    for (const c of cards) {
      const created_at = c.created_at || now;
      const deckOwner = await env.DB.prepare('SELECT 1 FROM flashcard_decks WHERE id = ? AND user_id = ?').bind(c.deck_id, userId).first();
      if (!deckOwner) {
        // Skip cards for decks not owned by the user
        continue;
      }
      await env.DB.prepare(
        `INSERT INTO flashcards (id, deck_id, question, answer, difficulty, tags, ease_factor, interval, repetitions, mastery_level, review_count, correct_count, next_review, last_reviewed, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           deck_id = excluded.deck_id,
           question = excluded.question,
           answer = excluded.answer,
           difficulty = excluded.difficulty,
           tags = excluded.tags,
           ease_factor = excluded.ease_factor,
           interval = excluded.interval,
           repetitions = excluded.repetitions,
           mastery_level = excluded.mastery_level,
           review_count = excluded.review_count,
           correct_count = excluded.correct_count,
           next_review = excluded.next_review,
           last_reviewed = excluded.last_reviewed`)
        .bind(
          c.id,
          c.deck_id,
          c.question,
          c.answer,
          c.difficulty ?? 'medium',
          c.tags ? JSON.stringify(c.tags) : null,
          c.ease_factor ?? 2.5,
          c.interval ?? 0,
          c.repetitions ?? 0,
          c.mastery_level ?? 0,
          c.review_count ?? 0,
          c.correct_count ?? 0,
          c.next_review ?? null,
          c.last_reviewed ?? null,
          created_at
        )
        .run();
    }

    // Upsert chat sessions
    for (const s of chats) {
      const created_at = s.created_at || now;
      const updated_at = s.updated_at || now;
      await env.DB.prepare(
        `INSERT INTO chat_sessions (id, user_id, title, category, grade, messages, message_count, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           category = excluded.category,
           grade = excluded.grade,
           messages = excluded.messages,
           message_count = excluded.message_count,
           updated_at = excluded.updated_at`)
        .bind(
          s.id,
          userId,
          s.title,
          s.category ?? null,
          s.grade ?? null,
          JSON.stringify(s.messages || []),
          Array.isArray(s.messages) ? s.messages.length : (s.message_count ?? 0),
          created_at,
          updated_at
        )
        .run();
    }

    // Upsert study sessions
    for (const ss of sessions) {
      const session_date = ss.session_date ?? now;
      await env.DB.prepare(
        `INSERT INTO study_sessions (id, user_id, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           activity = excluded.activity,
           duration = excluded.duration,
           score = excluded.score,
           cards_studied = excluded.cards_studied,
           questions_asked = excluded.questions_asked,
           subject = excluded.subject,
           grade = excluded.grade,
           session_date = excluded.session_date`)
        .bind(
          ss.id,
          userId,
          ss.activity,
          ss.duration ?? 0,
          ss.score ?? null,
          ss.cards_studied ?? 0,
          ss.questions_asked ?? 0,
          ss.subject ?? null,
          ss.grade ?? null,
          session_date
        )
        .run();
    }

    return successResponse({ synced: { exams: exams.length, decks: decks.length, cards: cards.length, chats: chats.length, sessions: sessions.length } }, 'Sync completed');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// Get changes since a timestamp (milliseconds since epoch)
router.get('/api/sync/changes', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const url = new URL(request.url);
    const since = parseInt(url.searchParams.get('since') || '0');

    const result: any = {};

    // Exams - use completed_at as a proxy for updated time
    const examsRes = await env.DB.prepare('SELECT * FROM exams WHERE user_id = ? AND completed_at >= ? ORDER BY completed_at ASC')
      .bind(userId, since)
      .all();
    result.exams = examsRes.results.map((r: any) => ({ ...r, questions: JSON.parse(r.questions), answers: r.answers ? JSON.parse(r.answers) : null }));

    // Decks
    const decksRes = await env.DB.prepare('SELECT * FROM flashcard_decks WHERE user_id = ? AND updated_at >= ? ORDER BY updated_at ASC')
      .bind(userId, since)
      .all();
    result.decks = decksRes.results;

    // Cards - use last_reviewed or created_at
    const cardsRes = await env.DB.prepare('SELECT * FROM flashcards WHERE deck_id IN (SELECT id FROM flashcard_decks WHERE user_id = ?) AND (COALESCE(last_reviewed, created_at) >= ?) ORDER BY COALESCE(last_reviewed, created_at) ASC')
      .bind(userId, since)
      .all();
    result.cards = cardsRes.results.map((c: any) => ({ ...c, tags: c.tags ? JSON.parse(c.tags) : [] }));

    // Chats
    const chatsRes = await env.DB.prepare('SELECT * FROM chat_sessions WHERE user_id = ? AND updated_at >= ? ORDER BY updated_at ASC')
      .bind(userId, since)
      .all();
    result.chats = chatsRes.results.map((s: any) => ({ ...s, messages: JSON.parse(s.messages) }));

    // Study sessions
    const sessionsRes = await env.DB.prepare('SELECT * FROM study_sessions WHERE user_id = ? AND session_date >= ? ORDER BY session_date ASC')
      .bind(userId, since)
      .all();
    result.sessions = sessionsRes.results;

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// ============= MANAGEMENT =============

router.post('/api/management/update-user', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { targetUserId, data } = body;
    const caller = await getUserById(env.DB, userId);
    const idToUpdate = targetUserId || userId; // self-update allowed

    if (targetUserId && !caller.isAdmin) {
      return unauthorizedResponse('Admin access required');
    }

    const updatedUser = await updateUserData(env.DB, idToUpdate, data);
    return successResponse(updatedUser, 'User data updated successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

router.post('/api/management/change-password', async (request, env: Env) => {
  try {
    const userId = await requireAuth(request, env.DB);
    const body: any = await request.json();

    const { targetUserId, newPassword } = body;
    const idToUpdate = targetUserId || userId;

    await changeUserPasswordAdmin(env.DB, idToUpdate, newPassword);
    return successResponse(null, 'Password changed successfully');
  } catch (error: any) {
    return errorResponse(error.message);
  }
});

// 404
router.all('*', () => errorResponse('Not Found', 404));

// Export handler
// Basic in-memory rate limit store (per isolate)
const __rateBuckets = new Map<string, number[]>();
function getIP(req: Request): string {
  return (
    req.headers.get('CF-Connecting-IP') ||
    req.headers.get('X-Forwarded-For') ||
    req.headers.get('X-Real-IP') ||
    'unknown'
  );
}
function allowRequest(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = __rateBuckets.get(key) || [];
  const windowStart = now - windowMs;
  const recent = bucket.filter(ts => ts > windowStart);
  if (recent.length >= limit) {
    __rateBuckets.set(key, recent);
    return false;
  }
  recent.push(now);
  __rateBuckets.set(key, recent);
  return true;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const origin = request.headers.get('Origin') || '';
      const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
      const isAllowed = allowed.length === 0 || allowed.includes(origin) || allowed.includes('*');

      // Simple rate limiting by IP and route group
      const ip = getIP(request);
      const path = url.pathname;
      const method = request.method.toUpperCase();
      if (method !== 'OPTIONS') {
        if (path.startsWith('/api/auth/')) {
          const ok = allowRequest(`auth:${ip}`, 50, 15 * 60 * 1000);
          if (!ok) {
            return errorResponse('Too many requests (auth)', 429);
          }
        } else if (path.startsWith('/api/sync')) {
          const ok = allowRequest(`sync:${ip}`, 300, 15 * 60 * 1000);
          if (!ok) {
            return errorResponse('Too many requests (sync)', 429);
          }
        }
      }

      const res = await router.handle(request, env, ctx);
      // Attach dynamic CORS to all responses
      const headers = new Headers(res?.headers || {});
      headers.set('Vary', 'Origin');
      headers.set('Access-Control-Allow-Origin', isAllowed ? (origin || '*') : 'null');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type, X-User-ID, Authorization');
      headers.set('Access-Control-Max-Age', '86400');

      // Security headers
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('Referrer-Policy', 'no-referrer');
      headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      const csp = [
        "default-src 'self'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data: https:",
        "connect-src 'self'",
        'upgrade-insecure-requests'
      ].join('; ');
      headers.set('Content-Security-Policy', csp);

      return new Response(res?.body, { status: res?.status || 200, headers });
    } catch (error: any) {
      return errorResponse(error.message || 'Internal Server Error', 500);
    }
  },
};
