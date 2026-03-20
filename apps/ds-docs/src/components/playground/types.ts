/**
 * Playground Types
 * 
 * Type definitions for the interactive playground system.
 * These types define the props metadata model that describes
 * how controls should be rendered and managed.
 */

/**
 * Supported control types for props editing
 */
export type ControlType = 'text' | 'boolean' | 'number' | 'select' | 'color';

/**
 * Base prop metadata definition
 */
export interface PropMetadataBase {
  /** The type of the prop value */
  type: 'string' | 'number' | 'boolean' | 'enum';
  /** Default value for the prop */
  default?: unknown;
  /** Control type to use for editing */
  control: ControlType;
  /** Human-readable label (defaults to prop name) */
  label?: string;
  /** Description of what the prop does */
  description?: string;
  /** Whether this prop is required */
  required?: boolean;
  /** Category for grouping related props */
  category?: string;
}

/**
 * Text control metadata
 */
export interface TextPropMetadata extends PropMetadataBase {
  type: 'string';
  control: 'text';
  /** Placeholder text for the input */
  placeholder?: string;
}

/**
 * Boolean control metadata
 */
export interface BooleanPropMetadata extends PropMetadataBase {
  type: 'boolean';
  control: 'boolean';
}

/**
 * Number control metadata
 */
export interface NumberPropMetadata extends PropMetadataBase {
  type: 'number';
  control: 'number';
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
}

/**
 * Select control metadata
 */
export interface SelectPropMetadata extends PropMetadataBase {
  type: 'enum';
  control: 'select';
  /** Available options for selection */
  options: readonly string[] | string[];
  /** Option labels (optional, for display purposes) */
  optionLabels?: Record<string, string>;
}

/**
 * Color control metadata (future use)
 */
export interface ColorPropMetadata extends PropMetadataBase {
  type: 'string';
  control: 'color';
}

/**
 * Union type for all prop metadata types
 */
export type PropMetadata =
  | TextPropMetadata
  | BooleanPropMetadata
  | NumberPropMetadata
  | SelectPropMetadata
  | ColorPropMetadata;

/**
 * Complete props definition for a component
 * Maps prop names to their metadata
 */
export type PropsDefinition = Record<string, PropMetadata>;

/**
 * Current values for all props
 */
export type PropsValues = Record<string, unknown>;

/**
 * Preview theme for the playground (light/dark)
 */
export type PreviewTheme = 'light' | 'dark';

/**
 * Preview surface/background options
 */
export type PreviewSurface = 'light' | 'neutral' | 'dark';

/**
 * Playground configuration
 */
export interface PlaygroundConfig {
  /** Component name for display */
  componentName: string;
  /** Props definition */
  props: PropsDefinition;
  /** Initial props values (optional, uses defaults if not provided) */
  initialValues?: PropsValues;
  /** Preview surface style */
  surface?: PreviewSurface;
  /** Whether to show the code panel */
  showCode?: boolean;
  /** Whether to show the controls panel */
  showControls?: boolean;
  /** Whether code is initially visible */
  codeInitiallyVisible?: boolean;
  /** Custom preview container class */
  previewClass?: string;
  /** Whether to show slots editor (future) */
  showSlots?: boolean;
  /** Whether to show events log (future) */
  showEvents?: boolean;
}

/**
 * Extensibility hooks for future features
 */
export interface PlaygroundHooks {
  /** Called when props change */
  onPropsChange?: (values: PropsValues) => void;
  /** Called when code is copied */
  onCodeCopy?: (code: string) => void;
  /** Called when a preset is applied */
  onPresetApply?: (presetName: string, values: PropsValues) => void;
  /** Called when an event is emitted from the component (future) */
  onEvent?: (eventName: string, payload: unknown) => void;
}

/**
 * State preset for quick switching between configurations
 */
export interface StatePreset {
  name: string;
  label: string;
  values: PropsValues;
}

/**
 * Generated code snippet information
 */
export interface GeneratedCode {
  /** The generated code string */
  code: string;
  /** Language for syntax highlighting */
  language: 'vue' | 'html' | 'jsx';
  /** Component name used */
  componentName: string;
}
