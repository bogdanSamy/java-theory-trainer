import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats } from '../api/client'
import type { Stats } from '../types'
import { useLang } from '../context/LanguageContext'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { lang } = useLang()

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError(
        lang === 'en'
          ? 'Cannot connect to backend. Make sure the Spring Boot app is running on port 8080.'
          : 'Nu se poate conecta la server. Asigurați-vă că aplicația Spring Boot rulează pe portul 8080.'
      ))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><div className="loading">{lang === 'en' ? 'Loading...' : 'Se încarcă...'}</div></div>

  return (
    <div className="page">
      <h1 className="page-title">{lang === 'en' ? 'Dashboard' : 'Panou'}</h1>
      {error && <div className="error">{error}</div>}
      {stats && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value" style={{ color: stats.dueToday > 0 ? '#dc2626' : '#16a34a' }}>
                {stats.dueToday}
              </div>
              <div className="stat-label">{lang === 'en' ? 'Due Today' : 'Scadente Azi'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalQuestions}</div>
              <div className="stat-label">{lang === 'en' ? 'Total Questions' : 'Total Întrebări'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.learned}</div>
              <div className="stat-label">{lang === 'en' ? 'Reviewed' : 'Recenzate'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats.totalQuestions > 0 ? Math.round((stats.learned / stats.totalQuestions) * 100) : 0}%
              </div>
              <div className="stat-label">{lang === 'en' ? 'Progress' : 'Progres'}</div>
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            {stats.dueToday > 0 ? (
              <>
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  {lang === 'en'
                    ? <>You have <strong>{stats.dueToday}</strong> question{stats.dueToday !== 1 ? 's' : ''} due for review today.</>
                    : <>Aveți <strong>{stats.dueToday}</strong> întrebare{stats.dueToday !== 1 ? 'i' : ''} scadentă{stats.dueToday !== 1 ? '' : ''} pentru recenzie azi.</>
                  }
                </p>
                <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}
                  onClick={() => navigate('/session')}>
                  {lang === 'en' ? 'Start Study Session →' : 'Începe Sesiunea →'}
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🎉 {lang === 'en' ? 'All caught up!' : 'Totul la zi!'}</p>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                  {lang === 'en' ? 'No questions due for today. Come back tomorrow!' : 'Nicio întrebare scadentă azi. Reveniți mâine!'}
                </p>
                <button className="btn btn-outline" onClick={() => navigate('/questions')}>
                  {lang === 'en' ? 'Browse Questions' : 'Răsfoiți Întrebările'}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
