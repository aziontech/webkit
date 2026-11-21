<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { Severity } from '../../../utils/severity'

  export type { Severity } from '../../../utils/severity'

  /** Brand look of the badge, used when no severity is set. */
  export type BadgeVariant = 'primary' | 'secondary'

  /** Status colour of the badge: the shared severity scale. */
  export type BadgeSeverity = Severity

  export type BadgeSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'Badge',
    inheritAttrs: false
  })

  export interface BadgeProps {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Brand look of the badge surface and label, used when `severity` is not set. */
    variant?: BadgeVariant
    /** Status colour of the badge surface and label; wins over `variant` when set. */
    severity?: BadgeSeverity
    /** Size token; `small` is 20px tall, `medium` is 24px, `large` is 30px. */
    size?: BadgeSize
  }

  const props = withDefaults(defineProps<BadgeProps>(), {
    label: '',
    variant: 'primary',
    severity: undefined,
    size: 'medium'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'badge')

  const SEVERITIES: readonly BadgeSeverity[] = ['neutral', 'info', 'success', 'warning', 'danger']

  const resolvedSeverity = computed(() =>
    props.severity && SEVERITIES.includes(props.severity) ? props.severity : null
  )

  const resolvedVariant = computed((): BadgeVariant | null =>
    resolvedSeverity.value ? null : props.variant === 'secondary' ? 'secondary' : 'primary'
  )

  const ROOT_CLASS =
    'inline-flex items-center justify-center overflow-hidden leading-none text-label-md ' +
    'data-[size=small]:text-label-sm data-[size=small]:h-5 data-[size=small]:px-(--spacing-2xs) data-[size=medium]:h-6 data-[size=medium]:px-(--spacing-xs) data-[size=large]:h-[30px] ' +
    'data-[size=large]:px-(--spacing-xs) ' +
    'rounded-(--shape-control) ' +
    'data-[variant=primary]:bg-(--primary) data-[variant=primary]:text-(--primary-foreground) data-[variant=secondary]:bg-(--secondary) ' +
    'data-[variant=secondary]:text-(--secondary-foreground) ' +
    'data-[severity=info]:bg-(--info) data-[severity=info]:text-(--info-foreground) data-[severity=success]:bg-(--success) data-[severity=success]:text-(--success-foreground) ' +
    'data-[severity=warning]:bg-(--warning) data-[severity=warning]:text-(--warning-foreground) data-[severity=danger]:bg-(--danger) data-[severity=danger]:text-(--danger-foreground) ' +
    'data-[severity=neutral]:bg-(--bg-surface) data-[severity=neutral]:text-(--text-default)'
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-severity="resolvedSeverity"
    :data-variant="resolvedVariant"
    :data-size="size"
    :class="[ROOT_CLASS, attrs.class]"
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
