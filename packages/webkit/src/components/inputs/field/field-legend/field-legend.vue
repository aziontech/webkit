<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FieldLegend',
    inheritAttrs: false
  })

  export type FieldLegendKind = 'legend' | 'label'

  export interface Props {
    /** Visual weight: `legend` titles a section, `label` matches a FieldLabel for a group of choices. */
    kind?: FieldLegendKind
  }

  withDefaults(defineProps<Props>(), {
    kind: 'legend'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-legend'
  )
</script>

<template>
  <legend
    v-bind="$attrs"
    data-slot="field-legend"
    :data-kind="kind"
    :data-testid="testId"
    class="mb-(--spacing-xxs) p-0 text-(--text-default) data-[kind=legend]:text-label-md data-[kind=label]:text-label-sm"
  >
    <slot />
  </legend>
</template>
