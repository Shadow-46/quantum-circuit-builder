import { useState } from 'react';
import { tutorials } from '../../data/tutorials';
import '../../styles/components.css';

export default function TutorialsList({ onStartTutorial }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredTutorials = selectedDifficulty === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.difficulty === selectedDifficulty);

  return (
    <div className="tutorials-page">
      <div className="tutorials-header">
        <h1>🎓 Interactive Quantum Tutorials</h1>
        <p className="tutorials-subtitle">
          Learn quantum computing through hands-on, step-by-step interactive guides
        </p>
      </div>

      <div className="difficulty-filter">
        <button 
          className={`filter-btn ${selectedDifficulty === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedDifficulty('all')}
        >
          All Tutorials
        </button>
        <button 
          className={`filter-btn ${selectedDifficulty === 'beginner' ? 'active' : ''}`}
          onClick={() => setSelectedDifficulty('beginner')}
        >
          🟢 Beginner
        </button>
        <button 
          className={`filter-btn ${selectedDifficulty === 'intermediate' ? 'active' : ''}`}
          onClick={() => setSelectedDifficulty('intermediate')}
        >
          🟡 Intermediate
        </button>
        <button 
          className={`filter-btn ${selectedDifficulty === 'advanced' ? 'active' : ''}`}
          onClick={() => setSelectedDifficulty('advanced')}
        >
          🔴 Advanced
        </button>
      </div>

      <div className="tutorials-grid">
        {filteredTutorials.map((tutorial) => (
          <div key={tutorial.id} className="tutorial-card">
            <div className="tutorial-card-header">
              <h3>{tutorial.title}</h3>
              <span className={`difficulty-badge badge-${tutorial.difficulty}`}>
                {tutorial.difficulty}
              </span>
            </div>
            <p className="tutorial-description">{tutorial.description}</p>
            <div className="tutorial-meta">
              <span className="meta-item">
                📚 {tutorial.steps.length} steps
              </span>
              <span className="meta-item">
                ⏱️ {tutorial.duration}
              </span>
            </div>
            <button 
              className="btn-primary btn-block"
              onClick={() => onStartTutorial(tutorial.id)}
            >
              Start Tutorial →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
