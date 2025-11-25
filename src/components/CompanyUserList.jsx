import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20); // Changed to 20 records per page
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://202.131.123.86:8081/procurement/WS/get_all_user_list?');
        
        // Check if response data is an array, if not try to extract it from a nested property
        let userData = response.data;
        if (!Array.isArray(userData)) {
          // Try common nested properties where the array might be located
          if (userData && typeof userData === 'object') {
            if (Array.isArray(userData.data)) {
              userData = userData.data;
            } else if (Array.isArray(userData.users)) {
              userData = userData.users;
            } else if (Array.isArray(userData.result)) {
              userData = userData.result;
            } else {
              // If we can't find an array, log the response structure for debugging
              console.log('API Response Structure:', userData);
              userData = []; // Default to empty array
            }
          } else {
            userData = []; // Default to empty array if data is not an object or array
          }
        }
        
        setUsers(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
        setUsers([]); // Ensure users is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle view details
  const handleViewDetails = (userId) => {
    navigate(`/company-users/${userId}`);
  };

  // Truncate text to fit in table cells
  const truncateText = (text, maxLength = 20) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 text-start">Company Users</h2>
        </div>
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 text-start">Company Users</h2>
        </div>
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <div className="alert alert-danger mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-repeat me-2"></i>Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-start">Company Users</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group" style={{width: '300px'}}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {currentUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-lines-fill text-muted" style={{fontSize: '3rem'}}></i>
              <p className="mt-3 mb-0 text-muted">No users found.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="py-3 text-start">#</th>
                      <th scope="col" className="py-3 text-start">Name</th>
                      <th scope="col" className="py-3 text-start">Email</th>
                      <th scope="col" className="py-3 text-start">Phone</th>
                      <th scope="col" className="py-3 text-start" style={{minWidth: '150px'}}>Address</th>
                      <th scope="col" className="py-3 text-start">Country</th>
                      <th scope="col" className="py-3 text-start">Status</th>
                      <th scope="col" className="py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={user.id || user.userId || user._id || Math.random()}>
                        <td className="align-middle text-start">{indexOfFirstUser + index + 1}</td>
                        <td className="align-middle text-start" title={user.name}>{truncateText(user.name, 20)}</td>
                        <td className="align-middle text-start" title={user.email}>{truncateText(user.email, 25)}</td>
                        <td className="align-middle text-start">{user.phone || 'N/A'}</td>
                        <td className="align-middle text-start" title={user.address}>{truncateText(user.address, 25)}</td>
                        <td className="align-middle text-start">{user.country || 'N/A'}</td>
                        <td className="align-middle text-start">
                          <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                            {user.status || 'N/A'}
                          </span>
                        </td>
                        <td className="align-middle text-end">
                          {(user.id || user.userId || user._id) ? (
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleViewDetails(user.id || user.userId || user._id)}
                            >
                              <i className="bi bi-eye me-1"></i>View
                            </button>
                          ) : (
                            <span>N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Improved Pagination */}
              {totalPages > 1 && (
                <div className="card-footer bg-white border-top-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted text-start">
                      Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
                    </div>
                    <nav aria-label="User pagination">
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>
                        
                        {/* Show first page */}
                        {currentPage > 3 && (
                          <>
                            <li className="page-item">
                              <button className="page-link" onClick={() => paginate(1)}>1</button>
                            </li>
                            {currentPage > 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                          </>
                        )}
                        
                        {/* Show pages around current page */}
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          if (
                            pageNumber === 1 || 
                            pageNumber === totalPages || 
                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                          ) {
                            return (
                              <li 
                                key={pageNumber} 
                                className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                              >
                                <button 
                                  className="page-link" 
                                  onClick={() => paginate(pageNumber)}
                                >
                                  {pageNumber}
                                </button>
                              </li>
                            );
                          }
                          return null;
                        })}
                        
                        {/* Show last page */}
                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                            <li className="page-item">
                              <button className="page-link" onClick={() => paginate(totalPages)}>{totalPages}</button>
                            </li>
                          </>
                        )}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyUserList;