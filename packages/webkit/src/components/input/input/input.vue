<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useFieldAttrs } from '../../../composables/use-field-attrs'
  import { passwordManagerHints } from '../../../utils/autofill'
  import InputFrame from './parts/input-frame'

  export type InputSize = 'small' | 'medium' | 'large'
  export type InputType = 'text' | 'email' | 'number'

  defineOptions({
    name: 'Input',
    inheritAttrs: false
  })

  export interface InputProps {
    /** Placeholder shown when the field is empty. */
    placeholder?: string
    /** Native input type. Restricted to plain-text variants the field treats identically. */
    type?: InputType
    /** Native maxlength — maximum number of characters allowed. */
    maxLength?: number
    /**
     * Native autocomplete token for the <input> (e.g. "email", "username", "off"). Omitted when
     * unset, so the browser keeps its own default.
     */
    autocomplete?: string
    /**
     * Native spellcheck on the <input>. Set false for slugs, IDs, domains and code. Omitted when
     * unset, so the browser keeps its own default.
     */
    spellcheck?: boolean
    /** Size token; affects height only. Heights: small=28px, medium=32px, large=40px. */
    size?: InputSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field read-only; value is visible but not editable. */
    readonly?: boolean
    /** Marks the field as required; sets native required and aria-required. */
    required?: boolean
    /** Applies the invalid border + ring tokens and sets aria-invalid. */
    invalid?: boolean
    /** Sets the value and placeholder in the monospace code face, for CLI commands, IDs, tokens and hashes. */
    monospace?: boolean
  }
  const props = withDefaults(defineProps<InputProps>(), {
    placeholder: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    monospace: false,
    type: 'text',
    maxLength: undefined,
    autocomplete: undefined,
    spellcheck: undefined
  })

  /** Two-way bound value of the field. */
  const model = defineModel<string>({ default: '' })

  defineSlots<{
    /** Leading adornment at the inline start of the field (an icon, a unit). */
    leading(): unknown
    /** Trailing adornment at the inline end of the field. */
    trailing(): unknown
  }>()

  const attrs = useAttrs()

  const inputEl = ref<globalThis.HTMLInputElement | null>(null)

  const {
    controlId,
    describedBy,
    passthroughAttrs,
    controlState,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldAttrs(props)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input')

  const autofillHints = computed(() => passwordManagerHints(props))

  const onInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLInputElement
    model.value = target.value
  }

  defineExpose({
    /** Moves focus to the native field. */
    focus: (): void => inputEl.value?.focus()
  })

  const ROOT_CLASS = 'group/input gap-(--spacing-xs) px-(--spacing-sm)'

  const INPUT_CLASS =
    'relative z-(--z-control) h-full w-full min-w-0 self-stretch border-0 bg-transparent p-0 outline-none text-label-sm ' +
    'group-data-[monospace]/input:text-label-code-sm ' +
    'pointer-coarse:text-body-md pointer-coarse:group-data-[monospace]/input:text-label-code-lg ' +
    'text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled) read-only:cursor-default'
</script>

<template>
  <InputFrame
    data-slot="input"
    :size="size"
    :disabled="isDisabled"
    :readonly="readonly"
    :invalid="isInvalid"
    :required="isRequired"
    :data-monospace="monospace || null"
    :class="[ROOT_CLASS, attrs.class]"
  >
    <template
      v-if="$slots['leading']"
      #leading
    >
      <slot name="leading" />
    </template>

    <input
      ref="inputEl"
      :type="type"
      :value="model"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :autocomplete="autocomplete"
      :spellcheck="spellcheck"
      :readonly="readonly"
      :data-testid="testId"
      dir="auto"
      :class="INPUT_CLASS"
      v-bind="{ ...controlState, ...autofillHints, ...passthroughAttrs }"
      :id="controlId"
      :aria-describedby="describedBy"
      @input="onInput"
    />

    <template
      v-if="$slots['trailing']"
      #trailing
    >
      <slot name="trailing" />
    </template>
  </InputFrame>
</template>
