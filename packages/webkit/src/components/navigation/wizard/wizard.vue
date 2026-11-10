<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Stepper from '../stepper/stepper.vue'
  import StepperStep from '../stepper/stepper-step/stepper-step.vue'
  import type { WizardStepHandle, WizardStepMeta, WizardStepRecord } from './injection-key'
  import { WizardInjectionKey } from './injection-key'

  defineOptions({
    name: 'Wizard',
    inheritAttrs: false
  })

  interface Props {
    /** Label of the primary action on the last step, where Next becomes the submit action. */
    submitLabel?: string
    /** Submit in progress: the primary action shows its loading state, and Cancel, Previous and every rail step are disabled. */
    loading?: boolean
    /** Accessible name for the wizard region. Name the task, for example Create edge application. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    submitLabel: 'Create',
    loading: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** Next was activated on any step but the last, before the wizard advances. Cancelable with preventDefault. */
    next: [event: MouseEvent, step: number]
    /** The primary action was activated on the last step. */
    submit: [event: MouseEvent]
    /** Cancel was activated. */
    cancel: [event: MouseEvent]
  }>()

  const activeStep = defineModel<number>('activeStep', { default: 0 })

  defineSlots<{
    /** The Wizard.Step children, in the order they are numbered and navigated. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const ids = ref<symbol[]>([])
  const metas = new Map<symbol, WizardStepMeta>()
  const elements = new Map<symbol, globalThis.HTMLElement>()

  const ordered = computed<symbol[]>(() =>
    [...ids.value].sort((a, b) => {
      const left = elements.get(a)
      const right = elements.get(b)
      if (!left || !right) return 0
      const relation = left.compareDocumentPosition(right)
      if (relation & Node.DOCUMENT_POSITION_FOLLOWING) return -1
      if (relation & Node.DOCUMENT_POSITION_PRECEDING) return 1
      return 0
    })
  )

  const steps = computed<WizardStepRecord[]>(() =>
    ordered.value.map((id) => {
      const meta = metas.get(id)
      return { id, title: meta?.title() ?? '', optional: meta?.optional() ?? false }
    })
  )

  const total = computed<number>(() => ordered.value.length)

  const current = computed<number>(() => {
    if (total.value === 0) return 0
    const requested = Number.isFinite(activeStep.value) ? Math.trunc(activeStep.value) : 0
    return Math.min(Math.max(requested, 0), total.value - 1)
  })

  const isLast = computed<boolean>(() => current.value === total.value - 1)

  const railValue = computed<string>({
    get: () => String(current.value),
    set: (value) => {
      if (props.loading) return
      activeStep.value = Number(value)
    }
  })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-wizard'
  )

  const register = (id: symbol, meta: WizardStepMeta): WizardStepHandle => {
    metas.set(id, meta)
    ids.value.push(id)
    const index = computed<number>(() => ordered.value.indexOf(id))
    return {
      index,
      active: computed<boolean>(() => index.value === current.value)
    }
  }

  const attach = (id: symbol, el: globalThis.HTMLElement | null) => {
    if (el) elements.set(id, el)
    else elements.delete(id)
    ids.value = [...ids.value]
  }

  const unregister = (id: symbol) => {
    metas.delete(id)
    elements.delete(id)
    const at = ids.value.indexOf(id)
    if (at !== -1) ids.value.splice(at, 1)
  }

  provide(WizardInjectionKey, {
    steps,
    activeStep: current,
    total,
    loading: computed<boolean>(() => props.loading),
    register,
    attach,
    unregister
  })

  const onPrimary = (event: MouseEvent) => {
    if (props.loading) return
    if (isLast.value) {
      emit('submit', event)
      return
    }
    const step = current.value
    emit('next', event, step)
    if (event.defaultPrevented) return
    activeStep.value = step + 1
  }

  const onPrevious = () => {
    if (props.loading || current.value === 0) return
    activeStep.value = current.value - 1
  }

  const onCancel = (event: MouseEvent) => {
    if (props.loading) return
    emit('cancel', event)
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-label="ariaLabel || undefined"
    :data-testid="testId"
    :data-loading="loading || null"
    :data-active-step="current"
    class="flex w-full md:gap-(--spacing-xxl)"
  >
    <div class="max-md:hidden md:w-(--container-3xs) md:shrink-0">
      <Stepper v-model="railValue">
        <StepperStep
          v-for="(step, index) in steps"
          :key="step.id"
          :value="String(index)"
          :title="step.title"
          :state="index < current ? 'complete' : 'upcoming'"
          :disabled="loading || index > current"
        >
          <span
            v-if="step.optional"
            class="text-body-xs text-(--text-muted)"
            >Optional</span
          >
        </StepperStep>
      </Stepper>
    </div>
    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xl)">
      <div>
        <slot />
      </div>
      <div
        class="flex items-center justify-between gap-(--spacing-xs) border-t border-(--border-default) pt-(--spacing-md)"
      >
        <Button
          kind="transparent"
          label="Cancel"
          :disabled="loading"
          @click="onCancel"
        />
        <div class="flex items-center gap-(--spacing-xs)">
          <Button
            v-if="current > 0"
            kind="secondary"
            label="Previous"
            :disabled="loading"
            @click="onPrevious"
          />
          <Button
            kind="primary"
            :label="isLast ? submitLabel : 'Next'"
            :loading="loading"
            @click="onPrimary"
          />
        </div>
      </div>
    </div>
  </section>
</template>
