<script setup>
  defineOptions({
    name: 'Spinner',
    inheritAttrs: false
  })
</script>

<template>
  <svg
    class="webkit-spinner shrink-0"
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

<style scoped>
  .webkit-spinner {
    animation: webkit-spinner-rotate 0.75s linear infinite;
  }

  @keyframes webkit-spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>
