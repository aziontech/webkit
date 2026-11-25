<script setup lang="ts">
  import type { SourcesItem } from '../types'
  import SourcesMark from './sources-mark.vue'

  defineOptions({ name: 'SourcesButton', inheritAttrs: false })

  export interface SourcesButtonProps {
    /** Prefix of the test ids, the test id of the Sources root. */
    testId: string
    /** Up to three sources whose marks overlap at the start of the pill. */
    marks: SourcesItem[]
    /** Visible label of the pill. */
    title: string
    /** Accessible name of the pill; empty leaves the visible label as its name. */
    triggerName?: string
    /** The panel is open. */
    open?: boolean
  }

  withDefaults(defineProps<SourcesButtonProps>(), {
    triggerName: '',
    open: false
  })

  const BUTTON_CLASS =
    'relative inline-flex h-8 w-fit shrink-0 items-center gap-(--spacing-xs) whitespace-nowrap rounded-(--shape-control) ps-(--spacing-2xs) pe-(--spacing-sm) text-label-md text-(--text-muted) ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) hover:text-(--text-default) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[state=open]:bg-(--bg-hover) data-[state=open]:text-(--text-default)'
</script>

<template>
  <button
    type="button"
    :aria-label="triggerName || undefined"
    :data-testid="`${testId}__trigger`"
    :data-state="open ? 'open' : 'closed'"
    :class="BUTTON_CLASS"
  >
    <span
      aria-hidden="true"
      class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
    />
    <span
      aria-hidden="true"
      :data-testid="`${testId}__marks`"
      class="flex items-center"
    >
      <SourcesMark
        v-for="(item, i) in marks"
        :key="`${i}-${item.title}`"
        :item="item"
        :data-testid="`${testId}__mark`"
        class="ring-2 ring-(--bg-canvas) not-first:-ms-1.5"
      />
    </span>
    <span>{{ title }}</span>
  </button>
</template>
