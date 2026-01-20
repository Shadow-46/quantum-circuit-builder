import React from 'react';
import './ProgressTracker.css';
import { ACHIEVEMENTS } from '../../data/learningPathsData';

const ProgressTracker = ({ progress, achievements, totalProgress }) => {
  const getTotalPoints = () => {
    return achievements.reduce((sum, achievementId) => {
      const achievement = ACHIEVEMENTS[achievementId.toUpperCase()];
      return sum + (achievement?.points || 0);
    }, 0);
  };

  const getTotalLessons = () => {
    return Object.values(progress).reduce((sum, pathProgress) => 
      sum + (pathProgress.completedLessons?.length || 0), 0
    );
  };

  return (
    <div className="progress-tracker">
      <div className="progress-summary">
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <span className="card-value">{Math.round(totalProgress)}%</span>
            <span className="card-label">Overall Progress</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📚</div>
          <div className="card-content">
            <span className="card-value">{getTotalLessons()}</span>
            <span className="card-label">Lessons Completed</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <span className="card-value">{achievements.length}</span>
            <span className="card-label">Achievements</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">⭐</div>
          <div className="card-content">
            <span className="card-value">{getTotalPoints()}</span>
            <span className="card-label">Total Points</span>
          </div>
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="achievements-display">
          <h4>🏆 Your Achievements</h4>
          <div className="achievements-list">
            {achievements.map(achievementId => {
              const achievement = ACHIEVEMENTS[achievementId.toUpperCase()];
              if (!achievement) return null;

              return (
                <div key={achievementId} className="achievement-badge">
                  <span className="badge-icon">{achievement.icon}</span>
                  <div className="badge-info">
                    <span className="badge-title">{achievement.title}</span>
                    <span className="badge-points">+{achievement.points}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
