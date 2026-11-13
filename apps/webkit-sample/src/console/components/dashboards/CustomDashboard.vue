<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, ref, watch } from 'vue'

  import {
    clearCustomLayout,
    CUSTOM_HEIGHT,
    CUSTOM_SPAN,
    defaultCustomLayout,
    isDefaultCustomLayout,
    loadCustomLayout,
    resolveCustomCard,
    saveCustomLayout
  } from '../../lib/data/dashboards/custom'
  import MetricPlot from '../observability/MetricPlot.vue'

  type MoveDirection = 'up' | 'down' | 'left' | 'right'

  interface LayoutCard {
    id: string
    span: number
    height?: number
  }

  interface Props {
    /** Selected period, such as 24h. */
    period: string
    /** The comparison period read after each delta. */
    comparison: string
    /** Renders every card in its loading state. */
    loading?: boolean
    /** Marks the cards as refreshing their data. */
    refetching?: boolean
    /** Renders every card as having no data. */
    empty?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    refetching: false,
    empty: false
  })

  const editing = ref(false)
  const layout = ref<LayoutCard[]>(loadCustomLayout() ?? defaultCustomLayout())
  const from = ref(-1)
  const announcement = ref('')
  const gridRef = ref<globalThis.HTMLElement | null>(null)

  const reports = computed(() =>
    Object.fromEntries(
      layout.value.map((card) => [
        card.id,
        resolveCustomCard(card.id, props.period, { empty: props.empty })
      ])
    )
  )

  const customized = computed(() => !isDefaultCustomLayout(layout.value))

  watch(
    layout,
    (next) => {
      if (isDefaultCustomLayout(next)) clearCustomLayout()
      else saveCustomLayout(next)
    },
    { deep: true }
  )

  const sizeLabel = (card: LayoutCard) =>
    card.height === undefined
      ? `${card.span} of ${CUSTOM_SPAN.max} columns`
      : `${card.span} of ${CUSTOM_SPAN.max} columns, ${card.height} px`

  function focusHandle(id: string) {
    gridRef.value
      ?.querySelector<globalThis.HTMLElement>(
        `[data-card-id="${id}"] [data-testid$="__drag-handle"]`
      )
      ?.focus()
  }

  function reorder(to: number) {
    const index = from.value
    from.value = -1
    if (index < 0 || index === to) return
    const next = [...layout.value]
    const [card] = next.splice(index, 1)
    next.splice(to, 0, card)
    layout.value = next
    announcement.value = `${reports.value[card.id].label} moved to position ${to + 1} of ${next.length}.`
  }

  async function move(index: number, direction: MoveDirection) {
    const to = index + (direction === 'up' || direction === 'left' ? -1 : 1)
    if (to < 0 || to >= layout.value.length) return
    const { id } = layout.value[index]
    from.value = index
    reorder(to)
    await nextTick()
    focusHandle(id)
  }

  function announceSize(card: LayoutCard) {
    announcement.value = `${reports.value[card.id].label} resized to ${sizeLabel(card)}.`
  }

  function reset() {
    layout.value = defaultCustomLayout()
    announcement.value = 'Layout reset to the default.'
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <p
        v-if="editing"
        class="m-0 min-w-0 grow text-body-sm text-(--text-muted)"
      >
        Drag a card by its handle to move it, or by its corner to resize it. Focus a handle to use
        the arrow keys.
      </p>
      <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
        <Button
          v-if="customized"
          label="Reset layout"
          kind="text"
          size="medium"
          icon="pi pi-replay"
          @click="reset"
        />
        <Button
          :label="editing ? 'Done' : 'Edit layout'"
          :kind="editing ? 'primary' : 'outlined'"
          size="medium"
          :icon="editing ? 'pi pi-check' : 'pi pi-th-large'"
          :aria-pressed="editing"
          @click="editing = !editing"
        />
      </div>
    </div>

    <div
      ref="gridRef"
      class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
    >
      <ChartCard
        v-for="(card, index) in layout"
        :key="card.id"
        v-model:span="card.span"
        v-model:height="card.height"
        :data-card-id="card.id"
        :draggable="editing"
        :resizable="editing"
        :min-span="CUSTOM_SPAN.min"
        :max-span="CUSTOM_SPAN.max"
        :min-height="CUSTOM_HEIGHT.min"
        :max-height="CUSTOM_HEIGHT.max"
        @drag-start="from = index"
        @dragover.prevent
        @drop="reorder(index)"
        @move="(event, direction) => move(index, direction)"
        @resize-end="announceSize(card)"
      >
        <ChartCard.Header>
          <ChartCard.DragHandle :aria-label="`Move ${reports[card.id].label}`" />
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>{{ reports[card.id].label }}</ChartCard.Title>
            <Hint :text="reports[card.id].description" />
          </span>
          <ChartCard.Controls v-if="editing">
            <Tag
              :label="`${card.span}/${CUSTOM_SPAN.max}`"
              severity="secondary"
              size="small"
              icon="pi pi-arrows-h"
            />
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <MetricPlot
            :report="reports[card.id]"
            :loading="loading"
            :refetching="refetching"
          />
        </ChartCard.Content>
        <ChartCard.ResizeHandle :aria-label="`Resize ${reports[card.id].label}`" />
      </ChartCard>
    </div>

    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ announcement }}
    </p>
  </div>
</template>
