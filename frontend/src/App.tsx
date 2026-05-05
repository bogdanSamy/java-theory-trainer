import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Session from './pages/Session'
import Questions from './pages/Questions'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <NavLink to="/" className="brand">☕ Java Trainer</NavLink>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/session">Session</NavLink>
          <NavLink to="/questions">Questions</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session" element={<Session />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
