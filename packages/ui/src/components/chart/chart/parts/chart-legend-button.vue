<script setup lang="ts">
  defineOptions({ name: 'ChartLegendButton' })

  interface Props {
    /** Color of the series key. */
    color: string
    /** The series is shown; the button reads as pressed. */
    pressed?: boolean
    /** Another series is emphasized; the key fades. */
    dimmed?: boolean
  }

  withDefaults(defineProps<Props>(), { pressed: true, dimmed: false })

  defineSlots<{
    /** Name and readings of the series. */
    default(): unknown
  }>()

  const ITEM_CLASS =
    "relative inline-flex min-h-6 items-center before:absolute before:inset-x-0 before:-inset-y-2 before:content-[''] pointer-coarse:min-h-11 pointer-coarse:before:hidden " +
    'gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-2xs) text-body-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'data-[hidden]:text-(--text-muted)'

  const KEY_CLASS =
    'size-2.5 shrink-0 rounded-(--shape-control) bg-(--chart-legend-key) forced-color-adjust-none transition-opacity duration-moderate-01 ' +
    'motion-reduce:transition-none ' +
    'data-[dimmed]:opacity-30 ' +
    'data-[hidden]:opacity-30'
</script>

<template>
  <button
    type="button"
    :aria-pressed="pressed"
    :data-hidden="!pressed || null"
    :class="ITEM_CLASS"
  >
    <span
      :data-hidden="!pressed || null"
      :data-dimmed="dimmed || null"
      :style="{ '--chart-legend-key': color }"
      :class="KEY_CLASS"
    />
    <slot />
  </button>
</template>
