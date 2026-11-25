<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import OverflowCount, {
    type OverflowCountNoun
  } from '../../../content/overflow-count/overflow-count.vue'
  import Tag from '../../../content/tag/tag.vue'

  defineOptions({
    name: 'TableCellTags',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The tags. As many as fit show; the rest hide behind a `+N` chip. Empty renders a muted dash. */
      items?: string[]
      /** Azion icon class for a leading glyph that names the column. */
      icon?: string
      /** What the tags are, for the `+N` popover. Empty uses the catalog (`tag` / `tags`). */
      noun?: OverflowCountNoun
    }>(),
    {
      items: () => [],
      icon: '',
      noun: undefined
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ tableCellTags: en.tableCellTags })
  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-cell-tags'
  )

  const rowEl = ref<HTMLElement | null>(null)
  const iconEl = ref<HTMLElement | null>(null)
  const rulerEl = ref<HTMLElement | null>(null)
  const chipEl = ref<HTMLElement | null>(null)
  const fit = ref<number>(props.items.length)

  const shownCount = computed<number>(() => Math.min(props.items.length, Math.max(1, fit.value)))
  const shown = computed<string[]>(() => props.items.slice(0, shownCount.value))
  const hidden = computed<string[]>(() => props.items.slice(shownCount.value))
  const nounOf = computed<OverflowCountNoun>(
    () =>
      props.noun ?? {
        one: t('tableCellTags.noun', { count: 1 }),
        other: t('tableCellTags.noun', { count: 2 })
      }
  )

  const measure = (): void => {
    const row = rowEl.value
    const ruler = rulerEl.value
    if (!row || !ruler) return
    const gap = Number.parseFloat(globalThis.getComputedStyle(row).columnGap) || 0
    const available = row.clientWidth - (iconEl.value ? iconEl.value.offsetWidth + gap : 0)
    const rulerGap = Number.parseFloat(globalThis.getComputedStyle(ruler).columnGap) || 0
    let end = -rulerGap
    const ends = Array.from(ruler.querySelectorAll<HTMLElement>('[data-ruler-item]')).map(
      (node) => (end += rulerGap + node.getBoundingClientRect().width)
    )
    if (ends.length === 0 || ends[ends.length - 1] <= available) {
      fit.value = props.items.length
      void nextTick(settle)
      return
    }
    const chip = (chipEl.value?.offsetWidth ?? 0) + gap
    let count = 0
    while (count < ends.length && ends[count] + chip <= available) count += 1
    fit.value = Math.max(1, count)
    void nextTick(settle)
  }

  const settle = (): void => {
    const texts = Array.from(rowEl.value?.querySelectorAll<HTMLElement>('[data-tag-text]') ?? [])
    if (shownCount.value < 2 || !texts.some((el) => el.scrollWidth > el.clientWidth + 0.5)) return
    fit.value = shownCount.value - 1
    void nextTick(settle)
  }

  let watched: HTMLElement[] = []
  onMounted(() => {
    watched = [rowEl.value, rulerEl.value].filter((el): el is HTMLElement => el !== null)
    for (const el of watched) watchSize(el, measure)
    measure()
  })
  onBeforeUnmount(() => {
    for (const el of watched) unwatchSize(el, measure)
    watched = []
  })
  watch(
    () => props.items,
    async () => {
      fit.value = props.items.length
      await nextTick()
      measure()
    }
  )
</script>

<script lang="ts">
  const jobs = new WeakMap<Element, () => void>()
  const pending = new Set<() => void>()
  let sizeObserver: ResizeObserver | null = null
  let frame = 0

  const flush = (): void => {
    frame = 0
    const due = [...pending]
    pending.clear()
    for (const job of due) job()
  }

  const schedule = (job: () => void): void => {
    pending.add(job)
    if (!frame) frame = globalThis.requestAnimationFrame(flush)
  }

  function watchSize(el: Element, job: () => void): void {
    if (typeof ResizeObserver === 'undefined') return
    sizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        const due = jobs.get(entry.target)
        if (due) schedule(due)
      }
    })
    jobs.set(el, job)
    sizeObserver.observe(el)
  }

  function unwatchSize(el: Element, job: () => void): void {
    jobs.delete(el)
    pending.delete(job)
    sizeObserver?.unobserve(el)
  }
</script>

<template>
  <span
    v-if="items.length === 0"
    v-bind="$attrs"
    :data-testid="testId"
    class="text-body-sm text-(--text-muted)"
    >—</span
  >
  <div
    v-else
    ref="rowEl"
    v-bind="$attrs"
    :data-testid="testId"
    class="relative flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <i
      v-if="icon"
      ref="iconEl"
      :class="icon"
      class="shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
      <Tag
        v-for="(item, index) in shown"
        :key="`${index}-${item}`"
        severity="neutral"
        size="medium"
        :data-testid="`${testId}__tag`"
        class="min-w-0 max-w-full"
      >
        <span
          dir="auto"
          data-tag-text
          class="min-w-0 truncate"
          >{{ item }}</span
        >
      </Tag>
    </span>
    <OverflowCount
      v-if="hidden.length > 0"
      :items="hidden"
      :noun="nounOf"
      :data-testid="`${testId}__more`"
    />
    <span
      class="pointer-events-none invisible absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <span
        ref="rulerEl"
        class="flex w-max items-center gap-(--spacing-2xs) whitespace-nowrap"
      >
        <span
          v-for="(item, index) in items"
          :key="`${index}-${item}`"
          data-ruler-item
          class="inline-flex"
        >
          <Tag
            :label="item"
            severity="neutral"
            size="medium"
          />
        </span>
        <span
          ref="chipEl"
          class="inline-flex"
        >
          <Tag
            :label="`+${items.length}`"
            severity="neutral"
            size="small"
          />
        </span>
      </span>
    </span>
  </div>
</template>
