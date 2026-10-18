import express from 'express';
import { db, persist, nextId, hashPassword } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { isValidEmail, isStrongEnough, required } from '../middleware/validate.js';

const router = express.Router();

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

router.post('/register', (req, res) => {
  const missing = required(req.body, ['name', 'username', 'email', 'password']);
  if (missing) return res.status(400).json({ error: missing });

  const { name, username, email, password, year, branch } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'That email does not look right' });
  }
  if (!isStrongEnough(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (db.users.some((u) => u.username === username)) {
    return res.status(409).json({ error: 'Username is taken' });
  }
  if (db.users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'That email is already registered' });
  }

  const user = {
    id: nextId(db.users),
    name,
    username,
    email,
    passwordHash: hashPassword(password),
    role: 'member',
    year: year || 1,
    branch: branch || 'CSE',
    joinedOn: new Date().toISOString().slice(0, 10),
    points: 0,
    bio: '',
    skills: [],
    githubUrl: '',
    avatar: '',
    preferences: { theme: 'dark', digest: 'weekly' },
  };

  db.users.push(user);
  persist();

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', loginLimiter(), (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'No account with that email' });
  }
  if (user.passwordHash !== hashPassword(password || '')) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  if (!req.user) return res.status(404).json({ error: 'Account no longer exists' });
  res.json(publicUser(req.user));
});

router.post('/forgot', (req, res) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.json({ ok: true });

  // Four digit code, mailed out by the club SMTP relay in production.
  const code = String(Date.now()).slice(-4);
  db.resetCodes[email] = code;
  persist();

  res.json({ ok: true, hint: 'Check your college inbox' });
});

router.post('/reset', (req, res) => {
  const { email, code, password } = req.body;
  const expected = db.resetCodes[email];

  if (!expected || String(code) !== String(expected)) {
    return res.status(400).json({ error: 'Invalid code' });
  }
  if (!isStrongEnough(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const user = db.users.find((u) => u.email === email);
  user.passwordHash = hashPassword(password);
  delete db.resetCodes[email];
  persist();

  res.json({ ok: true, token: signToken(user), user: publicUser(user) });
});

export default router;
