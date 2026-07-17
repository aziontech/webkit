<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type TagSeverity =
    'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'accent' | 'contrast'

  export type TagSize = 'small' | 'medium'

  defineOptions({
    name: 'Tag',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Color style for the tag surface and label. */
    severity?: TagSeverity
    /** Size token; `medium` is 24px tall, `small` is 20px. */
    size?: TagSize
    /** Pill shape when true. */
    rounded?: boolean
    /** PrimeIcons class for the leading icon. */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    severity: 'primary',
    size: 'medium',
    rounded: false,
    icon: undefined
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-tag')

  type ResolvedTagSeverity = TagSeverity

  const resolvedSeverity = computed((): ResolvedTagSeverity => {
    const severity = props.severity ?? 'primary'

    if (
      severity === 'primary' ||
      severity === 'secondary' ||
      severity === 'success' ||
      severity === 'info' ||
      severity === 'warning' ||
      severity === 'danger' ||
      severity === 'accent' ||
      severity === 'contrast'
    ) {
      return severity
    }

    return 'primary'
  })

  const iconSizeClass = computed(() =>
    props.size === 'small' ? 'size-3' : props.icon ? 'size-3.5' : 'size-3'
  )
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-severity="resolvedSeverity"
    :data-size="size"
    :data-rounded="rounded || null"
    :class="attrs.class"
    class="inline-flex items-center justify-center overflow-hidden border border-transparent leading-none text-tag-md data-[size=small]:text-tag-sm data-[size=medium]:gap-[var(--spacing-xs)] data-[size=small]:gap-[var(--spacing-xxs)] data-[size=medium]:h-6 data-[size=medium]:px-[var(--spacing-xs)] data-[size=small]:h-5 data-[size=small]:px-[var(--spacing-xxs)] rounded-[var(--shape-elements)] data-[rounded]:!rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[severity=primary]:bg-[var(--primary-mask)] data-[severity=primary]:text-[var(--primary)] data-[severity=secondary]:border-[length:var(--border-width-default)] data-[severity=secondary]:border-[var(--border-default)] data-[severity=secondary]:bg-[var(--bg-canvas)] data-[severity=secondary]:text-[var(--text-default)] data-[severity=accent]:bg-[var(--accent)] data-[severity=accent]:text-[var(--accent-contrast)] data-[severity=contrast]:bg-[var(--bg-contrast)] data-[severity=contrast]:text-[var(--text-contrast)] data-[severity=success]:bg-[var(--success)] data-[severity=success]:text-[var(--success-contrast)] data-[severity=info]:bg-[var(--info)] data-[severity=info]:text-[var(--info-contrast)] data-[severity=warning]:bg-[var(--warning)] data-[severity=warning]:text-[var(--warning-contrast)] data-[severity=danger]:bg-[var(--danger)] data-[severity=danger]:text-[var(--danger-contrast)]"
  >
    <i
      v-if="icon"
      :class="[icon, 'flex shrink-0 items-center', iconSizeClass]"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <slot v-if="$slots['default']" />
    <span
      v-else-if="label"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>
  </span>
</template>
