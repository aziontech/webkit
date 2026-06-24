<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type BadgeSeverity = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'

  export type BadgeSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'Badge',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    value?: string
    /** Color style for the badge surface and label. */
    severity?: BadgeSeverity
    /** Size token; `small` is 20px tall, `medium` is 24px, `large` is 30px. */
    size?: BadgeSize
  }

  const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    severity: 'primary',
    size: 'medium'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-badge')

  const resolvedSeverity = computed((): BadgeSeverity => {
    const severity = props.severity ?? 'primary'

    if (
      severity === 'primary' ||
      severity === 'secondary' ||
      severity === 'success' ||
      severity === 'warning' ||
      severity === 'danger' ||
      severity === 'default'
    ) {
      return severity
    }

    return 'primary'
  })
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-severity="resolvedSeverity"
    :data-size="size"
    :class="attrs.class"
    class="inline-flex items-center justify-center overflow-hidden leading-none text-label-md data-[size=small]:text-label-sm data-[size=small]:h-5 data-[size=small]:px-[var(--spacing-xxs)] data-[size=medium]:h-6 data-[size=medium]:px-[var(--spacing-xs)] data-[size=large]:h-[30px] data-[size=large]:px-[var(--spacing-xs)] rounded-[var(--shape-elements)] data-[severity=primary]:bg-[var(--primary)] data-[severity=primary]:text-[var(--primary-contrast)] data-[severity=secondary]:bg-[var(--secondary)] data-[severity=secondary]:text-[var(--secondary-contrast)] data-[severity=success]:bg-[var(--success)] data-[severity=success]:text-[var(--success-contrast)] data-[severity=warning]:bg-[var(--warning)] data-[severity=warning]:text-[var(--warning-contrast)] data-[severity=danger]:bg-[var(--danger)] data-[severity=danger]:text-[var(--danger-contrast)] data-[severity=default]:bg-[var(--bg-surface)] data-[severity=default]:text-[var(--text-default)]"
  >
    <slot v-if="$slots['default']" />
    <span
      v-else-if="value"
      :data-testid="`${testId}__value`"
    >
      {{ value }}
    </span>
  </span>
</template>
