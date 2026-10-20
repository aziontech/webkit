<script setup lang="ts">
  interface Props {
    enabled?: boolean
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    enabled: false,
    label: ''
  })

  const DISC = 'M8 0a8 8 0 100 16A8 8 0 008 0z'
  const CHECK =
    'M11.53 5.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 0z'
  const DASH = 'M4.25 8a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H5A.75.75 0 014.25 8z'
</script>

<template>
  <svg
    class="h-(--size-4) w-(--size-4) shrink-0"
    :class="props.enabled ? 'text-(--success-contrast)' : 'text-(--text-muted)'"
    viewBox="0 0 16 16"
    fill="currentColor"
    fill-rule="evenodd"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label || undefined"
    :aria-hidden="props.label ? undefined : 'true'"
  >
    <path :d="`${DISC} ${props.enabled ? CHECK : DASH}`" />
  </svg>
</template>
