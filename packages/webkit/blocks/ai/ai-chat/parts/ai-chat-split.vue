<script setup lang="ts">
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import Resizable from '@aziontech/webkit/resizable-root'

  defineProps<{ split: boolean }>()

  defineSlots<{
    /** The conversation column. */
    default(): unknown
    /** The resizable handle and pane beside it. */
    canvas?(): unknown
  }>()
</script>

<template>
  <component
    :is="split ? Resizable : 'div'"
    :aria-label="split ? 'Conversation and artifact' : undefined"
    class="flex min-h-0 min-w-0 flex-1"
  >
    <component
      :is="split ? ResizablePane : 'div'"
      class="relative flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <slot />
    </component>
    <slot name="canvas" />
  </component>
</template>
