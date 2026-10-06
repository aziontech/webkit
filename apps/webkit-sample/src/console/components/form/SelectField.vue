<script setup lang="ts">
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import { computed, useId } from 'vue'

  interface Props {
    label?: string
    options?: unknown[]
    placeholder?: string
    helperText?: string
    size?: string
    disabled?: boolean
    required?: boolean
    invalid?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    options: () => [],
    placeholder: 'Select an option...',
    helperText: '',
    size: 'large',
    disabled: false,
    required: false,
    invalid: false
  })

  const model = defineModel({ type: [String, Number], default: '' })

  const id = useId()
  const helperId = computed(() => `${id}-helper`)
  const describedBy = computed(() => (props.helperText ? helperId.value : undefined))

  const helperKind = computed(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  const optionFor = (value) => props.options.find((option) => option.value === value)

  const displayValue = (value) => optionFor(value)?.label ?? ''

  const selectedMark = computed(() => {
    const option = optionFor(model.value)
    return option?.icon ? { icon: option.icon, markClass: option.markClass ?? '' } : null
  })
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-xs)">
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="id"
    />
    <Select
      v-model="model"
      :size="size"
      :disabled="disabled"
      :required="required"
      :invalid="invalid"
      :placeholder="placeholder"
      :display-value="displayValue"
      class="w-full"
    >
      <Select.Trigger
        :id="id"
        :aria-describedby="describedBy"
      >
        <template
          v-if="selectedMark"
          #iconLeft
        >
          <i
            :class="[selectedMark.icon, selectedMark.markClass]"
            class="shrink-0 text-body-md leading-none"
            aria-hidden="true"
          />
        </template>
      </Select.Trigger>
      <Select.Content>
        <Select.Option
          v-for="option in options"
          :key="String(option.value)"
          :value="option.value"
        >
          <template
            v-if="option.icon"
            #left
          >
            <i
              :class="[option.icon, option.markClass]"
              class="shrink-0 text-body-md leading-none"
              aria-hidden="true"
            />
          </template>
          {{ option.label }}
        </Select.Option>
      </Select.Content>
    </Select>
    <HelperText
      v-if="helperText"
      :id="helperId"
      :label="helperText"
      :kind="helperKind"
    />
  </div>
</template>
