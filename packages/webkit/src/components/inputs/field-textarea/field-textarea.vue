<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import InputTextarea from '../input-textarea/input-textarea.vue'
  import Label from '../label/label.vue'

  defineOptions({
    name: 'FieldTextarea',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound value of the underlying InputTextarea. */
    modelValue?: string
    /** HTML name for the underlying textarea (form integration). */
    name?: string
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder forwarded to the InputTextarea. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Disables the textarea and switches the helper to kind=disabled (lock icon). */
    disabled?: boolean
    /** Marks the textarea read-only; value is visible but not editable. Native pass-through. */
    readonly?: boolean
    /** Adds the Required tag to the Label and sets native required + aria-required on the textarea. */
    required?: boolean
    /** Switches the helper to kind=invalid and applies invalid border tokens on the textarea. */
    invalid?: boolean
    /** id for the native textarea; consumed by Label via `for` and by `aria-describedby` wiring. */
    inputId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    name: '',
    label: '',
    placeholder: '',
    helperText: '',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: ''
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const resolvedId = computed(() => props.inputId || props.name || generatedId)
  const helperId = computed(() => `${resolvedId.value}__helper`)
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-textarea'
  )

  const model = computed({
    get: () => props.modelValue,
    set: (next) => emit('update:modelValue', next ?? '')
  })
</script>

<template>
  <div
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-readonly="readonly || null"
    :class="attrs.class as string"
    class="flex w-full flex-col gap-[var(--spacing-xs)]"
  >
    <Label
      v-if="label"
      :for="resolvedId"
      :value="label"
      :required="required"
      :class="disabled ? 'opacity-50' : ''"
      :data-testid="`${testId}__label`"
    />
    <InputTextarea
      :id="resolvedId"
      v-model="model"
      :name="name || undefined"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
      :aria-describedby="helperText ? helperId : undefined"
      :data-testid="`${testId}__control`"
    />
    <small
      v-if="helperText"
      :id="helperId"
      :data-testid="`${testId}__helper`"
      :data-disabled="disabled || null"
      :data-invalid="invalid || null"
      :data-required="required || null"
      class="inline-flex items-center gap-[var(--spacing-xxs)] w-fit text-body-xs text-[var(--text-muted)] data-[required]:text-[var(--warning)] data-[invalid]:text-[var(--danger)] data-[disabled]:rounded-[var(--shape-button)] data-[disabled]:border data-[disabled]:border-[var(--border-default)] data-[disabled]:bg-[var(--bg-surface)] data-[disabled]:px-[var(--spacing-xs)] data-[disabled]:py-[var(--spacing-xxs)] data-[disabled]:text-[var(--text-muted)]"
    >
      <i
        v-if="disabled"
        aria-hidden="true"
        class="pi pi-lock leading-none"
        :data-testid="`${testId}__helper-icon`"
      />
      <span :data-testid="`${testId}__helper-text`">{{ helperText }}</span>
    </small>
  </div>
</template>
