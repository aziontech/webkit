<script setup lang="ts">
import { ref, computed, type Component, onMounted, defineAsyncComponent } from 'vue';
import type { PropsDefinition, PropsValues, PlaygroundConfig, PlaygroundHooks, GeneratedCode, PreviewSurface, PreviewTheme } from './types';
import { generateCode } from './code-generator';
import PlaygroundPreview from './PlaygroundPreview.vue';
import PlaygroundControls from './PlaygroundControls.vue';
import PlaygroundCode from './PlaygroundCode.vue';

// Import demo components for registry
import { Button, BlockToastDemo } from '../demo';

// Import webkit async loaders — each entry is a static import() call so Vite
// can statically analyze and code-split all webkit component chunks.
import { webkitComponentByName } from '../../generated/playground-registry';

/**
 * Component Registry
 *
 * Maps component names to their actual component objects.
 * This is necessary because Astro's client:load directive cannot
 * serialize Vue component objects as props.
 *
 * Webkit components are registered as async components so they are
 * lazy-loaded only when their playground page is visited.
 */
const webkitRegistry = Object.fromEntries(
  Object.entries(webkitComponentByName).map(([name, loader]) => [
    name,
    defineAsyncComponent({
      loader,
      delay: 100,
      timeout: 8000,
    }),
  ]),
);

const componentRegistry: Record<string, Component> = {
  Button,
  BlockToastDemo,
  // Legacy alias for backwards compatibility
  AzButton: Button,
  // Auto-registered webkit components (lazy-loaded)
  ...webkitRegistry,
};

/**
 * Playground
 * 
 * Main playground container that orchestrates the interactive
 * component preview, controls, and code generation.
 * 
 * Usage:
 * ```vue
 * <Playground
 *   component-name="AzButton"
 *   :props="buttonProps"
 * />
 * ```
 */

interface Props {
  /** The Vue component to render (for backwards compatibility) */
  component?: Component;
  /** Component name for lookup in registry */
  componentName: string;
  /** Props definition with metadata */
  props: PropsDefinition;
  /** Initial props values (optional) */
  initialValues?: PropsValues;
  /** Preview surface style */
  surface?: PreviewSurface;
  /** Whether to show code panel */
  showCode?: boolean;
  /** Whether to show controls panel */
  showControls?: boolean;
  /** Whether code is initially visible */
  codeInitiallyVisible?: boolean;
  /** Custom preview container class */
  previewClass?: string;
  /** Slot content for the component */
  slotContent?: string;
  /** Extensibility hooks */
  hooks?: PlaygroundHooks;
}

const props = withDefaults(defineProps<Props>(), {
  component: undefined,
  surface: 'neutral',
  showCode: true,
  showControls: true,
  codeInitiallyVisible: true,
  slotContent: '',
});

// Resolve component from registry or use provided component
const resolvedComponent = computed(() => {
  // If component is directly provided, use it (for backwards compatibility)
  if (props.component) {
    return props.component;
  }
  
  // Otherwise, look up in registry by name
  return componentRegistry[props.componentName] || null;
});

// Initialize props values with defaults
function initializeValues(): PropsValues {
  const values: PropsValues = {};

  // Use initial values if provided
  if (props.initialValues) {
    Object.assign(values, props.initialValues);
  }

  // Fill in defaults for any missing props (skip function type — stubs injected at render)
  for (const [name, metadata] of Object.entries(props.props)) {
    const meta = metadata as { type?: string; default?: unknown };
    if (meta.type === 'function') continue;
    if (values[name] === undefined && meta.default !== undefined) {
      values[name] = meta.default;
    }
  }

  return values;
}

// Stubs for required function props (cannot be serialized in MDX/JSON)
const FUNCTION_STUBS: Record<string, () => unknown> = {
  listCountriesPhoneService: () => Promise.resolve([]),
};

// Reactive state
const propsValues = ref<PropsValues>(initializeValues());
// Preview theme: starts from site theme, can be overridden only within the playground
const previewTheme = ref<PreviewTheme>('light');

// Sync preview theme with site theme only on mount; after that, only the playground toggle changes it
onMounted(() => {
  const isDark = document.documentElement.classList.contains('dark');
  previewTheme.value = isDark ? 'dark' : 'light';
});

// Merge in stub functions for props with type 'function' so components receive callables
const resolvedPropsValues = computed<PropsValues>(() => {
  const raw = propsValues.value;
  const resolved = { ...raw };
  for (const [name, metadata] of Object.entries(props.props)) {
    const meta = metadata as { type?: string };
    if (meta.type !== 'function') continue;
    if (typeof resolved[name] !== 'function' && FUNCTION_STUBS[name]) {
      resolved[name] = FUNCTION_STUBS[name];
    }
  }
  return resolved;
});

// Generate code from current state
const generatedCode = computed<GeneratedCode>(() => {
  return generateCode(
    props.componentName,
    props.props,
    resolvedPropsValues.value,
    props.slotContent
  );
});

// Update props values
function updatePropsValues(newValues: PropsValues) {
  propsValues.value = newValues;
  
  // Call hook if provided
  props.hooks?.onPropsChange?.(newValues);
}

// Handle code copy
function handleCodeCopy(code: string) {
  props.hooks?.onCodeCopy?.(code);
}

// Reset to defaults
function resetToDefaults() {
  propsValues.value = initializeValues();
}

// Expose methods for external control
defineExpose({
  resetToDefaults,
  getPropsValues: () => propsValues.value,
  getGeneratedCode: () => generatedCode.value,
});
</script>

<template>
  <!-- Outer card stays neutral border; preview column gets theme bg inside PlaygroundPreview -->
  <div class="flex flex-col my-6 bg-surface border border-default rounded-lg overflow-hidden">
    <!-- Main content area -->
    <div class="grid grid-cols-1 md:grid-cols-[1fr_280px]">
      <!-- Preview section: min-h so bg-surface from PlaygroundPreview fills; overflow hidden clips rounded corner -->
      <div class="flex flex-col gap-2 min-h-0 rounded-tl-lg md:rounded-l-lg overflow-hidden">
        <PlaygroundPreview
          :component="resolvedComponent"
          :props-values="resolvedPropsValues"
          :surface="surface"
          :preview-theme="previewTheme"
          :custom-class="previewClass"
          :slot-content="slotContent"
          @update:preview-theme="previewTheme = $event"
        >
          <template #toolbar>
            <slot name="preview-toolbar" />
          </template>
        </PlaygroundPreview>
      </div>

      <!-- Controls section -->
      <div
        v-if="showControls"
        class="shrink-0 bg-surface border-l border-default overflow-y-auto max-h-[512px]"
      >
        <PlaygroundControls
          :props-definition="props.props"
          :props-values="propsValues"
          :preview-theme="previewTheme"
          @update:props-values="updatePropsValues"
          @update:preview-theme="previewTheme = $event"
        />
      </div>
    </div>

    <!-- Code section -->
    <div
      v-if="showCode"
      class="border-t border-default"
    >
      <PlaygroundCode
        :code="generatedCode"
        :initially-expanded="codeInitiallyVisible"
        @copy="handleCodeCopy"
      />
    </div>

    <!-- Future extensibility slots -->
    <div v-if="$slots.extra" class="mt-2 pt-4 border-t border-default">
      <slot name="extra" />
    </div>
  </div>
</template>
