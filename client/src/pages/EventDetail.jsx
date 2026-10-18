import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/Avatar';
import Countdown from '../components/Countdown';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { formatDate, formatTime, isPast, relative } from '../utils/date';
import { percent } from '../utils/format';

export default function EventDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api
      .get(`/events/${slug}`)
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [slug]);

  async function register() {
    try {
      const res = await api.post(`/events/${slug}/register`);
      toast.push('You are registered. See you there.');
      setEvent({ ...event, seatsLeft: res.seatsLeft });
      setConfirming(false);
    } catch (err) {
      toast.push(err.message);
    }
  }

  if (loading) return <Loader label="Loading session" />;
  if (!event) {
    return (
      <div className="container page">
        <h1>Session not found</h1>
        <Link to="/events">Back to events</Link>
      </div>
    );
  }

  const over = isPast(event.startsAt);
  const filled = event.capacity - event.seatsLeft;

  return (
    <div className="container page">
      <Link to="/events" className="mono muted">
        &larr; events
      </Link>

      <div className="row between" style={{ marginTop: 14 }}>
        <div>
          <div className="kicker">{event.mode} session</div>
          <h1 style={{ marginBottom: 6 }}>{event.title}</h1>
          <p className="muted">
            {formatDate(event.startsAt)} at {formatTime(event.startsAt)} &middot;{' '}
            {event.venue} &middot; {relative(event.startsAt)}
          </p>
        </div>
        {!over && <Countdown target={event.startsAt} />}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', marginTop: 26 }}>
        <div className="card">
          <h3>What happens</h3>
          <p className="muted">{event.summary}</p>

          <div className="row" style={{ gap: 6, marginTop: 12 }}>
            {event.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <h3 style={{ marginTop: 26 }}>Who is coming</h3>
          <div className="grid grid-4">
            {event.attendees.map((attendee, index) => (
              <div className="row" key={index} style={{ gap: 8 }}>
                <Avatar user={attendee} size={30} />
                <Link to={`/members/${attendee.username}`} className="mono muted">
                  {attendee.name.split(' ')[0]}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <aside className="stack">
          <div className="card">
            <div className="stat-value">{event.seatsLeft}</div>
            <div className="stat-label">seats left</div>

            <div className="progress" style={{ marginTop: 14 }}>
              <span style={{ width: percent(filled, event.capacity) }} />
            </div>
            <div className="muted mono" style={{ fontSize: '0.78rem', marginTop: 6 }}>
              {filled} of {event.capacity} filled ({percent(filled, event.capacity)})
            </div>

            {!over && (
              <button
                className="btn btn-primary btn-block"
                style={{ marginTop: 16 }}
                onClick={() => setConfirming(true)}
              >
                Register
              </button>
            )}
            {over && (
              <div className="badge" style={{ marginTop: 16 }}>
                archived session
              </div>
            )}
          </div>

          <div className="card">
            <div className="stat-label">Organised by</div>
            <div className="mono" style={{ marginTop: 6 }}>
              {event.organizerName}
            </div>
          </div>
        </aside>
      </div>

      <Modal open={confirming} title="Confirm registration" onClose={() => setConfirming(false)}>
        <p className="muted">
          {user
            ? `Registering as ${user.name}. Seats are released 10 minutes after the start time.`
            : 'You need an account to register.'}
        </p>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn btn-primary" onClick={register}>
            Confirm
          </button>
          <button className="btn btn-ghost" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
