import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CompanyUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Since we don't have a specific endpoint for user details,
        // we'll fetch all users and filter for the specific user
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
        
        // Ensure userData is an array before trying to find the user
        if (Array.isArray(userData)) {
          const foundUser = userData.find(user => 
            user.id === userId || user.userId === userId || user._id === userId
          );
          
          if (foundUser) {
            setUser(foundUser);
          } else {
            setError('User not found');
          }
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleBackToList = () => {
    navigate('/company-users');
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 text-start">User Details</h2>
        </div>
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 text-start">User Details</h2>
        </div>
        <div className="card shadow-sm">
          <div className="card-body py-5">
            <div className="alert alert-danger mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-primary" onClick={handleBackToList}>
                <i className="bi bi-arrow-left me-2"></i>Back to Users
              </button>
              <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
                <i className="bi bi-arrow-repeat me-2"></i>Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-start">User Details</h2>
      </div>

      {user && (
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0 text-start">User Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small mb-1 text-start">User ID</label>
                    <div className="fw-bold text-start">{user.id || user.userId || user._id || 'N/A'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small mb-1 text-start">Name</label>
                    <div className="fw-bold text-start">{user.name || 'N/A'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small mb-1 text-start">Email</label>
                    <div className="fw-bold text-start">{user.email || 'N/A'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small mb-1 text-start">Phone</label>
                    <div className="fw-bold text-start">{user.phone || 'N/A'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small mb-1 text-start">Address</label>
                    <div className="fw-bold text-start">{user.address || 'N/A'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small mb-1 text-start">Country</label>
                    <div className="fw-bold text-start">{user.country || 'N/A'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small mb-1 text-start">Status</label>
                    <div className="text-start">
                      <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {user.status || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0 text-start">User Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-pencil me-2"></i>Edit User
                  </button>
                  <button className="btn btn-outline-success">
                    <i className="bi bi-envelope me-2"></i>Send Message
                  </button>
                  <button className="btn btn-outline-warning">
                    <i className="bi bi-key me-2"></i>Reset Password
                  </button>
                  <button className="btn btn-outline-danger">
                    <i className="bi bi-trash me-2"></i>Deactivate User
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card shadow-sm mt-4">
              <div className="card-header bg-white">
                <h5 className="mb-0 text-start">Activity</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="flex-shrink-0">
                    <i className="bi bi-calendar-check text-primary"></i>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="small text-muted text-start">Last Login</div>
                    <div className="fw-bold text-start">2023-05-15 14:30:00</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <i className="bi bi-person-plus text-success"></i>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="small text-muted text-start">Member Since</div>
                    <div className="fw-bold text-start">2022-01-10</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyUserDetail;