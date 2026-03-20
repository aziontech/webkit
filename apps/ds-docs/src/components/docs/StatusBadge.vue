<script setup lang="ts">
/**
 * StatusBadge Component
 * 
 * Displays component status with appropriate styling.
 * Used to indicate the stability and maturity of components.
 */

type Status = 'stable' | 'beta' | 'deprecated' | 'planned' | 'experimental';

interface Props {
  status: Status;
}

const props = defineProps<Props>();

const statusConfig: Record<Status, { label: string; class: string; icon: string }> = {
  stable: {
    label: 'Stable',
    class: 'bg-green-500/20 text-green-600 border-green-500/50',
    icon: '✓',
  },
  beta: {
    label: 'Beta',
    class: 'bg-blue-500/20 text-blue-600 border-blue-500/50',
    icon: 'β',
  },
  deprecated: {
    label: 'Deprecated',
    class: 'bg-yellow-500/20 text-yello-600 border-yellow-500/50',
    icon: '⚠',
  },
  planned: {
    label: 'Planned',
    class: 'bg-gray-500/20 text-gray-600 border-gray-500/50',
    icon: '○',
  },
  experimental: {
    label: 'Experimental',
    class: 'bg-purple-500/20 text-purple-600 border-purple-500/50',
    icon: '⚗',
  },
};

const config = statusConfig[props.status];
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border',
      config.class,
    ]"
  >
    <span class="text-sm">{{ config.icon }}</span>
    <span class="font-mono">{{ config.label }}</span>
  </span>
</template>
