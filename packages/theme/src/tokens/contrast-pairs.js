export const CONTRAST_TARGETS = { body: 75, text: 60, icon: 45, mark: 30, border: 15 }

export const CONTRAST_SURFACES = ['--bg-canvas', '--bg-surface', '--bg-surface-raised']

const FILLS = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger', 'info']
const STATUS = ['success', 'warning', 'danger', 'info']

export const CONTRAST_PAIRS = [
  ...CONTRAST_SURFACES.map((bg) => ['body', '--text-default', bg]),
  ...['--text-muted', '--text-brand', '--text-link', '--text-link-hover', '--text-danger'].flatMap(
    (fg) => CONTRAST_SURFACES.map((bg) => ['text', fg, bg])
  ),
  ...FILLS.map((fill) => ['text', `--${fill}-foreground`, `--${fill}`]),
  ['text', '--brand-blue-foreground', '--brand-blue'],
  ['text', '--text-contrast', '--bg-contrast'],
  ['text', '--chart-tooltip-text', '--chart-tooltip-bg'],
  ['text', '--chart-tooltip-muted', '--chart-tooltip-bg'],
  ...STATUS.flatMap((s) => CONTRAST_SURFACES.map((bg) => ['icon', `--${s}-foreground`, bg])),
  ...['success', 'warning', 'danger'].flatMap((s) =>
    CONTRAST_SURFACES.map((bg) => ['icon', `--${s}-mark`, bg])
  ),
  ...[
    ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `--chart-series-${n}`),
    '--chart-series-other',
    ...STATUS.map((s) => `--chart-status-${s}`),
    ...['negative', 'negative-2', 'negative-3', 'positive-3', 'positive-2', 'positive'].map(
      (step) => `--chart-diverging-${step}`
    ),
    ...['critical', 'high', 'medium', 'low'].map((l) => `--severity-${l}`),
    '--primary',
    '--accent',
    '--brand-blue',
    '--border-selected',
    '--ring-color'
  ].flatMap((fg) => CONTRAST_SURFACES.map((bg) => ['mark', fg, bg])),
  ...[
    '--border-default',
    '--border-muted',
    '--border-input',
    '--border-strong',
    '--danger-border'
  ].flatMap((fg) => CONTRAST_SURFACES.map((bg) => ['border', fg, bg]))
]

const READING = new Set(['body', 'text'])

const FALLBACK = { foreground: '--text-default', background: '--bg-surface' }

/**
 * @param {string} name
 * @returns {{ foreground: string, background: string, fill: 'background' | 'foreground' | 'swatch' }}
 */
export function previewPair(name) {
  const reading = CONTRAST_PAIRS.filter(([role]) => READING.has(role))
  const asGround = reading.find(([, , bg]) => bg === name)
  if (asGround) return { foreground: asGround[1], background: name, fill: 'background' }
  const asText = reading.filter(([, fg]) => fg === name)
  if (asText.length) {
    const ground = asText.find(([, , bg]) => bg === FALLBACK.background) ?? asText[0]
    return { foreground: name, background: ground[2], fill: 'foreground' }
  }
  return { ...FALLBACK, fill: 'swatch' }
}
