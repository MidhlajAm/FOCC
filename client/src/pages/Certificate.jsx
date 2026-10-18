import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { CLUB } from '../config';
import Loader from '../components/Loader';
import { formatDate } from '../utils/date';

export default function Certificate() {
  const { userId } = useParams();
  const [cert, setCert] = useState(null);

  useEffect(() => {
    api.get(`/certificate/${userId}`).then(setCert);
  }, [userId]);

  if (!cert) return <Loader label="Generating certificate" />;

  return (
    <div className="container page">
      <div
        className="card"
        style={{ maxWidth: 680, margin: '0 auto', padding: 40, textAlign: 'center' }}
      >
        <div className="kicker">{CLUB.college}</div>
        <h1 style={{ marginTop: 10 }}>Certificate of Participation</h1>
        <p className="muted">This is to certify that</p>

        <div className="mono" style={{ fontSize: '1.6rem', color: 'var(--accent)' }}>
          {cert.name}
        </div>
        <p className="muted" style={{ marginTop: 4 }}>
          {cert.email} &middot; {cert.branch}
        </p>

        <p style={{ maxWidth: 440, margin: '18px auto' }}>
          has been an active member of {CLUB.full} since {formatDate(cert.memberSince)},
          attending {cert.sessionsAttended} sessions and earning {cert.points} club points.
        </p>

        <div className="row between" style={{ marginTop: 30 }}>
          <div className="mono muted" style={{ fontSize: '0.78rem' }}>
            Verification: {cert.verification}
          </div>
          <button className="btn btn-sm" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
