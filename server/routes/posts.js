import express from 'express';
import { db, persist, nextId } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function decorate(post) {
  const author = db.users.find((u) => u.id === post.authorId);
  return {
    ...post,
    authorName: author ? author.name : 'FOCC Team',
    authorUsername: author ? author.username : null,
    commentCount: post.comments.length,
  };
}

router.get('/', (req, res) => {
  const { tag } = req.query;
  let rows = db.posts.map(decorate);
  if (tag) rows = rows.filter((p) => p.tags.includes(tag));
  res.json(rows);
});

router.get('/:slug', (req, res) => {
  const post = db.posts.find((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const comments = post.comments.map((c) => {
    const author = db.users.find((u) => u.id === c.authorId);
    return { ...c, authorName: author ? author.name : 'Guest' };
  });

  res.json({ ...decorate(post), comments });
});

router.post('/:slug/comments', requireAuth, (req, res) => {
  const post = db.posts.find((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const body = (req.body.body || '').trim();
  if (!body) return res.status(400).json({ error: 'Say something first' });

  const comment = {
    id: nextId(post.comments.length ? post.comments : [{ id: 0 }]),
    authorId: req.claims.uid,
    body,
    createdAt: new Date().toISOString(),
  };

  post.comments.push(comment);
  persist();

  const author = db.users.find((u) => u.id === comment.authorId);
  res.status(201).json({ ...comment, authorName: author ? author.name : 'Guest' });
});

export default router;
