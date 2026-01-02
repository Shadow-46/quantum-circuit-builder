import { useState, useEffect } from 'react';
import '../../styles/components.css';

export default function TutorialPanel({ tutorial, currentStep, onNextStep, onPreviousStep, onComplete, onClose }) {
  const [showHint, setShowHint] = useState(false);

  if (!tutorial) return null;

  const step = tutorial.steps[currentStep];
  const isLastStep = currentStep === tutorial.steps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / tutorial.steps.length) * 100;

  return (
    <div className="tutorial-panel">
      <div className="tutorial-header">
        <div className="tutorial-title">
          <h3>📚 {tutorial.title}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="tutorial-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">
            Step {currentStep + 1} of {tutorial.steps.length}
          </span>
        </div>
      </div>

      <div className="tutorial-content">
        <div className="step-number">Step {currentStep + 1}</div>
        <h4 className="step-title">{step.title}</h4>
        <p className="step-description">{step.description}</p>

        {step.image && (
          <div className="step-image">
            <img src={step.image} alt={step.title} />
          </div>
        )}

        {step.code && (
          <div className="step-code">
            <pre><code>{step.code}</code></pre>
          </div>
        )}

        {step.task && (
          <div className="step-task">
            <div className="task-header">
              <span className="task-icon">🎯</span>
              <strong>Your Task:</strong>
            </div>
            <p>{step.task}</p>
          </div>
        )}

        {step.hint && (
          <div className="step-hint">
            <button 
              className="btn-hint"
              onClick={() => setShowHint(!showHint)}
            >
              💡 {showHint ? 'Hide' : 'Show'} Hint
            </button>
            {showHint && (
              <div className="hint-content">
                {step.hint}
              </div>
            )}
          </div>
        )}

        {step.theory && (
          <details className="step-theory">
            <summary>📖 Learn More</summary>
            <div className="theory-content">
              {step.theory}
            </div>
          </details>
        )}
      </div>

      <div className="tutorial-actions">
        <button 
          className="btn-secondary"
          onClick={onPreviousStep}
          disabled={isFirstStep}
        >
          ← Previous
        </button>
        
        {isLastStep ? (
          <button 
            className="btn-primary"
            onClick={onComplete}
          >
            ✓ Complete Tutorial
          </button>
        ) : (
          <button 
            className="btn-primary"
            onClick={onNextStep}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
