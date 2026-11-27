<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  defineOptions({
    name: 'ConversationHistorySection',
    inheritAttrs: false
  })

  export interface ConversationHistorySectionProps {
    /** Visible name of the section and of its header button. */
    label: string
    /** Whether the section is expanded. */
    open?: boolean
    /** Number shown after the label; below zero shows none. */
    count?: number
    /** Keeps the content mounted while collapsed. */
    eager?: boolean
  }

  withDefaults(defineProps<ConversationHistorySectionProps>(), {
    open: true,
    count: -1,
    eager: false
  })

  const emit = defineEmits<{
    toggle: [event: MouseEvent]
  }>()

  defineSlots<{
    /** The section's content; receives the id of the header that names it. */
    default(props: { labelId: string }): unknown
    /** Buttons after the header. */
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const uid = useId()

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-section'
  })

  const HEADER_CLASS =
    'group relative flex h-8 pointer-coarse:min-h-11 min-w-0 flex-1 items-center gap-(--spacing-2xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 pe-(--spacing-xs) py-(--spacing-2xs) ps-(--spacing-sm) text-start text-label-sm text-(--text-muted) ' +
    'transition-colors motion-reduce:transition-none hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:bg-(--bg-hover) focus-visible:text-(--text-default) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col"
    :data-testid="testId"
    :data-state="open ? 'open' : 'closed'"
  >
    <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
      <button
        :id="`${uid}-header`"
        type="button"
        :aria-expanded="open"
        :aria-controls="`${uid}-content`"
        :aria-label="count >= 0 ? `${label} ${count}` : undefined"
        :class="HEADER_CLASS"
        :data-testid="`${testId}__header`"
        @click="(event: MouseEvent) => emit('toggle', event)"
      >
        <span class="min-w-0 truncate">{{ label }}</span>
        <span
          v-if="count >= 0"
          class="shrink-0 tabular-nums"
          :data-testid="`${testId}__count`"
          >{{ count }}</span
        >
        <i
          :class="open ? 'az az-chevron-down' : 'az az-chevron-right'"
          class="shrink-0"
          aria-hidden="true"
        />
      </button>
      <slot name="actions" />
    </div>
    <div
      v-show="open"
      :id="`${uid}-content`"
      class="flex flex-col"
    >
      <slot
        v-if="open || eager"
        :label-id="`${uid}-header`"
      />
    </div>
  </div>
</template>
