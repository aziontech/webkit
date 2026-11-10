<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Slider', inheritAttrs: false })

  interface Props {
    /** Lowest selectable value; the left end of the track. */
    min?: number
    /** Highest selectable value; the right end of the track. */
    max?: number
    /** Increment between selectable values, used by dragging and the arrow keys. */
    step?: number
    /** Disables interaction, removes the control from the tab order and applies the disabled tokens. */
    disabled?: boolean
    /** Keeps the control focusable but prevents the value from changing. */
    readonly?: boolean
    /** Applies the danger tokens and sets aria-invalid. */
    invalid?: boolean
    /** Accessible name when no visible label is associated with the slider. */
    ariaLabel?: string
    /** Shows a tick mark at every step when the range has at most 21 positions. */
    ticks?: boolean
    /** Values marked and labelled under the track; entries outside min and max are ignored. */
    referenceValues?: number[]
    /** Text appended verbatim to the reference labels and to the announced value. */
    unit?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    readonly: false,
    invalid: false,
    ariaLabel: '',
    ticks: false,
    referenceValues: () => [],
    unit: ''
  })

  const emit = defineEmits<{
    /** Committed value, once per pointer release or keyboard step. */
    change: [value: number]
  }>()

  /** Current value. */
  const model = defineModel<number>({ default: 0 })

  const attrs = useAttrs()

  const MAX_TICK_POSITIONS = 21
  const NAVIGATION_KEYS = new Set([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End'
  ])

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-slider')

  const inputAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    return rest
  })

  const span = computed(() => props.max - props.min)

  const fractionOf = (value: number): number => {
    if (span.value <= 0) return 0
    return Math.min(1, Math.max(0, (value - props.min) / span.value))
  }

  const fill = computed(() => `${fractionOf(model.value) * 100}%`)

  const valueText = computed(() => (props.unit ? `${model.value}${props.unit}` : undefined))

  const references = computed(() =>
    [...new Set(props.referenceValues)]
      .filter((value) => value >= props.min && value <= props.max)
      .sort((a, b) => a - b)
  )

  const stepValues = computed(() => {
    if (!props.ticks || span.value <= 0 || props.step <= 0) return []
    const positions = Math.floor(span.value / props.step) + 1
    if (positions > MAX_TICK_POSITIONS) return []
    return Array.from({ length: positions }, (_, index) => props.min + index * props.step)
  })

  const tickMarks = computed(() =>
    [...new Set([...stepValues.value, ...references.value])]
      .sort((a, b) => a - b)
      .map((value) => ({ value, fraction: fractionOf(value) }))
  )

  const referenceLabels = computed(() => {
    const last = references.value.length - 1
    return references.value.map((value, index) => ({
      value,
      fraction: fractionOf(value),
      label: `${value}${props.unit}`,
      align: last === 0 ? 'center' : index === 0 ? 'start' : index === last ? 'end' : 'center'
    }))
  })

  const restore = (event: Event) => {
    const target = event.target as globalThis.HTMLInputElement
    target.value = String(model.value)
  }

  function onInput(event: Event) {
    if (props.disabled) return
    if (props.readonly) {
      restore(event)
      return
    }
    model.value = (event.target as globalThis.HTMLInputElement).valueAsNumber
  }

  function onChange(event: Event) {
    if (props.disabled) return
    if (props.readonly) {
      restore(event)
      return
    }
    emit('change', (event.target as globalThis.HTMLInputElement).valueAsNumber)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (props.readonly && NAVIGATION_KEYS.has(event.key)) event.preventDefault()
  }

  function onPointerdown(event: globalThis.PointerEvent) {
    if (!props.readonly) return
    event.preventDefault()
    const target = event.currentTarget as globalThis.HTMLInputElement
    target.focus()
  }
</script>

<template>
  <div
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    :data-invalid="invalid || null"
    :style="{ '--slider-fill': fill }"
    :class="attrs['class']"
    class="group flex w-full min-w-0 flex-col gap-(--spacing-xxs) [--slider-accent:var(--accent)] [--slider-track:var(--bg-surface)] [--slider-track-border:var(--border-default)] [--slider-tick:var(--border-strong)] [--slider-label:var(--text-muted)] data-[readonly]:not-data-[disabled]:[--slider-accent:var(--text-muted)] data-[invalid]:not-data-[disabled]:[--slider-accent:var(--danger)] data-[invalid]:not-data-[disabled]:[--slider-track-border:var(--danger-border)] data-[disabled]:[--slider-accent:var(--text-disabled)] data-[disabled]:[--slider-track:var(--bg-disabled)] data-[disabled]:[--slider-tick:var(--text-disabled)] data-[disabled]:[--slider-label:var(--text-disabled)]"
  >
    <input
      type="range"
      :value="model"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-label="ariaLabel || undefined"
      :aria-valuetext="valueText"
      :aria-readonly="readonly || undefined"
      :aria-invalid="invalid || undefined"
      :data-testid="`${testId}__input`"
      v-bind="inputAttrs"
      class="block h-10 w-full min-w-0 cursor-pointer appearance-none bg-transparent focus-visible:outline-none group-data-[readonly]:cursor-default disabled:cursor-not-allowed [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-(--shape-elements) [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--slider-accent)_var(--slider-fill),var(--slider-track)_var(--slider-fill))] [&::-webkit-slider-runnable-track]:inset-ring [&::-webkit-slider-runnable-track]:inset-ring-(--slider-track-border) [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-(--shape-elements) [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-(--slider-accent) [&::-webkit-slider-thumb]:bg-(--bg-surface) [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:duration-fast-02 [&::-webkit-slider-thumb]:ease-productive-entrance motion-reduce:[&::-webkit-slider-thumb]:transition-none enabled:hover:[&::-webkit-slider-thumb]:bg-[linear-gradient(var(--bg-hover),var(--bg-hover))] focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-(--ring-color) focus-visible:[&::-webkit-slider-thumb]:ring-offset-2 focus-visible:[&::-webkit-slider-thumb]:ring-offset-(--bg-canvas) [&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-(--shape-elements) [&::-moz-range-track]:bg-(--slider-track) [&::-moz-range-track]:inset-ring [&::-moz-range-track]:inset-ring-(--slider-track-border) [&::-moz-range-progress]:h-1 [&::-moz-range-progress]:rounded-(--shape-elements) [&::-moz-range-progress]:bg-(--slider-accent) [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-(--shape-elements) [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-(--slider-accent) [&::-moz-range-thumb]:bg-(--bg-surface) [&::-moz-range-thumb]:transition-colors [&::-moz-range-thumb]:duration-fast-02 [&::-moz-range-thumb]:ease-productive-entrance motion-reduce:[&::-moz-range-thumb]:transition-none enabled:hover:[&::-moz-range-thumb]:bg-[linear-gradient(var(--bg-hover),var(--bg-hover))] focus-visible:[&::-moz-range-thumb]:ring-2 focus-visible:[&::-moz-range-thumb]:ring-(--ring-color) focus-visible:[&::-moz-range-thumb]:ring-offset-2 focus-visible:[&::-moz-range-thumb]:ring-offset-(--bg-canvas)"
      @input="onInput"
      @change="onChange"
      @keydown="onKeydown"
      @pointerdown="onPointerdown"
    />
    <div
      v-if="tickMarks.length"
      aria-hidden="true"
      class="flex w-full flex-col gap-(--spacing-xxs)"
    >
      <div class="relative h-1.5 w-full">
        <span
          v-for="mark in tickMarks"
          :key="mark.value"
          :data-testid="`${testId}__tick`"
          :style="{ '--slider-mark': mark.fraction }"
          class="absolute top-0 h-full w-px -translate-x-1/2 bg-(--slider-tick) left-[calc(var(--spacing)*2_+_(100%_-_var(--spacing)*4)*var(--slider-mark))]"
        />
      </div>
      <div
        v-if="referenceLabels.length"
        class="grid w-full"
      >
        <span
          v-for="reference in referenceLabels"
          :key="reference.value"
          :data-testid="`${testId}__reference`"
          :data-align="reference.align"
          :style="{ '--slider-mark': reference.fraction }"
          class="relative col-start-1 row-start-1 w-max whitespace-nowrap text-label-sm text-(--slider-label) left-[calc(var(--spacing)*2_+_(100%_-_var(--spacing)*4)*var(--slider-mark))] data-[align=center]:-translate-x-1/2 data-[align=end]:-translate-x-full"
        >
          {{ reference.label }}
        </span>
      </div>
    </div>
  </div>
</template>
