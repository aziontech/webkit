<script setup lang="ts">
  import { computed, inject, provide, useAttrs } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { FieldInjectionKey } from '../field/injection-key'

  defineOptions({ name: 'InputGroup', inheritAttrs: false })

  export type InputGroupSize = 'small' | 'medium' | 'large'

  export interface InputGroupProps {
    /** Size token; affects the root's height and inner addon padding. Heights: small=28px, medium=32px, large=40px. Matches the sibling input primitives — set the same size on child controls to keep them visually aligned. */
    size?: InputGroupSize
    /** Renders the error border and marks the controls inside invalid (aria-invalid on InputGroup.Input and the other field controls). */
    invalid?: boolean
    /** Renders the required (warning) border; the required state itself belongs on the input. */
    required?: boolean
    /** Renders the disabled visual, sets aria-disabled on the root and disables the field controls inside (InputGroup.Input, Input, Select and the other controls that read the Field context). A Button or IconButton inside needs its own disabled. */
    disabled?: boolean
  }
  const props = withDefaults(defineProps<InputGroupProps>(), {
    size: 'medium',
    invalid: false,
    required: false,
    disabled: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const {
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  const parentField = inject(FieldInjectionKey, null)

  provide(FieldInjectionKey, {
    controlId: parentField?.controlId ?? '',
    describedBy: computed(() => parentField?.describedBy.value),
    labelledBy: computed(() => parentField?.labelledBy.value),
    invalid: isInvalid,
    disabled: isDisabled,
    required: computed(() => Boolean(parentField?.required.value)),
    hasError: computed(() => Boolean(parentField?.hasError.value)),
    register: (kind, id) => parentField?.register(kind, id) ?? (() => {})
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group')
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :data-testid="testId"
    :data-size="props.size"
    :data-invalid="isInvalid || null"
    :data-required="isRequired || null"
    :data-disabled="isDisabled || null"
    :aria-disabled="isDisabled ? 'true' : undefined"
    class="relative inline-flex items-center w-full overflow-hidden rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface) transition-colors duration-150 ease-out motion-reduce:transition-none data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 [&:not(:focus-within):not([data-invalid]):not([data-required]):not([data-disabled])]:hover:border-(--border-strong) focus-within:outline-none focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 focus-within:ring-offset-(--bg-canvas) data-[invalid]:border-(--danger-border) data-[required]:not-data-[invalid]:border-(--warning-border) data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0 [&_*]:focus-visible:!ring-0 [&_*]:focus-visible:!ring-offset-0 [&_*]:focus-within:!ring-0 [&_*]:focus-within:!ring-offset-0 [&_input]:!outline-none [&_button:not([role=switch])]:!border-transparent [&_button:not([role=switch])]:!rounded-none [&_a]:!border-transparent [&_a]:!rounded-none [&_[role=combobox]]:!border-transparent [&_[role=combobox]]:!rounded-none [&_[data-mode]]:!w-auto [&>*:not(:last-child)]:!border-e [&>*:not(:last-child)]:!border-e-(color:--border-default) [&>*:first-child]:rounded-s-(--shape-control) [&>*:not(:first-child)]:rounded-s-none [&>*:last-child]:rounded-e-(--shape-control) [&>*:not(:last-child)]:rounded-e-none"
  >
    <slot />
  </div>
</template>
