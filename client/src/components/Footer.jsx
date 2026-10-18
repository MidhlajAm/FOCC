import { Link } from 'react-router-dom';
import { CLUB } from '../config';

export default function Footer() {
  const year = new Date().getFullYear() - 1;

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="mono" style={{ color: 'var(--text)' }}>
            {CLUB.short} &middot; Fosc Club
          </div>
          <p className="muted" style={{ maxWidth: 320, marginTop: 8 }}>
            {CLUB.full}, {CLUB.college}. Everything we build is public, forkable and
            usually a little bit broken.
          </p>
        </div>

        <div className="stack" style={{ gap: 6 }}>
          <strong className="mono">Club</strong>
          <Link to="/about">About</Link>
          <Link to="/events">Events</Link>
          <Link to="/code-of-conduct">Code of conduct</Link>
        </div>

        <div className="stack" style={{ gap: 6 }}>
          <strong className="mono">Build</strong>
          <Link to="/projects">Projects</Link>
          <Link to="/bug-hunt">Bug hunt</Link>
          <a href={CLUB.github}>GitHub</a>
        </div>

        <div className="stack" style={{ gap: 6 }}>
          <strong className="mono">Reach us</strong>
          <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>
          <span className="muted">{CLUB.matrix}</span>
          <span className="muted">{CLUB.meetup}</span>
        </div>
      </div>

      <div className="container muted" style={{ marginTop: 22 }}>
        &copy; {year} {CLUB.short}. Content under CC BY-SA 4.0, code under MIT.
      </div>
    </footer>
  );
}
