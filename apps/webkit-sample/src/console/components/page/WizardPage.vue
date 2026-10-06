<script setup lang="ts">
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import { computed, useSlots, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { revealFirstInvalid } from '../../lib/behavior/reveal-invalid'
  import { useScrollFade } from '../../lib/behavior/scroll-fade'
  import UnsavedChangesGuard from '../form/UnsavedChangesGuard.vue'
  import CreationHeader from './CreationHeader.vue'
  import PageHeading from './PageHeading.vue'
  import StepRail from './StepRail.vue'

  interface Props {
    breadcrumb?: unknown[]
    backLabel?: string
    title?: string
    description?: string
    titleId?: string
    steps?: unknown[]
    currentStep?: number
    nextLabel?: string
    nextDisabled?: boolean
    submitting?: boolean
    dirty?: boolean
    heading?: boolean
    terminal?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    breadcrumb: () => [],
    backLabel: 'Back',
    title: '',
    description: '',
    steps: () => [],
    currentStep: 0,
    nextLabel: 'Next',
    nextDisabled: false,
    submitting: false,
    dirty: false,
    heading: true,
    terminal: false
  })

  defineSlots<{
    default(): unknown
    terminal(): unknown
    start(): unknown
  }>()

  const emit = defineEmits<{
    back: []
    next: []
    cancel: []
    go: [index: unknown]
  }>()

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const atStart = computed(() => props.currentStep <= 0)

  const railSteps = computed(() =>
    props.steps.map((step, index) => ({
      value: String(step.id ?? index),
      title: step.label ?? '',
      description: step.description ?? '',
      state: props.submitting && index === props.currentStep ? 'loading' : index < props.currentStep ? 'complete' : 'upcoming',
      disabled: index > props.currentStep || props.submitting
    }))
  )

  const currentValue = computed({
    get: () => String(props.steps[props.currentStep]?.id ?? props.currentStep),
    set: (value) => {
      const index = railSteps.value.findIndex((step) => step.value === value)
      if (index !== -1 && index !== props.currentStep) emit('go', index)
    }
  })

  const slots = useSlots()
  const hasActions = computed(
    () => !atStart.value || Boolean(props.nextLabel) || Boolean(slots.start)
  )

  const { scroller, fadeStyle } = useScrollFade()
  watch(
    () => [props.currentStep, props.terminal],
    () => scroller.value?.scrollTo({ top: 0 })
  )

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const timing = (property, ms) => `${property} ${ms} ${curve['productive-entrance']}`

  const partTransitionStyle = () =>
    prefersReducedMotion()
      ? { transition: 'none' }
      : {
          transition: [
            timing('opacity', duration['moderate-02']),
            timing('transform', duration['fast-02']),
            timing('translate', duration['fast-02'])
          ].join(', ')
        }

  const onCrumb = (event, href) => {
    if (!href || href === '#') {
      emit('cancel')
      return
    }
    const [path, queryString] = href.split('?')
    const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
    router.push({ path, query: { email: userEmail.value, ...extra } })
  }

  defineExpose({ revealInvalid: () => revealFirstInvalid(scroller.value) })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <UnsavedChangesGuard :dirty="dirty" />

    <CreationHeader
      :show-back="!terminal"
      :breadcrumb="terminal ? [] : breadcrumb"
      :back-label="backLabel"
      @back="emit('cancel')"
      @navigate="onCrumb"
    />

    <div class="flex min-h-0 flex-1">
      <StepRail
        v-if="!terminal && steps.length > 1"
        v-model="currentValue"
        :steps="railSteps"
        :aria-label="title || 'Steps'"
      />

      <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 min-w-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-labelledby="titleId"
        :aria-label="titleId ? undefined : title"
        novalidate
        @submit.prevent="emit('next')"
      >
        <div
          ref="scroller"
          :style="fadeStyle"
          class="min-h-0 flex-1 overflow-y-auto scrollbar-gutter-both"
        >
          <div class="flex flex-col pb-(--layout-section-gap)">
            <div
              v-if="heading"
              class="layout-column-form layout-boundary-inline pb-(--spacing-md) pt-(--spacing-lg)"
            >
              <PageHeading
                :title="title"
                :description="description"
                :title-id="titleId"
              />
            </div>

            <p
              v-if="!terminal && steps.length > 1"
              class="layout-column-form layout-boundary-inline pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden"
            >
              Step {{ Math.min(currentStep + 1, steps.length) }} of {{ steps.length }}
            </p>

            <fieldset
              v-if="!terminal"
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col border-0 p-0 pt-(--layout-section-gap)"
              :disabled="submitting"
            >
              <legend class="sr-only">{{ title }}</legend>

              <div class="relative">
                <Transition
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-1"
                  leave-active-class="absolute inset-x-0 top-0"
                >
                  <div
                    :key="steps[currentStep]?.id ?? currentStep"
                    :style="partTransitionStyle()"
                    class="flex min-w-0 flex-col motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <slot />
                  </div>
                </Transition>
              </div>
            </fieldset>

            <div
              v-else
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pt-(--layout-section-gap)"
            >
              <slot name="terminal" />
            </div>
          </div>
        </div>

        <footer
          v-if="!terminal && hasActions"
          class="shrink-0 bg-linear-to-b from-transparent to-(--bg-canvas) pb-(--spacing-lg) pt-(--spacing-xl)"
        >
          <div
            class="layout-column-form layout-boundary-inline flex w-full items-center gap-(--spacing-md)"
          >
            <Button
              v-if="!atStart"
              key="back"
              type="button"
              label="Back"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="emit('back')"
            />

            <div
              v-if="$slots.start"
              class="flex min-w-0 items-center gap-(--spacing-sm)"
            >
              <slot name="start" />
            </div>

            <Button
              v-if="nextLabel"
              key="next"
              class="ms-auto"
              :label="nextLabel"
              kind="primary"
              size="medium"
              :disabled="nextDisabled"
              :loading="submitting"
              @click="emit('next')"
            />
          </div>
        </footer>

        <button
          v-if="nextLabel && !terminal"
          type="submit"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
        >
          {{ nextLabel }}
        </button>
      </form>
      </main>
    </div>
  </div>
</template>
