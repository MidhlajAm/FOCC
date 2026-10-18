import { Link } from 'react-router-dom';
import { formatDate, formatTime, isPast } from '../utils/date';

export default function EventCard({ event }) {
  const over = isPast(event.startsAt);

  return (
    <article className="card card-hover">
      <div className="row between">
        <span className="badge">{event.mode}</span>
        <span className="muted mono">{formatDate(event.startsAt)}</span>
      </div>

      <h3 style={{ marginTop: 12 }}>
        <Link to={`/events/${event.slug}`}>{event.title}</Link>
      </h3>

      <p className="muted">{event.summary}</p>

      <div className="row between" style={{ marginTop: 14 }}>
        <span className="mono muted">
          {formatTime(event.startsAt)} &middot; {event.venue}
        </span>
        <span className="mono">
          {over ? 'archived' : `${event.seatsLeft} seats left`}
        </span>
      </div>

      <div className="muted mono" style={{ marginTop: 6, fontSize: '0.8rem' }}>
        {event.attendeeCount} members registered
      </div>
    </article>
  );
}
