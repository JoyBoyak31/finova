// src/components/Toast/ToastSystem.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import '../../styles/Toast.css';

// Create Toast Context
const ToastContext = createContext(null);

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add new toast
  const addToast = (message, type = 'info', duration = 5000, title = null) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new toast object
    const newToast = {
      id,
      message,
      type, // 'success', 'error', 'info', 'warning'
      title: title || getDefaultTitle(type),
      duration,
      createdAt: Date.now(),
    };
    
    // Add toast to state
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Set timeout to remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };
  
  // Helper to get default title based on type
  const getDefaultTitle = (type) => {
    switch(type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Information';
    }
  };
  
  // Remove toast
  const removeToast = (id) => {
    // First mark the toast for deletion (for animation)
    setToasts(prevToasts => 
      prevToasts.map(toast => 
        toast.id === id
          ? { ...toast, isClosing: true }
          : toast
      )
    );
    
    // After animation completes, remove toast completely
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 300); // Match animation duration
  };
  
  // Expose the context values
  const contextValue = {
    addToast,
    removeToast,
    // Convenience methods
    success: (message, duration, title) => addToast(message, 'success', duration, title),
    error: (message, duration, title) => addToast(message, 'error', duration, title),
    warning: (message, duration, title) => addToast(message, 'warning', duration, title),
    info: (message, duration, title) => addToast(message, 'info', duration, title),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  const [progressWidth, setProgressWidth] = useState(100);
  
  useEffect(() => {
    if (toast.duration > 0) {
      // Animate progress bar
      const interval = setInterval(() => {
        setProgressWidth((prev) => {
          const newWidth = prev - (100 / (toast.duration / 100));
          return newWidth < 0 ? 0 : newWidth;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [toast.duration]);
  
  // Get icon based on toast type
  const getIcon = () => {
    switch(toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✖';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };
  
  return (
    <div className={`toast toast-${toast.type} ${toast.isClosing ? 'closing' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <div className="toast-title">{toast.title}</div>
        <div className="toast-message">{toast.message}</div>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
      {toast.duration > 0 && (
        <div 
          className="toast-progress-bar" 
          style={{ width: `${progressWidth}%` }}
        ></div>
      )}
    </div>
  );
};

export default ToastProvider;   