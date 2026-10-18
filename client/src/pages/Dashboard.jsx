import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import { formatDate } from '../utils/date';
import { levelName, totalFor } from '../utils/score';

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [activity, setActivity] = useState(null);
  const [prefs, setPrefs] = useState({ theme: 'dark', digest: 'weekly' });

  useEffect(() => {
    api.get(`/users/${user.id}/activity`).then(setActivity);
    api.get(`/users/${user.id}`).then((fresh) => setPrefs(fresh.preferences));
  }, [user.id]);

  async function savePrefs() {
    await api.patch(`/users/${user.id}/preferences`, prefs);
    toast.push('Preferences saved');
  }

  if (!activity) return <Loader label="Loading your dashboard" />;

  const upcoming = activity.events.filter((e) => new Date(e.startsAt) > new Date());

  return (
    <div className="container page">
      <div className="kicker">Signed in as @{user.username}</div>
      <h1>{user.name.split(' ')[0]}&apos;s dashboard</h1>

      <div className="grid grid-4" style={{ margin: '24px 0 32px' }}>
        <StatCard value={user.points} label="Club points" />
        <StatCard value={upcoming.length} label="Upcoming sessions" />
        <StatCard value={activity.projects.length} label="Projects maintained" />
        <StatCard value={totalFor(activity.submissions)} label="Bug hunt points" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="stack">
          <div className="card">
            <div className="row between">
              <h3 style={{ margin: 0 }}>Your sessions</h3>
              <Link to="/events" className="mono muted">
                browse all
              </Link>
            </div>
            {activity.events.length === 0 && (
              <p className="muted" style={{ marginTop: 12 }}>
                You have not registered for anything yet.
              </p>
            )}
            {activity.events.map((event) => (
              <div className="row between comment" key={event.id}>
                <Link to={`/events/${event.slug}`}>{event.title}</Link>
                <span className="muted mono" style={{ fontSize: '0.8rem' }}>
                  {formatDate(event.startsAt)}
                </span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Your bug hunt findings</h3>
            {activity.submissions.length === 0 && (
              <p className="muted">
                Nothing submitted yet. The rules are on the{' '}
                <Link to="/bug-hunt">bug hunt page</Link>.
              </p>
            )}
            {activity.submissions.map((s) => (
              <div className="row between comment" key={s.id}>
                <div>
                  <div>{s.title}</div>
                  <div className="muted mono" style={{ fontSize: '0.78rem' }}>
                    {levelName(s.level)} &middot; {formatDate(s.submittedAt)}
                  </div>
                </div>
                <span className={s.status === 'accepted' ? 'badge badge-ok' : 'badge badge-warn'}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="stack">
          <div className="card">
            <h3>Preferences</h3>
            <div className="field">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={prefs.theme}
                onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}
              >
                <option value="dark">dark</option>
                <option value="light">light</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="digest">Email digest</label>
              <select
                id="digest"
                value={prefs.digest}
                onChange={(e) => setPrefs({ ...prefs, digest: e.target.value })}
              >
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="never">never</option>
              </select>
            </div>
            <button className="btn btn-sm btn-primary btn-block" onClick={savePrefs}>
              Save preferences
            </button>
          </div>

          <div className="card">
            <div className="stat-label">Your public page</div>
            <Link to={`/members/${user.username}`} className="mono">
              /members/{user.username}
            </Link>
            <Link
              to={`/certificate/${user.id}`}
              className="btn btn-sm btn-block"
              style={{ marginTop: 14 }}
            >
              Participation certificate
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
