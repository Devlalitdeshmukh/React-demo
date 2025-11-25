import React from "react";
import { useState } from "react";

function AddCardForm({ show, onClose, onAdd, editCard, onUpdate }) {
  const [title, setTitle] = useState(editCard ? editCard.title : "");
  const [price, setPrice] = useState(editCard ? editCard.price : "");
  const [desc, setDesc] = useState(editCard ? editCard.desc : "");
  const [image, setImage] = useState(editCard ? editCard.image : "");
  const [quantity, setQuantity] = useState(editCard ? editCard.quantity || 0 : 0); // Add quantity state

  // Reset form fields when editCard changes
  React.useEffect(() => {
    if (editCard) {
      setTitle(editCard.title);
      setPrice(editCard.price);
      setDesc(editCard.desc);
      setImage(editCard.image || "");
      setQuantity(editCard.quantity || 0); // Set quantity when editing
    } else {
      setTitle("");
      setPrice("");
      setDesc("");
      setImage("");
      setQuantity(0);
    }
  }, [editCard]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !desc) {
      alert("Please fill in all fields");
      return;
    }
    if (editCard) {
      onUpdate({ id: editCard.id, title, price, desc, image, quantity }); // Include quantity in update
    } else {
      onAdd({ title, price, desc, image, quantity }); // Include quantity in add
    }
    setTitle("");
    setPrice("");
    setDesc("");
    setImage("");
    setQuantity(0);
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
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title text-start">
                <i className={`bi bi-${editCard ? 'pencil' : 'plus-circle'} me-2`}></i>
                {editCard ? "Edit Product" : "Add New Product"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 text-start">
                <label htmlFor="titleInput" className="form-label text-start">Title</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-tag"></i>
                  </span>
                  <input
                    id="titleInput"
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter product title"
                  />
                </div>
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="priceInput" className="form-label text-start">Price</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-currency-dollar"></i>
                  </span>
                  <input
                    id="priceInput"
                    type="text"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="Enter price (e.g., $99.99)"
                  />
                </div>
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="descInput" className="form-label text-start">Description</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-card-text"></i>
                  </span>
                  <textarea
                    id="descInput"
                    className="form-control"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                    rows="3"
                    placeholder="Enter product description"
                  ></textarea>
                </div>
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="quantityInput" className="form-label text-start">Quantity</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-archive"></i>
                  </span>
                  <input
                    id="quantityInput"
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    min="0"
                    required
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="imageInput" className="form-label text-start">Image URL (optional)</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-image"></i>
                  </span>
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
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                <i className="bi bi-x-circle me-2"></i>Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-check-circle me-2"></i>
                {editCard ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCardForm;