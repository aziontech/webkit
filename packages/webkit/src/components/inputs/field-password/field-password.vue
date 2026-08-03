<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import InputPassword, {
    type InputPasswordAutocomplete
  } from '../input-password/input-password.vue'
  import Label from '../label/label.vue'

  defineOptions({
    name: 'FieldPassword',
    inheritAttrs: false
  })

  /**
   * One password rule rendered as a chip under the field.
   *
   * The rule carries the *test*, not its result: the field owns the value, so it
   * evaluates every rule against the current one and re-renders as the user
   * types. A pre-computed boolean would freeze the chips at whatever the
   * consumer passed, which is not validation, only decoration.
   */
  export interface PasswordRequirement {
    /** Text shown inside the chip. */
    label: string
    /** Pattern or predicate the current value must satisfy for the rule to be met. */
    test: RegExp | ((value: string) => boolean)
  }

  interface Props {
    /** Two-way bound value of the underlying InputPassword. */
    modelValue?: string
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder forwarded to the InputPassword. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Native maxlength forwarded to the InputPassword. */
    maxLength?: number
    /** Disables the input and switches the helper to kind=disabled (lock icon). */
    disabled?: boolean
    /** Marks the input read-only; value is visible but not editable. Native pass-through. */
    readonly?: boolean
    /** Adds the Required tag to the Label and sets native required + aria-required on the input. */
    required?: boolean
    /** Switches the helper to kind=invalid and applies invalid border/ring tokens on the input. */
    invalid?: boolean
    /** Forwards to InputPassword. Renders the visibility toggle on the trailing edge when true. */
    toggleable?: boolean
    /** Forwarded to InputPassword for password-manager hints. */
    autocomplete?: InputPasswordAutocomplete
    /** id for the native input; consumed by Label via for and by aria-describedby wiring. */
    inputId?: string
    /** HTML name for the underlying input (form + vee-validate integration). */
    name?: string
    /** Password rules rendered as a wrapping chip row under the field, one chip per entry. */
    requirements?: PasswordRequirement[]
    /** Caption that opens the requirements row and names the group for assistive tech. */
    requirementsTitle?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: '',
    helperText: '',
    maxLength: undefined,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    toggleable: true,
    autocomplete: 'current-password',
    inputId: '',
    name: '',
    requirements: () => [],
    requirementsTitle: 'Must contain:'
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  defineSlots<{
    iconLeft(): unknown
    iconRight(): unknown
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-password'
  )

  // `inputId` defaults to '' — an empty string is not nullish, so `??` would keep it and
  // every derived id would collapse to a bare suffix (duplicated across instances, and no
  // real label/describedby association). `||` is what makes the useId() fallback fire.
  const resolvedInputId = computed(() => props.inputId || generatedId)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)
  const requirementsTitleId = computed(() => `${resolvedInputId.value}-requirements-title`)

  const hasRequirements = computed(() => props.requirements.length > 0)

  /**
   * Evaluates each rule against the value currently in the field, so the chips
   * track what is typed. A `g`-flagged pattern carries `lastIndex` between
   * calls and would alternate true/false on the same value, so it is rebuilt
   * without the flag.
   */
  const evaluatedRequirements = computed(() =>
    props.requirements.map((requirement: PasswordRequirement) => {
      const value = props.modelValue
      const met =
        typeof requirement.test === 'function'
          ? requirement.test(value)
          : (requirement.test.global
              ? new RegExp(requirement.test.source, requirement.test.flags.replace('g', ''))
              : requirement.test
            ).test(value)

      return { label: requirement.label, met }
    })
  )

  const helperKind = computed<HelperTextKind>(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  const effectiveHelperText = computed(() => {
    if (props.helperText) return props.helperText
    if (props.disabled) return 'This field is locked.'
    return ''
  })

  const describedBy = computed(() => (effectiveHelperText.value ? helperId.value : undefined))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-has-requirements="hasRequirements || null"
    class="flex flex-col gap-[var(--spacing-xs)] w-full"
  >
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <InputPassword
      :model-value="modelValue"
      :placeholder="placeholder"
      :max-length="maxLength"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
      :toggleable="toggleable"
      :autocomplete="autocomplete"
      :id="resolvedInputId"
      :name="name"
      :aria-describedby="describedBy"
      :data-testid="`${testId}__input`"
      @update:model-value="(value) => emit('update:modelValue', value)"
    >
      <template
        v-if="$slots['iconLeft']"
        #iconLeft
      >
        <slot name="iconLeft" />
      </template>
      <template
        v-if="$slots['iconRight']"
        #iconRight
      >
        <slot name="iconRight" />
      </template>
    </InputPassword>
    <HelperText
      v-if="effectiveHelperText"
      :id="helperId"
      :label="effectiveHelperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
    <div
      v-if="hasRequirements"
      role="group"
      :aria-labelledby="requirementsTitleId"
      :data-testid="`${testId}__requirements`"
      class="flex h-auto w-full flex-wrap content-center items-center gap-[var(--spacing-xs)] [interpolate-size:allow-keywords] transition-[height,width] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    >
      <span
        :id="requirementsTitleId"
        :data-testid="`${testId}__requirements-title`"
        class="shrink-0 leading-none text-label-sm text-[var(--text-default)]"
      >
        {{ requirementsTitle }}
      </span>
      <!-- Satisfying a rule inserts its check glyph, which widens that chip and
           pushes every chip after it along the row. That is a layout move, not a
           style change, so a CSS transition cannot reach it — `move-class` is
           Vue's FLIP hook, and it animates the shift with `transform`. Entering and
           leaving chips slide in on the same axis so a changed rule set reads as one
           motion instead of a jump. -->
      <TransitionGroup
        move-class="transition-transform duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        enter-active-class="transition-[opacity,transform] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="opacity-0 translate-x-[calc(var(--spacing-xs)*-1)]"
        leave-active-class="absolute transition-[opacity,transform] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-to-class="opacity-0 translate-x-[calc(var(--spacing-xs)*-1)]"
      >
        <span
          v-for="requirement in evaluatedRequirements"
          :key="requirement.label"
          :data-validated="requirement.met || null"
          :data-testid="`${testId}__requirement`"
          class="inline-flex shrink-0 items-center justify-center gap-[var(--spacing-xxs)] min-h-5 p-[var(--spacing-xxs)] rounded-[var(--shape-elements)] leading-none text-label-sm bg-[var(--bg-surface-raised)] text-[var(--text-muted)] transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[validated]:bg-[var(--success)] data-[validated]:text-[var(--text-default)]"
        >
          <i
            v-if="requirement.met"
            class="pi pi-check flex shrink-0 items-center size-[14px] text-[var(--success-contrast)]"
            aria-hidden="true"
          />
          {{ requirement.label }}
        </span>
      </TransitionGroup>
    </div>
  </div>
</template>
