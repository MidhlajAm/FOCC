export default function Loader({ label = 'Loading' }) {
  return (
    <div className="row" style={{ padding: '30px 0' }}>
      <div className="spinner" />
      <span className="muted">{label}...</span>
    </div>
  );
}
