import { useState } from "react";

function Card({ card, onEdit, onDelete, onAddToCart }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => (prev > 0 ? prev - 1 : 0));
  const addToCart = () => {
    if (count > 0 && onAddToCart) {
      onAddToCart(card, count);
      setCount(0);
    }
  };

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
        <div className="d-flex align-items-center mb-3">
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={decrement}>-</button>
          <span>{count}</span>
          <button className="btn btn-sm btn-outline-primary ms-2" onClick={increment}>+</button>
        </div>
        <button className="btn btn-sm btn-success mb-3 w-100" onClick={addToCart} disabled={count === 0}>
          Add to Cart
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