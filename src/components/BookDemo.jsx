import { useState, useEffect } from 'react'
import API_URL from '../api'
import { useToast } from './Toast'

export default function BookDemo() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [loading, setLoading] = useState(false)
  const addToast = useToast()

  useEffect(() => {
    if (!open) return
    const handleScroll = () => { if (window.scrollY > 50) setOpen(false) }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [open])

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `[Demo Request] Company: ${form.company}`,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      addToast('Demo request sent! We\'ll contact you shortly.', 'success')
      setOpen(false)
      setForm({ name: '', email: '', company: '' })
    } catch {
      addToast('Error sending request. Try again later.', 'error')
    }
    setLoading(false)
  }

  return (
    <>
      <button className="btn btn-outline btn-lg" onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); setOpen(true) }}>Book a demo</button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-dark" onClick={e => e.stopPropagation()}>
            <button className="modal-dark-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l8 8M14 6l-8 8"/></svg>
            </button>

            <div className="modal-dark-icon">
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10h10"/>
                <path d="M10 5l5 5-5 5"/>
              </svg>
            </div>

            <h2 className="modal-dark-title">Book a demo</h2>
            <p className="modal-dark-sub">Discover how Homepage can transform your business.</p>

            <div className="modal-dark-divider" />

            <form onSubmit={handleSubmit}>
              <div className="modal-dark-field">
                <label>Name</label>
                <div className="modal-dark-input-wrap">
                  <svg className="modal-dark-input-icon" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0"/></svg>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your name" />
                </div>
              </div>
              <div className="modal-dark-field">
                <label>Email</label>
                <div className="modal-dark-input-wrap">
                  <svg className="modal-dark-input-icon" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 4H2a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1z"/><polyline points="2 5 10 11 18 5"/></svg>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@company.com" />
                </div>
              </div>
              <div className="modal-dark-field">
                <label>Company</label>
                <div className="modal-dark-input-wrap">
                  <svg className="modal-dark-input-icon" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="8" width="18" height="11" rx="1"/><path d="M5 5V2a1 1 0 011-1h8a1 1 0 011 1v3"/></svg>
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Your company" />
                </div>
              </div>
              <button type="submit" className="modal-dark-btn" disabled={loading}>
                {loading ? (
                  <><span className="modal-dark-spinner" /> Sending...</>
                ) : (
                  'Book a demo'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
