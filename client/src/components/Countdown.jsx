import { useEffect, useState } from 'react';

/** Live countdown to an event start time. */
export default function Countdown({ target }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, new Date(target).getTime() - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(remaining - 1000);
    }, 1000);
  }, []);

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (remaining <= 0) {
    return <span className="mono badge badge-warn">Session over</span>;
  }

  return (
    <span className="mono">
      {days}d {hours}h {minutes}m {seconds}s
    </span>
  );
}
