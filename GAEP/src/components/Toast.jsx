import React from 'react';
import { toast, Toaster } from 'react-hot-toast';
import '../Styles/Toast.module.css';

// Export the Toaster component for use in App.jsx
export const ToastContainer = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#fff',
        color: '#333',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      success: {
        iconTheme: {
          primary: '#4CAF50',
          secondary: '#FFFFFF',
        },
      },
      error: {
        iconTheme: {
          primary: '#F44336',
          secondary: '#FFFFFF',
        },
      },
    }}
  />
);

// Toast functions to use throughout the app
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  dismiss: toast.dismiss,
};

// Custom Toast component for more control (used in existing components)
export const CustomToast = ({ message, type, onClose }) => (
  <div className={`custom-toast ${type}`}>
    <div className="toast-content">
      {type === 'success' && <i className="fas fa-check-circle"></i>}
      {type === 'error' && <i className="fas fa-times-circle"></i>}
      <span>{message}</span>
    </div>
    <button onClick={onClose} className="toast-close">×</button>
  </div>
);

export default showToast;