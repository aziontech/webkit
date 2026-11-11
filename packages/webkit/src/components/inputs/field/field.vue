<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId } from 'vue'

  import { fieldContextKey, type FieldOrientation, type FieldPartKind } from './injection-key'

  defineOptions({
    name: 'Field',
    inheritAttrs: false
  })

  export interface Props {
    /** Layout axis: label above the control, beside it, or beside it once the enclosing container (a FieldGroup, Card, drawer or dialog body) is wide enough. */
    orientation?: FieldOrientation
    /** Marks the field invalid: the control sets aria-invalid and FieldDescription switches to the invalid tone. */
    invalid?: boolean
    /** Disables the wrapped control and dims the field. */
    disabled?: boolean
    /** Shows the Required marker on FieldLabel and sets required on the wrapped control. */
    required?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    orientation: 'vertical',
    invalid: false,
    disabled: false,
    required: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field')

  const descriptions = ref<string[]>([])
  const errors = ref<string[]>([])
  const titles = ref<string[]>([])

  const register = (kind: FieldPartKind, id: string) => {
    const list = { description: descriptions, error: errors, title: titles }[kind]
    list.value = [...list.value, id]
    return () => {
      list.value = list.value.filter((entry) => entry !== id)
    }
  }

  provide(fieldContextKey, {
    controlId: `field-${useId()}`,
    describedBy: computed(() => [...descriptions.value, ...errors.value].join(' ') || undefined),
    labelledBy: computed(() => titles.value.join(' ') || undefined),
    invalid: computed(() => props.invalid),
    disabled: computed(() => props.disabled),
    required: computed(() => props.required),
    hasError: computed(() => errors.value.length > 0),
    register
  })
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    data-slot="field"
    :data-testid="testId"
    :data-orientation="orientation"
    :data-invalid="invalid || null"
    :data-disabled="disabled || null"
    :data-required="required || null"
    class="group/field flex w-full gap-(--spacing-xs) data-[orientation=vertical]:flex-col data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:has-[>[data-slot=field-content]]:items-start data-[orientation=horizontal]:[&>[data-slot=field-label]]:flex-auto data-[orientation=responsive]:flex-col @md:data-[orientation=responsive]:flex-row @md:data-[orientation=responsive]:items-center data-[disabled]:cursor-not-allowed"
  >
    <slot />
  </div>
</template>
