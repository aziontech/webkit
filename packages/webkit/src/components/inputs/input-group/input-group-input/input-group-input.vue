<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useFieldControl } from '../../../../composables/use-field-control'
  import { passwordManagerHints } from '../../../../utils/autofill'

  defineOptions({ name: 'InputGroupInput', inheritAttrs: false })

  export type InputGroupInputType = 'text' | 'email' | 'number' | 'password'

  export interface Props {
    /** Native input type: the restricted set of Input, plus password to mask a secret value. */
    type?: InputGroupInputType
    /** Placeholder shown when the input is empty. */
    placeholder?: string
    /** Native autocomplete token; omitted when unset. */
    autocomplete?: string
    /** Disables the input. */
    disabled?: boolean
    /** Marks the input read-only. */
    readonly?: boolean
    /** Sets native required and aria-required. */
    required?: boolean
    /** Sets aria-invalid. */
    invalid?: boolean
  }
  export type InputGroupInputProps = Props

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    placeholder: '',
    autocomplete: undefined,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  })

  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()

  const {
    controlId,
    describedBy,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-input-group-input'
  )

  const autofillHints = computed(() =>
    passwordManagerHints({ autocomplete: props.autocomplete, readonly: props.readonly })
  )

  const handleInput = (event: globalThis.Event) => {
    model.value = (event.target as globalThis.HTMLInputElement).value
  }
</script>

<template>
  <input
    :id="controlId"
    :aria-describedby="describedBy"
    :type="type"
    :value="model"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :disabled="isDisabled"
    :readonly="readonly"
    :required="isRequired"
    :aria-invalid="isInvalid || undefined"
    :aria-required="isRequired || undefined"
    :data-testid="testId"
    v-bind="{ ...autofillHints, ...$attrs }"
    class="h-full w-full min-w-0 flex-1 border-0 bg-transparent px-(--spacing-sm) text-label-sm text-(--text-default) outline-none placeholder:text-(--text-muted) focus:ring-0 disabled:cursor-not-allowed disabled:text-(--text-disabled)"
    @input="handleInput"
  />
</template>
