<script setup lang="ts">
  import { computed, onBeforeUnmount, useAttrs } from 'vue'

  import { useDocStepsContext } from '../doc-steps/composables/use-doc-steps-context'

  /**
   * One numbered step. The number comes from the DocSteps context — the step
   * registers itself in setup and reads its reactive index back, so reordering
   * the page renumbers it. Outside a DocSteps provider it throws, loudly.
   */
  defineOptions({ name: 'DocStep', inheritAttrs: false })

  interface Props {
    /** The step heading. */
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: ''
  })

  defineSlots<{
    /** Optional body under the step heading: prose, code, or another component. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const context = useDocStepsContext()

  const id = Symbol('DocStep')
  const { index } = context.register(id)

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-step')

  onBeforeUnmount(() => context.unregister(id))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full items-stretch gap-(--spacing-md) last:[&_[data-step-body]]:pb-0 last:[&_[data-step-connector]]:hidden"
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
      class="min-w-0 flex-1 pt-(--spacing-xxs) pb-(--spacing-lg)"
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
  </div>
</template>
