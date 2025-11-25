import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup({ onSignup }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
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
    
    // Clear signup error when user starts typing
    if (signupError) {
      setSignupError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!user.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!user.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (user.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!user.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // For demo purposes, we'll simulate a successful signup
      // In a real app, this would be an API call
      const newUser = {
        id: Date.now(),
        name: user.name,
        email: user.email,
        role: 'admin'
      };
      
      const result = onSignup(newUser, user.password); // Pass both user data and password
      
      if (result.success) {
        setSignupSuccess(true);
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSignupError(result.error);
      }
    }
  };

  if (signupSuccess) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center py-5">
        <div className="row w-100 justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5 text-center">
                <div className="mb-4 text-success">
                  <i className="bi bi-check-circle-fill" style={{fontSize: '4rem'}}></i>
                </div>
                <h3 className="fw-bold mb-3">Account Created Successfully!</h3>
                <p className="text-muted">
                  Redirecting to login page...
                </p>
                <div className="progress mt-4" style={{height: '5px'}}>
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h2 className="fw-bold text-center">Create Account</h2>
                <p className="text-muted">Fill in the information below</p>
              </div>
              
              {signupError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {signupError}
                  <button type="button" className="btn-close" onClick={() => setSignupError('')}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label htmlFor="name" className="form-label text-start">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                
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
                      value={user.email}
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
                      value={user.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                
                <div className="mb-3 text-start">
                  <label htmlFor="confirmPassword" className="form-label text-start">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
                
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="bi bi-person-plus me-2"></i>Create Account
                  </button>
                </div>
              </form>
              
              <div className="text-center">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-decoration-none">Sign In</Link>
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

export default Signup;