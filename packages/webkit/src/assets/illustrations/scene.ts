import { illustrationPalette, normalizeIllustrationColor } from './palette'

const PAINTS = ['fill', 'stroke', 'stop-color']
const PAINT_OPACITY: Record<string, string> = { fill: 'fill-opacity', stroke: 'stroke-opacity' }
const UNPAINTED = new Set(['mask', 'clipPath', 'filter'])
const REFERENCE = /url\(#([^)]+)\)/g

export interface IllustrationScene {
  viewBox: string
  draw: (scope: string) => globalThis.Node[]
}

const scenes = new Map<string, Promise<IllustrationScene>>()

function isShadow(element: globalThis.Element, paint: string): boolean {
  const opacity =
    (PAINT_OPACITY[paint] && element.getAttribute(PAINT_OPACITY[paint])) ||
    element.getAttribute('opacity')
  return opacity !== null && Number(opacity) < 1
}

function paintRoles(element: globalThis.Element): void {
  if (UNPAINTED.has(element.localName)) return
  for (const paint of PAINTS) {
    const value =
      element.getAttribute(paint) ??
      (paint === 'stop-color' && element.localName === 'stop' ? 'black' : null)
    if (!value) continue
    const color = normalizeIllustrationColor(value)
    const role = illustrationPalette[color]
    if (!role || (role === 'ground' && paint !== 'stop-color' && isShadow(element, paint))) continue
    element.removeAttribute(paint)
    ;(element as globalThis.SVGElement).style.setProperty(
      paint,
      `var(--illustration-${role}, ${color})`
    )
  }
  for (const child of element.children) paintRoles(child)
}

function pruneUnreferencedIds(svg: globalThis.SVGSVGElement): void {
  const referenced = new Set<string>()
  for (const element of svg.querySelectorAll('*')) {
    for (const attribute of element.attributes) {
      for (const match of attribute.value.matchAll(REFERENCE)) referenced.add(match[1])
      if (attribute.localName === 'href' && attribute.value.startsWith('#')) {
        referenced.add(attribute.value.slice(1))
      }
    }
  }
  for (const element of svg.querySelectorAll('[id]')) {
    if (!referenced.has(element.id)) element.removeAttribute('id')
  }
}

function scopedCopy(template: globalThis.SVGSVGElement, scope: string): globalThis.Node[] {
  const copy = globalThis.document.importNode(template, true)
  for (const element of copy.querySelectorAll('*')) {
    if (element.id) element.id = `${scope}-${element.id}`
    for (const attribute of element.attributes) {
      if (attribute.value.includes('url(#')) {
        attribute.value = attribute.value.replace(REFERENCE, `url(#${scope}-$1)`)
      } else if (attribute.localName === 'href' && attribute.value.startsWith('#')) {
        attribute.value = `#${scope}-${attribute.value.slice(1)}`
      }
    }
  }
  return [...copy.childNodes]
}

export function loadIllustrationScene(url: string): Promise<IllustrationScene> {
  const cached = scenes.get(url)
  if (cached) return cached
  const scene = globalThis
    .fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`${response.status} loading ${url}`)
      return response.text()
    })
    .then((markup) => {
      const svg = new globalThis.DOMParser().parseFromString(markup, 'image/svg+xml')
        .documentElement as unknown as globalThis.SVGSVGElement
      paintRoles(svg)
      pruneUnreferencedIds(svg)
      return {
        viewBox: svg.getAttribute('viewBox') ?? '',
        draw: (scope: string) => scopedCopy(svg, scope)
      }
    })
  scenes.set(url, scene)
  scene.catch(() => scenes.delete(url))
  return scene
}
