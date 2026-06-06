import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</h1>
          <h2 style={{ marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px', maxWidth: '500px' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
