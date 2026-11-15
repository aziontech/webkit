<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import type { Severity } from '../../../utils/severity'
  import Spinner from '../../utils/spinner/spinner.vue'

  export type { Severity } from '../../../utils/severity'

  export type StatusIndicatorSeverity = Severity

  defineOptions({
    name: 'StatusIndicator',
    inheritAttrs: false
  })

  export interface StatusIndicatorProps {
    /** Severity token driving the status dot color. */
    severity?: StatusIndicatorSeverity
    /** Transitional state: a spinner replaces the dot and the label gains a trailing ellipsis, so pass the bare verb (Deploying); a trailing ellipsis or three periods already in the label are not doubled. */
    loading?: boolean
    /** Visible label text. Empty uses the locale catalog (`Status`). */
    label?: string
  }

  const props = withDefaults(defineProps<StatusIndicatorProps>(), {
    severity: 'success',
    loading: false,
    label: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ statusIndicator: en.statusIndicator })
  const text = computed(() => props.label || t('statusIndicator.label'))
  const loadingText = computed(() => `${text.value.replace(/\s*(?:…|\.{3})\s*$/, '')}…`)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-status-indicator'
  )
</script>

<template>
  <div
    v-bind="attrs"
    :aria-busy="loading || undefined"
    :data-testid="testId"
    :data-severity="severity"
    :data-loading="loading || null"
    class="group inline-flex items-center gap-(--spacing-3) rounded-(--shape-control) text-body-sm text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
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
      class="size-2 shrink-0 rounded-full data-[severity=success]:bg-(--success-foreground) data-[severity=info]:bg-(--info-foreground) data-[severity=neutral]:bg-(--text-muted) data-[severity=warning]:bg-(--warning-foreground) data-[severity=danger]:bg-(--danger-foreground) forced-colors:forced-color-adjust-none forced-colors:bg-[CanvasText]"
    />
    <span
      class="whitespace-nowrap group-data-[loading]:text-(--text-muted)"
      :data-testid="`${testId}__label`"
    >
      {{ loading ? loadingText : text }}
    </span>
  </div>
</template>
