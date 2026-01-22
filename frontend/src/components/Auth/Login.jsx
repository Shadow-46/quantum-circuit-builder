import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import './Auth.css';

const Login = ({ onSwitchToRegister, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
      onClose?.();
    } catch (error) {
      // Error is handled in store
    }
  };

  return (
    <div className="auth-form">
      <h2>Login to Quantum Circuit Builder</h2>
      <p className="auth-subtitle">Welcome back! Continue building quantum circuits.</p>
      
      {error && (
        <div className="auth-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <button
            className="link-button"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
