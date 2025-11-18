var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-aptQbt/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-aptQbt/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// node_modules/itty-router/index.mjs
var e = /* @__PURE__ */ __name(({ base: e2 = "", routes: t = [], ...o2 } = {}) => ({ __proto__: new Proxy({}, { get: (o3, s2, r, n) => "handle" == s2 ? r.fetch : (o4, ...a) => t.push([s2.toUpperCase?.(), RegExp(`^${(n = (e2 + o4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a, n]) && r }), routes: t, ...o2, async fetch(e3, ...o3) {
  let s2, r, n = new URL(e3.url), a = e3.query = { __proto__: null };
  for (let [e4, t2] of n.searchParams)
    a[e4] = a[e4] ? [].concat(a[e4], t2) : t2;
  for (let [a2, c2, i2, l2] of t)
    if ((a2 == e3.method || "ALL" == a2) && (r = n.pathname.match(c2))) {
      e3.params = r.groups || {}, e3.route = l2;
      for (let t2 of i2)
        if (null != (s2 = await t2(e3.proxy ?? e3, ...o3)))
          return s2;
    }
} }), "e");
var o = /* @__PURE__ */ __name((e2 = "text/plain; charset=utf-8", t) => (o2, { headers: s2 = {}, ...r } = {}) => void 0 === o2 || "Response" === o2?.constructor.name ? o2 : new Response(t ? t(o2) : o2, { headers: { "content-type": e2, ...s2.entries ? Object.fromEntries(s2) : s2 }, ...r }), "o");
var s = o("application/json; charset=utf-8", JSON.stringify);
var c = o("text/plain; charset=utf-8", String);
var i = o("text/html");
var l = o("image/jpeg");
var p = o("image/png");
var d = o("image/webp");

// src/utils.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-User-ID",
  "Access-Control-Max-Age": "86400"
};
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(message, status = 500) {
  return jsonResponse(
    {
      error: message,
      status,
      timestamp: Date.now()
    },
    status
  );
}
__name(errorResponse, "errorResponse");
function successResponse(data, message) {
  return jsonResponse({
    success: true,
    data,
    message,
    timestamp: Date.now()
  });
}
__name(successResponse, "successResponse");

// src/auth.ts
function getUserIdFromRequest(request) {
  return request.headers.get("X-User-ID");
}
__name(getUserIdFromRequest, "getUserIdFromRequest");
async function ensureUser(db, userId) {
  const existing = await db.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (!existing) {
    await db.prepare(
      "INSERT INTO users (id, name, created_at, last_active) VALUES (?, ?, ?, ?)"
    ).bind(userId, "H\u1ECDc sinh", Date.now(), Date.now()).run();
  } else {
    await db.prepare("UPDATE users SET last_active = ? WHERE id = ?").bind(Date.now(), userId).run();
  }
}
__name(ensureUser, "ensureUser");
function requireAuth(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    throw new Error("Missing X-User-ID header");
  }
  return userId;
}
__name(requireAuth, "requireAuth");

// src/index.ts
var router = e();
router.options("*", () => new Response(null, { headers: corsHeaders }));
router.get(
  "/api/health",
  () => successResponse({ status: "ok", version: "1.0.0" })
);
router.post("/api/users/register", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const body = await request.json();
    await ensureUser(env.DB, userId);
    if (body.name) {
      await env.DB.prepare("UPDATE users SET name = ? WHERE id = ?").bind(body.name, userId).run();
    }
    const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
    return successResponse(user, "User registered successfully");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/users/me", async (request, env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);
    const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
    return successResponse(user);
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.put("/api/users/me", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const body = await request.json();
    const { name, email, avatar } = body;
    await env.DB.prepare(
      "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), avatar = COALESCE(?, avatar) WHERE id = ?"
    ).bind(name, email, avatar, userId).run();
    const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
    return successResponse(user, "Profile updated");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.post("/api/exams", async (request, env) => {
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
      completed_at
    } = body;
    await env.DB.prepare(
      `INSERT INTO exams (id, user_id, title, category, grade, questions, answers, score, total_questions, duration, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
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
    ).run();
    return successResponse({ id }, "Exam saved successfully");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/exams", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const exams = await env.DB.prepare(
      "SELECT * FROM exams WHERE user_id = ? ORDER BY completed_at DESC LIMIT ? OFFSET ?"
    ).bind(userId, limit, offset).all();
    const results = exams.results.map((exam) => ({
      ...exam,
      questions: JSON.parse(exam.questions),
      answers: exam.answers ? JSON.parse(exam.answers) : null
    }));
    return successResponse({
      exams: results,
      total: exams.results.length
    });
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/exams/:id", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;
    const exam = await env.DB.prepare(
      "SELECT * FROM exams WHERE id = ? AND user_id = ?"
    ).bind(id, userId).first();
    if (!exam) {
      return errorResponse("Exam not found", 404);
    }
    return successResponse({
      ...exam,
      questions: JSON.parse(exam.questions),
      answers: exam.answers ? JSON.parse(exam.answers) : null
    });
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.delete("/api/exams/:id", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;
    await env.DB.prepare("DELETE FROM exams WHERE id = ? AND user_id = ?").bind(id, userId).run();
    return successResponse(null, "Exam deleted");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/exams/stats", async (request, env) => {
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
    ).bind(userId).first();
    return successResponse(stats);
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.post("/api/flashcards/decks", async (request, env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);
    const body = await request.json();
    const { id, title, description, category, grade, is_public, color } = body;
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO flashcard_decks (id, user_id, title, description, category, grade, is_public, color, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, userId, title, description, category, grade, is_public ? 1 : 0, color, now, now).run();
    return successResponse({ id }, "Deck created successfully");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/flashcards/decks", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const decks = await env.DB.prepare(
      "SELECT * FROM flashcard_decks WHERE user_id = ? ORDER BY updated_at DESC"
    ).bind(userId).all();
    return successResponse({ decks: decks.results });
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/flashcards/decks/:id", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;
    const deck = await env.DB.prepare(
      "SELECT * FROM flashcard_decks WHERE id = ? AND user_id = ?"
    ).bind(id, userId).first();
    if (!deck) {
      return errorResponse("Deck not found", 404);
    }
    const cards = await env.DB.prepare(
      "SELECT * FROM flashcards WHERE deck_id = ? ORDER BY created_at DESC"
    ).bind(id).all();
    return successResponse({
      ...deck,
      cards: cards.results.map((card) => ({
        ...card,
        tags: card.tags ? JSON.parse(card.tags) : []
      }))
    });
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.delete("/api/flashcards/decks/:id", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;
    await env.DB.prepare("DELETE FROM flashcard_decks WHERE id = ? AND user_id = ?").bind(id, userId).run();
    return successResponse(null, "Deck deleted");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.post("/api/flashcards/decks/:deckId/cards", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { deckId } = request.params;
    const body = await request.json();
    const { id, question, answer, difficulty, tags } = body;
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO flashcards (id, deck_id, question, answer, difficulty, tags, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, deckId, question, answer, difficulty, JSON.stringify(tags), now).run();
    await env.DB.prepare("UPDATE flashcard_decks SET updated_at = ? WHERE id = ?").bind(now, deckId).run();
    return successResponse({ id }, "Card created successfully");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.put("/api/flashcards/cards/:id", async (request, env) => {
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
      last_reviewed
    } = body;
    await env.DB.prepare(
      `UPDATE flashcards SET 
        ease_factor = ?, interval = ?, repetitions = ?, mastery_level = ?,
        review_count = ?, correct_count = ?, next_review = ?, last_reviewed = ?
       WHERE id = ?`
    ).bind(
      ease_factor,
      interval,
      repetitions,
      mastery_level,
      review_count,
      correct_count,
      next_review,
      last_reviewed,
      id
    ).run();
    return successResponse({ id }, "Card updated");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.delete("/api/flashcards/cards/:id", async (request, env) => {
  try {
    const { id } = request.params;
    await env.DB.prepare("DELETE FROM flashcards WHERE id = ?").bind(id).run();
    return successResponse(null, "Card deleted");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.post("/api/chat/sessions", async (request, env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);
    const body = await request.json();
    const { id, title, category, grade, messages } = body;
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO chat_sessions (id, user_id, title, category, grade, messages, message_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      userId,
      title,
      category,
      grade,
      JSON.stringify(messages),
      messages.length,
      now,
      now
    ).run();
    return successResponse({ id }, "Chat session created");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/chat/sessions", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const sessions = await env.DB.prepare(
      "SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 50"
    ).bind(userId).all();
    return successResponse({
      sessions: sessions.results.map((s2) => ({
        ...s2,
        messages: JSON.parse(s2.messages)
      }))
    });
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/chat/sessions/:id", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;
    const session = await env.DB.prepare(
      "SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?"
    ).bind(id, userId).first();
    if (!session) {
      return errorResponse("Chat session not found", 404);
    }
    return successResponse({
      ...session,
      messages: JSON.parse(session.messages)
    });
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.put("/api/chat/sessions/:id", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;
    const body = await request.json();
    const { messages } = body;
    await env.DB.prepare(
      "UPDATE chat_sessions SET messages = ?, message_count = ?, updated_at = ? WHERE id = ? AND user_id = ?"
    ).bind(JSON.stringify(messages), messages.length, Date.now(), id, userId).run();
    return successResponse(null, "Chat updated");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.delete("/api/chat/sessions/:id", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { id } = request.params;
    await env.DB.prepare("DELETE FROM chat_sessions WHERE id = ? AND user_id = ?").bind(id, userId).run();
    return successResponse(null, "Chat deleted");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.post("/api/progress/sessions", async (request, env) => {
  try {
    const userId = requireAuth(request);
    await ensureUser(env.DB, userId);
    const body = await request.json();
    const { id, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date } = body;
    await env.DB.prepare(
      `INSERT INTO study_sessions (id, user_id, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, userId, activity, duration, score, cards_studied, questions_asked, subject, grade, session_date).run();
    return successResponse({ id }, "Session recorded");
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/progress/stats", async (request, env) => {
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
    ).bind(userId).first();
    return successResponse(stats);
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/progress/chart/:period", async (request, env) => {
  try {
    const userId = requireAuth(request);
    const { period } = request.params;
    const days = parseInt(period) || 7;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1e3;
    const sessions = await env.DB.prepare(
      "SELECT * FROM study_sessions WHERE user_id = ? AND session_date >= ? ORDER BY session_date ASC"
    ).bind(userId, cutoff).all();
    return successResponse({ sessions: sessions.results });
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.get("/api/leaderboard", async (request, env) => {
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
    ).all();
    return successResponse({ leaderboard: leaderboard.results });
  } catch (error) {
    return errorResponse(error.message);
  }
});
router.all("*", () => errorResponse("Not Found", 404));
var src_default = {
  async fetch(request, env, ctx) {
    try {
      return await router.handle(request, env, ctx);
    } catch (error) {
      return errorResponse(error.message || "Internal Server Error", 500);
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-aptQbt/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-aptQbt/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
