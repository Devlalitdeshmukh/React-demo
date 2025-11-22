import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import UserPage from './components/UserPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import React from 'react';

function App() {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "LapTop",
      price: "$1200.00",
      desc: "Core i7, 16GB",
      image: ""
    },
    {
      id: 2,
      title: "USB Hub",
      price: "$1800.00",
      desc: "8 in 1 USB-C Hub",
      image: ""
    },
    {
      id: 3,
      title: "Head Phone",
      price: "$99.00",
      desc: "JBL Wireless",
      image: ""
    },
    {
      id: 4,
      title: "Smart Watch",
      price: "$299.00",
      desc: "Fitness Tracker with Heart Rate Monitor",
      image: ""
    },
    {
      id: 5,
      title: "Bluetooth Speaker",
      price: "$79.99",
      desc: "Portable Wireless Speaker",
      image: ""
    }
  ]);

  // Users state
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Lalit Desh",
      email: "lalit@example.com",
      phone: "254-476-5214",
      address: "142 Main St",
      country: "IND",
      image: "https://i.pravatar.cc/150?img=2"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      address: "456 Oak Ave",
      country: "Canada",
      image: "https://i.pravatar.cc/150?img=4"
    }
    ,
    {
      id: 3,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      country: "USA",
      image: "https://i.pravatar.cc/150?img=7"
    }
  ]);

  const [toastMessage, setToastMessage] = useState("");

  // Auto-hide toast messages after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={
            <ProductPage 
              cards={cards} 
              setCards={setCards} 
              toastMessage={toastMessage} 
              setToastMessage={setToastMessage} 
              users={users}
            />
          } />
          <Route path="/users" element={
            <UserPage 
              users={users} 
              setUsers={setUsers} 
              toastMessage={toastMessage} 
              setToastMessage={setToastMessage} 
            />
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
        <Footer companyName="MRS Holdings" />
      </div>
    </Router>
  );
}

export default App;