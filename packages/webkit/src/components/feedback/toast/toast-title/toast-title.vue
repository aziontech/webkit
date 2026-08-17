<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ToastTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast__title'
  )
</script>

<template>
  <!--
    NO `leading-none` HERE. A toast title wraps whenever the card is tight — an icon and an
    action together leave it barely half of the 356px region — and `leading-none` pins the
    line box to the font size (14px) while the glyphs need 18px, so every wrapped title
    overlapped its own next line by 4px. `text-label-md` already carries the token leading
    (1.5), which is what a multi-line title needs; the single-line case is unchanged.
  -->
  <p
    v-bind="$attrs"
    :data-testid="testId"
    class="text-label-md text-(--text-default)"
  >
    <slot />
  </p>
</template>
