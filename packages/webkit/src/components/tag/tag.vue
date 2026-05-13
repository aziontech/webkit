<script setup>
  import { computed } from 'vue'

  defineOptions({ name: 'Tag' })

  const severityStyles = {
    primary: {
      container: 'bg-primary-mask text-primary border-transparent',
      icon: 'size-3.5'
    },
    secondary: {
      container: 'bg-canvas text-default border-default',
      icon: 'size-3',
      roundedOff: 'rounded-md'
    },
    success: {
      container: 'bg-success text-success border-transparent',
      icon: 'size-3'
    },
    info: {
      container: 'bg-indigo-950 text-accent border-transparent',
      icon: 'size-3'
    },
    warning: {
      container: 'bg-warning text-warning border-transparent',
      icon: 'size-3'
    },
    danger: {
      container: 'bg-danger text-danger border-transparent',
      icon: 'size-3'
    },
    accent: {
      container: 'bg-violet-300 text-neutral-900 border-transparent',
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
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    class: {
      type: String,
      default: ''
    }
  })

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

  const resolvedIcon = computed(() => props.icon || (props.showIcon ? 'pi pi-box' : ''))

  const rootClass = computed(() => {
    const classes = [
      'inline-flex h-6 items-center justify-center gap-1 overflow-hidden border px-2',
      'font-proto-mono text-xs font-normal leading-none',
      currentSeverityStyle.value.container,
      props.rounded ? 'rounded-full' : (currentSeverityStyle.value.roundedOff ?? 'rounded')
    ]

    if (props.class) {
      classes.push(props.class)
    }

    return classes
  })

  const iconClass = computed(() => [
    resolvedIcon.value,
    'shrink-0',
    currentSeverityStyle.value.icon
  ])
</script>

<template>
  <span :class="rootClass">
    <i
      v-if="resolvedIcon"
      :class="iconClass"
      aria-hidden="true"
    />
    <slot v-if="$slots.default" />
    <span v-else-if="props.value">{{ props.value }}</span>
  </span>
</template>
