import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { startSession, submitReview } from '../api/client'
import type { SessionQuestion, Rating } from '../types'
import { useLang } from '../context/LanguageContext'

export default function Session() {
  const [current, setCurrent] = useState<SessionQuestion | null | undefined>(undefined)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(0)
  const navigate = useNavigate()
  const { lang } = useLang()

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

  if (loading) return <div className="page"><div className="loading">{lang === 'en' ? 'Starting session...' : 'Se pornește sesiunea...'}</div></div>
  if (error) return <div className="page"><div className="error">{error}</div></div>

  if (current === null) {
    return (
      <div className="page">
        <div className="session-done">
          <h2>🎉 {lang === 'en' ? 'Session Complete!' : 'Sesiune Completă!'}</h2>
          <p>{lang === 'en'
            ? `You reviewed ${done} question${done !== 1 ? 's' : ''} in this session.`
            : `Ați recenzat ${done} întrebare${done !== 1 ? 'i' : ''} în această sesiune.`
          }</p>
          <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
            {lang === 'en' ? 'No more questions due right now. Come back tomorrow!' : 'Nu mai sunt întrebări scadente acum. Reveniți mâine!'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              {lang === 'en' ? 'Back to Dashboard' : 'Înapoi la Panou'}
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/questions')}>
              {lang === 'en' ? 'Browse Questions' : 'Răsfoiți Întrebările'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="session-progress">
        {done > 0 && <span>✓ {done} {lang === 'en' ? 'reviewed this session' : 'recenzate în această sesiune'} · </span>}
        {current && <span>{current.remaining} {lang === 'en' ? 'remaining' : 'rămase'}</span>}
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

          <div className="question-prompt">
            {lang === 'ro' && current.promptRo ? current.promptRo : current.prompt}
          </div>

          {!showAnswer ? (
            <button
              className="btn btn-outline"
              onClick={() => setShowAnswer(true)}
              style={{ marginBottom: '1rem' }}
            >
              {lang === 'en' ? 'Show Answer' : 'Arată Răspunsul'}
            </button>
          ) : (
            <>
              <div className="question-answer">
                {lang === 'ro' && current.answerRo ? current.answerRo : current.answer}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                {lang === 'en' ? 'How well did you know this?' : 'Cât de bine știați asta?'}
              </p>
              <div className="rating-buttons">
                <button
                  className="btn btn-danger"
                  onClick={() => handleRating('HARD')}
                  disabled={submitting}
                >
                  {lang === 'en' ? '😰 Hard (1 day)' : '😰 Greu (1 zi)'}
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => handleRating('OK')}
                  disabled={submitting}
                >
                  {lang === 'en' ? '😐 OK (3+ days)' : '😐 OK (3+ zile)'}
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleRating('EASY')}
                  disabled={submitting}
                >
                  {lang === 'en' ? '😊 Easy (7+ days)' : '😊 Ușor (7+ zile)'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
