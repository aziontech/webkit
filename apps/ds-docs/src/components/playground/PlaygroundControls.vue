<script setup lang="ts">
import { computed } from 'vue';
import type { PropsDefinition, PropsValues, PropMetadata, PreviewTheme } from './types';
import PlaygroundPropControl from './PlaygroundPropControl.vue';

/**
 * PlaygroundControls
 *
 * Renders all prop controls for a component.
 * Groups controls by category and maintains
 * the reactive state for all props.
 * Includes reset and preview theme toggle (only affects the component preview, not the site).
 */

interface Props {
  propsDefinition: PropsDefinition;
  propsValues: PropsValues;
  /** Current preview theme (light/dark) */
  previewTheme?: PreviewTheme;
}

const props = withDefaults(defineProps<Props>(), {
  previewTheme: 'light',
});

const emit = defineEmits<{
  'update:propsValues': [values: PropsValues];
  'update:previewTheme': [value: PreviewTheme];
}>();

// Group props by category
const groupedProps = computed(() => {
  const groups: Record<string, Array<{ name: string; metadata: PropMetadata }>> = {
    General: [],
  };

  for (const [name, metadata] of Object.entries(props.propsDefinition)) {
    const category = metadata.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push({ name, metadata });
  }

  // Remove empty groups
  for (const [category, items] of Object.entries(groups)) {
    if (items.length === 0) {
      delete groups[category];
    }
  }

  return groups;
});

// Update a single prop value
function updateProp(name: string, value: unknown) {
  emit('update:propsValues', {
    ...props.propsValues,
    [name]: value,
  });
}

// Reset all props to defaults
function resetToDefaults() {
  const defaults: PropsValues = {};
  for (const [name, metadata] of Object.entries(props.propsDefinition)) {
    defaults[name] = metadata.default;
  }
  emit('update:propsValues', defaults);
}

// Toggle preview theme (light/dark) — only affects the playground preview, not the site theme
function togglePreviewTheme() {
  emit('update:previewTheme', props.previewTheme === 'light' ? 'dark' : 'light');
}
</script>

<template>
  <div class="flex flex-col gap-4 pb-4">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-default px-4 pt-4 dark:bg-canvas bg-white">
      <h3 class="!text-lg !font-medium !text-default !m-0">
        Props
      </h3>
      <div class="flex items-center gap-1.5">
        <button
          class="flex items-center gap-1.5 py-1.5 px-3 h-8 text-xs font-medium text-muted bg-transparent border border-default rounded-md cursor-pointer transition-all duration-150 hover:bg-layer1-hover font-mono"
          @click="resetToDefaults"
          title="Reset to defaults"
        >
          <i class="pi pi-refresh"/>
          Reset
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center w-8 h-8 p-0 text-xs text-muted bg-transparent border border-default rounded-md cursor-pointer transition-all duration-150 hover:text-default hover:bg-layer1-hover"
          :title="previewTheme === 'light' ? 'Preview dark' : 'Preview light'"
          :aria-label="previewTheme === 'light' ? 'Switch preview to dark theme' : 'Switch preview to light theme'"
          @click="togglePreviewTheme"
        >
          <i :class="previewTheme === 'light' ? 'pi pi-moon' : 'pi pi-sun'" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Controls by category -->
    <div
      v-for="(items, category) in groupedProps"
      :key="category"
      class="flex flex-col gap-3 px-4"
    >
      <h4
        v-if="Object.keys(groupedProps).length > 1"
        class="!text-xs !font-semibold !text-muted !uppercase !font-mono !tracking-wide !m-0 !my-1 !mt-2"
      >
        {{ category }}
      </h4>
      <div class="flex flex-col gap-3">
        <PlaygroundPropControl
          v-for="item in items"
          :key="item.name"
          :name="item.name"
          :metadata="item.metadata"
          :model-value="propsValues[item.name]"
          @update:model-value="updateProp(item.name, $event)"
        />
      </div>
    </div>
  </div>
</template>
