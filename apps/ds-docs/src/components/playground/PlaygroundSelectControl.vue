<script setup lang="ts">
import { computed } from 'vue';
import type { SelectPropMetadata } from './types';

/**
 * PlaygroundSelectControl
 * 
 * Dropdown select for enum props.
 * Displays available options with optional labels.
 */

interface Props {
  name: string;
  metadata: SelectPropMetadata;
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputId = computed(() => `prop-${props.name}`);

const options = computed(() => {
  return props.metadata.options.map((option) => ({
    value: option,
    label: props.metadata.optionLabels?.[option] || option,
  }));
});

const selectBgImage = "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")";
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      :for="inputId"
      class="text-xs font-medium text-black dark:text-white capitalize"
    >
      {{ metadata.label || name }}
    </label>
    <select
      :id="inputId"
      :value="modelValue"
      :style="{ backgroundImage: selectBgImage }"
      class="w-full py-2 pl-3 pr-8 text-sm text-default bg-layer1 hover:bg-layer1-hover border border-default rounded-md cursor-pointer transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 appearance-none bg-no-repeat bg-[length:1.5em_1.5em] bg-[right_0.5rem_center]"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
