<script setup lang="ts">
import { computed } from 'vue';

/**
 * Button - Demo Component
 *
 * A comprehensive button component supporting multiple severity levels,
 * states, and style variants based on the Azion Design System.
 *
 * This is a demonstration component for the playground.
 * In production, this would be imported from @aziontech/components.
 */

type ButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'help'
  | 'danger'
  | 'plain'
  | 'contrast';

type ButtonVariant =
  | 'filled'
  | 'raised'
  | 'rounded'
  | 'outlined'
  | 'text'
  | 'link';

type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';
type ButtonState = 'default' | 'hover' | 'focus' | 'active';

interface Props {
  severity?: ButtonSeverity;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  iconPosition?: IconPosition;
  /** Forces a visual state for documentation purposes */
  state?: ButtonState;
}

const props = withDefaults(defineProps<Props>(), {
  severity: 'primary',
  variant: 'filled',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  iconOnly: false,
  iconPosition: 'left',
  state: 'default',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function handleClick(event: MouseEvent): void {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}

const buttonClasses = computed(() => {
  const classes: string[] = [];

  // Base styles
  classes.push(
    'inline-flex',
    'font-mono',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-150',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2'
  );

  // Icon only specific styles
  if (props.iconOnly) {
    classes.push('aspect-square');
  }

  // Size styles
  const sizeClasses = getSizeClasses();
  classes.push(...sizeClasses);

  // Variant and severity styles
  const variantClasses = getVariantClasses();
  classes.push(...variantClasses);

  // Full width
  if (props.fullWidth) {
    classes.push('w-full');
  }

  // Disabled state
  if (props.disabled || props.loading) {
    classes.push('cursor-not-allowed', 'opacity-50');
  }

  return classes.join(' ');
});

function getSizeClasses(): string[] {
  const { size, iconOnly, variant } = props;
  const isTextButton = variant === 'text' || variant === 'link';

  if (iconOnly) {
    switch (size) {
      case 'sm':
        return ['w-7', 'h-7', 'text-sm'];
      case 'lg':
        return ['w-10', 'h-10', 'text-lg'];
      case 'md':
      default:
        return ['w-8', 'h-8', 'text-base'];
    }
  }

  switch (size) {
    case 'sm':
      return isTextButton
        ? ['px-3', 'py-1', 'text-xs', 'h-7']
        : ['px-3', 'py-1.5', 'text-xs', 'h-8'];
    case 'lg':
      return isTextButton
        ? ['px-4', 'py-1.5', 'text-base', 'h-8']
        : ['px-5', 'py-2.5', 'text-base', 'h-10'];
    case 'md':
    default:
      return isTextButton
        ? ['px-3', 'py-1', 'text-sm', 'h-7']
        : ['px-4', 'py-1.5', 'text-sm', 'h-8'];
  }
}

function getVariantClasses(): string[] {
  const { variant } = props;

  if (variant === 'link') {
    return getLinkClasses();
  }

  if (variant === 'text') {
    return getTextClasses();
  }

  if (variant === 'outlined') {
    return getOutlinedClasses();
  }

  return getFilledClasses();
}

function getFilledClasses(): string[] {
  const { severity, variant, disabled, state } = props;
  const isRaised = variant === 'raised';
  const isRounded = variant === 'rounded';

  const classes: string[] = [];

  // Border radius
  if (isRounded) {
    classes.push('rounded-full');
  } else {
    classes.push('rounded-md');
  }

  // Raised shadow
  if (isRaised) {
    if (state === 'active') {
      classes.push('shadow-sm');
    } else if (state === 'hover') {
      classes.push('shadow-md');
    } else {
      classes.push('shadow-sm', 'hover:shadow-md', 'active:shadow-sm');
    }
  }

  // Severity colors with state simulation support
  const severityColors: Record<ButtonSeverity, { 
    bg: string; 
    hover: string; 
    active: string; 
    text: string; 
    focus: string;
    hoverBg: string;
    activeBg: string;
  }> = {
    primary: {
      bg: 'bg-black dark:bg-white',
      hover: 'hover:bg-primary dark:hover:bg-primary',
      active: '',
      text: 'text-white dark:text-black',
      focus: 'focus-visible:ring-primary-500',
      hoverBg: 'bg-[#F3652B] dark:bg-[#F3652B]',
      activeBg: 'bg-primary-950 dark:bg-primary-900',
    },
    secondary: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-700',
      active: 'active:bg-gray-300 dark:active:bg-gray-600',
      text: 'text-default dark:text-gray-100',
      focus: 'focus-visible:ring-gray-500',
      hoverBg: 'bg-gray-200 dark:bg-gray-700',
      activeBg: 'bg-gray-300 dark:bg-gray-600',
    },
    success: {
      bg: 'bg-green-600 dark:bg-green-700',
      hover: 'hover:bg-green-700 dark:hover:bg-green-600',
      active: 'active:bg-green-800 dark:active:bg-green-800',
      text: 'text-white',
      focus: 'focus-visible:ring-green-500',
      hoverBg: 'bg-green-700 dark:bg-green-600',
      activeBg: 'bg-green-800 dark:bg-green-800',
    },
    info: {
      bg: 'bg-blue-600 dark:bg-blue-700',
      hover: 'hover:bg-blue-700 dark:hover:bg-blue-600',
      active: 'active:bg-blue-800 dark:active:bg-blue-800',
      text: 'text-white',
      focus: 'focus-visible:ring-blue-500',
      hoverBg: 'bg-blue-700 dark:bg-blue-600',
      activeBg: 'bg-blue-800 dark:bg-blue-800',
    },
    warn: {
      bg: 'bg-amber-500 dark:bg-amber-600',
      hover: 'hover:bg-amber-600 dark:hover:bg-amber-500',
      active: 'active:bg-amber-700 dark:active:bg-amber-700',
      text: 'text-white',
      focus: 'focus-visible:ring-amber-500',
      hoverBg: 'bg-amber-600 dark:bg-amber-500',
      activeBg: 'bg-amber-700 dark:bg-amber-700',
    },
    help: {
      bg: 'bg-purple-600 dark:bg-purple-700',
      hover: 'hover:bg-purple-700 dark:hover:bg-purple-600',
      active: 'active:bg-purple-800 dark:active:bg-purple-800',
      text: 'text-white',
      focus: 'focus-visible:ring-purple-500',
      hoverBg: 'bg-purple-700 dark:bg-purple-600',
      activeBg: 'bg-purple-800 dark:bg-purple-800',
    },
    danger: {
      bg: 'bg-red-600 dark:bg-red-700',
      hover: 'hover:bg-red-700 dark:hover:bg-red-600',
      active: 'active:bg-red-800 dark:active:bg-red-800',
      text: 'text-white',
      focus: 'focus-visible:ring-red-500',
      hoverBg: 'bg-red-700 dark:bg-red-600',
      activeBg: 'bg-red-800 dark:bg-red-800',
    },
    plain: {
      bg: 'bg-transparent',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      active: 'active:bg-gray-200 dark:active:bg-gray-700',
      text: 'text-gray-700 dark:text-gray-300',
      focus: 'focus-visible:ring-gray-500',
      hoverBg: 'bg-gray-100 dark:bg-gray-800',
      activeBg: 'bg-gray-200 dark:bg-gray-700',
    },
    contrast: {
      bg: 'bg-white dark:bg-surface-900',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      active: 'active:bg-gray-200 dark:active:bg-gray-700',
      text: 'text-default dark:text-white',
      focus: 'focus-visible:ring-gray-400',
      hoverBg: 'bg-gray-100 dark:bg-gray-800',
      activeBg: 'bg-gray-200 dark:bg-gray-700',
    },
  };

  const colors = severityColors[severity];
  
  // Apply state-simulated colors or regular colors
  if (state === 'hover' && !disabled) {
    classes.push(colors.hoverBg, colors.text);
  } else if (state === 'active' && !disabled) {
    classes.push(colors.activeBg, colors.text);
  } else {
    classes.push(colors.bg, colors.text);
  }
  
  // Focus ring - apply directly for focus state or as pseudo-class
  if (state === 'focus') {
    classes.push('ring-2', 'ring-offset-2', colors.focus.replace('focus-visible:ring-', 'ring-'));
  } else {
    classes.push(colors.focus);
  }

  // Add hover/active pseudo-classes only if not simulating a state
  if (!disabled && state === 'default') {
    classes.push(colors.hover, colors.active);
  }

  return classes;
}

function getOutlinedClasses(): string[] {
  const { severity, disabled, state } = props;
  const isRounded = props.variant === 'rounded';

  const classes: string[] = [];

  // Border radius
  if (isRounded) {
    classes.push('rounded-full');
  } else {
    classes.push('rounded-md');
  }

  // Base outline styles
  classes.push('bg-transparent', 'border-2');

  // Severity colors for outlined with state simulation
  const severityColors: Record<ButtonSeverity, { 
    border: string; 
    text: string; 
    hover: string; 
    active: string; 
    focus: string;
    hoverBg: string;
    activeBg: string;
  }> = {
    primary: {
      border: 'border-primary-900 dark:border-primary-300',
      text: 'text-primary-900 dark:text-primary-300',
      hover: 'hover:bg-primary-50 dark:hover:bg-primary-900/20',
      active: 'active:bg-primary-100 dark:active:bg-primary-900/30',
      focus: 'focus-visible:ring-primary-500',
      hoverBg: 'bg-primary-50 dark:bg-primary-900/20',
      activeBg: 'bg-primary-100 dark:bg-primary-900/30',
    },
    secondary: {
      border: 'border-default dark:border-gray-600',
      text: 'text-gray-700 dark:text-gray-300',
      hover: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      active: 'active:bg-gray-100 dark:active:bg-gray-700',
      focus: 'focus-visible:ring-gray-500',
      hoverBg: 'bg-gray-50 dark:bg-gray-800',
      activeBg: 'bg-gray-100 dark:bg-gray-700',
    },
    success: {
      border: 'border-green-600 dark:border-green-500',
      text: 'text-green-600 dark:text-green-500',
      hover: 'hover:bg-green-50 dark:hover:bg-green-900/20',
      active: 'active:bg-green-100 dark:active:bg-green-900/30',
      focus: 'focus-visible:ring-green-500',
      hoverBg: 'bg-green-50 dark:bg-green-900/20',
      activeBg: 'bg-green-100 dark:bg-green-900/30',
    },
    info: {
      border: 'border-blue-600 dark:border-blue-500',
      text: 'text-blue-600 dark:text-blue-500',
      hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      active: 'active:bg-blue-100 dark:active:bg-blue-900/30',
      focus: 'focus-visible:ring-blue-500',
      hoverBg: 'bg-blue-50 dark:bg-blue-900/20',
      activeBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    warn: {
      border: 'border-amber-500 dark:border-amber-500',
      text: 'text-amber-600 dark:text-amber-500',
      hover: 'hover:bg-amber-50 dark:hover:bg-amber-900/20',
      active: 'active:bg-amber-100 dark:active:bg-amber-900/30',
      focus: 'focus-visible:ring-amber-500',
      hoverBg: 'bg-amber-50 dark:bg-amber-900/20',
      activeBg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    help: {
      border: 'border-purple-600 dark:border-purple-500',
      text: 'text-purple-600 dark:text-purple-500',
      hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
      active: 'active:bg-purple-100 dark:active:bg-purple-900/30',
      focus: 'focus-visible:ring-purple-500',
      hoverBg: 'bg-purple-50 dark:bg-purple-900/20',
      activeBg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    danger: {
      border: 'border-red-600 dark:border-red-500',
      text: 'text-red-600 dark:text-red-500',
      hover: 'hover:bg-red-50 dark:hover:bg-red-900/20',
      active: 'active:bg-red-100 dark:active:bg-red-900/30',
      focus: 'focus-visible:ring-red-500',
      hoverBg: 'bg-red-50 dark:bg-red-900/20',
      activeBg: 'bg-red-100 dark:bg-red-900/30',
    },
    plain: {
      border: 'border-default dark:border-gray-600',
      text: 'text-gray-600 dark:text-muted',
      hover: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      active: 'active:bg-gray-100 dark:active:bg-gray-700',
      focus: 'focus-visible:ring-gray-500',
      hoverBg: 'bg-gray-50 dark:bg-gray-800',
      activeBg: 'bg-gray-100 dark:bg-gray-700',
    },
    contrast: {
      border: 'border-gray-900 dark:border-white',
      text: 'text-default dark:text-white',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      active: 'active:bg-gray-200 dark:active:bg-gray-700',
      focus: 'focus-visible:ring-gray-400',
      hoverBg: 'bg-gray-100 dark:bg-gray-800',
      activeBg: 'bg-gray-200 dark:bg-gray-700',
    },
  };

  const colors = severityColors[severity];
  classes.push(colors.border, colors.text);
  
  // Focus ring - apply directly for focus state or as pseudo-class
  if (state === 'focus') {
    classes.push('ring-2', 'ring-offset-2', colors.focus.replace('focus-visible:ring-', 'ring-'));
  } else {
    classes.push(colors.focus);
  }

  // Apply state-simulated backgrounds or regular pseudo-classes
  if (state === 'hover' && !disabled) {
    classes.push(colors.hoverBg);
  } else if (state === 'active' && !disabled) {
    classes.push(colors.activeBg);
  } else if (!disabled && state === 'default') {
    classes.push(colors.hover, colors.active);
  }

  return classes;
}

function getTextClasses(): string[] {
  const { severity, disabled, state } = props;

  const classes: string[] = [];

  classes.push('rounded-md', 'bg-transparent');

  const severityColors: Record<ButtonSeverity, { 
    text: string; 
    hover: string; 
    active: string; 
    focus: string;
    hoverText: string;
    activeText: string;
  }> = {
    primary: {
      text: 'text-primary-700 dark:text-primary-300',
      hover: 'hover:text-primary-800 dark:hover:text-primary-200',
      active: 'active:text-primary-900 dark:active:text-primary-100',
      focus: 'focus-visible:ring-primary-500',
      hoverText: 'text-primary-800 dark:text-primary-200',
      activeText: 'text-primary-900 dark:text-primary-100',
    },
    secondary: {
      text: 'text-gray-600 dark:text-muted',
      hover: 'hover:text-gray-700 dark:hover:text-gray-300',
      active: 'active:text-gray-800 dark:active:text-gray-200',
      focus: 'focus-visible:ring-gray-500',
      hoverText: 'text-gray-700 dark:text-gray-300',
      activeText: 'text-gray-800 dark:text-gray-200',
    },
    success: {
      text: 'text-green-600 dark:text-green-400',
      hover: 'hover:text-green-700 dark:hover:text-green-300',
      active: 'active:text-green-800 dark:active:text-green-200',
      focus: 'focus-visible:ring-green-500',
      hoverText: 'text-green-700 dark:text-green-300',
      activeText: 'text-green-800 dark:text-green-200',
    },
    info: {
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:text-blue-700 dark:hover:text-blue-300',
      active: 'active:text-blue-800 dark:active:text-blue-200',
      focus: 'focus-visible:ring-blue-500',
      hoverText: 'text-blue-700 dark:text-blue-300',
      activeText: 'text-blue-800 dark:text-blue-200',
    },
    warn: {
      text: 'text-amber-600 dark:text-amber-400',
      hover: 'hover:text-warning dark:hover:text-amber-300',
      active: 'active:text-warning dark:active:text-amber-200',
      focus: 'focus-visible:ring-amber-500',
      hoverText: 'text-warning dark:text-amber-300',
      activeText: 'text-warning dark:text-amber-200',
    },
    help: {
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:text-purple-700 dark:hover:text-purple-300',
      active: 'active:text-purple-800 dark:active:text-purple-200',
      focus: 'focus-visible:ring-purple-500',
      hoverText: 'text-purple-700 dark:text-purple-300',
      activeText: 'text-purple-800 dark:text-purple-200',
    },
    danger: {
      text: 'text-red-600 dark:text-red-400',
      hover: 'hover:text-red-700 dark:hover:text-red-300',
      active: 'active:text-red-800 dark:active:text-red-200',
      focus: 'focus-visible:ring-red-500',
      hoverText: 'text-red-700 dark:text-red-300',
      activeText: 'text-red-800 dark:text-red-200',
    },
    plain: {
      text: 'text-muted dark:text-muted',
      hover: 'hover:text-gray-600 dark:hover:text-muted',
      active: 'active:text-gray-700 dark:active:text-gray-300',
      focus: 'focus-visible:ring-gray-500',
      hoverText: 'text-gray-600 dark:text-muted',
      activeText: 'text-gray-700 dark:text-gray-300',
    },
    contrast: {
      text: 'text-default dark:text-white',
      hover: 'hover:text-gray-700 dark:hover:text-gray-200',
      active: 'active:text-gray-800 dark:active:text-gray-300',
      focus: 'focus-visible:ring-gray-400',
      hoverText: 'text-gray-700 dark:text-gray-200',
      activeText: 'text-gray-800 dark:text-gray-300',
    },
  };

  const colors = severityColors[severity];
  
  // Apply state-simulated text colors or regular colors
  if (state === 'hover' && !disabled) {
    classes.push(colors.hoverText);
  } else if (state === 'active' && !disabled) {
    classes.push(colors.activeText);
  } else {
    classes.push(colors.text);
  }
  
  // Focus ring
  if (state === 'focus') {
    classes.push('ring-2', 'ring-offset-2', colors.focus.replace('focus-visible:ring-', 'ring-'));
  } else {
    classes.push(colors.focus);
  }

  // Add hover/active pseudo-classes only if not simulating a state
  if (!disabled && state === 'default') {
    classes.push(colors.hover, colors.active);
  }

  return classes;
}

function getLinkClasses(): string[] {
  const { severity, disabled, state } = props;

  const classes: string[] = [];

  classes.push('bg-transparent', 'rounded-md', 'underline', 'underline-offset-2');

  const severityColors: Record<ButtonSeverity, { 
    text: string; 
    hover: string; 
    active: string; 
    focus: string;
    hoverText: string;
    activeText: string;
  }> = {
    primary: {
      text: 'text-primary-600 dark:text-primary-400',
      hover: 'hover:text-primary-700 dark:hover:text-primary-300',
      active: 'active:text-primary-800 dark:active:text-primary-200',
      focus: 'focus-visible:ring-primary-500',
      hoverText: 'text-primary-700 dark:text-primary-300',
      activeText: 'text-primary-800 dark:text-primary-200',
    },
    secondary: {
      text: 'text-gray-600 dark:text-muted',
      hover: 'hover:text-gray-700 dark:hover:text-gray-300',
      active: 'active:text-gray-800 dark:active:text-gray-200',
      focus: 'focus-visible:ring-gray-500',
      hoverText: 'text-gray-700 dark:text-gray-300',
      activeText: 'text-gray-800 dark:text-gray-200',
    },
    success: {
      text: 'text-green-600 dark:text-green-400',
      hover: 'hover:text-green-700 dark:hover:text-green-300',
      active: 'active:text-green-800 dark:active:text-green-200',
      focus: 'focus-visible:ring-green-500',
      hoverText: 'text-green-700 dark:text-green-300',
      activeText: 'text-green-800 dark:text-green-200',
    },
    info: {
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:text-blue-700 dark:hover:text-blue-300',
      active: 'active:text-blue-800 dark:active:text-blue-200',
      focus: 'focus-visible:ring-blue-500',
      hoverText: 'text-blue-700 dark:text-blue-300',
      activeText: 'text-blue-800 dark:text-blue-200',
    },
    warn: {
      text: 'text-amber-600 dark:text-amber-400',
      hover: 'hover:text-warning dark:hover:text-amber-300',
      active: 'active:text-warning dark:active:text-amber-200',
      focus: 'focus-visible:ring-amber-500',
      hoverText: 'text-warning dark:text-amber-300',
      activeText: 'text-warning dark:text-amber-200',
    },
    help: {
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:text-purple-700 dark:hover:text-purple-300',
      active: 'active:text-purple-800 dark:active:text-purple-200',
      focus: 'focus-visible:ring-purple-500',
      hoverText: 'text-purple-700 dark:text-purple-300',
      activeText: 'text-purple-800 dark:text-purple-200',
    },
    danger: {
      text: 'text-red-600 dark:text-red-400',
      hover: 'hover:text-red-700 dark:hover:text-red-300',
      active: 'active:text-red-800 dark:active:text-red-200',
      focus: 'focus-visible:ring-red-500',
      hoverText: 'text-red-700 dark:text-red-300',
      activeText: 'text-red-800 dark:text-red-200',
    },
    plain: {
      text: 'text-muted dark:text-muted',
      hover: 'hover:text-gray-600 dark:hover:text-muted',
      active: 'active:text-gray-700 dark:active:text-gray-300',
      focus: 'focus-visible:ring-gray-500',
      hoverText: 'text-gray-600 dark:text-muted',
      activeText: 'text-gray-700 dark:text-gray-300',
    },
    contrast: {
      text: 'text-default dark:text-white',
      hover: 'hover:text-gray-700 dark:hover:text-gray-200',
      active: 'active:text-gray-800 dark:active:text-gray-300',
      focus: 'focus-visible:ring-gray-400',
      hoverText: 'text-gray-700 dark:text-gray-200',
      activeText: 'text-gray-800 dark:text-gray-300',
    },
  };

  const colors = severityColors[severity];
  
  // Apply state-simulated text colors or regular colors
  if (state === 'hover' && !disabled) {
    classes.push(colors.hoverText);
  } else if (state === 'active' && !disabled) {
    classes.push(colors.activeText);
  } else {
    classes.push(colors.text);
  }
  
  // Focus ring
  if (state === 'focus') {
    classes.push('ring-2', 'ring-offset-2', colors.focus.replace('focus-visible:ring-', 'ring-'));
  } else {
    classes.push(colors.focus);
  }

  // Add hover/active pseudo-classes only if not simulating a state
  if (!disabled && state === 'default') {
    classes.push(colors.hover, colors.active);
  }

  return classes;
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-label="iconOnly ? 'Button' : undefined"
    :aria-disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Left icon slot -->
    <span
      v-if="!iconOnly && iconPosition === 'left' && $slots['icon-left']"
      class="mr-2 -ml-0.5"
    >
      <slot name="icon-left" />
    </span>

    <!-- Default icon slot (for icon-only buttons) -->
    <slot v-if="iconOnly" name="icon">
      <slot name="icon-left" />
    </slot>

    <!-- Button content -->
    <span v-if="!iconOnly">
      <slot>Button</slot>
    </span>

    <!-- Right icon slot -->
    <span
      v-if="!iconOnly && iconPosition === 'right' && $slots['icon-right']"
      class="ml-2 -mr-0.5"
    >
      <slot name="icon-right" />
    </span>
  </button>
</template>
