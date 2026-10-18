import { sanitizeHtml } from '../utils/sanitize';

export default function RichText({ html, className = 'prose' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}
