import { useState, useEffect, useCallback } from 'react'
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../api/client'
import type { Question } from '../types'
import { useLang } from '../context/LanguageContext'

const ALL_TAGS = ['Java', 'OOP', 'Collections', 'Streams', 'JVM', 'GC', 'Concurrency', 'Spring', 'JPA', 'SQL', 'Testing', 'Build', 'SystemDesign']

interface FormState {
  prompt: string
  answer: string
  tags: string
  difficulty: string
}

const emptyForm: FormState = { prompt: '', answer: '', tags: '', difficulty: 'MEDIUM' }

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Question | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const { lang } = useLang()

  const load = useCallback(async () => {
    try {
      const data = await getQuestions(query || undefined, tagFilter || undefined)
      setQuestions(data)
      setError('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [query, tagFilter])

  useEffect(() => {
    const timer = setTimeout(load, 300)
    return () => clearTimeout(timer)
  }, [load])

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (q: Question) => {
    setEditing(q)
    setForm({ prompt: q.prompt, answer: q.answer, tags: q.tags || '', difficulty: q.difficulty || 'MEDIUM' })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.prompt.trim() || !form.answer.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateQuestion(editing.id, form)
      } else {
        await createQuestion(form)
      }
      setShowForm(false)
      load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(lang === 'en' ? 'Delete this question?' : 'Ștergeți această întrebare?')) return
    try {
      await deleteQuestion(id)
      load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">{lang === 'en' ? 'Questions' : 'Întrebări'}</h1>

      <div className="questions-toolbar">
        <input
          type="text"
          placeholder={lang === 'en' ? 'Search questions...' : 'Caută întrebări...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          <option value="">{lang === 'en' ? 'All tags' : 'Toate tag-urile'}</option>
          {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}>
          {lang === 'en' ? '+ Add Question' : '+ Adaugă Întrebare'}
        </button>
      </div>

      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="loading">{lang === 'en' ? 'Loading questions...' : 'Se încarcă întrebările...'}</div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          {lang === 'en' ? 'No questions found. Add some or adjust your filters.' : 'Nicio întrebare găsită. Adaugați sau ajustați filtrele.'}
        </div>
      ) : (
        <div className="question-list">
          {questions.map(q => (
            <div key={q.id} className="question-item">
              <div className="question-item-header">
                <div
                  className="question-item-prompt"
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {lang === 'ro' && q.promptRo ? q.promptRo : q.prompt}
                </div>
                <div className="question-item-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(q)}>
                    {lang === 'en' ? 'Edit' : 'Editează'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q.id)}>
                    {lang === 'en' ? 'Delete' : 'Șterge'}
                  </button>
                </div>
              </div>
              <div className="question-item-meta">
                {q.tags && q.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
                {q.difficulty && (
                  <span className={`difficulty-badge difficulty-${q.difficulty}`}>{q.difficulty}</span>
                )}
                {q.lastRating && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {lang === 'en' ? 'Last:' : 'Ultima:'} {q.lastRating} · {lang === 'en' ? 'Next:' : 'Următ.:'} {q.nextReviewDate || (lang === 'en' ? 'not scheduled' : 'neplanificat')}
                  </span>
                )}
              </div>
              {expandedId === q.id && (
                <div className="question-answer" style={{ marginTop: '0.5rem' }}>
                  {lang === 'ro' && q.answerRo ? q.answerRo : q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="modal">
            <h3>{editing ? (lang === 'en' ? 'Edit Question' : 'Editați Întrebarea') : (lang === 'en' ? 'Add Question' : 'Adaugați Întrebare')}</h3>
            <div className="form-group">
              <label>{lang === 'en' ? 'Question *' : 'Întrebare *'}</label>
              <textarea
                value={form.prompt}
                onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
                placeholder={lang === 'en' ? 'Enter the question...' : 'Introduceți întrebarea...'}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>{lang === 'en' ? 'Answer *' : 'Răspuns *'}</label>
              <textarea
                value={form.answer}
                onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                placeholder={lang === 'en' ? 'Enter the answer...' : 'Introduceți răspunsul...'}
                rows={5}
              />
            </div>
            <div className="form-group">
              <label>{lang === 'en' ? 'Tags (comma-separated)' : 'Tag-uri (separate prin virgulă)'}</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="e.g. Java, OOP, Spring"
              />
            </div>
            <div className="form-group">
              <label>{lang === 'en' ? 'Difficulty' : 'Dificultate'}</label>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                <option value="EASY">{lang === 'en' ? 'Easy' : 'Ușor'}</option>
                <option value="MEDIUM">{lang === 'en' ? 'Medium' : 'Mediu'}</option>
                <option value="HARD">{lang === 'en' ? 'Hard' : 'Dificil'}</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>
                {lang === 'en' ? 'Cancel' : 'Anulează'}
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.prompt.trim() || !form.answer.trim()}>
                {saving ? (lang === 'en' ? 'Saving...' : 'Se salvează...') : (lang === 'en' ? 'Save' : 'Salvează')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
