import { shape } from './primitives/shape/shape.js'
import { accent } from './semantic/accent.js'
import { background } from './semantic/background.js'
import { border } from './semantic/border.js'
import { chart } from './semantic/chart.js'
import { code } from './semantic/code.js'
import { codeSyntax } from './semantic/code-syntax.js'
import { danger } from './semantic/danger.js'
import { illustration } from './semantic/illustration.js'
import { info } from './semantic/info.js'
import { layout } from './semantic/layout.js'
import { primary } from './semantic/primary.js'
import { ring } from './semantic/ring.js'
import { secondary } from './semantic/secondary.js'
import { severity } from './semantic/severity.js'
import { spacing } from './semantic/spacing.js'
import { success } from './semantic/success.js'
import { text } from './semantic/text.js'
import { typography } from './semantic/typography.js'
import { warning } from './semantic/warning.js'
import { zIndex } from './semantic/z-index.js'
import { compileThemeCssVars, compileThemeVars } from './theme-colors.js'
import { tokenPurpose } from './token-purpose.js'

const TOKEN_EXPORT_VERSION = 1

const COLOR_GROUPS = {
  primary,
  secondary,
  accent,
  background,
  border,
  text,
  ring,
  'code-syntax': codeSyntax,
  success,
  warning,
  danger,
  info,
  illustration,
  chart,
  severity
}

const VALUE_GROUPS = {
  spacing,
  layout,
  'z-index': zIndex,
  code,
  shape
}

const kebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

const splitResponsive = (value) => {
  if (value === null || typeof value !== 'object') return { base: String(value), breakpoints: {} }
  const { _: base, ...rest } = value
  return {
    base: base == null ? null : String(base),
    breakpoints: Object.fromEntries(Object.entries(rest).map(([bp, v]) => [bp, String(v)]))
  }
}

const aliasName = (value) => {
  const m = /^var\((--[a-z0-9-]+)\)$/.exec(String(value))
  return m ? m[1] : null
}

const colorTokens = () => {
  const resolved = compileThemeVars()
  const css = compileThemeCssVars()
  const out = []
  for (const [group, source] of Object.entries(COLOR_GROUPS)) {
    for (const key of Object.keys(source.light)) {
      const name = `--${key}`
      const entry = {
        name,
        group,
        type: 'color',
        light: resolved.light[name],
        dark: resolved.dark[name],
        purpose: tokenPurpose[name] ?? null
      }
      const alias = {}
      for (const variant of ['light', 'dark']) {
        const target = aliasName(css[variant][name])
        if (target) alias[variant] = target
      }
      if (Object.keys(alias).length) entry.alias = alias
      out.push(entry)
    }
  }
  return out
}

const valueTokens = () => {
  const out = []
  for (const [group, source] of Object.entries(VALUE_GROUPS)) {
    for (const [key, raw] of Object.entries(source)) {
      const name = `--${key}`
      const { base, breakpoints } = splitResponsive(raw)
      const entry = {
        name,
        group,
        type: group === 'z-index' ? 'number' : 'length',
        value: base,
        purpose: tokenPurpose[name] ?? null
      }
      if (Object.keys(breakpoints).length) entry.breakpoints = breakpoints
      out.push(entry)
    }
  }
  return out
}

const typographyTokens = () =>
  Object.entries(typography).map(([name, bundle]) => {
    const value = {}
    const breakpoints = {}
    for (const [prop, raw] of Object.entries(bundle)) {
      if (prop === 'states' || prop === 'fontSizeFit') continue
      const { base, breakpoints: steps } = splitResponsive(raw)
      if (base != null) value[kebab(prop)] = base
      for (const [bp, v] of Object.entries(steps)) (breakpoints[bp] ||= {})[kebab(prop)] = v
    }
    const entry = {
      name,
      group: 'typography',
      type: 'typography',
      value,
      purpose: tokenPurpose[name] ?? null
    }
    if (Object.keys(breakpoints).length) entry.breakpoints = breakpoints
    return entry
  })

export const buildTokenExport = () => ({
  version: TOKEN_EXPORT_VERSION,
  themes: ['light', 'dark'],
  tokens: [...colorTokens(), ...valueTokens(), ...typographyTokens()]
})
