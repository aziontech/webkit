<template>
  <span
    class="text-balance font-proto-mono uppercase tracking-wide"
    :class="[colorClass[color], sizeClass]"
  >
    <slot />
  </span>
</template>

<script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    color: {
      type: String,
      default: 'primary',
      options: ['primary', 'orange', 'black']
    },
    size: {
      type: String,
      default: 'xs',
      validator: (value) => ['xs', 'sm', 'lg'].includes(value)
    }
  })

  const colorClass = computed(() => {
    return {
      primary: 'text-neutral-200',
      orange: 'text-orange-500',
      black: 'text-neutral-900'
    }
  })

  const sizeClass = computed(() => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      lg: 'text-lg'
    }
    return sizes[props.size] || 'text-xs'
  })
</script>