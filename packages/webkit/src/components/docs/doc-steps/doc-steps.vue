<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useStepRegistry } from '../../../composables/use-step-registry'
  import { DocStepsInjectionKey } from './injection-key'

  defineOptions({ name: 'DocSteps', inheritAttrs: false })

  defineSlots<{
    /** The DocSteps.Step children, in the order they should be numbered. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  provide(DocStepsInjectionKey, useStepRegistry())

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-steps')
</script>

<template>
  <ol
    v-bind="$attrs"
    data-doc-block
    :data-testid="testId"
    class="m-0 flex w-full list-none! flex-col items-start p-0!"
  >
    <slot />
  </ol>
</template>
