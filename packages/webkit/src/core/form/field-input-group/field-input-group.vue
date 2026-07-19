<script setup>
  import InputText from 'primevue/inputtext'
  import { useField } from 'vee-validate'
  import { computed, toRef, useAttrs, useSlots } from 'vue'

  import Label from '../label'
  import InputSlot from '../slots/input-slot'

  const props = defineProps({
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  })

  const name = toRef(props, 'name')
  const attrs = useAttrs()

  const customTestId = computed(() => {
    const id = attrs['data-testid'] || 'field-input-group'

    return {
      label: `${id}__label`,
      input: `${id}__input`,
      description: `${id}__description`,
      error: `${id}__error-message`
    }
  })

  const slots = useSlots()
  const hasIconSlot = !!slots.icon

  const inputSizeClass = computed(() => {
    if (props.size === 'small') return 'p-inputtext-sm'
    if (props.size === 'large') return 'p-inputtext-lg'
    return ''
  })

  const {
    value: inputValue,
    errorMessage,
    handleBlur,
    handleChange
  } = useField(name, undefined, {
    initialValue: props.value
  })
</script>

<template>
  <InputSlot>
    <Label
      :for="props.name"
      :data-testid="customTestId.label"
      :label="props.label"
      :isRequired="attrs.required"
    />
    <div
      :data-size="size"
      class="p-inputgroup rounded-[var(--shape-button)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-1 focus-within:ring-offset-[var(--bg-canvas)] [&_.p-inputtext:focus]:!shadow-none [&_.p-inputtext:focus]:!outline-none [&_.p-inputtext:enabled:focus]:!border-[var(--border-default)] data-[size=small]:[&_.p-inputgroup-addon]:py-[var(--spacing-1)] data-[size=small]:[&_.p-inputgroup-addon]:px-[var(--spacing-2)] data-[size=large]:[&_.p-inputgroup-addon]:py-[var(--spacing-3)] data-[size=large]:[&_.p-inputgroup-addon]:px-[var(--spacing-4)]"
    >
      <div
        class="p-inputgroup-addon"
        v-if="hasIconSlot"
      >
        <slot name="icon"></slot>
      </div>

      <InputText
        :id="name"
        v-model="inputValue"
        :name="name"
        :readonly="readonly"
        :disabled="disabled"
        :class="[{ 'p-invalid': errorMessage }, inputSizeClass, $attrs.class, inputClass]"
        type="text"
        :placeholder="props.placeholder"
        @input="handleChange"
        @blur="handleBlur"
      />
      <slot name="button"></slot>
    </div>
    <small
      v-if="errorMessage"
      class="p-error text-xs font-normal leading-tight"
    >
      {{ errorMessage }}
    </small>
    <small
      class="text-xs text-color-secondary font-normal leading-5"
      v-if="props.description"
    >
      {{ props.description }}
    </small>
  </InputSlot>
</template>
