<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'

  defineOptions({ name: 'PriorityTag', inheritAttrs: false })

  /** The priority scale of a ticket or task, from most to least urgent, plus no priority. */
  export type PriorityTagPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

  /** Size token. */
  export type PriorityTagSize = 'small' | 'medium'

  export interface PriorityTagProps {
    /** Priority level; sets the glyph (alert mark, filled bars or dashes) and the default label. */
    priority?: PriorityTagPriority
    /** Text of the tag. Empty uses the locale catalog (`Urgent`, `High`, `Medium`, `Low`, `No priority`). */
    label?: string
    /** Size token; `medium` is 24px tall, `small` is 20px. */
    size?: PriorityTagSize
  }

  const props = withDefaults(defineProps<PriorityTagProps>(), {
    priority: 'none',
    label: '',
    size: 'medium'
  })

  defineSlots<{
    /** Replaces the visible label text; the hidden prefix remains. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(() => String(attrs['data-testid'] ?? 'priority-tag'))

  const { t } = useTranslate({ priorityTag: en.priorityTag })

  const displayLabel = computed<string>(() => props.label || t(`priorityTag.${props.priority}`))

  const prefix = computed<string>(() => `${t('priorityTag.prefix')} `)

  const ROOT_CLASS =
    'group inline-flex items-center whitespace-nowrap h-6 ' +
    'data-[size=small]:h-5 ' +
    'px-(--spacing-xs) ' +
    'data-[size=small]:px-(--spacing-2xs) ' +
    'gap-(--spacing-xs) ' +
    'data-[size=small]:gap-(--spacing-2xs) ' +
    'rounded-(--shape-control) border border-(length:--border-width-default) border-(--border-default) bg-(--bg-canvas) text-(--text-default) text-label-sm'

  const BAR_CLASS =
    'block w-0.5 rounded-[1px] bg-(--border-default) ' +
    'group-data-[priority=none]:h-0.5 group-data-[priority=none]:bg-(--text-muted)'
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-priority="priority"
    :data-size="size"
    :class="[ROOT_CLASS, attrs.class]"
  >
    <i
      v-if="priority === 'urgent'"
      aria-hidden="true"
      :data-testid="`${testId}__glyph`"
      class="az az-circle-alert shrink-0 text-(--danger-mark)"
    />
    <span
      v-else
      aria-hidden="true"
      :data-testid="`${testId}__glyph`"
      class="inline-flex h-2.5 shrink-0 items-end gap-0.5 group-data-[priority=none]:items-center"
    >
      <span
        :class="BAR_CLASS"
        class="h-1.5 group-data-[priority=high]:bg-(--text-default) group-data-[priority=medium]:bg-(--text-default) group-data-[priority=low]:bg-(--text-default)"
      />
      <span
        :class="BAR_CLASS"
        class="h-2 group-data-[priority=high]:bg-(--text-default) group-data-[priority=medium]:bg-(--text-default)"
      />
      <span
        :class="BAR_CLASS"
        class="h-2.5 group-data-[priority=high]:bg-(--text-default)"
      />
    </span>
    <span :data-testid="`${testId}__label`">
      <span class="sr-only">{{ prefix }}</span>
      <slot>{{ displayLabel }}</slot>
    </span>
  </span>
</template>
