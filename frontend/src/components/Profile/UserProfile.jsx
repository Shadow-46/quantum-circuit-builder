import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar_url: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
      });
    }
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const getAvatarInitials = () => {
    return user.username?.substring(0, 2).toUpperCase() || 'QC';
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>

      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.type === 'success' ? '✓' : '⚠️'} {message.text}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">{getAvatarInitials()}</div>
            )}
          </div>
          {isEditing && (
            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) =>
                  setFormData({ ...formData, avatar_url: e.target.value })
                }
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user.email} disabled />
            <small>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              disabled={!isEditing}
              minLength={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              disabled={!isEditing}
              maxLength={500}
              rows={4}
              placeholder="Tell us about yourself..."
            />
            <small>{formData.bio.length}/500 characters</small>
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              style={{ textTransform: 'capitalize' }}
            />
          </div>

          <div className="form-group">
            <label>Member Since</label>
            <input
              type="text"
              value={new Date(user.created_at).toLocaleDateString()}
              disabled
            />
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
