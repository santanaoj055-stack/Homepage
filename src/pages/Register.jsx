import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Registration failed'); return }
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      console.error('Register fetch error:', err)
      setError(`Connection error: ${err.message}. Is the backend running?`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <svg viewBox="0 0 32 32" width="28" height="28">
            <rect width="32" height="32" rx="8" fill="url(#arg)" />
            <path d="M16 8l8 8-8 8-8-8z" fill="white" opacity="0.9" />
            <path d="M16 12l4 4-4 4-4-4z" fill="white" />
            <defs><linearGradient id="arg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#1a73e8"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient></defs>
          </svg>
          <span>Homepage</span>
        </Link>
        <h2>Create your account</h2>
        <p className="auth-subtitle">Start your free trial today</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Full name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg">Create account</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
