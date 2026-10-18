import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import { isPast } from '../utils/date';

const MODES = ['all', 'offline', 'online', 'hybrid'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('all');
  const [query, setQuery] = useState('');
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    api
      .get('/events')
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    let rows = events;
    if (mode !== 'all') rows = rows.filter((e) => e.mode === mode);
    if (!showPast) rows = rows.filter((e) => !isPast(e.startsAt));
    if (query) {
      const needle = query.toLowerCase();
      rows = rows.filter(
        (e) =>
          e.title.toLowerCase().includes(needle) ||
          e.summary.toLowerCase().includes(needle),
      );
    }
    return rows;
  }, [events, mode, query, showPast]);

  return (
    <div className="container page">
      <div className="kicker">Sessions</div>
      <h1>Events</h1>
      <p className="muted" style={{ maxWidth: 560 }}>
        Workshops, install fests and overnight builds. Everything is free and open to
        every branch and every year.
      </p>

      <div className="row between" style={{ margin: '26px 0 18px' }}>
        <div className="row">
          {MODES.map((m) => (
            <button
              key={m}
              className={`tag ${mode === m ? 'on' : ''}`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
          <label className="row mono" style={{ gap: 6, marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
              style={{ width: 'auto' }}
            />
            show archived
          </label>
        </div>

        <SearchBar value={query} onChange={setQuery} placeholder="Search sessions" />
      </div>

      {loading && <Loader label="Loading sessions" />}

      {!loading && visible.length === 0 && (
        <EmptyState
          title="Nothing scheduled here"
          hint="Try another mode, or tick 'show archived' to see past sessions."
        />
      )}

      <div className="grid grid-3">
        {visible.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
