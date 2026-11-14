<script setup lang="ts" generic="TModel = unknown">
  import { computed, nextTick, useAttrs } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'

  defineOptions({
    name: 'Checkbox',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Identifier for this checkbox in a group. Compared against a scalar model, or added to and removed from an array model. Unset, the model is a boolean. */
      value?: unknown
      /** @deprecated since 6.0 — leave `value` unset for a boolean model. Removed in 7.0. */
      binary?: boolean
      /** Renders the indeterminate visual (horizontal bar). Does not affect modelValue; the parent owns the tri-state logic. */
      indeterminate?: boolean
      /** Disables interaction and applies disabled tokens. */
      disabled?: boolean
      /** Marks the field read-only; value is visible but cannot change via interaction. */
      readonly?: boolean
      /** @deprecated since 6.0 — pass `id` (or let the enclosing Field set it). Removed in 7.0. */
      inputId?: string
      /** HTML name for form submission. */
      name?: string
      /** @deprecated since 6.0 — pass the `tabindex` attribute; it falls through to the input. Removed in 7.0. */
      tabindex?: number
    }>(),
    {
      value: undefined,
      binary: false,
      indeterminate: false,
      disabled: false,
      readonly: false,
      inputId: '',
      name: '',
      tabindex: 0
    }
  )

  /** Two-way bound value: a boolean when `value` is unset; with `value`, an array to add it to and remove it from, or a scalar set to `value` when checked and to null when unchecked. An unset (undefined) model with `value` is treated as an empty array. */
  const model = defineModel<TModel>({ default: undefined as never })

  const attrs = useAttrs()

  const {
    controlId,
    describedBy,
    labelledBy,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldControl({
    id: () => props.inputId || (attrs['id'] as string | undefined),
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    labelledBy: () => attrs['aria-labelledby'] as string | undefined,
    disabled: () => props.disabled
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-checkbox')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const isBinary = computed(() => props.binary || props.value === undefined)

  const isChecked = computed(() => {
    if (isBinary.value) {
      return Boolean(model.value)
    }

    if (Array.isArray(model.value)) {
      return model.value.includes(props.value)
    }

    return model.value === props.value
  })

  const dataState = computed(() => {
    if (props.indeterminate) return 'indeterminate'
    return isChecked.value ? 'checked' : 'unchecked'
  })

  const syncNative = (input: HTMLInputElement) => {
    nextTick(() => {
      if (input.checked !== isChecked.value) input.checked = isChecked.value
    })
  }

  const handleClick = (event: MouseEvent) => {
    if (props.readonly) event.preventDefault()
  }

  const handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement

    if (isDisabled.value || props.readonly) {
      input.checked = isChecked.value
      return
    }

    syncNative(input)

    if (isBinary.value) {
      model.value = !model.value as TModel
      return
    }

    if (model.value !== undefined && !Array.isArray(model.value)) {
      model.value = (isChecked.value ? null : props.value) as TModel
      return
    }

    const current = Array.isArray(model.value) ? [...model.value] : []
    const index = current.indexOf(props.value)

    if (index === -1) {
      current.push(props.value)
    } else {
      current.splice(index, 1)
    }

    model.value = current as TModel
  }
</script>

<template>
  <span
    :class="attrs.class"
    :data-testid="testId"
    :data-state="dataState"
    :data-checked="isChecked || null"
    :data-indeterminate="indeterminate || null"
    :data-disabled="isDisabled || null"
    :data-readonly="readonly || null"
    class="group relative inline-flex size-[1.125rem] shrink-0 items-center justify-center align-middle rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) text-transparent before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-(--bg-canvas) focus-within:before:opacity-0 has-[:focus-visible]:before:opacity-0 data-[checked]:border-(--primary) data-[checked]:bg-(--primary) data-[checked]:text-(--primary-contrast) data-[checked]:before:hidden data-[checked]:after:hidden data-[indeterminate]:border-(--primary) data-[indeterminate]:bg-(--primary) data-[indeterminate]:text-(--primary-contrast) data-[indeterminate]:before:hidden data-[indeterminate]:after:hidden data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-(--border-default) data-[disabled]:bg-(--bg-disabled) data-[disabled]:opacity-50 data-[disabled]:before:hidden data-[disabled]:after:hidden data-[readonly]:pointer-events-none data-[readonly]:cursor-not-allowed data-[readonly]:before:hidden data-[readonly]:after:hidden"
  >
    <input
      :id="controlId || ''"
      :indeterminate.prop="indeterminate"
      :name="name || ''"
      type="checkbox"
      :aria-describedby="describedBy"
      :aria-labelledby="attrs['aria-label'] ? undefined : labelledBy"
      :aria-invalid="isInvalid || undefined"
      :required="isRequired || undefined"
      class="absolute inset-[min(0rem,calc(50%-12px))] cursor-pointer opacity-0 pointer-coarse:inset-[min(0rem,calc(50%-22px))] disabled:cursor-not-allowed"
      :checked="isChecked"
      :disabled="isDisabled"
      :readonly="readonly"
      :aria-readonly="readonly || undefined"
      :tabindex="tabindex"
      :data-testid="`${testId}__input`"
      v-bind="passthroughAttrs"
      @click="handleClick"
      @change="handleChange"
    />
    <svg
      v-if="indeterminate"
      class="size-2.5 shrink-0 stroke-[1.5] group-data-[disabled]:stroke-(--text-disabled)"
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
      class="size-2.5 shrink-0 stroke-[1.5] group-data-[disabled]:stroke-(--text-disabled)"
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
