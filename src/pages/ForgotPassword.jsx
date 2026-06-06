import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [token, setToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Error'); return }
      setMessage(data.message)
      setSent(true)
      if (data.resetToken) setToken(data.resetToken)
    } catch {
      setError('Connection error. Is the backend running?')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="8" fill="url(#flg)"/><path d="M16 8l8 8-8 8-8-8z" fill="white" opacity="0.9"/><path d="M16 12l4 4-4 4-4-4z" fill="white"/><defs><linearGradient id="flg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#1a73e8"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient></defs></svg>
          <span>Homepage</span>
        </Link>
        <h2>Reset your password</h2>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">Send reset link</button>
          </form>
        ) : (
          <div className="auth-success">
            <p>{message}</p>
            {token && (
              <div className="reset-token-box">
                <p className="reset-token-label">🔐 Dev mode — copy this token:</p>
                <code className="reset-token">{token}</code>
                <p className="reset-token-hint">Use it at <Link to={`/reset-password?token=${token}`}>/reset-password</Link></p>
              </div>
            )}
            <Link to="/login" className="btn btn-outline btn-full" style={{marginTop:16}}>Back to sign in</Link>
          </div>
        )}
        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
