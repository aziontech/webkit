<script setup lang="ts">
  interface Props {
    kind?: string
    padded?: boolean
  }

  withDefaults(defineProps<Props>(), {
    kind: 'facts',
    padded: true
  })

  defineSlots<{
    default(): unknown
  }>()
</script>

<template>
  <div
    :data-band="kind"
    :data-padded="padded || null"
    class="@container/band data-[padded]:px-(--spacing-md) data-[band=subject]:flex data-[band=subject]:min-h-(--size-14) data-[band=subject]:flex-wrap data-[band=subject]:items-center data-[band=subject]:gap-x-(--spacing-md) data-[band=subject]:gap-y-(--spacing-xs) data-[band=subject]:data-[padded]:py-(--spacing-xs) data-[band=facts]:border-t data-[band=facts]:border-(--border-muted) data-[band=facts]:data-[padded]:py-(--spacing-md) data-[band=state]:flex data-[band=state]:min-h-(--size-12) data-[band=state]:flex-wrap data-[band=state]:items-center data-[band=state]:gap-x-(--spacing-md) data-[band=state]:gap-y-(--spacing-xs) data-[band=state]:border-t data-[band=state]:border-(--border-muted) data-[band=state]:bg-(--bg-canvas) data-[band=state]:data-[padded]:py-(--spacing-xs)"
  >
    <slot />
  </div>
</template>
