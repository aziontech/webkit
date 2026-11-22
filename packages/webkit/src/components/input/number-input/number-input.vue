<script setup lang="ts" generic="TNullable extends boolean = false">
  import { computed, useAttrs } from 'vue'

  import { useFieldAttrs } from '../../../composables/use-field-attrs'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { PASSWORD_MANAGER_IGNORE } from '../../../utils/autofill'
  import InputFrame from '../input/parts/input-frame'

  export type NumberInputSize = 'small' | 'medium' | 'large'
  /** The model type: number, or number or null when nullable is set. */
  export type NumberInputValue<TNullable extends boolean = false> = TNullable extends true
    ? number | null
    : number

  defineOptions({
    name: 'NumberInput',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Text shown when the input is empty. */
      placeholder?: string
      /** Size token; affects height, padding, and typography. */
      size?: NumberInputSize
      /** Disables interaction and applies disabled tokens. */
      disabled?: boolean
      /** Marks the field as read-only; spinner buttons are inert. */
      readonly?: boolean
      /** Applies the invalid border/ring tokens. */
      invalid?: boolean
      /** Marks the field as required for assistive tech. */
      required?: boolean
      /** Minimum allowed value; spinner stops at this bound. */
      min?: number
      /** Maximum allowed value; spinner stops at this bound. */
      max?: number
      /** Increment used by the spinner buttons and arrow keys. */
      step?: number
      /** Renders the chevron-up/chevron-down spinner controls. */
      showButtons?: boolean
      /** Lets a cleared field emit null instead of falling back to min or 0. */
      nullable?: TNullable
    }>(),
    {
      placeholder: '',
      size: 'medium',
      disabled: false,
      readonly: false,
      invalid: false,
      required: false,
      min: undefined,
      max: undefined,
      step: 1,
      showButtons: true,
      nullable: false as never
    }
  )

  const emit = defineEmits<{
    change: [value: NumberInputValue<TNullable>]
  }>()

  /** v-model value; a cleared input falls back to min or 0, or emits null when nullable. */
  const model = defineModel<NumberInputValue<TNullable>>({
    default: 0 as NumberInputValue<TNullable>
  })

  defineSlots<{
    leading(): unknown
    trailing(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ numberInput: en.numberInput })

  const {
    controlId,
    describedBy,
    controlState,
    passthroughAttrs,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldAttrs(props)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'number-input')

  const isNullable = computed(() => props.nullable !== false)

  const fallback = (): number => props.min ?? 0

  const toModel = (value: number | null): NumberInputValue<TNullable> =>
    value as NumberInputValue<TNullable>

  const clamp = (value: number): number => {
    let next = value
    if (typeof props.min === 'number' && next < props.min) next = props.min
    if (typeof props.max === 'number' && next > props.max) next = props.max
    return next
  }

  const readValue = (event: Event): NumberInputValue<TNullable> => {
    const target = event.target as HTMLInputElement | null
    const raw = target?.valueAsNumber ?? Number.NaN
    if (Number.isNaN(raw) && isNullable.value) return toModel(null)
    return toModel(clamp(Number.isNaN(raw) ? fallback() : raw))
  }

  const onInput = (event: Event) => {
    model.value = readValue(event)
  }

  const onChange = (event: Event) => {
    emit('change', readValue(event))
  }

  const canInteract = computed(() => !isDisabled.value && !props.readonly)

  const stepBy = (delta: number): NumberInputValue<TNullable> => {
    const current: number | null = model.value
    return toModel(clamp(current === null ? fallback() : current + delta))
  }

  const onIncrement = () => {
    if (!canInteract.value) return
    model.value = stepBy(props.step)
  }

  const onDecrement = () => {
    if (!canInteract.value) return
    model.value = stepBy(-props.step)
  }

  const ROOT_CLASS =
    'overflow-hidden pointer-coarse:overflow-visible ' +
    '[&>[data-slot=leading]]:ps-(--spacing-md) [&>[data-slot=trailing]]:pe-(--spacing-md)'

  const INPUT_CLASS =
    'relative z-(--z-control) w-full min-w-0 border-0 bg-transparent outline-none px-(--spacing-md) text-label-sm ' +
    'pointer-coarse:text-body-md text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled) read-only:cursor-default ' +
    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'

  const INCREMENT_CLASS =
    'relative flex flex-1 items-center justify-center border-b border-(--border-input) ' +
    'pointer-coarse:border-b-0 pointer-coarse:border-s text-(--text-default) transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none hover:bg-(--bg-hover) disabled:cursor-not-allowed disabled:text-(--text-disabled)'

  const DECREMENT_CLASS =
    'relative flex flex-1 items-center justify-center text-(--text-default) transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none hover:bg-(--bg-hover) disabled:cursor-not-allowed disabled:text-(--text-disabled)'
</script>

<template>
  <InputFrame
    :size="size"
    :disabled="isDisabled"
    :readonly="readonly"
    :invalid="isInvalid"
    :required="isRequired"
    :class="[ROOT_CLASS, attrs['class']]"
  >
    <template
      v-if="$slots['leading']"
      #leading
    >
      <slot name="leading" />
    </template>

    <input
      type="number"
      :id="controlId"
      :aria-describedby="describedBy"
      :value="model"
      :placeholder="placeholder"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="step"
      :data-testid="testId"
      dir="auto"
      v-bind="{ ...controlState, ...PASSWORD_MANAGER_IGNORE, ...passthroughAttrs }"
      :class="INPUT_CLASS"
      @input="onInput"
      @change="onChange"
    />

    <template
      v-if="$slots['trailing']"
      #trailing
    >
      <slot name="trailing" />
    </template>

    <template #controls>
      <span
        v-if="isDisabled"
        class="relative z-(--z-control) flex items-center pe-(--spacing-md) text-(--text-disabled)"
        aria-hidden="true"
      >
        <i class="az az-lock text-label-sm leading-none" />
      </span>

      <span
        v-if="showButtons"
        class="relative z-(--z-control) flex h-full w-12 shrink-0 flex-col self-stretch border-s border-(--border-input) pointer-coarse:w-20 pointer-coarse:flex-row-reverse"
      >
        <button
          type="button"
          tabindex="-1"
          :aria-label="t('numberInput.increment')"
          :disabled="isDisabled || readonly"
          :class="INCREMENT_CLASS"
          @click="onIncrement"
        >
          <span
            aria-hidden="true"
            data-slot="touch-target"
            class="absolute hidden inset-x-0 inset-y-[min(0rem,calc(50%-22px))] pointer-coarse:block"
          />
          <i
            class="az az-chevron-up text-[0.625rem] leading-none"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          tabindex="-1"
          :aria-label="t('numberInput.decrement')"
          :disabled="isDisabled || readonly"
          :class="DECREMENT_CLASS"
          @click="onDecrement"
        >
          <span
            aria-hidden="true"
            data-slot="touch-target"
            class="absolute hidden inset-x-0 inset-y-[min(0rem,calc(50%-22px))] pointer-coarse:block"
          />
          <i
            class="az az-chevron-down text-[0.625rem] leading-none"
            aria-hidden="true"
          />
        </button>
      </span>
    </template>
  </InputFrame>
</template>
