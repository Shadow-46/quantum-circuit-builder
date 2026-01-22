import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthModal = ({ isOpen, onClose, defaultView = 'login' }) => {
  const [view, setView] = useState(defaultView);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>
        {view === 'login' ? (
          <Login
            onSwitchToRegister={() => setView('register')}
            onClose={onClose}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setView('login')}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
