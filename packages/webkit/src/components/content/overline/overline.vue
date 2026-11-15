<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Overline', inheritAttrs: false })

  export type OverlinePrefix = '' | '//' | '\x3C\x3E' | '\x3C/\x3E'

  export interface OverlineProps {
    /** Keeps the prefix unbroken and the label on one line while it fits; a longer label wraps instead of overflowing. */
    singleLine?: boolean
    /** Shows a blinking terminal-style cursor after the label. */
    cursor?: boolean
    /** Preset prefix rendered before the label; empty renders no prefix. */
    prefix?: OverlinePrefix
  }

  withDefaults(defineProps<OverlineProps>(), {
    singleLine: true,
    cursor: false,
    prefix: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-overline')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-cursor="cursor || null"
    :data-single-line="singleLine || null"
    class="group/overline flex items-center gap-(--spacing-2xs) relative w-fit max-w-full ps-(--spacing-2xs) pe-(--spacing-2xs) data-[cursor]:pe-0"
  >
    <span
      v-if="prefix"
      aria-hidden="true"
      class="text-(--text-default) font-medium text-overline-md group-data-[single-line]/overline:whitespace-nowrap"
    >
      {{ prefix }}
    </span>
    <span class="min-w-0 text-pretty text-(--text-primary) font-medium uppercase text-overline-md">
      <slot />
    </span>
    <span
      v-if="cursor"
      aria-hidden="true"
      class="w-1 h-5 shrink-0 relative bg-(--accent) animate-blink motion-reduce:animate-none"
    />
  </div>
</template>
