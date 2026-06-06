import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Login failed'); return }
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      console.error('Login fetch error:', err)
      setError(`Connection error: ${err.message}. Is the backend running?`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <svg viewBox="0 0 32 32" width="28" height="28">
            <rect width="32" height="32" rx="8" fill="url(#alg)" />
            <path d="M16 8l8 8-8 8-8-8z" fill="white" opacity="0.9" />
            <path d="M16 12l4 4-4 4-4-4z" fill="white" />
            <defs><linearGradient id="alg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#1a73e8"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient></defs>
          </svg>
          <span>Homepage</span>
        </Link>
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg">Sign in</button>
          <Link to="/forgot-password" className="btn-text auth-forgot">Forgot password?</Link>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
