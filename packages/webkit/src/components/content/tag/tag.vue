<script setup>
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Tag',
    inheritAttrs: false
  })

  const fontSans = 'font-[family-name:var(--font-sans),ui-sans-serif,system-ui,sans-serif]'

  const shapeElements = 'rounded-[var(--shape-elements)]'

  const severityStyles = {
    primary: {
      container: 'bg-[var(--primary-mask)] text-[var(--primary)] border-transparent',
      icon: 'size-3'
    },
    secondary: {
      container: 'bg-[var(--bg-canvas)] text-[var(--text-default)] border-[var(--border-default)]',
      icon: 'size-3'
    },
    success: {
      container: 'bg-[var(--success)] text-[var(--success-contrast)] border-transparent',
      icon: 'size-3'
    },
    info: {
      container: 'bg-[var(--info)] text-[var(--info-contrast)] border-transparent',
      icon: 'size-3'
    },
    warning: {
      container: 'bg-[var(--warning)] text-[var(--warning-contrast)] border-transparent',
      icon: 'size-3'
    },
    danger: {
      container: 'bg-[var(--danger)] text-[var(--danger-contrast)] border-transparent',
      icon: 'size-3'
    },
    accent: {
      container: 'bg-[var(--accent)] text-[var(--accent-contrast)] border-transparent',
      icon: 'size-3'
    }
  }

  const props = defineProps({
    value: {
      type: String,
      default: undefined
    },
    severity: {
      type: String,
      default: 'primary',
      validator: (value) =>
        [
          'primary',
          'secondary',
          'success',
          'info',
          'warning',
          'danger',
          'accent',
          'contrast'
        ].includes(value)
    },
    rounded: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: undefined
    }
  })

  const attrs = useAttrs()

  const normalizedSeverity = computed(() => {
    const severity = String(props.severity || 'primary').toLowerCase()

    if (severity === 'contrast') {
      return 'accent'
    }

    return ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'accent'].includes(
      severity
    )
      ? severity
      : 'primary'
  })

  const currentSeverityStyle = computed(
    () => severityStyles[normalizedSeverity.value] ?? severityStyles.primary
  )

  const rootClass = computed(() => {
    const classes = [
      'inline-flex h-6 items-center justify-center gap-2 overflow-hidden border px-2',
      fontSans,
      'text-body-xs font-normal leading-none',
      currentSeverityStyle.value.container,
      props.rounded ? 'rounded-full' : shapeElements
    ]

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const iconClass = computed(() => [
    props.icon,
    'shrink-0 flex items-center',
    currentSeverityStyle.value.icon
  ])
</script>

<template>
  <span :class="rootClass">
    <i
      v-if="props.icon"
      :class="iconClass"
      aria-hidden="true"
    />
    <slot v-if="$slots.default" />
    <span v-else-if="props.value">{{ props.value }}</span>
  </span>
</template>
