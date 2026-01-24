import { useState } from 'react';
import useCollaboration from '../../hooks/useCollaboration';
import './CollaborationPanel.css';

/**
 * CollaborationPanel - Shows active users, cursors, and chat
 */
const CollaborationPanel = ({ circuitId, visible = true }) => {
  const {
    connected,
    roomUsers,
    messages,
    sendMessage
  } = useCollaboration(circuitId);

  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // users, chat

  if (!visible) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    sendMessage(messageInput);
    setMessageInput('');
  };

  return (
    <div className="collaboration-panel">
      <div className="collaboration-header">
        <h3>Collaboration</h3>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="collaboration-tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({roomUsers.length})
        </button>
        <button 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat {messages.filter(m => m.type === 'chat').length > 0 && `(${messages.filter(m => m.type === 'chat').length})`}
        </button>
      </div>

      <div className="collaboration-content">
        {activeTab === 'users' && (
          <div className="users-list">
            {roomUsers.length === 0 ? (
              <div className="empty-state">
                <p>No other users in this circuit</p>
                <small>Share the circuit link to collaborate</small>
              </div>
            ) : (
              roomUsers.map((user, index) => (
                <div key={user.sid || index} className="user-item">
                  <div className="user-avatar" style={{ backgroundColor: `hsl(${index * 137}, 70%, 60%)` }}>
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.username || 'Anonymous'}</div>
                    <div className="user-status">Active</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-container">
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <p>No messages yet</p>
                  <small>Start a conversation!</small>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    {msg.type === 'system' ? (
                      <div className="system-message">{msg.text}</div>
                    ) : (
                      <div className="chat-message">
                        <div className="message-header">
                          <span className="message-author">{msg.username}</span>
                          <span className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="message-text">{msg.text}</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={connected ? "Type a message..." : "Connecting..."}
                disabled={!connected}
                className="chat-input"
              />
              <button 
                type="submit" 
                disabled={!connected || !messageInput.trim()}
                className="send-button"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;
