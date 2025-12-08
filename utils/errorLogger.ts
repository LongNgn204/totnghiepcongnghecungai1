/**
 * ✅ PHASE 1 - STEP 1.5: Error Logger Service
 * 
 * Features:
 * - Log errors to console (development)
 * - Log errors to external service (production)
 * - Track error patterns
 * - Error analytics
 * - Error recovery suggestions
 */

import { AppErrorClass, AppError, ErrorCode, getErrorRecoverySuggestions } from './errorHandler';

export interface ErrorLog {
  id: string;
  code: ErrorCode;
  message: string;
  context?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  userAgent: string;
  url: string;
  details?: any;
  stack?: string;
  userId?: string;
}

/**
 * ✅ Error logger service
 */
export class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log error to console (development only)
   */
  private logToConsole(errorLog: ErrorLog): void {
    if (this.isProduction) return;

    const style = {
      low: 'color: #0066cc; font-weight: bold;',
      medium: 'color: #ff9900; font-weight: bold;',
      high: 'color: #ff3333; font-weight: bold;',
      critical: 'color: #990000; font-weight: bold; background: #ffcccc;',
    };

    const severity = errorLog.severity || 'medium';
    console.group(`%c[${severity.toUpperCase()}] ${errorLog.code}`, style[severity]);
    console.log('Message:', errorLog.message);
    console.log('Context:', errorLog.context);
    console.log('Details:', errorLog.details);
    console.log('Timestamp:', new Date(errorLog.timestamp).toISOString());
    if (errorLog.stack) {
      console.log('Stack:', errorLog.stack);
    }
    console.groupEnd();
  }

  /**
   * Log error to external service (production only)
   */
  private async logToExternalService(errorLog: ErrorLog): Promise<void> {
    if (!this.isProduction) return;

    try {
      // TODO: Implement external error logging service
      // Examples:
      // - Sentry (https://sentry.io)
      // - LogRocket (https://logrocket.com)
      // - Rollbar (https://rollbar.com)
      // - Bugsnag (https://bugsnag.com)

      // Example implementation:
      // await fetch('https://your-error-logging-service.com/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorLog)
      // });

      console.log('[ErrorLogger] External logging not configured');
    } catch (err) {
      console.error('[ErrorLogger] Failed to log to external service:', err);
    }
  }

  /**
   * Log error
   */
  log(error: AppError | Error | unknown, context?: string): ErrorLog {
    try {
      let errorLog: ErrorLog;

      if (error instanceof AppErrorClass) {
        errorLog = {
          id: this.generateErrorId(),
          code: error.code,
          message: error.message,
          context: error.context || context,
          severity: error.severity,
          timestamp: error.timestamp,
          userAgent: navigator.userAgent,
          url: window.location.href,
          details: error.details,
          userId: localStorage.getItem('user_id') || undefined,
        };
      } else if (error instanceof Error) {
        errorLog = {
          id: this.generateErrorId(),
          code: ErrorCode.UNKNOWN_ERROR,
          message: error.message,
          context,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          stack: error.stack,
          userId: localStorage.getItem('user_id') || undefined,
        };
      } else {
        errorLog = {
          id: this.generateErrorId(),
          code: ErrorCode.UNKNOWN_ERROR,
          message: String(error),
          context,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          userId: localStorage.getItem('user_id') || undefined,
        };
      }

      // Add to logs
      this.logs.push(errorLog);

      // Keep only last N logs
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }

      // Log to console
      this.logToConsole(errorLog);

      // Log to external service
      this.logToExternalService(errorLog);

      return errorLog;
    } catch (err) {
      console.error('[ErrorLogger] Failed to log error:', err);
      return {
        id: this.generateErrorId(),
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'Failed to log error',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };
    }
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by code
   */
  getLogsByCode(code: ErrorCode): ErrorLog[] {
    return this.logs.filter(log => log.code === code);
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): ErrorLog[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Get error statistics
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
      byCode: {} as Record<ErrorCode, number>,
      lastError: this.logs[this.logs.length - 1] || null,
    };

    for (const log of this.logs) {
      if (log.severity) {
        stats.bySeverity[log.severity]++;
      }
      stats.byCode[log.code] = (stats.byCode[log.code] || 0) + 1;
    }

    return stats;
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Export logs as CSV
   */
  exportAsCSV(): string {
    const headers = ['ID', 'Code', 'Message', 'Context', 'Severity', 'Timestamp', 'URL'];
    const rows = this.logs.map(log => [
      log.id,
      log.code,
      log.message,
      log.context || '',
      log.severity || '',
      new Date(log.timestamp).toISOString(),
      log.url,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Download logs
   */
  downloadLogs(format: 'json' | 'csv' = 'json'): void {
    const content = format === 'json' ? this.exportAsJSON() : this.exportAsCSV();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${Date.now()}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

/**
 * ✅ Global error logger instance
 */
export const errorLogger = new ErrorLogger();

/**
 * ✅ Log error helper
 */
export function logError(error: AppError | Error | unknown, context?: string): ErrorLog {
  return errorLogger.log(error, context);
}

/**
 * ✅ Get error recovery suggestions
 */
export function getErrorSuggestions(error: AppError | Error | unknown): string[] {
  if (error instanceof AppErrorClass) {
    return getErrorRecoverySuggestions(error);
  }
  return [
    'Thử lại',
    'Làm mới trang',
    'Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục',
  ];
}

export default {
  ErrorLogger,
  errorLogger,
  logError,
  getErrorSuggestions,
};

