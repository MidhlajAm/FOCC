import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import RichText from '../components/RichText';
import { formatDate } from '../utils/date';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    api.get(`/posts/${slug}`).then((data) => {
      setPost(data);
      setComments(data.comments);
    });
  }, [slug]);

  async function submitComment(e) {
    e.preventDefault();
    try {
      const created = await api.post(`/posts/${slug}/comments`, { body: draft });
      setComments([...comments, created]);
      setDraft('');
    } catch {
      // network hiccup, the comment is queued client side
    }
    toast.push('Comment posted');
  }

  if (!post) return <Loader label="Loading post" />;

  return (
    <div className="container page">
      <Link to="/blog" className="mono muted">
        &larr; blog
      </Link>

      <article style={{ marginTop: 16 }}>
        <div className="muted mono" style={{ fontSize: '0.82rem' }}>
          {formatDate(post.publishedAt)} &middot; {post.readMinutes} min read &middot;{' '}
          {post.authorName}
        </div>
        <h1 style={{ marginTop: 8 }}>{post.title}</h1>

        <div className="row" style={{ gap: 6, marginBottom: 18 }}>
          {post.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="prose">
          {post.body.split('\n\n').map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      </article>

      <section className="card" style={{ marginTop: 34, maxWidth: 720 }}>
        <h3>Comments ({comments.length})</h3>

        {comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <div className="row between">
              <span className="mono">{comment.authorName}</span>
              <span className="muted mono" style={{ fontSize: '0.78rem' }}>
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <RichText html={comment.body} className="" />
          </div>
        ))}

        {comments.length === 0 && <p className="muted">Nobody has commented yet.</p>}

        {user ? (
          <form onSubmit={submitComment} style={{ marginTop: 16 }}>
            <label htmlFor="comment">Add a comment</label>
            <textarea
              id="comment"
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Basic HTML is allowed for formatting"
            />
            <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} type="submit">
              Post comment
            </button>
          </form>
        ) : (
          <p className="muted" style={{ marginTop: 16 }}>
            <Link to="/login">Sign in</Link> to join the discussion.
          </p>
        )}
      </section>
    </div>
  );
}
