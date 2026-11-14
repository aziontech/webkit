<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Overline', inheritAttrs: false })

  export type OverlinePrefix = '' | '//' | '\x3C\x3E' | '\x3C/\x3E'

  interface Props {
    /** Keeps the prefix unbroken and the label on one line while it fits; a longer label wraps instead of overflowing. */
    singleLine?: boolean
    /** Shows a blinking terminal-style cursor after the label. */
    cursor?: boolean
    /**
     * @deprecated since 6.0 — use `cursor` instead. Removed in 7.0.
     */
    showCursor?: boolean
    /** Preset prefix rendered before the label; empty renders no prefix. */
    prefix?: OverlinePrefix
  }

  const props = withDefaults(defineProps<Props>(), {
    singleLine: true,
    cursor: false,
    showCursor: false,
    prefix: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-overline')

  const hasCursor = computed(() => props.cursor || props.showCursor)
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-cursor="hasCursor || null"
    :data-single-line="singleLine || null"
    class="group/overline flex items-center gap-(--spacing-xxs) relative w-fit max-w-full ps-(--spacing-xxs) pe-(--spacing-xxs) data-[cursor]:pe-0"
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
      v-if="hasCursor"
      aria-hidden="true"
      class="w-1 h-5 shrink-0 relative bg-(--accent) animate-blink motion-reduce:animate-none"
    />
  </div>
</template>
