import React, { useState, useEffect } from 'react';

function Checkout({ cart, getTotalCartPrice, onCheckoutComplete, onCancel, users }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: ''
  });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [errors, setErrors] = useState({});
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [editableItems, setEditableItems] = useState([]);

  // Reset form when component mounts or users change
  useEffect(() => {
    setUser({
      name: '',
      email: '',
      phone: '',
      address: '',
      country: ''
    });
    setSelectedUserId('');
    setErrors({});
  }, []);

  // Reset editable items when cart changes
  useEffect(() => {
    if (cart && cart.length > 0) {
      const initialEditableItems = cart.map(item => ({
        ...item,
        editableCount: item.count,
        editablePrice: parseFloat(item.product.price.replace('$', ''))
      }));
      setEditableItems(initialEditableItems);
    }
  }, [cart]);

  // Pre-fill user info when a user is selected
  useEffect(() => {
    if (selectedUserId) {
      const selectedUser = users.find(u => u.id === parseInt(selectedUserId));
      if (selectedUser) {
        setUser({
          name: selectedUser.name,
          email: selectedUser.email,
          phone: selectedUser.phone,
          address: selectedUser.address,
          country: selectedUser.country
        });
      }
    } else {
      // Clear form if no user selected
      setUser({
        name: '',
        email: '',
        phone: '',
        address: '',
        country: ''
      });
    }
  }, [selectedUserId, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.name.trim()) newErrors.name = 'Name is required';
    if (!user.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!user.phone.trim()) newErrors.phone = 'Phone is required';
    if (!user.address.trim()) newErrors.address = 'Address is required';
    if (!user.country.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateInvoice = () => {
    if (validateForm()) {
      // Generate invoice
      const newInvoice = {
        id: `INV-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        user: { ...user },
        items: editableItems.map(item => ({
          ...item,
          totalPrice: (item.editablePrice * item.editableCount).toFixed(2)
        })),
        totalAmount: editableItems.reduce((total, item) => 
          total + (item.editablePrice * item.editableCount), 0).toFixed(2)
      };
      
      setInvoice(newInvoice);
      setShowInvoicePreview(true);
    }
  };

  const handleConfirmCheckout = () => {
    if (invoice) {
      onCheckoutComplete(invoice);
    }
  };

  const downloadInvoice = () => {
    if (!invoice) return;
    
    const invoiceText = `
INVOICE
========
Invoice ID: ${invoice.id}
Date: ${invoice.date}

Customer Information:
Name: ${invoice.user.name}
Email: ${invoice.user.email}
Phone: ${invoice.user.phone}
Address: ${invoice.user.address}
Country: ${invoice.user.country}

Items:
${invoice.items.map(item => 
  `${item.product.title} x ${item.editableCount} @ $${item.editablePrice.toFixed(2)} = $${item.totalPrice}`
).join('\n')}

Total Amount: $${invoice.totalAmount}
`;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle editable item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'editableCount' || field === 'editablePrice' ? parseFloat(value) || 0 : value
    };
    setEditableItems(updatedItems);
  };

  // Render invoice preview
  if (showInvoicePreview && invoice) {
    return (
      <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Invoice Preview</h5>
              <button type="button" className="btn-close" onClick={() => setShowInvoicePreview(false)}></button>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 text-center mb-4">
                    <h3>INVOICE</h3>
                    <p className="mb-1"><strong>Invoice ID:</strong> {invoice.id}</p>
                    <p><strong>Date:</strong> {invoice.date}</p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-6">
                    <h5>Customer Information</h5>
                    <p className="mb-1"><strong>Name:</strong> {invoice.user.name}</p>
                    <p className="mb-1"><strong>Email:</strong> {invoice.user.email}</p>
                    <p className="mb-1"><strong>Phone:</strong> {invoice.user.phone}</p>
                    <p className="mb-1"><strong>Address:</strong> {invoice.user.address}</p>
                    <p><strong>Country:</strong> {invoice.user.country}</p>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-12">
                    <h5>Items</h5>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map(item => (
                          <tr key={item.product.id}>
                            <td>{item.product.title}</td>
                            <td>${parseFloat(item.editablePrice).toFixed(2)}</td>
                            <td>{item.editableCount}</td>
                            <td>${(item.editablePrice * item.editableCount).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-12 text-end">
                    <h4><strong>Total Amount: ${invoice.totalAmount}</strong></h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowInvoicePreview(false)}>
                Back to Form
              </button>
              <button type="button" className="btn btn-success" onClick={downloadInvoice}>
                Download Invoice
              </button>
              <button type="button" className="btn btn-primary" onClick={handleConfirmCheckout}>
                Confirm Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Checkout</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h5>Customer Information</h5>
                
                {/* User Selection */}
                {users.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                      Select Existing User
                    </label>
                    <select 
                      className="form-select"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                      <option value="">-- Select a User --</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <form>
                  <div className="mb-3">
                    <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                      Address
                    </label>
                    <textarea
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={user.address}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                      name="country"
                      value={user.country}
                      onChange={handleInputChange}
                    />
                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                  </div>
                </form>
              </div>
              
              <div className="col-md-6">
                <h5>Order Summary</h5>
                <div className="border rounded p-3">
                  {editableItems.map((item, index) => (
                    <div key={item.product.id} className="mb-3 p-2 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>{item.product.title}</div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <label className="form-label small" style={{ textAlign: 'left', display: 'block' }}>
                            Price
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.editablePrice}
                            onChange={(e) => handleItemChange(index, 'editablePrice', e.target.value)}
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div className="me-3">
                          <label className="form-label small" style={{ textAlign: 'left', display: 'block' }}>
                            Qty
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.editableCount}
                            onChange={(e) => handleItemChange(index, 'editableCount', e.target.value)}
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="form-label small" style={{ textAlign: 'left', display: 'block' }}>
                            Total
                          </label>
                          <div>${(item.editablePrice * item.editableCount).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>${editableItems.reduce((total, item) => 
                      total + (item.editablePrice * item.editableCount), 0).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleGenerateInvoice}>
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;