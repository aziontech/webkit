<script setup lang="ts">
  defineOptions({ name: 'LegacyPanel' })

  interface Props {
    /** @deprecated since 6.1 — use `size`. Removed in 7.0. */
    width?: string
    size?: string
  }

  withDefaults(defineProps<Props>(), { width: '', size: '' })

  /** @deprecated since 6.1 — use `v-model:open` (inverted). Removed in 7.0. */
  const collapsed = defineModel<boolean>('collapsed', { default: false })

  defineSlots<{
    default(): unknown
    leading(): unknown
    /** @deprecated since 6.1 — use the leading slot. Removed in 7.0. */
    left(): unknown
  }>()
</script>

<template>
  <div :data-collapsed="collapsed || null"><slot name="leading" /><slot /></div>
</template>
