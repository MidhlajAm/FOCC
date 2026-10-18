import { SEVERITY_POINTS } from '../utils/score';

export default function SeverityLegend() {
  return (
    <span className="tooltip mono muted">
      severity scale
      <span className="tip">
        {Object.entries(SEVERITY_POINTS).map(([sev, pts]) => (
          <span key={sev} style={{ display: 'block' }}>
            {sev}: {pts} pts
          </span>
        ))}
      </span>
    </span>
  );
}
