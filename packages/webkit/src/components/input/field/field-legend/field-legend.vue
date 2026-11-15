<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FieldLegend',
    inheritAttrs: false
  })

  export type FieldLegendType = 'legend' | 'label'

  export interface FieldLegendProps {
    /** Visual weight: `legend` titles a section, `label` matches a FieldLabel for a group of choices. */
    type?: FieldLegendType
  }
  withDefaults(defineProps<FieldLegendProps>(), {
    type: 'legend'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'field-legend')
</script>

<template>
  <legend
    v-bind="$attrs"
    data-slot="field-legend"
    :data-type="type"
    :data-testid="testId"
    class="mb-(--spacing-2xs) p-0 text-(--text-default) data-[type=legend]:text-label-md data-[type=label]:text-label-sm"
  >
    <slot />
  </legend>
</template>
