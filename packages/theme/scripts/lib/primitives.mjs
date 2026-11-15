import { animate } from '../../src/tokens/primitives/animations/animate.js'
import { ease } from '../../src/tokens/primitives/animations/ease.js'
import { borderWidth } from '../../src/tokens/primitives/border-width.js'
import { breakpoints } from '../../src/tokens/primitives/breakpoints.js'
import { primitives as colorPrimitives } from '../../src/tokens/primitives/colors/colors.js'
import { blur } from '../../src/tokens/primitives/effects/blur.js'
import { dropShadow } from '../../src/tokens/primitives/effects/drop-shadow.js'
import { insetShadow } from '../../src/tokens/primitives/effects/inset-shadow.js'
import { opacity } from '../../src/tokens/primitives/effects/opacity.js'
import { perspective } from '../../src/tokens/primitives/effects/perspective.js'
import { shadow } from '../../src/tokens/primitives/effects/shadow.js'
import { ringOffset } from '../../src/tokens/primitives/ring-offset.js'
import { aspectVideo } from '../../src/tokens/primitives/shape/aspect-video.js'
import { container } from '../../src/tokens/primitives/shape/container.js'
import { radius } from '../../src/tokens/primitives/shape/radius.js'
import { shape as shapeAliases } from '../../src/tokens/primitives/shape/shape.js'
import { size } from '../../src/tokens/primitives/shape/size.js'
import { spacing } from '../../src/tokens/primitives/shape/spacing.js'
import { fontFamily } from '../../src/tokens/primitives/typography/font-family.js'
import { fontSize } from '../../src/tokens/primitives/typography/font-size.js'
import { fontWeight } from '../../src/tokens/primitives/typography/font-weight.js'
import { leading } from '../../src/tokens/primitives/typography/leading.js'
import { tracking } from '../../src/tokens/primitives/typography/tracking.js'
import { assertResolvedRefs, isTokenRef } from '../../src/tokens/token-ref.js'

export const buildTrees = () => {
  const { brand, ...restColors } = colorPrimitives
  const color = {
    ...restColors,
    'brand-primary': brand.primary,
    'brand-accent': brand.accent,
    absolute: brand.absolute
  }

  const shape = {
    container,
    radius,
    size,
    spacing,
    'aspect-video': aspectVideo,
    ...shapeAliases
  }
  const typography = {
    font: fontFamily,
    text: fontSize,
    'font-weight': fontWeight,
    leading,
    tracking
  }
  const effects = {
    blur,
    'drop-shadow': dropShadow,
    shadow,
    'inset-shadow': insetShadow,
    opacity,
    perspective
  }
  const animations = { ease, animate }

  const refsTree = {
    color,
    breakpoint: breakpoints,
    'border-width': borderWidth,
    shape,
    typography,
    effects,
    animations,
    'ring-offset': ringOffset['ring-offset']
  }

  const varsTree = {
    color,
    breakpoint: breakpoints,
    'border-width': borderWidth,
    ...shape,
    ...typography,
    ...effects,
    ...animations,
    'ring-offset': ringOffset['ring-offset']
  }

  return { refsTree, varsTree }
}

const getValueByPath = (obj, path) =>
  path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) return acc[key]
    return undefined
  }, obj)

const resolveRef = (refPath, refsTree) => {
  const direct = getValueByPath(refsTree, refPath)
  if (typeof direct === 'string' || typeof direct === 'number') return String(direct)
  return null
}

const varNameFor = (path) => {
  const segments = path[path.length - 1] === 'DEFAULT' ? path.slice(0, -1) : path
  return `--${segments.join('-')}`
}

export const flatten = (obj, refsTree, prefix = [], unresolved = null) => {
  const result = {}
  Object.entries(obj).forEach(([key, value]) => {
    const nextPath = [...prefix, key]
    if (isTokenRef(value)) {
      const resolved = resolveRef(value.__ref, refsTree)
      if (resolved == null) unresolved?.push(`${varNameFor(nextPath)} → ${value.__ref}`)
      result[varNameFor(nextPath)] = resolved ?? value.__ref
      return
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, refsTree, nextPath, unresolved))
      return
    }
    if (typeof value === 'string' || typeof value === 'number') {
      result[varNameFor(nextPath)] = String(value)
    }
  })
  return result
}

export const compilePrimitivesVars = () => {
  const { refsTree, varsTree } = buildTrees()
  const unresolved = []
  const vars = flatten(varsTree, refsTree, [], unresolved)
  assertResolvedRefs('primitives', unresolved)
  return vars
}

export const compilePrimitivesCss = () => {
  const vars = compilePrimitivesVars()
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')
  return `:root, [data-theme=light] {\n${body}\n}`
}

export const injectPrimitivesCss = () => {
  const style = document.createElement('style')
  style.setAttribute('data-azion-primitives', 'true')
  style.textContent = compilePrimitivesCss()
  document.head.appendChild(style)
  return style
}
