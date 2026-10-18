import { Link } from 'react-router-dom';
import { formatDate } from '../utils/date';

export default function PostCard({ post }) {
  return (
    <article className="card card-hover">
      <div className="row between">
        <span className="muted mono" style={{ fontSize: '0.8rem' }}>
          {formatDate(post.publishedAt)}
        </span>
        <span className="muted mono" style={{ fontSize: '0.8rem' }}>
          {post.readMinutes} min read
        </span>
      </div>

      <h3 style={{ marginTop: 10, fontSize: '1.15rem' }}>
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>

      <p className="muted">{post.excerpt}</p>

      <div className="row between" style={{ marginTop: 10 }}>
        <span className="muted mono" style={{ fontSize: '0.78rem' }}>
          {post.authorName}
        </span>
        <span className="muted mono" style={{ fontSize: '0.78rem' }}>
          {post.commentCount} comments
        </span>
      </div>
    </article>
  );
}
