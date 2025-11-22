import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  // Don't show navigation on home page
  if (location.pathname === "/") return null;
  
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
        </div>
      </div>
    </nav>
  );
}

export default Navigation;