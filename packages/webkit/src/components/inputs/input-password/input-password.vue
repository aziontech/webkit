<script setup lang="ts">
  import { computed, ref, useAttrs, useSlots } from 'vue'

  import IconButton from '../../actions/icon-button/icon-button.vue'

  export type InputPasswordAutocomplete = 'current-password' | 'new-password' | 'off'

  defineOptions({
    name: 'InputPassword',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound value of the field. */
    modelValue?: string
    /** Placeholder shown when the field is empty. */
    placeholder?: string
    /** Native maxlength — maximum number of characters allowed. */
    maxLength?: number
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field read-only; value is visible but not editable. */
    readonly?: boolean
    /** Marks the field as required; sets native required and aria-required. */
    required?: boolean
    /** Applies the invalid border + ring tokens and sets aria-invalid. */
    invalid?: boolean
    /** Renders the visibility toggle on the trailing edge of the field. */
    toggleable?: boolean
    /** Native autocomplete hint for password managers. */
    autocomplete?: InputPasswordAutocomplete
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    maxLength: undefined,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    toggleable: true,
    autocomplete: 'current-password'
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  defineSlots<{
    iconLeft(): unknown
    iconRight(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const visible = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-password')

  const passthroughAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    return rest
  })

  const hasIconLeft = computed(() => Boolean(slots['iconLeft']))
  const hasIconRight = computed(() => !props.toggleable && Boolean(slots['iconRight']))

  const toggleLabel = computed(() => (visible.value ? 'Hide password' : 'Show password'))
  const toggleIcon = computed(() => (visible.value ? 'pi pi-eye-slash' : 'pi pi-eye'))

  const handleInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLInputElement
    emit('update:modelValue', target.value)
  }

  const toggleVisible = () => {
    visible.value = !visible.value
  }
</script>

<template>
  <span
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-has-icon-left="hasIconLeft || null"
    :data-has-icon-right="hasIconRight || null"
    :data-toggleable="toggleable || null"
    :data-visible="visible || null"
    :class="[
      'group relative inline-flex items-center w-full h-10',
      'gap-(--spacing-xs) pr-(--spacing-xs)',
      'rounded-(--shape-elements)',
      'border border-(--border-default) bg-(--bg-surface) text-(--text-default)',
      'transition-colors duration-150 ease-out motion-reduce:transition-none',
      '[&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong)',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 focus-within:ring-offset-(--bg-canvas)',
      'data-[invalid]:border-(--danger-border)',
      'data-[required]:border-(--warning-border)',
      'data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-(--border-default) data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0',
      attrs.class
    ]"
  >
    <span
      v-if="hasIconLeft"
      class="inline-flex shrink-0 items-center justify-center pl-(--spacing-md) text-(--text-muted)"
      aria-hidden="true"
    >
      <slot name="iconLeft" />
    </span>

    <input
      :type="visible ? 'text' : 'password'"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-invalid="invalid || undefined"
      :aria-required="required || undefined"
      :data-testid="testId"
      class="relative z-(--z-input-field) w-full min-w-0 border-0 bg-transparent py-0 pr-0 pl-(--spacing-md) group-data-[has-icon-left]:pl-0 outline-none text-label-sm text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled) read-only:cursor-default transition-opacity duration-150 ease-out motion-reduce:transition-none"
      v-bind="passthroughAttrs"
      @input="handleInput"
    />

    <span
      v-if="hasIconRight"
      class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
      aria-hidden="true"
    >
      <slot name="iconRight" />
    </span>

    <IconButton
      v-if="toggleable"
      kind="transparent"
      size="small"
      :icon="toggleIcon"
      :ariaLabel="toggleLabel"
      :aria-pressed="visible"
      :disabled="disabled"
      type="button"
      @click="toggleVisible"
    />
  </span>
</template>
