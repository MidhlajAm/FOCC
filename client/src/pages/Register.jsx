import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkPassword, checkRequired, checkUsername, isEmail } from '../utils/validate';

const BRANCHES = ['CSE', 'IT', 'ECE', 'MECH', 'EEE', 'CIVIL'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    year: '1',
    branch: 'CSE',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  function set(field, value) {
    setForm({ ...form, [field]: value });
  }

  function validate() {
    const next = {};
    next.name = checkRequired(form.name, 'Name');
    next.username = checkUsername(form.username);
    next.email = isEmail(form.email) ? null : 'Use your college email address';
    next.password = checkPassword(form.password);

    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    try {
      await register({ ...form, year: Number(form.year) });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message);
    }
  }

  return (
    <div className="container page form-narrow">
      <div className="kicker">Free, always</div>
      <h1>Join the club</h1>
      <p className="muted">
        Membership costs nothing and takes one form. You can register for sessions the
        moment you are done.
      </p>

      <form onSubmit={submit} className="card" style={{ marginTop: 20 }}>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
          />
          {errors.username && <div className="field-error">{errors.username}</div>}
        </div>

        <div className="field">
          <label htmlFor="email">College email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
          />
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>

        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="year">Year</label>
            <select id="year" value={form.year} onChange={(e) => set('year', e.target.value)}>
              {['1', '2', '3', '4'].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="branch">Branch</label>
            <select id="branch" value={form.branch} onChange={(e) => set('branch', e.target.value)}>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {serverError && <div className="field-error">{serverError}</div>}

        <button className="btn btn-primary btn-block" type="submit" style={{ marginTop: 6 }}>
          Create account
        </button>

        <p className="muted" style={{ marginTop: 14, marginBottom: 0, fontSize: '0.85rem' }}>
          Already a member? <Link to="/login">Sign in</Link>.
        </p>
      </form>
    </div>
  );
}
