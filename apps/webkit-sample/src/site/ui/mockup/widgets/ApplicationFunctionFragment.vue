<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import { duration } from '@aziontech/theme/animations'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ApplicationFunctionFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the code scrolls to its end while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const CODE = `async function handleRequest(request) {
  const { pathname } = new URL(request.url)
  const response = await fetch(request)
  const headers = new Headers(response.headers)

  headers.set("Cache-Control", ttl(pathname))
  headers.set("Vary", "Accept-Encoding")

  return new Response(response.body, {
    status: response.status,
    headers
  })
}

const RULES = [
  ["/assets/", "max-age=31536000"],
  ["/api/", "max-age=60"],
  ["/", "max-age=3600"]
]

function ttl(pathname) {
  const [, value] = RULES.find(([prefix]) =>
    pathname.startsWith(prefix)
  )
  return value
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
})`

  const CACHE_LINE = 6

  const FILES = [
    {
      label: 'Code',
      value: 'code',
      language: 'javascript',
      fileName: 'JavaScript',
      fileIcon: 'ai-cor ai-js',
      code: CODE,
      highlightedLine: CACHE_LINE
    }
  ]

  const host = ref<globalThis.HTMLElement | null>(null)

  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const GLIDE = globalThis.parseFloat(duration['slow-04'])

  const scrolled = computed(() => props.active && (props.hover || !canHover))

  const scroller = () => {
    const area = host.value?.querySelector<globalThis.HTMLElement>('[data-testid$="__scroll"]')
    if (!area) return null
    return [area, ...area.querySelectorAll<globalThis.HTMLElement>('*')].find(
      (element) => element.scrollHeight > element.clientHeight + 1
    )
  }

  const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2

  let frame = 0

  const glide = (toEnd: boolean) => {
    globalThis.cancelAnimationFrame(frame)
    const element = scroller()
    if (!element) return
    const from = element.scrollTop
    const to = toEnd ? element.scrollHeight - element.clientHeight : 0
    if (reduced) {
      element.scrollTop = to
      return
    }
    const span =
      GLIDE * (Math.abs(to - from) / Math.max(1, element.scrollHeight - element.clientHeight))
    const start = globalThis.performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / Math.max(1, span))
      element.scrollTop = from + (to - from) * ease(t)
      if (t < 1) frame = globalThis.requestAnimationFrame(step)
    }
    frame = globalThis.requestAnimationFrame(step)
  }

  watch(scrolled, glide)

  onMounted(() => {
    if (scrolled.value) glide(true)
  })

  onScopeDispose(() => globalThis.cancelAnimationFrame(frame))
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    fade="bottom"
    :chrome="false"
    :active="active"
    :width="500"
    :mobile-width="480"
  >
    <div class="flex h-full flex-col py-(--spacing-xs)">
      <MockupPart
        :order="0"
        class="min-h-0 flex-1"
      >
        <div
          ref="host"
          class="h-full"
        >
          <div
            class="overflow-hidden rounded-(--shape-elements) [border:var(--illustration-rim-width)_solid_transparent] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)]"
          >
            <CodeBlock
              :tabs="FILES"
              :border="false"
              show-line-numbers
              copy-aria-label="Copy the function code"
            />
          </div>
        </div>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
