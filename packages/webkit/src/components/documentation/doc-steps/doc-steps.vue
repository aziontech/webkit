<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import type { DocStepHandle, DocStepsContext } from './injection-key'
  import { DocStepsInjectionKey } from './injection-key'

  /**
   * Each DocStep registers itself through the provided context and reads its
   * reactive number back: numbering is a fact of mount (document) order. A registry,
   * not vnode cloning — rewriting slot vnodes couples the parent to the slot output.
   */
  defineOptions({ name: 'DocSteps', inheritAttrs: false })

  defineSlots<{
    /** The DocStep children, in the order they should be numbered. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  /** Registered step ids, in registration (document) order. */
  const steps = ref<symbol[]>([])

  const register: DocStepsContext['register'] = (id) => {
    steps.value.push(id)
    const handle: DocStepHandle = {
      index: computed(() => steps.value.indexOf(id) + 1)
    }
    return handle
  }

  const unregister: DocStepsContext['unregister'] = (id) => {
    const at = steps.value.indexOf(id)
    if (at !== -1) {
      steps.value.splice(at, 1)
    }
  }

  provide(DocStepsInjectionKey, { register, unregister })

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
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
