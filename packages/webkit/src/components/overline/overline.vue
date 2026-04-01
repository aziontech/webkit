<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'orange', 'black', 'muted', 'default'].includes(value)
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md'].includes(value)
  },
  showCursor: {
    type: Boolean,
    default: false
  },
  prefix: {
    type: String,
    default: ''
  }
})

const colorClass = computed(() => {
  const colors = {
    default: 'text-default',
    primary: 'text-primary',
    black: 'text-neutral-900',
    muted: 'text-muted'
  }
  return colors[props.color] || 'text-primary'
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'text-overline-xs',
    sm: 'text-overline-sm',
    md: 'text-overline-md'
  }
  return sizes[props.size] || 'text-xs'
})
</script>

<template>
  <div
    class="flex items-center gap-1 relative w-fit"
    :class="prefix | showCursor ? 'bg-gray-900' : 'bg-transparent'"
  >
    <span
      v-if="prefix"
      class="font-proto-mono text-default font-medium leading-1 tracking-tightest whitespace-nowrap"
      :class="[sizeClass]"
      >
      {{ prefix }}
    </span>
    <span
      class="font-proto-mono font-medium leading-1 tracking-tightest whitespace-nowrap uppercase"
      :class="[colorClass, sizeClass]"
    >
      <slot />
    </span>
    <span v-if="showCursor" class="w-1 h-4 shrink-0 relative bg-brand-accent-400 animate-blink" />
  </div>
</template>
