import { useState, useEffect } from 'react';
import '../../styles/components.css';

const tourSteps = [
  {
    id: 1,
    title: 'Welcome to Quantum Circuit Builder! 🎉',
    description: 'Your all-in-one platform for learning and building quantum circuits. Let me show you around!',
    target: null,
    position: 'center',
  },
  {
    id: 2,
    title: 'Circuit Builder',
    description: 'This is where you create quantum circuits. Select gates from the palette and add them to your qubits.',
    highlight: '.gate-palette',
    position: 'right',
  },
  {
    id: 3,
    title: 'Control Panel',
    description: 'Simulate your circuit, export it, save your work, or load templates here.',
    highlight: '.circuit-actions',
    position: 'bottom',
  },
  {
    id: 4,
    title: 'Visualizations',
    description: 'View measurement results, statevector, Bloch sphere, and density matrix after simulation.',
    highlight: '.results-section',
    position: 'top',
  },
  {
    id: 5,
    title: 'Navigation',
    description: 'Explore quantum algorithms, take interactive tutorials, and track your progress!',
    highlight: '.nav-links',
    position: 'bottom',
  },
  {
    id: 6,
    title: 'You\'re Ready! 🚀',
    description: 'Start by adding a Hadamard gate to create your first superposition. Need help? Click the ❓ Help button anytime!',
    target: null,
    position: 'center',
  },
];

export default function WelcomeTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if tour has been completed before
    const tourCompleted = localStorage.getItem('quantum-tour-completed');
    if (!tourCompleted) {
      // Delay showing the tour to let the page load
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const completeTour = () => {
    localStorage.setItem('quantum-tour-completed', 'true');
    setShow(false);
  };

  if (!show) return null;

  const step = tourSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tourSteps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div className="tour-overlay" />

      {/* Tour Card */}
      <div className={`tour-card tour-${step.position}`}>
        <div className="tour-header">
          <div className="tour-progress">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          <button className="tour-skip" onClick={handleSkip}>
            Skip Tour
          </button>
        </div>

        <div className="tour-content">
          <h3 className="tour-title">{step.title}</h3>
          <p className="tour-description">{step.description}</p>
        </div>

        <div className="tour-dots">
          {tourSteps.map((_, idx) => (
            <span
              key={idx}
              className={`tour-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>

        <div className="tour-actions">
          <button
            className="btn-tour-secondary"
            onClick={handlePrevious}
            disabled={isFirst}
          >
            ← Previous
          </button>
          <button
            className="btn-tour-primary"
            onClick={handleNext}
          >
            {isLast ? '🎉 Get Started!' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
}
