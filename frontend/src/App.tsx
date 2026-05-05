import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Session from './pages/Session'
import Questions from './pages/Questions'
import { LanguageProvider, useLang } from './context/LanguageContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import './App.css'

function NavBar() {
  const { lang, toggleLang } = useLang()
  const { dark, toggleTheme } = useTheme()
  return (
    <nav>
      <NavLink to="/" className="brand">☕ Java Trainer</NavLink>
      <NavLink to="/" end>{lang === 'en' ? 'Dashboard' : 'Panou'}</NavLink>
      <NavLink to="/session">{lang === 'en' ? 'Session' : 'Sesiune'}</NavLink>
      <NavLink to="/questions">{lang === 'en' ? 'Questions' : 'Întrebări'}</NavLink>
      <div className="nav-controls">
        <button className="nav-toggle" onClick={toggleLang}>{lang === 'en' ? '🇷🇴 RO' : '🇬🇧 EN'}</button>
        <button className="nav-toggle" onClick={toggleTheme}>{dark ? '☀️' : '🌙'}</button>
      </div>
    </nav>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="app">
            <NavBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/session" element={<Session />} />
              <Route path="/questions" element={<Questions />} />
            </Routes>
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
