import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API_URL from '../api'
import NotificationBell from '../components/NotificationBell'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')
  const [stats, setStats] = useState(null)
  const [insights, setInsights] = useState(null)

  useEffect(() => {
    if (!user || !token) { navigate('/login'); return }
    fetch(`${API_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
    fetch(`${API_URL}/dashboard/insights`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setInsights)
      .catch(() => {})
  }, [])

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
            <NotificationBell />
            <ThemeToggle />
            <span className="dash-user-name">{user?.name}</span>
            <span className="dash-role-badge">{user?.role || 'user'}</span>
            <button className="btn-text" onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="dash-body">
        <aside className="dash-sidebar">
          <nav>
            <a href="/dashboard" className="sidebar-link active">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5h2v2H9v-2zm0-6h2v5H9V5z"/></svg>
              Overview
            </a>
            <a href="/profile" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-2a4 4 0 100-8 4 4 0 000 8z"/></svg>
              Profile
            </a>
            <a href="/ai/agent" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><circle cx="10" cy="10" r="10"/><path d="M6 10h8M10 6v8"/></svg>
              AI Agent
            </a>
            <a href="/ai/generate" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z"/></svg>
              AI Generator
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
          <h1>Welcome back, {user?.name?.split(' ')[0] || user?.name}</h1>
          <p className="dash-subtitle">Here's what's happening with your platform today.</p>

          <div className="dash-cards">
            <div className="dash-card">
              <div className="dash-card-icon icon-blue">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </div>
              <div className="dash-card-body">
                <span className="dash-card-value">{stats?.totalUsers ?? '...'}</span>
                <span className="dash-card-label">Total users</span>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon icon-green">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div className="dash-card-body">
                <span className="dash-card-value">{stats?.uptime ?? '...'}</span>
                <span className="dash-card-label">Uptime</span>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon icon-purple">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <div className="dash-card-body">
                <span className="dash-card-value">{stats?.activeProjects ?? '...'}</span>
                <span className="dash-card-label">Active projects</span>
              </div>
            </div>
            <div className="dash-card">
              <div className="dash-card-icon icon-orange">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div className="dash-card-body">
                <span className="dash-card-value">{stats?.newUsersToday ?? '...'}</span>
                <span className="dash-card-label">New today</span>
              </div>
            </div>
          </div>

          <div className="dash-grid">
            <div className="dash-table-section">
              <h2>Recent activity</h2>
              <div className="dash-table">
                <div className="dash-table-row header">
                  <span>Event</span>
                  <span>Status</span>
                  <span>Date</span>
                </div>
                <div className="dash-table-row">
                  <span>Account created</span>
                  <span><span className="status-badge success">Completed</span></span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="dash-table-row">
                  <span>Welcome email sent</span>
                  <span><span className="status-badge success">Sent</span></span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="dash-table-row">
                  <span>Free trial started</span>
                  <span><span className="status-badge pending">Active</span></span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="dash-insights-section">
              <h2>AI Insights</h2>
              <div className="insights-card">
                {insights ? (
                  <div className="insights-content">{insights.text}</div>
                ) : (
                  <div className="insights-placeholder">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <p>Conecta una API key de Gemini en .env para obtener insights generados por IA sobre tu plataforma.</p>
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
