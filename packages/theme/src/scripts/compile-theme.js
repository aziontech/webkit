import {
  brandPrimitives,
  primitives as colorPrimitives
} from '../tokens/primitives/colors/colors.js'
import { shadowDark } from '../tokens/primitives/effects/shadow.js'
import { accent } from '../tokens/theme/accent.js'
import { background } from '../tokens/theme/background.js'
import { border } from '../tokens/theme/border.js'
import { chart } from '../tokens/theme/chart.js'
import { codeSintax } from '../tokens/theme/code-sintax.js'
import { danger } from '../tokens/theme/feedback/danger.js'
import { info } from '../tokens/theme/feedback/info.js'
import { success } from '../tokens/theme/feedback/success.js'
import { warning } from '../tokens/theme/feedback/warning.js'
import { illustration } from '../tokens/theme/illustration.js'
import { primary } from '../tokens/theme/primary.js'
import { ring } from '../tokens/theme/ring.js'
import { secondary } from '../tokens/theme/secondary.js'
import { severity } from '../tokens/theme/severity.js'
import { text } from '../tokens/theme/text.js'
import { assertResolvedRefs, isTokenRef } from './refs.js'

const VARIANTS = ['light', 'dark']

const getValueByPath = (obj, path) =>
  path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) return acc[key]
    return undefined
  }, obj)

const semanticGroups = {
  primary,
  secondary,
  accent,
  background,
  border,
  text,
  ring,
  codeSintax,
  success,
  warning,
  danger,
  info
}

const resolveRef = (ref, semanticResolved = {}) => {
  if (ref.startsWith('primitives.')) {
    const v = getValueByPath(colorPrimitives, ref.slice('primitives.'.length))
    return typeof v === 'string' || typeof v === 'number' ? String(v) : null
  }
  if (ref.startsWith('brand.primary.primary-')) {
    const shade = ref.slice('brand.primary.primary-'.length)
    return brandPrimitives.primary[shade] ?? null
  }
  if (ref.startsWith('brand.accent.accent-')) {
    const shade = ref.slice('brand.accent.accent-'.length)
    return brandPrimitives.accent[shade] ?? null
  }
  if (ref.startsWith('brand.absolute.')) {
    const name = ref.slice('brand.absolute.'.length)
    return brandPrimitives.absolute[name] ?? null
  }
  if (ref.startsWith('theme.')) {
    return semanticResolved[ref.slice('theme.'.length)] ?? null
  }
  return null
}

const isAliasRef = (ref) => ref.startsWith('theme.')

const resolveGroup = (group, variant, unresolved, semanticResolved, aliases) => {
  const result = {}
  Object.entries(group).forEach(([key, value]) => {
    if (!isTokenRef(value)) return
    const resolved = resolveRef(value.__ref, semanticResolved)
    if (resolved == null) {
      unresolved.push(`[${variant}] --${key} → ${value.__ref}`)
      return
    }
    result[`--${key}`] = String(resolved)
    if (aliases && isAliasRef(value.__ref)) {
      aliases[`--${key}`] = `var(--${value.__ref.split('.').pop()})`
    }
  })
  return result
}

const compileVariant = (variant, unresolved) => {
  const vars = {}
  const aliases = {}

  const semanticResolved = {}
  Object.entries(semanticGroups).forEach(([name, group]) => {
    const resolved = resolveGroup(group[variant], variant, unresolved, semanticResolved, aliases)
    Object.assign(vars, resolved)
    Object.entries(resolved).forEach(([key, value]) => {
      semanticResolved[`${name}.${key.slice(2)}`] = value
    })
  })

  Object.assign(
    vars,
    resolveGroup(illustration[variant], variant, unresolved, semanticResolved, aliases),
    resolveGroup(chart[variant], variant, unresolved, semanticResolved, aliases),
    resolveGroup(severity[variant], variant, unresolved, semanticResolved, aliases)
  )
  return { vars, aliases }
}

const compileAll = () => {
  const unresolved = []
  const compiled = Object.fromEntries(VARIANTS.map((v) => [v, compileVariant(v, unresolved)]))
  assertResolvedRefs('semantic theme tokens', unresolved)
  return compiled
}

export const compileThemeVars = () => {
  const compiled = compileAll()
  return Object.fromEntries(VARIANTS.map((v) => [v, compiled[v].vars]))
}

const darkShadows = Object.fromEntries(
  Object.entries(shadowDark).map(([key, value]) => [`--shadow-${key}`, value])
)

export const compileThemeCssVars = () => {
  const compiled = compileAll()
  const css = Object.fromEntries(
    VARIANTS.map((v) => [v, { ...compiled[v].vars, ...compiled[v].aliases }])
  )
  Object.assign(css.dark, darkShadows)
  return css
}

const fmt = (vars, indent = '  ') =>
  Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n')

export const LIGHT_SELECTOR = ':root, [data-theme=light], .azion.azion-light'
export const DARK_SELECTOR = '[data-theme=dark], .dark, .azion.azion-dark'
export const SYSTEM_SELECTOR = '[data-theme=system]'
export const UNPINNED_ROOT = ':root:not([data-theme=light], .azion-light)'
export const LIGHT_PIN = '[data-theme=light], .azion-light'

export const compileThemeCss = () => {
  const { light, dark } = compileThemeCssVars()
  return [
    `${LIGHT_SELECTOR} {\n  color-scheme: light;\n${fmt(light)}\n}`,
    `${DARK_SELECTOR} {\n  color-scheme: dark;\n${fmt(dark)}\n}`,
    `@media (prefers-color-scheme: dark) {\n  ${UNPINNED_ROOT}, ${SYSTEM_SELECTOR} {\n    color-scheme: dark;\n${fmt(dark, '    ')}\n  }\n}`
  ].join('\n\n')
}

export const injectThemeCss = () => {
  const style = document.createElement('style')
  style.setAttribute('data-azion-theme', 'true')
  style.textContent = compileThemeCss()
  document.head.appendChild(style)
  return style
}
