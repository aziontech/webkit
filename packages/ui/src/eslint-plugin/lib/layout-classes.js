export const LAYOUT_CLASS_FAMILIES = Object.freeze([
  'w-full',
  'h-full',
  'max-w-*',
  'min-w-*',
  'max-h-*',
  'min-h-*',
  'flex-1',
  'flex-auto',
  'flex-initial',
  'flex-none',
  'grow',
  'grow-*',
  'basis-*',
  'shrink-0',
  'self-*',
  'justify-self-*',
  'place-self-*',
  'order-*',
  'col-span-*',
  'col-start-*',
  'col-end-*',
  'row-span-*',
  'row-start-*',
  'row-end-*',
  'm-*',
  'mx-*',
  'my-*',
  'mt-*',
  'mb-*',
  'ms-*',
  'me-*'
])

const LAYOUT_BREAKPOINTS = Object.freeze(['sm', 'md', 'lg', 'xl', '2xl'])

const MATCHERS = LAYOUT_CLASS_FAMILIES.map((family) =>
  family.endsWith('*')
    ? (cls) => cls.startsWith(family.slice(0, -1)) && cls.length > family.length - 1
    : (cls) => cls === family
)

const BREAKPOINT = new RegExp(`^(?:${LAYOUT_BREAKPOINTS.join('|')}):`)

export function isLayoutClass(cls) {
  const token = String(cls || '')
    .trim()
    .replace(BREAKPOINT, '')
  return token.length > 0 && MATCHERS.some((match) => match(token))
}

export function nonLayoutClasses(classString) {
  return String(classString || '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((cls) => !isLayoutClass(cls))
}
