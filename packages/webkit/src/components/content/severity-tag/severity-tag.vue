<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'SeverityTag', inheritAttrs: false })

  /** Ordered severity level, from most to least severe. */
  export type SeverityTagSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

  /** Size token. */
  export type SeverityTagSize = 'small' | 'medium'

  interface Props {
    /** Severity level; sets how many glyph bars fill, their colour and the default label. */
    severity?: SeverityTagSeverity
    /** Text of the tag; empty falls back to the level name in sentence case. */
    label?: string
    /** Size token; `medium` is 24px tall, `small` is 20px. */
    size?: SeverityTagSize
  }

  const props = withDefaults(defineProps<Props>(), {
    severity: 'info',
    label: '',
    size: 'medium'
  })

  defineSlots<{
    /** Replaces the label text. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-severity-tag'
  )

  const displayLabel = computed<string>(
    () => props.label || props.severity.charAt(0).toUpperCase() + props.severity.slice(1)
  )
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-severity="severity"
    :data-size="size"
    :class="attrs.class"
    class="group inline-flex items-center whitespace-nowrap h-6 data-[size=small]:h-5 px-(--spacing-xs) data-[size=small]:px-(--spacing-xxs) gap-(--spacing-xs) data-[size=small]:gap-(--spacing-xxs) rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-default) bg-(--bg-canvas) text-(--text-default) text-label-sm"
  >
    <span
      aria-hidden="true"
      :data-testid="`${testId}__glyph`"
      class="inline-flex shrink-0 items-end gap-0.5"
    >
      <span
        class="block w-0.5 h-1 rounded-[1px] bg-(--border-default) group-data-[severity=critical]:bg-(--severity-critical) group-data-[severity=high]:bg-(--severity-high) group-data-[severity=medium]:bg-(--severity-medium) group-data-[severity=low]:bg-(--severity-low)"
      />
      <span
        class="block w-0.5 h-1.5 rounded-[1px] bg-(--border-default) group-data-[severity=critical]:bg-(--severity-critical) group-data-[severity=high]:bg-(--severity-high) group-data-[severity=medium]:bg-(--severity-medium)"
      />
      <span
        class="block w-0.5 h-2 rounded-[1px] bg-(--border-default) group-data-[severity=critical]:bg-(--severity-critical) group-data-[severity=high]:bg-(--severity-high)"
      />
      <span
        class="block w-0.5 h-2.5 rounded-[1px] bg-(--border-default) group-data-[severity=critical]:bg-(--severity-critical)"
      />
    </span>
    <span :data-testid="`${testId}__label`">
      <slot>{{ displayLabel }}</slot>
    </span>
  </span>
</template>
