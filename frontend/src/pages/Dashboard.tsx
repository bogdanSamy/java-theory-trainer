import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats } from '../api/client'
import type { Stats } from '../types'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError('Cannot connect to backend. Make sure the Spring Boot app is running on port 8080.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      {error && <div className="error">{error}</div>}
      {stats && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value" style={{ color: stats.dueToday > 0 ? '#dc2626' : '#16a34a' }}>
                {stats.dueToday}
              </div>
              <div className="stat-label">Due Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalQuestions}</div>
              <div className="stat-label">Total Questions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.learned}</div>
              <div className="stat-label">Reviewed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats.totalQuestions > 0 ? Math.round((stats.learned / stats.totalQuestions) * 100) : 0}%
              </div>
              <div className="stat-label">Progress</div>
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            {stats.dueToday > 0 ? (
              <>
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  You have <strong>{stats.dueToday}</strong> question{stats.dueToday !== 1 ? 's' : ''} due for review today.
                </p>
                <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}
                  onClick={() => navigate('/session')}>
                  Start Study Session →
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🎉 All caught up!</p>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>No questions due for today. Come back tomorrow!</p>
                <button className="btn btn-outline" onClick={() => navigate('/questions')}>Browse Questions</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
