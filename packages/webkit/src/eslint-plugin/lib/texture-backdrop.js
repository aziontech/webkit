import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export const GRAPHIC_COMPONENTS = [
  'BarList',
  'Chart',
  'ContributionGraph',
  'DonutChart',
  'FlowDiagram',
  'GaugeChart',
  'MapChart',
  'SparkChart',
  'StatTile',
  'StatTileGroup',
  'Tracker'
]

export const BACKDROP_SCENES = [
  'BrandGlobeScene',
  'ConsoleApplicationScene',
  'ConsoleMockup',
  'ConsoleTraceScene',
  'Diagram',
  'FunctionsHeroCanvas',
  'Illustration',
  'RuntimeApiCloud',
  'SpinningGlobe'
]

const GROUND_COMPONENTS = ['ConsoleMockup', 'ConsoleMockupShell']

export const TEXTURE_BACKDROP_DIRS = [
  'packages/webkit/src',
  'packages/webkit/blocks',
  'packages/webkit/examples'
]

export const TEXTURE_BACKDROP_MESSAGES = {
  'graphic-on-texture':
    'Content other than text drawn on a texture: a chart, diagram, map or stat, or any ' +
    'page-JSON scene other than a console window, globe or illustration. A Texture is a ' +
    'backdrop for text only: its dots compete with the marks, labels and lines, so the ' +
    'content cannot be read. Set the host to a layout without the texture ' +
    '(`ConsoleShowcaseSection variant="diagram"`, `texture="none"`), or move the graphic off ' +
    'the textured band (.claude/rules/styling.md § "A texture is a backdrop for text only").'
}

export function textureBackdropApplies(rel) {
  if (!TEXTURE_BACKDROP_DIRS.some((dir) => rel.startsWith(`${dir}/`))) return false
  if (/\.(test|spec)\.|\/(test|__tests__|fixtures)\//.test(rel)) return false
  if (rel.endsWith('examples.json') || rel.endsWith('block.json')) return false
  return /\.(vue|json)$/.test(rel)
}

const pascal = (tag) =>
  tag
    .split('.')[0]
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const GRAPHICS = new Set(GRAPHIC_COMPONENTS)
const BACKDROPS = new Set(BACKDROP_SCENES)
const GROUNDS = new Set(GROUND_COMPONENTS)

const ELEMENT = 1
const ATTRIBUTE = 6
const DIRECTIVE = 7

const namesProp = (candidate, name, kebab) => candidate === name || candidate === kebab

const isStaticBind = (prop, name, kebab) =>
  prop.type === DIRECTIVE &&
  prop.name === 'bind' &&
  prop.arg?.isStatic &&
  namesProp(prop.arg.content, name, kebab)

const boundLiteral = (prop) => {
  const literal = /^\s*(['"])([^'"]*)\1\s*$/.exec(prop.exp?.content ?? '')
  return { value: literal ? literal[2] : undefined }
}

const propValue = (prop, name, kebab) => {
  if (prop.type === ATTRIBUTE && namesProp(prop.name, name, kebab)) {
    return { value: prop.value?.content ?? '' }
  }
  return isStaticBind(prop, name, kebab) ? boundLiteral(prop) : null
}

const staticProp = (node, name) => {
  const kebab = name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
  for (const prop of node.props ?? []) {
    const found = propValue(prop, name, kebab)
    if (found) return found
  }
  return null
}

const off = (node, name) => staticProp(node, name)?.value === 'none'
const set = (node, name) => {
  const found = staticProp(node, name)
  return found !== null && found.value !== 'none'
}

const PAINTS = {
  Texture: (node) => !off(node, 'variant'),
  Backdrop: () => true,
  ConsoleShowcaseSection: (node) =>
    staticProp(node, 'variant')?.value !== 'diagram' && !off(node, 'texture'),
  MediaSplitSection: (node) => !off(node, 'texture'),
  MediaSplit: (node) => !off(node, 'texture'),
  MediaTabs: (node) => set(node, 'texture')
}

const children = (node) => (node.children ?? []).filter((child) => child.type === ELEMENT)

const holdsGraphic = (node) => {
  for (const child of children(node)) {
    const tag = pascal(child.tag)
    if (GROUNDS.has(tag)) continue
    if (GRAPHICS.has(tag) || holdsGraphic(child)) return true
  }
  return false
}

const slotOf = (node) => {
  if (node.tag !== 'template') return 'default'
  const slot = (node.props ?? []).find((prop) => prop.type === DIRECTIVE && prop.name === 'slot')
  return slot ? (slot.arg?.content ?? 'default') : 'default'
}

const graphicInSlots = (node, names) =>
  children(node).some((child) =>
    names.includes(slotOf(child))
      ? child.tag === 'template'
        ? holdsGraphic(child)
        : holdsGraphic({ children: [child] })
      : false
  )

const SLOT_PAINTS = {
  Hero: (node) =>
    (set(node, 'texture') && graphicInSlots(node, ['default', 'background'])) ||
    (set(node, 'floorTexture') && graphicInSlots(node, ['bottom']))
}

function scanTemplate(ast) {
  const found = []
  const visit = (node) => {
    const kids = children(node)
    for (const child of kids) {
      const tag = pascal(child.tag)
      if (tag === 'Texture' && PAINTS.Texture(child)) {
        const siblings = { children: kids.filter((other) => other !== child) }
        if (holdsGraphic(siblings)) found.push('graphic-on-texture')
      } else if (SLOT_PAINTS[tag]?.(child)) {
        found.push('graphic-on-texture')
      } else if (tag !== 'Texture' && PAINTS[tag]?.(child) && holdsGraphic(child)) {
        found.push('graphic-on-texture')
      }
      if (!GROUNDS.has(tag)) visit(child)
    }
  }
  visit(ast)
  return found
}

const sceneHoldsGraphic = (scene) =>
  Boolean(scene) &&
  typeof scene === 'object' &&
  typeof scene.component === 'string' &&
  !BACKDROPS.has(scene.component)

const SECTION_PAINTS = {
  'console-showcase-section': (props) => props.variant !== 'diagram' && props.texture !== 'none',
  'media-split-section': (props) => props.texture !== 'none'
}

function scanPageEntries(data) {
  const found = []
  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }
    if (!value || typeof value !== 'object') return
    const paints = typeof value._id === 'string' ? SECTION_PAINTS[value._id] : undefined
    if (paints) {
      const props = value.props && typeof value.props === 'object' ? value.props : {}
      const scenes = [
        ...Object.values(value.scenes && typeof value.scenes === 'object' ? value.scenes : {}),
        props.scene
      ]
      if (paints(props) && scenes.some(sceneHoldsGraphic)) found.push('graphic-on-texture')
    }
    Object.values(value).forEach(visit)
  }
  visit(data)
  return found
}

export function scanTextureBackdrop(content, rel = '') {
  try {
    if (rel.endsWith('.json')) return scanPageEntries(JSON.parse(content))
    const { parse } = require('vue/compiler-sfc')
    const ast = parse(content, { filename: rel || 'anonymous.vue' }).descriptor.template?.ast
    return ast ? scanTemplate(ast) : []
  } catch {
    return []
  }
}
