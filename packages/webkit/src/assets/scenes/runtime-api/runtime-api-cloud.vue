<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { useScrollProgress } from './composables/use-scroll-progress'
  import { RUNTIME_API_ROWS, RUNTIME_APIS } from './runtime-api-data'

  defineOptions({ name: 'RuntimeApiCloud', inheritAttrs: false })

  interface Props {
    /** Accessible name of the list of globals; empty uses the built-in "Globals available in the Azion Runtime". */
    ariaLabel?: string
    /** Hands the highlight from pill to pill on a timer and drifts the rows with the page scroll; off draws the seeded field at rest. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    animated: true
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ runtimeApiCloud: en.runtimeApiCloud })

  const HANDOFF = 3
  const TICK_MS = 1100
  const DRIFT = 72
  const REST = 26

  const field = ref<globalThis.HTMLElement | null>(null)
  const lit = ref(RUNTIME_APIS.map((api) => Boolean(api.lit || api.azion)))
  const { progress } = useScrollProgress(() => (props.animated ? field.value : null))

  const shufflable = RUNTIME_APIS.flatMap((api, index) => (api.pinned || api.azion ? [] : [index]))

  let timer: ReturnType<typeof globalThis.setInterval> | undefined

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'assets-runtime-api-cloud'
  )

  const rows = computed(() => {
    const chunks: { label: string; azion: boolean; index: number }[][] = []
    let cursor = 0
    for (const count of RUNTIME_API_ROWS) {
      if (cursor >= RUNTIME_APIS.length) break
      chunks.push(
        RUNTIME_APIS.slice(cursor, cursor + count).map((api, offset) => ({
          label: api.label,
          azion: Boolean(api.azion),
          index: cursor + offset
        }))
      )
      cursor += count
    }
    return chunks
  })

  onMounted(() => {
    if (!props.animated) return
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return
    timer = globalThis.setInterval(handoff, TICK_MS)
  })

  onScopeDispose(() => {
    if (timer !== undefined) globalThis.clearInterval(timer)
    timer = undefined
  })

  function pick(state: boolean, count: number): number[] {
    const candidates = shufflable.filter((index) => lit.value[index] === state)
    for (let i = candidates.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }
    return candidates.slice(0, count)
  }

  function handoff() {
    const next = [...lit.value]
    for (const index of pick(true, HANDOFF)) next[index] = false
    for (const index of pick(false, HANDOFF)) next[index] = true
    lit.value = next
  }

  function rowStyle(row: number): Record<string, string> {
    const direction = row % 2 === 0 ? 1 : -1
    return { '--row-drift': `${(REST + progress.value * DRIFT) * direction}px` }
  }

  function toneOf(pill: { azion: boolean; index: number }): 'azion' | 'lit' | 'muted' {
    if (pill.azion) return 'azion'
    return lit.value[pill.index] ? 'lit' : 'muted'
  }
</script>

<template>
  <div
    ref="field"
    v-bind="$attrs"
    :data-testid="testId"
    role="list"
    :aria-label="ariaLabel || t('runtimeApiCloud.label')"
    class="flex flex-col items-center justify-center gap-(--spacing-xs)"
  >
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      role="none"
      :style="rowStyle(rowIndex)"
      class="flex w-max shrink-0 translate-x-(--row-drift) items-center gap-(--spacing-xs) will-change-[translate] rtl:-translate-x-(--row-drift)"
    >
      <span
        v-for="pill in row"
        :key="pill.label"
        role="listitem"
        :data-active="lit[pill.index] || null"
        :data-tone="toneOf(pill)"
        class="inline-flex shrink-0 items-center rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) whitespace-nowrap text-overline-sm shadow-(--shadow-sm) [border:var(--border-width-default)_solid_transparent] [background-clip:padding-box,border-box] [background-origin:padding-box,border-box] [background-image:linear-gradient(var(--bg-surface),var(--bg-surface)),linear-gradient(135deg,var(--border-default)_0%,var(--border-default)_18%,transparent_45%,transparent_55%,var(--border-default)_82%,var(--border-default)_100%)] text-(--text-muted) transition-colors duration-slow-01 ease-productive-entrance data-active:[background-image:linear-gradient(var(--bg-surface),var(--bg-surface)),linear-gradient(135deg,var(--primary)_0%,var(--primary)_18%,transparent_45%,transparent_55%,var(--primary)_82%,var(--primary)_100%)] data-[tone=azion]:text-(--primary) data-[tone=lit]:text-(--text-default) motion-reduce:transition-none"
        >{{ pill.label }}</span
      >
    </div>
  </div>
</template>
