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
    <div className="card mb-4" style={{ width: '300px' }}>
      {/* Product Image */}
      <div style={{ 
        height: '200px', 
        backgroundColor: '#f8f9fa', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid #dee2e6'
      }}>
        {card.image ? (
          <img 
            src={card.image} 
            alt={card.title} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        ) : (
          <span style={{ fontSize: '3rem', color: '#6c757d' }}>
            📷
          </span>
        )}
      </div>
      
      <div className="card-body">
        <h5 className="card-title">{card.title}</h5>
        <p className="card-text">{card.desc}</p>
        <p className="card-text">
          <strong>Price: </strong>{card.price}
        </p>
        <p className="card-text">
          <strong>Available: </strong>{card.quantity} {card.quantity === 1 ? 'item' : 'items'}
        </p>
        {/* Center-aligned increment/decrement section */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={decrement} disabled={isOutOfStock}>-</button>
          <span>{count}</span>
          <button 
            className="btn btn-sm btn-outline-primary ms-2" 
            onClick={increment} 
            disabled={isOutOfStock || count >= card.quantity}
          >
            +
          </button>
        </div>
        {isOutOfStock && (
          <div className="alert alert-warning text-center py-2" role="alert">
            <strong>Out of Stock</strong>
          </div>
        )}
        {count >= card.quantity && card.quantity > 0 && (
          <div className="alert alert-info text-center py-2" role="alert">
            <small>Max quantity reached</small>
          </div>
        )}
        <button className="btn btn-sm btn-success mb-3 w-100" onClick={addToCart} disabled={count === 0 || isOutOfStock}>
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-sm btn-warning"
            onClick={() => onEdit(card)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(card.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;