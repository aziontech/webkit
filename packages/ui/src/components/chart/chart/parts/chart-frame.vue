<script setup lang="ts">
  import { computed } from 'vue'

  import Alert from '../../../feedback/alert/alert.vue'
  import EmptyState from '../../../feedback/empty-state/empty-state.vue'

  defineOptions({ name: 'ChartFrame' })

  interface Props {
    /** Shows the loading slot and marks the figure busy. */
    loading: boolean
    /** Holds the previous render at reduced opacity while new data loads. */
    refetching: boolean
    /** Error message; when set, a danger Alert replaces the plot. */
    error: string
    /** There is a value to draw; when false the empty state replaces the plot. */
    drawable: boolean
    /** Shows the table slot in place of the plot. */
    tableView: boolean
    /** Title of the empty state. */
    emptyTitle: string
    /** Supporting line under the empty title. */
    emptyDescription: string
    /** Icon of the empty state. */
    emptyIcon: string
    /** Classes of the box that holds the error or the empty state. */
    stateClass: string
    /** Size of the chart, mirrored on the state box for its size variants. */
    stateSize?: string
    /** Id of the screen-reader summary. */
    summaryId: string
    /** Screen-reader summary of the data. */
    summary: string
    /** Id of the live region; empty leaves it without one. */
    liveId?: string
    /** Text the live region announces. */
    announcement: string
    /** Test id of the chart, the prefix of the inner ids. */
    testId: string
  }

  const props = withDefaults(defineProps<Props>(), { stateSize: '', liveId: '' })

  defineSlots<{
    /** The plot, shown when there is data and no other state. */
    default(): unknown
    /** Placeholder while loading. */
    loading(): unknown
    /** The visible data table. */
    table(): unknown
    /** The screen-reader copy of the data next to the plot. */
    twin(): unknown
    /** Replaces the default danger Alert. */
    error(): unknown
    /** Replaces the default EmptyState. */
    empty(): unknown
    /** Actions under the default EmptyState. */
    'empty-actions'(): unknown
  }>()

  const hasError = computed(() => !props.loading && props.error.length > 0)
  const isEmpty = computed(() => !props.loading && !hasError.value && !props.drawable)
  const showPlot = computed(
    () => !props.loading && !hasError.value && !isEmpty.value && !props.tableView
  )
</script>

<template>
  <figure
    data-plain-ground
    :data-loading="loading || null"
    :data-error="hasError || null"
    :data-empty="isEmpty || null"
    :data-refetching="refetching || null"
    :data-table-view="tableView || null"
    :aria-busy="loading || refetching || undefined"
    class="m-0 min-w-0"
  >
    <slot
      v-if="loading"
      name="loading"
    />
    <div
      v-else-if="hasError || isEmpty"
      :data-error="hasError || null"
      :data-size="stateSize || null"
      :class="stateClass"
      class="flex not-data-[error]:items-stretch data-[error]:items-center data-[error]:justify-center data-[error]:p-(--spacing-md)"
    >
      <slot
        v-if="hasError"
        name="error"
      >
        <Alert
          severity="danger"
          :label="error"
          :data-testid="`${testId}__error`"
        />
      </slot>
      <slot
        v-else
        name="empty"
      >
        <EmptyState
          :title="emptyTitle"
          :description="emptyDescription"
          :icon="emptyIcon"
          size="small"
          bordered
          :data-testid="`${testId}__empty`"
        >
          <template
            v-if="$slots['empty-actions']"
            #actions
          >
            <slot name="empty-actions" />
          </template>
        </EmptyState>
      </slot>
    </div>
    <slot
      v-else-if="tableView"
      name="table"
    />
    <slot v-else />

    <p
      :id="summaryId"
      class="sr-only"
    >
      {{ summary }}
    </p>
    <p
      :id="liveId || undefined"
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__live`"
    >
      {{ announcement }}
    </p>
    <div
      v-if="showPlot"
      class="sr-only"
    >
      <slot name="twin" />
    </div>
  </figure>
</template>
