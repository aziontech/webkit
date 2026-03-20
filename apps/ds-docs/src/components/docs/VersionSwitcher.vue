<script setup lang="ts">
/**
 * Version Switcher Component
 *
 * Displays version numbers as inline buttons.
 * Allows users to switch between documentation versions.
 */

import { computed } from 'vue';
import {
  getAllVersions,
  isCurrentVersion,
  getCurrentVersion,
} from '@/config';

interface Props {
  /** Current version */
  currentVersion?: string;
  /** Current section (for URL building) */
  section?: string;
  /** Current page slug (for URL building) */
  slug?: string;
  /** Current language */
  language?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentVersion: () => getCurrentVersion(),
  section: '',
  slug: 'index',
  language: 'en',
});

const emit = defineEmits<{
  (e: 'change', version: string): void;
}>();

// Computed
const versions = computed(() => getAllVersions());

/**
 * Build URL for a version
 * Tries to keep the same page, falls back to section index
 */
function buildVersionUrl(version: string): string {
  const isCurrent = isCurrentVersion(version);
  const isDefaultLang = props.language === 'en';
  
  // For current version with default language, use short URL
  if (isCurrent && isDefaultLang) {
    if (props.slug === 'index') {
      return `/${props.section}`;
    }
    return `/${props.section}/${props.slug}`;
  }
  
  // For other versions or languages, use full URL
  const langPart = isDefaultLang ? '' : `/${props.language}`;
  const slugPart = props.slug === 'index' ? '' : `/${props.slug}`;
  
  return `/${version}${langPart}/${props.section}${slugPart}`;
}

/**
 * Handle version selection
 */
function selectVersion(version: string) {
  if (version !== props.currentVersion) {
    emit('change', version);
    
    // Navigate to the new version
    const url = buildVersionUrl(version);
    window.location.href = url;
  }
}
</script>

<template>
  <div class="inline-flex items-center gap-1">
    <button
      v-for="version in versions"
      :key="version"
      type="button"
      class="h-8 w-8 py-1 px-2 text-muted border border-default bg-layer1 rounded-md hover:bg-layer1-hover text-xs font-medium font-mono cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      @click="selectVersion(version)"
    >
      {{ version }}
    </button>
  </div>
</template>
