<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { Severity } from '../../../utils/severity'

  export type { Severity } from '../../../utils/severity'

  /** Color style of the badge: the shared status scale minus `info`, plus `primary` and `secondary`. */
  export type BadgeSeverity = Exclude<Severity, 'info'> | 'primary' | 'secondary'

  export type BadgeSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'Badge',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Color style for the badge surface and label. */
    severity?: BadgeSeverity
    /** Size token; `small` is 20px tall, `medium` is 24px, `large` is 30px. */
    size?: BadgeSize
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    severity: 'primary',
    size: 'medium'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-badge')

  const resolvedSeverity = computed((): BadgeSeverity => {
    const validSeverities: BadgeSeverity[] = [
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'neutral'
    ]
    const severity = props.severity ?? 'primary'

    return validSeverities.includes(severity) ? severity : validSeverities[0]
  })
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-severity="resolvedSeverity"
    :data-size="size"
    :class="attrs.class"
    class="inline-flex items-center justify-center overflow-hidden leading-none text-label-md data-[size=small]:text-label-sm data-[size=small]:h-5 data-[size=small]:px-(--spacing-2xs) data-[size=medium]:h-6 data-[size=medium]:px-(--spacing-xs) data-[size=large]:h-[30px] data-[size=large]:px-(--spacing-xs) rounded-(--shape-control) data-[severity=primary]:bg-(--primary) data-[severity=primary]:text-(--primary-foreground) data-[severity=secondary]:bg-(--secondary) data-[severity=secondary]:text-(--secondary-foreground) data-[severity=success]:bg-(--success) data-[severity=success]:text-(--success-foreground) data-[severity=warning]:bg-(--warning) data-[severity=warning]:text-(--warning-foreground) data-[severity=danger]:bg-(--danger) data-[severity=danger]:text-(--danger-foreground) data-[severity=neutral]:bg-(--bg-surface) data-[severity=neutral]:text-(--text-default)"
  >
    <slot v-if="$slots['default']" />
    <span
      v-else-if="label"
      :data-testid="`${testId}__label`"
      dir="auto"
    >
      {{ label }}
    </span>
  </span>
</template>
