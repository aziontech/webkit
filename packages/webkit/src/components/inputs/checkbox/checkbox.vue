<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  defineOptions({
    name: 'Checkbox',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound value. Boolean in `binary` mode, scalar when paired with `value`, array when multi-selecting. */
    modelValue?: unknown
    /** Identifier for this checkbox in non-binary mode. Compared against `modelValue` (or included in the array). */
    value?: unknown
    /** When true, the checkbox toggles `modelValue` as a boolean (no `value` pairing). */
    binary?: boolean
    /** Renders the indeterminate visual (horizontal bar). Does not affect modelValue; the parent owns the tri-state logic. */
    indeterminate?: boolean
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field read-only; value is visible but cannot change via interaction. */
    readonly?: boolean
    /** Forwarded to the inner input id for label association. */
    inputId?: string
    /** HTML name for form submission. */
    name?: string
    /** Forwarded to the inner input tabindex. */
    tabindex?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    value: undefined,
    binary: false,
    indeterminate: false,
    disabled: false,
    readonly: false,
    inputId: '',
    name: '',
    tabindex: 0
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

  const dataState = computed(() => {
    if (props.indeterminate) return 'indeterminate'
    return isChecked.value ? 'checked' : 'unchecked'
  })

  const ariaChecked = computed<'true' | 'false' | 'mixed'>(() => {
    if (props.indeterminate) return 'mixed'
    return isChecked.value ? 'true' : 'false'
  })

  const inputRef = ref<globalThis.HTMLInputElement | null>(null)

  watch(
    () => props.indeterminate,
    (value) => {
      if (inputRef.value) {
        inputRef.value.indeterminate = value
      }
    },
    { immediate: true, flush: 'post' }
  )

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
    :data-state="dataState"
    :data-checked="isChecked || null"
    :data-indeterminate="indeterminate || null"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    class="group relative inline-flex size-[1.125rem] shrink-0 items-center justify-center align-middle rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-transparent before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[var(--bg-hover)] before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[var(--bg-active)] after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--ring-color)] has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-[var(--bg-canvas)] focus-within:before:opacity-0 has-[:focus-visible]:before:opacity-0 data-[checked]:border-[var(--primary)] data-[checked]:bg-[var(--primary)] data-[checked]:text-[var(--primary-contrast)] data-[checked]:before:hidden data-[checked]:after:hidden data-[indeterminate]:border-[var(--primary)] data-[indeterminate]:bg-[var(--primary)] data-[indeterminate]:text-[var(--primary-contrast)] data-[indeterminate]:before:hidden data-[indeterminate]:after:hidden data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-[var(--border-default)] data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:opacity-50 data-[disabled]:before:hidden data-[disabled]:after:hidden data-[readonly]:pointer-events-none data-[readonly]:cursor-not-allowed data-[readonly]:before:hidden data-[readonly]:after:hidden"
  >
    <input
      :id="inputId || ''"
      ref="inputRef"
      :name="name || ''"
      type="checkbox"
      class="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      :checked="isChecked"
      :disabled="disabled"
      :readonly="readonly"
      :tabindex="tabindex"
      :aria-checked="ariaChecked"
      :data-testid="`${testId}__input`"
      v-bind="passthroughAttrs"
      @change="handleChange"
    />
    <svg
      v-if="indeterminate"
      class="size-2.5 shrink-0 stroke-[1.5] group-data-[disabled]:stroke-[var(--text-disabled)]"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    >
      <path
        d="M2.5 6h7"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      v-else-if="isChecked"
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
