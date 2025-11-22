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

  const handleAddUser = (newUser) => {
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers(prev => [...prev, { id: newId, ...newUser }]);
    setToastMessage("User added successfully.");
    setShowUserForm(false);
  };

  const handleUpdateUser = (updatedUser) => {
    // Make sure the updatedUser has all the required fields including image
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
    setEditingUser(user);
    setShowUserForm(true);
  };

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

  // Reset to first page when search terms change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  
  const handleColumnSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={() => { setShowUserForm(true); setEditingUser(null); }}>
          Add New User
        </button>
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
          </div>
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-primary" onClick={handleColumnSearch}>
              Search
            </button>
          </div>
        </div>
      )}

      {isCardView ? (
        <div className="row">
          {filteredUsers.map(user => (
            <div key={user.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name} 
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover',
                          borderRadius: '50%',
                          marginRight: '15px'
                        }} 
                      />
                    ) : (
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: '60px', height: '60px' }}>
                        <span className="fw-bold">{user.name.charAt(0)}</span>
                      </div>
                    )}
                    <div style={{ textAlign: 'left' }}>
                      <h5 className="card-title mb-0" style={{ textAlign: 'left' }}>{user.name}</h5>
                      <p className="card-text text-muted mb-0" style={{ textAlign: 'left' }}>{user.email}</p>
                    </div>
                  </div>
                  <p className="card-text" style={{ textAlign: 'left' }}>
                    <strong>Phone:</strong> {user.phone}<br />
                    <strong>Address:</strong> {user.address}<br />
                    <strong>Country:</strong> {user.country}
                  </p>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h3 className="mt-3">Users Table View</h3>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>{user.country}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
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

      <UserForm
        show={showUserForm}
        onClose={() => {
          setShowUserForm(false);
          setEditingUser(null);
        }}
        onAdd={handleAddUser}
        onUpdate={handleUpdateUser}
        editUser={editingUser}
      />
      
      <CustomConfirmModal
        show={showDeleteModal}
        message="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default UserPage;