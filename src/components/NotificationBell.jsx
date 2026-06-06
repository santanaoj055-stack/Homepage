import { useState, useEffect, useRef } from 'react'
import API_URL from '../api'

export default function NotificationBell() {
  const token = localStorage.getItem('token')
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!token) return
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function fetchNotifications() {
    try {
      const [notifRes, countRes] = await Promise.all([
        fetch(`${API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/notifications/unread/count`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (notifRes.ok) setNotifications(await notifRes.json())
      if (countRes.ok) {
        const { count } = await countRes.json()
        setUnread(count)
      }
    } catch {}
  }

  async function markAsRead(id) {
    await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchNotifications()
  }

  async function markAllAsRead() {
    await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchNotifications()
  }

  async function remove(id) {
    await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchNotifications()
  }

  const typeIcons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }

  return (
    <div className="notif-container" ref={panelRef}>
      <button className="notif-bell" onClick={() => setOpen(!open)} aria-label="Notifications">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && <span className="notif-badge">{unread > 99 ? '99+' : unread}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-panel-header">
            <h3>Notifications</h3>
            {unread > 0 && (
              <button className="btn-text notif-mark-all" onClick={markAllAsRead}>Mark all read</button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">No notifications yet.</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.isRead ? '' : 'unread'}`} onClick={() => !n.isRead && markAsRead(n.id)}>
                  <span className="notif-icon">{typeIcons[n.type] || '💡'}</span>
                  <div className="notif-body">
                    <p>{n.message}</p>
                    <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <button className="notif-dismiss" onClick={(e) => { e.stopPropagation(); remove(n.id) }} title="Dismiss">
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M10 8.586L6.05 4.636 4.636 6.05 8.586 10l-3.95 3.95 1.414 1.414L10 11.414l3.95 3.95 1.414-1.414L11.414 10l3.95-3.95-1.414-1.414L10 8.586z"/></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
