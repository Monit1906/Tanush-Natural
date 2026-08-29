import React from 'react';
import Button from '../components/Button/Button';
import { BotanicalWatermark, TulsiSprig } from '../components/Illustrations/BotanicalIllustrations';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <BotanicalWatermark illustration="neem-branch" position="center" opacity={0.07} size={380} />
      <div className="not-found-content" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <TulsiSprig size={48} color="var(--color-primary, #173B2F)" />
        </div>
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
