import themeCss from '@aziontech/theme?raw'

const ROOT_PX = 16

const end = themeCss.indexOf('@utility')
const head = end === -1 ? themeCss : themeCss.slice(0, end)

export const declarations = new Map()
for (const [, name, value] of head.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) {
  if (!declarations.has(name)) declarations.set(name, value.trim())
}

export function toPx(value) {
  const match = /^(-?[\d.]+)(px|rem)?$/.exec(value)
  if (!match) return null
  const amount = Number(match[1])
  return match[2] === 'rem' ? amount * ROOT_PX : amount
}

export function describe(value) {
  const px = toPx(value)
  if (px === null || !/rem$/.test(value)) return value
  return `${value} · ${Math.round(px * 100) / 100}px`
}

const breakpointAt = new Map(
  [...declarations]
    .filter(([name]) => name.startsWith('--breakpoint-'))
    .map(([name, value]) => [toPx(value), name.replace('--breakpoint-', '')])
)

const mediaBlocks = [...head.matchAll(/@media \(min-width:\s*([\d.]+)px\)\s*\{([^{}]*)\}/g)].map(
  ([, px, body]) => ({
    breakpoint: breakpointAt.get(Number(px)) ?? `${px}px`,
    declarations: new Map(
      [...body.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)].map(([, name, value]) => [
        name,
        value.trim()
      ])
    )
  })
)

export function breakpointSteps(name) {
  return mediaBlocks
    .filter((block) => block.declarations.has(name))
    .map((block) => ({ breakpoint: block.breakpoint, value: block.declarations.get(name) }))
}
