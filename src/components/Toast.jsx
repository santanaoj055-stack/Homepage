import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(t => t.id !== id)), duration)
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">
              {t.type === 'success' && (
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l6.59-6.59L17 7l-8 8z"/></svg>
              )}
              {t.type === 'error' && (
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/></svg>
              )}
              {t.type === 'info' && (
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9V9h2v6zm0-8H9V5h2v2z"/></svg>
              )}
            </span>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => setToasts(t => t.filter(x => x.id !== t.id))}>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M10 8.586L6.05 4.636 4.636 6.05 8.586 10l-3.95 3.95 1.414 1.414L10 11.414l3.95 3.95 1.414-1.414L11.414 10l3.95-3.95-1.414-1.414L10 8.586z"/></svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
