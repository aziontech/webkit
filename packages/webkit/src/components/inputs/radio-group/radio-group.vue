<script setup lang="ts">
  import { computed, provide, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { fieldContextKey } from '../field/injection-key'
  import { RadioGroupInjectionKey, type RadioGroupOrientation } from './injection-key'

  defineOptions({
    name: 'RadioGroup',
    inheritAttrs: false
  })

  export type { RadioGroupOrientation }

  export interface Props {
    /** Form field name shared by every radio; the selected value submits under it. Empty uses a generated name so the radios still group. */
    name?: string
    /** Layout axis: options stacked, or in a wrapping row. Arrow keys move the selection on both axes either way. */
    orientation?: RadioGroupOrientation
    /** Disables every option and applies the disabled tokens. */
    disabled?: boolean
    /** Requires a selection: sets aria-required on the group and required on the radios, so a native form blocks an empty submit. */
    required?: boolean
    /** Marks the group invalid: sets aria-invalid on the group and on every radio. */
    invalid?: boolean
  }
  export type RadioGroupProps = Props

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    orientation: 'vertical',
    disabled: false,
    required: false,
    invalid: false
  })

  /** Selected value; set to the value of the chosen item. */
  const model = defineModel<string | undefined>()

  defineSlots<{
    /** The RadioGroup.Item options. */
    default(): unknown
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-radio-group')

  provide(fieldContextKey, {
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
    disabled: field.disabled,
    testId,
    select: (value: string) => {
      if (field.disabled.value) return
      model.value = value
    }
  })
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
    :data-testid="testId"
    :data-orientation="orientation"
    :data-disabled="field.disabled.value || null"
    :data-required="field.required.value || null"
    :data-invalid="field.invalid.value || null"
    class="flex data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-(--spacing-sm) data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:flex-wrap data-[orientation=horizontal]:gap-x-(--spacing-md) data-[orientation=horizontal]:gap-y-(--spacing-sm)"
  >
    <slot />
  </div>
</template>
