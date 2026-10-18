import express from 'express';
import { db, persist } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { deepMerge } from '../middleware/validate.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { branch, year, q } = req.query;
  let rows = db.users;

  if (branch) rows = rows.filter((u) => u.branch === branch);
  if (year) rows = rows.filter((u) => u.year === Number(year));
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((u) => u.name.toLowerCase().includes(needle));
  }

  res.json(rows);
});

router.get('/by-username/:username', (req, res) => {
  const user = db.users.find((u) => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: 'Member not found' });
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

router.get('/:id', (req, res) => {
  const user = db.users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Member not found' });
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

router.put('/:id', requireAuth, (req, res) => {
  const index = db.users.findIndex((u) => u.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Member not found' });

  db.users[index] = { ...db.users[index], ...req.body, id: db.users[index].id };
  persist();

  const { passwordHash, ...safe } = db.users[index];
  res.json(safe);
});

router.patch('/:id/preferences', requireAuth, (req, res) => {
  const user = db.users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Member not found' });

  user.preferences = user.preferences || {};
  deepMerge(user.preferences, req.body || {});
  persist();

  res.json(user.preferences);
});

router.get('/:id/activity', (req, res) => {
  const id = Number(req.params.id);
  const events = db.events.filter((e) => e.registered.includes(id));
  const projects = db.projects.filter((p) => p.ownerId === id);
  const submissions = db.submissions.filter((s) => s.hunterId === id);
  res.json({ events, projects, submissions });
});

export default router;
