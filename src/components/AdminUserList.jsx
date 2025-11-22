import React, { useState, useEffect } from 'react';

function AdminUserList() {
  // Sample admin users data
  const [adminUsers, setAdminUsers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'Super Admin',
      lastLogin: '2023-05-15 14:30:00',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Admin',
      lastLogin: '2023-05-14 09:15:00',
      status: 'Active'
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      lastLogin: '2023-05-10 16:45:00',
      status: 'Inactive'
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'Admin'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState(null); // Track which user to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal

  // Filter users based on search term
  const filteredUsers = adminUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newAdmin.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newAdmin.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const adminToAdd = {
        id: adminUsers.length > 0 ? Math.max(...adminUsers.map(u => u.id)) + 1 : 1,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        lastLogin: 'Never',
        status: 'Active'
      };
      
      setAdminUsers(prev => [...prev, adminToAdd]);
      setNewAdmin({ name: '', email: '', role: 'Admin' });
      setShowAddForm(false);
      setErrors({});
    }
  };

  const handleDeleteAdmin = (id) => {
    if (id === 1) {
      alert('Cannot delete the super admin user');
      return;
    }
    
    // Instead of using window.confirm, set state to show custom modal
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setAdminUsers(prev => prev.filter(user => user.id !== userToDelete));
      setUserToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const toggleUserStatus = (id) => {
    setAdminUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } 
          : user
      )
    );
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

  const handleExportAdminUsers = () => {
    exportToCSV(adminUsers, 'admin-users.csv');
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Users</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleExportAdminUsers}>
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            Add New Admin
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search admin users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Add New Admin User</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddAdmin}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="name" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                
                <div className="col-md-4 mb-3">
                  <label htmlFor="email" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="col-md-4 mb-3">
                  <label htmlFor="role" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                    Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={newAdmin.role}
                    onChange={handleInputChange}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  Add Admin
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowAddForm(false);
                  setNewAdmin({ name: '', email: '', role: 'Admin' });
                  setErrors({});
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className={`btn btn-sm ${user.status === 'Active' ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteAdmin(user.id)}
                          disabled={user.id === 1}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this admin user?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUserList;