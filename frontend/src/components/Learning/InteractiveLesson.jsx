import React, { useState } from 'react';
import './InteractiveLesson.css';

const InteractiveLesson = ({ lesson, pathId, onComplete, onBack, onLoadCircuit }) => {
  const [currentStep, setCurrentStep] = useState('content'); // 'content', 'circuit', 'quiz'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const submitQuiz = () => {
    let correct = 0;
    lesson.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++;
      }
    });
    
    const score = (correct / lesson.quiz.length) * 100;
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleComplete = () => {
    onComplete(quizScore);
  };

  const loadCircuitToBuilder = () => {
    if (lesson.circuit) {
      onLoadCircuit(lesson.circuit);
      alert('Circuit loaded into builder! Close this lesson to try it.');
    }
  };

  return (
    <div className="interactive-lesson-overlay">
      <div className="interactive-lesson-container">
        {/* Header */}
        <div className="lesson-header-bar">
          <button className="back-button" onClick={onBack}>
            ← Back to Lessons
          </button>
          <div className="lesson-title-bar">
            <h2>{lesson.title}</h2>
            <span className="lesson-duration">⏱️ {lesson.duration} min</span>
          </div>
          <div className="lesson-progress-dots">
            <span className={`dot ${currentStep === 'content' ? 'active' : 'done'}`} />
            <span className={`dot ${currentStep === 'circuit' ? 'active' : currentStep === 'quiz' ? 'done' : ''}`} />
            <span className={`dot ${currentStep === 'quiz' ? 'active' : ''}`} />
          </div>
        </div>

        {/* Content Area */}
        <div className="lesson-content-area">
          {/* Step 1: Content */}
          {currentStep === 'content' && (
            <div className="lesson-step content-step">
              <h1>{lesson.title}</h1>
              <p className="lesson-description">{lesson.description}</p>

              <div className="topics-section">
                <h3>🎯 What You'll Learn</h3>
                <ul className="topics-list">
                  {lesson.topics.map(topic => (
                    <li key={topic}>
                      <span className="topic-bullet">✓</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="content-section">
                <h3>📚 Lesson Content</h3>
                <div className="content-text">
                  <p>
                    This lesson will guide you through the fundamentals of <strong>{lesson.title.toLowerCase()}</strong>.
                  </p>
                  <p>
                    You'll explore key concepts including {lesson.topics.join(', ')}.
                  </p>
                  {lesson.circuit && (
                    <div className="circuit-preview-box">
                      <h4>🔬 Interactive Circuit</h4>
                      <p>This lesson includes a hands-on circuit for you to experiment with.</p>
                      <div className="circuit-gates">
                        {lesson.circuit.gates.map((gate, idx) => (
                          <span key={idx} className="gate-badge">
                            {gate.type}
                            {gate.qubit !== undefined && ` Q${gate.qubit}`}
                            {gate.control !== undefined && ` C${gate.control}→T${gate.target}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="learning-tip">
                    <span className="tip-icon">💡</span>
                    <div>
                      <strong>Pro Tip:</strong> Take your time with each concept. 
                      Quantum computing builds on previous knowledge!
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="next-button"
                onClick={() => setCurrentStep(lesson.circuit ? 'circuit' : 'quiz')}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Circuit (if available) */}
          {currentStep === 'circuit' && lesson.circuit && (
            <div className="lesson-step circuit-step">
              <h2>🔬 Interactive Circuit</h2>
              <p>Now let's explore the circuit for this lesson.</p>

              <div className="circuit-display">
                <div className="circuit-info">
                  <div className="info-item">
                    <span className="info-label">Qubits:</span>
                    <span className="info-value">{lesson.circuit.numQubits}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gates:</span>
                    <span className="info-value">{lesson.circuit.gates.length}</span>
                  </div>
                </div>

                <div className="circuit-visualization">
                  {Array.from({ length: lesson.circuit.numQubits }).map((_, qubitIdx) => (
                    <div key={qubitIdx} className="qubit-line">
                      <span className="qubit-label">q{qubitIdx}</span>
                      <div className="wire">
                        {lesson.circuit.gates
                          .filter(g => 
                            g.qubit === qubitIdx || 
                            g.control === qubitIdx || 
                            g.target === qubitIdx
                          )
                          .map((gate, gateIdx) => (
                            <div key={gateIdx} className="gate-box">
                              {gate.type}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="load-circuit-button" onClick={loadCircuitToBuilder}>
                  📥 Load Circuit into Builder
                </button>

                <div className="circuit-explanation">
                  <h4>Circuit Breakdown:</h4>
                  <ul>
                    {lesson.circuit.gates.map((gate, idx) => (
                      <li key={idx}>
                        <strong>Step {idx + 1}:</strong> Apply <code>{gate.type}</code> gate
                        {gate.qubit !== undefined && ` to qubit ${gate.qubit}`}
                        {gate.control !== undefined && ` (Control: ${gate.control}, Target: ${gate.target})`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="step-buttons">
                <button className="back-step-button" onClick={() => setCurrentStep('content')}>
                  ← Previous
                </button>
                <button className="next-button" onClick={() => setCurrentStep('quiz')}>
                  Continue to Quiz →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Quiz */}
          {currentStep === 'quiz' && (
            <div className="lesson-step quiz-step">
              <h2>📝 Knowledge Check</h2>
              <p>Test your understanding of the lesson material.</p>

              {!quizSubmitted ? (
                <div className="quiz-questions">
                  {lesson.quiz.map((question, qIdx) => (
                    <div key={qIdx} className="quiz-question">
                      <h4>Question {qIdx + 1}</h4>
                      <p className="question-text">{question.question}</p>
                      <div className="quiz-options">
                        {question.options.map((option, oIdx) => (
                          <label key={oIdx} className="quiz-option">
                            <input
                              type="radio"
                              name={`question-${qIdx}`}
                              checked={quizAnswers[qIdx] === oIdx}
                              onChange={() => handleQuizAnswer(qIdx, oIdx)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    className="submit-quiz-button"
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length !== lesson.quiz.length}
                  >
                    Submit Quiz
                  </button>
                </div>
              ) : (
                <div className="quiz-results">
                  <div className={`score-display ${quizScore === 100 ? 'perfect' : quizScore >= 70 ? 'good' : 'needs-work'}`}>
                    <div className="score-circle">
                      <span className="score-number">{Math.round(quizScore)}</span>
                      <span className="score-label">%</span>
                    </div>
                    <h3>
                      {quizScore === 100 && '🎉 Perfect Score!'}
                      {quizScore >= 70 && quizScore < 100 && '👍 Good Job!'}
                      {quizScore < 70 && '📚 Keep Learning!'}
                    </h3>
                  </div>

                  <div className="quiz-review">
                    {lesson.quiz.map((question, qIdx) => {
                      const userAnswer = quizAnswers[qIdx];
                      const isCorrect = userAnswer === question.correct;

                      return (
                        <div key={qIdx} className={`review-question ${isCorrect ? 'correct' : 'incorrect'}`}>
                          <div className="review-header">
                            <span className="review-icon">
                              {isCorrect ? '✓' : '✗'}
                            </span>
                            <h5>Question {qIdx + 1}</h5>
                          </div>
                          <p>{question.question}</p>
                          <p className="review-answer">
                            <strong>Your answer:</strong> {question.options[userAnswer]}
                          </p>
                          {!isCorrect && (
                            <p className="review-correct">
                              <strong>Correct answer:</strong> {question.options[question.correct]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button className="complete-button" onClick={handleComplete}>
                    ✓ Complete Lesson
                  </button>
                </div>
              )}

              {!quizSubmitted && (
                <button 
                  className="back-step-button" 
                  onClick={() => setCurrentStep(lesson.circuit ? 'circuit' : 'content')}
                >
                  ← Previous
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveLesson;
