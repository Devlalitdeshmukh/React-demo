import React, { useState, useEffect } from 'react';
import Card from './Card';
import AddCardForm from './AddCardForm';
import CustomConfirmModal from './CustomConfirmModal';
import Checkout from './Checkout';

function ProductPage({ cards, setCards, cart, setCart, toastMessage, setToastMessage, users }) {
  console.log("ProductPage rendered with cart:", cart);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  
  // Individual column search terms
  const [titleSearch, setTitleSearch] = useState("");
  const [priceSearch, setPriceSearch] = useState("");
  const [descSearch, setDescSearch] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDeleteCard = (id) => {
    setCardToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (cardToDelete) {
      setCards(prev => prev.filter(card => card.id !== cardToDelete));
      setToastMessage("Card deleted successfully.");
      // Clear editing card if deleted
      if (editingCard && editingCard.id === cardToDelete) {
        setEditingCard(null);
        setShowAddCardForm(false);
      }
      // Close modal and reset card to delete
      setShowDeleteModal(false);
      setCardToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCardToDelete(null);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowAddCardForm(true);
  };

  const handleAddCard = (newCard) => {
    const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
    setCards(prev => [...prev, { id: newId, ...newCard }]);
    setToastMessage("Card added successfully.");
  };

  const handleUpdateCard = (updatedCard) => {
    setCards(prev =>
      prev.map(card => (card.id === updatedCard.id ? updatedCard : card))
    );
    setToastMessage("Card updated successfully.");
    setEditingCard(null);
  };

  // Handle adding product to cart
  const handleAddToCart = (product, count) => {
    console.log("Adding to cart:", product, count);
    
    setCart(prevCart => {
      // Create new cart array (immutable update)
      const newCart = prevCart.map(item => ({...item})); // Create shallow copy of existing items
      // Check if product already exists in cart
      const existingItemIndex = newCart.findIndex(item => item.product.id === product.id);
      console.log("Existing item index:", existingItemIndex);
      
      if (existingItemIndex >= 0) {
        // Update count if product exists
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          count: newCart[existingItemIndex].count + count
        };
        setToastMessage(`${product.title} quantity updated in cart.`);
      } else {
        // Add new product to cart
        const newCartItem = { product: {...product}, count }; // Create new item with copied product
        newCart.push(newCartItem);
        setToastMessage(`${product.title} added to cart.`);
      }
      
      console.log("Updated cart:", newCart);
      return newCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Update item quantity in cart
  const updateCartQuantity = (productId, newCount) => {
    if (newCount <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, count: newCount } 
          : item
      )
    );
  };

  // Calculate total items in cart
  const getTotalCartItems = () => {
    const total = cart.reduce((total, item) => total + item.count, 0);
    console.log("Total cart items:", total);
    return total;
  };

  // Calculate total price
  const getTotalCartPrice = () => {
    const total = cart.reduce((total, item) => {
      const price = parseFloat(item.product.price.replace('$', ''));
      return total + (price * item.count);
    }, 0).toFixed(2);
    console.log("Total cart price:", total);
    return total;
  };

  // Debugging: Log cart contents
  useEffect(() => {
    console.log("Cart contents updated:", cart);
  }, [cart]);

  // Debugging: Log component render
  useEffect(() => {
    console.log("ProductPage component mounted");
  }, []);

  // Handle checkout completion
  const handleCheckoutComplete = (invoice) => {
    console.log("Invoice generated:", invoice);
    setShowCheckout(false);
    setCart([]); // Clear cart after checkout
    setToastMessage(`Checkout completed! Invoice ${invoice.id} generated.`);
  };

  // Filter cards based on search terms
  const filteredCards = cards.filter(card => {
    const matchesGlobalSearch = Object.values(card).some(value =>
      String(value).toLowerCase().includes(String(searchTerm).toLowerCase())
    );
    
    const matchesTitle = card.title.toLowerCase().includes(titleSearch.toLowerCase());
    const matchesPrice = card.price.toLowerCase().includes(priceSearch.toLowerCase());
    const matchesDesc = card.desc.toLowerCase().includes(descSearch.toLowerCase());
    
    if (searchTerm) {
      return matchesGlobalSearch;
    } else {
      return matchesTitle && matchesPrice && matchesDesc;
    }
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCards.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when search terms change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  
  const handleColumnSearch = () => {
    setCurrentPage(1);
  };

  const exportToCSV = (data, filename) => {
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(item => Object.values(item).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportProducts = () => {
    exportToCSV(cards, 'products.csv');
  };

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-start">Product Management</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleExportProducts}>
            <i className="bi bi-download me-2"></i>Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setShowAddCardForm(true); setEditingCard(null); }}>
            <i className="bi bi-plus-circle me-2"></i>Add New Product
          </button>
          {cart.length > 0 && (
            <button 
              className="btn btn-warning position-relative"
              onClick={() => setShowCheckout(true)}
            >
              <i className="bi bi-cart me-2"></i>Checkout
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {getTotalCartItems()}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-2">
              <div className="input-group" style={{ width: '300px' }}>
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Global Search..."
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setIsCardView(prev => !prev)}
            >
              <i className={`bi ${isCardView ? "bi-table" : "bi-grid"} me-2`}></i>
              {isCardView ? "Table View" : "Card View"}
            </button>
          </div>

          {!isCardView && (
            <div className="mb-3">
              <h5 className="mb-3 text-start">Column Search</h5>
              <div className="row g-2">
                <div className="col-md-3">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search Title..."
                    value={titleSearch}
                    onChange={e => setTitleSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search Price..."
                    value={priceSearch}
                    onChange={e => setPriceSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search Description..."
                    value={descSearch}
                    onChange={e => setDescSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-primary w-100" onClick={handleColumnSearch}>
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isCardView ? (
            <div className="row">
              {currentItems.map(card => (
                <div className="col-lg-4 col-md-6 mb-4" key={card.id}>
                  <Card 
                    card={card} 
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
              {/* Add empty columns to maintain grid structure when there are fewer items */}
              {currentItems.length > 0 && currentItems.length < 3 && Array.from({ length: 3 - currentItems.length }).map((_, index) => (
                <div className="col-lg-4 col-md-6 mb-4" key={`empty-${index}`}>
                  <div className="card h-100 shadow-sm" style={{ visibility: 'hidden' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div style={{ width: '60px', height: '60px' }}></div>
                        <div>
                          <h5 className="card-title mb-1">Placeholder</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-start">#</th>
                    <th scope="col" className="text-start">Product</th>
                    <th scope="col" className="text-start">Price</th>
                    <th scope="col" className="text-start">Description</th>
                    <th scope="col" className="text-start">Quantity</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((card, index) => (
                    <tr key={card.id}>
                      <td className="text-start">{indexOfFirstItem + index + 1}</td>
                      <td className="text-start">
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" 
                               style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-image text-muted" style={{ fontSize: '1.5rem' }}></i>
                          </div>
                          <div>
                            <div className="fw-bold">{card.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-start">
                        <span className="fw-bold text-success">{card.price}</span>
                      </td>
                      <td className="text-start">{card.desc}</td>
                      <td className="text-start">
                        <span className={`badge ${card.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {card.quantity > 0 ? `${card.quantity} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditCard(card)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Product pagination">
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li 
                    key={page} 
                    className={`page-item ${currentPage === page ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Add/Edit Card Form Modal */}
      {showAddCardForm && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-start">
                  {editingCard ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowAddCardForm(false);
                    setEditingCard(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <AddCardForm 
                  show={showAddCardForm}
                  onClose={() => {
                    setShowAddCardForm(false);
                    setEditingCard(null);
                  }}
                  onAdd={handleAddCard}
                  editCard={editingCard}
                  onUpdate={handleUpdateCard}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-start">Checkout</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCheckout(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Checkout 
                  cart={cart}
                  users={users}
                  onRemoveFromCart={removeFromCart}
                  onUpdateQuantity={updateCartQuantity}
                  onComplete={handleCheckoutComplete}
                  getTotalPrice={getTotalCartPrice}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <CustomConfirmModal
        show={showDeleteModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this product?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default ProductPage;