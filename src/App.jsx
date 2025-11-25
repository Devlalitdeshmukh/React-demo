import './App.css';
import './components/Theme.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import UserPage from './components/UserPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminUserList from './components/AdminUserList';
import TextForm from './components/TextForm';
import CompanyUserList from './components/CompanyUserList';
import CompanyUserDetail from './components/CompanyUserDetail';
import UserProfile from './components/UserProfile';
import React from 'react';

// Import Bootstrap Icons CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "LapTop",
      price: "$1200.00",
      desc: "Core i7, 16GB",
      image: "",
      quantity: 5 // Add quantity field
    },
    {
      id: 2,
      title: "USB Hub",
      price: "$1800.00",
      desc: "8 in 1 USB-C Hub",
      image: "",
      quantity: 0 // Out of stock
    },
    {
      id: 3,
      title: "Head Phone",
      price: "$99.00",
      desc: "JBL Wireless",
      image: "",
      quantity: 10
    },
    {
      id: 4,
      title: "Smart Watch",
      price: "$299.00",
      desc: "Fitness Tracker with Heart Rate Monitor",
      image: "",
      quantity: 3
    },
    {
      id: 5,
      title: "Bluetooth Speaker",
      price: "$79.99",
      desc: "Portable Wireless Speaker",
      image: "",
      quantity: 5
    }
  ]);

  // Cart state
  const [cart, setCart] = useState([]);

  // Users state
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Lalit Desh",
      email: "lalit@example.com",
      phone: "254-476-5214",
      address: "142 Main St",
      country: "IND",
      image: "https://i.pravatar.cc/150?img=2",
      status: "Active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      address: "456 Oak Ave",
      country: "Canada",
      image: "https://i.pravatar.cc/150?img=4",
      status: "Active"
    }
    ,
    {
      id: 3,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      country: "USA",
      image: "https://i.pravatar.cc/150?img=7",
      status: "Inactive"
    }
  ]);

  const [toastMessage, setToastMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userCredentials, setUserCredentials] = useState([
    { email: 'admin@example.com', password: 'admin123' } // Default admin credentials
  ]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if user is logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedCredentials = localStorage.getItem('userCredentials');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
    
    if (savedCredentials) {
      try {
        const parsedCredentials = JSON.parse(savedCredentials);
        // Merge with default credentials, avoiding duplicates
        const defaultCred = { email: 'admin@example.com', password: 'admin123' };
        const mergedCredentials = parsedCredentials.some(cred => cred.email === defaultCred.email) 
          ? parsedCredentials 
          : [defaultCred, ...parsedCredentials];
        
        setUserCredentials(mergedCredentials);
      } catch (e) {
        console.error('Error parsing credentials data', e);
        // Fallback to default credentials
        setUserCredentials([{ email: 'admin@example.com', password: 'admin123' }]);
      }
    }
    
    // Set theme
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Auto-hide toast messages after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleLogin = (email, password) => {
    // Check hardcoded admin credentials first
    if (email === 'admin@example.com' && password === 'admin123') {
      const adminUser = {
        id: 1,
        name: 'Admin User',
        email: email,
        role: 'admin'
      };
      setCurrentUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return { success: true };
    }
    
    // Check stored credentials
    if (validateCredentials(email, password)) {
      const user = {
        id: Date.now(),
        name: 'User', // In a real app, this would come from user data
        email: email,
        role: 'admin'
      };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const handleSignup = (userData, password) => {
    // Check if email already exists
    if (userCredentials.some(cred => cred.email === userData.email)) {
      console.log('User already exists:', userData.email);
      return { success: false, error: 'User with this email already exists' };
    }
    
    // Store user credentials
    const newCredentials = {
      email: userData.email,
      password: password
    };
    
    const updatedCredentials = [...userCredentials, newCredentials];
    setUserCredentials(updatedCredentials);
    localStorage.setItem('userCredentials', JSON.stringify(updatedCredentials));
    
    console.log('New user signed up:', userData);
    return { success: true };
  };

  const validateCredentials = (email, password) => {
    // Check if credentials exist
    return userCredentials.some(cred => 
      cred.email === email && cred.password === password
    );
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        {currentUser && <Navigation onLogout={handleLogout} currentUser={currentUser} />}
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to="/users" replace /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/signup" element={
            currentUser ? <Navigate to="/users" replace /> : <Signup onSignup={handleSignup} />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UserPage 
                users={users} 
                setUsers={setUsers} 
                toastMessage={toastMessage} 
                setToastMessage={setToastMessage} 
              />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductPage 
                cards={cards} 
                setCards={setCards} 
                cart={cart}
                setCart={setCart}
                toastMessage={toastMessage} 
                setToastMessage={setToastMessage} 
                users={users}
              />
            </ProtectedRoute>
          } />
          <Route path="/admin-users" element={
            <ProtectedRoute>
              <AdminUserList />
            </ProtectedRoute>
          } />
          <Route path="/text-form" element={
            <ProtectedRoute>
              <TextForm />
            </ProtectedRoute>
          } />
          <Route path="/company-users" element={
            <ProtectedRoute>
              <CompanyUserList />
            </ProtectedRoute>
          } />
          <Route path="/company-users/:id" element={
            <ProtectedRoute>
              <CompanyUserDetail />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile currentUser={currentUser} onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
            </ProtectedRoute>
          } />
        </Routes>
        
        {toastMessage && (
          <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1050 }}
          >
            <div className="toast show align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="d-flex">
                <div className="toast-body">
                  {toastMessage}
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                  onClick={() => setToastMessage("")}
                ></button>
              </div>
            </div>
          </div>
        )}
        {currentUser && <Footer companyName="MRS Holdings" />}
        
        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-start">Confirm Logout</h5>
                  <button type="button" className="btn-close" onClick={cancelLogout}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to logout?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cancelLogout}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={confirmLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;