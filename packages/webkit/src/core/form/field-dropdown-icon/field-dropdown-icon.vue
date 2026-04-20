<script setup>
  import Dropdown from 'primevue/dropdown'
  import { useField } from 'vee-validate'
  import { ref, toRef } from 'vue'

  import LabelBlock from '../label'
  import InputSlot from '../slots/input-slot'

  const emit = defineEmits(['onChange'])

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
    placeholder: {
      type: String,
      default: ''
    },
    description: {
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
    icon: {
      type: String,
      default: ''
    },
    suggestions: {
      type: Array,
      default: () => []
    },
    onComplete: {
      type: Function,
      default: () => {}
    },
    completeOnFocus: {
      type: Boolean,
      default: false
    }
  })

  const autoCompleteRef = ref(null)
  const nameInput = toRef(props, 'name')

  const {
    value: inputValue,
    errorMessage,
    handleBlur,
    handleChange
  } = useField(nameInput, undefined, {
    initialValue: props.value
  })

  const handleChangeEvent = ({ value }) => {
    emit('onChange', value)
  }

  defineExpose({
    autoCompleteRef
  })
</script>

<template>
  <InputSlot>
    <LabelBlock
      :for="props.name"
      :label="props.label"
    />

    <div
      class="p-inputgroup h-fit"
      :class="{ 'border border-red-500 rounded-md surface-border': errorMessage }"
    >
      <div
        class="p-inputgroup-addon"
        :class="{ 'opacity-20': props.disabled }"
      >
        <i
          v-if="props.icon"
          :class="props.icon"
          class="text-color-secondary"
        />
      </div>
      <Dropdown
        ref="autoCompleteRef"
        :readonly="props.readonly"
        class="w-full"
        :placeholder="props.placeholder"
        :id="props.name"
        :name="props.name"
        v-model="inputValue"
        :suggestions="props.suggestions"
        @complete="props.onComplete"
        :disabled="props.disabled"
        :completeOnFocus="props.completeOnFocus"
        @input="handleChange"
        @blur="handleBlur"
        v-bind="$attrs"
        @change="handleChangeEvent"
      />
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
