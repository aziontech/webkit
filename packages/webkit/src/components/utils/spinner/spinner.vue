<script setup>
  defineOptions({
    name: 'Spinner',
    inheritAttrs: false
  })
</script>

<template>
  <svg
    class="shrink-0 animate-spin motion-reduce:transition-none motion-reduce:transform-none motion-reduce:animate-none"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      stroke-width="2"
      opacity="0.25"
    />
    <path
      d="M14 8a6 6 0 0 0-6-6"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>
