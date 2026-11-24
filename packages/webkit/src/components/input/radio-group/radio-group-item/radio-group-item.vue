<script setup lang="ts">
  import { computed, inject, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../../composables/use-field-control'
  import { RadioGroupInjectionKey } from '../injection-key'

  defineOptions({
    name: 'RadioGroupItem',
    inheritAttrs: false
  })

  export interface RadioGroupItemProps {
    /** Value written to the group when this option is selected. */
    value: string
    /** Disables this option only. */
    disabled?: boolean
    /** One-line explanation under the label; it also describes the radio to assistive tech. */
    description?: string
    /** Azion icon class of a glyph before the label. Empty renders none. */
    icon?: string
    /** Accessible name of the radio when the label alone is ambiguous or is not text. */
    ariaLabel?: string
  }
  const props = withDefaults(defineProps<RadioGroupItemProps>(), {
    disabled: false,
    description: '',
    icon: '',
    ariaLabel: ''
  })

  defineSlots<{
    /** The option label; clicking it selects the option. */
    default(): unknown
    /** Trailing content under the label and description, such as a price or a tag. */
    tag(): unknown
  }>()

  const ctx = inject(RadioGroupInjectionKey, null)
  if (!ctx) {
    throw new Error('RadioGroupItem must be used inside <RadioGroup>.')
  }

  const attrs = useAttrs()
  const uid = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'radio-group-item')

  const {
    invalid: isInvalid,
    required: isRequired,
    disabled: groupDisabled
  } = useFieldControl({
    disabled: () => props.disabled
  })

  const checked = computed(() => ctx.value.value === props.value)
  const inactive = computed(() => props.disabled || groupDisabled.value || ctx.disabled.value)
  const isCard = computed(() => ctx.variant.value === 'card')
  const descriptionId = computed(() => (props.description ? `${uid}-description` : undefined))
  const labelId = `${uid}-label`
  const labelledBy = computed(() =>
    props.ariaLabel ? undefined : (attrs['aria-labelledby'] as string | undefined) || labelId
  )

  const rootAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest['data-testid']
    delete rest['aria-labelledby']
    return rest
  })

  const select = () => {
    if (inactive.value) return
    ctx.select(props.value)
  }

  const ROOT_CLASS =
    'group/radio-item relative inline-flex w-fit max-w-full cursor-pointer items-start gap-(--spacing-xs) text-label-sm text-(--text-default) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) ' +
    'data-[variant=card]:flex data-[variant=card]:w-full data-[variant=card]:min-w-0 data-[variant=card]:rounded-(--shape-button) data-[variant=card]:border ' +
    'data-[variant=card]:border-(--border-muted) data-[variant=card]:bg-(--bg-surface) data-[variant=card]:p-(--spacing-sm) data-[variant=card]:transition-colors ' +
    'data-[variant=card]:duration-fast-02 data-[variant=card]:ease-productive-entrance ' +
    'motion-reduce:transition-none ' +
    'data-[variant=card]:hover:bg-(--bg-hover) data-[variant=card]:has-[:focus-visible]:outline-none data-[variant=card]:has-[:focus-visible]:ring-2 ' +
    'data-[variant=card]:has-[:focus-visible]:ring-(--ring-color) data-[variant=card]:has-[:focus-visible]:ring-offset-1 ' +
    'data-[variant=card]:has-[:focus-visible]:ring-offset-(--bg-canvas) data-[variant=card]:data-[invalid]:not-data-[checked]:border-(--danger-border) ' +
    'data-[variant=card]:data-[checked]:border-(--border-selected) data-[variant=card]:data-[checked]:bg-(--primary-selected) data-[variant=card]:data-[disabled]:opacity-50 ' +
    'data-[variant=card]:data-[disabled]:hover:bg-(--bg-surface) ' +
    'group-data-[orientation=horizontal]/radio-group:data-[variant=card]:flex-1 group-data-[orientation=horizontal]/radio-group:data-[variant=card]:basis-48'

  const INDICATOR_CLASS =
    'group relative inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-(--border-input) bg-(--bg-surface) ' +
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity " +
    'before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 ' +
    "after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance active:after:opacity-100 motion-reduce:before:transition-none " +
    'motion-reduce:after:transition-none has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) has-[:focus-visible]:ring-offset-1 ' +
    'has-[:focus-visible]:ring-offset-(--bg-canvas) ' +
    '[&:not([data-checked])]:hover:border-(--primary) ' +
    'data-[invalid]:not-data-[checked]:border-(--danger-border) ' +
    'data-[checked]:border-(--primary) data-[checked]:bg-(--primary) data-[checked]:after:hidden ' +
    'data-[disabled]:pointer-events-none data-[disabled]:border-(--border-input) data-[disabled]:bg-(--bg-disabled) data-[disabled]:opacity-50 data-[disabled]:before:hidden ' +
    'data-[disabled]:after:hidden'
</script>

<template>
  <label
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-variant="ctx.variant.value"
    :data-checked="checked || null"
    :data-disabled="inactive || null"
    :data-invalid="isInvalid || null"
    :class="ROOT_CLASS"
  >
    <input
      v-if="isCard"
      type="radio"
      :name="ctx.name.value"
      :value="value"
      :checked="checked"
      :disabled="inactive"
      :required="isRequired || undefined"
      :aria-invalid="isInvalid || undefined"
      :aria-label="ariaLabel || undefined"
      :aria-labelledby="labelledBy"
      :aria-describedby="descriptionId"
      :data-testid="`${testId}__control`"
      class="absolute inset-0 size-full cursor-pointer appearance-none rounded-[inherit] opacity-0 disabled:cursor-not-allowed"
      @change="select"
    />
    <span
      v-else
      :data-checked="checked || null"
      :data-disabled="inactive || null"
      :data-invalid="isInvalid || null"
      :class="INDICATOR_CLASS"
    >
      <input
        type="radio"
        :name="ctx.name.value"
        :value="value"
        :checked="checked"
        :disabled="inactive"
        :required="isRequired || undefined"
        :aria-invalid="isInvalid || undefined"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="labelledBy"
        :aria-describedby="descriptionId"
        :data-testid="`${testId}__control`"
        class="absolute inset-[min(0rem,calc(50%-12px))] cursor-pointer opacity-0 pointer-coarse:inset-[min(0rem,calc(50%-22px))] disabled:cursor-not-allowed"
        @change="select"
      />
      <span
        v-if="checked"
        class="pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--primary-foreground) group-data-[disabled]:bg-(--text-disabled)"
        aria-hidden="true"
        :data-testid="`${testId}__indicator`"
      />
    </span>
    <span class="flex min-w-0 flex-col items-start gap-(--spacing-2xs)">
      <span
        class="flex min-w-0 items-center gap-(--spacing-2xs) group-data-[variant=card]/radio-item:text-body-sm"
      >
        <i
          v-if="icon"
          :class="icon"
          class="leading-none"
          aria-hidden="true"
          :data-testid="`${testId}__icon`"
        />
        <span
          :id="labelId"
          class="min-w-0"
          :data-testid="`${testId}__label`"
          ><slot
        /></span>
      </span>
      <span
        v-if="description"
        :id="descriptionId"
        class="text-body-xs text-(--text-muted)"
        :data-testid="`${testId}__description`"
        >{{ description }}</span
      >
      <slot name="tag" />
    </span>
  </label>
</template>
