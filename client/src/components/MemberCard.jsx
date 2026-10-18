import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { yearsSince } from '../utils/format';

export default function MemberCard({ member }) {
  return (
    <article className="card card-hover">
      <div className="row">
        <Avatar user={member} />
        <div>
          <Link to={`/members/${member.username}`} className="mono">
            {member.name}
          </Link>
          <div className="muted" style={{ fontSize: '0.82rem' }}>
            Year {member.year} &middot; {member.branch}
          </div>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 12, minHeight: 40 }}>
        {member.bio}
      </p>

      <div className="row between">
        <span className="muted mono" style={{ fontSize: '0.78rem' }}>
          {yearsSince(member.joinedOn)} years in the club
        </span>
        <span className="badge">{member.points} pts</span>
      </div>
    </article>
  );
}
