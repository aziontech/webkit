<script setup lang="ts">
import { computed } from 'vue';
import type { BooleanPropMetadata } from './types';

/**
 * PlaygroundBooleanControl
 * 
 * Toggle switch for boolean props.
 * Provides a visual toggle with on/off states.
 */

interface Props {
  name: string;
  metadata: BooleanPropMetadata;
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const inputId = computed(() => `prop-${props.name}`);
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <label
      :for="inputId"
      class="text-xs font-medium text-black dark:text-white capitalize"
    >
      {{ metadata.label || name }}
    </label>
    <button
      :id="inputId"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :class="[
        'relative w-10 h-6 border-0 rounded-full cursor-pointer transition-colors duration-200 ',
        modelValue ? 'bg-primary' : 'bg-layer1 hover:bg-layer1-hover'
      ]"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        :class="[
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
          modelValue ? 'translate-x-4' : 'translate-x-0'
        ]"
      />
    </button>
  </div>
</template>
