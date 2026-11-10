import { RTM_PAGES, resolveReport } from '../real-time-metrics'

const STORAGE_KEY = 'webkit-sample:custom-dashboard'

const LIBRARY = Object.fromEntries(
  RTM_PAGES.flatMap((page) =>
    page.dashboards.flatMap((dashboard) =>
      dashboard.reports.map((report) => [
        `${page.id}/${dashboard.id}/${report.id}`,
        { ...report, dataset: dashboard.dataset }
      ])
    )
  )
)

export const CUSTOM_SPAN = { min: 3, max: 12 }

export const CUSTOM_HEIGHT = { min: 280, max: 720 }

export const CUSTOM_LAYOUT = [
  { id: 'applications/requests/total-requests', span: 8 },
  { id: 'waf/threats/threats-by-country-share', span: 4 },
  { id: 'applications/data-transferred/edge-cache', span: 6 },
  { id: 'functions/invocations/total-invocations', span: 6 },
  { id: 'applications/status-codes/status-5xx', span: 4 },
  { id: 'waf/threats/threats-by-family', span: 4 },
  { id: 'edge-dns/standard-queries/total-queries', span: 4 }
]

export const defaultCustomLayout = () => CUSTOM_LAYOUT.map((card) => ({ ...card }))

const clamp = (value, { min, max }) => Math.min(Math.max(Math.round(value), min), max)

const sanitize = (stored) => {
  if (!Array.isArray(stored)) return null
  const cards = stored
    .filter((card) => card && typeof card.id === 'string' && LIBRARY[card.id])
    .map((card) => ({
      id: card.id,
      span: clamp(Number(card.span) || CUSTOM_SPAN.max, CUSTOM_SPAN),
      ...(Number.isFinite(card.height) ? { height: clamp(card.height, CUSTOM_HEIGHT) } : {})
    }))
  return cards.length ? cards : null
}

export const loadCustomLayout = () => {
  try {
    return sanitize(JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY) ?? 'null'))
  } catch {
    return null
  }
}

export const saveCustomLayout = (layout) => {
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout))
  } catch {
    return
  }
}

export const clearCustomLayout = () => {
  try {
    globalThis.localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}

export const isDefaultCustomLayout = (layout) =>
  JSON.stringify(layout) === JSON.stringify(CUSTOM_LAYOUT)

export const resolveCustomCard = (id, period, { empty = false } = {}) =>
  resolveReport(LIBRARY[id], period, { empty })
