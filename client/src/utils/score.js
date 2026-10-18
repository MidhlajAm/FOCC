// Official scoring table, mirrored from the rules page.
export const SEVERITY_POINTS = {
  low: 10,
  medium: 25,
  high: 40,
  critical: 60,
};

export const LEVELS = [
  { level: 1, name: 'Surface', blurb: 'Visible in the UI if you actually look.' },
  { level: 2, name: 'Logic', blurb: 'The screen renders fine, the answer is wrong.' },
  { level: 3, name: 'Security', blurb: 'Trust boundaries, tokens, permissions, input.' },
  { level: 4, name: 'Deep', blurb: 'State, timing, data, design and the docs themselves.' },
];

export function pointsFor(severity) {
  return SEVERITY_POINTS[severity] || 0;
}

export function totalFor(submissions) {
  return submissions.reduce((sum, s) => sum + pointsFor(s.severity), 0);
}

export function levelName(level) {
  const found = LEVELS.find((l) => l.level === level);
  return found ? found.name : 'Unsorted';
}
