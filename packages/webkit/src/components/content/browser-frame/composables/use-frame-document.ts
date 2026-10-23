import { useEventListener, useMutationObserver } from '@vueuse/core'
import {
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type ShallowRef,
  shallowRef,
  toValue
} from 'vue'

export interface UseFrameDocumentReturn {
  body: Readonly<ShallowRef<globalThis.HTMLElement | null>>
}

const STYLE_SOURCES = 'style, link[rel="stylesheet"]'

const THEME_ATTRIBUTES = ['data-theme', 'class']

export function useFrameDocument(
  iframe: MaybeRefOrGetter<globalThis.HTMLIFrameElement | null>
): UseFrameDocumentReturn {
  const body = shallowRef<globalThis.HTMLElement | null>(null)

  let frameDocument: globalThis.Document | null = null
  let clones = new Map<globalThis.Element, globalThis.Element>()

  const syncStyles = () => {
    const head = frameDocument?.head
    const hostHead = globalThis.document?.head
    if (!frameDocument || !head || !hostHead) return
    const next = new Map<globalThis.Element, globalThis.Element>()
    for (const source of Array.from(hostHead.querySelectorAll(STYLE_SOURCES))) {
      const existing = clones.get(source)
      const clone = existing ?? frameDocument.importNode(source, true)
      if (existing && source.tagName === 'STYLE' && existing.textContent !== source.textContent) {
        existing.textContent = source.textContent
      }
      const href = source.getAttribute('href')
      if (existing && source.tagName === 'LINK' && href && existing.getAttribute('href') !== href) {
        existing.setAttribute('href', href)
      }
      if (!clone.isConnected) head.appendChild(clone)
      next.set(source, clone)
    }
    clones.forEach((clone, source) => {
      if (!next.has(source)) clone.remove()
    })
    clones = next
  }

  const syncTheme = () => {
    const root = frameDocument?.documentElement
    const hostRoot = globalThis.document?.documentElement
    if (!root || !hostRoot) return
    for (const name of THEME_ATTRIBUTES) {
      const value = hostRoot.getAttribute(name)
      if (value === null) root.removeAttribute(name)
      else root.setAttribute(name, value)
    }
  }

  const detach = () => {
    clones.forEach((clone) => clone.remove())
    clones = new Map()
    frameDocument = null
    body.value = null
  }

  const attach = () => {
    const doc = toValue(iframe)?.contentDocument ?? null
    if (!doc || doc === frameDocument || doc.URL === 'about:blank' || !doc.body) return
    detach()
    frameDocument = doc
    doc.body.style.margin = '0'
    syncStyles()
    syncTheme()
    body.value = doc.body
  }

  useEventListener(iframe, 'load', attach)

  useMutationObserver(() => globalThis.document?.head, syncStyles, {
    childList: true,
    subtree: true,
    characterData: true
  })

  useMutationObserver(() => globalThis.document?.documentElement, syncTheme, {
    attributes: true,
    attributeFilter: THEME_ATTRIBUTES
  })

  onMounted(attach)

  onScopeDispose(detach)

  return {
    body: readonly(body) as Readonly<ShallowRef<globalThis.HTMLElement | null>>
  }
}
