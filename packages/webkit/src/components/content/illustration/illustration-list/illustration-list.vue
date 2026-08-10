<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationList',
    inheritAttrs: false
  })

  export interface IllustrationListRow {
    /** Left cell — what the row is. */
    label: string
    /** Middle cell — the row's identifier or value. */
    value: string
    /** Right cell — the row's state. */
    status: string
  }

  interface Props {
    /** Rows to render, in order. */
    rows?: IllustrationListRow[]
    /** Index of the row to emphasize; -1 emphasizes none. */
    highlight?: number
    /** Draws every row rule in the brand color; inherits the scene emphasis when omitted. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    rows: () => [],
    highlight: -1,
    active: undefined
  })

  const attrs = useAttrs()

  // A list is sized by its rows and the scene that places it, so it takes no `size`.
  const { size, active } = useIllustrationContext(
    () => undefined,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-list'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // Rows of mono text divided by hairline rules — a table reduced to the shape of one. The
  // highlighted row takes the brand fill so a scene can point at a single record.
  const ROOT_CLASS = 'block w-full shrink-0'

  const ROW_CLASS =
    'grid w-full grid-cols-[1fr_1.4fr_0.8fr] items-center gap-[var(--spacing-xxs)] border-b-[length:var(--illustration-rim-width-hairline)] border-solid border-[var(--border-default)] px-[var(--spacing-xxs)] py-[var(--spacing-xxs)] text-label-code-sm text-[length:var(--illustration-label-small)] leading-none text-[var(--text-muted)] data-[highlight]:bg-[var(--primary)] data-[highlight]:text-[var(--primary-contrast)]'

  const LABEL_CLASS =
    'truncate uppercase text-[var(--text-default)] group-data-[highlight]/row:text-[var(--primary-contrast)]'

  const STATUS_CLASS = 'truncate text-right'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <span
    :data-testid="testId"
    :data-size="size"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <span
      v-for="(row, index) in rows"
      :key="row.label"
      class="group/row"
      :class="ROW_CLASS"
      :data-highlight="index === highlight || null"
      :data-testid="`${testId}__row`"
    >
      <span :class="LABEL_CLASS">{{ row.label }}</span>
      <span class="truncate">{{ row.value }}</span>
      <span :class="STATUS_CLASS">{{ row.status }}</span>
    </span>
  </span>
</template>
