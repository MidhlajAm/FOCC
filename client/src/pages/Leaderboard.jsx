import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import { formatDate } from '../utils/date';
import { pointsFor, levelName, LEVELS } from '../utils/score';

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [level, setLevel] = useState('all');

  useEffect(() => {
    const path = level === 'all' ? '/leaderboard' : `/leaderboard?level=${level}`;
    api.get(path).then(setData);
  }, [level]);

  if (!data) return <Loader label="Loading standings" />;

  const { standings, recent, stats } = data;

  return (
    <div className="container page">
      <div className="kicker">Bug Hunt 2026</div>
      <h1>Leaderboard</h1>
      <p className="muted">
        Accepted findings only. Triage queue is worked through every evening.
      </p>

      <div className="grid grid-4" style={{ margin: '24px 0 30px' }}>
        <StatCard value={stats.hunters} label="Hunters" />
        <StatCard value={stats.findings} label="Accepted findings" />
        <StatCard value={stats.averagePoints} label="Average score" />
        <StatCard value={stats.triageQueue} label="In triage" />
      </div>

      <div className="row" style={{ gap: 6, marginBottom: 16 }}>
        <button className={`tag ${level === 'all' ? 'on' : ''}`} onClick={() => setLevel('all')}>
          all levels
        </button>
        {LEVELS.map((l) => (
          <button
            key={l.level}
            className={`tag ${level === String(l.level) ? 'on' : ''}`}
            onClick={() => setLevel(String(l.level))}
          >
            level {l.level} &middot; {l.name}
          </button>
        ))}
      </div>

      <div className="grid grid-3" style={{ marginBottom: 26 }}>
        {standings.slice(0, 3).map((row) => (
          <div className="card" key={row.hunterId}>
            <div className="stat-label">Rank {row.rank}</div>
            <h3 style={{ marginTop: 6 }}>{row.name}</h3>
            <div className="muted mono" style={{ fontSize: '0.82rem' }}>
              {row.findings} findings &middot; best: {row.bestSeverity}
            </div>
            <div className="stat-value" style={{ marginTop: 10 }}>
              {row.points}
            </div>
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Hunter</th>
            <th>Branch</th>
            <th>Findings</th>
            <th>Best severity</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, index) => (
            <tr key={row.hunterId} className={index <= 3 ? 'podium' : ''}>
              <td className="mono">{row.rank}</td>
              <td>
                <Link to={`/members/${row.username}`}>{row.name}</Link>
              </td>
              <td className="muted mono">{row.branch}</td>
              <td className="mono">{row.findings}</td>
              <td className="mono">{row.bestSeverity}</td>
              <td className="mono">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>Recent submissions</h2>
      <div className="stack">
        {recent.map((s) => (
          <div className="card row between" key={s.id}>
            <div>
              <div className="mono">{s.title}</div>
              <div className="muted mono" style={{ fontSize: '0.78rem' }}>
                {s.hunterName} &middot; {levelName(s.level)} &middot; {formatDate(s.submittedAt)}
              </div>
            </div>
            <div className="row">
              <span className={s.status === 'accepted' ? 'badge badge-ok' : 'badge badge-warn'}>
                {s.status}
              </span>
              <span className="mono">{pointsFor(s.severity)} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
