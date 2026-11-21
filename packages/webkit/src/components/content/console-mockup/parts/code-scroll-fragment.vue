<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import CodeBlock, { type CodeBlockTab } from '../../../code/code-block/code-block.vue'
  import ConsoleMockupShell from './console-mockup-shell.vue'
  import ConsoleMockupShellItem from './console-mockup-shell-item.vue'

  defineOptions({ name: 'CodeScrollFragment' })

  interface Props {
    /** The code file the fragment shows. */
    file: CodeBlockTab
    /** Accessible name of the copy button. */
    copyAriaLabel: string
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the code scrolls to its end while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)

  const hostEl = ref<globalThis.HTMLElement | null>(null)

  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const GLIDE = globalThis.parseFloat(duration['slow-04'])

  const scrolled = computed(() => props.active && (props.hovered || !canHover.value))

  const scroller = () => {
    const area = hostEl.value?.querySelector<globalThis.HTMLElement>('[data-testid$="__scroll"]')
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
    if (reduced.value) {
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

  const CODE_FRAME_CLASS =
    'overflow-hidden rounded-(--shape-control) [border:var(--illustration-rim-width,var(--border-width-2))_solid_transparent] ' +
    '[background-image:var(--illustration-rim-layers,linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))),var(--illustration-rim,linear-gradient(135deg,var(--border-default)_0%,var(--border-default)_18%,transparent_45%,transparent_55%,var(--border-default)_82%,var(--border-default)_100%)),linear-gradient(var(--illustration-fill,var(--bg-surface)),var(--illustration-fill,var(--bg-surface))))] ' +
    '[background-origin:var(--illustration-rim-boxes,padding-box,border-box,border-box)] [background-clip:var(--illustration-rim-boxes,padding-box,border-box,border-box)]'
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    shell="legacy"
    fade="bottom"
    :chrome="false"
    :active="active"
    :width="500"
    :mobile-width="480"
  >
    <div class="flex h-full flex-col py-(--spacing-xs)">
      <ConsoleMockupShellItem
        :order="0"
        class="min-h-0 flex-1"
      >
        <div
          ref="hostEl"
          class="h-full"
        >
          <div :class="CODE_FRAME_CLASS">
            <CodeBlock
              :tabs="[file]"
              :bordered="false"
              show-line-numbers
              :copy-aria-label="copyAriaLabel"
            />
          </div>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </ConsoleMockupShell>
</template>
