<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import type { DocStepHandle, DocStepsContext } from './injection-key'
  import { DocStepsInjectionKey } from './injection-key'

  /**
   * The ordered walkthrough from the docs frame: a column of DocStep children
   * joined by a rail. Each child registers itself through the provided context
   * and reads its number back, so the numbering is a fact of the document
   * order — an author writes titles, never numbers, and reordering the page
   * renumbers it. The final registered step is marked last, which is what
   * drops its connector and trailing space.
   *
   * The registry replaces an earlier version that walked its slot children and
   * cloned each vnode with an injected index. Reading and rewriting child
   * vnode props coupled the parent to the slot's render output; the context
   * couples it only to the steps that actually mount, in the order they mount.
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
