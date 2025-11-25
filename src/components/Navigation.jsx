import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navigation({ onLogout, currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Don't show navigation on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") return null;
  
  const handleThemeToggle = () => {
    // This would typically be handled via context or props
    // For now, we'll navigate to profile where the theme toggle is available
    navigate('/profile');
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-building me-2"></i>
          <span>Vendor Portal</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto">
            <Link className={`nav-link ${location.pathname === "/users" ? "active" : ""}`} to="/users">
              <i className="bi bi-people me-1"></i>Users
            </Link>
            <Link className={`nav-link ${location.pathname === "/products" ? "active" : ""}`} to="/products">
              <i className="bi bi-box-seam me-1"></i>Products
            </Link>
            <Link className={`nav-link ${location.pathname === "/admin-users" ? "active" : ""}`} to="/admin-users">
              <i className="bi bi-shield-lock me-1"></i>Admin Users
            </Link>
            <Link className={`nav-link ${location.pathname === "/company-users" ? "active" : ""}`} to="/company-users">
              <i className="bi bi-building me-1"></i>Company Users
            </Link>
            <Link className={`nav-link ${location.pathname === "/text-form" ? "active" : ""}`} to="/text-form">
              <i className="bi bi-file-text me-1"></i>Text Form
            </Link>
          </div>
          
          {currentUser && (
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-light me-2 d-flex align-items-center"
                onClick={handleThemeToggle}
                title="Toggle Theme"
              >
                <i className="bi bi-circle-half me-1"></i>
                <span className="d-none d-sm-inline">Theme</span>
              </button>
              
              <div className="dropdown me-2">
                <button 
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center" 
                  type="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown"
                >
                  <img 
                    alt="User" 
                    src="https://i.pravatar.cc/150?img=10" 
                    className="rounded-circle me-2" 
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                  <span>{currentUser.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person-circle me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="bi bi-gear me-2"></i>Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={onLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
              {/* Prominent logout button always visible */}
              <button 
                className="btn btn-light d-flex align-items-center"
                onClick={onLogout}
                title="Logout"
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;