import React from "react";
import { useState } from "react";

function AddCardForm({ show, onClose, onAdd, editCard, onUpdate }) {
  const [title, setTitle] = useState(editCard ? editCard.title : "");
  const [price, setPrice] = useState(editCard ? editCard.price : "");
  const [desc, setDesc] = useState(editCard ? editCard.desc : "");
  const [image, setImage] = useState(editCard ? editCard.image : "");

  // Reset form fields when editCard changes
  React.useEffect(() => {
    if (editCard) {
      setTitle(editCard.title);
      setPrice(editCard.price);
      setDesc(editCard.desc);
      setImage(editCard.image || "");
    } else {
      setTitle("");
      setPrice("");
      setDesc("");
      setImage("");
    }
  }, [editCard]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !desc) {
      alert("Please fill in all fields");
      return;
    }
    if (editCard) {
      onUpdate({ id: editCard.id, title, price, desc, image });
    } else {
      onAdd({ title, price, desc, image });
    }
    setTitle("");
    setPrice("");
    setDesc("");
    setImage("");
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal show fade d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content custom-modal">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editCard ? "Edit Card" : "Add New Card"}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="titleInput" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                  Title
                </label>
                <input
                  id="titleInput"
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="priceInput" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                  Price
                </label>
                <input
                  id="priceInput"
                  type="text"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descInput" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                  Description
                </label>
                <textarea
                  id="descInput"
                  className="form-control"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="imageInput" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                  Image URL (optional)
                </label>
                <input
                  id="imageInput"
                  type="text"
                  className="form-control"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                {editCard ? "Update Card" : "Add Card"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCardForm;