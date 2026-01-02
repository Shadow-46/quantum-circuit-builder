import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import TutorialsPage from './pages/TutorialsPage'
import Navigation from './components/Common/Navigation'
import './App.css'

function App() {
  const [activeTutorial, setActiveTutorial] = useState(null);

  const handleStartTutorial = (tutorialId) => {
    setActiveTutorial(tutorialId);
    window.location.href = '/builder'; // Navigate to builder with tutorial
  };

  return (
    <Router>
      <div className="app">
        <Navigation />
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
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
