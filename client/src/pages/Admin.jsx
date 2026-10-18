import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import { percent } from '../utils/format';

export default function Admin() {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [level, setLevel] = useState('info');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setStats(await api.get('/admin/stats'));
      } catch {
        setStats(null);
      }
      setMembers(await api.get('/admin/members'));
      setLoading(false);
    }
    load();
  }, []);

  async function publish() {
    await api.post('/admin/announcements', { body: announcement, level });
    setAnnouncement('');
    toast.push('Announcement published');
  }

  async function removeMember(id) {
    await api.del(`/admin/members/${id}`);
    setMembers(members.filter((m) => m.id !== id));
    toast.push('Member removed');
  }

  if (loading) return <Loader label="Loading admin console" />;

  return (
    <div className="container page">
      <div className="kicker">Console</div>
      <h1>Club administration</h1>
      <p className="muted">
        Signed in as {user.name} ({user.role}).
      </p>

      {stats ? (
        <div className="grid grid-4" style={{ margin: '24px 0 30px' }}>
          <StatCard value={stats.members} label="Members" />
          <StatCard value={stats.events} label="Events" />
          <StatCard value={stats.projects} label="Projects" />
          <StatCard value={stats.triageQueue.length} label="Reports in triage" />
        </div>
      ) : (
        <p className="muted" style={{ margin: '20px 0' }}>
          Statistics are unavailable for this account.
        </p>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 30 }}>
        <div className="card">
          <h3>Publish an announcement</h3>
          <div className="field">
            <label htmlFor="body">Message</label>
            <textarea
              id="body"
              rows={3}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
          </div>
          <div className="row">
            <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: 'auto' }}>
              <option value="info">info</option>
              <option value="warning">warning</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={publish}>
              Publish
            </button>
          </div>
        </div>

        {stats && (
          <div className="card">
            <h3>Session fill rates</h3>
            {stats.attendance.map((row) => (
              <div className="row between comment" key={row.title}>
                <span>{row.title}</span>
                <span className="mono muted">
                  {row.registered}/{row.capacity} ({percent(row.registered, row.capacity)})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2>Member records</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Points</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td className="mono">{m.id}</td>
              <td>{m.name}</td>
              <td className="mono muted">{m.email}</td>
              <td className="mono">{m.role}</td>
              <td className="mono">{m.points}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => removeMember(m.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
