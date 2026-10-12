/**
 * In-memory sliding window rate limiter for Server Actions and API routes.
 * Protects form submissions and transactions from spam and brute-force abuse.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number;      // Maximum allowed requests in the window
  windowMs?: number;   // Window duration in milliseconds (default: 60s)
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  message?: string;
}

/**
 * Checks whether the given identifier has exceeded the rate limit.
 * @param identifier Client IP, user ID, or form session key
 * @param options Custom limit and window configuration
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 5; // Default: 5 requests
  const windowMs = options.windowMs ?? 60 * 1000; // Default: 60 seconds
  const now = Date.now();

  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    // Start a new window
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
    };
  }

  // Existing window
  if (record.count >= limit) {
    const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
      message: `Too many submissions. Please pause for ${waitSeconds} seconds before trying again.`,
    };
  }

  record.count += 1;
  rateLimitStore.set(identifier, record);

  return {
    success: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  };
}
