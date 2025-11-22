import React, { useState } from 'react';
import Card from './Card';
import AddCardForm from './AddCardForm';
import CustomConfirmModal from './CustomConfirmModal';
import Checkout from './Checkout';

function ProductPage({ cards, setCards, toastMessage, setToastMessage, users }) {
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cart, setCart] = useState([]);
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
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update count if product exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          count: updatedCart[existingItemIndex].count + count
        };
        setToastMessage(`${product.title} quantity updated in cart.`);
        return updatedCart;
      } else {
        // Add new product to cart
        const newCartItem = { product, count };
        setToastMessage(`${product.title} added to cart.`);
        return [...prevCart, newCartItem];
      }
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
    return cart.reduce((total, item) => total + item.count, 0);
  };

  // Calculate total price
  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.product.price.replace('$', ''));
      return total + (price * item.count);
    }, 0).toFixed(2);
  };

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
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleExportProducts}>
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setShowAddCardForm(true); setEditingCard(null); }}>
            Add New Product
          </button>
          {cart.length > 0 && (
            <button className="btn btn-success" onClick={() => setShowCheckout(true)}>
              Checkout ({getTotalCartItems()} items)
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2">
          <input 
            type="text"
            className="form-control"
            placeholder="Global Search..."
            value={searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            style={{ width: '200px' }}
          />
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setIsCardView(prev => !prev)}
        >
          Toggle {isCardView ? "Table View" : "Card View"}
        </button>
      </div>

      {!isCardView && (
        <div className="mb-3">
          <h5>Column Search</h5>
          <div className="row">
            <div className="col-md-4">
              <input 
                type="text"
                className="form-control"
                placeholder="Search Title..."
                value={titleSearch}
                onChange={e => setTitleSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
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
          </div>
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-primary" onClick={handleColumnSearch}>
              Search
            </button>
          </div>
        </div>
      )}

      {isCardView ? (
        <div className="d-flex flex-wrap justify-content-start gap-3">
          {filteredCards.map(card => (
            <Card
              key={card.id}
              card={card}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <>
          <h3 className="mt-3">Products Table View</h3>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(card => (
                <tr key={card.id}>
                  <td>{card.title}</td>
                  <td>{card.price}</td>
                  <td>{card.desc}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditCard(card)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                  <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

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
      
      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          cart={cart}
          getTotalCartPrice={getTotalCartPrice}
          onCheckoutComplete={handleCheckoutComplete}
          onCancel={() => setShowCheckout(false)}
          users={users || []}
        />
      )}
      
      <CustomConfirmModal
        show={showDeleteModal}
        message="Are you sure you want to delete this product?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default ProductPage;