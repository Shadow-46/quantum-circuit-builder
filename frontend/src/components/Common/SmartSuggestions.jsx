import React from 'react';
import './SmartSuggestions.css';

const SmartSuggestions = ({ suggestions, onSelectSuggestion, position }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div 
      className="smart-suggestions-panel" 
      style={{ 
        top: `${position.y}px`, 
        left: `${position.x}px` 
      }}
    >
      <div className="suggestions-header">
        <span className="suggestions-icon">✨</span>
        <span className="suggestions-title">Smart Suggestions</span>
        <span className="suggestions-badge">{suggestions.length}</span>
      </div>

      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`suggestion-item priority-${suggestion.priority}`}
            onClick={() => onSelectSuggestion(suggestion)}
          >
            <div className="suggestion-header">
              <span className="suggestion-title">{suggestion.title}</span>
              {suggestion.priority === 'high' && (
                <span className="priority-badge high">High Priority</span>
              )}
              {suggestion.priority === 'medium' && (
                <span className="priority-badge medium">Recommended</span>
              )}
            </div>
            
            <p className="suggestion-description">{suggestion.description}</p>

            {suggestion.action && (
              <div className="suggestion-action">
                <span className="action-label">{suggestion.action.label}</span>
                {suggestion.action.gates && (
                  <div className="action-gates">
                    {suggestion.action.gates.map((gate, gIdx) => (
                      <span key={gIdx} className="gate-chip">{gate.type}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {suggestion.reason && (
              <div className="suggestion-reason">
                💡 {suggestion.reason}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="suggestions-footer">
        <span className="footer-tip">💡 Click a suggestion to apply it</span>
      </div>
    </div>
  );
};

export default SmartSuggestions;
