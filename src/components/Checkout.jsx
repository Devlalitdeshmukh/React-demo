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
            <div><strong>Name:</strong> ${invoice.user.name}</div>
            <div><strong>Email:</strong> ${invoice.user.email}</div>
            <div><strong>Phone:</strong> ${invoice.user.phone}</div>
            <div><strong>Address:</strong> ${invoice.user.address}</div>
            <div><strong>Country:</strong> ${invoice.user.country}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th class="text-right">Unit Price</th>
                <th class="text-center">Quantity</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>${item.product.title}</td>
                  <td class="text-right">$${parseFloat(item.editablePrice).toFixed(2)}</td>
                  <td class="text-center">${item.editableCount}</td>
                  <td class="text-right">$${(item.editablePrice * item.editableCount).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div><strong>Subtotal:</strong> $${invoice.totalAmount}</div>
            <div><strong>Tax (0%):</strong> $0.00</div>
            <div class="total-row"><strong>Total: $${invoice.totalAmount}</strong></div>
          </div>
          
          <div style="margin-top: 40px; text-align: center; color: #666;">
            Thank you for your business!
          </div>
        </body>
      </html>
    `;
    
    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait a bit for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Handle editable item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editableItems];
    const numericValue = field === 'editableCount' || field === 'editablePrice' ? parseFloat(value) || 0 : value;
    
    // Ensure count is at least 1
    if (field === 'editableCount' && numericValue < 1) {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: 1
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: numericValue
      };
    }
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
                    <h2 className="display-6">INVOICE</h2>
                    <hr />
                    <div className="row">
                      <div className="col-6 text-start">
                        <p className="mb-1"><strong>Invoice ID:</strong> {invoice.id}</p>
                        <p><strong>Date:</strong> {invoice.date}</p>
                      </div>
                      <div className="col-6 text-end">
                        <h4>Vendor Portal</h4>
                        <p className="text-muted">MRS Holdings</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-4">
                  <div className="col-6">
                    <h5 className="border-bottom pb-2">Bill To:</h5>
                    <p className="mb-1 text-start"><strong>Name:</strong> {invoice.user.name}</p>
                    <p className="mb-1 text-start"><strong>Email:</strong> {invoice.user.email}</p>
                    <p className="mb-1 text-start"><strong>Phone:</strong> {invoice.user.phone}</p>
                    <p className="mb-1 text-start"><strong>Address:</strong> {invoice.user.address}</p>
                    <p className="text-start"><strong>Country:</strong> {invoice.user.country}</p>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-12">
                    <h5 className="border-bottom pb-2">Items</h5>
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">#</th>
                          <th>Item Description</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item, index) => (
                          <tr key={item.product.id}>
                            <td className="text-center">{index + 1}</td>
                            <td>{item.product.title}</td>
                            <td className="text-end">${parseFloat(item.editablePrice).toFixed(2)}</td>
                            <td className="text-center">{item.editableCount}</td>
                            <td className="text-end">${(item.editablePrice * item.editableCount).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-12 text-end">
                    <div className="row justify-content-end">
                      <div className="col-6 col-md-4">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td><strong>Subtotal:</strong></td>
                              <td className="text-end">${invoice.totalAmount}</td>
                            </tr>
                            <tr>
                              <td><strong>Tax (0%):</strong></td>
                              <td className="text-end">$0.00</td>
                            </tr>
                            <tr className="border-top">
                              <td><h5><strong>Total:</strong></h5></td>
                              <td className="text-end"><h5><strong>${invoice.totalAmount}</strong></h5></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-12 text-center">
                    <p className="text-muted">Thank you for your business!</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowInvoicePreview(false)}>
                Back to Form
              </button>
              <button type="button" className="btn btn-info" onClick={downloadInvoice}>
                Download as Text
              </button>
              <button type="button" className="btn btn-success" onClick={downloadInvoicePDF}>
                Download as PDF
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
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th className="text-end">Price</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableItems.map((item, index) => (
                        <tr key={item.product.id}>
                          <td>{item.product.title}</td>
                          <td className="text-end">
                            <input
                              type="number"
                              className="form-control form-control-sm text-end"
                              value={item.editablePrice}
                              onChange={(e) => handleItemChange(index, 'editablePrice', e.target.value)}
                              step="0.01"
                              min="0"
                              style={{ width: '80px', display: 'inline-block' }}
                            />
                          </td>
                          <td className="text-center">
                            <input
                              type="number"
                              className="form-control form-control-sm text-center"
                              value={item.editableCount}
                              onChange={(e) => handleItemChange(index, 'editableCount', e.target.value)}
                              min="1"
                              style={{ width: '70px', display: 'inline-block' }}
                            />
                          </td>
                          <td className="text-end">${(item.editablePrice * item.editableCount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="d-flex justify-content-end">
                        <h5><strong>Total: ${editableItems.reduce((total, item) => 
                          total + (item.editablePrice * item.editableCount), 0).toFixed(2)}</strong></h5>
                      </div>
                    </div>
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