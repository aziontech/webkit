<script setup>
  import PrimeButton from 'primevue/button'
  import InputText from 'primevue/inputtext'
  import { computed, ref, watch } from 'vue'

  defineOptions({ name: 'DataTableInlineCreate' })

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Enter name...'
    },
    validator: {
      type: Function,
      default: null
    },
    errorMessage: {
      type: String,
      default: 'Invalid value'
    }
  })

  const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

  const validationError = ref('')

  const hasError = computed(() => {
    return !!validationError.value
  })

  const displayErrorMessage = computed(() => {
    return validationError.value || props.errorMessage
  })

  const validate = (value) => {
    if (!props.validator) {
      validationError.value = ''
      return true
    }

    const result = props.validator(value)

    if (result === true || result === undefined || result === null) {
      validationError.value = ''
      return true
    }

    if (typeof result === 'string') {
      validationError.value = result
      return false
    }

    validationError.value = props.errorMessage
    return false
  }

  const handleInput = (value) => {
    emit('update:modelValue', value)
    validate(value)
  }

  const handleSave = () => {
    if (!props.modelValue) return

    const isValid = validate(props.modelValue)
    if (isValid) {
      emit('save', props.modelValue)
    }
  }

  const handleCancel = () => {
    validationError.value = ''
    emit('cancel')
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        validate(newValue)
      } else {
        validationError.value = ''
      }
    }
  )
</script>

<template>
  <div
    class="flex items-center gap-2"
    data-testid="data-table-inline-create"
  >
    <div class="flex flex-col flex-1">
      <InputText
        :modelValue="modelValue"
        @update:modelValue="handleInput"
        @keyup.enter="handleSave"
        @keyup.escape="handleCancel"
        :placeholder="placeholder"
        :class="{ 'p-invalid': hasError }"
        class="h-8 w-full"
        data-testid="data-table-inline-create-input"
        autofocus
      />
      <small
        v-if="hasError"
        class="text-red-500 mt-1"
        data-testid="data-table-inline-create-error"
      >
        {{ displayErrorMessage }}
      </small>
    </div>
    <PrimeButton
      icon="pi pi-check"
      size="small"
      severity="secondary"
      :disabled="hasError || !modelValue"
      @click="handleSave"
      data-testid="data-table-inline-create-save"
    />
    <PrimeButton
      icon="pi pi-times"
      size="small"
      outlined
      @click="handleCancel"
      data-testid="data-table-inline-create-cancel"
    />
  </div>
</template>
