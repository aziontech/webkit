<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Checkbox',
    inheritAttrs: false
  })

  interface Props {
    /** Bound value: a boolean in `binary` mode, otherwise the array/value the control reflects. */
    modelValue?: unknown
    /** This checkbox's value, added to or removed from the model array when not `binary`. */
    value?: unknown
    /** Toggles a single boolean instead of collecting `value` into an array. */
    binary?: boolean
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Prevents changes while the control stays focusable. */
    readonly?: boolean
    /** Forwarded to the native input id; pair with an external label for attribute. */
    inputId?: string
    /** HTML name for form submission. */
    name?: string
    /** Tab order for the native input. */
    tabindex?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    value: undefined,
    binary: false,
    disabled: false,
    readonly: false,
    inputId: undefined,
    name: undefined,
    tabindex: undefined
  })

  const emit = defineEmits<{
    'update:modelValue': [value: unknown]
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-checkbox')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const isChecked = computed(() => {
    if (props.binary) {
      return Boolean(props.modelValue)
    }

    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value)
    }

    return props.modelValue === props.value
  })

  const handleChange = () => {
    if (props.disabled || props.readonly) {
      return
    }

    if (props.binary) {
      emit('update:modelValue', !props.modelValue)
      return
    }

    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(props.value)

    if (index === -1) {
      current.push(props.value)
    } else {
      current.splice(index, 1)
    }

    emit('update:modelValue', current)
  }
</script>

<template>
  <span
    :class="attrs.class"
    :data-testid="testId"
    :data-checked="isChecked || null"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    class="group relative inline-flex size-[1.125rem] shrink-0 items-center justify-center align-middle rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-transparent before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[var(--bg-hover)] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[var(--bg-active)] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--ring-color)] has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-[var(--bg-canvas)] focus-within:before:opacity-0 has-[:focus-visible]:before:opacity-0 data-[checked]:border-[var(--primary)] data-[checked]:bg-[var(--primary)] data-[checked]:text-[var(--primary-contrast)] data-[checked]:before:hidden data-[checked]:after:hidden data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--border-default)] data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:opacity-50 data-[disabled]:before:hidden data-[disabled]:after:hidden data-[readonly]:pointer-events-none data-[readonly]:cursor-not-allowed data-[readonly]:before:hidden data-[readonly]:after:hidden"
  >
    <input
      :id="inputId"
      :name="name"
      type="checkbox"
      class="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      :checked="isChecked"
      :disabled="disabled"
      :readonly="readonly"
      :tabindex="tabindex"
      :aria-checked="isChecked"
      :data-testid="`${testId}__input`"
      v-bind="passthroughAttrs"
      @change="handleChange"
    />
    <svg
      v-if="isChecked"
      class="size-2.5 shrink-0 stroke-[1.5] group-data-[disabled]:stroke-[var(--text-disabled)]"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    >
      <path
        d="M2.5 6l2.5 2.5 4.5-4.5"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>
