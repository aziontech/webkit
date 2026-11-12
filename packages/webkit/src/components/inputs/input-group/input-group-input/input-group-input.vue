<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useFieldControl } from '../../../../composables/use-field-control'
  import { passwordManagerHints } from '../../../../utils/autofill'

  defineOptions({ name: 'InputGroupInput', inheritAttrs: false })

  interface Props {
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

  const props = withDefaults(defineProps<Props>(), {
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group-input')

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
    class="h-full w-full min-w-0 flex-1 border-0 bg-transparent px-(--spacing-md) text-label-sm text-(--text-default) outline-none placeholder:text-(--text-muted) focus:ring-0 disabled:cursor-not-allowed disabled:text-(--text-disabled)"
    @input="handleInput"
  />
</template>
