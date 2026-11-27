<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useFieldAttrs } from '../../../composables/use-field-attrs'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import InputFrame from '../input/parts/input-frame'

  export type PasswordInputAutocomplete = 'current-password' | 'new-password' | 'off'

  defineOptions({
    name: 'PasswordInput',
    inheritAttrs: false
  })

  export interface PasswordInputProps {
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
    autocomplete?: PasswordInputAutocomplete
    /** Sets the value and placeholder in the monospace code face, for API tokens, client secrets and keys. */
    monospace?: boolean
  }
  const props = withDefaults(defineProps<PasswordInputProps>(), {
    placeholder: '',
    maxLength: undefined,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    toggleable: true,
    autocomplete: 'current-password',
    monospace: false
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
  const { t } = useTranslate({ passwordInput: en.passwordInput })

  const {
    controlId,
    describedBy,
    controlState,
    passthroughAttrs,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldAttrs(props)

  const visible = ref(false)
  const inputEl = ref<globalThis.HTMLInputElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'password-input')

  const toggleLabel = computed(() =>
    visible.value ? t('passwordInput.hide') : t('passwordInput.show')
  )
  const toggleIcon = computed(() => (visible.value ? 'az az-eye-off' : 'az az-eye'))

  const onInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLInputElement
    model.value = target.value
  }

  const toggleVisible = () => {
    visible.value = !visible.value
  }

  defineExpose({
    /** Moves focus to the native field. */
    focus: (): void => inputEl.value?.focus()
  })

  const ROOT_CLASS =
    'group gap-(--spacing-xs) pe-(--spacing-xs) [&>[data-slot=leading]]:ps-(--spacing-md)'

  const INPUT_CLASS =
    'relative z-(--z-control) w-full min-w-0 border-0 bg-transparent py-0 pe-0 ps-(--spacing-md) ' +
    'group-data-[leading]:ps-0 ' +
    'outline-none text-label-sm ' +
    'group-data-[monospace]:text-label-code-sm ' +
    'pointer-coarse:text-body-md pointer-coarse:group-data-[monospace]:text-label-code-lg ' +
    'text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled) read-only:cursor-default ' +
    'transition-opacity duration-150 ease-out motion-reduce:transition-none'
</script>

<template>
  <InputFrame
    size="large"
    :disabled="isDisabled"
    :readonly="readonly"
    :invalid="isInvalid"
    :required="isRequired"
    :data-toggleable="toggleable || null"
    :data-revealed="visible || null"
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
      :type="visible ? 'text' : 'password'"
      :id="controlId"
      :aria-describedby="describedBy"
      :value="model"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :autocomplete="autocomplete"
      :readonly="readonly"
      :data-testid="testId"
      dir="auto"
      :class="INPUT_CLASS"
      v-bind="{ ...controlState, ...passthroughAttrs }"
      @input="onInput"
    />

    <template
      v-if="!toggleable && $slots['trailing']"
      #trailing
    >
      <slot name="trailing" />
    </template>

    <template
      v-if="toggleable"
      #controls
    >
      <IconButton
        variant="ghost"
        size="small"
        :icon="toggleIcon"
        :ariaLabel="toggleLabel"
        :aria-pressed="visible"
        :disabled="isDisabled"
        type="button"
        @click="toggleVisible"
      />
    </template>
  </InputFrame>
</template>
