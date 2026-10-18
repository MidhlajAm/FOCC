import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { byNewest } from '../utils/date';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState(null);

  useEffect(() => {
    api
      .get('/posts')
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))].sort(), [posts]);

  const visible = useMemo(() => {
    const rows = tag ? posts.filter((p) => p.tags.includes(tag)) : [...posts];
    return rows.sort(byNewest('publishedAt'));
  }, [posts, tag]);

  return (
    <div className="container page">
      <div className="kicker">Writing</div>
      <h1>Blog</h1>
      <p className="muted" style={{ maxWidth: 560 }}>
        Session notes, post mortems and opinions from club members. Contributions are a
        pull request against the portal repo.
      </p>

      <div className="row" style={{ gap: 6, margin: '24px 0 20px' }}>
        {tags.map((t) => (
          <button
            key={t}
            className={`tag ${tag === t ? 'on' : ''}`}
            onClick={() => setTag(tag === t ? null : t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <Loader label="Loading posts" />}
      {!loading && visible.length === 0 && <EmptyState title="No posts with that tag" />}

      <div className="grid grid-3">
        {visible.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
