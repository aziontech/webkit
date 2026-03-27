<script setup lang="ts">
/**
 * DocsSidebar
 *
 * Main sidebar navigation component.
 * Renders all primary sections with their navigation items.
 */

import { computed } from 'vue';
import type { NavigationTree, NavItem, NavSection } from '@/lib/content/types';
import DocsSidebarSection from './DocsSidebarSection.vue';
import { getDefaultLanguage } from '@/config';
import { t } from '@/lib/i18n';

const props = defineProps<{
  /** Full navigation tree */
  navigation: NavigationTree;
  /** Current URL path */
  currentPath: string;
  /** Current language */
  language?: string;
}>();

const currentLanguage = computed(() => props.language || getDefaultLanguage());
const isDefaultLang = computed(() => currentLanguage.value === getDefaultLanguage());

// Compute active section - strip language prefix for matching
const pathForMatching = computed(() => {
  const langPrefixMatch = props.currentPath.match(/^\/(pt|en)(\/.*)?$/);
  if (langPrefixMatch) {
    return langPrefixMatch[2] || '/';
  }
  return props.currentPath;
});

// Compute active section
const activeSectionId = computed(() => {
  for (const section of props.navigation) {
    if (pathForMatching.value.startsWith(section.section.basePath)) {
      return section.section.id;
    }
  }
  return null;
});

// Compute home link with language prefix
const homeLink = computed(() => {
  return isDefaultLang.value ? '/' : `/${currentLanguage.value}`;
});

// Translated brand name
const brandName = computed(() => {
  return t('brand.name', currentLanguage.value);
});
</script>

<template>
  <aside class="shrink-0 w-64 h-screen border-r border-default sticky top-0 overflow-y-auto bg-surface [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(0,0,0,0.2)_transparent]">
    <div class="p-4">
      <!-- Logo/Brand -->
      <div class="mb-6 mt-1">
        <a :href="homeLink" class="flex items-center gap-2 text-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="93" height="18" fill="none" viewBox="0 0 93 18">
            <path fill="#F3652B" fill-rule="evenodd" d="M18.744 0 .504 15.357 0 18h2.628l14.13-11.89L14.48 18h3.447l3.448-18h-2.631Zm6.078 0-.651 3.4h11.905L21.885 15.35l-.51 2.65h17.927l.652-3.401H28.049L42.243 2.647 42.75 0H24.822Zm21.303 0L42.75 18h3.374L49.5 0h-3.375Zm6.822 0L49.5 18h17.927l3.447-18H52.947Zm2.8 3.4h11.02l-2.145 11.2h-11.02l2.146-11.2ZM88.802 0l-1.53 7.985 2.785 3.461L92.249 0h-3.447Zm-14.48 0-3.448 18h3.45l2.362-12.34L86.646 18h2.156l.426-2.204L76.478 0h-2.156Z" clip-rule="evenodd"/>
          </svg>
          <span class="dark:text-muted text-muted text-sm italic leading-none -ml-1 -mb-1">{{ brandName }}</span>
        </a>
      </div>
      
      <!-- Navigation -->
      <nav class="space-y-1">
        <DocsSidebarSection
          v-for="navSection in navigation"
          :key="navSection.section.id"
          :section="navSection"
          :is-active="activeSectionId === navSection.section.id"
          :current-path="currentPath"
          :language="currentLanguage"
        />
      </nav>
    </div>
  </aside>
</template>
