<script setup lang="ts">
  /**
   * One panel inside `DocTabs`. It holds only its title and its body; the
   * parent reads the title to build the tab strip.
   */
  defineOptions({ name: 'DocTab' })

  interface Props {
    /** The tab label. */
    title?: string
  }

  withDefaults(defineProps<Props>(), { title: '' })

  defineSlots<{
    /** The panel body. */
    default(): unknown
  }>()
</script>

<template>
  <div
    data-testid="doc-tab"
    class="contents"
  >
    <slot />
  </div>
</template>
