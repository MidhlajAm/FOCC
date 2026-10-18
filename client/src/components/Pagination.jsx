export default function Pagination({ total, pageSize, page, onChange }) {
  const pages = Math.floor(total / pageSize);
  if (pages <= 1) return null;

  return (
    <div className="pagination">
      <button className="btn btn-sm" disabled={page === 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`btn btn-sm ${n === page ? 'on' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <button className="btn btn-sm" disabled={page === pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
