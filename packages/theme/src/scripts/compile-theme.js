/**
 * Compile semantic theme tokens into a light/dark CSS variables stylesheet.
 *
 * Resolves `tokenRef(...)` aliases from `tokens/theme/*` (primary, secondary,
 * accent, surfaces, background, border, text, ring, code-sintax, feedback/*)
 * against the
 * primitives + brand + (pre-resolved) surfaces. Emits two blocks (light + dark).
 */

import {
  brandPrimitives,
  primitives as colorPrimitives
} from '../tokens/primitives/colors/colors.js'
import { accent } from '../tokens/theme/accent.js'
import { background } from '../tokens/theme/background.js'
import { codeSintax } from '../tokens/theme/code-sintax.js'
import { border } from '../tokens/theme/border.js'
import { danger } from '../tokens/theme/feedback/danger.js'
import { info } from '../tokens/theme/feedback/info.js'
import { success } from '../tokens/theme/feedback/success.js'
import { warning } from '../tokens/theme/feedback/warning.js'
import { primary } from '../tokens/theme/primary.js'
import { ring } from '../tokens/theme/ring.js'
import { secondary } from '../tokens/theme/secondary.js'
import { surfaces } from '../tokens/theme/surfaces.js'
import { text } from '../tokens/theme/text.js'
import { isTokenRef } from './refs.js'

const VARIANTS = ['light', 'dark']

const getValueByPath = (obj, path) =>
  path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) return acc[key]
    return undefined
  }, obj)

const resolveRef = (ref, surfacesResolved) => {
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
  if (ref.startsWith('theme.surfaces.')) {
    const key = ref.slice('theme.surfaces.'.length)
    return surfacesResolved[key] ?? null
  }
  return null
}

const resolveGroup = (group, surfacesResolved) => {
  const result = {}
  Object.entries(group).forEach(([key, value]) => {
    if (!isTokenRef(value)) return
    const resolved = resolveRef(value.__ref, surfacesResolved)
    if (resolved != null) result[`--${key}`] = String(resolved)
  })
  return result
}

const compileVariant = (variant) => {
  // Surfaces resolved first — other groups depend on them.
  const surfacesResolved = {}
  Object.entries(surfaces[variant]).forEach(([key, value]) => {
    if (!isTokenRef(value)) return
    const v = resolveRef(value.__ref, {})
    if (v != null) surfacesResolved[key] = String(v)
  })

  const vars = {}
  Object.entries(surfacesResolved).forEach(([k, v]) => {
    vars[`--${k}`] = v
  })

  const groups = [
    primary[variant],
    secondary[variant],
    accent[variant],
    background[variant],
    border[variant],
    text[variant],
    ring[variant],
    codeSintax[variant],
    success[variant],
    warning[variant],
    danger[variant],
    info[variant]
  ]
  groups.forEach((g) => Object.assign(vars, resolveGroup(g, surfacesResolved)))
  return vars
}

export const compileThemeVars = () =>
  Object.fromEntries(VARIANTS.map((v) => [v, compileVariant(v)]))

export const compileThemeCss = () => {
  const { light, dark } = compileThemeVars()
  const fmt = (vars) =>
    Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')
  return [
    `:root, [data-theme=light], .azion.azion-light {\n${fmt(light)}\n}`,
    `[data-theme=dark], .dark, .azion.azion-dark {\n${fmt(dark)}\n}`
  ].join('\n\n')
}

export const injectThemeCss = () => {
  const style = document.createElement('style')
  style.setAttribute('data-azion-theme', 'true')
  style.textContent = compileThemeCss()
  document.head.appendChild(style)
  return style
}
