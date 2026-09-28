<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import CardGrid, {
    type CardGridColumns,
    type CardGridMobileColumns
  } from '../card-grid/card-grid.vue'

  defineOptions({
    name: 'BigNumbers',
    inheritAttrs: false
  })

  /** One headline figure and the caption naming what it measures. */
  export type BigNumberItem = {
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
  export type BigNumbersSize = 'small' | 'medium' | 'large'

  interface Props {
    /** The figures rendered as cells, in order; each item is a value, a label, and an optional prefix and suffix — the figure, its caption, and the qualifier and unit set beside it. */
    items?: BigNumberItem[]
    /** Size token; picks the big-number scale the figures are set at. */
    size?: BigNumbersSize
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    size: 'medium'
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-big-numbers'
  )

  const hasItems = computed(() => props.items.length > 0)

  // The divider grid paints its own background through EVERY track, so a column count the
  // figures do not fill leaves a cell painted in the seam colour. The band picks the count
  // that leaves the fewest cells empty, widest first — 4 figures still fan out to four.
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
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="group"
  >
    <CardGrid
      v-if="hasItems"
      kind="divider"
      :columns="columns"
      :mobile-columns="mobileColumns"
    >
      <figure
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="m-0 flex h-full flex-col justify-center gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
      >
        <div
          class="flex items-end gap-(--spacing-xxs) group-data-[size=large]:text-big-number-lg group-data-[size=medium]:text-big-number-md group-data-[size=small]:text-big-number-sm"
        >
          <span
            v-if="item.prefix"
            class="text-(--primary)"
            >{{ item.prefix }}</span
          >
          <span class="text-(--text-default)">{{ item.value }}</span>
          <span
            v-if="item.suffix"
            class="text-(--text-muted)"
            >{{ item.suffix }}</span
          >
        </div>
        <figcaption class="text-overline-sm text-(--text-muted)">{{ item.label }}</figcaption>
      </figure>
    </CardGrid>
  </section>
</template>
