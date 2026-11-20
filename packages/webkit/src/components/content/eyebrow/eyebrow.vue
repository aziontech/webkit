<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Eyebrow', inheritAttrs: false })

  export type EyebrowPrefix = '' | '//' | '\x3C\x3E' | '\x3C/\x3E'

  export interface EyebrowProps {
    /** Keeps the prefix unbroken and the label on one line while it fits; a longer label wraps instead of overflowing. */
    singleLine?: boolean
    /** Shows a blinking terminal-style cursor after the label. */
    cursor?: boolean
    /** Preset prefix rendered before the label; empty renders no prefix. */
    prefix?: EyebrowPrefix
  }

  withDefaults(defineProps<EyebrowProps>(), {
    singleLine: true,
    cursor: false,
    prefix: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'eyebrow')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-cursor="cursor || null"
    :data-single-line="singleLine || null"
    class="group/eyebrow flex items-center gap-(--spacing-2xs) relative w-fit max-w-full ps-(--spacing-2xs) pe-(--spacing-2xs) data-[cursor]:pe-0"
  >
    <span
      v-if="prefix"
      aria-hidden="true"
      class="text-(--text-default) font-medium text-overline-md group-data-[single-line]/eyebrow:whitespace-nowrap"
    >
      {{ prefix }}
    </span>
    <span
      :data-testid="`${testId}__label`"
      class="min-w-0 text-pretty text-(--text-brand) font-medium uppercase text-overline-md"
    >
      <slot />
    </span>
    <span
      v-if="cursor"
      aria-hidden="true"
      class="w-1 h-5 shrink-0 relative bg-(--brand-blue) animate-blink-settle motion-reduce:animate-none"
    />
  </div>
</template>
