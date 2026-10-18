import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CLUB } from '../config';

export default function Login() {
  const { login } = useAuth();
  const [params] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      const next = params.get('next') || '/dashboard';
      window.location.assign(next);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container page form-narrow">
      <div className="kicker">Welcome back</div>
      <h1>Sign in</h1>
      <p className="muted">Your {CLUB.short} portal account, not your college login.</p>

      <form onSubmit={submit} className="card" style={{ marginTop: 20 }}>
        <div className="field">
          <label htmlFor="email">College email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <div className="field-error">{error}</div>}
        </div>

        <button className="btn btn-primary btn-block" type="submit">
          Sign in
        </button>

        <p className="muted" style={{ marginTop: 14, marginBottom: 0, fontSize: '0.85rem' }}>
          No account yet? <Link to="/register">Join the club</Link>. Forgot your password?
          Ask a lead at the next session.
        </p>
      </form>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="stat-label">Demo account</div>
        <p className="muted mono" style={{ margin: '8px 0 0', fontSize: '0.84rem' }}>
          devika@focc.club / reactHooks99
        </p>
      </div>
    </div>
  );
}
