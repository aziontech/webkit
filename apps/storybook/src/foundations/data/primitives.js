import { declarations, describe, toPx } from './theme-css.js'

const utility = (prefix) => (name) => `${prefix}(${name})`

function family({ title, description = '', pattern, exclude = [], preview, tailwind }) {
  const tokens = [...declarations]
    .filter(([name]) => pattern.test(name) && !exclude.includes(name))
    .map(([name, value]) => ({
      name,
      value,
      px: toPx(value),
      tailwind: tailwind(name),
      css: `var(${name})`,
      raw: describe(value)
    }))
  const largest = Math.max(0, ...tokens.map((token) => token.px ?? 0))
  return { title, description, preview, largest, tokens }
}

export const primitiveFamilies = {
  'font-family': family({
    title: 'Font Family',
    pattern: /^--font-(sans|code|display)$/,
    preview: 'font-family',
    tailwind: (name) => `font-(family-name:${name})`
  }),
  'font-size': family({
    title: 'Font Size',
    pattern: /^--text-(xs|sm|base|lg|\d?xl)$/,
    preview: 'font-size',
    tailwind: (name) => `text-(length:${name})`
  }),
  'font-weight': family({
    title: 'Font Weight',
    pattern: /^--font-weight-/,
    exclude: ['--font-weight-black'],
    preview: 'font-weight',
    tailwind: utility('font-')
  }),
  'line-height': family({
    title: 'Line Height',
    description: 'Fixed line boxes, in pixels.',
    pattern: /^--line-height-/,
    preview: 'line-height',
    tailwind: utility('leading-')
  }),
  leading: family({
    title: 'Leading',
    description: 'Line height as a ratio of the font size.',
    pattern: /^--leading-/,
    preview: 'line-height',
    tailwind: utility('leading-')
  }),
  tracking: family({
    title: 'Letter Spacing',
    pattern: /^--tracking-/,
    preview: 'tracking',
    tailwind: utility('tracking-')
  }),
  spacing: family({
    title: 'Spacing',
    pattern: /^--spacing-\d+$/,
    preview: 'length',
    tailwind: utility('p-')
  }),
  size: family({
    title: 'Size',
    pattern: /^--size-\d+$/,
    preview: 'square',
    tailwind: utility('h-')
  }),
  container: family({
    title: 'Container',
    pattern: /^--container-(\d?xs|sm|md|lg|\d?xl)$/,
    preview: 'scaled',
    tailwind: utility('max-w-')
  }),
  breakpoint: family({
    title: 'Breakpoint',
    pattern: /^--breakpoint-/,
    preview: 'scaled',
    tailwind: (name) => `${name.replace('--breakpoint-', '')}:`
  }),
  'shape-role': family({
    title: 'Shape Roles',
    description: 'What components bind. Each role aliases one radius step.',
    pattern: /^--shape-/,
    preview: 'radius',
    tailwind: utility('rounded-')
  }),
  radius: family({
    title: 'Radius',
    description: 'The radius scale the roles resolve to.',
    pattern: /^--radius/,
    preview: 'radius',
    tailwind: utility('rounded-')
  }),
  border: family({
    title: 'Border Width',
    pattern: /^--border-(\d+|width-default)$/,
    preview: 'border',
    tailwind: (name) => `border-(length:${name})`
  }),
  'ring-offset': family({
    title: 'Ring Offset',
    description: 'Gap between an element and its focus ring.',
    pattern: /^--ring-offset$/,
    preview: 'ring-offset',
    tailwind: (name) => `ring-offset-(length:${name})`
  }),
  shadow: family({
    title: 'Shadow',
    description: 'Box shadows for raised surfaces.',
    pattern: /^--shadow-/,
    preview: 'shadow',
    tailwind: utility('shadow-')
  }),
  'drop-shadow': family({
    title: 'Drop Shadow',
    description:
      'Filter shadows that follow the shape of the artwork, for icons and cut-out images.',
    pattern: /^--drop-shadow-/,
    preview: 'drop-shadow',
    tailwind: utility('drop-shadow-')
  }),
  'inset-shadow': family({
    title: 'Inset Shadow',
    description: 'Inner shadows for recessed wells and pressed states.',
    pattern: /^--inset-shadow-/,
    preview: 'shadow',
    tailwind: utility('shadow-')
  }),
  blur: family({ title: 'Blur', pattern: /^--blur-/, preview: 'blur', tailwind: utility('blur-') }),
  opacity: family({
    title: 'Opacity',
    pattern: /^--opacity-/,
    preview: 'opacity',
    tailwind: utility('opacity-')
  }),
  perspective: family({
    title: 'Perspective',
    pattern: /^--perspective-/,
    preview: 'perspective',
    tailwind: utility('perspective-')
  }),
  aspect: family({
    title: 'Aspect Ratio',
    pattern: /^--aspect-/,
    preview: 'aspect',
    tailwind: utility('aspect-')
  }),
  'z-index': family({
    title: 'Z-index',
    pattern: /^--z-/,
    preview: 'value',
    tailwind: utility('z-')
  })
}
