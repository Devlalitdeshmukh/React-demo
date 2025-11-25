import { useState } from "react";

function Card({ card, onEdit, onDelete, onAddToCart }) {
  const [count, setCount] = useState(0);

  const increment = () => {
    // Only increment if we haven't reached the available quantity
    if (count < card.quantity) {
      setCount(prev => prev + 1);
    }
  };
  
  const decrement = () => setCount(prev => (prev > 0 ? prev - 1 : 0));
  
  const addToCart = () => {
    if (count > 0 && onAddToCart) {
      onAddToCart(card, count);
      setCount(0);
    }
  };

  // Check if product is out of stock
  const isOutOfStock = card.quantity === 0;

  return (
    <div className="card h-100 shadow-sm">
      {/* Product Image */}
      <div className="card-img-top d-flex align-items-center justify-content-center bg-light" 
           style={{ height: '200px' }}>
        {card.image ? (
          <img 
            src={card.image} 
            alt={card.title} 
            className="img-fluid h-100" 
            style={{ objectFit: 'cover' }} 
          />
        ) : (
          <div className="text-center">
            <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mt-2 mb-0">No Image</p>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-start">{card.title}</h5>
        <p className="card-text text-muted flex-grow-1 text-start">{card.desc}</p>
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 text-success mb-0 text-start">{card.price}</span>
            <span className={`badge ${card.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
              {card.quantity > 0 ? `${card.quantity} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
        
        {/* Quantity Selector */}
        <div className="mb-3">
          <label className="form-label small text-muted text-start">Quantity</label>
          <div className="input-group">
            <button 
              className="btn btn-outline-secondary" 
              type="button" 
              onClick={decrement} 
              disabled={isOutOfStock || count <= 0}
            >
              <i className="bi bi-dash"></i>
            </button>
            <input 
              type="text" 
              className="form-control text-center" 
              value={count} 
              readOnly 
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button" 
              onClick={increment} 
              disabled={isOutOfStock || count >= card.quantity}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>
        
        <div className="mt-auto">
          <button 
            className="btn btn-success w-100 mb-2" 
            onClick={addToCart} 
            disabled={count === 0 || isOutOfStock}
          >
            <i className="bi bi-cart me-2"></i>
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary flex-fill"
              onClick={() => onEdit(card)}
            >
              <i className="bi bi-pencil me-1"></i>Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger flex-fill"
              onClick={() => onDelete(card.id)}
            >
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;