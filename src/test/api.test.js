import { describe, it, expect, beforeEach } from 'vitest'

describe('API_URL', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns localhost URL for localhost hostname', async () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
    })
    const mod = await import('../api')
    expect(mod.default).toBe('http://localhost:3000')
  })

  it('returns LAN URL for other hostnames', async () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: '192.168.1.100' },
      writable: true,
    })
    const mod = await import('../api')
    expect(mod.default).toBe('http://192.168.1.100:3000')
  })
})
