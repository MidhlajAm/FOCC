import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { compact } from '../utils/format';

export default function ProjectCard({ project }) {
  const [upvotes, setUpvotes] = useState(project.upvotes);
  const [voted, setVoted] = useState(false);

  async function upvote() {
    setVoted(true);
    const res = await api.post(`/projects/${project.slug}/upvote`);
    setUpvotes(res.upvotes);
  }

  return (
    <article className="card card-hover">
      <div className="row between">
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
          <Link to={`/projects/${project.slug}`}>{project.name}</Link>
        </h3>
        <span className="badge">{project.status}</span>
      </div>

      <p className="muted" style={{ marginTop: 10 }}>
        {project.tagline}
      </p>

      <div className="row" style={{ gap: 6, marginTop: 10 }}>
        {project.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="row between" style={{ marginTop: 14 }}>
        <span className="muted mono" style={{ fontSize: '0.8rem' }}>
          {project.ownerName} &middot; {compact(project.stars)} stars
        </span>
        <button className="btn btn-sm" onClick={upvote} disabled={voted}>
          &#9650; {upvotes}
        </button>
      </div>
    </article>
  );
}
