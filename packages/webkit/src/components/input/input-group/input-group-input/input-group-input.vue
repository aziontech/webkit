<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useFieldAttrs } from '../../../../composables/use-field-attrs'
  import { passwordManagerHints } from '../../../../utils/autofill'

  defineOptions({ name: 'InputGroupInput', inheritAttrs: false })

  export type InputGroupInputType = 'text' | 'email' | 'number' | 'password'

  export interface InputGroupInputProps {
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
  const props = withDefaults(defineProps<InputGroupInputProps>(), {
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

  const { controlId, describedBy, controlState } = useFieldAttrs(props)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group-input')

  const autofillHints = computed(() =>
    passwordManagerHints({ autocomplete: props.autocomplete, readonly: props.readonly })
  )

  const onInput = (event: globalThis.Event) => {
    model.value = (event.target as globalThis.HTMLInputElement).value
  }

  const ROOT_CLASS =
    'h-full w-full min-w-0 flex-1 border-0 bg-transparent px-(--spacing-sm) text-label-sm ' +
    'pointer-coarse:text-body-md text-(--text-default) outline-none placeholder:text-(--text-muted) focus:ring-0 disabled:cursor-not-allowed disabled:text-(--text-disabled)'
</script>

<template>
  <input
    :id="controlId"
    :aria-describedby="describedBy"
    :type="type"
    :value="model"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :readonly="readonly"
    :data-testid="testId"
    v-bind="{ ...controlState, ...autofillHints, ...$attrs }"
    :class="ROOT_CLASS"
    @input="onInput"
  />
</template>
