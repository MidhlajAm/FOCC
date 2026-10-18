import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CLUB } from '../config';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/projects', label: 'Projects' },
  { to: '/members', label: 'Members' },
  { to: '/blog', label: 'Blog' },
  { to: '/bug-hunt', label: 'Bug Hunt' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span>&gt;_</span> {CLUB.short}
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname.startsWith(link.to) ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && <Link to="/admin">Admin</Link>}

          <button
            className="btn btn-sm btn-ghost"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          {user ? (
            <>
              <Link to="/dashboard">{user.name.split(' ')[0]}</Link>
              <button className="btn btn-sm" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
