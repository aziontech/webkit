<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  defineOptions({
    name: 'Textarea',
    inheritAttrs: false
  })

  interface Props {
    /** Bound value (v-model). */
    modelValue?: string
    /** Placeholder shown when the field is empty. */
    placeholder?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field as read-only; keeps focus styling, blocks edits. */
    readonly?: boolean
    /** Applies invalid styling and sets aria-invalid. */
    invalid?: boolean
    /** Marks the field as required and sets aria-required. */
    required?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  defineSlots<{
    iconLeft(): unknown
    iconRight(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-textarea')
  const isFilled = computed(() => props.modelValue.length > 0)
  const hasIconLeft = computed(() => !!slots['iconLeft'])
  const hasIconRight = computed(() => !!slots['iconRight'] || props.disabled)

  // eslint-disable-next-line no-undef
  const handleInput = (event: InputEvent) => {
    const target = event.target as HTMLElement & { value: string }
    emit('update:modelValue', target.value)
  }
</script>

<template>
  <div
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-filled="isFilled || null"
    :data-readonly="readonly || null"
    :data-has-icon-left="hasIconLeft || null"
    :data-has-icon-right="hasIconRight || null"
    :class="attrs.class as string"
    class="group relative isolate w-full rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-solid border-[var(--border-default)] bg-[var(--bg-surface)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-raised)] data-[filled]:hover:bg-[var(--bg-surface)] focus-within:border-[var(--ring-color)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-1 focus-within:ring-offset-[var(--bg-canvas)] data-[required]:border-[var(--warning-border)] data-[required]:focus-within:border-[var(--warning-border)] data-[required]:focus-within:ring-[var(--warning)] data-[invalid]:border-[var(--danger-border)] data-[invalid]:focus-within:border-[var(--danger-border)] data-[invalid]:focus-within:ring-[var(--danger)] data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:hover:bg-[var(--bg-disabled)] data-[disabled]:hover:border-[var(--border-default)]"
  >
    <textarea
      v-bind="$attrs"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-invalid="invalid || undefined"
      :aria-required="required || undefined"
      :aria-disabled="disabled || undefined"
      :data-testid="`${testId}__control`"
      class="block w-full min-h-[80px] resize-y rounded-[var(--shape-elements)] border-0 bg-transparent outline-none text-body-xs text-[var(--text-default)] placeholder:text-[var(--text-muted)] p-[var(--spacing-sm)] group-data-[has-icon-left]:pl-[calc(var(--spacing-sm)+var(--spacing-md)+1rem)] group-data-[has-icon-right]:pr-[calc(var(--spacing-sm)+var(--spacing-md)+1rem)] transition-[padding] duration-150 ease-out motion-reduce:transition-none focus:p-[var(--spacing-md)] focus:group-data-[has-icon-left]:pl-[calc(var(--spacing-md)+var(--spacing-md)+1rem)] focus:group-data-[has-icon-right]:pr-[calc(var(--spacing-md)+var(--spacing-md)+1rem)] disabled:cursor-not-allowed disabled:p-[var(--spacing-md)] disabled:text-[var(--text-disabled)] disabled:placeholder:text-[var(--text-disabled)] read-only:cursor-default"
      @input="handleInput"
    />
    <span
      v-if="hasIconLeft"
      aria-hidden="true"
      class="absolute top-[var(--spacing-md)] left-[var(--spacing-md)] text-[var(--text-muted)] pointer-events-none"
    >
      <slot name="iconLeft" />
    </span>
    <span
      v-if="hasIconRight && !disabled"
      aria-hidden="true"
      class="absolute top-[var(--spacing-md)] right-[var(--spacing-md)] text-[var(--text-muted)] pointer-events-none"
    >
      <slot name="iconRight" />
    </span>
    <i
      v-if="disabled"
      aria-hidden="true"
      class="pi pi-lock absolute top-[var(--spacing-md)] right-[var(--spacing-md)] text-[var(--text-disabled)] pointer-events-none"
    />
  </div>
</template>
