import { textsData } from '@aziontech/theme/texts'
const spacingsData = {
  'spacing-xxl': { _: '2rem', sm: '4rem', xl: '6rem' },
  'spacing-xl': { _: '1.5rem', sm: '2rem', xl: '3rem' },
  'spacing-lg': { _: '1rem', sm: '1.5rem' },
  'spacing-md': { _: '1rem' },
  'spacing-sm': { _: '0.75rem' },
  'spacing-xs': { _: '0.5rem' },
  'spacing-xxs': { _: '0.25rem' }
}

export const breakpoints = {
  _: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export const breakpointRows = [
  { key: '_', label: 'Base' },
  { key: 'sm', label: 'sm >=640' },
  { key: 'md', label: 'md >=768' },
  { key: 'lg', label: 'lg >=1024' },
  { key: 'xl', label: 'xl >=1280' },
  { key: '2xl', label: '2xl >=1536' }
]

const orderedKeys = ['_', 'sm', 'md', 'lg', 'xl', '2xl']

export function getActiveBreakpoint(width) {
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return '_'
}

export function resolveResponsiveValue(value, width) {
  if (typeof value !== 'object' || value === null) return value

  const active = getActiveBreakpoint(width)
  const activeIndex = orderedKeys.indexOf(active)

  for (let i = activeIndex; i >= 0; i -= 1) {
    const key = orderedKeys[i]
    if (value[key] !== undefined) return value[key]
  }

  return value._
}

export function buildSpacingTokens() {
  return Object.entries(spacingsData).map(([name, responsive]) => ({
    name,
    label: name.replace('spacing-', '').toUpperCase(),
    cssVar: `--${name}`,
    usageExample: `var(--${name})`,
    description: `Responsive spacing token ${name}.`,
    responsive
  }))
}

export const spacingTokens = buildSpacingTokens()
export const spacingGroups = [
  {
    category: 'semantic',
    label: 'Semantic spacing tokens',
    description: 'Spacing values mapped to responsive breakpoints.',
    tokens: spacingTokens
  }
]

export function buildTypographyTokens() {
  return Object.entries(textsData).map(([name, values]) => ({
    name,
    label: name,
    usageClass: `.${name}`,
    sample: 'The quick brown fox jumps over the lazy dog.',
    description: `Semantic text token ${name}.`,
    fontFamily: values.fontFamily ?? 'var(--font-family, inherit)',
    responsive:
      typeof values.fontSize === 'object'
        ? Object.fromEntries(
            Object.entries(values.fontSize).map(([key, fontSize]) => [
              key,
              { fontSize, lineHeight: values.lineHeight ?? 'normal' }
            ])
          )
        : {
            _: { fontSize: values.fontSize ?? 'inherit', lineHeight: values.lineHeight ?? 'normal' }
          }
  }))
}

export const typographyTokens = buildTypographyTokens()
export const typographyGroups = [
  {
    category: 'semantic',
    label: 'Semantic text tokens',
    description: 'Typography classes generated from theme text tokens.',
    tokens: typographyTokens
  }
]
