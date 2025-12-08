import { describe, it, expect } from 'vitest';
import { ErrorCode, getErrorCodeFromStatus, getErrorMessage, AppErrorClass } from '../errorHandler';

describe('errorHandler', () => {
  it('maps HTTP status to error codes', () => {
    expect(getErrorCodeFromStatus(400)).toBe(ErrorCode.INVALID_INPUT);
    expect(getErrorCodeFromStatus(401)).toBe(ErrorCode.UNAUTHORIZED);
    expect(getErrorCodeFromStatus(403)).toBe(ErrorCode.FORBIDDEN);
    expect(getErrorCodeFromStatus(404)).toBe(ErrorCode.NOT_FOUND);
    expect(getErrorCodeFromStatus(408)).toBe(ErrorCode.TIMEOUT);
    expect(getErrorCodeFromStatus(429)).toBe(ErrorCode.RATE_LIMITED);
    expect(getErrorCodeFromStatus(500)).toBe(ErrorCode.SERVER_ERROR);
  });

  it('returns user-friendly messages', () => {
    const err = new AppErrorClass(ErrorCode.UNAUTHORIZED, 'Bạn chưa đăng nhập');
    expect(getErrorMessage(err)).toContain('Bạn chưa đăng nhập');
    expect(getErrorMessage(new Error('x'))).toBe('x');
    expect(getErrorMessage('unknown' as any)).toBeTypeOf('string');
  });
});

