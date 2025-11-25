function CustomConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div
      className="modal show fade d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title text-start">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {title || "Confirm Action"}
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <i className="bi bi-x-circle me-2"></i>Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              <i className="bi bi-check-circle me-2"></i>Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomConfirmModal;