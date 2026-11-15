<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { Severity } from '../../../utils/severity'

  export type { Severity } from '../../../utils/severity'

  export type TagSeverity = Severity | 'primary' | 'accent' | 'contrast' | 'highlight'

  export type TagSize = 'small' | 'medium'

  defineOptions({
    name: 'Tag',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Color style for the tag surface and label: the shared status scale (`neutral`, `info`, `success`, `warning`, `danger`) plus `primary` (solid brand orange), `accent`, `highlight` (the brand orange as a tint) and `contrast` (`var(--bg-contrast)` / `var(--text-contrast)`). */
    severity?: TagSeverity
    /** Size token; `medium` is 24px tall, `small` is 20px. */
    size?: TagSize
    /** Pill shape when true. */
    rounded?: boolean
    /** Azion icon class for the leading icon. */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    severity: 'primary',
    size: 'medium',
    rounded: false,
    icon: ''
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
      severity === 'neutral' ||
      severity === 'primary' ||
      severity === 'success' ||
      severity === 'info' ||
      severity === 'warning' ||
      severity === 'danger' ||
      severity === 'accent' ||
      severity === 'contrast' ||
      severity === 'highlight'
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
    :data-rounded="rounded || null"
    :class="attrs.class"
    class="group/tag inline-flex items-center justify-center overflow-hidden border border-transparent leading-none text-tag-md data-[size=small]:text-tag-sm data-[size=medium]:gap-(--spacing-xs) data-[size=small]:gap-(--spacing-2xs) data-[size=medium]:h-6 data-[size=medium]:px-(--spacing-xs) data-[size=small]:h-5 data-[size=small]:px-(--spacing-2xs) rounded-(--shape-control) data-[rounded]:rounded-full! data-[severity=primary]:bg-(--primary) data-[severity=primary]:text-(--primary-foreground) data-[severity=neutral]:border-(length:--border-width-default) data-[severity=neutral]:border-(--border-default) data-[severity=neutral]:bg-(--bg-canvas) data-[severity=neutral]:text-(--text-default) data-[severity=accent]:bg-(--accent) data-[severity=accent]:text-(--accent-foreground) data-[severity=contrast]:bg-(--bg-contrast) data-[severity=contrast]:text-(--text-contrast) data-[severity=success]:bg-(--success) data-[severity=success]:text-(--success-foreground) data-[severity=info]:bg-(--info) data-[severity=info]:text-(--info-foreground) data-[severity=warning]:bg-(--warning) data-[severity=warning]:text-(--warning-foreground) data-[severity=danger]:bg-(--danger) data-[severity=danger]:text-(--danger-foreground) data-[severity=highlight]:bg-(--primary-mask) data-[severity=highlight]:text-[color-mix(in_srgb,var(--text-primary)_80%,var(--text-default))]"
  >
    <i
      v-if="icon"
      :class="icon"
      class="flex size-3.5 shrink-0 items-center group-data-[size=small]/tag:size-3"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
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
