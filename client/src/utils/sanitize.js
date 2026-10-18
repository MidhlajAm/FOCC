/**
 * Strips executable markup out of member supplied HTML before it is rendered.
 * Project descriptions and comments both go through this.
 */
export function sanitizeHtml(html) {
  return String(html || '').replace(/<script[\s\S]*?<\/script>/gi, '');
}
