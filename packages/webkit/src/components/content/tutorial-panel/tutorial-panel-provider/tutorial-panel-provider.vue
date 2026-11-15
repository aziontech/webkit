<script setup lang="ts">
  import { computed, provide, ref } from 'vue'

  import type { Tutorial, TutorialFlatStep } from '../injection-key'
  import { TutorialInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TutorialPanelProvider',
    inheritAttrs: false
  })

  interface Props {
    /** The tutorials the panel lists and the hotspots on the page belong to. */
    tutorials?: Tutorial[]
  }

  const props = withDefaults(defineProps<Props>(), {
    tutorials: () => []
  })

  const emit = defineEmits<{
    start: [event: Event, id: string]
    exit: [event: Event, id: string]
    complete: [event: Event, id: string]
  }>()

  /** Id of the running tutorial; null when none runs. Use with v-model:active; unbound, the provider keeps it locally. */
  const active = defineModel<string | null>('active', { default: null })

  /** 0-based index of the current step across the running tutorial's tasks. Use with v-model:step; unbound, the provider keeps it locally. */
  const step = defineModel<number>('step', { default: 0 })

  defineSlots<{
    /** The page: the layout that holds the TutorialPanel and every Hotspot. */
    default(): unknown
  }>()

  const dismissed = ref(false)
  const focusRequest = ref(0)
  const hotspots = ref<Record<string, number>>({})

  const tutorials = computed<Tutorial[]>(() => props.tutorials)

  const activeTutorial = computed<Tutorial | null>(
    () => tutorials.value.find((tutorial) => tutorial.id === active.value) ?? null
  )

  const steps = computed<TutorialFlatStep[]>(() => {
    const out: TutorialFlatStep[] = []
    activeTutorial.value?.tasks.forEach((task, taskIndex) => {
      task.steps.forEach((step) => out.push({ ...step, index: out.length, taskIndex }))
    })
    return out
  })

  const currentStep = computed<number>(() => Math.min(Math.max(step.value, 0), steps.value.length))

  const finished = computed<boolean>(
    () =>
      activeTutorial.value !== null &&
      steps.value.length > 0 &&
      currentStep.value >= steps.value.length
  )

  const move = (index: number) => {
    dismissed.value = false
    step.value = index
    focusRequest.value += 1
  }

  const start = (event: Event, id: string) => {
    active.value = id
    move(0)
    emit('start', event, id)
  }

  const exit = (event: Event) => {
    const id = activeTutorial.value?.id
    active.value = null
    step.value = 0
    dismissed.value = false
    if (id) emit('exit', event, id)
  }

  const goTo = (index: number) => {
    if (!activeTutorial.value || index < 0 || index >= steps.value.length) return
    move(index)
  }

  const next = (event: Event) => {
    if (!activeTutorial.value) return
    const to = currentStep.value + 1
    move(Math.min(to, steps.value.length))
    if (to >= steps.value.length) emit('complete', event, activeTutorial.value.id)
  }

  const previous = () => {
    if (currentStep.value > 0) move(currentStep.value - 1)
  }

  provide(TutorialInjectionKey, {
    tutorials,
    active: activeTutorial,
    steps,
    step: currentStep,
    finished,
    dismissed: computed(() => dismissed.value),
    focusRequest: computed(() => focusRequest.value),
    start,
    exit,
    goTo,
    next,
    previous,
    dismiss: () => {
      dismissed.value = true
    },
    registerHotspot: (id) => {
      hotspots.value = { ...hotspots.value, [id]: (hotspots.value[id] ?? 0) + 1 }
    },
    unregisterHotspot: (id) => {
      const count = (hotspots.value[id] ?? 1) - 1
      const nextMap = { ...hotspots.value }
      if (count > 0) nextMap[id] = count
      else delete nextMap[id]
      hotspots.value = nextMap
    },
    hasHotspot: (id) => (hotspots.value[id] ?? 0) > 0
  })
</script>

<template>
  <slot />
</template>
