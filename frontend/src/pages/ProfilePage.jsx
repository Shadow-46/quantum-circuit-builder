import useProgressStore, { achievements } from '../../store/progressStore';
import '../../styles/components.css';

export default function ProfilePage() {
  const { stats, unlockedAchievements } = useProgressStore();

  const completionRate = stats.tutorialsCompleted >= 4 ? 100 : (stats.tutorialsCompleted / 4) * 100;
  
  const achievementsByCategory = {
    beginner: achievements.filter(a => a.category === 'beginner'),
    intermediate: achievements.filter(a => a.category === 'intermediate'),
    advanced: achievements.filter(a => a.category === 'advanced'),
  };

  const isUnlocked = (achievementId) => unlockedAchievements.includes(achievementId);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>👤 Your Quantum Journey</h1>
        <p className="profile-subtitle">Track your progress and achievements</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔬</div>
          <div className="stat-value">{stats.circuitsCreated}</div>
          <div className="stat-label">Circuits Created</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{stats.simulationsRun}</div>
          <div className="stat-label">Simulations Run</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{stats.gatesUsed}</div>
          <div className="stat-label">Gates Placed</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{stats.tutorialsCompleted}/4</div>
          <div className="stat-label">Tutorials Completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏗️</div>
          <div className="stat-value">{stats.maxQubitsUsed}</div>
          <div className="stat-label">Max Qubits Used</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.daysActive}</div>
          <div className="stat-label">Days Active</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{stats.totalTimeSpent}</div>
          <div className="stat-label">Minutes Spent</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{unlockedAchievements.length}/{achievements.length}</div>
          <div className="stat-label">Achievements</div>
        </div>
      </div>

      {/* Tutorial Progress */}
      <div className="progress-section">
        <h2>📈 Tutorial Progress</h2>
        <div className="progress-bar-large">
          <div 
            className="progress-fill-large" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="progress-text-large">
          {completionRate.toFixed(0)}% Complete
        </p>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>🏆 Achievements</h2>
        
        {['beginner', 'intermediate', 'advanced'].map((category) => (
          <div key={category} className="achievement-category">
            <h3 className="category-title">
              {category === 'beginner' && '🟢 Beginner'}
              {category === 'intermediate' && '🟡 Intermediate'}
              {category === 'advanced' && '🔴 Advanced'}
            </h3>
            
            <div className="achievements-grid">
              {achievementsByCategory[category].map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`achievement-card ${isUnlocked(achievement.id) ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-card-icon">
                    {isUnlocked(achievement.id) ? achievement.icon : '🔒'}
                  </div>
                  <div className="achievement-card-title">{achievement.title}</div>
                  <div className="achievement-card-desc">{achievement.description}</div>
                  {isUnlocked(achievement.id) && (
                    <div className="achievement-badge">✓ Unlocked</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>📊 Quick Stats</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">🌊</span>
            <span>Hadamard Gates Used: {stats.hadamardGatesUsed}</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🔗</span>
            <span>CNOT Gates Used: {stats.cnotGatesUsed}</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🧪</span>
            <span>Algorithm Templates Explored: {stats.templatesUsed}</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">💾</span>
            <span>Circuits Saved: {stats.circuitsSaved}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
