<script setup lang="ts">
/**
 * Docs Version Banner Component
 * 
 * Shows a banner when the user is viewing an older version of the documentation.
 * Provides a link to the latest version.
 */

import { computed } from 'vue';
import { isCurrentVersion, getCurrentVersion, getVersionLabel } from '@/config';

interface Props {
  /** Current version being viewed */
  version: string;
  /** Current section (for URL building) */
  section?: string;
  /** Current page slug (for URL building) */
  slug?: string;
  /** Current language */
  language?: string;
}

const props = withDefaults(defineProps<Props>(), {
  section: '',
  slug: 'index',
  language: 'en',
});

// Computed
const isLatest = computed(() => isCurrentVersion(props.version));
const latestVersionLabel = computed(() => getVersionLabel(getCurrentVersion()));

/**
 * Build URL for the latest version
 */
function buildLatestVersionUrl(): string {
  const isDefaultLang = props.language === 'en';
  
  // For default language, use short URL
  if (isDefaultLang) {
    if (props.slug === 'index') {
      return `/${props.section}`;
    }
    return `/${props.section}/${props.slug}`;
  }
  
  // For other languages, include language prefix
  const slugPart = props.slug === 'index' ? '' : `/${props.slug}`;
  return `/${props.language}/${props.section}${slugPart}`;
}

/**
 * Dismiss the banner (could store in localStorage)
 */
function dismissBanner() {
  // Could implement localStorage persistence here
  // For now, just hide via parent component
  emit('dismiss');
}

const emit = defineEmits<{
  (e: 'dismiss'): void;
}>();
</script>

<template>
  <div
    v-if="!isLatest"
    class="flex items-center justify-between gap-4 py-3 px-4 bg-amber-100 border-b border-amber-500"
    role="alert"
  >
    <div class="flex items-start gap-2 flex-1">
      <i class="pi pi-info-circle text-warning shrink-0 mt-0.5 text-base" aria-hidden="true" />
      <p class="m-0 text-sm text-warning leading-relaxed">
        You are viewing an older version of the documentation.
        <a :href="buildLatestVersionUrl()" class="text-warning font-semibold underline underline-offset-2 hover:no-underline focus:outline-2 focus:outline-offset-2 focus:outline-amber-800 focus:rounded">
          View the latest version ({{ latestVersionLabel }})
        </a>
      </p>
    </div>
    <button
      type="button"
      class="flex items-center justify-center w-6 h-6 p-0 bg-transparent border-0 rounded text-warning cursor-pointer transition-colors duration-150 shrink-0 hover:bg-amber-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-800"
      aria-label="Dismiss banner"
      @click="dismissBanner"
    >
      <i class="pi pi-times text-base" aria-hidden="true" />
    </button>
  </div>
</template>
