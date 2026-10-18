import { Link } from 'react-router-dom';
import { CLUB } from '../config';
import SeverityLegend from '../components/SeverityLegend';
import { LEVELS, SEVERITY_POINTS } from '../utils/score';

const SCOPE = [
  { area: 'Portal UI (client/src)', inScope: 'yes', notes: 'Every page, component and stylesheet' },
  { area: 'Portal API (server)', inScope: 'yes', notes: 'Routes, middleware, data handling' },
  { area: 'Seed data (server/data)', inScope: 'yes', notes: 'Records that contradict each other count' },
  { area: 'Docs and copy', inScope: 'yes', notes: 'README, HUNT.md and on-page text' },
  { area: 'node_modules', inScope: 'no', notes: 'Upstream CVEs are not club bugs' },
  { area: 'Other club repos', inScope: 'no', notes: 'Report those as normal issues' },
];

const RULES = [
  'One report per defect. Two reports for the same root cause count once.',
  'A report needs a reproduction. "This looks wrong" is not a reproduction.',
  'Tools are allowed. Your report must still explain the defect in your own words.',
  'If a judge asks you to explain a finding and you cannot, the finding is withdrawn.',
  'Do not attack the machine running the portal, only the code in the repo.',
  'Do not delete or corrupt other hunters data. Reset your own copy instead.',
];

export default function BugHunt() {
  return (
    <div className="container page">
      <div className="kicker">Contest</div>
      <h1>{CLUB.short} Bug Hunt 2026</h1>
      <p className="muted" style={{ maxWidth: 640 }}>
        This portal ships with defects on purpose. Some are visible in a screenshot, some
        only show up after you click twice, some are only visible if you compare two files
        that disagree. Find them, prove them, write them up.
      </p>

      <div className="card" style={{ marginTop: 22 }}>
        <div className="row between">
          <div>
            <div className="stat-label">Submissions close</div>
            <div className="mono" style={{ fontSize: '1.2rem' }}>
              12 October 2026, 23:59 IST
            </div>
          </div>
          <a className="btn btn-primary" href="mailto:focc@club.college.ac.in?subject=Bug%20Hunt%20submission">
            Submit a finding
          </a>
        </div>
      </div>

      <h2 style={{ marginTop: 40 }}>Levels</h2>
      <div className="grid grid-4">
        {LEVELS.map((level) => (
          <div className="card" key={level.level}>
            <div className="stat-label">Level {level.level}</div>
            <h3 style={{ fontSize: '1.05rem', marginTop: 6 }}>{level.name}</h3>
            <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>
              {level.blurb}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>
        Scoring <SeverityLegend />
      </h2>
      <table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Points</th>
            <th>What it means</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="mono">low</td>
            <td className="mono">{SEVERITY_POINTS.low}</td>
            <td>Cosmetic or copy defect, no wrong data</td>
          </tr>
          <tr>
            <td className="mono">medium</td>
            <td className="mono">{SEVERITY_POINTS.medium}</td>
            <td>Wrong result shown to the user, recoverable</td>
          </tr>
          <tr>
            <td className="mono">high</td>
            <td className="mono">{SEVERITY_POINTS.high}</td>
            <td>Data loss, broken access control, injected markup</td>
          </tr>
          <tr>
            <td className="mono">critical</td>
            <td className="mono">{SEVERITY_POINTS.critical}</td>
            <td>Full account takeover or admin escalation</td>
          </tr>
        </tbody>
      </table>

      <p className="muted" style={{ marginTop: 12 }}>
        Documentation quality is worth up to 20 extra points per finding. Ties on total
        points are broken by the earliest accepted submission.
      </p>

      <h2 style={{ marginTop: 40 }}>Scope</h2>
      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>In scope</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {SCOPE.map((row) => (
            <tr key={row.area}>
              <td className="mono">{row.area}</td>
              <td>
                <span className={row.inScope === 'yes' ? 'badge badge-ok' : 'badge badge-danger'}>
                  {row.inScope}
                </span>
              </td>
              <td className="muted">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>Rules</h2>
      <ul className="prose">
        {RULES.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>

      <div className="card" style={{ marginTop: 26 }}>
        <h3>What a good report looks like</h3>
        <pre className="mono muted" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
{`Title:      one line, states the defect not the symptom
Level:      1-4
Severity:   low | medium | high | critical
Location:   path/to/file.jsx:42
Steps:      1. go to /members  2. filter ECE  3. observe count
Expected:   "1 member"
Actual:     "1 members"
Impact:     who is affected and how badly
Fix:        the smallest change that resolves it`}
        </pre>
      </div>

      <p className="muted" style={{ marginTop: 20 }}>
        Standings update as judges accept findings. Watch the{' '}
        <Link to="/leaderboard">leaderboard</Link>.
      </p>
    </div>
  );
}
