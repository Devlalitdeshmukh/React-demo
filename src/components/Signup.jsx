import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-success text-center" role="alert">
              <h4>Account created successfully!</h4>
              <p>Redirecting to login page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Sign Up</h3>
            </div>
            <div className="card-body">
              {signupError && (
                <div className="alert alert-danger" role="alert">
                  {signupError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label" style={{ textAlign: 'left', display: 'block' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
                
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-3">
                <p>
                  Already have an account? <a href="/login">Login here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;