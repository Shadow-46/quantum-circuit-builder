import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import Navigation from './components/Common/Navigation'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/builder" element={<BuilderPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
