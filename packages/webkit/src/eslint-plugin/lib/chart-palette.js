export const CHART_PALETTE_VARIABLES = Object.freeze([
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `--chart-series-${n}`),
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => `--chart-sequential-${n}`),
  '--chart-diverging-negative',
  '--chart-diverging-negative-2',
  '--chart-diverging-negative-3',
  '--chart-diverging-neutral',
  '--chart-diverging-positive-3',
  '--chart-diverging-positive-2',
  '--chart-diverging-positive'
])

const PALETTE = new Set(CHART_PALETTE_VARIABLES)

export function isChartPaletteVariable(name) {
  return PALETTE.has(String(name || '').trim())
}

export function isChartPaletteClass(cls) {
  const m = /^\[(--[a-z0-9-]+):[^\]\s]+\]$/.exec(String(cls || '').trim())
  return Boolean(m && PALETTE.has(m[1]))
}

export function isChartPaletteStyle(styleText) {
  const declarations = String(styleText || '')
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
  return (
    declarations.length > 0 &&
    declarations.every((d) => {
      const colon = d.indexOf(':')
      return colon > 0 && isChartPaletteVariable(d.slice(0, colon)) && d.slice(colon + 1).trim()
    })
  )
}

export function isChartPaletteObject(node) {
  if (!node || node.type !== 'ObjectExpression' || !node.properties.length) return false
  return node.properties.every((p) => {
    if (p.type !== 'Property' || p.kind !== 'init') return false
    const key = p.key
    if (key.type === 'Literal' && typeof key.value === 'string')
      return isChartPaletteVariable(key.value)
    if (key.type === 'TemplateLiteral' && key.expressions.length === 0)
      return isChartPaletteVariable(key.quasis[0]?.value?.cooked)
    return false
  })
}
