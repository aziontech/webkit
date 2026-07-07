<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import InputGroup from '../input-group/input-group.vue'
  import InputGroupAddon from '../input-group/input-group-addon/input-group-addon.vue'
  import Label from '../label/label.vue'
  import Switch from '../switch/switch.vue'

  defineOptions({
    name: 'FieldTextSwitch',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound value of the internal input. */
    modelValue?: string
    /** Two-way bound state of the trailing Switch. When false, the internal input becomes inert. */
    enabled?: boolean
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder forwarded to the internal input. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Disables the whole field (input + switch); switches helper to kind=disabled. */
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
    enabled: false,
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
    'update:enabled': [value: boolean]
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-text-switch'
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

  const inputInert = computed(() => props.disabled || !props.enabled)

  const switchLabel = computed(() => (props.label ? `Toggle ${props.label}` : 'Toggle field'))

  // Counter-override the InputGroup's `[&_button]:!rounded-none [&_button]:!border-transparent`
  // (descendant selector with !important). Inline style + !important always wins.
  const switchStyle = computed(() => {
    const radius = 'border-radius: 9999px !important;'
    const border = props.enabled
      ? 'border: 1px solid transparent !important;'
      : 'border: 1px solid var(--border-default) !important;'
    return radius + border
  })

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }

  const onToggle = (value: boolean) => {
    emit('update:enabled', value)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-enabled="enabled || null"
    class="flex flex-col gap-[var(--spacing-xs)] w-full"
  >
    <Label
      v-if="label"
      :value="label"
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
      <input
        :id="resolvedInputId"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="inputInert"
        :readonly="readonly"
        :required="required"
        :aria-invalid="invalid || undefined"
        :aria-required="required || undefined"
        :aria-describedby="describedBy"
        class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
        @input="onInput"
      />
      <InputGroupAddon :data-testid="`${testId}__switch-slot`">
        <Switch
          :is-toggled="enabled"
          :disabled="disabled"
          :aria-label="switchLabel"
          :data-testid="`${testId}__switch`"
          :style="switchStyle"
          @update:is-toggled="onToggle"
        />
      </InputGroupAddon>
    </InputGroup>
    <HelperText
      v-if="effectiveHelperText"
      :id="helperId"
      :value="effectiveHelperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
  </div>
</template>
