<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'

  export type StatusIndicatorStatus = 'positive' | 'info' | 'neutral' | 'warning' | 'alt' | 'danger'

  defineOptions({
    name: 'StatusIndicator',
    inheritAttrs: false
  })

  interface Props {
    /** status. */
    status?: StatusIndicatorStatus
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** Visible label text. */
    label?: string
  }

  withDefaults(defineProps<Props>(), {
    status: 'positive',
    loading: false,
    label: 'Status'
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-status-indicator'
  )
</script>

<template>
  <div
    v-bind="attrs"
    role="status"
    :aria-busy="loading || undefined"
    :data-testid="testId"
    :data-status="status"
    :data-loading="loading || null"
    class="group inline-flex items-center gap-[var(--spacing-3)] rounded-[var(--shape-elements)] bg-[var(--bg-surface)] p-[var(--spacing-3)] text-body-sm text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
  >
    <Spinner
      v-if="loading"
      class="size-3 shrink-0 text-[var(--text-default)]"
      :data-testid="`${testId}__spinner`"
    />
    <span
      v-else
      aria-hidden="true"
      :data-testid="`${testId}__dot`"
      :data-status="status"
      class="size-2 shrink-0 rounded-full data-[status=positive]:bg-[var(--success-contrast)] data-[status=info]:bg-[var(--info-contrast)] data-[status=neutral]:bg-[var(--text-muted)] data-[status=warning]:bg-[var(--warning-contrast)] data-[status=alt]:bg-[var(--primary)] data-[status=danger]:bg-[var(--danger-contrast)]"
    />
    <span
      class="whitespace-nowrap group-data-[loading]:text-[var(--text-muted)]"
      :data-testid="`${testId}__label`"
    >
      {{ loading ? `${label}...` : label }}
    </span>
  </div>
</template>
