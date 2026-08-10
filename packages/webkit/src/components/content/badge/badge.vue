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
      'default'
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
    class="inline-flex items-center justify-center overflow-hidden leading-none text-label-md data-[size=small]:text-label-sm data-[size=small]:h-5 data-[size=small]:px-(--spacing-xxs) data-[size=medium]:h-6 data-[size=medium]:px-(--spacing-xs) data-[size=large]:h-[30px] data-[size=large]:px-(--spacing-xs) rounded-(--shape-elements) data-[severity=primary]:bg-(--primary) data-[severity=primary]:text-(--primary-contrast) data-[severity=secondary]:bg-(--secondary) data-[severity=secondary]:text-(--secondary-contrast) data-[severity=success]:bg-(--success) data-[severity=success]:text-(--success-contrast) data-[severity=warning]:bg-(--warning) data-[severity=warning]:text-(--warning-contrast) data-[severity=danger]:bg-(--danger) data-[severity=danger]:text-(--danger-contrast) data-[severity=default]:bg-(--bg-surface) data-[severity=default]:text-(--text-default)"
  >
    <slot v-if="$slots['default']" />
    <span
      v-else-if="label"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>
  </span>
</template>
