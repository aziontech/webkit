<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import Spinner from '../../../utils/spinner/spinner.vue'
  import { useStepperContext } from '../composables/use-stepper-context'

  defineOptions({
    name: 'StepperStep',
    inheritAttrs: false
  })

  /** What the owner knows about a step. The current step is derived from the root. */
  export type StepperStepState = 'upcoming' | 'complete' | 'error' | 'loading'

  interface Props {
    /** Identity of this step; matches the root's v-model when it is the current one. */
    value?: string
    /** What this step asks, in the reader's words. */
    title?: string
    /** One line under the title saying what the step decides. */
    description?: string
    /** What the owner knows about this step. */
    state?: StepperStepState
    /** The step cannot be reached yet: not focusable and not clickable. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    title: '',
    description: '',
    state: 'upcoming',
    disabled: false
  })

  defineSlots<{
    /** Optional body under the description, inside the rail. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const context = useStepperContext()

  const id = Symbol('StepperStep')
  const { index, isLast } = context.register(id)
  const root = ref<globalThis.HTMLElement | null>(null)

  onMounted(() => context.attach(id, root.value))
  onBeforeUnmount(() => context.unregister(id))

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-stepper-step'
  )

  const dataState = computed<'upcoming' | 'complete' | 'error' | 'loading' | 'current'>(() => {
    if (props.state === 'error') return 'error'
    if (props.state === 'loading') return 'loading'
    if (context.current.value === props.value) return 'current'
    if (props.state === 'complete') return 'complete'
    return 'upcoming'
  })

  const stateLabel = computed<string>(() => {
    if (dataState.value === 'error') return 'Needs attention'
    if (dataState.value === 'loading') return 'In progress'
    if (dataState.value === 'current') return 'Current step'
    if (dataState.value === 'complete') return 'Completed'
    return 'Not started'
  })

  const activate = () => context.select(props.value)
</script>

<template>
  <li
    ref="root"
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="dataState"
    :data-disabled="disabled || null"
    class="group/step w-full"
  >
    <button
      type="button"
      :disabled="disabled"
      :aria-current="dataState === 'current' ? 'step' : undefined"
      :aria-busy="dataState === 'loading' ? 'true' : undefined"
      class="flex min-h-10 w-full items-stretch gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) focus-visible:outline-none disabled:cursor-not-allowed disabled:hover:bg-transparent motion-reduce:transition-none"
      @click="activate"
    >
      <span
        class="flex w-6 shrink-0 flex-col items-center"
        aria-hidden="true"
      >
        <span
          data-step-dot
          class="relative flex size-6 shrink-0 items-center justify-center rounded-(--radius-full) border border-(--border-default) bg-(--bg-surface) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[state=complete]/step:border-(--secondary) group-data-[state=complete]/step:bg-(--secondary) group-data-[state=complete]/step:text-(--secondary-contrast) group-data-[state=current]/step:border-(--secondary) group-data-[state=error]/step:border-(--danger-border) group-data-[state=error]/step:bg-(--danger) group-data-[state=error]/step:text-(--danger-contrast) group-data-[state=loading]/step:border-(--secondary) group-data-[state=loading]/step:text-(--secondary) group-data-[disabled]/step:text-(--text-disabled) motion-reduce:transition-none"
        >
          <span
            data-step-disc
            class="pointer-events-none absolute inset-0 m-auto size-2 scale-0 rounded-(--radius-full) bg-(--secondary) transition-[scale] duration-fast-02 ease-productive-entrance group-data-[state=current]/step:scale-100 motion-reduce:transition-none"
          />
          <Spinner
            v-if="dataState === 'loading'"
            class="size-3"
          />
          <span
            v-else-if="dataState === 'complete'"
            class="pi pi-check text-label-sm"
          />
          <span
            v-else-if="dataState === 'error'"
            class="pi pi-exclamation-triangle text-label-sm"
          />
          <span v-else-if="dataState !== 'current'">{{ index }}</span>
        </span>
        <span
          v-if="!isLast"
          data-step-connector
          class="relative mt-(--spacing-xs) min-h-6 w-px flex-1 bg-(--border-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        >
          <span
            class="absolute inset-0 origin-top scale-y-0 bg-(--secondary) transition-[scale] duration-moderate-02 ease-productive-entrance group-data-[state=complete]/step:scale-y-100 motion-reduce:transition-none"
          />
        </span>
      </span>
      <span class="flex min-w-0 flex-1 flex-col pb-(--spacing-sm)">
        <span
          class="flex min-h-6 items-center text-label-md text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[state=complete]/step:text-(--text-default) group-data-[state=current]/step:text-(--text-default) group-data-[disabled]/step:text-(--text-disabled) motion-reduce:transition-none"
          >{{ title }}</span
        >
        <span class="sr-only">{{ stateLabel }}</span>
        <Transition
          enter-active-class="transition-[grid-template-rows,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="grid-rows-[0fr] opacity-0"
          enter-to-class="grid-rows-[1fr] opacity-100"
          leave-active-class="transition-[grid-template-rows,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          leave-from-class="grid-rows-[1fr] opacity-100"
          leave-to-class="grid-rows-[0fr] opacity-0"
        >
          <span
            v-if="description"
            data-step-description
            class="grid"
          >
            <span
              class="min-h-0 overflow-hidden text-body-sm text-(--text-muted) group-data-[disabled]/step:text-(--text-disabled)"
              >{{ description }}</span
            >
          </span>
        </Transition>
        <span
          v-if="$slots['default']"
          class="pt-(--spacing-xs)"
        >
          <slot />
        </span>
      </span>
    </button>
  </li>
</template>
