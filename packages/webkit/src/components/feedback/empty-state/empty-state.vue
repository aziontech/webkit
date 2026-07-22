<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type EmptyStateSize = 'small' | 'medium'

  defineOptions({
    name: 'EmptyState',
    inheritAttrs: false
  })

  interface Props {
    /** Primary heading announcing the empty resource. */
    title: string
    /** Supporting body copy below the title. */
    description?: string
    /** PrimeIcons/Azion icon class for the standardized adornment (e.g. `pi pi-inbox`). When set, renders a size-scaled featured-icon tile; when empty and the `icon` slot is unused, no adornment renders. */
    icon?: string
    /** Size token; scales the whole block on one harmonic ramp — the adornment size, the title and description typography, the surrounding padding, and the gaps between adornment, text, and actions all step up together. */
    size?: EmptyStateSize
    /** When true, wraps the content in a bordered surface card; otherwise renders on a transparent background. */
    bordered?: boolean
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    icon: '',
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
    class="flex w-full flex-col items-center justify-center text-center data-[bordered]:rounded-[var(--shape-button)] data-[bordered]:border data-[bordered]:border-dashed data-[bordered]:border-[length:var(--border-width-default,1px)] data-[bordered]:border-[var(--border-default)] data-[bordered]:bg-[var(--bg-surface)] data-[size=small]:gap-[var(--spacing-4)] data-[size=small]:px-[var(--spacing-6)] data-[size=small]:py-[var(--spacing-8)] data-[size=medium]:gap-[var(--spacing-6)] data-[size=medium]:px-[var(--spacing-8)] data-[size=medium]:py-[var(--spacing-12)]"
  >
    <div
      v-if="$slots.icon || icon"
      :data-testid="`${testId}__icon`"
      :data-size="size"
      aria-hidden="true"
      class="group flex items-center justify-center"
    >
      <slot name="icon">
        <span
          class="relative flex items-center justify-center group-data-[size=small]:size-8 group-data-[size=medium]:size-10"
        >
          <span
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-5 group-data-[size=small]:size-12 group-data-[size=medium]:size-14"
          />
          <span
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-10 group-data-[size=small]:size-10 group-data-[size=medium]:size-12"
          />
          <span
            class="relative flex items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] group-data-[size=small]:size-8 group-data-[size=medium]:size-10"
          >
            <i
              :class="icon"
              class="leading-none text-[var(--text-default)] group-data-[size=small]:text-[length:0.875rem] group-data-[size=medium]:text-[length:1rem]"
            />
          </span>
        </span>
      </slot>
    </div>
    <div class="flex max-w-[var(--container-xl)] flex-col items-center gap-[var(--spacing-xs)]">
      <p
        :data-testid="`${testId}__title`"
        :data-size="size"
        class="text-[var(--text-default)] data-[size=small]:text-heading-xxs data-[size=medium]:text-heading-sm"
      >
        {{ title }}
      </p>
      <p
        v-if="description"
        :data-testid="`${testId}__description`"
        :data-size="size"
        class="text-[var(--text-muted)] data-[size=small]:text-body-xs data-[size=medium]:text-body-sm"
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
