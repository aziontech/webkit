<script setup lang="ts">
  defineOptions({ name: 'DocAccordionItem' })

  interface Props {
    /** The question the trigger shows; `DocAccordionGroup` reads it to build the row. */
    title?: string
    /** Opens this entry on first render. */
    defaultOpen?: boolean
  }

  withDefaults(defineProps<Props>(), { title: '', defaultOpen: false })

  defineSlots<{
    /** The answer shown when the entry is open. */
    default(): unknown
  }>()
</script>

<template>
  <div
    data-testid="documentation-doc-accordion-item"
    class="contents"
  >
    <slot />
  </div>
</template>
