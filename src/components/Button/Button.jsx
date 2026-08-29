import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'medium', to, onClick, type = 'button', fullWidth = false, className = '' }) => {
  const baseClass = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClass} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={baseClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
