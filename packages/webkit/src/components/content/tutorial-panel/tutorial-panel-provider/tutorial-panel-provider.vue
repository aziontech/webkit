<script setup lang="ts">
  import { computed, provide, ref } from 'vue'

  import { useControllable } from '../../../../composables/use-controllable'
  import type { Tutorial, TutorialFlatStep } from '../injection-key'
  import { TutorialInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TutorialPanelProvider',
    inheritAttrs: false
  })

  interface Props {
    /** The tutorials the panel lists and the hotspots on the page belong to. */
    tutorials?: Tutorial[]
    /** Id of the running tutorial; null when none runs. Use with v-model:active. */
    active?: string | null
    /** 0-based index of the current step across the running tutorial's tasks. Use with v-model:step. */
    step?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    tutorials: () => [],
    active: undefined,
    step: undefined
  })

  const emit = defineEmits<{
    'update:active': [value: string | null]
    'update:step': [value: number]
    start: [id: string]
    exit: [id: string]
    finish: [id: string]
  }>()

  defineSlots<{
    /** The page: the layout that holds the TutorialPanel and every Hotspot. */
    default(): unknown
  }>()

  const activeState = useControllable<string | null>({
    prop: computed(() => props.active),
    defaultProp: null,
    onChange: (value) => emit('update:active', value)
  })

  const stepState = useControllable<number>({
    prop: computed(() => props.step),
    defaultProp: 0,
    onChange: (value) => emit('update:step', value)
  })

  const dismissed = ref(false)
  const focusRequest = ref(0)
  const hotspots = ref<Record<string, number>>({})

  const tutorials = computed<Tutorial[]>(() => props.tutorials)

  const activeTutorial = computed<Tutorial | null>(
    () => tutorials.value.find((tutorial) => tutorial.id === activeState.value) ?? null
  )

  const steps = computed<TutorialFlatStep[]>(() => {
    const out: TutorialFlatStep[] = []
    activeTutorial.value?.tasks.forEach((task, taskIndex) => {
      task.steps.forEach((step) => out.push({ ...step, index: out.length, taskIndex }))
    })
    return out
  })

  const currentStep = computed<number>(() =>
    Math.min(Math.max(stepState.value, 0), steps.value.length)
  )

  const finished = computed<boolean>(
    () =>
      activeTutorial.value !== null &&
      steps.value.length > 0 &&
      currentStep.value >= steps.value.length
  )

  const move = (index: number) => {
    dismissed.value = false
    stepState.set(index)
    focusRequest.value += 1
  }

  const start = (id: string) => {
    activeState.set(id)
    move(0)
    emit('start', id)
  }

  const exit = () => {
    const id = activeTutorial.value?.id
    activeState.set(null)
    stepState.set(0)
    dismissed.value = false
    if (id) emit('exit', id)
  }

  const goTo = (index: number) => {
    if (!activeTutorial.value || index < 0 || index >= steps.value.length) return
    move(index)
  }

  const next = () => {
    if (!activeTutorial.value) return
    const to = currentStep.value + 1
    move(Math.min(to, steps.value.length))
    if (to >= steps.value.length) emit('finish', activeTutorial.value.id)
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
