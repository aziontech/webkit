<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  defineOptions({
    name: 'HelpPanelSection',
    inheritAttrs: false
  })

  interface Props {
    /** The question this section answers; the section renders no heading when empty. */
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: ''
  })

  defineSlots<{
    /** The section's prose: paragraphs, short lists, inline anchors. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const headingId = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-help-panel-section'
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-labelledby="title ? headingId : undefined"
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <h3
      v-if="title"
      :id="headingId"
      class="text-heading-xxs text-(--text-default)"
    >
      {{ title }}
    </h3>
    <div
      class="flex flex-col gap-(--spacing-sm) text-body-sm text-(--text-default) [&_ul]:list-disc [&_ul]:pl-(--spacing-lg) [&_ol]:list-decimal [&_ol]:pl-(--spacing-lg) [&_a]:text-link"
    >
      <slot />
    </div>
  </section>
</template>
