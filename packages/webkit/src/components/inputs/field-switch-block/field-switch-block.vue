<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { cn } from '../../../utils/cn'
  import { selectableBlockCardClasses } from '../presets/interactive-states'
  import Switch from '../switch/switch.vue'

  defineOptions({
    name: 'FieldSwitchBlock',
    inheritAttrs: false
  })

  interface Props {
    /** Selected value for v-model. */
    modelValue?: boolean
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Primary label text. */
    label?: string
    /** Secondary description. */
    description?: string
    /** Helper badge text shown when disabled. */
    helperText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
    label: '',
    description: '',
    helperText: ''
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-switch-block'
  )

  const isChecked = computed(() => props.modelValue === true)

  const isHighlighted = computed(
    () => (isChecked.value && !props.disabled) || (!isChecked.value && props.disabled)
  )

  const model = computed({
    get: () => props.modelValue,
    set: (next) => emit('update:modelValue', next ?? false)
  })

  const sharedClasses = 'block data-[disabled]:cursor-not-allowed'

  const cardClasses = cn(
    selectableBlockCardClasses,
    'p-[var(--spacing-sm)]',
    'data-[highlighted]:border-[var(--border-selected)] data-[highlighted]:bg-[var(--primary-selected)]',
    'data-[highlighted]:before:hidden data-[highlighted]:after:hidden',
    'data-[disabled]:opacity-50'
  )

  const rowClasses =
    'flex cursor-pointer items-start gap-[var(--spacing-sm)] data-[disabled]:cursor-not-allowed'

  const textsClasses =
    'flex min-w-0 flex-1 flex-col gap-[var(--spacing-xxs)] data-[disabled]:opacity-50'

  const helperClasses =
    'inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-xs text-[var(--text-muted)] w-fit'

  const rootClasses = computed(() => cn(sharedClasses, attrs.class))
</script>

<template>
  <label
    :for="generatedId"
    :class="rootClasses"
    :data-testid="testId"
    :data-disabled="disabled || null"
  >
    <div
      :class="cardClasses"
      :data-highlighted="isHighlighted || null"
      :data-disabled="disabled || null"
      :data-checked="isChecked || null"
      :data-testid="`${testId}__card`"
    >
      <div
        :class="rowClasses"
        :data-disabled="disabled || null"
        :data-testid="`${testId}__row`"
      >
        <Switch
          :id="generatedId"
          v-model="model"
          :class="disabled ? 'pointer-events-none opacity-50' : ''"
          :data-testid="`${testId}__control`"
        />
        <div
          :class="textsClasses"
          :data-disabled="disabled || null"
          :data-testid="`${testId}__texts`"
        >
          <span
            v-if="label"
            class="text-body-sm text-[var(--text-default)]"
            :data-testid="`${testId}__label`"
          >
            {{ label }}
          </span>
          <span
            v-if="description"
            class="text-body-xs text-[var(--text-muted)]"
            :data-testid="`${testId}__description`"
          >
            {{ description }}
          </span>
          <div
            v-if="disabled && helperText"
            :class="helperClasses"
            :data-testid="`${testId}__helper`"
          >
            <i
              class="pi pi-lock text-[length:inherit] leading-none"
              aria-hidden="true"
              :data-testid="`${testId}__helper-icon`"
            />
            <span :data-testid="`${testId}__helper-text`">{{ helperText }}</span>
          </div>
        </div>
      </div>
    </div>
  </label>
</template>
