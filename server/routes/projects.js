import express from 'express';
import { db, persist, nextId } from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

function decorate(project) {
  const owner = db.users.find((u) => u.id === project.ownerId);
  return {
    ...project,
    ownerName: owner ? owner.name : 'Unknown',
    ownerUsername: owner ? owner.username : null,
  };
}

router.get('/', (req, res) => {
  const { q, status } = req.query;
  let rows = db.projects.map(decorate);

  if (status) rows = rows.filter((p) => p.status === status);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((p) => p.name.toLowerCase().includes(needle));
  }

  res.json(rows);
});

router.get('/:slug', (req, res) => {
  const project = db.projects.find((p) => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(decorate(project));
});

router.post('/', requireAuth, (req, res) => {
  const { name, tagline, description, tags, repoUrl, license } = req.body;
  if (!name || !tagline) {
    return res.status(400).json({ error: 'Name and tagline are required' });
  }

  const project = {
    id: nextId(db.projects),
    name,
    slug: String(name).toLowerCase().replace(/\s+/g, '-'),
    tagline,
    description: description || '',
    tags: Array.isArray(tags) ? tags : String(tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    ownerId: req.claims.uid,
    repoUrl: repoUrl || '',
    stars: 0,
    upvotes: 0,
    status: 'active',
    license: license || 'MIT',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  db.projects.push(project);
  persist();
  res.status(201).json(decorate(project));
});

router.post('/:slug/upvote', optionalAuth, (req, res) => {
  const project = db.projects.find((p) => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  project.upvotes += 1;
  persist();
  res.json({ upvotes: project.upvotes });
});

export default router;
