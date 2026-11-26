export const levelRows = (panel: HTMLElement | null, level: string): HTMLElement[] => [
  ...(panel?.querySelectorAll<HTMLElement>(`[data-level="${level}"] [data-filter-row]`) ?? [])
]

export const moveRowFocus = (event: KeyboardEvent, rows: () => HTMLElement[]): void => {
  const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
  const items = step ? rows() : []
  if (!items.length) return
  event.preventDefault()
  const index = items.indexOf(event.target as HTMLElement)
  items[(index + step + items.length) % items.length]?.focus()
}

export const hasFocusIn = (...elements: (HTMLElement | null | undefined)[]): boolean => {
  const active = globalThis.document?.activeElement ?? null
  return Boolean(active && elements.some((element) => element?.contains(active)))
}

export const returnFocus = (origin: HTMLElement | null, trigger: HTMLElement | null): void => {
  const target = origin?.isConnected
    ? origin
    : (trigger?.querySelector<HTMLElement>('button') ?? trigger)
  target?.focus({ preventScroll: true })
}
