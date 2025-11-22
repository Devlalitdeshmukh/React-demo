import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ onLogout, currentUser }) {
  const location = useLocation();
  
  // Don't show navigation on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") return null;
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Vendor Portal</Link>
        <div className="navbar-nav">
          <Link className={`nav-link ${location.pathname === "/products" ? "active" : ""}`} to="/products">
            Products
          </Link>
          <Link className={`nav-link ${location.pathname === "/users" ? "active" : ""}`} to="/users">
            Users
          </Link>
          <Link className={`nav-link ${location.pathname === "/admin-users" ? "active" : ""}`} to="/admin-users">
            Admin Users
          </Link>
        </div>
        {currentUser && (
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 text-white">
              Welcome, {currentUser.name}
            </span>
            <button className="btn btn-outline-light" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;