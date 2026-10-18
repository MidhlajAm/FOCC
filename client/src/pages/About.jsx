import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CLUB } from '../config';
import Avatar from '../components/Avatar';

const VALUES = [
  {
    title: 'Source first',
    body: 'If we cannot read it, we do not recommend it. Every tool we teach is one students can keep using after they graduate, for free.',
  },
  {
    title: 'Small contributions count',
    body: 'A typo fix in a README is a real contribution. Most maintainers started exactly there.',
  },
  {
    title: 'Teach sideways',
    body: 'Second years teach first years. Nobody waits for a faculty slot to learn something.',
  },
  {
    title: 'Ship in public',
    body: 'Club repos are public from commit one, bugs included. That is the point.',
  },
];

export default function About() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.get('/users').then((users) => {
      setLeads(users.filter((u) => u.role === 'admin' || u.role === 'lead'));
    });
  }, []);

  return (
    <div className="container page">
      <div className="kicker">About</div>
      <h1>{CLUB.full}</h1>

      <div className="prose">
        <p>
          Founded in 2019 by four students who wanted a Linux install party and could not
          find one, {CLUB.short} is the free and open source software community of{' '}
          {CLUB.college}. We meet every {CLUB.meetup.toLowerCase()}.
        </p>
        <p>
          The club is student run. There is no membership fee and no selection process.
          Turn up, contribute once, you are in. Alumni stay on the Matrix room and still
          review pull requests at 2 AM, which tells you something about this place.
        </p>
      </div>

      <h2 style={{ marginTop: 40 }}>What we believe</h2>
      <div className="grid grid-3">
        {VALUES.map((value) => (
          <div className="card" key={value.title}>
            <h3 style={{ fontSize: '1.05rem' }}>{value.title}</h3>
            <p className="muted" style={{ margin: 0 }}>
              {value.body}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 44 }}>Core team</h2>
      <div className="grid grid-3">
        {leads.map((lead) => (
          <div className="card" key={lead.id}>
            <div className="row">
              <Avatar user={lead} />
              <div>
                <Link to={`/members/${lead.username}`} className="mono">
                  {lead.name}
                </Link>
                <div className="muted" style={{ fontSize: '0.82rem' }}>
                  {lead.role} &middot; {lead.branch}
                </div>
              </div>
            </div>
            <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>
              {lead.bio}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 44 }}>How to join</h2>
      <ol className="prose">
        <li>Come to any Saturday session. Nobody will ask for an ID.</li>
        <li>Create a portal account so you can register for events.</li>
        <li>Make one contribution: a patch, a poster, a session, a bug report.</li>
        <li>
          You are a member. Add yourself to the{' '}
          <Link to="/members">members directory</Link>.
        </li>
      </ol>

      <div className="card" style={{ marginTop: 30 }}>
        <h3>Running the club</h3>
        <p className="muted" style={{ marginBottom: 0 }}>
          Club administration, event publishing and member records are handled by the
          admin account only. Leads run sessions and review projects, but member data
          stays with the admin.
        </p>
      </div>
    </div>
  );
}
