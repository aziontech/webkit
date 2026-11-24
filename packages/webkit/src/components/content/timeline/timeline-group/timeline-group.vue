<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useTimelineContext } from '../composables/use-timeline-context'

  defineOptions({
    name: 'TimelineGroup',
    inheritAttrs: false
  })

  export interface TimelineGroupProps {
    /** The period's header ("Today", "November 21, 2026"), formatted by the app. */
    label?: string
  }

  withDefaults(defineProps<TimelineGroupProps>(), {
    label: ''
  })

  defineSlots<{
    /** The Timeline.Item children of this period. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { size } = useTimelineContext()
  const labelId = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'timeline-group'
  )
</script>

<template>
  <li
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    data-slot="timeline-group"
    class="flex min-w-0 flex-col gap-(--spacing-sm) not-first:pt-(--spacing-md) data-[size=small]:gap-(--spacing-xs)"
  >
    <span
      :id="labelId"
      :data-testid="`${testId}__label`"
      data-slot="timeline-group-label"
      class="text-label-sm text-(--text-muted)"
      >{{ label }}</span
    >
    <ol
      :aria-labelledby="labelId"
      class="flex min-w-0 flex-col"
    >
      <slot />
    </ol>
  </li>
</template>
