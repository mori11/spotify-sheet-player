import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CallbackPage from './pages/CallbackPage'

// Force rebuild for Vercel deployment - v2

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-spotify-black text-spotify-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App