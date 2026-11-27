<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { useDocStepsContext } from './composables/use-doc-steps-context'

  defineOptions({ name: 'DocStepsStep', inheritAttrs: false })

  export interface DocStepsStepProps {
    /** The step heading. */
    title?: string
  }

  withDefaults(defineProps<DocStepsStepProps>(), {
    title: ''
  })

  defineSlots<{
    /** Optional body under the step heading: prose, code, or another component. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const context = useDocStepsContext()

  const id = Symbol('DocStepsStep')
  const { index } = context.register(id)
  const rootEl = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-steps-step')

  onMounted(() => context.attach(id, rootEl.value))
  onBeforeUnmount(() => context.unregister(id))
</script>

<template>
  <li
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full items-stretch gap-(--spacing-md) pt-0! last:[&_[data-step-body]]:pb-0 last:[&_[data-step-connector]]:hidden"
  >
    <div class="flex w-8 shrink-0 flex-col items-center">
      <span
        class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-full) border border-(--border-default) bg-(--bg-surface) text-label-md text-(--text-default)"
        aria-hidden="true"
      >
        {{ index }}
      </span>
      <span
        data-step-connector
        class="w-px flex-1 bg-(--border-default)"
        aria-hidden="true"
      />
    </div>
    <div
      data-step-body
      class="min-w-0 flex-1 pt-(--spacing-2xs) pb-(--spacing-lg)"
    >
      <span
        data-doc-chrome
        class="block text-heading-xs text-(--text-default)"
        >{{ title }}</span
      >
      <div
        v-if="$slots['default']"
        class="pt-(--spacing-sm) [&>*:first-child]:pt-0!"
      >
        <slot />
      </div>
    </div>
  </li>
</template>
