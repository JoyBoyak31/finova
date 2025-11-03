// src/components/Layout.jsx - Interstellar Theme
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../styles/main.css';

const Layout = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Notification system
  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Expose toast functions to window for global access
  useEffect(() => {
    window.toast = {
      success: (msg) => showNotification(msg, 'success'),
      error: (msg) => showNotification(msg, 'error'),
      info: (msg) => showNotification(msg, 'info'),
      warning: (msg) => showNotification(msg, 'warning')
    };

    return () => {
      window.toast = undefined;
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>

      {/* Notification container */}
      <div className="notifications-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`notification notification-${type}`}>
            <div className="notification-content">
              <p>{message}</p>
            </div>
            <button 
              className="notification-close" 
              onClick={() => removeNotification(id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;