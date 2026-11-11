<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'DocTab', inheritAttrs: false })

  interface Props {
    /** The tab label; `DocTabs` reads it to build the strip. */
    title?: string
  }

  withDefaults(defineProps<Props>(), { title: '' })

  defineSlots<{
    /** The panel body. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-tab'
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
