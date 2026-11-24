<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { TimelineInjectionKey, type TimelineSize, type TimelineTimeFormat } from './injection-key'

  defineOptions({
    name: 'Timeline',
    inheritAttrs: false
  })

  export type { TimelineSize, TimelineTimeFormat }

  export interface TimelineProps {
    /** Density of every item: `small` for a side panel or drawer, `medium` for a page body. */
    size?: TimelineSize
    /** How every item's `time` reads, passed to `Timestamp` as its `format`. */
    timeFormat?: TimelineTimeFormat
    /** Renders three placeholder items in place of the slot while the history loads; sets `aria-busy`. */
    loading?: boolean
    /** What a screen reader hears while loading. Empty uses the locale catalog (`Loading activity`). */
    loadingLabel?: string
    /** Accessible name of the list. Empty uses the locale catalog (`Activity`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<TimelineProps>(), {
    size: 'medium',
    timeFormat: 'local',
    loading: false,
    loadingLabel: '',
    ariaLabel: ''
  })

  defineSlots<{
    /** Timeline.Item children, or Timeline.Group children, in display order. Hidden while loading. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ timeline: en.timeline })

  provide(TimelineInjectionKey, {
    size: computed(() => props.size),
    timeFormat: computed(() => props.timeFormat)
  })

  const testId = computed(() => String(attrs['data-testid'] ?? 'timeline'))

  const PLACEHOLDERS = [1, 2, 3]
</script>

<template>
  <ol
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-loading="loading || null"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel || t('timeline.label')"
    data-slot="timeline"
    data-orientation="vertical"
    class="flex w-full min-w-0 flex-col"
  >
    <template v-if="loading">
      <li class="sr-only">{{ loadingLabel || t('timeline.loading') }}</li>
      <li
        v-for="placeholder in PLACEHOLDERS"
        :key="placeholder"
        :data-testid="`${testId}__loading`"
        aria-hidden="true"
        class="flex gap-x-(--spacing-sm) pb-(--spacing-md) last:pb-0 data-[size=small]:gap-x-(--spacing-xs)"
        :data-size="size"
      >
        <span class="flex size-6 shrink-0 items-center justify-center">
          <Skeleton
            variant="circle"
            width="0.625rem"
            height="0.625rem"
          />
        </span>
        <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-(--spacing-2xs)">
          <Skeleton
            width="60%"
            height="0.875rem"
          />
          <Skeleton
            width="35%"
            height="0.75rem"
          />
        </span>
      </li>
    </template>
    <slot v-else />
  </ol>
</template>
