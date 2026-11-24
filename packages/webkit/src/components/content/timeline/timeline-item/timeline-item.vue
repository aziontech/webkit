<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { Severity } from '../../../../utils/severity'
  import Timestamp from '../../timestamp/timestamp.vue'
  import { useTimelineContext } from '../composables/use-timeline-context'

  defineOptions({
    name: 'TimelineItem',
    inheritAttrs: false
  })

  /** What an event means for the reader; colours its marker. */
  export type TimelineItemSeverity = Severity

  export interface TimelineItemProps {
    /** What happened, in plain words ("Status changed to Solved"). */
    title?: string
    /** One or two lines of detail under the title. */
    description?: string
    /** Who did it (a person, a team or a system); shown before the time. */
    actor?: string
    /** When it happened, rendered by `Timestamp` in the root's `timeFormat`; a `Date`, an epoch or an ISO string. Absent renders no time. */
    time?: string | number | Date
    /** What the event means for the reader; colours the marker with its `-mark` token. */
    severity?: TimelineItemSeverity
    /** Icon class (`az az-clock`) drawn as the marker instead of the dot. */
    icon?: string
  }

  const props = withDefaults(defineProps<TimelineItemProps>(), {
    title: '',
    description: '',
    actor: '',
    time: undefined,
    severity: 'neutral',
    icon: ''
  })

  const slots = defineSlots<{
    /** Content under the description: a quoted comment, a link, a small key-value list. */
    default?(): unknown
    /** Replaces the dot or icon (an Avatar, an OutcomeIcon), sized by the app to the marker box. */
    marker?(): unknown
  }>()

  const attrs = useAttrs()
  const { size, timeFormat } = useTimelineContext()

  const testId = computed(() => String(attrs['data-testid'] ?? 'timeline-item'))

  const hasTime = computed(() => props.time !== undefined && props.time !== '')

  const marker = () => {
    if (slots.marker) return 'custom'
    return props.icon ? 'icon' : 'dot'
  }

  const hasBody = () => Boolean(slots.default)

  const MARKER_CLASS =
    'flex size-6 shrink-0 items-center justify-center text-(--text-muted) group-data-[size=small]/item:size-5 ' +
    'group-data-[severity=info]/item:text-(--info-mark) group-data-[severity=success]/item:text-(--success-mark) ' +
    'group-data-[severity=warning]/item:text-(--warning-mark) group-data-[severity=danger]/item:text-(--danger-mark)'

  const CONTENT_CLASS =
    'flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) group-not-last/item:pb-(--timeline-item-gap)'

  const HEADER_CLASS =
    'flex min-h-6 min-w-0 flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs) ' +
    'group-data-[size=small]/item:min-h-5'
</script>

<template>
  <li
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-severity="severity"
    :data-marker="marker()"
    data-slot="timeline-item"
    class="group/item flex min-w-0 gap-x-(--spacing-sm) [--timeline-item-gap:var(--spacing-md)] data-[size=small]:gap-x-(--spacing-xs) data-[size=small]:[--timeline-item-gap:var(--spacing-sm)]"
  >
    <span
      aria-hidden="true"
      class="flex shrink-0 flex-col items-center"
    >
      <span
        :data-testid="`${testId}__marker`"
        data-slot="timeline-marker"
        :class="MARKER_CLASS"
      >
        <slot name="marker">
          <i
            v-if="icon"
            :class="icon"
            class="text-label-md group-data-[size=small]/item:text-label-sm"
          />
          <span
            v-else
            class="size-2.5 rounded-full bg-current group-data-[size=small]/item:size-2"
          />
        </slot>
      </span>
      <span
        data-slot="timeline-connector"
        class="mt-(--spacing-2xs) w-px flex-1 bg-(--border-default) group-last/item:hidden"
      />
    </span>
    <div :class="CONTENT_CLASS">
      <div :class="HEADER_CLASS">
        <span
          :data-testid="`${testId}__title`"
          data-slot="timeline-title"
          class="min-w-0 break-words text-label-md text-(--text-default) group-data-[size=small]/item:text-label-sm"
          >{{ title }}</span
        >
        <span
          v-if="actor || hasTime"
          data-slot="timeline-meta"
          class="inline-flex min-w-0 flex-wrap items-center gap-x-(--spacing-xs) text-body-sm text-(--text-muted) group-data-[size=small]/item:text-body-xs"
        >
          <bdi v-if="actor">{{ actor }}</bdi>
          <Timestamp
            v-if="hasTime"
            :value="time"
            :format="timeFormat"
          />
        </span>
      </div>
      <p
        v-if="description"
        data-slot="timeline-description"
        class="break-words text-body-sm text-(--text-muted) group-data-[size=small]/item:text-body-xs"
      >
        {{ description }}
      </p>
      <div
        v-if="hasBody()"
        data-slot="timeline-body"
        class="min-w-0 break-words text-body-sm text-(--text-default) group-data-[size=small]/item:text-body-xs"
      >
        <slot />
      </div>
    </div>
  </li>
</template>
