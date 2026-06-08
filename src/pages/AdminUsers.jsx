import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../api'
import NotificationBell from '../components/NotificationBell'
import ThemeToggle from '../components/ThemeToggle'

export default function AdminUsers() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '' })

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchUsers()
  }, [])

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/users`, { headers })
      if (!res.ok) throw new Error('Failed to load users')
      setUsers(await res.json())
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return
    try {
      const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Delete failed')
      setUsers(users.filter(u => u.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  function startEdit(u) {
    setEditing(u.id)
    setForm({ name: u.name, email: u.email })
  }

  async function handleUpdate(id) {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setUsers(users.map(u => u.id === id ? { ...u, ...updated } : u))
      setEditing(null)
    } catch (e) {
      setError(e.message)
    }
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
            <a href="/admin/users" className="sidebar-link active">
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
          <div className="admin-header">
            <h1>User Management</h1>
            <span className="user-count">{users.length} users</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <p className="loading-text">Loading users...</p>
          ) : (
            <div className="admin-toolbar">
              <span className="user-count">{users.length} users</span>
              <a href={`${API_URL}/export/users`} className="btn btn-outline btn-sm" target="_blank"
                onClick={(e) => { e.preventDefault(); window.open(`${API_URL}/export/users`, '_blank') }}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10 1l4 4h-3v7H9V5H6l4-4zM2 13v4h16v-4h2v6H0v-6h2z"/></svg>
                Download CSV
              </a>
            </div>
          )}
          {users.length > 0 && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      {editing === u.id ? (
                        <>
                          <td>
                            <input
                              className="admin-input"
                              value={form.name}
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            />
                          </td>
                          <td>
                            <input
                              className="admin-input"
                              value={form.email}
                              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            />
                          </td>
                          <td>
                            <span className={`status-badge ${u.isActive ? 'success' : 'pending'}`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button className="btn-icon save" onClick={() => handleUpdate(u.id)} title="Save">
                              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M14 0H2a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V6l-4-4zM2 2h11v4H2V2zm16 16H2v-2h16v2z"/></svg>
                            </button>
                            <button className="btn-icon cancel" onClick={() => setEditing(null)} title="Cancel">
                              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05 5.05 3.636 10 8.586z"/></svg>
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`status-badge ${u.isActive ? 'success' : 'pending'}`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button className="btn-icon edit" onClick={() => startEdit(u)} title="Edit">
                              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M13.89 3.39l2.71 2.72L7.47 15.24l-2.71-2.72 9.13-9.13zM3.96 16.5l-.94.94a.5.5 0 00.12.5.5.5 0 00.5.12l.94-.94-.62-.62zM15.3 1.98L18 4.69l-2.02 2.02-2.71-2.72 2.02-2.01zM2 15.28l1.41-1.41 2.72 2.71L4.71 18H2v-2.72z"/></svg>
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete(u.id)} title="Delete"
                              disabled={u.id === user?.id}>
                              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M6 2l1-1h6l1 1h3v2H3V2h3zm1 3h8v12a2 2 0 01-2 2H9a2 2 0 01-2-2V5z"/></svg>
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
