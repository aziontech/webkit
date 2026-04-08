<script setup lang="ts">
import { computed } from 'vue';
import type { NumberPropMetadata } from './types';

/**
 * PlaygroundNumberControl
 * 
 * Number input control for numeric props.
 * Supports min, max, and step constraints.
 */

interface Props {
  name: string;
  metadata: NumberPropMetadata;
  modelValue: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const inputId = computed(() => `prop-${props.name}`);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value);
  if (!isNaN(value)) {
    emit('update:modelValue', value);
  }
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      :for="inputId"
      class="text-xs font-medium text-black dark:text-white capitalize"
    >
      {{ metadata.label || name }}
    </label>
    <input
      :id="inputId"
      type="number"
      :value="modelValue"
      :min="metadata.min"
      :max="metadata.max"
      :step="metadata.step || 1"
      class="w-full py-2 px-3 text-sm text-default bg-layer1 hover:bg-layer1-hover border border-default rounded-md transition-[border-color,box-shadow] duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
      @input="handleInput"
    />
  </div>
</template>
