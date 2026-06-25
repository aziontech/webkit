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
    maxLength?: number | null
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
    maxLength: null,
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
      'relative inline-flex items-center w-full h-10',
      'gap-[var(--spacing-xs)] pl-[var(--spacing-md)] pr-[var(--spacing-xxs)]',
      'rounded-[var(--shape-elements)]',
      'border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-default)]',
      'transition-colors duration-150 ease-out motion-reduce:transition-none',
      '[&:not(:focus-within):not([data-disabled])]:hover:border-[var(--border-strong)]',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-canvas)]',
      'data-[invalid]:border-[var(--danger-border)]',
      'data-[required]:border-[var(--warning-border)]',
      'data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-[var(--border-default)] data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0',
      attrs.class
    ]"
  >
    <span
      v-if="hasIconLeft"
      class="inline-flex shrink-0 items-center justify-center text-[var(--text-muted)]"
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
      class="relative z-[1] w-full min-w-0 border-0 bg-transparent p-0 outline-none text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] read-only:cursor-default transition-opacity duration-150 ease-out motion-reduce:transition-none"
      v-bind="passthroughAttrs"
      @input="handleInput"
    />

    <span
      v-if="hasIconRight"
      class="inline-flex shrink-0 items-center justify-center text-[var(--text-muted)]"
      aria-hidden="true"
    >
      <slot name="iconRight" />
    </span>

    <IconButton
      v-if="toggleable"
      kind="transparent"
      size="medium"
      :icon="toggleIcon"
      :ariaLabel="toggleLabel"
      :aria-pressed="visible"
      :disabled="disabled"
      type="button"
      @click="toggleVisible"
    />
  </span>
</template>
