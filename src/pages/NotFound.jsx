import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '96px', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '8px' }}>404</h1>
      <h2 style={{ marginBottom: '12px' }}>Page not found</h2>
      <p style={{ color: 'var(--on-surface-variant)', marginBottom: '32px', maxWidth: '400px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">Back to home</Link>
    </div>
  )
}
