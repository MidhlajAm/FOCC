import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import RichText from '../components/RichText';
import { compact } from '../utils/format';
import { formatDate } from '../utils/date';

export default function ProjectDetail() {
  const { slug } = useParams();
  const toast = useToast();

  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const one = await api.get(`/projects/${slug}`);
      setProject(one);
      const all = await api.get('/projects');
      setRelated(
        all.filter((p) => p.slug !== one.slug && p.tags.some((t) => one.tags.includes(t))),
      );
      setLoading(false);
    }
    load();
  }, [slug]);

  async function upvote() {
    const res = await api.post(`/projects/${slug}/upvote`);
    setProject({ ...project, upvotes: res.upvotes });
    toast.push('Thanks for the vote');
  }

  if (loading) return <Loader label="Loading project" />;
  if (!project) {
    return (
      <div className="container page">
        <h1>Project not found</h1>
        <Link to="/projects">Back to projects</Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <Link to="/projects" className="mono muted">
        &larr; projects
      </Link>

      <div className="row between" style={{ marginTop: 14 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>{project.name}</h1>
          <p className="muted">{project.tagline}</p>
        </div>
        <div className="row">
          <span className="badge">{project.license}</span>
          <span className="badge">{project.status}</span>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', marginTop: 24 }}>
        <div className="card">
          <RichText html={project.description} />

          <div className="row" style={{ gap: 6, marginTop: 18 }}>
            {project.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <aside className="stack">
          <div className="card">
            <div className="stat-label">Maintainer</div>
            <Link to={`/members/${project.ownerUsername}`} className="mono">
              {project.ownerName}
            </Link>

            <div className="stat-label" style={{ marginTop: 16 }}>
              Started
            </div>
            <div className="mono">{formatDate(project.createdAt)}</div>

            <div className="row between" style={{ marginTop: 18 }}>
              <span className="mono muted">{compact(project.stars)} stars</span>
              <button className="btn btn-sm" onClick={upvote}>
                &#9650; {project.upvotes}
              </button>
            </div>

            <a
              className="btn btn-block"
              style={{ marginTop: 14 }}
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open repository
            </a>
          </div>

          <div className="card">
            <div className="stat-label">Found something wrong?</div>
            <p className="muted" style={{ margin: '8px 0 12px' }}>
              Every club project is in scope for the bug hunt.
            </p>
            <Link to="/bug-hunt" className="btn btn-sm btn-block">
              Report it
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <>
          <h2 style={{ marginTop: 40 }}>Related projects</h2>
          <div className="row">
            {related.map((p) => (
              <Link key={p.id} to={`/projects/${p.slug}`} className="card card-hover" style={{ flex: '1 1 220px' }}>
                <div className="mono">{p.name}</div>
                <div className="muted" style={{ fontSize: '0.85rem' }}>
                  {p.tagline}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
