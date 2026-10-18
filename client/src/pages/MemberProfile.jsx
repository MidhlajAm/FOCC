import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import Loader from '../components/Loader';
import { formatDate } from '../utils/date';
import { yearsSince } from '../utils/format';
import { levelName } from '../utils/score';

export default function MemberProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [member, setMember] = useState(null);
  const [activity, setActivity] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', githubUrl: '', skills: '' });

  useEffect(() => {
    async function load() {
      const one = await api.get(`/users/by-username/${username}`);
      setMember(one);
      setForm({
        bio: one.bio,
        githubUrl: one.githubUrl,
        skills: one.skills.join(', '),
      });
      setActivity(await api.get(`/users/${one.id}/activity`));
    }
    load();
  }, [username]);

  async function save() {
    const updated = await api.put(`/users/${member.id}`, {
      bio: form.bio,
      githubUrl: form.githubUrl,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setMember(updated);
    setEditing(false);
    toast.push('Profile updated');
  }

  if (!member) return <Loader label="Loading profile" />;

  return (
    <div className="container page">
      <Link to="/members" className="mono muted">
        &larr; members
      </Link>

      <div className="row between" style={{ marginTop: 16 }}>
        <div className="row">
          <Avatar user={member} size={72} />
          <div>
            <h1 style={{ marginBottom: 2 }}>{member.name}</h1>
            <div className="muted mono">
              @{member.username} &middot; Year {member.year} &middot; {member.branch}
            </div>
            <div className="muted mono" style={{ fontSize: '0.8rem', marginTop: 4 }}>
              Member since {formatDate(member.joinedOn)} &middot; {yearsSince(member.joinedOn)}{' '}
              years in the club
            </div>
          </div>
        </div>

        <div className="row">
          <span className="badge">{member.points} pts</span>
          {user && (
            <button className="btn btn-sm" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : 'Edit profile'}
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="github">GitHub URL</label>
            <input
              id="github"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="skills">Skills (comma separated)</label>
            <input
              id="skills"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" onClick={save}>
            Save profile
          </button>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', marginTop: 26 }}>
        <div className="stack">
          <div className="card">
            <h3>About</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              {member.bio || 'This member has not written a bio yet.'}
            </p>
          </div>

          {activity && (
            <>
              <div className="card">
                <h3>Bug hunt submissions</h3>
                <p className="muted" style={{ fontSize: '0.82rem' }}>
                  Oldest first.
                </p>
                {activity.submissions.length === 0 && (
                  <p className="muted">No submissions yet.</p>
                )}
                {activity.submissions.map((s) => (
                  <div className="row between comment" key={s.id}>
                    <span>{s.title}</span>
                    <span className="badge">
                      {levelName(s.level)} &middot; {s.severity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3>Projects maintained</h3>
                {activity.projects.length === 0 && <p className="muted">None yet.</p>}
                {activity.projects.map((p) => (
                  <div className="row between comment" key={p.id}>
                    <Link to={`/projects/${p.slug}`}>{p.name}</Link>
                    <span className="muted mono">{p.stars} stars</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="stack">
          <div className="card">
            <div className="stat-label">Skills</div>
            <div className="row" style={{ gap: 6, marginTop: 8 }}>
              {member.skills.map((skill) => (
                <span className="tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="stat-label" style={{ marginTop: 18 }}>
              GitHub
            </div>
            <a href={member.githubUrl}>{member.githubUrl.replace('https://github.com/', '@')}</a>
          </div>

          {activity && (
            <div className="card">
              <div className="stat-label">Sessions attended</div>
              <div className="stat-value">{activity.events.length}</div>
              <Link
                to={`/certificate/${member.id}`}
                className="btn btn-sm btn-block"
                style={{ marginTop: 14 }}
              >
                View participation certificate
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
