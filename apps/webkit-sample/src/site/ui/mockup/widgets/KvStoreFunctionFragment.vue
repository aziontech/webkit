<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import CodeBlock from '@aziontech/webkit/code-block'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'KvStoreFunctionFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the code scrolls to its end while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const CODE = `import { createClient } from 'azion/kv';
import type { KVClient } from 'azion/kv';

const client: KVClient = await createClient({
  namespace: 'app-state'
})
  .on('error', (err) => console.error('KV error:', err))
  .connect();

// Store a session with TTL
await client.set(
  'session:user-123',
  JSON.stringify({ userId: 'user-123', role: 'admin' }),
  { expiration: { type: 'EX', value: 3600 } }
);

// Retrieve the session
const session = await client.get('session:user-123');
console.log(session);

// Increment a counter
await client.incr('api:calls:today', 1);`

  const SET_LINE = 11

  const FILES = [
    {
      label: 'Code',
      value: 'code',
      language: 'typescript',
      fileName: 'kv-store.ts',
      fileIcon: 'ai-cor ai-ts',
      code: CODE,
      highlightedLine: SET_LINE
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
