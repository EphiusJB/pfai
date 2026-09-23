import env from "../env.js";
import response from "./response.js";

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function createRateLimiter({ windowMs, max }) {
  const hits = new Map(); // ip -> { count, resetAt }

  return {
    check(request) {
      const ip = getClientIp(request);
      const now = Date.now();
      const entry = hits.get(ip);

      if (!entry || now > entry.resetAt) {
        hits.set(ip, { count: 1, resetAt: now + windowMs });
        return null;
      }

      entry.count += 1;
      if (entry.count > max) {
        return response.tooManyRequests();
      }
      return null;
    },
  };
}

// Strict — auth endpoints
const authLimiter = createRateLimiter({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.authMax,
});

// Write operations — POST / PATCH / DELETE
const writeLimiter = createRateLimiter({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
});

// Read operations — GET
const readLimiter = createRateLimiter({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max * 3,
});

// Analytics — GET, higher limit for dashboard polling
const analyticsLimiter = createRateLimiter({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max * 5,
});

// Public/unauthenticated GET (e.g. marketplace browsing)
const publicLimiter = createRateLimiter({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max * 10,
});

export { authLimiter, writeLimiter, readLimiter, analyticsLimiter, publicLimiter };
