/**
 * Resolve token refs to CSS variable map.
 */

import { assertResolvedRefs, isTokenRef } from './refs.js'

const getValueByPath = (obj, path) =>
  path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key]
    }
    return undefined
  }, obj)

const flattenToCssVars = (obj, prefix = [], refKeys = null) => {
  const result = {}
  Object.entries(obj).forEach(([key, value]) => {
    const nextPath = [...prefix, key]
    if (value && typeof value === 'object' && !Array.isArray(value) && !isTokenRef(value)) {
      Object.assign(result, flattenToCssVars(value, nextPath, refKeys))
      return
    }
    if (isTokenRef(value)) {
      const name = `--${nextPath.join('-')}`
      refKeys?.add(name)
      result[name] = value.__ref
      return
    }
    if (typeof value === 'string' || typeof value === 'number') {
      result[`--${nextPath.join('-')}`] = String(value)
    }
  })
  return result
}

export const resolveRefsToCssVars = (tokens) => {
  const baseForResolve = {
    primitives: tokens.primitives,
    surfacePrimitives: tokens.surfacePrimitives,
    brandPrimitives: tokens.brandPrimitives
  }

  const baseForVars = { primitives: tokens.primitives, surfacePrimitives: tokens.surfacePrimitives }

  const lightSemantic = {
    text: tokens.textSemantic.light,
    background: tokens.backgroundSemantic.light,
    border: tokens.borderSemantic.light
  }
  const darkSemantic = {
    text: tokens.textSemantic.dark,
    background: tokens.backgroundSemantic.dark,
    border: tokens.borderSemantic.dark
  }

  const resolveBrandRef = (ref) => {
    if (ref.startsWith('brand.surfaces.surface-')) {
      const shade = ref.replace('brand.surfaces.surface-', '')
      const resolved = getValueByPath(baseForResolve, `surfacePrimitives.surface.${shade}`)
      return typeof resolved === 'string' || typeof resolved === 'number' ? String(resolved) : null
    }
    if (ref.startsWith('brand.primary.primary-')) {
      const shade = ref.replace('brand.primary.primary-', '')
      const resolved = getValueByPath(baseForResolve, `brandPrimitives.primary.${shade}`)
      return typeof resolved === 'string' || typeof resolved === 'number' ? String(resolved) : null
    }
    if (ref.startsWith('brand.accent.accent-')) {
      const shade = ref.replace('brand.accent.accent-', '')
      const resolved = getValueByPath(baseForResolve, `brandPrimitives.accent.${shade}`)
      return typeof resolved === 'string' || typeof resolved === 'number' ? String(resolved) : null
    }
    if (ref.startsWith('brand.absolute.')) {
      const name = ref.replace('brand.absolute.', '')
      const resolved = getValueByPath(baseForResolve, `brandPrimitives.absolute.${name}`)
      return typeof resolved === 'string' || typeof resolved === 'number' ? String(resolved) : null
    }
    return null
  }

  const resolveSemantic = (semantic, variant, unresolved) => {
    const refKeys = new Set()
    const flattened = flattenToCssVars(semantic, [], refKeys)
    return Object.fromEntries(
      Object.entries(flattened).map(([key, value]) => {
        if (value.startsWith('brand.')) {
          const resolved = resolveBrandRef(value)
          if (resolved == null) unresolved.push(`[${variant}] ${key} → ${value}`)
          return [key, resolved ?? value]
        }
        if (value.startsWith('primitives.') || value.startsWith('surfacePrimitives.')) {
          const resolved = getValueByPath(baseForResolve, value)
          const ok = typeof resolved === 'string' || typeof resolved === 'number'
          if (!ok) unresolved.push(`[${variant}] ${key} → ${value}`)
          return [key, ok ? String(resolved) : value]
        }
        // A ref whose prefix no branch above understands is unresolved too.
        if (refKeys.has(key)) unresolved.push(`[${variant}] ${key} → ${value}`)
        return [key, value]
      })
    )
  }

  const unresolved = []
  const baseRefKeys = new Set()
  const baseVars = flattenToCssVars(baseForVars, [], baseRefKeys)
  // Nothing resolves refs in the base tree, so any ref there is a miss.
  baseRefKeys.forEach((name) => unresolved.push(`${name} → ${baseVars[name]}`))

  const result = {
    light: {
      ...baseVars,
      ...resolveSemantic(lightSemantic, 'light', unresolved)
    },
    dark: {
      ...baseVars,
      ...resolveSemantic(darkSemantic, 'dark', unresolved)
    }
  }
  assertResolvedRefs('semantic colors', unresolved)
  return result
}
