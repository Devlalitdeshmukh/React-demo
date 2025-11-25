import React, { useState } from 'react';
import UserForm from './UserForm';
import CustomConfirmModal from './CustomConfirmModal';

function UserPage({ users, setUsers, toastMessage, setToastMessage }) {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isCardView, setIsCardView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Individual column search terms
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter users based on search terms
  const filteredUsers = users.filter(user => {
    const matchesGlobalSearch = Object.values(user).some(value =>
      String(value).toLowerCase().includes(String(searchTerm).toLowerCase())
    );
    
    const matchesName = user.name.toLowerCase().includes(nameSearch.toLowerCase());
    const matchesEmail = user.email.toLowerCase().includes(emailSearch.toLowerCase());
    const matchesPhone = user.phone.toLowerCase().includes(phoneSearch.toLowerCase());
    const matchesAddress = user.address.toLowerCase().includes(addressSearch.toLowerCase());
    const matchesCountry = user.country.toLowerCase().includes(countrySearch.toLowerCase());
    
    if (searchTerm) {
      return matchesGlobalSearch;
    } else {
      return matchesName && matchesEmail && matchesPhone && matchesAddress && matchesCountry;
    }
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddUser = (newUser) => {
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const userWithStatus = { ...newUser, id: newId, status: 'Active' }; // Add status
    setUsers(prev => [...prev, userWithStatus]);
    setToastMessage("User added successfully.");
    setShowUserForm(false);
  };

  const handleUpdateUser = (updatedUser) => {
    console.log("Updating user with data:", updatedUser);
    setUsers(prev =>
      prev.map(user => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user))
    );
    setToastMessage("User updated successfully.");
    setEditingUser(null);
    setShowUserForm(false);
  };

  const handleDeleteUser = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(user => user.id !== userToDelete));
      setToastMessage("User deleted successfully.");
      // Close modal and reset user to delete
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleEditUser = (user) => {
    console.log("Editing user:", user);
    setEditingUser(user);
    setShowUserForm(true);
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } 
          : user
      )
    );
    setToastMessage("User status updated successfully.");
  };

  // Reset to first page when search terms change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  
  const handleColumnSearch = () => {
    setCurrentPage(1);
  };

  const exportToCSV = (data, filename) => {
    // Add status to data if not present
    const dataWithStatus = data.map(user => ({
      ...user,
      status: user.status || 'Active'
    }));
    
    const csvContent = [
      Object.keys(dataWithStatus[0]).join(','),
      ...dataWithStatus.map(item => Object.values(item).join(','))
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

  const handleExportUsers = () => {
    exportToCSV(users, 'users.csv');
  };

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-start">User Management</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={handleExportUsers}>
            <i className="bi bi-download me-2"></i>Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setShowUserForm(true); setEditingUser(null); }}>
            <i className="bi bi-person-plus me-2"></i>Add New User
          </button>
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
                <div className="col-md-2">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search Name..."
                    value={nameSearch}
                    onChange={e => setNameSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search Email..."
                    value={emailSearch}
                    onChange={e => setEmailSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search Phone..."
                    value={phoneSearch}
                    onChange={e => setPhoneSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search Address..."
                    value={addressSearch}
                    onChange={e => setAddressSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search Country..."
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                  />
                </div>
                <div className="col-md-1">
                  <button className="btn btn-primary w-100" onClick={handleColumnSearch}>
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isCardView ? (
            <div className="row">
              {currentItems.map(user => (
                <div className="col-lg-4 col-md-6 mb-4" key={user.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <img 
                          src={user.image || "https://i.pravatar.cc/150?img=3"} 
                          className="rounded-circle me-3" 
                          alt={user.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div>
                          <h5 className="card-title mb-1 text-start">{user.name}</h5>
                          <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                      <div className="mb-2 text-start">
                        <small className="text-muted text-start">
                          <i className="bi bi-envelope me-2"></i>
                          {user.email}
                        </small>
                      </div>
                      <div className="mb-2 text-start">
                        <small className="text-muted text-start">
                          <i className="bi bi-telephone me-2"></i>
                          {user.phone}
                        </small>
                      </div>
                      <div className="mb-2 text-start">
                        <small className="text-muted text-start">
                          <i className="bi bi-geo-alt me-2"></i>
                          {user.address}, {user.country}
                        </small>
                      </div>
                    </div>
                    <div className="card-footer bg-white">
                      <div className="d-flex justify-content-between">
                        <button 
                          className={`btn btn-sm ${user.status === 'Active' ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          <i className={`bi ${user.status === 'Active' ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    <th scope="col" className="text-start">Name</th>
                    <th scope="col" className="text-start">Email</th>
                    <th scope="col" className="text-start">Phone</th>
                    <th scope="col" className="text-start">Address</th>
                    <th scope="col" className="text-start">Country</th>
                    <th scope="col" className="text-start">Status</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user, index) => (
                    <tr key={user.id}>
                      <td className="text-start">{indexOfFirstItem + index + 1}</td>
                      <td className="text-start">
                        <div className="d-flex align-items-center">
                          <img 
                            src={user.image || "https://i.pravatar.cc/150?img=3"} 
                            className="rounded-circle me-2" 
                            alt={user.name}
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                          />
                          {user.name}
                        </div>
                      </td>
                      <td className="text-start">{user.email}</td>
                      <td className="text-start">{user.phone}</td>
                      <td className="text-start">{user.address}</td>
                      <td className="text-start">{user.country}</td>
                      <td className="text-start">
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
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(user.id)}
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
            <nav aria-label="User pagination">
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

      {/* User Form Modal */}
      {showUserForm && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-start">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowUserForm(false);
                    setEditingUser(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <UserForm 
                  user={editingUser} 
                  onSave={editingUser ? handleUpdateUser : handleAddUser}
                  onCancel={() => {
                    setShowUserForm(false);
                    setEditingUser(null);
                  }}
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
        message="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default UserPage;