<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverHeader',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = usePopoverContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__header`
  )
</script>

<template>
  <header
    v-bind="attrs"
    :data-testid="testId"
    class="relative border-b border-(--border-default) py-(--spacing-sm) px-(--spacing-md)"
  >
    <!--
      min-h matches the absolute close button (IconButton small is `size-7` = 1.75rem):
      with no description the lone title line top-aligns within a row at least as tall as
      the close, instead of centering in the header's symmetric padding.

      It is the bare `min-h-7`, mirroring the button's own `size-7`, because it must equal
      that box — there is no token for it, and the one this previously named did not have
      the right value anyway. It used to name `--size-4` through an inverted bracket/paren
      shorthand, which emits no CSS, so the row had no minimum height at all — and that
      token is 16px, not the 1.75rem this is matching. Two defects hiding each other; the
      `dead-token-shorthand` token-check now catches the first class.
    -->
    <div
      class="flex min-h-7 flex-col gap-(--spacing-xxs) pr-(--spacing-xxl) [&>button]:absolute [&>button]:right-(--spacing-md) [&>button]:top-(--spacing-sm)"
    >
      <slot />
    </div>
  </header>
</template>
