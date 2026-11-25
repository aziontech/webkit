<script setup lang="ts">
  import Checkbox from '../../../input/checkbox/checkbox.vue'
  import ScrollArea from '../../../layout/scroll-area/scroll-area.vue'
  import SlotOutlet from '../../table/parts/slot-outlet'
  import TableCaption from '../../table/table-caption/table-caption.vue'
  import { useDataTableContext } from '../composables/use-data-table-context'
  import { FADE_END_CLASS, FADE_START_CLASS } from '../lib/data-table-classes'
  import DataTableHead from './data-table-head.vue'
  import DataTableRows from './data-table-rows.vue'
  import DataTableSkeleton from './data-table-skeleton.vue'
  import DataTableStates from './data-table-states.vue'

  defineOptions({ name: 'DataTableViewport' })

  const { view, loadMore } = useDataTableContext()
  const {
    testId,
    slots,
    hasSlot,
    t,
    props,
    stacked,
    rowTotal,
    tableAttrs,
    selectAllId,
    pageSelection,
    toggleAllPageRows,
    setViewportEl,
    viewportHeight,
    overflowStart,
    overflowEnd,
    overflowEndInset,
    onViewportScroll,
    treeActive,
    rowFocusActive,
    windowed
  } = view
  const { loading: loadingMore } = loadMore
</script>

<template>
  <div
    :data-testid="`${testId}__scroll`"
    :data-overflow-start="overflowStart > 0 ? '' : undefined"
    :data-overflow-end="overflowEnd > 0 ? '' : undefined"
    class="group/scroll relative flex min-h-0 min-w-0 flex-col"
  >
    <ScrollArea
      :ref="setViewportEl"
      :orientation="viewportHeight ? 'both' : 'horizontal'"
      :data-testid="`${testId}__viewport`"
      class="min-w-0 max-h-(--table-viewport-height)"
      @scroll.passive="onViewportScroll"
    >
      <div
        class="flex w-max min-w-full flex-col"
        :class="stacked ? 'w-full!' : undefined"
      >
        <div
          v-if="stacked && props.selectable && !props.loading && rowTotal > 0"
          :data-testid="`${testId}__stacked-select-all`"
          class="flex min-h-10 items-center gap-(--spacing-xs) px-(--spacing-sm) pt-(--spacing-xs)"
        >
          <Checkbox
            :id="selectAllId"
            :model-value="pageSelection === 'all'"
            :indeterminate="pageSelection === 'some'"
            @update:model-value="(v) => toggleAllPageRows(!!v)"
          />
          <label
            :for="selectAllId"
            class="cursor-pointer text-label-sm text-(--text-default)"
            >{{ t('table.selectAll') }}</label
          >
        </div>
        <div
          v-bind="tableAttrs()"
          :role="treeActive ? 'treegrid' : 'table'"
          :data-tree="treeActive || undefined"
          :tabindex="rowFocusActive ? -1 : undefined"
          :data-focus-table="rowFocusActive || undefined"
          :data-testid="`${testId}__table`"
          :aria-busy="props.loading || loadingMore || undefined"
          :aria-rowcount="windowed ? rowTotal + 1 : undefined"
          class="flex w-full flex-col outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color)"
        >
          <TableCaption v-if="hasSlot('caption')">
            <SlotOutlet
              :slots="slots"
              name="caption"
            />
          </TableCaption>
          <template v-if="props.columns.length > 0">
            <DataTableHead />
            <DataTableSkeleton v-if="props.loading" />
            <DataTableRows />
          </template>
        </div>
      </div>
      <SlotOutlet
        v-if="hasSlot('load-more')"
        :slots="slots"
        name="load-more"
      />
      <DataTableStates />
    </ScrollArea>
    <span
      aria-hidden="true"
      :data-testid="`${testId}__fade-start`"
      :style="{ width: `${overflowStart}px` }"
      :class="FADE_START_CLASS"
    />
    <span
      aria-hidden="true"
      :data-testid="`${testId}__fade-end`"
      :style="{ insetInlineEnd: `${overflowEndInset}px`, width: `${overflowEnd}px` }"
      :class="FADE_END_CLASS"
    />
  </div>
</template>
