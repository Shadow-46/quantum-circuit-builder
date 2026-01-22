import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import AuthModal from '../Auth/AuthModal';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout, loadUser } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogin = () => {
    setAuthView('login');
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthView('register');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getAvatarInitials = () => {
    return user?.username?.substring(0, 2).toUpperCase() || 'QC';
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-icon">⚛️</span>
            <h1>Quantum Circuit Builder</h1>
          </div>

          <div className="header-actions">
            {isAuthenticated && user ? (
              <div className="user-menu-container">
                <button
                  className="user-menu-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} />
                    ) : (
                      <div className="avatar-initials">{getAvatarInitials()}</div>
                    )}
                  </div>
                  <span className="user-name">{user.username}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-email">{user.email}</div>
                      <div className="dropdown-role">{user.role}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a href="/profile" className="dropdown-item">
                      <span>👤</span> Profile
                    </a>
                    <a href="/circuits" className="dropdown-item">
                      <span>💾</span> My Circuits
                    </a>
                    <a href="/learning" className="dropdown-item">
                      <span>📚</span> Learning Progress
                    </a>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="btn-secondary" onClick={handleLogin}>
                  Login
                </button>
                <button className="btn-primary" onClick={handleRegister}>
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authView}
      />

      {showUserMenu && (
        <div
          className="user-menu-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Header;