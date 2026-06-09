import { useState } from 'react'
import API_URL from '../api'
import { useToast } from './Toast'

export default function BookDemo() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [loading, setLoading] = useState(false)
  const addToast = useToast()

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
          message: `[Demo Request] Company: ${form.company} | ${form.message}`,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      addToast('Demo request sent! We\'ll contact you shortly.', 'success')
      setOpen(false)
      setForm({ name: '', email: '', company: '', message: '' })
    } catch {
      addToast('Error sending request. Try again later.', 'error')
    }
    setLoading(false)
  }

  return (
    <>
      <button className="btn btn-outline btn-lg" onClick={() => setOpen(true)}>Book a demo</button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l8 8M14 6l-8 8"/></svg>
            </button>

            <div className="modal-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>

            <h2>Book a demo</h2>
            <p className="modal-subtitle">Discover how Homepage can transform your business.</p>

            <div className="modal-divider" />

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <div className="input-wrap">
                  <svg className="input-icon" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0"/></svg>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your name" />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrap">
                  <svg className="input-icon" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 4H2a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1z"/><polyline points="2 5 10 11 18 5"/></svg>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@company.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Company</label>
                <div className="input-wrap">
                  <svg className="input-icon" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="8" width="18" height="11" rx="1"/><path d="M5 5V2a1 1 0 011-1h8a1 1 0 011 1v3"/><line x1="7" y1="12" x2="13" y2="12"/><line x1="7" y1="15" x2="10" y2="15"/></svg>
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company name" />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <div className="input-wrap">
                  <svg className="input-icon input-icon-top" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 2H3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1z"/><line x1="5" y1="6" x2="15" y2="6"/><line x1="5" y1="9" x2="12" y2="9"/></svg>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Tell us about your project..." />
                </div>
              </div>
              <button type="submit" className="modal-btn" disabled={loading}>
                {loading ? (
                  <><span className="modal-spinner" /> Sending...</>
                ) : (
                  'Send request'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
