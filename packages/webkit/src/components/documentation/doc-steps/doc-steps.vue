<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useStepRegistry } from '../../../composables/use-step-registry'
  import { DocStepsInjectionKey } from './injection-key'

  defineOptions({ name: 'DocSteps', inheritAttrs: false })

  defineSlots<{
    /** The DocStep children, in the order they should be numbered. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  provide(DocStepsInjectionKey, useStepRegistry())

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-steps')
</script>

<template>
  <div
    v-bind="$attrs"
    data-doc-block
    :data-testid="testId"
    class="flex w-full flex-col items-start"
  >
    <slot />
  </div>
</template>
