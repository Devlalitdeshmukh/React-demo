import React, { useState, useEffect } from 'react';

function UserForm({ user: initialUser, onSave, onCancel }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    image: '',
    status: 'Active'
  });
  
  const [errors, setErrors] = useState({});

  // Reset form when initialUser changes
  useEffect(() => {
    if (initialUser) {
      setUser({
        name: initialUser.name || '',
        email: initialUser.email || '',
        phone: initialUser.phone || '',
        address: initialUser.address || '',
        country: initialUser.country || '',
        image: initialUser.image || '',
        status: initialUser.status || 'Active'
      });
    } else {
      setUser({
        name: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        image: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [initialUser]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(user);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="text-center mb-3">
            <div className="mb-2">Profile Image</div>
            <div className="border rounded d-flex align-items-center justify-content-center mx-auto" 
                 style={{ width: '120px', height: '120px', overflow: 'hidden' }}>
              {user.image ? (
                <img 
                  src={user.image} 
                  alt="Preview" 
                  className="img-fluid"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              ) : (
                <i className="bi bi-person-circle text-muted" style={{ fontSize: '3rem' }}></i>
              )}
            </div>
            <input
              type="text"
              className="form-control mt-2"
              name="image"
              value={user.image}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="mb-3 text-start">
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
          
          <div className="mb-3 text-start">
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
          
          <div className="mb-3 text-start">
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
        </div>
      </div>
      
      <div className="mb-3 text-start">
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
      
      <div className="row">
        <div className="col-md-6 mb-3 text-start">
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
        
        <div className="col-md-6 mb-3 text-start">
          <label className="form-label text-start">Status</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-info-circle"></i>
            </span>
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
        </div>
      </div>
      
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <i className="bi bi-x-circle me-2"></i>Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check-circle me-2"></i>
          {initialUser ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );
}

export default UserForm;