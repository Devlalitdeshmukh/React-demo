import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  
  // For demo purposes, we'll automatically redirect to login
  // In a real app, you might want to show a landing page
  React.useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-4">Welcome to Vendor Portal</h1>
          <p className="lead mb-4">
            Manage your products and users efficiently with our vendor portal.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/login" className="btn btn-primary btn-lg px-4 gap-3">
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline-secondary btn-lg px-4">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;