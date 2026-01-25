import { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import './APIKeyManager.css';

/**
 * APIKeyManager - Manage API keys for programmatic access
 */
const APIKeyManager = () => {
  const { isAuthenticated } = useAuthStore();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    rate_limit: 1000,
    expires_in_days: null
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadApiKeys();
    }
  }, [isAuthenticated]);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api-keys');
      setApiKeys(response.data);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/api-keys', formData);
      setNewKeyData(response.data);
      setShowCreateForm(false);
      setFormData({ name: '', rate_limit: 1000, expires_in_days: null });
      await loadApiKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
      alert(error.response?.data?.detail || 'Failed to create API key');
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api-keys/${keyId}`);
      await loadApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const handleToggleActive = async (key) => {
    try {
      await api.patch(`/api-keys/${key.id}`, {
        is_active: !key.is_active
      });
      await loadApiKeys();
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (!isAuthenticated) {
    return (
      <div className="api-key-manager">
        <p>Please log in to manage API keys.</p>
      </div>
    );
  }

  return (
    <div className="api-key-manager">
      <div className="manager-header">
        <h2>API Keys</h2>
        <button 
          className="create-button"
          onClick={() => setShowCreateForm(true)}
          disabled={apiKeys.length >= 10}
        >
          + Create New Key
        </button>
      </div>

      {newKeyData && (
        <div className="new-key-modal">
          <div className="modal-content">
            <h3>✅ API Key Created!</h3>
            <p className="warning">
              ⚠️ Save this key now! You won't be able to see it again.
            </p>
            <div className="key-display">
              <code>{newKeyData.key}</code>
              <button onClick={() => copyToClipboard(newKeyData.key)}>
                📋 Copy
              </button>
            </div>
            <div className="key-info">
              <p><strong>Name:</strong> {newKeyData.name}</p>
              <p><strong>Rate Limit:</strong> {newKeyData.rate_limit} req/hour</p>
              {newKeyData.expires_at && (
                <p><strong>Expires:</strong> {new Date(newKeyData.expires_at).toLocaleDateString()}</p>
              )}
            </div>
            <button 
              className="close-button"
              onClick={() => setNewKeyData(null)}
            >
              I've saved my key
            </button>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="create-form-modal">
          <div className="modal-content">
            <h3>Create New API Key</h3>
            <form onSubmit={handleCreateKey}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Production App"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rate Limit (requests/hour)</label>
                <input
                  type="number"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({ ...formData, rate_limit: parseInt(e.target.value) })}
                  min="100"
                  max="10000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Expiration (optional)</label>
                <select
                  value={formData.expires_in_days || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    expires_in_days: e.target.value ? parseInt(e.target.value) : null 
                  })}
                >
                  <option value="">Never</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit">Create Key</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading API keys...</div>
      ) : apiKeys.length === 0 ? (
        <div className="empty-state">
          <p>No API keys yet</p>
          <small>Create an API key to access the API programmatically</small>
        </div>
      ) : (
        <div className="keys-list">
          {apiKeys.map((key) => (
            <div key={key.id} className={`key-card ${!key.is_active ? 'inactive' : ''}`}>
              <div className="key-header">
                <div>
                  <h3>{key.name}</h3>
                  <code className="key-prefix">{key.key_prefix}••••••••••••••••</code>
                </div>
                <div className="key-status">
                  <span className={`status-badge ${key.is_active ? 'active' : 'inactive'}`}>
                    {key.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="key-details">
                <div className="detail-item">
                  <span className="label">Created:</span>
                  <span>{new Date(key.created_at).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Rate Limit:</span>
                  <span>{key.rate_limit} req/hour</span>
                </div>
                {key.last_used_at && (
                  <div className="detail-item">
                    <span className="label">Last Used:</span>
                    <span>{new Date(key.last_used_at).toLocaleDateString()}</span>
                  </div>
                )}
                {key.expires_at && (
                  <div className="detail-item">
                    <span className="label">Expires:</span>
                    <span>{new Date(key.expires_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="key-actions">
                <button 
                  onClick={() => handleToggleActive(key)}
                  className="toggle-button"
                >
                  {key.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleDeleteKey(key.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="documentation">
        <h3>📚 Using Your API Key</h3>
        <div className="code-example">
          <h4>JavaScript Example:</h4>
          <pre>{`fetch('http://localhost:8000/api/v1/circuits', {
  headers: {
    'Authorization': 'qcb_your_api_key_here'
  }
})
.then(res => res.json())
.then(data => console.log(data));`}</pre>
        </div>

        <div className="code-example">
          <h4>Python Example:</h4>
          <pre>{`import requests

headers = {'Authorization': 'qcb_your_api_key_here'}
response = requests.get(
    'http://localhost:8000/api/v1/circuits',
    headers=headers
)
print(response.json())`}</pre>
        </div>

        <div className="code-example">
          <h4>cURL Example:</h4>
          <pre>{`curl -X GET "http://localhost:8000/api/v1/circuits" \\
  -H "Authorization: qcb_your_api_key_here"`}</pre>
        </div>
      </div>
    </div>
  );
};

export default APIKeyManager;
