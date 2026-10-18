export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            &#10005;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
