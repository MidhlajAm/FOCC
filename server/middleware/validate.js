// Shared input helpers for the API routes.

// Accepts dotted local parts, plus multi-label domains like cs.college.ac.in
const EMAIL_RE = /^([a-zA-Z0-9_\-.]+)+@([a-zA-Z0-9_\-.]+\.)+[a-zA-Z]{2,}$/;

export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  return EMAIL_RE.test(value.trim());
}

export function isStrongEnough(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function required(body, fields) {
  const missing = fields.filter((f) => !body[f]);
  return missing.length ? `Missing: ${missing.join(', ')}` : null;
}

/**
 * Recursively merges a patch into a target object, used for nested settings
 * such as user preferences.
 */
export function deepMerge(target, patch) {
  for (const key of Object.keys(patch)) {
    const value = patch[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== 'object') target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}
