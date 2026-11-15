<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { Severity } from '../../../utils/severity'

  export type { Severity } from '../../../utils/severity'

  /** Brand look of the tag, used when no severity is set. */
  export type TagVariant = 'primary' | 'accent' | 'contrast' | 'highlight'

  /** Status colour of the tag: the shared severity scale. */
  export type TagSeverity = Severity

  export type TagSize = 'small' | 'medium'

  defineOptions({
    name: 'Tag',
    inheritAttrs: false
  })

  export interface TagProps {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Brand look of the tag surface and label, used when `severity` is not set. */
    variant?: TagVariant
    /** Status colour of the tag surface and label; wins over `variant` when set. */
    severity?: TagSeverity
    /** Size token; `medium` is 24px tall, `small` is 20px. */
    size?: TagSize
    /** Pill shape when true. */
    rounded?: boolean
    /** Azion icon class for the leading icon. */
    icon?: string
  }

  const props = withDefaults(defineProps<TagProps>(), {
    label: '',
    variant: 'primary',
    severity: undefined,
    size: 'medium',
    rounded: false,
    icon: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-tag')

  const SEVERITIES: readonly TagSeverity[] = ['neutral', 'info', 'success', 'warning', 'danger']
  const VARIANTS: readonly TagVariant[] = ['primary', 'accent', 'contrast', 'highlight']

  const resolvedSeverity = computed(() =>
    props.severity && SEVERITIES.includes(props.severity) ? props.severity : null
  )

  const resolvedVariant = computed((): TagVariant | null =>
    resolvedSeverity.value ? null : VARIANTS.includes(props.variant) ? props.variant : 'primary'
  )
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-severity="resolvedSeverity"
    :data-variant="resolvedVariant"
    :data-size="size"
    :data-rounded="rounded || null"
    :class="attrs.class"
    class="group/tag inline-flex items-center justify-center overflow-hidden border border-transparent leading-none text-tag-md data-[size=small]:text-tag-sm data-[size=medium]:gap-(--spacing-xs) data-[size=small]:gap-(--spacing-2xs) data-[size=medium]:h-6 data-[size=medium]:px-(--spacing-xs) data-[size=small]:h-5 data-[size=small]:px-(--spacing-2xs) rounded-(--shape-control) data-[rounded]:rounded-full! data-[variant=primary]:bg-(--primary) data-[variant=primary]:text-(--primary-foreground) data-[severity=neutral]:border-(length:--border-width-default) data-[severity=neutral]:border-(--border-default) data-[severity=neutral]:bg-(--bg-canvas) data-[severity=neutral]:text-(--text-default) data-[variant=accent]:bg-(--accent) data-[variant=accent]:text-(--accent-foreground) data-[variant=contrast]:bg-(--bg-contrast) data-[variant=contrast]:text-(--text-contrast) data-[severity=success]:bg-(--success) data-[severity=success]:text-(--success-foreground) data-[severity=info]:bg-(--info) data-[severity=info]:text-(--info-foreground) data-[severity=warning]:bg-(--warning) data-[severity=warning]:text-(--warning-foreground) data-[severity=danger]:bg-(--danger) data-[severity=danger]:text-(--danger-foreground) data-[variant=highlight]:bg-(--primary-mask) data-[variant=highlight]:text-[color-mix(in_srgb,var(--text-primary)_80%,var(--text-default))]"
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
