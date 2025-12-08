/**
 * ✅ PHASE 2 - STEP 2.1: Authentication Schemas with Zod
 * 
 * Validate:
 * - Login request/response
 * - Register request/response
 * - User profile
 * - Token data
 */

import { z } from 'zod';

/**
 * ✅ Login request schema
 */
export const LoginRequestSchema = z.object({
  email: z.string().email('Email không hợp lệ').optional(),
  username: z.string().min(3, 'Username phải có ít nhất 3 ký tự').optional(),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
}).refine(
  (data) => data.email || data.username,
  'Vui lòng nhập email hoặc username'
);

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * ✅ Register request schema
 */
export const RegisterRequestSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  username: z.string().min(3, 'Username phải có ít nhất 3 ký tự').max(20, 'Username tối đa 20 ký tự'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Mật khẩu phải chứa chữ hoa, chữ thường và số'
  ),
  displayName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(50, 'Tên tối đa 50 ký tự'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  }
);

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

/**
 * ✅ User schema
 */
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  createdAt: z.number(),
  lastLogin: z.number().optional(),
  isAdmin: z.boolean().optional(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * ✅ Token data schema
 */
export const TokenDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
  tokenType: z.string().optional(),
});

export type TokenData = z.infer<typeof TokenDataSchema>;

/**
 * ✅ Login response schema
 */
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional(),
  tokenType: z.string().optional(),
  data: z.object({
    user: UserSchema,
    token: z.string(),
    refreshToken: z.string().optional(),
    expiresAt: z.number().optional(),
  }).optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * ✅ Register response schema
 */
export const RegisterResponseSchema = LoginResponseSchema;

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

/**
 * ✅ Update profile request schema
 */
export const UpdateProfileRequestSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

/**
 * ✅ Change password request schema
 */
export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Mật khẩu phải chứa chữ hoa, chữ thường và số'
  ),
  confirmPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  }
);

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

/**
 * ✅ Forgot password request schema
 */
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

/**
 * ✅ Reset password request schema
 */
export const ResetPasswordRequestSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Mật khẩu phải chứa chữ hoa, chữ thường và số'
  ),
  confirmPassword: z.string(),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  }
);

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

/**
 * ✅ Validate login request
 */
export function validateLoginRequest(data: unknown): LoginRequest {
  return LoginRequestSchema.parse(data);
}

/**
 * ✅ Validate register request
 */
export function validateRegisterRequest(data: unknown): RegisterRequest {
  return RegisterRequestSchema.parse(data);
}

/**
 * ✅ Validate user
 */
export function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}

/**
 * ✅ Validate token data
 */
export function validateTokenData(data: unknown): TokenData {
  return TokenDataSchema.parse(data);
}

/**
 * ✅ Validate login response
 */
export function validateLoginResponse(data: unknown): LoginResponse {
  return LoginResponseSchema.parse(data);
}

/**
 * ✅ Safe validation (returns null on error)
 */
export function safeValidateLoginRequest(data: unknown): LoginRequest | null {
  try {
    return LoginRequestSchema.parse(data);
  } catch (error) {
    console.error('Login request validation error:', error);
    return null;
  }
}

export function safeValidateRegisterRequest(data: unknown): RegisterRequest | null {
  try {
    return RegisterRequestSchema.parse(data);
  } catch (error) {
    console.error('Register request validation error:', error);
    return null;
  }
}

export function safeValidateUser(data: unknown): User | null {
  try {
    return UserSchema.parse(data);
  } catch (error) {
    console.error('User validation error:', error);
    return null;
  }
}

export function safeValidateTokenData(data: unknown): TokenData | null {
  try {
    return TokenDataSchema.parse(data);
  } catch (error) {
    console.error('Token data validation error:', error);
    return null;
  }
}

export function safeValidateLoginResponse(data: unknown): LoginResponse | null {
  try {
    return LoginResponseSchema.parse(data);
  } catch (error) {
    console.error('Login response validation error:', error);
    return null;
  }
}

export default {
  LoginRequestSchema,
  RegisterRequestSchema,
  UserSchema,
  TokenDataSchema,
  LoginResponseSchema,
  RegisterResponseSchema,
  UpdateProfileRequestSchema,
  ChangePasswordRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  validateLoginRequest,
  validateRegisterRequest,
  validateUser,
  validateTokenData,
  validateLoginResponse,
  safeValidateLoginRequest,
  safeValidateRegisterRequest,
  safeValidateUser,
  safeValidateTokenData,
  safeValidateLoginResponse,
};

