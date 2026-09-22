<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import type { StepperStepHandle } from './injection-key'
  import { StepperInjectionKey } from './injection-key'

  defineOptions({
    name: 'Stepper',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Accessible name for the step rail. */
      ariaLabel?: string
    }>(),
    {
      ariaLabel: 'Steps'
    }
  )

  defineSlots<{
    /** The Stepper.Step children, in the order they are numbered. */
    default(): unknown
  }>()

  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()

  const steps = ref<symbol[]>([])
  const elements = new Map<symbol, HTMLElement>()

  /**
   * Registration order is the order instances happened to mount, which stops matching the
   * rail the moment a step is inserted between two that already exist — Vue reuses those
   * instances, so they never re-register and their numbers go stale. Document order is the
   * only order a reader can see, so that is the one the rail counts in.
   */
  const ordered = computed(() =>
    [...steps.value].sort((a, b) => {
      const left = elements.get(a)
      const right = elements.get(b)
      if (!left || !right) return 0
      const relation = left.compareDocumentPosition(right)
      if (relation & Node.DOCUMENT_POSITION_FOLLOWING) return -1
      if (relation & Node.DOCUMENT_POSITION_PRECEDING) return 1
      return 0
    })
  )

  const register = (id: symbol): StepperStepHandle => {
    steps.value.push(id)
    return {
      index: computed(() => ordered.value.indexOf(id) + 1),
      isLast: computed(() => ordered.value.indexOf(id) === ordered.value.length - 1)
    }
  }

  const attach = (id: symbol, el: HTMLElement | null) => {
    if (el) elements.set(id, el)
    else elements.delete(id)
    steps.value = [...steps.value]
  }

  const unregister = (id: symbol) => {
    elements.delete(id)
    const at = steps.value.indexOf(id)
    if (at !== -1) steps.value.splice(at, 1)
  }

  const select = (value: string) => {
    model.value = value
  }

  provide(StepperInjectionKey, {
    current: computed(() => model.value),
    register,
    attach,
    unregister,
    select
  })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-stepper'
  )
</script>

<template>
  <nav
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :data-testid="testId"
    :data-current="model"
    data-orientation="vertical"
    class="w-full"
  >
    <ol class="flex w-full flex-col">
      <slot />
    </ol>
  </nav>
</template>
