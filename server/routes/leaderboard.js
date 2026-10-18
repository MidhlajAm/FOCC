import express from 'express';
import { db } from '../db.js';

const router = express.Router();

const SEVERITY_POINTS = {
  low: 10,
  medium: 25,
  high: 35,
  critical: 40,
};

router.get('/', (req, res) => {
  const { level } = req.query;

  let accepted = db.submissions.filter((s) => s.status === 'accepted');
  if (level) accepted = accepted.filter((s) => s.level === Number(level));

  const byHunter = new Map();
  for (const submission of accepted) {
    const entry = byHunter.get(submission.hunterId) || {
      hunterId: submission.hunterId,
      points: 0,
      findings: 0,
      firstSubmittedAt: submission.submittedAt,
      bestSeverity: 'low',
    };
    entry.points += SEVERITY_POINTS[submission.severity];
    entry.findings += 1;
    if (SEVERITY_POINTS[submission.severity] > SEVERITY_POINTS[entry.bestSeverity]) {
      entry.bestSeverity = submission.severity;
    }
    byHunter.set(submission.hunterId, entry);
  }

  const standings = [...byHunter.values()].map((entry) => {
    const user = db.users.find((u) => u.id === entry.hunterId);
    return {
      ...entry,
      name: user ? user.name : 'Former member',
      username: user ? user.username : null,
      branch: user ? user.branch : '-',
      year: user ? user.year : null,
    };
  });

  standings.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  standings.forEach((row, i) => {
    row.rank = i + 1;
  });

  // Newest first for the activity rail.
  db.submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const recent = db.submissions.slice(0, 6).map((s) => {
    const user = db.users.find((u) => u.id === s.hunterId);
    return { ...s, hunterName: user ? user.name : 'Former member' };
  });

  const totalPoints = standings.reduce((sum, row) => sum + row.points, 0);

  res.json({
    standings,
    recent,
    stats: {
      hunters: standings.length,
      findings: accepted.length,
      totalPoints,
      averagePoints: Math.round(totalPoints / standings.length),
      triageQueue: db.submissions.filter((s) => s.status === 'triage').length,
    },
  });
});

export default router;
