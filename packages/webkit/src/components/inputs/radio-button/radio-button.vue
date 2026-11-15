<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'

  defineOptions({
    name: 'RadioButton',
    inheritAttrs: false
  })

  interface Props {
    /** Option value for this radio instance. */
    value?: string
    /** HTML name shared across a mutually exclusive group. */
    name?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the control invalid: sets aria-invalid and the danger border. An enclosing Field's invalid sets it too. */
    invalid?: boolean
    /** @deprecated since 6.0 — pass `id` (or let the enclosing Field set it). Removed in 7.0. */
    inputId?: string
  }
  export type RadioButtonProps = Props

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    name: '',
    disabled: false,
    invalid: false,
    inputId: ''
  })

  /** Selected value for v-model. */
  const model = defineModel<string | undefined>()

  const attrs = useAttrs()

  const {
    controlId,
    describedBy,
    labelledBy,
    invalid: isInvalid,
    required: isRequired,
    disabled: isDisabled
  } = useFieldControl({
    id: () => props.inputId || (attrs['id'] as string | undefined),
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    labelledBy: () => attrs['aria-labelledby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-radio-button'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const isChecked = computed(() => model.value === props.value)

  const handleChange = () => {
    if (isDisabled.value) {
      return
    }

    model.value = props.value
  }
</script>

<template>
  <span
    :class="attrs.class"
    class="relative inline-flex shrink-0 items-center justify-center before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-(--bg-canvas) focus-within:before:opacity-0 focus-visible:before:opacity-0 has-[:focus-visible]:before:opacity-0 disabled:before:hidden disabled:after:hidden data-[disabled]:before:hidden data-[disabled]:after:hidden has-[:disabled]:before:hidden has-[:disabled]:after:hidden has-[[readonly]]:before:hidden has-[[readonly]]:after:hidden disabled:cursor-not-allowed data-[disabled]:cursor-not-allowed group size-5 rounded-full border border-(--border-input) bg-(--bg-surface) [&:not([data-checked])]:hover:border-(--primary) [&:not([data-checked])]:hover:before:opacity-0 data-[invalid]:not-data-[checked]:border-(--danger-border) data-[checked]:border-(--primary) data-[checked]:bg-(--primary) data-[checked]:after:hidden data-[disabled]:pointer-events-none data-[disabled]:border-(--border-input) data-[disabled]:bg-(--bg-disabled) data-[disabled]:opacity-50 data-[checked]:data-[disabled]:border-(--border-input) data-[checked]:data-[disabled]:bg-(--bg-disabled)"
    :data-testid="testId"
    :data-checked="isChecked || null"
    :data-disabled="isDisabled || null"
    :data-invalid="isInvalid || null"
  >
    <input
      :id="controlId || undefined"
      :aria-describedby="describedBy"
      :aria-labelledby="attrs['aria-label'] ? undefined : labelledBy"
      type="radio"
      class="absolute inset-[min(0rem,calc(50%-12px))] cursor-pointer opacity-0 pointer-coarse:inset-[min(0rem,calc(50%-22px))] disabled:cursor-not-allowed"
      :name="name || undefined"
      :value="value"
      :aria-invalid="isInvalid || undefined"
      :required="isRequired || undefined"
      :checked="isChecked"
      :disabled="isDisabled"
      :data-testid="`${testId}__input`"
      v-bind="passthroughAttrs"
      @change="handleChange"
    />
    <span
      v-if="isChecked"
      class="pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--primary-contrast) group-data-[disabled]:bg-(--text-disabled)"
      aria-hidden="true"
      :data-testid="`${testId}__indicator`"
    />
  </span>
</template>
