function Header({title, description, cartItemCount, cart, showCart, setShowCart, removeFromCart, updateCartQuantity, getTotalCartPrice}) {
    return (
        <header style={{ padding: "10px", background:"#f0f0f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ flex: '1', textAlign: 'left' }}>
                {/* Left side placeholder */}
            </div>
            <div style={{ flex: '2', textAlign: 'center' }}>
              <h1>{title}</h1>
              <h5>{description}</h5>
            </div>
            <div style={{ flex: '1', textAlign: 'right' }}>
                <button 
                    className="btn btn-primary position-relative"
                    onClick={() => setShowCart(!showCart)}
                    style={{ minWidth: '100px' }}
                >
                    Cart
                    {cartItemCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartItemCount}
                            <span className="visually-hidden">items in cart</span>
                        </span>
                    )}
                </button>
                
                {/* Cart Dropdown */}
                {showCart && (
                    <div 
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            width: '350px',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            zIndex: 1000,
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                            <h5>Shopping Cart ({cartItemCount} items)</h5>
                        </div>
                        
                        {cart.length === 0 ? (
                            <div style={{ padding: '15px', textAlign: 'center' }}>
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                    {cart.map((item, index) => (
                                        <div 
                                            key={item.product.id} 
                                            style={{ 
                                                padding: '10px 15px',
                                                borderBottom: index < cart.length - 1 ? '1px solid #eee' : 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ flex: '2' }}>
                                                <div><strong>{item.product.title}</strong></div>
                                                <div style={{ fontSize: '0.9em', color: '#666' }}>{item.product.price}</div>
                                            </div>
                                            
                                            <div style={{ 
                                                flex: '1', 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateCartQuantity(item.product.id, item.count - 1)}
                                                    style={{ padding: '2px 8px' }}
                                                >
                                                    -
                                                </button>
                                                <span style={{ margin: '0 8px' }}>{item.count}</span>
                                                <button 
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => updateCartQuantity(item.product.id, item.count + 1)}
                                                    style={{ padding: '2px 8px' }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <div style={{ flex: '1', textAlign: 'right' }}>
                                                <button 
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeFromCart(item.product.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div style={{ 
                                    padding: '15px', 
                                    borderTop: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <strong>Total: ${getTotalCartPrice()}</strong>
                                    </div>
                                    <button className="btn btn-success btn-sm">
                                        Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;