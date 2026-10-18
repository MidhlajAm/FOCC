export default function EmptyState({ title, hint }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '34px 18px' }}>
      <div className="mono" style={{ fontSize: '1.05rem' }}>
        {title}
      </div>
      {hint && <p className="muted" style={{ marginTop: 8 }}>{hint}</p>}
    </div>
  );
}
