<script setup lang="ts">
  import type { TraceLane, TracePlaced, TraceSpan } from '../types'

  defineOptions({ name: 'TraceTimeline', inheritAttrs: false })

  interface Props {
    /** Spans packed into lanes by depth. */
    lanes: TraceLane[]
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
    /** The span does not match the search. */
    dimmed: (span: TraceSpan) => boolean
  }

  defineProps<Props>()

  const FLAME_BAR_CLASS =
    'absolute inset-y-0 start-[calc(var(--trace-span-offset)*100%)] flex w-[calc(var(--trace-span-width)*100%)] min-w-1 cursor-pointer items-center overflow-hidden ' +
    'rounded-(--shape-button) border transition-opacity duration-150 ease-out outline-offset-1 ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none motion-reduce:transition-none ' +
    'data-dimmed:opacity-40 ' +
    'data-outside:hidden ' +
    'data-selected:outline-2 data-selected:outline-(--border-selected) ' +
    'data-[status=error]:border-(--danger-border) data-[status=error]:bg-(--danger) data-[status=success]:border-(--success-border) data-[status=success]:bg-(--success) ' +
    'data-root:data-[status=success]:border-(--info-border) data-root:data-[status=success]:bg-(--info) ' +
    'data-[status=running]:border-(--warning-border) data-[status=running]:bg-(--warning)'
  const FLAME_BAR_LABEL_CLASS =
    'truncate px-(--spacing-xs) text-label-sm whitespace-nowrap tabular-nums ' +
    'data-[status=error]:text-(--danger-foreground) data-[status=success]:text-(--success-foreground) ' +
    'data-root:data-[status=success]:text-(--info-foreground) ' +
    'data-[status=running]:text-(--warning-foreground)'
</script>

<template>
  <div
    v-bind="$attrs"
    role="listbox"
    :aria-label="label"
    :aria-describedby="describedBy || undefined"
    :data-testid="`${testId}__timeline`"
    class="relative flex flex-col gap-(--spacing-xs) px-(--spacing-md) py-(--spacing-sm)"
  >
    <div
      v-for="(lane, index) in lanes"
      :key="lane.key"
      role="none"
      :data-level-start="(index > 0 && lanes[index - 1]?.depth !== lane.depth) || null"
      :data-testid="`${testId}__lane`"
      class="relative box-content h-(--size-6) pointer-coarse:h-(--size-11) data-level-start:border-t data-level-start:border-(--border-muted) data-level-start:pt-(--spacing-xs)"
    >
      <template
        v-for="item in lane.items"
        :key="item.span.id"
      >
        <span
          role="option"
          :tabindex="item.span.id === tabStop ? 0 : -1"
          :aria-selected="item.span.id === selectedKey"
          :aria-label="spanLabel(item)"
          :title="item.wide ? undefined : `${item.span.name} · ${format(item.span.duration)}`"
          :data-span-id="item.span.id"
          :data-status="item.status"
          :data-root="item.root || null"
          :data-outside="item.outside || null"
          :data-selected="item.span.id === selectedKey || null"
          :data-slowest="item.span.id === slowestId || null"
          :data-critical="item.critical || null"
          :data-dimmed="dimmed(item.span) || null"
          :data-testid="`${testId}__bar`"
          :style="{
            '--trace-span-offset': String(item.offset),
            '--trace-span-width': String(item.width)
          }"
          :class="FLAME_BAR_CLASS"
        >
          <span
            v-if="item.wide"
            :data-status="item.status"
            :data-root="item.root || null"
            aria-hidden="true"
            :class="FLAME_BAR_LABEL_CLASS"
            ><bdi>{{ item.span.name }}</bdi> · <bdi>{{ format(item.span.duration) }}</bdi></span
          >
        </span>
        <span
          v-for="stretch in item.path"
          :key="`path-${item.span.id}-${stretch.key}`"
          :style="{
            '--trace-path-offset': String(stretch.offset),
            '--trace-path-width': String(stretch.width)
          }"
          :data-testid="`${testId}__path`"
          aria-hidden="true"
          class="pointer-events-none absolute -bottom-1 start-[calc(var(--trace-path-offset)*100%)] h-0.5 w-[calc(var(--trace-path-width)*100%)] rounded-full bg-(--text-default)"
        />
        <span
          v-for="mark in item.marks"
          :key="`event-${item.span.id}-${mark.key}`"
          :style="{ '--trace-event-at': String(mark.at) }"
          :data-testid="`${testId}__event`"
          aria-hidden="true"
          class="pointer-events-none absolute -inset-y-0.5 start-[calc(var(--trace-event-at)*100%)] -ms-px w-0.5 rounded-full bg-(--text-default) ring-1 ring-(--bg-surface)"
        />
      </template>
    </div>
  </div>
</template>
