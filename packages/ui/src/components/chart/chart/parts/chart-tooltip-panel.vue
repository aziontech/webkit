<script setup lang="ts">
  defineOptions({ name: 'ChartTooltipPanel' })

  interface Props {
    /** Heading of the readout. */
    title: string
    /** Side of the pointer the panel opens on. */
    side: string
  }

  defineProps<Props>()

  defineSlots<{
    /** Readings under the heading. */
    default(): unknown
  }>()

  const PANEL_CLASS =
    'flex w-max max-w-(--container-3xs) flex-col overflow-hidden rounded-(--shape-control) border border-(--chart-tooltip-border) bg-(--chart-tooltip-bg) text-(--chart-tooltip-text) ' +
    'shadow-(--shadow-sm) ' +
    'data-[side=end]:translate-x-(--spacing-sm) data-[side=start]:-translate-x-[calc(100%+var(--spacing-sm))]'
</script>

<template>
  <div
    :data-side="side"
    :class="PANEL_CLASS"
  >
    <span
      class="border-b border-(--chart-tooltip-border) px-(--spacing-sm) py-(--spacing-xs) text-label-md"
    >
      {{ title }}
    </span>
    <slot />
  </div>
</template>
