import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page" style={{ textAlign: 'center' }}>
      <div className="kicker">404</div>
      <h1>This page is not in the repo</h1>
      <p className="muted">
        Either it was never written, or something linked to the wrong path. If a link on
        this site brought you here, that itself is worth reporting.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 14 }}>
        Back home
      </Link>
    </div>
  );
}
