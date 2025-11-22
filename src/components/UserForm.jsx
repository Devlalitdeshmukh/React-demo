import React, { useState, useEffect } from 'react';

function UserForm({ show, onClose, onAdd, onUpdate, editUser }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    image: '',
    status: 'Active' // Add status field
  });

  const [errors, setErrors] = useState({});

  // Reset form when editUser changes or when modal opens
  useEffect(() => {
    if (editUser) {
      setUser({
        name: editUser.name || '',
        email: editUser.email || '',
        phone: editUser.phone || '',
        address: editUser.address || '',
        country: editUser.country || '',
        image: editUser.image || '',
        status: editUser.status || 'Active' // Include status
      });
    } else {
      setUser({
        name: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        image: '',
        status: 'Active' // Default status for new users
      });
    }
    setErrors({});
  }, [editUser, show]);

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

  const handleSubmit = () => {
    if (validateForm()) {
      if (editUser) {
        onUpdate(user);
      } else {
        onAdd(user);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editUser ? 'Edit User' : 'Add New User'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                  Profile Image URL (optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={user.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
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
                  placeholder="Enter email"
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
                  placeholder="Enter phone"
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
                  placeholder="Enter address"
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
                  placeholder="Enter country"
                />
                {errors.country && <div className="invalid-feedback">{errors.country}</div>}
              </div>
              
              <div className="mb-3">
                <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                  Status
                </label>
                <select
                  className="form-select"
                  name="status"
                  value={user.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSubmit}
            >
              {editUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;