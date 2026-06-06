import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../api'
import { useToast } from '../components/Toast'
import { useTheme } from '../context/ThemeContext'

export default function Profile() {
  const navigate = useNavigate()
  const addToast = useToast()
  const { dark, toggle } = useTheme()
  const token = localStorage.getItem('token')
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', email: '' })
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load profile')
      const data = await res.json()
      setProfile(data)
      setForm({ name: data.name, email: data.email })
    } catch {
      addToast('Error loading profile', 'error')
    }
    setLoading(false)
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setProfile(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      addToast('Profile updated successfully', 'success')
    } catch {
      addToast('Failed to update profile', 'error')
    }
    setSaving(false)
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) {
      addToast('Passwords do not match', 'error')
      return
    }
    if (passForm.newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to change password')
      }
      addToast('Password changed successfully', 'success')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) {
      addToast(e.message, 'error')
    }
    setSaving(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (loading) return <div className="dashboard"><main className="dash-main"><p className="loading-text">Loading profile...</p></main></div>

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
            <span className="dash-user-name">{profile?.name}</span>
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
            <a href="/profile" className="sidebar-link active">
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
          <h1>Profile settings</h1>
          <p className="dash-subtitle">Manage your account information and password.</p>

          <div className="profile-section">
            <h2>Personal information</h2>
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input value={profile?.role || 'user'} disabled className="input-disabled" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>

          <div className="profile-section">
            <h2>Change password</h2>
            <form className="profile-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current password</label>
                <input type="password" value={passForm.currentPassword}
                  onChange={e => setPassForm(f => ({ ...f, currentPassword: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>New password</label>
                <input type="password" value={passForm.newPassword}
                  onChange={e => setPassForm(f => ({ ...f, newPassword: e.target.value }))} required minLength={6} />
              </div>
              <div className="form-group">
                <label>Confirm new password</label>
                <input type="password" value={passForm.confirmPassword}
                  onChange={e => setPassForm(f => ({ ...f, confirmPassword: e.target.value }))} required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Changing...' : 'Change password'}
              </button>
            </form>
          </div>

          <div className="profile-section">
            <h2>Preferences</h2>
            <div className="theme-setting">
              <div className="theme-setting-info">
                <span className="theme-setting-label">Theme</span>
                <span className="theme-setting-desc">Switch between light and dark mode</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={dark} onChange={toggle} />
                <span className="toggle-slider">
                  <span className="toggle-icon">{dark ? '🌙' : '☀️'}</span>
                </span>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
