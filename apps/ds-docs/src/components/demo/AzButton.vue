<script setup lang="ts">
import { computed } from 'vue';

/**
 * AzButton - Demo Component
 *
 * This is a demonstration component for the playground.
 * In production, this would be imported from @aziontech/components.
 */

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: IconPosition;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  icon: undefined,
  iconPosition: 'left',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}

// Compute classes based on props
const buttonClasses = computed(() => {
  const classes: string[] = [];

  // Base styles
  classes.push('inline-flex', 'font-mono', 'text-xs', 'items-center', 'justify-center', 'font-medium', 'rounded-md', 'transition-colors');

  // Variant styles
  switch (props.variant) {
    case 'primary':
      classes.push('bg-surface', 'text-white', 'hover:bg-[#F3652B]');
      if (props.disabled) classes.push('disabled:bg-primary-300', 'disabled:cursor-not-allowed');
      break;
    case 'secondary':
      classes.push('bg-gray-100', 'text-gray-700', 'border', 'border-default', 'hover:bg-gray-200');
      if (props.disabled) classes.push('disabled:bg-gray-50', 'disabled:text-muted', 'disabled:cursor-not-allowed');
      break;
    case 'destructive':
      classes.push('bg-red-500', 'text-white', 'hover:bg-red-600');
      if (props.disabled) classes.push('disabled:bg-red-300', 'disabled:cursor-not-allowed');
      break;
    case 'ghost':
      classes.push('bg-transparent', 'text-gray-700', 'hover:bg-gray-100');
      if (props.disabled) classes.push('disabled:text-muted', 'disabled:cursor-not-allowed');
      break;
  }

  // Size styles
  switch (props.size) {
    case 'sm':
      classes.push('px-3', 'py-1.5', 'text-sm');
      break;
    case 'md':
      classes.push('px-4', 'py-2', 'text-base');
      break;
    case 'lg':
      classes.push('px-6', 'py-3', 'text-lg');
      break;
  }

  // Full width
  if (props.fullWidth) {
    classes.push('w-full');
  }

  return classes.join(' ');
});
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <i
      v-if="loading"
      class="pi pi-spinner animate-spin -ml-1 mr-2 text-base"
      aria-hidden="true"
    />
    
    <!-- Icon left slot or prop -->
    <span
      v-if="iconPosition === 'left' && (icon || $slots['icon-left'])"
      class="button__icon button__icon--left"
    >
      <slot name="icon-left">
        <span v-if="icon" class="icon-placeholder">{{ icon }}</span>
      </slot>
    </span>
    
    <!-- Button content -->
    <slot>Button</slot>
    
    <!-- Icon right slot or prop -->
    <span
      v-if="iconPosition === 'right' && (icon || $slots['icon-right'])"
      class="button__icon button__icon--right"
    >
      <slot name="icon-right">
        <span v-if="icon" class="icon-placeholder">{{ icon }}</span>
      </slot>
    </span>
  </button>
</template>
