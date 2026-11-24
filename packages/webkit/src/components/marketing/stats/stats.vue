<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import CardGrid, {
    type CardGridColumns,
    type CardGridMobileColumns
  } from '../../layout/card-grid/card-grid.vue'

  defineOptions({
    name: 'Stats',
    inheritAttrs: false
  })

  /** One headline figure and the caption naming what it measures. */
  export type StatsItem = {
    /** The figure itself, set at big-number scale. */
    value: string
    /** Caption naming what the figure measures, set at overline scale. */
    label: string
    /** Qualifier set before the figure, painted in the brand accent. */
    prefix?: string
    /** Unit set after the figure, in muted text. */
    suffix?: string
  }

  /** Size token; picks the big-number scale the figures are set at. */
  export type StatsSize = 'small' | 'medium' | 'large'

  export interface StatsProps {
    /** The figures rendered as cells, in order; each item is a value, a label, and an optional prefix and suffix — the figure, its caption, and the qualifier and unit set beside it. */
    items?: StatsItem[]
    /** Size token; picks the big-number scale the figures are set at. */
    size?: StatsSize
  }

  const props = withDefaults(defineProps<StatsProps>(), {
    items: () => [],
    size: 'medium'
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'stats')

  const hasItems = computed(() => props.items.length > 0)

  const glyphs = (text = '') => Array.from(text).length

  const figureFit = computed(() => {
    let characters = 1
    let gaps = 0
    for (const item of props.items) {
      const parts = [item.prefix, item.value, item.suffix].filter(Boolean)
      characters = Math.max(
        characters,
        parts.reduce((sum, part) => sum + glyphs(part), 0)
      )
      gaps = Math.max(gaps, parts.length - 1)
    }
    return {
      '--text-big-number-characters': characters,
      '--text-big-number-inset': `calc(${gaps} * var(--spacing-2xs))`
    }
  })

  const emptyCells = (count: number, columns: number) => (columns - (count % columns)) % columns

  const columns = computed<CardGridColumns>(() => {
    let best: CardGridColumns = 4
    for (const option of [3, 2] as const) {
      if (emptyCells(props.items.length, option) < emptyCells(props.items.length, best)) {
        best = option
      }
    }
    return best
  })

  const mobileColumns = computed<CardGridMobileColumns>(() =>
    emptyCells(props.items.length, 2) === 0 ? 2 : 1
  )

  const FIGURE_CLASS =
    'flex min-w-0 flex-nowrap items-baseline gap-(--spacing-2xs) ' +
    'group-data-[size=large]:text-big-number-lg group-data-[size=medium]:text-big-number-md group-data-[size=small]:text-big-number-sm'
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :style="figureFit"
    class="group"
  >
    <CardGrid
      v-if="hasItems"
      variant="divider"
      :columns="columns"
      :mobile-columns="mobileColumns"
    >
      <figure
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="@container/stats-figure m-0 flex h-full flex-col justify-start gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
      >
        <div
          :data-testid="`${testId}__figure`"
          :class="FIGURE_CLASS"
        >
          <span
            dir="ltr"
            :data-testid="`${testId}__value`"
            class="inline-flex min-w-0 flex-nowrap items-baseline gap-(--spacing-2xs) [unicode-bidi:isolate]"
          >
            <span
              v-if="item.prefix"
              class="text-(--text-default)"
              >{{ item.prefix }}</span
            >
            <span class="text-(--text-default)">{{ item.value }}</span>
            <span
              v-if="item.suffix"
              class="text-(--text-muted)"
              >{{ item.suffix }}</span
            >
          </span>
        </div>
        <figcaption class="text-overline-sm text-(--text-muted)">{{ item.label }}</figcaption>
      </figure>
    </CardGrid>
  </section>
</template>
