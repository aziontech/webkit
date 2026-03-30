<script setup>
/**
 * Alert - Warning/info alert component
 * Used for important notices in documentation
 */
defineProps({
  variant: {
    type: String,
    default: 'warning',
    validator: (v) => ['warning', 'info', 'success', 'danger'].includes(v)
  },
  icon: {
    type: String,
    default: ''
  }
})

const variantStyles = {
  warning: 'border-warning bg-warning/10',
  info: 'border-accent bg-accent/10',
  success: 'border-success bg-success/10',
  danger: 'border-danger bg-danger/10'
}

const variantTextColors = {
  warning: 'text-warning',
  info: 'text-accent',
  success: 'text-success',
  danger: 'text-danger'
}

const defaultIcons = {
  warning: 'pi-exclamation-triangle',
  info: 'pi-info-circle',
  success: 'pi-check-circle',
  danger: 'pi-times-circle'
}
</script>

<template>
  <div
    :class="[
      'inline-flex items-center gap-2 px-3.5 py-2 rounded-md border',
      variantStyles[variant]
    ]"
  >
    <i
      :class="[
        'pi text-xs',
        icon || defaultIcons[variant],
        variantTextColors[variant]
      ]"
    />
    <span class="text-body-xs" :class="variantTextColors[variant]">
      <slot />
    </span>
  </div>
</template>
