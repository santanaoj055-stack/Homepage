import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API_URL from '../api'
import { useToast } from '../components/Toast'

export default function AIAgent() {
  const navigate = useNavigate()
  const addToast = useToast()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '👋 Soy Nova, el agente de Homepage. Puedo ayudarte a:\n\n👤 Usuarios\n- Crear usuarios\n\n📨 Mensajes\n- Enviar mensajes de contacto\n- Enviarme notificaciones\n\n📊 Datos\n- Ver estadísticas del dashboard\n- Generar reportes\n\n⚙️ Mi cuenta\n- Actualizar mi perfil\n- Cambiar mi contraseña\n\n💬 Preguntas\n- Responder preguntas generales\n\n¿Qué deseas hacer?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [actionForm, setActionForm] = useState(null)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, actionForm])

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/ai/agent`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', text: data.text }])
      if (data.action) {
        setActionForm(data.action)
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: '⚠️ Error de conexión.' }])
    }
    setLoading(false)
  }

  async function executeAction(action, params) {
    try {
      if (action.type === 'create_user') {
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        if (userData.role !== 'admin') {
          setMessages(m => [...m, { role: 'assistant', text: '❌ Solo administradores pueden crear usuarios.' }])
          return
        }
        const res = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })
        if (!res.ok) throw new Error('Failed to create user')
        addToast(`User ${params.name} created successfully`, 'success')
        setMessages(m => [...m, { role: 'assistant', text: `✅ Usuario ${params.name} creado exitosamente.` }])
      } else if (action.type === 'contact_message') {
        const res = await fetch(`${API_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })
        if (!res.ok) throw new Error('Failed to send message')
        addToast('Contact message sent', 'success')
        setMessages(m => [...m, { role: 'assistant', text: '✅ Mensaje de contacto enviado exitosamente.' }])
      } else if (action.type === 'get_stats') {
        const res = await fetch(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const stats = await res.json()
        setMessages(m => [...m, {
          role: 'assistant',
          text: `📊 Estadísticas del Dashboard\n\n👥 Usuarios totales: ${stats.totalUsers}\n📈 Nuevos hoy: ${stats.newUsersToday}\n⏱ Uptime: ${stats.uptime}\n📦 Proyectos activos: ${stats.activeProjects}\n💬 Mensajes de contacto: ${stats.totalContacts}`,
        }])
      } else if (action.type === 'update_profile') {
        const res = await fetch(`${API_URL}/auth/profile`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })
        if (!res.ok) throw new Error('Failed to update profile')
        const updated = await res.json()
        localStorage.setItem('user', JSON.stringify(updated))
        addToast('Profile updated', 'success')
        setMessages(m => [...m, { role: 'assistant', text: `✅ Perfil actualizado: ${updated.name} <${updated.email}>` }])
      } else if (action.type === 'change_password') {
        const res = await fetch(`${API_URL}/auth/profile`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPassword: params.currentPassword, newPassword: params.newPassword }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.message || 'Failed to change password')
        }
        addToast('Password changed successfully', 'success')
        setMessages(m => [...m, { role: 'assistant', text: '✅ Contraseña cambiada exitosamente.' }])
      } else if (action.type === 'send_notification') {
        const res = await fetch(`${API_URL}/notifications`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: params.message }),
        })
        if (!res.ok) throw new Error('Failed to create notification')
        addToast('Notification created', 'success')
        setMessages(m => [...m, { role: 'assistant', text: `✅ Notificación creada: "${params.message}"` }])
      } else if (action.type === 'generate_report') {
        const res = await fetch(`${API_URL}/ai/generate`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: params.prompt, type: params.type || 'report' }),
        })
        const data = await res.json()
        setMessages(m => [...m, { role: 'assistant', text: `📄 Reporte generado:\n\n${data.text}` }])
      }
      setActionForm(null)
    } catch (e) {
      addToast(e.message, 'error')
      setMessages(m => [...m, { role: 'assistant', text: `❌ Error: ${e.message}` }])
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
            <a href="/ai/agent" className="sidebar-link active">
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
            <a href="/contact" className="sidebar-link">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z"/></svg>
              Contact
            </a>
          </nav>
        </aside>

        <main className="dash-main agent-main">
          <h1>Nova</h1>
          <p className="dash-subtitle">Nova, el agente conversacional inteligente. Puede ejecutar acciones en tu nombre.</p>

          <div className="agent-layout">
            <div className="agent-chat">
              <div className="agent-messages">
                {messages.map((m, i) => (
                  <div key={i} className={`agent-msg ${m.role}`}>
                    <div className="agent-bubble">{m.text}</div>
                  </div>
                ))}
                {loading && (
                  <div className="agent-msg assistant">
                    <div className="agent-bubble typing"><span></span><span></span><span></span></div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
              <form className="agent-input" onSubmit={handleSend}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ej: Crea un usuario llamado Juan..." disabled={loading} />
                <button type="submit" disabled={loading || !input.trim()}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
              </form>
            </div>

            {actionForm && (
              <div className="agent-action-panel">
                <h3>Ejecutar acción: {actionForm.type}</h3>
                <ActionForm action={actionForm} onSubmit={(params) => executeAction(actionForm, params)} onCancel={() => setActionForm(null)} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function ActionForm({ action, onSubmit, onCancel }) {
  const [params, setParams] = useState(action.params || {})

  if (action.type === 'create_user') {
    return (
      <div className="action-form">
        <div className="form-group">
          <label>Name</label>
          <input value={params.name || ''} onChange={e => setParams(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={params.email || ''} onChange={e => setParams(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={params.password || ''} onChange={e => setParams(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" />
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => onSubmit(params)}>Create user</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  if (action.type === 'contact_message') {
    return (
      <div className="action-form">
        <div className="form-group">
          <label>Your name</label>
          <input value={params.name || ''} onChange={e => setParams(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={params.email || ''} onChange={e => setParams(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea value={params.message || ''} onChange={e => setParams(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Your message" />
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => onSubmit(params)}>Send message</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  if (action.type === 'get_stats') {
    return (
      <div className="action-form">
        <p>📊 Se consultarán las estadísticas del dashboard.</p>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => onSubmit(params)}>Get stats</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  if (action.type === 'update_profile') {
    return (
      <div className="action-form">
        <div className="form-group">
          <label>Name</label>
          <input value={params.name || ''} onChange={e => setParams(f => ({ ...f, name: e.target.value }))} placeholder="New name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={params.email || ''} onChange={e => setParams(f => ({ ...f, email: e.target.value }))} placeholder="new@email.com" />
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => onSubmit(params)}>Update profile</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  if (action.type === 'change_password') {
    return (
      <div className="action-form">
        <div className="form-group">
          <label>Current password</label>
          <input type="password" value={params.currentPassword || ''} onChange={e => setParams(f => ({ ...f, currentPassword: e.target.value }))} placeholder="Current password" />
        </div>
        <div className="form-group">
          <label>New password</label>
          <input type="password" value={params.newPassword || ''} onChange={e => setParams(f => ({ ...f, newPassword: e.target.value }))} placeholder="New password (min 6)" />
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => onSubmit(params)}>Change password</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  if (action.type === 'send_notification') {
    return (
      <div className="action-form">
        <div className="form-group">
          <label>Notification message</label>
          <textarea value={params.message || ''} onChange={e => setParams(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Your notification message" />
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => onSubmit(params)}>Send notification</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  if (action.type === 'generate_report') {
    return (
      <div className="action-form">
        <div className="form-group">
          <label>Type</label>
          <select value={params.type || 'report'} onChange={e => setParams(f => ({ ...f, type: e.target.value }))} style={{ width:'100%', padding:'8px 12px', border:'1px solid var(--outline)', borderRadius:'var(--radius-sm)', fontSize:'14px', fontFamily:'inherit', background:'var(--surface)', color:'var(--on-surface)' }}>
            <option value="report">Report</option>
            <option value="insight">Insight</option>
            <option value="description">Description</option>
          </select>
        </div>
        <div className="form-group">
          <label>Prompt / Topic</label>
          <textarea value={params.prompt || ''} onChange={e => setParams(f => ({ ...f, prompt: e.target.value }))} rows={3} placeholder="What do you want to generate?" />
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => onSubmit(params)}>Generate</button>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return <p>Complete the form to execute this action.</p>
}
