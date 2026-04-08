<script setup lang="ts">
import { computed, type Component } from 'vue';
import type { PropsValues, PreviewSurface, PreviewTheme } from './types';

/**
 * PlaygroundPreview
 *
 * Renders the component being edited in the playground.
 * Provides different surface backgrounds and responsive containers.
 * Supports light/dark theme switching for the preview area only.
 */

interface Props {
  /** The Vue component to render */
  component?: Component | null;
  /** Current props values passed to the component */
  propsValues: PropsValues;
  /** Surface/background style */
  surface?: PreviewSurface;
  /** Preview theme (light/dark) - only affects the preview container */
  previewTheme?: PreviewTheme;
  /** Custom class for preview container */
  customClass?: string;
  /** Center the content */
  center?: boolean;
  /** Minimum height */
  minHeight?: string;
  /** Slot content for the component */
  slotContent?: string;
}

const props = withDefaults(defineProps<Props>(), {
  component: null,
  surface: 'neutral',
  previewTheme: 'light',
  center: false,
  minHeight: '120px',
  slotContent: '',
});

const emit = defineEmits<{
  (e: 'update:previewTheme', value: PreviewTheme): void;
}>();

// Compute surface classes
const surfaceClasses = computed(() => {
  const classes: string[] = [];
  const isDark = props.previewTheme === 'dark';

  if (isDark) {
    switch (props.surface) {
      case 'light':
        classes.push('bg-surface');
        break;
      case 'dark':
        classes.push('bg-surface');
        break;
      case 'neutral':
      default:
        classes.push('bg-surface');
        break;
    }
  } else {
    switch (props.surface) {
      case 'light':
        classes.push('bg-surface');
        break;
      case 'dark':
        classes.push('bg-surface');
        break;
      case 'neutral':
      default:
        classes.push('bg-surface');
        break;
    }
  }

  return classes.join(' ');
});

// Wrapper class:
// - .dark when preview is dark → dark: variants apply inside preview only
// - .playground-preview-light when preview is light → token plugin re-emits light utilities
//   with higher specificity so they win over html.dark / .azion.azion-dark (site dark + preview light)
const wrapperClass = computed(() =>
  props.previewTheme === 'dark' ? 'dark' : 'playground-preview-light'
);

// Azion theme class for preview container so PrimeVue/components get correct CSS vars (light/dark)
const azionThemeClass = computed(() =>
  props.previewTheme === 'dark' ? 'azion-dark' : 'azion-light'
);

// Compute container styles
const containerStyle = computed(() => ({
  minHeight: props.minHeight,
}));
</script>

<template>
  <!-- Root establishes preview theme + bg so the whole preview area (incl. toolbar) matches light/dark.
       azion + azionThemeClass ensure CSS vars (theme-vars.css) apply to the entire preview subtree,
       independent of the site theme. -->
  <div
    class="flex flex-col h-full min-h-[200px] bg-surface azion"
    :class="[wrapperClass, azionThemeClass]"
  >
    <!-- Optional toolbar slot -->
    <div v-if="$slots.toolbar" class="flex items-center justify-end gap-2 px-2 pt-2">
      <slot name="toolbar" />
    </div>

    <!-- Scroll region: padded area, no forced centering so components lay out naturally -->
    <div
      :class="[
        'azion',
        azionThemeClass,
        surfaceClasses,
        customClass
      ]"
      class="p-8 flex-1 min-h-0 overflow-auto"
    >
        <!-- Component rendering -->
        <component
          :is="component"
          v-if="component"
          v-bind="propsValues"
        >
          {{ slotContent }}
        </component>
        
        <!-- Empty state when no component -->
        <div
          v-else
          class="flex flex-col items-center justify-center gap-2 p-8 text-muted dark:text-muted"
        >
          <i class="pi pi-th-large text-2xl text-muted dark:text-muted" aria-hidden="true" />
          <span class="text-sm">No component selected</span>
        </div>
    </div>
  </div>
</template>
