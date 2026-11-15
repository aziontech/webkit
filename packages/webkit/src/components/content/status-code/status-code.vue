<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Tag, { type TagSeverity } from '../tag/tag.vue'

  defineOptions({ name: 'StatusCode', inheritAttrs: false })

  /** Size token. */
  export type StatusCodeSize = 'small' | 'medium'

  /** HTTP status class derived from the code. */
  export type StatusCodeClass =
    'informational' | 'success' | 'redirect' | 'client-error' | 'server-error' | 'invalid'

  interface Props {
    /** HTTP status, as a number or a string (`404`, `'404'`). 1xx to 3xx render neutral, 4xx warning, 5xx danger; anything else renders muted as written, empty a dash. */
    code?: number | string
    /** Request method shown before the code (`GET`, `POST`), upper-cased. Empty shows the code alone. */
    method?: string
    /** Size token forwarded to `Tag`; `medium` is 24px tall, `small` is 20px. */
    size?: StatusCodeSize
  }

  const props = withDefaults(defineProps<Props>(), {
    code: '',
    method: '',
    size: 'medium'
  })

  const CLASSES: StatusCodeClass[] = [
    'informational',
    'success',
    'redirect',
    'client-error',
    'server-error'
  ]

  const attrs = useAttrs()
  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-status-code'
  )

  const text = computed<string>(() => String(props.code ?? '').trim())
  const statusClass = computed<StatusCodeClass>(() => {
    if (!/^\d{3}$/.test(text.value)) return 'invalid'
    return CLASSES[Number(text.value[0]) - 1] ?? 'invalid'
  })
  const severity = computed<TagSeverity>(() => {
    if (statusClass.value === 'client-error') return 'warning'
    if (statusClass.value === 'server-error') return 'danger'
    return 'secondary'
  })
  const methodText = computed<string>(() => props.method.trim().toUpperCase())
</script>

<template>
  <Tag
    v-bind="$attrs"
    :data-testid="testId"
    :data-status-class="statusClass"
    :severity="severity"
    :size="size"
    dir="ltr"
    class="shrink-0 whitespace-nowrap"
  >
    <span class="inline-flex items-center gap-(--spacing-xxs) text-label-code-sm">
      <span
        v-if="methodText"
        :data-testid="`${testId}__method`"
        :data-severity="severity"
        class="data-[severity=secondary]:text-(--text-muted)"
        >{{ methodText }}</span
      >
      <span
        :data-testid="`${testId}__code`"
        :data-invalid="statusClass === 'invalid' || null"
        class="data-[invalid]:text-(--text-muted)"
        >{{ text || '—' }}</span
      >
    </span>
  </Tag>
</template>
