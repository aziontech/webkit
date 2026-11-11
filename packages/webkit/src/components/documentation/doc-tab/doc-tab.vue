<script setup lang="ts">
  defineOptions({ name: 'DocTab' })

  interface Props {
    /** The tab label; `DocTabs` reads it to build the strip. */
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
    data-testid="documentation-doc-tab"
    class="contents"
  >
    <slot />
  </div>
</template>
