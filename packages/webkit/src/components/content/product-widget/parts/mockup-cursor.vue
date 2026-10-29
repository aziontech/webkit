<script setup lang="ts">
  import { computed } from 'vue'

  defineOptions({ name: 'MockupCursor' })

  interface Props {
    /** The person the cursor belongs to, shown in its tag. */
    name: string
    /** Horizontal position of the arrow tip, in the frame's design pixels. */
    x?: number
    /** Vertical position of the arrow tip, in the frame's design pixels. */
    y?: number
    /** Whether the cursor is pressing, which shrinks the arrow for a click. */
    pressed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { x: 0, y: 0, pressed: false })

  const placement = computed(() => ({ translate: `${props.x}px ${props.y}px` }))
</script>

<template>
  <span
    :style="placement"
    :data-pressed="pressed || null"
    class="group pointer-events-none absolute top-0 left-0 z-2 flex items-start transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
  >
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      class="size-4 shrink-0 origin-top-left text-(--bg-contrast) drop-shadow-sm transition-[scale] duration-fast-02 ease-productive-entrance group-data-pressed:scale-80 motion-reduce:transition-none"
    >
      <path
        d="M1.5 1.5 L14 6.6 L8.4 8.4 L6.6 14 Z"
        fill="currentColor"
        stroke="var(--bg-canvas)"
        stroke-width="1.2"
        stroke-linejoin="round"
      />
    </svg>
    <span
      class="mt-3 -ml-1 rounded-(--shape-elements) bg-(--bg-contrast) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm whitespace-nowrap text-(--text-contrast) shadow-(--shadow-xs)"
    >
      {{ name }}
    </span>
  </span>
</template>
