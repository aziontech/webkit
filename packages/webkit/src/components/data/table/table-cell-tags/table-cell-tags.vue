<script setup lang="ts">
  import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import OverflowCount, {
    type OverflowCountNoun
  } from '../../../content/overflow-count/overflow-count.vue'
  import Tag from '../../../content/tag/tag.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableCellTags',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The tags. As many as fit show; the rest hide behind a `+N` chip. Empty renders a muted dash. */
      items?: string[]
      /** PrimeIcons class for a leading glyph that names the column. */
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
  const ctx = inject(TableInjectionKey, null)
  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__cell-tags` : 'data-table__cell-tags')
  )

  const rowRef = ref<HTMLElement | null>(null)
  const iconRef = ref<HTMLElement | null>(null)
  const rulerRef = ref<HTMLElement | null>(null)
  const chipRef = ref<HTMLElement | null>(null)
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
    const row = rowRef.value
    const ruler = rulerRef.value
    if (!row || !ruler) return
    const gap = Number.parseFloat(globalThis.getComputedStyle(row).columnGap) || 0
    const available = row.clientWidth - (iconRef.value ? iconRef.value.offsetWidth + gap : 0)
    const ends = Array.from(ruler.querySelectorAll<HTMLElement>('[data-ruler-item]')).map(
      (node) => node.offsetLeft + node.offsetWidth
    )
    if (ends.length === 0 || ends[ends.length - 1] <= available) {
      fit.value = props.items.length
      return
    }
    const chip = (chipRef.value?.offsetWidth ?? 0) + gap
    let count = 0
    while (count < ends.length && ends[count] + chip <= available) count += 1
    fit.value = Math.max(1, count)
  }

  let observer: ResizeObserver | null = null
  let frame = 0
  const scheduleMeasure = (): void => {
    globalThis.cancelAnimationFrame(frame)
    frame = globalThis.requestAnimationFrame(measure)
  }
  onMounted(() => {
    if (!rowRef.value || typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver(scheduleMeasure)
    observer.observe(rowRef.value)
    measure()
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    globalThis.cancelAnimationFrame(frame)
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
    ref="rowRef"
    v-bind="$attrs"
    :data-testid="testId"
    class="relative flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <i
      v-if="icon"
      ref="iconRef"
      :class="icon"
      class="shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
      <Tag
        v-for="(item, index) in shown"
        :key="`${index}-${item}`"
        severity="secondary"
        size="medium"
        rounded
        :data-testid="`${testId}__tag`"
        class="min-w-0 max-w-full"
      >
        <span
          dir="auto"
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
        ref="rulerRef"
        class="flex w-max items-center gap-(--spacing-xxs) whitespace-nowrap"
      >
        <span
          v-for="(item, index) in items"
          :key="`${index}-${item}`"
          data-ruler-item
          class="inline-flex"
        >
          <Tag
            :label="item"
            severity="secondary"
            size="medium"
            rounded
          />
        </span>
        <span
          ref="chipRef"
          class="inline-flex"
        >
          <Tag
            :label="`+${items.length}`"
            severity="secondary"
            size="small"
          />
        </span>
      </span>
    </span>
  </div>
</template>
