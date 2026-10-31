<script setup lang="ts">
  /**
   * One collapsible entry inside a `DocAccordionGroup`. It carries only its
   * title and body; the group owns the open-state model and hands each item the
   * value it registers under.
   */
  defineOptions({ name: 'DocAccordionItem' })

  interface Props {
    /** The trigger label. */
    title?: string
    /** Open on first render. */
    defaultOpen?: boolean
  }

  withDefaults(defineProps<Props>(), { title: '', defaultOpen: false })

  defineSlots<{
    /** The collapsed body. */
    default(): unknown
  }>()
</script>

<template>
  <div
    data-testid="doc-accordion-item"
    class="contents"
  >
    <slot />
  </div>
</template>
