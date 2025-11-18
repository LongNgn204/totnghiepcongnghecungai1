// Authentication helpers

export function getUserIdFromRequest(request: Request): string | null {
  return request.headers.get('X-User-ID');
}

export async function ensureUser(db: D1Database, userId: string): Promise<void> {
  const existing = await db
    .prepare('SELECT id FROM users WHERE id = ?')
    .bind(userId)
    .first();

  if (!existing) {
    await db
      .prepare(
        'INSERT INTO users (id, name, created_at, last_active) VALUES (?, ?, ?, ?)'
      )
      .bind(userId, 'Học sinh', Date.now(), Date.now())
      .run();
  } else {
    // Update last active
    await db
      .prepare('UPDATE users SET last_active = ? WHERE id = ?')
      .bind(Date.now(), userId)
      .run();
  }
}

export function requireAuth(request: Request): string {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    throw new Error('Missing X-User-ID header');
  }
  return userId;
}
