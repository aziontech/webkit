import { illustrationPalette, normalizeIllustrationColor } from './palette'

const PAINTS = ['fill', 'stroke', 'stop-color']
const PAINT_OPACITY: Record<string, string> = { fill: 'fill-opacity', stroke: 'stroke-opacity' }
const UNPAINTED = new Set(['mask', 'clipPath', 'filter'])
const REFERENCE = /url\(#([^)]+)\)/g
const HREF_REFERENCE = /(?:\s|:)href="#([^"]+)"/g
const TAG = /<(\/?)([A-Za-z][\w:.-]*)((?:\s+[^\s=/>]+(?:\s*=\s*"[^"]*")?)*)\s*(\/?)>/g
const ATTRIBUTE = /([^\s=/>]+)(?:\s*=\s*"([^"]*)")?/g
const ROOT = /<svg\b([^>]*)>([\s\S]*)<\/svg>/

export interface IllustrationScene {
  viewBox: string
  draw: (scope: string) => string
}

export type IllustrationMarkupLoader = () => Promise<{ default: string }>

const scenes = new Map<string, Promise<IllustrationScene>>()

function parseAttributes(source: string): Map<string, string> {
  const attributes = new Map<string, string>()
  for (const [, name, value] of source.matchAll(ATTRIBUTE)) attributes.set(name, value ?? '')
  return attributes
}

function serializeAttributes(attributes: Map<string, string>): string {
  return [...attributes].map(([name, value]) => ` ${name}="${value}"`).join('')
}

function isShadow(attributes: Map<string, string>, paint: string): boolean {
  const opacity =
    (PAINT_OPACITY[paint] && attributes.get(PAINT_OPACITY[paint])) || attributes.get('opacity')
  return opacity !== undefined && Number(opacity) < 1
}

function paintRoles(name: string, attributes: Map<string, string>): void {
  const declarations: string[] = []
  for (const paint of PAINTS) {
    const value =
      attributes.get(paint) ?? (paint === 'stop-color' && name === 'stop' ? 'black' : null)
    if (!value) continue
    const color = normalizeIllustrationColor(value)
    const role = illustrationPalette[color]
    if (!role || (role === 'ground' && paint !== 'stop-color' && isShadow(attributes, paint))) {
      continue
    }
    attributes.delete(paint)
    declarations.push(`${paint}: var(--illustration-${role}, ${color})`)
  }
  if (declarations.length === 0) return
  const style = attributes.get('style')?.trim().replace(/;$/, '')
  attributes.set('style', [style, ...declarations].filter(Boolean).join('; '))
}

function referencedIds(markup: string): Set<string> {
  const referenced = new Set<string>()
  for (const [, id] of markup.matchAll(REFERENCE)) referenced.add(id)
  for (const [, id] of markup.matchAll(HREF_REFERENCE)) referenced.add(id)
  return referenced
}

function themeMarkup(markup: string): string {
  const referenced = referencedIds(markup)
  const unpainted: boolean[] = []
  return markup.replace(
    TAG,
    (tag, closing: string, name: string, source: string, selfClosing: string) => {
      if (closing) {
        unpainted.pop()
        return tag
      }
      const skipped = (unpainted.at(-1) ?? false) || UNPAINTED.has(name)
      if (!selfClosing) unpainted.push(skipped)
      const attributes = parseAttributes(source)
      if (!skipped) paintRoles(name, attributes)
      const id = attributes.get('id')
      if (id !== undefined && !referenced.has(id)) attributes.delete('id')
      return `<${name}${serializeAttributes(attributes)}${selfClosing ? ' /' : ''}>`
    }
  )
}

function scopeMarkup(markup: string, scope: string): string {
  return markup
    .replace(/(\s)id="([^"]+)"/g, `$1id="${scope}-$2"`)
    .replace(REFERENCE, `url(#${scope}-$1)`)
    .replace(/((?:\s|:)href=")#([^"]+)"/g, `$1#${scope}-$2"`)
}

/** Themes an illustration SVG with string operations only, so it renders on the server too. */
export function createIllustrationScene(markup: string): IllustrationScene {
  const [, rootSource = '', body = ''] = markup.match(ROOT) ?? []
  const themed = themeMarkup(body)
  return {
    viewBox: parseAttributes(rootSource).get('viewBox') ?? '',
    draw: (scope: string) => scopeMarkup(themed, scope)
  }
}

/** Loads and themes the scene once per key; later calls share the cached promise. */
export function loadIllustrationScene(
  key: string,
  load: IllustrationMarkupLoader
): Promise<IllustrationScene> {
  const cached = scenes.get(key)
  if (cached) return cached
  const scene = load().then((asset) => createIllustrationScene(asset.default))
  scenes.set(key, scene)
  scene.catch(() => scenes.delete(key))
  return scene
}
