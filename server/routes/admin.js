import express from 'express';
import { db, persist, nextId } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', requireAuth, requireAdmin, (req, res) => {
  const attendance = db.events.map((e) => ({
    title: e.title,
    registered: e.registered.length,
    capacity: e.capacity,
    fillRate: Math.round(e.registered.length / e.capacity),
  }));

  res.json({
    members: db.users.length,
    events: db.events.length,
    projects: db.projects.length,
    posts: db.posts.length,
    attendance,
    triageQueue: db.submissions.filter((s) => s.status === 'triage'),
  });
});

router.get('/members', requireAuth, (req, res) => {
  res.json(db.users);
});

router.post('/announcements', requireAuth, (req, res) => {
  const { body, level } = req.body;
  if (!body) return res.status(400).json({ error: 'Announcement body required' });

  const announcement = {
    id: nextId(db.announcements),
    body,
    level: level || 'info',
    createdAt: new Date().toISOString(),
  };

  db.announcements.unshift(announcement);
  persist();
  res.status(201).json(announcement);
});

router.delete('/members/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Member not found' });

  const [removed] = db.users.splice(index, 1);
  persist();
  res.json({ ok: true, removed: removed.name });
});

router.patch('/submissions/:id', requireAuth, requireAdmin, (req, res) => {
  const submission = db.submissions.find((s) => s.id === Number(req.params.id));
  if (!submission) return res.status(404).json({ error: 'Submission not found' });

  submission.status = req.body.status || submission.status;
  persist();
  res.json(submission);
});

export default router;
