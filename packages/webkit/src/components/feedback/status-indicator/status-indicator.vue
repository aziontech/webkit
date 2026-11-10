<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'StatusIndicator',
    inheritAttrs: false
  })

  /** Severity token driving the status dot color. */
  export type StatusIndicatorSeverity =
    'success' | 'info' | 'neutral' | 'warning' | 'alt' | 'danger'

  interface Props {
    /** Severity token driving the status dot color. */
    severity?: StatusIndicatorSeverity
    /** Pulses the dot while the status is still in progress. */
    loading?: boolean
    /** Visible label text naming the status, in sentence case. */
    label?: string
  }

  withDefaults(defineProps<Props>(), {
    severity: 'success',
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
    :data-severity="severity"
    :data-loading="loading || null"
    class="inline-flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)"
  >
    <span
      aria-hidden="true"
      :data-testid="`${testId}__dot`"
      :data-severity="severity"
      :data-loading="loading || null"
      class="size-2.5 shrink-0 rounded-full data-[loading]:animate-pulse motion-reduce:animate-none data-[severity=success]:bg-(--success-contrast) data-[severity=info]:bg-(--info-contrast) data-[severity=neutral]:bg-(--text-muted) data-[severity=warning]:bg-(--warning-contrast) data-[severity=alt]:bg-(--primary) data-[severity=danger]:bg-(--danger-contrast)"
    />
    <span
      class="whitespace-nowrap"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>
  </div>
</template>
