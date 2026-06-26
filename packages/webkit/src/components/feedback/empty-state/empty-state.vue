<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import EmptyStateIllustration from './empty-state-illustration/empty-state-illustration.vue'

  export type EmptyStateSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'EmptyState',
    inheritAttrs: false
  })

  interface Props {
    /** Primary heading announcing the empty resource. */
    title: string
    /** Supporting body copy below the title. */
    description?: string
    /** Size token; affects the illustration size, the surrounding padding, and the gaps between illustration, text, and actions. */
    size?: EmptyStateSize
    /** When true, wraps the content in a bordered surface card; otherwise renders on a transparent background. */
    bordered?: boolean
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    size: 'medium',
    bordered: false
  })

  defineSlots<{
    icon(): unknown
    actions(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-empty-state'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="status"
    :data-testid="testId"
    :data-size="size"
    :data-bordered="bordered || null"
    class="flex w-full flex-col items-center justify-center text-center data-[bordered]:rounded-[var(--shape-button)] data-[bordered]:border data-[bordered]:border-[length:var(--border-width-default,1px)] data-[bordered]:border-[var(--border-default)] data-[bordered]:bg-[var(--bg-surface)] data-[size=small]:gap-[var(--spacing-4)] data-[size=small]:px-[var(--spacing-6)] data-[size=small]:py-[var(--spacing-8)] data-[size=medium]:gap-[var(--spacing-6)] data-[size=medium]:px-[var(--spacing-8)] data-[size=medium]:py-[var(--spacing-12)] data-[size=large]:gap-[var(--spacing-8)] data-[size=large]:px-[var(--spacing-12)] data-[size=large]:py-[var(--spacing-16)]"
  >
    <div
      :data-testid="`${testId}__icon`"
      :data-size="size"
      aria-hidden="true"
      class="flex items-center justify-center data-[size=small]:w-[144px] data-[size=medium]:w-[192px] data-[size=large]:w-[240px]"
    >
      <slot name="icon">
        <EmptyStateIllustration />
      </slot>
    </div>
    <div class="flex max-w-[var(--container-xl)] flex-col items-center gap-[var(--spacing-xs)]">
      <p
        :data-testid="`${testId}__title`"
        class="text-body-sm text-[var(--text-default)]"
      >
        {{ title }}
      </p>
      <p
        v-if="description"
        :data-testid="`${testId}__description`"
        class="text-body-xs text-[var(--text-muted)]"
      >
        {{ description }}
      </p>
    </div>
    <div
      v-if="$slots['actions']"
      :data-testid="`${testId}__actions`"
      class="flex flex-col items-center gap-[var(--spacing-xs)]"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
