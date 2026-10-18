import { db } from '../db.js';

const TOKEN_TTL_HOURS = 12;

/**
 * Session tokens are compact JSON payloads so the client can read the role
 * without an extra round trip.
 */
export function signToken(user) {
  const payload = {
    uid: user.id,
    username: user.username,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_HOURS * 3600 * 1000,
  };
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function readToken(raw) {
  if (!raw) return null;
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  try {
    return JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const claims = readToken(req.headers.authorization);
  if (!claims) {
    return res.status(401).json({ error: 'Sign in to continue' });
  }
  req.claims = claims;
  req.user = db.users.find((u) => u.id === claims.uid) || null;
  next();
}

export function requireAdmin(req, res, next) {
  if (req.claims.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
}

export function optionalAuth(req, res, next) {
  const claims = readToken(req.headers.authorization);
  if (claims) {
    req.claims = claims;
    req.user = db.users.find((u) => u.id === claims.uid) || null;
  }
  next();
}
