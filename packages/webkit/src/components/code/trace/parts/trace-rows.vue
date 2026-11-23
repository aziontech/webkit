<script setup lang="ts">
  import type { TracePlaced, TraceRow, TraceView } from '../types'

  defineOptions({ name: 'TraceRows', inheritAttrs: false })

  interface Props {
    /** The visible rows of the tree, in order. */
    rows: TraceRow[]
    /** Waterfall draws bars; tree prints the times. */
    layout: TraceView
    /** Key of the span that takes the tab stop. */
    tabStop: string
    /** Key of the selected span. */
    selectedKey: string
    /** Key of the slowest span, or empty. */
    slowestId: string
    /** Accessible name of the list. */
    label: string
    /** Id of the details that describe the list, or empty. */
    describedBy: string
    /** Accessible name of one span. */
    spanLabel: (item: TracePlaced) => string
    /** Formats a duration in milliseconds. */
    format: (ms: number) => string
    /** Test id of the owning Trace; each part appends its own name. */
    testId: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    toggle: [event: MouseEvent, row: TraceRow]
  }>()

  const ROW_CLASS =
    '[--trace-name:min(55%,13rem)] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] ' +
    'grid min-h-9 w-full cursor-pointer grid-cols-[var(--trace-name)_minmax(0,1fr)] ' +
    'data-[view=tree]:grid-cols-[minmax(0,1fr)_auto] ' +
    'items-stretch border-b border-(--border-muted) text-start transition-colors duration-150 ease-out ' +
    'last:border-b-0 hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none focus-visible:ring-inset ' +
    'data-selected:bg-(--bg-selected) ' +
    'motion-reduce:transition-none pointer-coarse:min-h-11'
  const NAME_CELL_CLASS =
    'flex min-w-0 items-center gap-(--spacing-2xs) border-e border-(--border-muted) py-(--spacing-xs) ps-[calc(var(--spacing-xs)+var(--trace-span-depth)*var(--spacing-md))] ' +
    'pe-(--spacing-sm)'
  const BAR_CLASS =
    'absolute inset-y-0 start-[calc(var(--trace-span-offset)*100%)] w-[calc(var(--trace-span-width)*100%)] rounded-(--shape-button) border ' +
    'data-outside:hidden ' +
    'data-[status=error]:border-(--danger-border) data-[status=error]:bg-(--danger) data-[status=success]:border-(--success-border) data-[status=success]:bg-(--success) ' +
    'data-root:data-[status=success]:border-(--info-border) data-root:data-[status=success]:bg-(--info) ' +
    'data-[status=running]:border-(--warning-border) data-[status=running]:bg-(--warning)'
  const BAR_DURATION_CLASS =
    'pointer-events-none absolute start-full top-1/2 ms-(--spacing-2xs) -translate-y-1/2 text-label-sm whitespace-nowrap tabular-nums ' +
    'data-flip:start-auto data-flip:end-full data-flip:ms-0 data-flip:me-(--spacing-2xs) ' +
    'data-wide:start-(--spacing-xs) data-wide:ms-0 ' +
    'data-[status=error]:text-(--danger-foreground) data-[status=success]:text-(--success-foreground) ' +
    'data-root:data-[status=success]:text-(--info-foreground) ' +
    'data-[status=running]:text-(--warning-foreground)'
</script>

<template>
  <div
    v-bind="$attrs"
    role="treegrid"
    :aria-label="label"
    :aria-describedby="describedBy || undefined"
    :data-testid="`${testId}__grid`"
    class="relative flex flex-col"
  >
    <div
      v-for="row in rows"
      :key="row.span.id"
      role="row"
      :tabindex="row.span.id === tabStop ? 0 : -1"
      :aria-level="row.depth + 1"
      :aria-posinset="row.posinset"
      :aria-setsize="row.setsize"
      :aria-expanded="row.hasChildren ? row.expanded : undefined"
      :aria-selected="row.span.id === selectedKey"
      :aria-label="spanLabel(row)"
      :data-span-id="row.span.id"
      :data-selected="row.span.id === selectedKey || null"
      :data-slowest="row.span.id === slowestId || null"
      :data-critical="row.critical || null"
      :data-testid="`${testId}__row`"
      :style="{
        '--trace-span-offset': String(row.offset),
        '--trace-span-width': String(row.width),
        '--trace-span-depth': String(row.depth)
      }"
      :data-view="layout"
      :class="ROW_CLASS"
    >
      <span
        role="gridcell"
        :class="NAME_CELL_CLASS"
      >
        <span
          v-if="row.hasChildren"
          :data-testid="`${testId}__toggle`"
          class="flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) hover:bg-(--bg-active) hover:text-(--text-default)"
          aria-hidden="true"
          @click.stop="(event: MouseEvent) => emit('toggle', event, row)"
        >
          <i
            :class="row.expanded ? 'az az-chevron-down' : 'az az-chevron-right rtl:-scale-x-100'"
            class="text-[0.7em]"
          />
        </span>
        <span
          v-else
          class="size-5 shrink-0"
          aria-hidden="true"
        />
        <i
          v-if="row.span.icon"
          :class="row.span.icon"
          class="shrink-0 text-[0.9em] leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span
          class="truncate text-body-code-sm text-(--text-default)"
          :title="row.span.name"
          :data-testid="`${testId}__name`"
          ><bdi>{{ row.span.name }}</bdi></span
        >
        <span
          v-if="row.span.service"
          class="hidden shrink-0 truncate text-label-sm text-(--text-muted) @3xl/trace:block"
          ><bdi>{{ row.span.service }}</bdi></span
        >
        <span
          v-if="row.span.status === 'error' || row.span.id === slowestId || row.critical"
          class="ms-auto flex shrink-0 items-center gap-(--spacing-2xs)"
          aria-hidden="true"
        >
          <i
            v-if="row.critical"
            class="az az-route text-(--text-default)"
            :data-testid="`${testId}__critical`"
          />
          <i
            v-if="row.span.id === slowestId"
            class="az az-clock text-(--text-default)"
            :data-testid="`${testId}__slowest`"
          />
          <i
            v-if="row.span.status === 'error'"
            class="az az-circle-alert text-(--danger-foreground)"
          />
        </span>
      </span>
      <span
        v-if="layout === 'tree'"
        role="gridcell"
        :data-testid="`${testId}__times`"
        class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-xs) text-label-sm tabular-nums"
      >
        <span class="w-20 text-end text-(--text-muted)">+{{ format(row.span.start) }}</span>
        <span
          :data-status="row.status"
          :data-root="row.root || null"
          class="w-20 text-end data-[status=error]:text-(--text-danger) data-[status=success]:text-(--text-default) data-[status=running]:text-(--warning-foreground)"
          >{{ format(row.span.duration) }}</span
        >
      </span>
      <span
        v-else
        role="gridcell"
        class="flex items-center px-(--spacing-md) py-(--spacing-xs)"
      >
        <span class="relative h-(--size-6) w-full">
          <span
            :data-status="row.status"
            :data-root="row.root || null"
            :data-outside="row.outside || null"
            :data-testid="`${testId}__bar`"
            :class="BAR_CLASS"
          >
            <span
              :data-status="row.status"
              :data-root="row.root || null"
              :data-wide="row.wide || null"
              :data-flip="row.flip || null"
              :class="BAR_DURATION_CLASS"
              aria-hidden="true"
              >{{ format(row.span.duration) }}</span
            >
          </span>
          <span
            v-for="stretch in row.path"
            :key="`path-${stretch.key}`"
            :style="{
              '--trace-path-offset': String(stretch.offset),
              '--trace-path-width': String(stretch.width)
            }"
            :data-testid="`${testId}__path`"
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-1 start-[calc(var(--trace-path-offset)*100%)] h-0.5 w-[calc(var(--trace-path-width)*100%)] rounded-full bg-(--text-default)"
          />
          <span
            v-for="mark in row.marks"
            :key="mark.key"
            :style="{ '--trace-event-at': String(mark.at) }"
            :data-testid="`${testId}__event`"
            aria-hidden="true"
            class="pointer-events-none absolute -inset-y-0.5 start-[calc(var(--trace-event-at)*100%)] -ms-px w-0.5 rounded-full bg-(--text-default) ring-1 ring-(--bg-surface)"
          />
        </span>
      </span>
    </div>
  </div>
</template>
