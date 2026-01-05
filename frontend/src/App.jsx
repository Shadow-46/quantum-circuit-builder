import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import TutorialsPage from './pages/TutorialsPage'
import ProfilePage from './pages/ProfilePage'
import AlgorithmsPage from './pages/AlgorithmsPage'
import Navigation from './components/Common/Navigation'
import AchievementNotification from './components/Common/AchievementNotification'
import WelcomeTour from './components/Common/WelcomeTour'
import useProgressStore from './store/progressStore'
import './App.css'

function App() {
  const [activeTutorial, setActiveTutorial] = useState(null);
  const { startSession, endSession } = useProgressStore();

  useEffect(() => {
    startSession();
    
    return () => {
      endSession();
    };
  }, []);

  const handleStartTutorial = (tutorialId) => {
    setActiveTutorial(tutorialId);
    window.location.href = '/builder'; // Navigate to builder with tutorial
  };

  return (
    <Router>
      <div className="app">
        <Navigation />
        <AchievementNotification />
        <WelcomeTour />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/builder" 
              element={<BuilderPage activeTutorial={activeTutorial} />} 
            />
            <Route 
              path="/tutorials" 
              element={<TutorialsPage onStartTutorial={handleStartTutorial} />} 
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/algorithms" element={<AlgorithmsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
