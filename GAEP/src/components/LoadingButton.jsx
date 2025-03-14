import React from 'react';
import '../Styles/LoadingButton.css';

const LoadingButton = ({ 
  onClick, 
  loading = false, 
  text, 
  loadingText = "Procesando...", 
  disabled = false, 
  className = '', 
  type = 'button',
  variant = 'primary'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`loading-button ${variant} ${loading ? 'is-loading' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
    >
      <span className="button-text">
        {loading ? loadingText : text}
      </span>
      {loading && <span className="spinner"></span>}
    </button>
  );
};

export default LoadingButton;