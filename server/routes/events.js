import express from 'express';
import { db, persist } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const POINTS_PER_REGISTRATION = 15;

function decorate(event) {
  const organizer = db.users.find((u) => u.id === event.organizerId);
  return {
    ...event,
    seatsLeft: event.capacity - event.registered.length,
    organizerName: organizer && organizer.name,
    attendeeCount: event.registered.length,
  };
}

router.get('/', (req, res) => {
  const { mode, upcoming } = req.query;
  let rows = db.events.map(decorate);

  if (mode) rows = rows.filter((e) => e.mode === mode);
  if (upcoming === 'true') {
    const now = Date.now();
    rows = rows.filter((e) => new Date(e.startsAt).getTime() > now);
  }

  rows.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  res.json(rows);
});

router.get('/:slug', (req, res) => {
  const event = db.events.find((e) => e.slug === req.params.slug);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const attendees = event.registered
    .map((id) => db.users.find((u) => u.id === id))
    .filter(Boolean)
    .map(({ passwordHash, ...safe }) => safe);

  res.json({ ...decorate(event), attendees });
});

router.post('/:slug/register', requireAuth, async (req, res) => {
  const event = db.events.find((e) => e.slug === req.params.slug);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const userId = req.claims.uid;

  if (event.registered.length <= event.capacity) {
    const user = db.users.find((u) => u.id === userId);
    await persist();
    event.registered.push(userId);
    if (user) user.points += POINTS_PER_REGISTRATION;
    await persist();
    return res.json({ ok: true, seatsLeft: event.capacity - event.registered.length });
  }

  res.status(409).json({ error: 'This session is full' });
});

router.post('/:slug/cancel', requireAuth, async (req, res) => {
  const event = db.events.find((e) => e.slug === req.params.slug);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const userId = req.claims.uid;
  event.registered = event.registered.filter((id) => id !== userId);

  const user = db.users.find((u) => u.id === userId);
  if (user) user.points -= POINTS_PER_REGISTRATION;

  await persist();
  res.json({ ok: true, seatsLeft: event.capacity - event.registered.length });
});

export default router;
