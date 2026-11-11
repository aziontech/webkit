const UTILITY_MAP = [
  [/^(-?)ml-/, '$1ms-'],
  [/^(-?)mr-/, '$1me-'],
  [/^pl-/, 'ps-'],
  [/^pr-/, 'pe-'],
  [/^(-?)scroll-ml-/, '$1scroll-ms-'],
  [/^(-?)scroll-mr-/, '$1scroll-me-'],
  [/^scroll-pl-/, 'scroll-ps-'],
  [/^scroll-pr-/, 'scroll-pe-'],
  [/^(-?)left-/, '$1start-'],
  [/^(-?)right-/, '$1end-'],
  [/^text-left$/, 'text-start'],
  [/^text-right$/, 'text-end'],
  [/^float-left$/, 'float-start'],
  [/^float-right$/, 'float-end'],
  [/^clear-left$/, 'clear-start'],
  [/^clear-right$/, 'clear-end'],
  [/^border-l(?=$|-)/, 'border-s'],
  [/^border-r(?=$|-)/, 'border-e'],
  [/^rounded-tl(?=$|-)/, 'rounded-ss'],
  [/^rounded-tr(?=$|-)/, 'rounded-se'],
  [/^rounded-bl(?=$|-)/, 'rounded-es'],
  [/^rounded-br(?=$|-)/, 'rounded-ee'],
  [/^rounded-l(?=$|-)/, 'rounded-s'],
  [/^rounded-r(?=$|-)/, 'rounded-e']
]

const CENTERING_OFFSET = /^(-?)(left|right)-1\/2$/
const CENTERING_TRANSLATE = /(?:^|\s|:)!?-?translate-x-1\/2!?(?=$|\s)/

function splitVariants(token) {
  let depth = 0
  let cut = -1
  for (let i = 0; i < token.length; i++) {
    const ch = token[i]
    if (ch === '[' || ch === '(') depth++
    else if (ch === ']' || ch === ')') depth--
    else if (ch === ':' && depth === 0) cut = i
  }
  return { variants: token.slice(0, cut + 1), utility: token.slice(cut + 1) }
}

export function logicalClass(token) {
  const { variants, utility } = splitVariants(String(token || ''))
  const lead = utility.startsWith('!') ? '!' : ''
  const trail = !lead && utility.endsWith('!') ? '!' : ''
  const core = utility.slice(lead.length, utility.length - trail.length)
  if (!core) return null
  for (const [pattern, replacement] of UTILITY_MAP) {
    if (pattern.test(core)) return `${variants}${lead}${core.replace(pattern, replacement)}${trail}`
  }
  return null
}

export function physicalDirectionClasses(classString) {
  const text = String(classString || '')
  const centered = CENTERING_TRANSLATE.test(text)
  const hits = []
  for (const token of text.split(/\s+/)) {
    if (!token) continue
    const fix = logicalClass(token)
    if (!fix) continue
    const { utility } = splitVariants(token)
    if (centered && CENTERING_OFFSET.test(utility.replace(/!/g, ''))) continue
    hits.push({ cls: token, fix })
  }
  return hits
}

export function toLogicalClassString(classString) {
  const text = String(classString || '')
  const hits = new Map(physicalDirectionClasses(text).map((h) => [h.cls, h.fix]))
  if (!hits.size) return text
  return text.replace(/\S+/g, (token) => hits.get(token) ?? token)
}
