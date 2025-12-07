/**
 * ✅ PHASE 1 - STEP 1.2: Retry Logic System
 * 
 * Implement exponential backoff retry logic để:
 * - Tự động retry khi network fail
 * - Exponential backoff để tránh overload server
 * - Configurable retry strategy
 * - Support cho custom retry conditions
 */

import { isRetryableError } from './errorHandler';

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number, delay: number) => void;
}

/**
 * ✅ Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 10000, // 10 seconds
  backoffMultiplier: 2,
};

/**
 * ✅ Aggressive retry for critical operations
 */
export const AGGRESSIVE_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  initialDelayMs: 500,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

/**
 * ✅ Conservative retry for non-critical operations
 */
export const CONSERVATIVE_RETRY_CONFIG: RetryConfig = {
  maxRetries: 1,
  initialDelayMs: 2000,
  maxDelayMs: 5000,
  backoffMultiplier: 1,
};

/**
 * ✅ Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ✅ Calculate delay with exponential backoff
 */
export function calculateBackoffDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  multiplier: number
): number {
  const delay = initialDelayMs * Math.pow(multiplier, attempt);
  return Math.min(delay, maxDelayMs);
}

/**
 * ✅ Add jitter to delay to prevent thundering herd
 */
export function addJitter(delay: number, jitterPercent: number = 10): number {
  const jitter = (Math.random() - 0.5) * 2 * (delay * jitterPercent / 100);
  return Math.max(0, delay + jitter);
}

/**
 * ✅ Retry async function with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | null = null;
  let delay = config.initialDelayMs;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry
      const shouldRetry = config.shouldRetry
        ? config.shouldRetry(error, attempt)
        : isRetryableError(error);

      if (attempt < config.maxRetries && shouldRetry) {
        // Calculate delay with jitter
        const delayWithJitter = addJitter(delay);

        // Call retry callback if provided
        if (config.onRetry) {
          config.onRetry(error, attempt + 1, delayWithJitter);
        }

        // Log retry in development
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[RETRY] Attempt ${attempt + 1}/${config.maxRetries} failed. ` +
            `Retrying in ${Math.round(delayWithJitter)}ms...`,
            error
          );
        }

        // Wait before retry
        await sleep(delayWithJitter);

        // Update delay for next iteration
        delay = Math.min(
          delay * config.backoffMultiplier,
          config.maxDelayMs
        );
      } else {
        // No more retries or not retryable
        break;
      }
    }
  }

  throw lastError || new Error('Unknown error');
}

/**
 * ✅ Retry with custom condition
 */
export async function retryAsyncWithCondition<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: any, attempt: number) => boolean,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  return retryAsync(fn, {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
    shouldRetry,
  });
}

/**
 * ✅ Retry with timeout
 */
export async function retryAsyncWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  return Promise.race([
    retryAsync(fn, config),
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

/**
 * ✅ Retry multiple functions in parallel
 */
export async function retryAsyncParallel<T>(
  fns: Array<() => Promise<T>>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T[]> {
  return Promise.all(fns.map(fn => retryAsync(fn, config)));
}

/**
 * ✅ Retry multiple functions in sequence
 */
export async function retryAsyncSequential<T>(
  fns: Array<() => Promise<T>>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T[]> {
  const results: T[] = [];
  for (const fn of fns) {
    results.push(await retryAsync(fn, config));
  }
  return results;
}

/**
 * ✅ Retry with fallback
 */
export async function retryAsyncWithFallback<T>(
  fn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  try {
    return await retryAsync(fn, config);
  } catch (error) {
    console.warn('[FALLBACK] Primary function failed, using fallback', error);
    return fallbackFn();
  }
}

/**
 * ✅ Retry with circuit breaker pattern
 */
export class CircuitBreaker<T> {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private fn: () => Promise<T>,
    private failureThreshold: number = 5,
    private resetTimeoutMs: number = 60000
  ) {}

  async execute(): Promise<T> {
    // Check if circuit should reset
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'half-open';
        this.failureCount = 0;
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await this.fn();
      
      // Success - reset circuit
      if (this.state === 'half-open') {
        this.state = 'closed';
      }
      this.failureCount = 0;
      
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        this.state = 'open';
      }

      throw error;
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
  }
}

/**
 * ✅ Retry with exponential backoff and jitter
 * (Recommended for most use cases)
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  return retryAsync(fn, {
    maxRetries,
    initialDelayMs,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
  });
}

/**
 * ✅ Retry for network requests
 */
export async function retryNetworkRequest<T>(
  fn: () => Promise<T>
): Promise<T> {
  return retryAsync(fn, AGGRESSIVE_RETRY_CONFIG);
}

/**
 * ✅ Retry for AI requests
 */
export async function retryAIRequest<T>(
  fn: () => Promise<T>
): Promise<T> {
  return retryAsync(fn, {
    maxRetries: 3,
    initialDelayMs: 2000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    shouldRetry: (error, attempt) => {
      // Don't retry on validation errors
      if (error?.code === 'INVALID_PROMPT') return false;
      return isRetryableError(error) && attempt < 3;
    },
  });
}

export default {
  retryAsync,
  retryAsyncWithCondition,
  retryAsyncWithTimeout,
  retryAsyncParallel,
  retryAsyncSequential,
  retryAsyncWithFallback,
  retryWithBackoff,
  retryNetworkRequest,
  retryAIRequest,
  CircuitBreaker,
  sleep,
  calculateBackoffDelay,
  addJitter,
  DEFAULT_RETRY_CONFIG,
  AGGRESSIVE_RETRY_CONFIG,
  CONSERVATIVE_RETRY_CONFIG,
};

