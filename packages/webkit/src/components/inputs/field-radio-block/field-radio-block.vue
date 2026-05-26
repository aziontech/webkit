<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { cn } from '../../../utils/cn'
  import { selectableBlockCardClasses } from '../presets/interactive-states'
  import RadioButton from '../radio-button/radio-button.vue'

  defineOptions({
    name: 'FieldRadioBlock',
    inheritAttrs: false
  })

  interface Props {
    /** Selected value for v-model. */
    modelValue?: string
    /** Option value for this radio instance. */
    value?: string
    /** HTML name shared across a mutually exclusive group. */
    name?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** id for the native input; links label to control. */
    inputId?: string
    /** Primary label text. */
    label?: string
    /** Secondary description. */
    description?: string
    /** Helper badge text shown when disabled. */
    helperText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    value: undefined,
    name: undefined,
    disabled: false,
    inputId: undefined,
    label: '',
    description: '',
    helperText: ''
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | undefined]
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-radio-block'
  )

  const resolvedInputId = computed(() => props.inputId ?? generatedId)

  const isSelected = computed(() => props.modelValue === props.value)

  const model = computed({
    get: () => props.modelValue,
    set: (next) => emit('update:modelValue', next)
  })

  const sharedClasses = 'block data-[disabled]:cursor-not-allowed'

  const cardClasses = cn(
    selectableBlockCardClasses,
    'flex cursor-pointer items-start gap-[var(--spacing-sm)] p-[var(--spacing-sm)]',
    'data-[selected]:border-[var(--border-selected)] data-[selected]:bg-[var(--primary-selected)]',
    'data-[selected]:before:hidden data-[selected]:after:hidden',
    'data-[disabled]:opacity-50'
  )

  const textsClasses =
    'flex min-w-0 flex-1 flex-col gap-[var(--spacing-xxs)] data-[disabled]:opacity-50'

  const helperClasses =
    'inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-xs text-[var(--text-muted)] w-fit'

  const rootClasses = computed(() => cn(sharedClasses, attrs.class))
</script>

<template>
  <label
    :for="resolvedInputId"
    :class="rootClasses"
    :data-testid="testId"
    :data-disabled="disabled || null"
  >
    <div
      :class="cardClasses"
      :data-selected="isSelected || null"
      :data-disabled="disabled || null"
      :data-testid="`${testId}__card`"
    >
      <div
        :class="textsClasses"
        :data-disabled="disabled || null"
        :data-testid="`${testId}__texts`"
      >
        <span
          v-if="label"
          class="text-body-sm text-[var(--text-default)]"
          :data-testid="`${testId}__label`"
        >
          {{ label }}
        </span>
        <span
          v-if="description"
          class="text-body-xs text-[var(--text-muted)]"
          :data-testid="`${testId}__description`"
        >
          {{ description }}
        </span>
        <div
          v-if="disabled && helperText"
          :class="helperClasses"
          :data-testid="`${testId}__helper`"
        >
          <i
            class="pi pi-lock text-[length:inherit] leading-none"
            aria-hidden="true"
            :data-testid="`${testId}__helper-icon`"
          />
          <span :data-testid="`${testId}__helper-text`">{{ helperText }}</span>
        </div>
      </div>
      <RadioButton
        v-model="model"
        :value="value"
        :name="name"
        :disabled="disabled"
        :input-id="resolvedInputId"
        :data-testid="`${testId}__control`"
      />
    </div>
  </label>
</template>
