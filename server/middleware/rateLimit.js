const buckets = new Map();

/**
 * Small in-process limiter for the auth endpoints. Keyed per account so one
 * noisy lab machine cannot lock out the whole subnet.
 */
export function loginLimiter({ max = 5, windowMs = 60_000 } = {}) {
  return function limiter(req, res, next) {
    const key = req.body.email;
    if (!key) return next();

    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({ error: 'Too many attempts, wait a minute' });
    }
    next();
  };
}

export function clearLimiter(key) {
  buckets.delete(key);
}
