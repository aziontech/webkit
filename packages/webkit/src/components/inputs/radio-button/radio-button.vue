<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { cn } from '../../../utils/cn'

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
    /** id for the native input; associate an external label via htmlFor. */
    inputId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    name: undefined,
    disabled: false,
    inputId: undefined
  })

  /** Selected value for v-model. */
  const model = defineModel<string | undefined>()

  const attrs = useAttrs()

  const {
    controlId,
    describedBy,
    labelledBy,
    disabled: isDisabled
  } = useFieldControl({
    id: () => props.inputId || (attrs['id'] as string | undefined),
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    labelledBy: () => attrs['aria-labelledby'] as string | undefined,
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

  const sharedClasses = [
    'relative inline-flex shrink-0 items-center justify-center',
    'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
    "before:bg-(--bg-hover) before:opacity-0 before:content-['']",
    'before:transition-opacity before:duration-fast-02 before:ease-productive-entrance',
    'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
    "after:bg-(--bg-active) after:opacity-0 after:content-['']",
    'after:transition-opacity after:duration-fast-02 after:ease-productive-entrance',
    'hover:before:opacity-100 active:after:opacity-100',
    'motion-reduce:before:transition-none motion-reduce:after:transition-none',
    'has-[:focus-visible]:outline-none',
    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color)',
    'has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-(--bg-canvas)',
    'focus-within:before:opacity-0',
    'focus-visible:before:opacity-0',
    'has-[:focus-visible]:before:opacity-0',
    'disabled:before:hidden disabled:after:hidden',
    'data-[disabled]:before:hidden data-[disabled]:after:hidden',
    'has-[:disabled]:before:hidden has-[:disabled]:after:hidden',
    'has-[[readonly]]:before:hidden has-[[readonly]]:after:hidden',
    'disabled:cursor-not-allowed',
    'data-[disabled]:cursor-not-allowed',
    'group size-5 rounded-full border border-(--border-default) bg-(--bg-surface)',
    '[&:not([data-checked])]:hover:border-(--primary) [&:not([data-checked])]:hover:before:opacity-0'
  ]

  const checkedClasses =
    'data-[checked]:border-(--primary) data-[checked]:bg-(--primary) data-[checked]:after:hidden'

  const disabledClasses =
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-(--border-default) data-[disabled]:bg-(--bg-disabled) data-[disabled]:opacity-50 data-[checked]:data-[disabled]:border-(--border-default) data-[checked]:data-[disabled]:bg-(--bg-disabled)'

  const indicatorClasses =
    'pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--primary-contrast) group-data-[disabled]:bg-(--text-disabled)'

  const rootClasses = computed(() =>
    cn(sharedClasses, checkedClasses, disabledClasses, attrs.class)
  )
</script>

<template>
  <span
    :class="rootClasses"
    :data-testid="testId"
    :data-checked="isChecked || null"
    :data-disabled="isDisabled || null"
  >
    <input
      :id="controlId"
      :aria-describedby="describedBy"
      :aria-labelledby="attrs['aria-label'] ? undefined : labelledBy"
      type="radio"
      class="absolute inset-[min(0rem,calc(50%-12px))] cursor-pointer opacity-0 pointer-coarse:inset-[min(0rem,calc(50%-22px))] disabled:cursor-not-allowed"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      :aria-checked="isChecked"
      :data-testid="`${testId}__input`"
      v-bind="passthroughAttrs"
      @change="handleChange"
    />
    <span
      v-if="isChecked"
      :class="indicatorClasses"
      aria-hidden="true"
      :data-testid="`${testId}__indicator`"
    />
  </span>
</template>
