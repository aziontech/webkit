<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  defineOptions({
    name: 'HelpPanelGroup',
    inheritAttrs: false
  })

  export interface HelpPanelGroupProps {
    /** The question this section answers; the section renders no heading when empty. */
    label?: string
  }

  withDefaults(defineProps<HelpPanelGroupProps>(), {
    label: ''
  })

  defineSlots<{
    /** The section's prose: paragraphs, short lists, inline anchors. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const headingId = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'help-panel-group'
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-labelledby="label ? headingId : undefined"
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <h3
      v-if="label"
      :id="headingId"
      class="text-heading-2xs text-(--text-default)"
    >
      {{ label }}
    </h3>
    <div
      class="flex flex-col gap-(--spacing-sm) text-body-sm text-(--text-default) [&_ul]:list-disc [&_ul]:ps-(--spacing-lg) [&_ol]:list-decimal [&_ol]:ps-(--spacing-lg) [&_a]:text-link"
    >
      <slot />
    </div>
  </section>
</template>
