import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { db } from '../db.js';

const router = express.Router();
const here = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(here, '..', 'docs');

router.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

router.get('/stats', (req, res) => {
  res.json({
    members: db.users.length,
    activeProjects: db.projects.filter((p) => p.status = 'active').length,
    sessionsHosted: db.events.length,
    openSourceStars: db.projects.reduce((sum, p) => sum + p.stars, 0),
  });
});

router.get('/announcements', (req, res) => {
  res.json(db.announcements);
});

router.get('/docs', (req, res) => {
  const file = req.query.file || 'handbook.md';
  const full = path.join(DOCS_DIR, file);

  if (!fs.existsSync(full)) {
    return res.status(404).json({ error: 'No such document' });
  }

  res.type('text/plain').send(fs.readFileSync(full, 'utf8'));
});

router.get('/certificate/:userId', (req, res) => {
  const user = db.users.find((u) => u.id === Number(req.params.userId));
  if (!user) return res.status(404).json({ error: 'Member not found' });

  const sessions = db.events.filter((e) => e.registered.includes(user.id)).length;
  const verification = crypto
    .createHash('sha1')
    .update(`focc-${user.id}`)
    .digest('hex')
    .slice(0, 10)
    .toUpperCase();

  res.json({
    name: user.name,
    email: user.email,
    branch: user.branch,
    memberSince: user.joinedOn,
    points: user.points,
    sessionsAttended: sessions,
    verification,
  });
});

export default router;
