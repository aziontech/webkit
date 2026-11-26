import {
  computed,
  type ComputedRef,
  onMounted,
  onScopeDispose,
  type Ref,
  ref,
  shallowRef,
  watch
} from 'vue'

import {
  type HeadingNavigationItem,
  type HeadingOutlineItem,
  provideHeadingNavigation,
  provideHeadingOutline,
  type RegisterHeading
} from '../../../../composables/use-heading-navigation'
import type { DocTableOfContentsItem } from '../../doc-table-of-contents/doc-table-of-contents.vue'

export interface UseDocLayoutOutlineReturn {
  outline: ComputedRef<DocTableOfContentsItem[]>
  activeHeading: ComputedRef<string>
  jumpTo: (event: globalThis.MouseEvent, item: HeadingNavigationItem) => void
}

type RegisteredHeading = {
  el: () => Element | null
  item: () => HeadingOutlineItem | null
}

function collectOutline(): ComputedRef<DocTableOfContentsItem[]> {
  const headings = shallowRef<RegisteredHeading[]>([])

  const registerHeading: RegisterHeading = (el, item) => {
    const entry = { el, item }
    headings.value = [...headings.value, entry]
    return () => {
      headings.value = headings.value.filter((heading) => heading !== entry)
    }
  }

  provideHeadingOutline(registerHeading)

  return computed<DocTableOfContentsItem[]>(() =>
    headings.value
      .map((heading) => ({ el: heading.el(), item: heading.item() }))
      .filter((heading): heading is { el: Element; item: HeadingOutlineItem } =>
        Boolean(heading.el && heading.item)
      )
      .sort((a, b) => (a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1))
      .map((heading) => heading.item)
  )
}

export function useDocLayoutOutline(
  headerEl: Ref<globalThis.HTMLElement | null>
): UseDocLayoutOutlineReturn {
  const headingId = ref('')
  const outline = collectOutline()
  const headerOffset = () => headerEl.value?.getBoundingClientRect().height ?? 0
  let frame = 0

  const readHeading = () => {
    frame = 0
    const line = headerOffset() + 8
    let current = ''
    for (const item of outline.value) {
      const el = globalThis.document?.getElementById(item.id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= line) current = item.id
      else break
    }
    headingId.value = current
  }

  const onScroll = () => {
    if (!frame) frame = globalThis.requestAnimationFrame(readHeading)
  }

  watch(outline, () => {
    headingId.value = ''
    onScroll()
  })

  onMounted(() => {
    readHeading()
    globalThis.addEventListener('scroll', onScroll, { passive: true })
  })

  onScopeDispose(() => {
    globalThis.removeEventListener?.('scroll', onScroll)
    if (frame) globalThis.cancelAnimationFrame(frame)
  })

  const jumpTo = (event: globalThis.MouseEvent, item: HeadingNavigationItem) => {
    const el = globalThis.document?.getElementById(item.id)
    if (!el) return
    event.preventDefault()
    const reduce = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const top = el.getBoundingClientRect().top + globalThis.scrollY - headerOffset() - 16
    globalThis.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    globalThis.history?.replaceState(globalThis.history.state, '', `#${item.id}`)
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
    headingId.value = item.id
  }

  provideHeadingNavigation(jumpTo)

  return {
    outline,
    activeHeading: computed(() => headingId.value || outline.value[0]?.id || ''),
    jumpTo
  }
}
