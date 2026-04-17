<script setup lang="ts">
/**
 * DocsSidebarSection
 *
 * Renders a single navigation section with its items.
 * Supports collapsible groups and active state highlighting.
 */

import { computed } from 'vue';
import type { NavSection, NavItem } from '@/lib/content/types';
import DocsSidebarItem from './DocsSidebarItem.vue';
import { getDefaultLanguage } from '@/config';
import { t } from '@/lib/i18n';

const props = defineProps<{
  /** Navigation section data */
  section: NavSection;
  /** Whether this section is currently active */
  isActive: boolean;
  /** Current URL path */
  currentPath: string;
  /** Current language */
  language?: string;
}>();

const currentLanguage = computed(() => props.language || getDefaultLanguage());
const isDefaultLang = computed(() => currentLanguage.value === getDefaultLanguage());

// Filter out index pages from sidebar listing (they're accessible via section link)
const visibleItems = computed(() => {
  return props.section.items.filter((item) => !item.isIndex);
});

// Build section link with language prefix
const sectionLink = computed(() => {
  const basePath = props.section.section.basePath;
  if (isDefaultLang.value) {
    return basePath;
  }
  return `/${currentLanguage.value}${basePath}`;
});

// Get translated section label
const sectionLabel = computed(() => {
  const sectionId = props.section.section.id;
  // Map section IDs to i18n keys
  const keyMap: Record<string, string> = {
    'get-started': 'nav.getStarted',
    'foundations': 'nav.foundations',
    'tokens': 'nav.tokens',
    'components': 'nav.components',
    'blocks': 'nav.blocks',
    'patterns': 'nav.patterns',
    'templates': 'nav.templates',
    'icons': 'nav.icons',
  };
  const key = keyMap[sectionId];
  return key ? t(key, currentLanguage.value) : props.section.section.label;
});

// Check if current path matches item href (with language prefix handling)
function isItemActive(item: NavItem): boolean {
  // Strip language prefix from current path for comparison
  const pathForMatch = props.currentPath.replace(/^\/(pt|en)/, '') || '/';
  return pathForMatch === item.href;
}
</script>

<template>
  <div class="mb-1">
    <!-- Section Link -->
    <a
      :href="sectionLink"
      class="section-link font-medium rounded-md block px-3 py-2 text-sm transition-colors"
      :class="[
        isActive
          ? 'bg-layer2 text-default font-medium'
          : 'hover:bg-layer2-hover text-default'
      ]"
    >
      {{ sectionLabel }}
    </a>
    
    <!-- Section Items (only show when section is active) -->
    <div v-if="isActive && visibleItems.length > 0" class="mt-1 ml-3 space-y-0.5 pl-3">
      <DocsSidebarItem
        v-for="item in visibleItems"
        :key="item.href"
        :item="item"
        :is-active="isItemActive(item)"
        :language="currentLanguage"
      />
    </div>
  </div>
</template>
