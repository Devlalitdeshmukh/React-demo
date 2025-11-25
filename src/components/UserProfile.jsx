import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile({ currentUser, onThemeToggle, isDarkMode }) {
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-person-x text-muted" style={{ fontSize: '3rem' }}></i>
                <h3 className="mt-3">No User Data</h3>
                <p className="text-muted">Please log in to view your profile.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0 ">
                <i className="bi bi-person-circle me-2"></i>User Profile
              </h4>
              <button 
                className="btn btn-light btn-sm d-flex align-items-center"
                onClick={onThemeToggle}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'} me-1`}></i>
                <span className="d-none d-sm-inline">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-4 mb-md-0">
                  <div className="position-relative d-inline-block">
                    <img 
                      src={currentUser.image || "https://i.pravatar.cc/150?img=10"} 
                      alt="Profile" 
                      className="rounded-circle img-fluid"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button 
                      className="btn btn-primary position-absolute bottom-0 end-0 rounded-circle p-2"
                      style={{ width: '40px', height: '40px' }}
                      title="Change Photo"
                    >
                      <i className="bi bi-camera"></i>
                    </button>
                  </div>
                  <h3 className="mt-3 mb-1 text-center">{currentUser.name}</h3>
                  <p className="text-muted mb-2">{currentUser.email}</p>
                  <span className={`badge ${currentUser.role === 'admin' ? 'bg-success' : 'bg-info'}`}>
                    {currentUser.role || 'User'}
                  </span>
                </div>
                
                <div className="col-md-8">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title text-start">
                        <i className="bi bi-info-circle me-2"></i>Account Information
                      </h5>
                      <div className="row">
                        <div className="col-sm-6 mb-3 text-start">
                          <small className="text-muted">Full Name</small>
                          <div className="fw-bold">{currentUser.name || 'N/A'}</div>
                        </div>
                        <div className="col-sm-6 mb-3 text-start">
                          <small className="text-muted">Email Address</small>
                          <div className="fw-bold">{currentUser.email || 'N/A'}</div>
                        </div>
                        <div className="col-sm-6 mb-3 text-start">
                          <small className="text-muted">Role</small>
                          <div className="fw-bold text-capitalize">{currentUser.role || 'N/A'}</div>
                        </div>
                        <div className="col-sm-6 mb-3 text-start">
                          <small className="text-muted">Member Since</small>
                          <div className="fw-bold">January 1, 2023</div>
                        </div>
                        <div className="col-sm-6 mb-3 text-start">
                          <small className="text-muted">Last Login</small>
                          <div className="fw-bold">Today, 10:30 AM</div>
                        </div>
                        <div className="col-sm-6 mb-3 text-start">
                          <small className="text-muted">Status</small>
                          <div className="fw-bold">
                            <span className="badge bg-success">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex flex-wrap gap-2 mt-4">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-pencil me-2"></i>Edit Profile
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="bi bi-key me-2"></i>Change Password
                    </button>
                    <button className="btn btn-outline-info">
                      <i className="bi bi-bell me-2"></i>Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-white">
                  <h5 className="mb-0 text-start">
                    <i className="bi bi-shield-lock me-2"></i>Security
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="mb-1 text-start">Two-Factor Authentication</h6>
                      <small className="text-muted">Add extra security to your account</small>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 text-start">Login Alerts</h6>
                      <small className="text-muted">Get notified of login activities</small>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-white">
                  <h5 className="mb-0 text-start">
                    <i className="bi bi-phone me-2"></i>Recent Activity
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0">
                      <i className="bi bi-box-arrow-in-right text-success"></i>
                    </div>
                    <div className="flex-grow-1 ms-3 text-start">
                      <div className="fw-bold">Login</div>
                      <small className="text-muted">Today, 10:30 AM from 192.168.1.100</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3 text-start">
                    <div className="flex-shrink-0">
                      <i className="bi bi-pencil text-primary"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="fw-bold">Profile Update</div>
                      <small className="text-muted">Yesterday, 3:45 PM</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <i className="bi bi-key text-warning"></i>
                    </div>
                    <div className="flex-grow-1 ms-3 text-start">
                      <div className="fw-bold">Password Change</div>
                      <small className="text-muted">Jan 15, 2023, 11:20 AM</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;