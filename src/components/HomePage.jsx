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
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i className="bi bi-building text-primary" style={{fontSize: '4rem'}}></i>
              </div>
              <h1 className="display-5 fw-bold mb-3 text-start">Welcome to Vendor Portal</h1>
              <p className="lead mb-4 text-muted">
                Manage your products and users efficiently with our vendor portal.
              </p>
              <div className="row justify-content-center mb-4">
                <div className="col-lg-8">
                  <div className="p-4 bg-light rounded">
                    <p className="mb-0">
                      <i className="bi bi-shield-lock text-success me-2"></i>
                      Secure and reliable platform for all your vendor needs
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                <Link to="/login" className="btn btn-primary btn-lg px-4 gap-3">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Login
                </Link>
                <Link to="/signup" className="btn btn-outline-secondary btn-lg px-4">
                  <i className="bi bi-person-plus me-2"></i>Sign Up
                </Link>
              </div>
            </div>
          </div>
          
          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-people text-primary mb-3" style={{fontSize: '2.5rem'}}></i>
                  <h5>User Management</h5>
                  <p className="text-muted small">
                    Easily manage all your vendor and customer accounts in one place.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-box-seam text-success mb-3" style={{fontSize: '2.5rem'}}></i>
                  <h5>Product Catalog</h5>
                  <p className="text-muted small">
                    Maintain and organize your product inventory with ease.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-graph-up text-info mb-3" style={{fontSize: '2.5rem'}}></i>
                  <h5>Analytics</h5>
                  <p className="text-muted small">
                    Gain insights with detailed reports and analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;