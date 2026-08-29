import React from 'react';
import { Leaf } from 'phosphor-react';
import Button from '../components/Button/Button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Leaf size={400} className="not-found-bg-icon" />
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.</p>
        
        <div className="not-found-actions">
          <Button variant="primary" to="/shop">EXPLORE SHOP</Button>
          <Button variant="outline" to="/">RETURN HOME</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
