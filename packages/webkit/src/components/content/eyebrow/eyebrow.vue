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

  const WORD_JOINER = '\u2060'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-cursor="cursor || null"
    :data-single-line="singleLine || null"
    class="group/eyebrow relative flex w-fit max-w-full items-center ps-(--spacing-2xs) pe-(--spacing-2xs) data-[cursor]:pe-0"
  >
    <span class="min-w-0 text-pretty font-medium text-overline-md"
      ><span
        v-if="prefix"
        aria-hidden="true"
        class="me-(--spacing-2xs) text-(--text-default) group-data-[single-line]/eyebrow:whitespace-nowrap"
        >{{ prefix }}</span
      ><span
        v-if="prefix"
        aria-hidden="true"
        data-slot="prefix-joiner"
        >{{ WORD_JOINER }}</span
      ><span
        :data-testid="`${testId}__label`"
        class="text-(--text-default) uppercase"
        ><slot /><span
          v-if="cursor"
          aria-hidden="true"
          :data-testid="`${testId}__cursor`"
          class="ms-(--spacing-2xs) -my-1 inline-block h-5 w-1 align-middle bg-(--brand-blue) animate-blink-settle motion-reduce:animate-none" /></span
    ></span>
  </div>
</template>
