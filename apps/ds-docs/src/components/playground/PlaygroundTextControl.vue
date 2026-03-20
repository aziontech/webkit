<script setup lang="ts">
import { computed } from 'vue';
import type { TextPropMetadata } from './types';

/**
 * PlaygroundTextControl
 * 
 * Text input control for string props.
 * Provides a simple text input with optional placeholder.
 */

interface Props {
  name: string;
  metadata: TextPropMetadata;
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputId = computed(() => `prop-${props.name}`);
const placeholder = computed(() => props.metadata.placeholder || `Enter ${props.name}...`);
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
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full py-2 px-3 text-sm text-default bg-layer1 hover:bg-layer1-hover border border-default rounded-md transition-[border-color,box-shadow] duration-150 placeholder:text-muted"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
