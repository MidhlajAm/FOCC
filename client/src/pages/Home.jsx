import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CLUB } from '../config';
import EventCard from '../components/EventCard';
import PostCard from '../components/PostCard';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import { compact } from '../utils/format';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const [s, e, p, a] = await Promise.all([
        api.get('/stats'),
        api.get('/events?upcoming=true'),
        api.get('/posts'),
        api.get('/announcements'),
      ]);
      setStats(s);
      setEvents(e);
      setPosts(p);
      setAnnouncements(a);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <header className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="kicker">{CLUB.college}</div>
            <h1>
              We read the source
              <br />
              before we trust it.
            </h1>
            <p className="muted" style={{ maxWidth: 520 }}>
              {CLUB.full} has been shipping, breaking and fixing free software with
              students since {CLUB.foundedYear}. No membership fee, no interview, no
              prerequisite beyond curiosity.
            </p>
            <div className="row" style={{ marginTop: 22 }}>
              <Link to="/register" className="btn btn-primary">
                Join the club
              </Link>
              <Link to="/bug-hunt" className="btn">
                Bug Hunt 2026
              </Link>
              <Link to="/projects" className="btn btn-ghost">
                Browse projects
              </Link>
            </div>
          </div>

          <div className="hero-panel">
            <div className="terminal">
              <div className="terminal-bar">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <pre>
                <span className="muted">$</span> git clone {CLUB.github}/portal
                {'\n'}
                <span className="out">Cloning into &apos;portal&apos;...</span>
                {'\n'}
                <span className="muted">$</span> npm run dev
                {'\n'}
                <span className="out">portal running on :5173</span>
                {'\n'}
                <span className="muted">$</span> # now find what is wrong with it
              </pre>
            </div>
          </div>
        </div>
      </header>

      <section className="container page">
        {announcements.length > 0 && (
          <div className="card" style={{ marginBottom: 28 }}>
            <div className="stack" style={{ gap: 8 }}>
              {announcements.map((a, index) => (
                <div className="row" key={index}>
                  <span className={a.level === 'warning' ? 'badge badge-warn' : 'badge badge-ok'}>
                    &#9679;
                  </span>
                  <span>{a.body}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <Loader label="Loading club data" />}

        {stats && (
          <div className="grid grid-4" style={{ marginBottom: 40 }}>
            <StatCard value={stats.members} label="Members" />
            <StatCard value={stats.activeProjects} label="Active projects" />
            <StatCard value={stats.sessionsHosted} label="Sessions hosted" />
            <StatCard value={compact(stats.openSourceStars)} label="Upstream stars" />
          </div>
        )}

        <div className="row between" style={{ marginBottom: 14 }}>
          <h2>Upcoming sessions</h2>
          <Link to="/events" className="mono muted">
            all events &rarr;
          </Link>
        </div>
        <div className="grid grid-3">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="row between" style={{ margin: '44px 0 14px' }}>
          <h2>From the blog</h2>
          <Link to="/blog" className="mono muted">
            all posts &rarr;
          </Link>
        </div>
        <div className="grid grid-3">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
