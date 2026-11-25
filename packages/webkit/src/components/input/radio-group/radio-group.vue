<script setup lang="ts" generic="TOption extends RadioGroupOption = RadioGroupOption">
  import { computed, provide, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { FieldInjectionKey } from '../field/injection-key'
  import {
    RadioGroupInjectionKey,
    type RadioGroupOption,
    type RadioGroupOrientation,
    type RadioGroupVariant
  } from './injection-key'
  import RadioGroupItem from './radio-group-item/radio-group-item.vue'

  defineOptions({
    name: 'RadioGroup',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Form field name shared by every radio; the selected value submits under it. Empty uses a generated name so the radios still group. */
      name?: string
      /** Layout axis: options stacked, or in a wrapping row. Arrow keys move the selection on both axes either way. */
      orientation?: RadioGroupOrientation
      /** Look of every option: a circle beside its label, or a bordered card for options with an icon, a description or card weight (plans, roles). */
      variant?: RadioGroupVariant
      /** Options rendered as RadioGroup.Item rows, in place of composed items; extra fields reach the option and tag slots. Empty renders the default slot. */
      options?: TOption[]
      /** Disables every option and applies the disabled tokens. */
      disabled?: boolean
      /** Shows the selection but blocks changing it: the radios stay focusable and keep their selected look. */
      readonly?: boolean
      /** Requires a selection: sets aria-required on the group and required on the radios, so a native form blocks an empty submit. */
      required?: boolean
      /** Marks the group invalid: sets aria-invalid on the group and on every radio. */
      invalid?: boolean
    }>(),
    {
      name: '',
      orientation: 'vertical',
      variant: 'default',
      options: () => [],
      disabled: false,
      readonly: false,
      required: false,
      invalid: false
    }
  )

  /** Selected value; set to the value of the chosen item. */
  const model = defineModel<TOption['value'] | undefined>()

  defineSlots<{
    /** The RadioGroup.Item options. */
    default(): unknown
    /** Body of one data-driven option, in place of its label. */
    option(props: { option: TOption; selected: boolean }): unknown
    /** Trailing content of one data-driven option, such as a price or a tag. */
    tag(props: { option: TOption; selected: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const generatedName = `radio-group-${useId()}`

  const field = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    labelledBy: () => attrs['aria-labelledby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'radio-group')

  provide(FieldInjectionKey, {
    controlId: '',
    describedBy: computed(() => undefined),
    labelledBy: computed(() => undefined),
    invalid: field.invalid,
    disabled: field.disabled,
    required: field.required,
    hasError: computed(() => false),
    register: () => () => {}
  })

  provide(RadioGroupInjectionKey, {
    name: computed(() => props.name || generatedName),
    value: computed(() => model.value),
    variant: computed(() => props.variant),
    disabled: field.disabled,
    readonly: computed(() => props.readonly),
    testId,
    select: (value: string) => {
      if (field.disabled.value || props.readonly) return
      model.value = value as TOption['value']
    }
  })

  const ROOT_CLASS =
    'group/radio-group flex ' +
    'data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-(--spacing-sm) data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:flex-wrap ' +
    'data-[orientation=horizontal]:gap-x-(--spacing-md) data-[orientation=horizontal]:gap-y-(--spacing-sm) ' +
    'data-[variant=card]:data-[orientation=vertical]:gap-(--spacing-xs) data-[variant=card]:data-[orientation=horizontal]:gap-x-(--spacing-xs) ' +
    'data-[variant=card]:data-[orientation=horizontal]:gap-y-(--spacing-xs) data-[variant=card]:data-[orientation=horizontal]:items-stretch'
</script>

<script lang="ts">
  export type {
    RadioGroupOption,
    RadioGroupOrientation,
    RadioGroupProps,
    RadioGroupVariant
  } from './injection-key'
</script>

<template>
  <div
    v-bind="$attrs"
    role="radiogroup"
    :id="field.controlId.value"
    :aria-labelledby="attrs['aria-label'] ? undefined : field.labelledBy.value"
    :aria-describedby="field.describedBy.value"
    :aria-required="field.required.value || undefined"
    :aria-invalid="field.invalid.value || undefined"
    :aria-readonly="readonly || undefined"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-variant="variant"
    :data-disabled="field.disabled.value || null"
    :data-readonly="readonly || null"
    :data-required="field.required.value || null"
    :data-invalid="field.invalid.value || null"
    :class="ROOT_CLASS"
  >
    <slot v-if="!options.length" />
    <RadioGroupItem
      v-for="option in options"
      v-else
      :key="option.value"
      :value="option.value"
      :description="option.description ?? ''"
      :icon="option.icon ?? ''"
      :aria-label="option.ariaLabel ?? ''"
      :disabled="option.disabled ?? false"
    >
      <slot
        name="option"
        :option="option"
        :selected="model === option.value"
        >{{ option.label }}</slot
      >
      <template
        v-if="$slots['tag']"
        #tag
      >
        <slot
          name="tag"
          :option="option"
          :selected="model === option.value"
        />
      </template>
    </RadioGroupItem>
  </div>
</template>
