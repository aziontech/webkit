/**
 * Playground Components
 * 
 * Barrel export for all playground-related components and utilities.
 * The playground system provides interactive component exploration
 * within the documentation platform.
 */

// Main component
export { default as Playground } from './Playground.vue';

// Sub-components
export { default as PlaygroundPreview } from './PlaygroundPreview.vue';
export { default as PlaygroundControls } from './PlaygroundControls.vue';
export { default as PlaygroundCode } from './PlaygroundCode.vue';
export { default as PlaygroundPropControl } from './PlaygroundPropControl.vue';

// Individual controls
export { default as PlaygroundTextControl } from './PlaygroundTextControl.vue';
export { default as PlaygroundBooleanControl } from './PlaygroundBooleanControl.vue';
export { default as PlaygroundNumberControl } from './PlaygroundNumberControl.vue';
export { default as PlaygroundSelectControl } from './PlaygroundSelectControl.vue';

// Types
export type {
  ControlType,
  PropMetadataBase,
  TextPropMetadata,
  BooleanPropMetadata,
  NumberPropMetadata,
  SelectPropMetadata,
  ColorPropMetadata,
  PropMetadata,
  PropsDefinition,
  PropsValues,
  PreviewSurface,
  PreviewTheme,
  PlaygroundConfig,
  PlaygroundHooks,
  StatePreset,
  GeneratedCode,
} from './types';

// Utilities
export { generateCode, generateMinimalExample, generateVariantExamples } from './code-generator';
