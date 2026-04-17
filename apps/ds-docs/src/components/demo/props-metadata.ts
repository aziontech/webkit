/**
 * Props Metadata Definitions
 * 
 * These metadata objects define how props are displayed and edited
 * in the playground. This format is designed to be easily generated
 * automatically from Vue component definitions or TypeScript types
 * in the future.
 */

import type { PropsDefinition } from '../playground/types';

/**
 * Button component props metadata
 */
export const buttonProps: PropsDefinition = {
  severity: {
    type: 'enum',
    control: 'select',
    default: 'primary',
    options: ['primary', 'secondary', 'success', 'info', 'warn', 'help', 'danger', 'plain', 'contrast'],
    optionLabels: {
      primary: 'Primary',
      secondary: 'Secondary',
      success: 'Success',
      info: 'Info',
      warn: 'Warning',
      help: 'Help',
      danger: 'Danger',
      plain: 'Plain',
      contrast: 'Contrast',
    },
    label: 'Severity',
    description: 'Visual severity level - affects color scheme',
    category: 'Appearance',
  },
  variant: {
    type: 'enum',
    control: 'select',
    default: 'filled',
    options: ['filled', 'raised', 'rounded', 'outlined', 'text', 'link'],
    optionLabels: {
      filled: 'Filled',
      raised: 'Raised',
      rounded: 'Rounded',
      outlined: 'Outlined',
      text: 'Text',
      link: 'Link',
    },
    label: 'Variant',
    description: 'Style variant of the button',
    category: 'Appearance',
  },
  size: {
    type: 'enum',
    control: 'select',
    default: 'md',
    options: ['sm', 'md', 'lg'],
    optionLabels: {
      sm: 'Small',
      md: 'Medium',
      lg: 'Large',
    },
    label: 'Size',
    description: 'Size of the button',
    category: 'Appearance',
  },
  disabled: {
    type: 'boolean',
    control: 'boolean',
    default: false,
    label: 'Disabled',
    description: 'Whether the button is disabled',
    category: 'State',
  },
  loading: {
    type: 'boolean',
    control: 'boolean',
    default: false,
    label: 'Loading',
    description: 'Shows loading spinner and disables interaction',
    category: 'State',
  },
  state: {
    type: 'enum',
    control: 'select',
    default: 'default',
    options: ['default', 'hover', 'focus', 'active'],
    optionLabels: {
      default: 'Default',
      hover: 'Hover',
      focus: 'Focus',
      active: 'Active',
    },
    label: 'State',
    description: 'Forces a visual state for documentation purposes',
    category: 'State',
  },
  fullWidth: {
    type: 'boolean',
    control: 'boolean',
    default: false,
    label: 'Full Width',
    description: 'Whether button takes full width of container',
    category: 'Layout',
  },
  iconOnly: {
    type: 'boolean',
    control: 'boolean',
    default: false,
    label: 'Icon Only',
    description: 'Render as icon-only button (no text)',
    category: 'Layout',
  },
  iconPosition: {
    type: 'enum',
    control: 'select',
    default: 'left',
    options: ['left', 'right'],
    optionLabels: {
      left: 'Left',
      right: 'Right',
    },
    label: 'Icon Position',
    description: 'Position of the icon relative to the label',
    category: 'Content',
  },
};

/**
 * Toast block (BlockToastDemo) props metadata
 */
export const blockToastDemoProps: PropsDefinition = {
  variant: {
    type: 'enum',
    control: 'select',
    default: 'success',
    options: ['success', 'error'],
    optionLabels: { success: 'Success', error: 'Error' },
    label: 'Variant',
    description: 'Visual variant of the toast',
    category: 'Appearance',
  },
  title: {
    type: 'string',
    control: 'text',
    default: 'Changes saved',
    label: 'Title',
    description: 'Toast title',
    category: 'Content',
    placeholder: 'Title',
  },
  description: {
    type: 'string',
    control: 'text',
    default: 'Your changes have been saved successfully.',
    label: 'Description',
    description: 'Optional description text',
    category: 'Content',
    placeholder: 'Description',
  },
  actionText: {
    type: 'string',
    control: 'text',
    default: 'View details',
    label: 'Action text',
    description: 'Label for the action link',
    category: 'Content',
    placeholder: 'e.g. View details',
  },
  actionHref: {
    type: 'string',
    control: 'text',
    default: '#',
    label: 'Action URL',
    description: 'URL for the action link',
    category: 'Content',
  },
  durationMs: {
    type: 'number',
    control: 'number',
    default: 5000,
    min: 1000,
    max: 30000,
    step: 1000,
    label: 'Duration (ms)',
    description: 'Auto-close duration in milliseconds',
    category: 'Behavior',
  },
  autoClose: {
    type: 'boolean',
    control: 'boolean',
    default: false,
    label: 'Auto close',
    description: 'When off, toast stays visible (for playground)',
    category: 'Behavior',
  },
  showProgress: {
    type: 'boolean',
    control: 'boolean',
    default: true,
    label: 'Show progress bar',
    description: 'Show the countdown progress bar',
    category: 'Appearance',
  },
};

/**
 * Example of how this could be auto-generated in the future:
 * 
 * From Vue component:
 * ```typescript
 * // Future: Auto-generate from component
 * const buttonProps = extractPropsMetadata(AzButton);
 * ```
 * 
 * From TypeScript types:
 * ```typescript
 * // Future: Auto-generate from types
 * const buttonProps = generatePropsMetadata<ButtonProps>();
 * ```
 * 
 * From JSON metadata file:
 * ```typescript
 * // Future: Load from JSON file
 * import buttonProps from './metadata/button.json';
 * ```
 */
