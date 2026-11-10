<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'

  export type StatusIndicatorSeverity =
    'success' | 'info' | 'neutral' | 'warning' | 'alt' | 'danger'

  defineOptions({
    name: 'StatusIndicator',
    inheritAttrs: false
  })

  interface Props {
    /** severity. */
    severity?: StatusIndicatorSeverity
    /** Shows loading state and disables activation. */
    loading?: boolean
    /** Visible label text. */
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
    class="group inline-flex items-center gap-(--spacing-3) rounded-(--shape-elements) text-body-sm text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
  >
    <Spinner
      v-if="loading"
      class="size-3 shrink-0 text-(--text-default)"
      :data-testid="`${testId}__spinner`"
    />
    <span
      v-else
      aria-hidden="true"
      :data-testid="`${testId}__dot`"
      :data-severity="severity"
      class="size-2 shrink-0 rounded-full data-[severity=success]:bg-(--success-contrast) data-[severity=info]:bg-(--info-contrast) data-[severity=neutral]:bg-(--text-muted) data-[severity=warning]:bg-(--warning-contrast) data-[severity=alt]:bg-(--primary) data-[severity=danger]:bg-(--danger-contrast)"
    />
    <span
      class="whitespace-nowrap group-data-[loading]:text-(--text-muted)"
      :data-testid="`${testId}__label`"
    >
      {{ loading ? `${label}...` : label }}
    </span>
  </div>
</template>
