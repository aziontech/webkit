<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Overline', inheritAttrs: false })

  export type OverlinePrefix = '' | '//' | '\x3C\x3E' | '\x3C/\x3E'

  interface Props {
    /** Keeps the prefix and the label on one line (no wrapping). */
    singleLine?: boolean
    /** Shows a blinking terminal-style cursor after the label. */
    showCursor?: boolean
    /** Preset prefix rendered before the label; empty renders no prefix. */
    prefix?: OverlinePrefix
  }

  withDefaults(defineProps<Props>(), {
    singleLine: true,
    showCursor: false,
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
    class="flex items-center gap-1 relative w-fit pl-1"
    :class="!showCursor ? 'pr-1' : 'pr-0'"
  >
    <span
      v-if="prefix"
      class="text-default font-medium text-overline-md"
      :class="{ 'whitespace-nowrap': singleLine }"
    >
      {{ prefix }}
    </span>
    <span
      class="text-pretty text-primary font-medium uppercase text-overline-md"
      :class="{ 'whitespace-nowrap': singleLine }"
    >
      <slot />
    </span>
    <span
      v-if="showCursor"
      class="w-1 h-5 shrink-0 relative bg-(--accent) animate-blink motion-reduce:animate-none"
    />
  </div>
</template>
