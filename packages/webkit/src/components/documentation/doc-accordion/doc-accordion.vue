<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'DocAccordion', inheritAttrs: false })

  export interface DocAccordionProps {
    /** The question the trigger shows; `DocAccordionGroup` reads it to build the row. */
    title?: string
    /** Opens this entry on first render. */
    defaultOpen?: boolean
  }

  withDefaults(defineProps<DocAccordionProps>(), { title: '', defaultOpen: false })

  defineSlots<{
    /** The answer shown when the entry is open. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-accordion'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="contents"
  >
    <slot />
  </div>
</template>
