// components/Loader.tsx
import React from 'react';
import './Loader.css'; // Add your loader CSS here or inline

const Loader: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.7)',
      zIndex: 9999
    }}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
