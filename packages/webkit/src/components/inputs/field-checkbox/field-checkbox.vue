<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { cn } from '../../../utils/cn'
  import Checkbox from '../checkbox/checkbox.vue'
  import Label from '../label/label.vue'

  defineOptions({
    name: 'FieldCheckbox',
    inheritAttrs: false
  })

  interface Props {
    /** Selected value for v-model. */
    modelValue?: boolean
    /** Value emitted when checked. */
    trueValue?: boolean
    /** Value emitted when unchecked. */
    falseValue?: boolean
    /** HTML name for form and vee-validate integration. */
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
    /** Adds the Required tag to the Label and sets native required + aria-required on the input. */
    required?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    trueValue: true,
    falseValue: false,
    name: undefined,
    disabled: false,
    inputId: undefined,
    label: '',
    description: '',
    helperText: '',
    required: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-checkbox'
  )

  const resolvedInputId = computed(() => props.inputId ?? generatedId)

  const model = computed({
    get: () => props.modelValue === props.trueValue,
    set: (next) => emit('update:modelValue', next ? props.trueValue : props.falseValue)
  })

  const sharedClasses =
    'flex cursor-pointer items-start gap-[var(--spacing-sm)] data-[disabled]:cursor-not-allowed'

  const textsClasses =
    'flex min-w-0 flex-1 flex-col gap-[var(--spacing-xxs)] data-[disabled]:opacity-50'

  const helperClasses =
    'inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-xs text-[var(--text-muted)] w-fit'

  const rootClasses = computed(() => cn(sharedClasses, attrs.class))
</script>

<template>
  <div
    :class="rootClasses"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-required="required || null"
  >
    <Checkbox
      v-model="model"
      binary
      :name="name"
      :disabled="disabled"
      :required="required"
      :aria-required="required || undefined"
      :input-id="resolvedInputId"
      :data-testid="`${testId}__control`"
    />
    <div
      :class="textsClasses"
      :data-disabled="disabled || null"
      :data-testid="`${testId}__texts`"
    >
      <Label
        v-if="label"
        :value="label"
        :required="required"
        :for="resolvedInputId"
        :data-testid="`${testId}__label`"
      />
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
  </div>
</template>
