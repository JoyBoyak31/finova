// src/components/Notification.jsx
import { useEffect, useState } from 'react';
import '../styles/Notification.css';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add show class after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Remove notification after duration
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      
      // Wait for hide animation to complete before removing
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <div className={`notification ${type} ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {renderIcon()}
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

// Create a notification system
const notificationSystem = {
  notifications: [],
  container: null,
  
  createContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }
    return this.container;
  },

  show(message, type = 'success', duration = 3000) {
    const id = Date.now().toString();
    
    // Create container if it doesn't exist
    this.createContainer();
    
    // Create notification element
    const notificationElement = document.createElement('div');
    notificationElement.id = `notification-${id}`;
    this.container.appendChild(notificationElement);

    // Render notification component
    const removeNotification = () => {
      const element = document.getElementById(`notification-${id}`);
      if (element) {
        element.remove();
      }
      
      // Remove from notifications array
      this.notifications = this.notifications.filter(n => n.id !== id);
    };

    // Add to notifications array
    this.notifications.push({ id, message, type });

    // Use ReactDOM to render the Notification component
    // Note: In a real app, you would use ReactDOM.render or createRoot.render
    // This is simplified for the example
    console.log(`Notification displayed: ${message} (${type})`);
    
    // Remove notification after duration + animation time
    setTimeout(removeNotification, duration + 300);
    
    return id;
  },

  success(message, duration) {
    return this.show(message, 'success', duration);
  },

  error(message, duration) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration) {
    return this.show(message, 'info', duration);
  },
};

export { Notification, notificationSystem as toast };
export default Notification;