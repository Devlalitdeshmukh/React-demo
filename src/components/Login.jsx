import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Call the login function from App
      const result = onLogin(credentials.email, credentials.password);
      
      if (result.success) {
        navigate('/users');
      } else {
        setLoginError(result.error);
      }
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center py-5">
      <div className="row w-100 justify-content-center">
        <div className="col-lg-4 col-md-6">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="bi bi-building text-primary" style={{fontSize: '3rem'}}></i>
                </div>
                <h2 className="fw-bold text-center">Vendor Portal</h2>
                <p className="text-muted text-center">Sign in to your account</p>
              </div>
              
              {loginError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {loginError}
                  <button type="button" className="btn-close" onClick={() => setLoginError('')}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label htmlFor="email" className="form-label text-start">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="mb-3 text-start">
                  <label htmlFor="password" className="form-label text-start">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" />
                    <label className="form-check-label text-start" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <button type="button" className="btn btn-link p-0 text-decoration-none">Forgot password?</button>
                </div>
                
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </button>
                </div>
              </form>
              
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account? <Link to="/signup" className="text-decoration-none">Create Account</Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 text-muted">
            <small>© {new Date().getFullYear()} Vendor Portal. All rights reserved.</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;