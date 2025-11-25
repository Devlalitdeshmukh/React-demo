import React, { useState } from 'react';

function ShoppingCart({ cart, updateCartQuantity, removeFromCart, getTotalCartPrice }) {
  const [showCart, setShowCart] = useState(false);

  // Calculate total items in cart
  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.count, 0);
  };

  return (
    <div className="position-relative">
      <button 
        className="btn btn-primary position-relative"
        onClick={() => setShowCart(!showCart)}
      >
        <i className="bi bi-cart me-2"></i>Cart
        {getTotalCartItems() > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {getTotalCartItems()}
            <span className="visually-hidden">items in cart</span>
          </span>
        )}
      </button>
      
      {/* Cart Dropdown */}
      {showCart && (
        <div 
          className="card shadow-lg"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '350px',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-cart me-2"></i>Shopping Cart
              <span className="badge bg-light text-dark ms-2">{getTotalCartItems()}</span>
            </h5>
          </div>
          
          {cart.length === 0 ? (
            <div className="card-body text-center py-4">
              <i className="bi bi-cart-x text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-2 mb-0 text-muted">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="card-body p-0" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {cart.map((item, index) => (
                  <div 
                    key={item.product.id} 
                    className="border-bottom px-3 py-2"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <div className="fw-bold">{item.product.title}</div>
                        <div className="small text-muted">{item.product.price}</div>
                      </div>
                      
                      <div className="d-flex align-items-center mx-3">
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updateCartQuantity(item.product.id, item.count - 1)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="mx-2">{item.count}</span>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updateCartQuantity(item.product.id, item.count + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      
                      <div>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="card-footer bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Total: ${getTotalCartPrice()}</strong>
                  </div>
                  <button className="btn btn-success btn-sm">
                    <i className="bi bi-credit-card me-1"></i>Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;