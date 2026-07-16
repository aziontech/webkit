<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import InputGroup from '../input-group/input-group.vue'
  import InputGroupAddon from '../input-group/input-group-addon/input-group-addon.vue'
  import Label from '../label/label.vue'

  defineOptions({
    name: 'FieldInputGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound value of the internal input. */
    modelValue?: string
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder forwarded to the internal input. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Disables the input and the InputGroup chrome; switches helper to kind=disabled. */
    disabled?: boolean
    /** Marks the internal input read-only; value is visible but not editable. */
    readonly?: boolean
    /** Adds the Required tag to Label and propagates required to InputGroup and input. */
    required?: boolean
    /** Applies invalid border on InputGroup and switches helper to kind=invalid. */
    invalid?: boolean
    /** id for the internal input; consumed by Label via for and by aria-describedby wiring. */
    inputId?: string
    /** HTML name for the internal input (form + vee-validate integration). */
    name?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: '',
    helperText: '',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: '',
    name: ''
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  defineSlots<{
    left(): unknown
    right(): unknown
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-input-group'
  )

  const resolvedInputId = computed(() => props.inputId || generatedId)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)

  const helperKind = computed<HelperTextKind>(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  const effectiveHelperText = computed(() => {
    if (props.helperText) return props.helperText
    if (props.disabled) return 'This field is locked.'
    return ''
  })

  const describedBy = computed(() => (effectiveHelperText.value ? helperId.value : undefined))

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    class="flex flex-col gap-[var(--spacing-xs)] w-full"
  >
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <InputGroup
      :invalid="invalid"
      :required="required"
      :disabled="disabled"
      :data-testid="`${testId}__group`"
    >
      <InputGroupAddon
        v-if="$slots['left']"
        key="addon-left"
        :data-testid="`${testId}__addon-left`"
      >
        <slot name="left" />
      </InputGroupAddon>
      <input
        :id="resolvedInputId"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="invalid || undefined"
        :aria-required="required || undefined"
        :aria-describedby="describedBy"
        class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
        @input="onInput"
      />
      <InputGroupAddon
        v-if="$slots['right']"
        key="addon-right"
        :data-testid="`${testId}__addon-right`"
      >
        <slot name="right" />
      </InputGroupAddon>
    </InputGroup>
    <HelperText
      v-if="effectiveHelperText"
      :id="helperId"
      :label="effectiveHelperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
  </div>
</template>
