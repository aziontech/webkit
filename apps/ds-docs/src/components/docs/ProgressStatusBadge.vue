<script setup lang="ts">
/**
 * ProgressStatusBadge Component
 * 
 * Displays progress status with appropriate styling for design/code tracking.
 * Used in the Components Status table to show design and code progress.
 * 
 * Unlike StatusBadge (which shows component stability: stable, beta, etc.),
 * this badge shows progress status: done, documenting, queued, etc.
 */

import type { ProgressStatus } from '../../data/component-status';
import { PROGRESS_STATUS_CONFIG } from '../../data/component-status';

interface Props {
  status: ProgressStatus;
  /** Whether to show a compact version without background */
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
});

const config = PROGRESS_STATUS_CONFIG[props.status];

/**
 * Map semantic class to Tailwind classes
 * Using subtle, enterprise-appropriate colors
 */
const semanticStyles: Record<string, { bg: string; text: string; border: string }> = {
  success: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-warning',
    border: 'border-amber-200',
  },
  accent: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  neutral: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-default',
  },
};

const styles = semanticStyles[config.semanticClass];
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border',
      styles.bg,
      styles.text,
      styles.border,
    ]"
    :title="config.description"
  >
    {{ config.label }}
  </span>
</template>
