<script setup lang="ts">
  defineOptions({
    name: 'DatePickerControlButton',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const BUTTON_CLASS =
    'relative inline-flex shrink-0 items-center justify-center px-(--spacing-xs) text-label-sm text-(--text-muted) transition-colors duration-150 ease-out ' +
    'hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :class="BUTTON_CLASS"
  >
    <span
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
    <slot />
  </button>
</template>
