import { layoutsData } from '@aziontech/theme/layouts'

import { breakpointSteps, declarations, describe, toPx } from './theme-css.js'

const TAILWIND = [
  [/-boundary-inline$/, 'px-'],
  [/-boundary-start$/, 'pt-'],
  [/-boundary-end$/, 'pb-'],
  [/-gap$/, 'gap-'],
  [/-measure-control$/, 'w-'],
  [/-measure/, 'max-w-']
]

function resolve(value) {
  const reference = /^var\((--[a-z0-9-]+)\)$/.exec(value)?.[1]
  if (!reference) return { base: value, steps: [] }
  return { base: declarations.get(reference) ?? value, steps: breakpointSteps(reference) }
}

function row(name, reference) {
  const { base, steps } = resolve(reference)
  const resolved = steps.length
    ? [base, ...steps.map((step) => `${step.breakpoint} ${step.value}`)]
    : [describe(base)]
  return {
    name,
    value: `var(${name})`,
    px: toPx(base),
    tailwind: `${TAILWIND.find(([pattern]) => pattern.test(name))[1]}(${name})`,
    css: `var(${name})`,
    raw: `${reference.replace(/^var\((.*)\)$/, '$1')} · ${resolved.join(' → ')}`
  }
}

function layoutFamily({ title, description, preview, match }) {
  const tokens = Object.entries(layoutsData)
    .map(([key, reference]) => [`--${key}`, reference])
    .filter(([name]) => match(name))
    .map(([name, reference]) => row(name, reference))
  const largest = Math.max(0, ...tokens.map((token) => token.px ?? 0))
  return { title, description, preview, largest, tokens }
}

export const layoutFamilies = [
  layoutFamily({
    title: 'Boundary',
    description: 'How far content sits from the app chrome.',
    preview: 'length',
    match: (name) => name.startsWith('--layout-boundary')
  }),
  layoutFamily({
    title: 'Rhythm',
    description: 'How far things sit from each other.',
    preview: 'length',
    match: (name) => name.endsWith('-gap')
  }),
  layoutFamily({
    title: 'Measure',
    description: 'How wide a column may get, drawn to scale against the widest.',
    preview: 'scaled',
    match: (name) => name.startsWith('--layout-measure')
  })
]
