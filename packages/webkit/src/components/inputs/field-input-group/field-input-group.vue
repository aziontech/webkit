<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  defineOptions({
    name: 'FieldInputGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Text value for v-model. */
    modelValue?: string
    /** Label text shown above the field. */
    label?: string
    /** Helper text shown below the field; muted, or locked when disabled. */
    helperText?: string
    /** Placeholder text for the native input. */
    placeholder?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Makes the input read-only. */
    readonly?: boolean
    /** Applies danger border and danger helper text. */
    invalid?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    label: '',
    helperText: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    invalid: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  defineSlots<{
    prepend(): unknown
    append(): unknown
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-input-group'
  )

  const inputId = computed(() => `${generatedId}-input`)
  const helperId = computed(() => `${generatedId}-helper`)
  const describedBy = computed(() => (props.helperText ? helperId.value : undefined))

  // eslint-disable-next-line no-undef
  const handleInput = (event: InputEvent) => {
    const target = event.target as HTMLElement & { value: string }
    emit('update:modelValue', target.value)
  }
</script>

<template>
  <label
    :for="inputId"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    class="flex w-full flex-col gap-[var(--spacing-xxs)] data-[disabled]:cursor-not-allowed"
  >
    <span
      v-if="label"
      class="text-label-sm text-[var(--text-default)] data-[disabled]:text-[var(--text-disabled)]"
      :data-disabled="disabled || null"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>

    <span
      :data-disabled="disabled || null"
      :data-invalid="invalid || null"
      :data-testid="`${testId}__field`"
      class="relative inline-flex w-full items-stretch overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-1 focus-within:ring-offset-[var(--bg-canvas)] data-[invalid]:border-[var(--danger-border)] data-[invalid]:focus-within:ring-[var(--danger)] data-[disabled]:border-transparent data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:pointer-events-none"
    >
      <span
        v-if="$slots.prepend"
        class="inline-flex shrink-0 items-center px-[var(--spacing-sm)] text-body-md text-[var(--text-muted)] border-r border-[var(--border-default)]"
        :data-testid="`${testId}__prepend`"
      >
        <slot name="prepend" />
      </span>

      <input
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        type="text"
        class="min-w-0 flex-1 border-0 bg-transparent outline-none px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-md text-[var(--text-default)] placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] read-only:cursor-default"
        :data-testid="`${testId}__input`"
        @input="handleInput"
      />

      <span
        v-if="$slots.append"
        class="inline-flex shrink-0 items-center px-[var(--spacing-sm)] text-body-md text-[var(--text-muted)] border-l border-[var(--border-default)]"
        :data-testid="`${testId}__append`"
      >
        <slot name="append" />
      </span>
    </span>

    <span
      v-if="helperText"
      :id="helperId"
      :data-invalid="invalid || null"
      class="inline-flex items-center gap-[var(--spacing-xxs)] text-body-sm text-[var(--text-muted)] data-[invalid]:text-[var(--danger)]"
      :data-testid="`${testId}__helper-text`"
    >
      <i
        v-if="disabled"
        class="pi pi-lock text-[length:inherit] leading-none"
        aria-hidden="true"
        :data-testid="`${testId}__helper-icon`"
      />
      {{ helperText }}
    </span>
  </label>
</template>
