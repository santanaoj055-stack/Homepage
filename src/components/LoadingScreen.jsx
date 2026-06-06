export default function LoadingScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--on-surface-variant)' }}>Loading...</p>
    </div>
  )
}
