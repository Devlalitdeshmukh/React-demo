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
    console.log("Checkout component received cart:", cart);
    if (cart && cart.length > 0) {
      const initialEditableItems = cart.map(item => ({
        ...item,
        editableCount: item.count,
        editablePrice: parseFloat(item.product.price.replace('$', ''))
      }));
      console.log("Initialized editable items:", initialEditableItems);
      setEditableItems(initialEditableItems);
    } else {
      // Clear editable items when cart is empty
      setEditableItems([]);
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
    console.log("Generating invoice with editable items:", editableItems);
    if (validateForm()) {
      // Generate invoice
      const invoiceItems = editableItems.map(item => ({
        ...item,
        totalPrice: (item.editablePrice * item.editableCount).toFixed(2)
      }));
      
      const totalAmount = invoiceItems.reduce((total, item) => 
        total + (item.editablePrice * item.editableCount), 0).toFixed(2);
      
      const newInvoice = {
        id: `INV-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        user: { ...user },
        items: invoiceItems,
        totalAmount: totalAmount
      };
      
      console.log("Generated invoice:", newInvoice);
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

  const downloadInvoicePDF = () => {
    if (!invoice) return;
    
    // Create HTML content for PDF
    const htmlContent = `
      <html>
        <head>
          <title>Invoice ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-title { font-size: 24px; font-weight: bold; }
            .invoice-info { margin: 20px 0; }
            .bill-to { text-align: left; margin: 20px 0; }
            .bill-to h3 { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-section { margin-top: 30px; text-align: right; }
            .total-row { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="invoice-title">INVOICE</div>
            <div>Invoice ID: ${invoice.id}</div>
            <div>Date: ${invoice.date}</div>
          </div>
          
          <div class="bill-to">
            <h3>Bill To:</h3>
            <div>${invoice.user.name}</div>
            <div>${invoice.user.email}</div>
            <div>${invoice.user.phone}</div>
            <div>${invoice.user.address}</div>
            <div>${invoice.user.country}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.product.title}</td>
                  <td class="text-center">${item.editableCount}</td>
                  <td class="text-right">$${item.editablePrice.toFixed(2)}</td>
                  <td class="text-right">$${item.totalPrice}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">Total Amount: $${invoice.totalAmount}</div>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Update editable item count
  const updateEditableItemCount = (index, newCount) => {
    if (newCount < 0) return;
    
    const updatedItems = [...editableItems];
    updatedItems[index] = {
      ...updatedItems[index],
      editableCount: newCount
    };
    setEditableItems(updatedItems);
  };

  // Update editable item price
  const updateEditableItemPrice = (index, newPrice) => {
    if (newPrice < 0) return;
    
    const updatedItems = [...editableItems];
    updatedItems[index] = {
      ...updatedItems[index],
      editablePrice: newPrice
    };
    setEditableItems(updatedItems);
  };

  if (showInvoicePreview && invoice) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-start">
                  <i className="bi bi-receipt me-2"></i>Invoice Preview
                </h4>
                <div className="d-flex gap-2">
                  <button className="btn btn-light" onClick={() => setShowInvoicePreview(false)}>
                    <i className="bi bi-arrow-left me-2"></i>Back to Edit
                  </button>
                  <button className="btn btn-success" onClick={handleConfirmCheckout}>
                    <i className="bi bi-check-circle me-2"></i>Confirm & Checkout
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="mb-0 text-start">Invoice Details</h5>
                    <p className="mb-1 text-start"><strong>Invoice ID:</strong> {invoice.id}</p>
                    <p className="mb-1 text-start"><strong>Date:</strong> {invoice.date}</p>
                  </div>
                  <div className="col-md-6 text-md-start">
                    <h5 className="mb-0 text-start">Customer Information</h5>
                    <p className="mb-1 text-start"><strong>Name:</strong> {invoice.user.name}</p>
                    <p className="mb-1 text-start"><strong>Email:</strong> {invoice.user.email}</p>
                    <p className="mb-1 text-start"><strong>Phone:</strong> {invoice.user.phone}</p>
                    <p className="mb-1 text-start"><strong>Address:</strong> {invoice.user.address}</p>
                    <p className="mb-0 text-start"><strong>Country:</strong> {invoice.user.country}</p>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead className="table-light">
                      <tr>
                        <th className="text-start">Item</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="text-start">{item.product.title}</td>
                          <td className="text-center">{item.editableCount}</td>
                          <td className="text-end">${item.editablePrice.toFixed(2)}</td>
                          <td className="text-end">${item.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Total Amount:</strong></td>
                        <td className="text-end"><strong>${invoice.totalAmount}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button className="btn btn-secondary" onClick={downloadInvoice}>
                    <i className="bi bi-download me-2"></i>Download TXT
                  </button>
                  <button className="btn btn-primary" onClick={downloadInvoicePDF}>
                    <i className="bi bi-file-earmark-pdf me-2"></i>Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h4 className="mb-0 text-start">
                <i className="bi bi-person me-2"></i>Customer Information
              </h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label text-start">Select Existing User</label>
                <select
                  className="form-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">Select a user (optional)</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-start">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                      />
                    </div>
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-start">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-start">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-telephone"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-start">Country</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-flag"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                        name="country"
                        value={user.country}
                        onChange={handleInputChange}
                        placeholder="Enter country"
                      />
                    </div>
                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-start">Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <textarea
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={user.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      rows="2"
                    ></textarea>
                  </div>
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
              </form>
            </div>
          </div>
          
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h4 className="mb-0 text-start">
                <i className="bi bi-cart me-2"></i>Order Summary
              </h4>
            </div>
            <div className="card-body">
              {editableItems.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-cart-x text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-2 mb-0 text-muted">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="table-light">
                        <tr>
                          <th className="text-start">Item</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editableItems.map((item, index) => (
                          <tr key={item.product.id}>
                            <td className="text-start">
                              <div className="d-flex align-items-center">
                                <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" 
                                     style={{ width: '40px', height: '40px' }}>
                                  <i className="bi bi-image text-muted"></i>
                                </div>
                                <div>
                                  <div className="fw-bold">{item.product.title}</div>
                                  <div className="small text-muted">{item.product.desc}</div>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="input-group input-group-sm" style={{ width: '120px', margin: '0 auto' }}>
                                <button 
                                  className="btn btn-outline-secondary" 
                                  type="button"
                                  onClick={() => updateEditableItemCount(index, item.editableCount - 1)}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input 
                                  type="text" 
                                  className="form-control text-center" 
                                  value={item.editableCount} 
                                  readOnly 
                                />
                                <button 
                                  className="btn btn-outline-secondary" 
                                  type="button"
                                  onClick={() => updateEditableItemCount(index, item.editableCount + 1)}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="text-end">
                              <div className="input-group input-group-sm" style={{ width: '120px', marginLeft: 'auto' }}>
                                <span className="input-group-text">$</span>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.editablePrice}
                                  onChange={(e) => updateEditableItemPrice(index, parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            </td>
                            <td className="text-end">
                              ${(item.editablePrice * item.editableCount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                          <td className="text-end">
                            <strong>
                              ${editableItems.reduce((total, item) => 
                                total + (item.editablePrice * item.editableCount), 0).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      className="btn btn-success btn-lg"
                      onClick={handleGenerateInvoice}
                      disabled={editableItems.length === 0}
                    >
                      <i className="bi bi-receipt me-2"></i>Generate Invoice
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0 text-start">
                <i className="bi bi-info-circle me-2"></i>Order Details
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-start">Items ({editableItems.reduce((total, item) => total + item.editableCount, 0)}):</span>
                <span>
                  ${editableItems.reduce((total, item) => 
                    total + (item.editablePrice * item.editableCount), 0).toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-start">Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-start">Tax:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span className="text-start">Total:</span>
                <span className="text-success">
                  ${editableItems.reduce((total, item) => 
                    total + (item.editablePrice * item.editableCount), 0).toFixed(2)}
                </span>
              </div>
              
              <div className="mt-4">
                <h6 className="text-start">Instructions</h6>
                <ul className="small text-muted text-start">
                  <li>Fill in customer information</li>
                  <li>Adjust quantities and prices as needed</li>
                  <li>Click "Generate Invoice" to preview</li>
                  <li>Confirm and checkout when ready</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;