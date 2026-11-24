<script setup lang="ts">
  defineOptions({
    name: 'DatePickerControl',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const CONTROL_CLASS =
    'inline-flex max-w-full items-stretch rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface) transition-colors duration-150 ease-out ' +
    '[&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong) ' +
    'data-[invalid]:border-(--danger-border) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <span
    v-bind="$attrs"
    :class="CONTROL_CLASS"
  >
    <slot />
  </span>
</template>
