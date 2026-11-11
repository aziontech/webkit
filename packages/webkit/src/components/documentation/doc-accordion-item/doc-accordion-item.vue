<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'DocAccordionItem', inheritAttrs: false })

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

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-accordion-item'
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
