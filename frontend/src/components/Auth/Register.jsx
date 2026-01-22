import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import './Auth.css';

const Register = ({ onSwitchToLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    // Validation
    if (username.length < 3) {
      setValidationError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await register(email, username, password);
      onClose?.();
    } catch (error) {
      // Error is handled in store
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Your Account</h2>
      <p className="auth-subtitle">Join the quantum computing revolution!</p>
      
      {(error || validationError) && (
        <div className="auth-error">
          <span className="error-icon">⚠️</span>
          {error || validationError}
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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="quantumdev"
            required
            minLength={3}
            disabled={isLoading}
          />
          <small>At least 3 characters</small>
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
            minLength={8}
            disabled={isLoading}
          />
          <small>At least 8 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button
            className="link-button"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
