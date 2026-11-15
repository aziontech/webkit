<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import Spinner from '../../../utils/spinner/spinner.vue'
  import { useStepperContext } from '../composables/use-stepper-context'

  defineOptions({
    name: 'StepperStep',
    inheritAttrs: false
  })

  /** What the owner knows about a step. The active step is derived from the root. */
  export type StepperStepStatus = 'pending' | 'running' | 'success' | 'error'

  interface Props {
    /** Identity of this step; matches the root's v-model when it is the active one. */
    value?: string
    /** What this step asks, in the reader's words. */
    title?: string
    /** One line under the title saying what the step decides. */
    description?: string
    /** What the owner knows about this step. */
    status?: StepperStepStatus
    /** The step cannot be reached yet: not focusable and not clickable. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    title: '',
    description: '',
    status: 'pending',
    disabled: false
  })

  defineSlots<{
    /** Optional body under the description, inside the rail. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ stepper: en.stepper })
  const context = useStepperContext()

  const id = Symbol('StepperStep')
  const { index, isLast } = context.register(id)
  const rootEl = ref<globalThis.HTMLElement | null>(null)

  onMounted(() => context.attach(id, rootEl.value))
  onBeforeUnmount(() => context.unregister(id))

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-stepper-step'
  )

  const shown = computed<StepperStepStatus | 'active'>(() => {
    if (props.status === 'error' || props.status === 'running') return props.status
    if (context.active.value === props.value) return 'active'
    return props.status
  })

  const statusLabel = computed<string>(() => {
    if (shown.value === 'error') return t('stepper.error')
    if (shown.value === 'running') return t('stepper.loading')
    if (shown.value === 'active') return t('stepper.current')
    if (shown.value === 'success') return t('stepper.complete')
    return t('stepper.upcoming')
  })

  const activate = () => context.select(props.value)
</script>

<template>
  <li
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    :data-status="status"
    :data-active="shown === 'active' || null"
    :data-completed="shown === 'success' || null"
    :data-disabled="disabled || null"
    :data-has-body="$slots['default'] ? '' : null"
    class="group/step relative w-full"
  >
    <button
      type="button"
      :disabled="disabled"
      :aria-current="shown === 'active' ? 'step' : undefined"
      :aria-busy="shown === 'running' ? 'true' : undefined"
      class="flex min-h-10 w-full items-stretch gap-(--spacing-sm) rounded-(--shape-control) px-(--spacing-sm) py-(--spacing-xs) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) focus-visible:outline-none disabled:cursor-not-allowed disabled:hover:bg-transparent motion-reduce:transition-none"
      @click="activate"
    >
      <span
        class="flex w-6 shrink-0 flex-col items-center"
        aria-hidden="true"
      >
        <span
          data-slot="step-dot"
          class="relative flex size-6 shrink-0 items-center justify-center rounded-(--radius-full) border border-(--border-default) bg-(--bg-surface) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[completed]/step:border-(--secondary) group-data-[completed]/step:bg-(--secondary) group-data-[completed]/step:text-(--secondary-foreground) group-data-[active]/step:border-(--secondary) group-data-[status=error]/step:border-(--danger-border) group-data-[status=error]/step:bg-(--danger) group-data-[status=error]/step:text-(--danger-foreground) group-data-[status=running]/step:border-(--secondary) group-data-[status=running]/step:text-(--secondary) group-data-[disabled]/step:text-(--text-disabled) motion-reduce:transition-none"
        >
          <span
            data-slot="step-disc"
            class="pointer-events-none absolute inset-0 m-auto size-2 scale-0 rounded-(--radius-full) bg-(--secondary) transition-[scale] duration-fast-02 ease-productive-entrance group-data-[active]/step:scale-100 motion-reduce:transition-none"
          />
          <Spinner
            v-if="shown === 'running'"
            class="size-3"
          />
          <span
            v-else-if="shown === 'success'"
            class="ai ai-check text-label-sm"
          />
          <span
            v-else-if="shown === 'error'"
            class="ai ai-triangle-alert text-label-sm"
          />
          <span v-else-if="shown !== 'active'">{{ index }}</span>
        </span>
        <span
          v-if="!isLast"
          class="mt-(--spacing-xs) min-h-6 w-px flex-1"
        />
      </span>
      <span class="flex min-w-0 flex-1 flex-col pb-(--spacing-sm) group-data-[has-body]/step:pb-0">
        <span
          class="flex min-h-6 items-center text-label-md text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-data-[completed]/step:text-(--text-default) group-data-[active]/step:text-(--text-default) group-data-[disabled]/step:text-(--text-disabled) motion-reduce:transition-none"
          >{{ title }}</span
        >
        <span class="sr-only">{{ statusLabel }}</span>
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
            data-slot="step-description"
            class="grid"
          >
            <span
              class="min-h-0 overflow-hidden text-body-sm text-(--text-muted) group-data-[disabled]/step:text-(--text-disabled)"
              >{{ description }}</span
            >
          </span>
        </Transition>
      </span>
    </button>
    <span
      v-if="!isLast"
      data-slot="step-connector"
      aria-hidden="true"
      class="pointer-events-none absolute start-[calc(var(--spacing-sm)+0.75rem-0.5px)] top-[calc(var(--spacing-xs)*2+1.5rem)] bottom-(--spacing-xs) min-h-6 w-px bg-(--border-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
    >
      <span
        class="absolute inset-0 origin-top scale-y-0 bg-(--secondary) transition-[scale] duration-moderate-02 ease-productive-entrance group-data-[completed]/step:scale-y-100 motion-reduce:transition-none"
      />
    </span>
    <div
      v-if="$slots['default']"
      data-slot="step-body"
      class="ps-[calc(var(--spacing-sm)*2+1.5rem)] pe-(--spacing-sm) pb-[calc(var(--spacing-sm)+var(--spacing-xs))]"
    >
      <slot />
    </div>
  </li>
</template>
