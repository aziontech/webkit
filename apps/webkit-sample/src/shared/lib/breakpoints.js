const PROBE_CLASS = {
  sm: 'hidden sm:block',
  md: 'hidden md:block',
  lg: 'hidden lg:block',
  xl: 'hidden xl:block',
  '2xl': 'hidden 2xl:block'
}

const queries = new Map()

const createQuery = (name) => {
  const probe = document.createElement('span')
  probe.className = PROBE_CLASS[name]
  probe.setAttribute('aria-hidden', 'true')
  document.body.append(probe)

  const listeners = new Set()
  const read = () => getComputedStyle(probe).display !== 'none'
  let last = read()

  globalThis.addEventListener('resize', () => {
    const next = read()
    if (next === last) return
    last = next
    listeners.forEach((listener) => listener({ matches: next }))
  })

  return {
    get matches() {
      return read()
    },
    addEventListener: (type, listener) => listeners.add(listener),
    removeEventListener: (type, listener) => listeners.delete(listener)
  }
}

export const minWidthQuery = (name) => {
  if (typeof document === 'undefined' || !document.body || !PROBE_CLASS[name]) return null
  if (!queries.has(name)) queries.set(name, createQuery(name))
  return queries.get(name)
}

export const tokenPx = (token) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim()
  const size = Number.parseFloat(value)
  if (!Number.isFinite(size)) return 0
  if (!value.endsWith('rem')) return size
  return size * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
}
