// Authentication utilities for Cloudflare Workers
import bcrypt from 'bcryptjs';
import { sendResetCodeEmail, type EmailConfig } from './email-service';

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate simple token (UUID based)
export function generateToken(userId: string): string {
  const randomPart = crypto.randomUUID();
  const userPart = btoa(userId);
  return `${randomPart}.${userPart}`;
}

// Verify and extract userId from token
export function decodeToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    return atob(parts[1]);
  } catch {
    return null;
  }
}

// Middleware: Require authentication
export async function requireAuth(request: any, db: any): Promise<string> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED: No token provided');
  }

  const token = authHeader.substring(7);
  const decodedUserId = decodeToken(token);

  if (!decodedUserId) {
    throw new Error('UNAUTHORIZED: Invalid token');
  }

  // Verify session exists, not expired, and matches user
  const session = await db.prepare(
    'SELECT user_id FROM auth_sessions WHERE token = ? AND expires_at > ?'
  ).bind(token, Date.now()).first();

  if (!session) {
    throw new Error('UNAUTHORIZED: Session expired');
  }

  const userId = session.user_id as string;
  if (userId !== decodedUserId) {
    throw new Error('UNAUTHORIZED: Token mismatch');
  }

  // Verify user exists and is active
  const user = await db.prepare(
    'SELECT id, is_active FROM auth_users WHERE id = ?'
  ).bind(userId).first();

  if (!user || !user.is_active) {
    throw new Error('UNAUTHORIZED: User not found or inactive');
  }

  return userId;
}

// Register new user
export async function registerUser(db: any, data: {
  username?: string;
  email: string;
  password: string;
  displayName: string;
  securityQuestion: string;
  securityAnswer: string;
}) {
  // Auto-generate username from email if not provided
  const username = data.username || data.email.split('@')[0];

  // Validate input
  if (!username || username.length < 3) {
    throw new Error('Username phải có ít nhất 3 ký tự');
  }

  if (!data.email || !data.email.includes('@')) {
    throw new Error('Email không hợp lệ');
  }

  if (!data.password || data.password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  // Check if username or email already exists
  const existing = await db.prepare(
    'SELECT id FROM auth_users WHERE username = ? OR email = ?'
  ).bind(username.toLowerCase(), data.email.toLowerCase()).first();

  if (existing) {
    throw new Error('Username hoặc email đã được sử dụng');
  }

  if (!data.securityQuestion || data.securityQuestion.length < 5) {
    throw new Error('Câu hỏi bảo mật phải có ít nhất 5 ký tự');
  }
  if (!data.securityAnswer || data.securityAnswer.length < 3) {
    throw new Error('Câu trả lời bảo mật phải có ít nhất 3 ký tự');
  }

  // Hash password and security answer
  const passwordHash = await hashPassword(data.password);
  const securityAnswerHash = await hashPassword(data.securityAnswer.toLowerCase().trim());

  // Create user
  const userId = crypto.randomUUID();
  const now = Date.now();

  await db.prepare(
    `INSERT INTO auth_users 
    (id, username, email, password_hash, display_name, created_at, last_login, is_active, security_question, security_answer_hash) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    userId,
    username.toLowerCase(),
    data.email.toLowerCase(),
    passwordHash,
    data.displayName,
    now,
    now,
    1,
    data.securityQuestion,
    securityAnswerHash
  ).run();

  // Generate token
  const token = generateToken(userId);
  const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 days

  await db.prepare(
    'INSERT INTO auth_sessions (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), userId, token, expiresAt, now).run();

  return {
    user: {
      id: userId,
      username: username.toLowerCase(),
      email: data.email.toLowerCase(),
      displayName: data.displayName,
      createdAt: now
    },
    token
  };
}

// Login user
export async function loginUser(db: any, identifier: string, password: string) {
  // Find user by username OR email
  const user = await db.prepare(
    'SELECT * FROM auth_users WHERE username = ? OR email = ?'
  ).bind(identifier.toLowerCase(), identifier.toLowerCase()).first();

  if (!user) {
    throw new Error('Tài khoản không tồn tại');
  }

  if (!user.is_active) {
    throw new Error('Tài khoản đã bị khóa');
  }

  // Verify password
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    throw new Error('Mật khẩu không đúng');
  }

  // Update last login
  await db.prepare(
    'UPDATE auth_users SET last_login = ? WHERE id = ?'
  ).bind(Date.now(), user.id).run();

  // Generate new token
  const token = generateToken(user.id);
  const now = Date.now();
  const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 days

  await db.prepare(
    'INSERT INTO auth_sessions (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), user.id, token, expiresAt, now).run();

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.display_name,
      avatar: user.avatar,
      bio: user.bio
    },
    token
  };
}

// Logout user (invalidate token)
export async function logoutUser(db: any, token: string) {
  await db.prepare('DELETE FROM auth_sessions WHERE token = ?').bind(token).run();
}

// Get user by ID
export async function getUserById(db: any, userId: string) {
  const user = await db.prepare(
    'SELECT id, username, email, display_name, avatar, bio, created_at, last_login, is_admin FROM auth_users WHERE id = ?'
  ).bind(userId).first();

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.display_name,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.created_at,
    lastLogin: user.last_login,
    isAdmin: user.is_admin === 1
  };
}

// Update user profile
export async function updateUserProfile(db: any, userId: string, updates: {
  displayName?: string;
  avatar?: string;
  bio?: string;
}) {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.displayName !== undefined) {
    fields.push('display_name = ?');
    values.push(updates.displayName);
  }

  if (updates.avatar !== undefined) {
    fields.push('avatar = ?');
    values.push(updates.avatar);
  }

  if (updates.bio !== undefined) {
    fields.push('bio = ?');
    values.push(updates.bio);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(userId);

  await db.prepare(
    `UPDATE auth_users SET ${fields.join(', ')} WHERE id = ?`
  ).bind(...values).run();

  return getUserById(db, userId);
}

// Change password
export async function changePassword(db: any, userId: string, oldPassword: string, newPassword: string) {
  // Get current password hash
  const user = await db.prepare(
    'SELECT password_hash FROM auth_users WHERE id = ?'
  ).bind(userId).first();

  if (!user) {
    throw new Error('User not found');
  }

  // Verify old password
  const valid = await verifyPassword(oldPassword, user.password_hash);
  if (!valid) {
    throw new Error('Mật khẩu hiện tại không đúng');
  }

  // Validate new password
  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await db.prepare(
    'UPDATE auth_users SET password_hash = ? WHERE id = ?'
  ).bind(newPasswordHash, userId).run();

  // Invalidate all sessions (force re-login)
  await db.prepare('DELETE FROM auth_sessions WHERE user_id = ?').bind(userId).run();
}

// Request password reset - Generate reset token
export async function requestPasswordReset(
  db: any,
  email: string,
  emailConfig?: EmailConfig
) {
  // Find user by email
  const user = await db.prepare(
    'SELECT id, email, display_name FROM auth_users WHERE email = ? AND is_active = 1'
  ).bind(email).first();

  if (!user) {
    // For security: don't reveal if email exists
    return { success: true, message: 'Nếu email tồn tại, mã reset đã được gửi đến email' };
  }

  // Generate reset token (6 digit code for simplicity)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const tokenId = crypto.randomUUID();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Save token to database
  await db.prepare(
    'INSERT INTO password_reset_tokens (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(tokenId, user.id, resetCode, expiresAt, Date.now()).run();

  // Send email if config is provided
  if (emailConfig && emailConfig.apiKey) {
    try {
      const emailResult = await sendResetCodeEmail(
        emailConfig,
        user.email,
        resetCode,
        user.display_name
      );

      if (!emailResult.success) {
        console.error('Failed to send reset email:', emailResult.error);
        // Continue anyway, user can still use code if shown in dev mode
      }
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }

  // Return response (show code in dev mode only)
  const hasEmail = !!(emailConfig && emailConfig.apiKey);

  // Luôn trả resetCode trong response theo yêu cầu sản phẩm (kể cả khi có email)
  return {
    success: true,
    message: hasEmail
      ? 'Mã reset đã được gửi đến email của bạn (đồng thời hiển thị bên dưới để nhập nhanh)'
      : 'Mã reset đã được tạo (Dev mode - email không được gửi)',
    resetCode
  };
}

// Verify reset token
export async function verifyResetToken(db: any, email: string, token: string) {
  const user = await db.prepare(
    'SELECT id FROM auth_users WHERE email = ?'
  ).bind(email).first();

  if (!user) {
    throw new Error('Email không tồn tại');
  }

  const resetToken = await db.prepare(
    'SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token = ? AND user_id = ?'
  ).bind(token, user.id).first();

  if (!resetToken) {
    throw new Error('Mã reset không hợp lệ');
  }

  if (resetToken.used === 1) {
    throw new Error('Mã reset đã được sử dụng');
  }

  if (resetToken.expires_at < Date.now()) {
    throw new Error('Mã reset đã hết hạn');
  }

  return { valid: true, userId: resetToken.user_id, tokenId: resetToken.id };
}

// Reset password with token
export async function resetPassword(db: any, email: string, token: string, newPassword: string) {
  // Verify token
  const verification = await verifyResetToken(db, email, token);

  // Validate new password
  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await db.prepare(
    'UPDATE auth_users SET password_hash = ? WHERE id = ?'
  ).bind(passwordHash, verification.userId).run();

  // Mark token as used
  await db.prepare(
    'UPDATE password_reset_tokens SET used = 1 WHERE id = ?'
  ).bind(verification.tokenId).run();

  // Invalidate all sessions
  await db.prepare('DELETE FROM auth_sessions WHERE user_id = ?').bind(verification.userId).run();

  return { success: true, message: 'Mật khẩu đã được reset thành công' };
}

// Get security question for a user by email
export async function getSecurityQuestionByEmail(db: any, email: string) {
  const user = await db.prepare(
    'SELECT security_question FROM auth_users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (!user || !user.security_question) {
    throw new Error('Không tìm thấy tài khoản hoặc tài khoản chưa có câu hỏi bảo mật.');
  }

  return { securityQuestion: user.security_question };
}

// Reset password using security question and answer
export async function resetPasswordBySecurityQuestion(db: any, data: {
  email: string;
  securityAnswer: string;
  newPassword: string;
}) {
  const { email, securityAnswer, newPassword } = data;

  // Find user by email
  const user = await db.prepare(
    'SELECT id, security_answer_hash FROM auth_users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (!user || !user.security_answer_hash) {
    throw new Error('Tài khoản không hợp lệ hoặc chưa thiết lập câu trả lời bảo mật.');
  }

  // Verify security answer
  const isAnswerCorrect = await verifyPassword(securityAnswer.toLowerCase().trim(), user.security_answer_hash);

  if (!isAnswerCorrect) {
    throw new Error('Câu trả lời bảo mật không đúng.');
  }

  // Validate new password
  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
  }

  // Hash and update password
  const newPasswordHash = await hashPassword(newPassword);
  await db.prepare(
    'UPDATE auth_users SET password_hash = ? WHERE id = ?'
  ).bind(newPasswordHash, user.id).run();

  // Invalidate all user sessions
  await db.prepare('DELETE FROM auth_sessions WHERE user_id = ?').bind(user.id).run();

  return { success: true, message: 'Mật khẩu đã được cập nhật thành công.' };
}
