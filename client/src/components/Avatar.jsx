import { initials } from '../utils/format';

export default function Avatar({ user, size = 44 }) {
  return (
    <img
      className="avatar"
      src={user.avatar}
      alt={initials(user.name)}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}
