import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import API_URL from '../api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Reset failed'); return }
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch {
      setError('Connection error.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="8" fill="url(#rlg)"/><path d="M16 8l8 8-8 8-8-8z" fill="white" opacity="0.9"/><path d="M16 12l4 4-4 4-4-4z" fill="white"/><defs><linearGradient id="rlg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#1a73e8"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient></defs></svg>
          <span>Homepage</span>
        </Link>
        <h2>Set new password</h2>
        <p className="auth-subtitle">Choose a strong password for your account.</p>
        {success ? (
          <div className="auth-success">
            <p>✅ Password reset successfully! Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label>New password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
            </div>
            <div className="auth-field">
              <label>Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">Reset password</button>
          </form>
        )}
        <p className="auth-footer">
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
