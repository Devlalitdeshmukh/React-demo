import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container my-4">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">Welcome to Vendor Portal</h1>
        <p className="lead">Manage your products and users efficiently with our comprehensive portal.</p>
        <hr className="my-4" />
        <div className="d-flex justify-content-center gap-3">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => navigate('/products')}
          >
            View Products
          </button>
          <button 
            className="btn btn-info btn-lg" 
            onClick={() => navigate('/users')}
          >
            View Users
          </button>
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Product Management</h5>
              <p className="card-text">Add, edit, and manage your product catalog with ease.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">User Management</h5>
              <p className="card-text">Manage customer information and profiles efficiently.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Order Processing</h5>
              <p className="card-text">Process orders and generate invoices seamlessly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;