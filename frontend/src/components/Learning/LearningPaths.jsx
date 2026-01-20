import React, { useState, useEffect } from 'react';
import './LearningPaths.css';
import { learningPathsData, LEARNING_PATHS, LESSON_STATUS, ACHIEVEMENTS } from '../../data/learningPathsData';
import InteractiveLesson from './InteractiveLesson';
import ProgressTracker from './ProgressTracker';

const LearningPaths = ({ onClose, onLoadCircuit }) => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('learningProgress');
    const savedAchievements = localStorage.getItem('learningAchievements');
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      // Initialize progress
      const initialProgress = {};
      Object.keys(learningPathsData).forEach(pathKey => {
        const path = learningPathsData[pathKey];
        initialProgress[pathKey] = {
          status: pathKey === LEARNING_PATHS.BEGINNER ? 'unlocked' : 'locked',
          completedLessons: [],
          currentLesson: path.lessons[0].id,
        };
      });
      setProgress(initialProgress);
    }

    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem('learningProgress', JSON.stringify(progress));
    }
  }, [progress]);

  // Save achievements
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem('learningAchievements', JSON.stringify(achievements));
    }
  }, [achievements]);

  const unlockAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      const newAchievements = [...achievements, achievementId];
      setAchievements(newAchievements);
      setShowAchievement(ACHIEVEMENTS[achievementId.toUpperCase()]);
      
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const getLessonStatus = (pathId, lessonId) => {
    const pathProgress = progress[pathId];
    if (!pathProgress) return LESSON_STATUS.LOCKED;

    if (pathProgress.completedLessons.includes(lessonId)) {
      return LESSON_STATUS.COMPLETED;
    }

    if (pathProgress.currentLesson === lessonId) {
      return LESSON_STATUS.IN_PROGRESS;
    }

    const path = learningPathsData[pathId];
    const lessonIndex = path.lessons.findIndex(l => l.id === lessonId);
    
    if (lessonIndex === 0) {
      return LESSON_STATUS.AVAILABLE;
    }

    const previousLesson = path.lessons[lessonIndex - 1];
    if (pathProgress.completedLessons.includes(previousLesson.id)) {
      return LESSON_STATUS.AVAILABLE;
    }

    return LESSON_STATUS.LOCKED;
  };

  const completeLesson = (pathId, lessonId, quizScore) => {
    const pathProgress = progress[pathId];
    const path = learningPathsData[pathId];
    const lessonIndex = path.lessons.findIndex(l => l.id === lessonId);

    const newCompletedLessons = [...pathProgress.completedLessons];
    if (!newCompletedLessons.includes(lessonId)) {
      newCompletedLessons.push(lessonId);
    }

    // Check for achievements
    if (newCompletedLessons.length === 1) {
      unlockAchievement('first_lesson');
    }

    if (quizScore === 100) {
      unlockAchievement('perfect_quiz');
    }

    if (newCompletedLessons.length === path.lessons.length) {
      unlockAchievement('path_complete');
      
      // Unlock next path
      const pathKeys = Object.keys(learningPathsData);
      const currentPathIndex = pathKeys.indexOf(pathId);
      if (currentPathIndex < pathKeys.length - 1) {
        const nextPathKey = pathKeys[currentPathIndex + 1];
        setProgress(prev => ({
          ...prev,
          [nextPathKey]: {
            ...prev[nextPathKey],
            status: 'unlocked',
          },
        }));
      }
    }

    // Set next lesson as current
    const nextLesson = lessonIndex < path.lessons.length - 1
      ? path.lessons[lessonIndex + 1].id
      : null;

    setProgress(prev => ({
      ...prev,
      [pathId]: {
        ...pathProgress,
        completedLessons: newCompletedLessons,
        currentLesson: nextLesson,
      },
    }));

    setSelectedLesson(null);
  };

  const getPathProgress = (pathId) => {
    const pathProgress = progress[pathId];
    const path = learningPathsData[pathId];
    
    if (!pathProgress || !path) return 0;
    
    return (pathProgress.completedLessons.length / path.lessons.length) * 100;
  };

  const getTotalProgress = () => {
    const paths = Object.keys(learningPathsData);
    const totalLessons = paths.reduce((sum, pathKey) => 
      sum + learningPathsData[pathKey].lessons.length, 0
    );
    const completedLessons = paths.reduce((sum, pathKey) => 
      sum + (progress[pathKey]?.completedLessons.length || 0), 0
    );
    
    return (completedLessons / totalLessons) * 100;
  };

  if (selectedLesson) {
    return (
      <InteractiveLesson
        lesson={selectedLesson}
        pathId={selectedPath}
        onComplete={(quizScore) => completeLesson(selectedPath, selectedLesson.id, quizScore)}
        onBack={() => setSelectedLesson(null)}
        onLoadCircuit={onLoadCircuit}
      />
    );
  }

  return (
    <div className="learning-paths-overlay" onClick={onClose}>
      <div className="learning-paths-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="learning-header">
          <div className="header-content">
            <h1>🎓 Interactive Learning Paths</h1>
            <p>Master quantum computing step by step</p>
          </div>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker
          progress={progress}
          achievements={achievements}
          totalProgress={getTotalProgress()}
        />

        {/* Learning Paths Grid */}
        <div className="paths-content">
          <div className="paths-grid">
            {Object.keys(learningPathsData).map(pathKey => {
              const path = learningPathsData[pathKey];
              const pathProgress = progress[pathKey];
              const isLocked = pathProgress?.status === 'locked';
              const progressPercent = getPathProgress(pathKey);

              return (
                <div
                  key={pathKey}
                  className={`path-card ${isLocked ? 'locked' : ''} ${selectedPath === pathKey ? 'selected' : ''}`}
                  onClick={() => !isLocked && setSelectedPath(selectedPath === pathKey ? null : pathKey)}
                >
                  <div className="path-icon">{path.icon}</div>
                  <div className="path-info">
                    <h3>{path.title}</h3>
                    <p>{path.description}</p>
                    <div className="path-meta">
                      <span className="difficulty">
                        {'⭐'.repeat(path.difficulty)}
                      </span>
                      <span className="duration">⏱️ {path.estimatedHours}h</span>
                      <span className="lessons">📚 {path.lessons.length} lessons</span>
                    </div>
                    {isLocked && path.prerequisite && (
                      <div className="locked-badge">
                        🔒 Complete {learningPathsData[path.prerequisite].title} first
                      </div>
                    )}
                    {!isLocked && (
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                        <span className="progress-text">{Math.round(progressPercent)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lessons List */}
          {selectedPath && (
            <div className="lessons-panel">
              <h2>📖 Lessons</h2>
              <div className="lessons-list">
                {learningPathsData[selectedPath].lessons.map((lesson, index) => {
                  const status = getLessonStatus(selectedPath, lesson.id);
                  const isLocked = status === LESSON_STATUS.LOCKED;
                  const isCompleted = status === LESSON_STATUS.COMPLETED;
                  const isInProgress = status === LESSON_STATUS.IN_PROGRESS;

                  return (
                    <div
                      key={lesson.id}
                      className={`lesson-item ${status}`}
                      onClick={() => !isLocked && setSelectedLesson(lesson)}
                    >
                      <div className="lesson-number">{index + 1}</div>
                      <div className="lesson-content">
                        <div className="lesson-header">
                          <h4>{lesson.title}</h4>
                          {isCompleted && <span className="status-badge completed">✓</span>}
                          {isInProgress && <span className="status-badge in-progress">▶</span>}
                          {isLocked && <span className="status-badge locked">🔒</span>}
                        </div>
                        <p>{lesson.description}</p>
                        <div className="lesson-meta">
                          <span>⏱️ {lesson.duration} min</span>
                          <span>📝 {lesson.quiz.length} questions</span>
                          {lesson.circuit && <span>🔬 Circuit included</span>}
                        </div>
                        <div className="lesson-topics">
                          {lesson.topics.map(topic => (
                            <span key={topic} className="topic-tag">{topic}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Achievement Notification */}
        {showAchievement && (
          <div className="achievement-notification">
            <div className="achievement-icon">{showAchievement.icon}</div>
            <div className="achievement-info">
              <h3>Achievement Unlocked!</h3>
              <p>{showAchievement.title}</p>
              <span className="points">+{showAchievement.points} points</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPaths;
