<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import {
    focusSuppressHoverGhostClasses,
    focusVisibleRingClasses,
    ghostLayerClasses,
    ghostLayerDisabledHideClasses
  } from '../presets/interactive-states'

  defineOptions({
    name: 'InputSwitch',
    inheritAttrs: false
  })

  interface Props {
    /** Selected value for v-model. */
    modelValue?: boolean
    /** Value emitted when toggled on. */
    trueValue?: boolean
    /** Value emitted when toggled off. */
    falseValue?: boolean
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** id for the switch button; associate an external label via htmlFor. */
    inputId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    trueValue: true,
    falseValue: false,
    disabled: false,
    inputId: undefined
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-switch')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const isChecked = computed(() => props.modelValue === props.trueValue)

  const handleToggle = () => {
    if (props.disabled) {
      return
    }

    emit('update:modelValue', isChecked.value ? props.falseValue : props.trueValue)
  }

  const handleKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      handleToggle()
    }
  }

  const sharedClasses = [
    'group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
    'border border-transparent bg-[var(--bg-disabled)] data-[checked]:bg-[var(--primary)]',
    ...ghostLayerClasses,
    ...focusVisibleRingClasses,
    ...focusSuppressHoverGhostClasses,
    ...ghostLayerDisabledHideClasses
  ]

  const disabledClasses =
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'

  const handleClasses =
    'pointer-events-none absolute left-0.5 top-1/2 z-[1] size-4 -translate-y-1/2 rounded-full bg-[var(--bg-surface)] shadow-[var(--shadow-xs)] transition-transform duration-fast-02 ease-productive-entrance motion-reduce:transition-none group-data-[checked]:translate-x-4'

  const rootClasses = computed(() => cn(sharedClasses, disabledClasses, attrs.class))
</script>

<template>
  <button
    :id="inputId"
    type="button"
    role="switch"
    :class="rootClasses"
    :disabled="disabled"
    :aria-checked="isChecked"
    :data-testid="testId"
    :data-checked="isChecked || null"
    :data-disabled="disabled || null"
    v-bind="passthroughAttrs"
    @click="handleToggle"
    @keydown="handleKeydown"
  >
    <span
      :class="handleClasses"
      aria-hidden="true"
      :data-testid="`${testId}__handle`"
    />
  </button>
</template>
