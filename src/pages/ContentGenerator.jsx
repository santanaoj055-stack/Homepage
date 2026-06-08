import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API_URL from '../api'
import { useToast } from '../components/Toast'

export default function ContentGenerator() {
  const navigate = useNavigate()
  const addToast = useToast()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [prompt, setPrompt] = useState('')
  const [type, setType] = useState('report')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate(e) {
    e.preventDefault()
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Generation failed')
      setResult(data.text)
      addToast('Content generated successfully', 'success')
    } catch (e) {
      addToast(e.message, 'error')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="logo">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <rect width="32" height="32" rx="8" fill="url(#dg)"/>
              <path d="M16 8l8 8-8 8-8-8z" fill="white" opacity="0.9"/>
              <path d="M16 12l4 4-4 4-4-4z" fill="white"/>
              <defs><linearGradient id="dg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#1a73e8"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient></defs>
            </svg>
            <span className="logo-text">Homepage</span>
          </div>
          <div className="dash-user">
            <span className="dash-user-name">{user?.name}</span>
            <button className="btn-text" onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="dash-body">
        <aside className="dash-sidebar">
          <nav>
            <a href="/dashboard" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5h2v2H9v-2zm0-6h2v5H9V5z"/></svg>
              Overview
            </a>
            <a href="/profile" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-2a4 4 0 100-8 4 4 0 000 8z"/></svg>
              Profile
            </a>
            <a href="/ai/agent" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><circle cx="10" cy="10" r="10"/><path d="M6 10h8M10 6v8"/></svg>
              Nova
            </a>
            <a href="/ai/generate" className="sidebar-link active">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M10 2l4 4-4 4-4-4zM2 10l4-4 4 4-4 4zM18 10l-4-4-4 4 4 4zM10 18l-4-4 4-4 4 4z"/></svg>
              Nova Generate
            </a>
            <a href="/admin/users" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z"/></svg>
              Users
            </a>
            <a href="/contact" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z"/></svg>
              Contact
            </a>
          </nav>
        </aside>

        <main className="dash-main">
          <h1>Nova Generator</h1>
          <p className="dash-subtitle">Generate reports, insights, and descriptions with artificial intelligence.</p>

          <div className="generator-layout">
            <div className="generator-form-section">
              <form className="generator-form" onSubmit={handleGenerate}>
                <div className="form-group">
                  <label>Content type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="generator-select">
                    <option value="report">Report</option>
                    <option value="insight">Insight / Analysis</option>
                    <option value="description">Description</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe what you want to generate..."
                    rows={5}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </form>
            </div>

            <div className="generator-result-section">
              <h2>Result</h2>
              <div className="generator-result">
                {result ? (
                  <div className="result-content">{result}</div>
                ) : (
                  <div className="result-empty">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
                    </svg>
                    <p>Enter a prompt and click Generate to create content with AI.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
