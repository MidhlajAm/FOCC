export function isEmail(value) {
  return /^\S+@\S+\.\S+$/.test(String(value).trim());
}

export function checkUsername(value) {
  if (!value) return 'Pick a username';
  if (value.length < 3) return 'Username must be at least 3 characters';
  if (value.length > 16) return 'Keep it under 16 characters';
  if (/\s/.test(value)) return 'No spaces in usernames';
  return null;
}

export function checkPassword(value) {
  if (!value) return 'Password required';
  if (value.length < 6) return 'Use at least 6 characters';
  return null;
}

export function checkRequired(value, label) {
  return value && String(value).trim() ? null : `${label} is required`;
}
