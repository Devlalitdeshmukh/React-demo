import React, { useState } from 'react';

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
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-start">Admin Users</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleExportAdminUsers}>
            <i className="bi bi-download me-2"></i>Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <i className="bi bi-person-plus me-2"></i>Add New Admin
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group" style={{ width: '300px' }}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search admin users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showAddForm && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0 text-start">Add New Admin User</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddAdmin}>
              <div className="row">
                <div className="col-md-4 mb-3 text-start">
                  <label htmlFor="name" className="form-label text-start">Full Name</label>
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
                
                <div className="col-md-4 mb-3 text-start">
                  <label htmlFor="email" className="form-label text-start">Email Address</label>
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
                
                <div className="col-md-4 mb-3 text-start">
                  <label htmlFor="role" className="form-label text-start">Role</label>
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
                  <i className="bi bi-person-plus me-2"></i>Add Admin
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowAddForm(false);
                  setNewAdmin({ name: '', email: '', role: 'Admin' });
                  setErrors({});
                }}>
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge bg-primary">{user.role}</span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group" role="group">
                        <button
                          className={`btn btn-sm ${user.status === 'Active' ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          <i className={`bi ${user.status === 'Active' ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAdmin(user.id)}
                          disabled={user.id === 1}
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
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-start">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this admin user?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  <i className="bi bi-trash me-2"></i>Delete
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