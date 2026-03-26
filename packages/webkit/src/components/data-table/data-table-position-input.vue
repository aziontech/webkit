<template>
  <div class="flex items-center gap-2">
    <i
      v-if="showDragHandle"
      class="pi pi-bars cursor-move hidden md:inline"
      :class="{ 'opacity-30 pointer-events-none': disabled }"
      data-pc-section="rowreordericon"
      data-testid="data-table-position-drag-handle"
    />
    <InputNumber
      :modelValue="modelValue"
      @update:modelValue="handleChange"
      @input="handleInput"
      :min="min"
      :max="max"
      :disabled="disabled"
      :allowEmpty="false"
      showButtons
      buttonLayout="horizontal"
      :pt="{ input: { class: 'w-11 text-center' } }"
      data-testid="data-table-position-input"
    >
      <template #incrementbuttonicon>
        <span class="pi pi-chevron-down" />
      </template>
      <template #decrementbuttonicon>
        <span class="pi pi-chevron-up" />
      </template>
    </InputNumber>
  </div>
</template>

<script setup>
  import InputNumber from 'primevue/inputnumber'

  defineOptions({ name: 'DataTablePositionInput' })

  const props = defineProps({
    modelValue: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showDragHandle: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['update:modelValue', 'input'])

  function handleChange(value) {
    emit('update:modelValue', value)
  }

  function handleInput(event) {
    emit('input', event)
  }
</script>
