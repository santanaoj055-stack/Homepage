import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API_URL from '../api'

export default function ContactPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message?.[0] || 'Failed to send message')
      }
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
    } catch (e) {
      setError(e.message)
    }
    setSubmitting(false)
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
              <rect width="32" height="32" rx="8" fill="url(#dg)" />
              <path d="M16 8l8 8-8 8-8-8z" fill="white" opacity="0.9" />
              <path d="M16 12l4 4-4 4-4-4z" fill="white" />
              <defs><linearGradient id="dg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#1a73e8"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient></defs>
            </svg>
            <span className="logo-text">Homepage</span>
          </div>
          <div className="dash-user">
            {user && <span className="dash-user-name">{user.name}</span>}
            {user ? (
              <button className="btn-text" onClick={handleLogout}>Sign out</button>
            ) : (
              <Link to="/login" className="btn-text">Sign in</Link>
            )}
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
            <a href="/ai/agent" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><circle cx="10" cy="10" r="10"/><path d="M6 10h8M10 6v8"/></svg>
              Nova
            </a>
            <a href="/ai/generate" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z"/></svg>
              Nova Generator
            </a>
            <a href="/admin/users" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z"/></svg>
              Users
            </a>
            <a href="/contact" className="sidebar-link active">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z"/></svg>
              Contact
            </a>
          </nav>
        </aside>

        <main className="dash-main">
          <h1>Contact us</h1>
          <p className="dash-subtitle">Have a question or need help? Send us a message.</p>

          {success ? (
            <div className="contact-success">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#34a853" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <path d="M22 4L12 14.01l-3-3"/>
                </svg>
              </div>
              <h2>Message sent!</h2>
              <p>Thank you for reaching out. We'll get back to you shortly.</p>
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name" name="name" required
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email" name="email" type="email" required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message" name="message" required rows={5}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}
