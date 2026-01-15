import React from 'react';
import './TemplateCard.css';

const TemplateCard = ({ template, onLoad, onFavorite, isFavorite, isCustom, onDelete, onExport }) => {
  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Beginner':
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'algorithms':
        return '🧮';
      case 'building_blocks':
        return '🧱';
      case 'benchmarks':
        return '📊';
      case 'tutorials':
        return '📚';
      case 'custom':
        return '⭐';
      default:
        return '🔷';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="template-card">
      <div className="template-card-header">
        <div className="template-icon">
          {getCategoryIcon(template.category)}
        </div>
        <div className="template-header-info">
          <h3 className="template-name">{template.name}</h3>
          <div className="template-meta">
            <span
              className="complexity-badge"
              style={{ backgroundColor: getComplexityColor(template.complexity) }}
            >
              {template.complexity}
            </span>
            <span className="qubit-count">{template.numQubits} qubit{template.numQubits !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => onFavorite(template.id)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <p className="template-description">{template.description}</p>

      <div className="template-stats">
        <div className="stat">
          <span className="stat-label">Gates</span>
          <span className="stat-value">{template.gateCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Depth</span>
          <span className="stat-value">{template.depth}</span>
        </div>
      </div>

      {template.learningOutcome && (
        <div className="learning-outcome">
          <span className="outcome-icon">💡</span>
          <span className="outcome-text">{template.learningOutcome}</span>
        </div>
      )}

      <div className="template-tags">
        {template.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
        {template.tags.length > 3 && (
          <span className="tag more-tags">+{template.tags.length - 3}</span>
        )}
      </div>

      {isCustom && template.createdAt && (
        <div className="template-dates">
          <span className="date-info">
            Created: {formatDate(template.createdAt)}
          </span>
          {template.updatedAt && template.updatedAt !== template.createdAt && (
            <span className="date-info">
              Updated: {formatDate(template.updatedAt)}
            </span>
          )}
        </div>
      )}

      <div className="template-actions">
        <button className="load-btn" onClick={() => onLoad(template)}>
          Load Circuit
        </button>
        {isCustom && (
          <>
            <button className="export-btn" onClick={() => onExport(template)} title="Export circuit">
              ⬇
            </button>
            <button className="delete-btn" onClick={() => onDelete(template.id)} title="Delete circuit">
              🗑
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
