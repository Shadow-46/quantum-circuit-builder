import { useState, useEffect } from 'react';
import './CommentSystem.css';

export default function CommentSystem({ circuit, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedGate, setSelectedGate] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'general', 'gate'
  const [replyTo, setReplyTo] = useState(null);

  // Load comments from localStorage
  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem('circuitComments') || '[]');
    setComments(savedComments);
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      author: 'User',
      timestamp: new Date().toISOString(),
      type: selectedGate !== null ? 'gate' : 'general',
      gateIndex: selectedGate,
      gateType: selectedGate !== null ? circuit.gates[selectedGate]?.type : null,
      replies: [],
      parentId: replyTo
    };

    let updatedComments;
    if (replyTo) {
      // Add as a reply
      updatedComments = comments.map(c => 
        c.id === replyTo 
          ? { ...c, replies: [...c.replies, comment] }
          : c
      );
    } else {
      // Add as new comment
      updatedComments = [comment, ...comments];
    }

    setComments(updatedComments);
    localStorage.setItem('circuitComments', JSON.stringify(updatedComments));
    setNewComment('');
    setSelectedGate(null);
    setReplyTo(null);
  };

  const handleDeleteComment = (commentId, parentId = null) => {
    if (!window.confirm('Delete this comment?')) return;

    let updatedComments;
    if (parentId) {
      // Delete reply
      updatedComments = comments.map(c =>
        c.id === parentId
          ? { ...c, replies: c.replies.filter(r => r.id !== commentId) }
          : c
      );
    } else {
      // Delete main comment
      updatedComments = comments.filter(c => c.id !== commentId);
    }

    setComments(updatedComments);
    localStorage.setItem('circuitComments', JSON.stringify(updatedComments));
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    setSelectedGate(null);
  };

  const handleSelectGate = (index) => {
    setSelectedGate(index === selectedGate ? null : index);
    setReplyTo(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'all') return !c.parentId;
    if (filter === 'general') return c.type === 'general' && !c.parentId;
    if (filter === 'gate') return c.type === 'gate' && !c.parentId;
    return true;
  });

  return (
    <div className="comment-system-overlay" onClick={onClose}>
      <div className="comment-system-content" onClick={e => e.stopPropagation()}>
        <div className="comment-header">
          <h2>💬 Comments & Discussion</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        {/* Circuit Gates Selector */}
        <div className="gates-selector-section">
          <h3>🚪 Comment on Gate (Optional)</h3>
          <div className="gates-grid">
            {circuit.gates.map((gate, index) => (
              <button
                key={index}
                onClick={() => handleSelectGate(index)}
                className={`gate-button ${selectedGate === index ? 'selected' : ''}`}
              >
                <span className="gate-number">#{index + 1}</span>
                <span className="gate-type">{gate.type}</span>
                {gate.control !== undefined && (
                  <span className="gate-info">q{gate.control}→q{gate.target}</span>
                )}
                {gate.control === undefined && gate.target !== undefined && (
                  <span className="gate-info">q{gate.target}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* New Comment Form */}
        <div className="new-comment-section">
          {replyTo && (
            <div className="reply-indicator">
              💬 Replying to comment
              <button onClick={() => setReplyTo(null)} className="cancel-reply">✕</button>
            </div>
          )}
          {selectedGate !== null && (
            <div className="gate-indicator">
              🎯 Commenting on Gate #{selectedGate + 1} ({circuit.gates[selectedGate].type})
              <button onClick={() => setSelectedGate(null)} className="cancel-gate">✕</button>
            </div>
          )}
          <div className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyTo 
                  ? "Write a reply..." 
                  : selectedGate !== null 
                    ? "Comment on this gate..." 
                    : "Write a comment..."
              }
              className="comment-textarea"
              rows={3}
            />
            <button onClick={handleAddComment} className="add-comment-button">
              {replyTo ? '↩️ Reply' : '💬 Add Comment'}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            onClick={() => setFilter('all')}
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          >
            All ({comments.filter(c => !c.parentId).length})
          </button>
          <button 
            onClick={() => setFilter('general')}
            className={`filter-tab ${filter === 'general' ? 'active' : ''}`}
          >
            General ({comments.filter(c => c.type === 'general' && !c.parentId).length})
          </button>
          <button 
            onClick={() => setFilter('gate')}
            className={`filter-tab ${filter === 'gate' ? 'active' : ''}`}
          >
            Gate Comments ({comments.filter(c => c.type === 'gate' && !c.parentId).length})
          </button>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {filteredComments.length === 0 ? (
            <div className="empty-comments">
              <p className="empty-icon">💬</p>
              <p>No comments yet</p>
              <p className="empty-hint">Be the first to start a discussion!</p>
            </div>
          ) : (
            filteredComments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  👤
                </div>
                <div className="comment-content">
                  <div className="comment-meta">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-time">{formatTime(comment.timestamp)}</span>
                    {comment.type === 'gate' && (
                      <span className="comment-gate-tag">
                        🎯 Gate #{comment.gateIndex + 1} ({comment.gateType})
                      </span>
                    )}
                  </div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-actions">
                    <button 
                      onClick={() => handleReply(comment.id)} 
                      className="comment-action-btn"
                    >
                      ↩️ Reply
                    </button>
                    <button 
                      onClick={() => handleDeleteComment(comment.id)} 
                      className="comment-action-btn delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies-section">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="reply-item">
                          <div className="comment-avatar small">
                            👤
                          </div>
                          <div className="comment-content">
                            <div className="comment-meta">
                              <span className="comment-author">{reply.author}</span>
                              <span className="comment-time">{formatTime(reply.timestamp)}</span>
                            </div>
                            <div className="comment-text">{reply.text}</div>
                            <div className="comment-actions">
                              <button 
                                onClick={() => handleDeleteComment(reply.id, comment.id)} 
                                className="comment-action-btn delete"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
