import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { startSession, submitReview } from '../api/client'
import type { SessionQuestion, Rating } from '../types'

export default function Session() {
  const [current, setCurrent] = useState<SessionQuestion | null | undefined>(undefined)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    startSession()
      .then(q => { setCurrent(q); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const handleRating = async (rating: Rating) => {
    if (!current) return
    setSubmitting(true)
    setShowAnswer(false)
    try {
      const next = await submitReview(current.id, rating)
      setDone(d => d + 1)
      setCurrent(next)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page"><div className="loading">Starting session...</div></div>
  if (error) return <div className="page"><div className="error">{error}</div></div>

  if (current === null) {
    return (
      <div className="page">
        <div className="session-done">
          <h2>🎉 Session Complete!</h2>
          <p>You reviewed {done} question{done !== 1 ? 's' : ''} in this session.</p>
          <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>No more questions due right now. Come back tomorrow!</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Dashboard</button>
            <button className="btn btn-outline" onClick={() => navigate('/questions')}>Browse Questions</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="session-progress">
        {done > 0 && <span>✓ {done} reviewed this session · </span>}
        {current && <span>{current.remaining} remaining</span>}
      </div>

      {current && (
        <div className="card">
          {current.tags && (
            <div className="question-item-meta" style={{ marginBottom: '0.75rem' }}>
              {current.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
              {current.difficulty && (
                <span className={`difficulty-badge difficulty-${current.difficulty}`}>{current.difficulty}</span>
              )}
            </div>
          )}

          <div className="question-prompt">{current.prompt}</div>

          {!showAnswer ? (
            <button
              className="btn btn-outline"
              onClick={() => setShowAnswer(true)}
              style={{ marginBottom: '1rem' }}
            >
              Show Answer
            </button>
          ) : (
            <>
              <div className="question-answer">{current.answer}</div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                How well did you know this?
              </p>
              <div className="rating-buttons">
                <button
                  className="btn btn-danger"
                  onClick={() => handleRating('HARD')}
                  disabled={submitting}
                >
                  😰 Hard (1 day)
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => handleRating('OK')}
                  disabled={submitting}
                >
                  😐 OK (3+ days)
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleRating('EASY')}
                  disabled={submitting}
                >
                  😊 Easy (7+ days)
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
