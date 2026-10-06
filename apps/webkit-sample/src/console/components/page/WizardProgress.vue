<script setup lang="ts">
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import { computed } from 'vue'

  import SuccessMark from './SuccessMark.vue'

  interface Props {
    steps?: unknown[]
    currentStep?: number
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    steps: () => [],
    currentStep: 0,
    disabled: false
  })

  const emit = defineEmits<{
    go: [index: unknown]
  }>()

  const total = computed(() => Math.max(props.steps.length, 1))

  const position = computed(() => Math.min(props.currentStep + 1, total.value))

  const value = computed(() => position.value * 2 - 1)
  const max = computed(() => total.value * 2)

  const stepState = (index) => {
    if (index < props.currentStep) return 'done'
    if (index === props.currentStep) return 'current'
    return 'todo'
  }

  const onGo = (index) => {
    if (stepState(index) !== 'done' || props.disabled) return
    emit('go', index)
  }
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
    <ProgressBar
      :value="value"
      :max="max"
      size="small"
      shape="rounded"
      :aria-label="`Step ${position} of ${total}: ${steps[currentStep]?.label ?? ''}`"
    />

    <div class="flex min-w-0 items-baseline justify-between gap-(--spacing-sm)">
      <ol class="hidden min-w-0 flex-wrap items-center gap-(--spacing-xs) sm:flex">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          :data-state="stepState(index)"
          class="group flex min-w-0 items-center gap-(--spacing-xs)"
        >
          <component
            :is="stepState(index) === 'done' ? 'button' : 'span'"
            :type="stepState(index) === 'done' ? 'button' : undefined"
            :disabled="stepState(index) === 'done' && disabled ? true : undefined"
            :aria-current="stepState(index) === 'current' ? 'step' : undefined"
            class="flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) px-(--spacing-xxs) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none group-data-[state=current]:text-(--text-default) group-data-[state=done]:cursor-pointer group-data-[state=done]:hover:text-(--text-default)"
            @click="onGo(index)"
          >
            <SuccessMark
              v-if="stepState(index) === 'done'"
              size="small"
            />
            <span
              v-else
              aria-hidden="true"
              class="shrink-0 tabular-nums"
              >{{ index + 1 }}.</span
            >
            <span class="min-w-0 truncate">{{ step.label }}</span>
          </component>
          <i
            v-if="index < steps.length - 1"
            class="pi pi-chevron-right shrink-0 text-body-xs leading-none text-(--text-muted)"
            aria-hidden="true"
          />
        </li>
      </ol>

      <p class="min-w-0 truncate text-label-sm text-(--text-muted) sm:hidden">
        Step {{ position }} of {{ total }} · {{ steps[currentStep]?.label }}
      </p>
      <p class="hidden shrink-0 text-label-sm text-(--text-muted) sm:block">
        Step {{ position }} of {{ total }}
      </p>
    </div>
  </div>
</template>
