<script setup lang="ts">
/**
 * DocsHeader
 *
 * Documentation header component with breadcrumb context,
 * search trigger button, and version switcher.
 *
 * Note: Language switcher has been moved to DocsFooter as part of
 * user preferences section for improved information hierarchy.
 */

import { computed } from 'vue';
import type { Section, NavItem } from '@/lib/content/types';
import { useSearch } from '@/lib/search/use-search';
import VersionSwitcher from './VersionSwitcher.vue';
import { getDefaultLanguage, getCurrentVersion } from '@/config';
import { t } from '@/lib/i18n';

const props = withDefaults(defineProps<{
  /** Current section */
  section?: Section | null;
  /** Current page item */
  item?: NavItem | null;
  /** Current language */
  language?: string;
}>(), {
  language: () => getDefaultLanguage(),
});

const { openSearch } = useSearch();

const isDefaultLang = computed(() => props.language === getDefaultLanguage());

// Build home link with language prefix
const homeLink = computed(() => {
  return isDefaultLang.value ? '/' : `/${props.language}`;
});

// Build section link with language prefix
const sectionLink = computed(() => {
  if (!props.section) return '/';
  if (isDefaultLang.value) {
    return props.section.basePath;
  }
  return `/${props.language}${props.section.basePath}`;
});

// Get translated section label
const sectionLabel = computed(() => {
  if (!props.section) return '';
  const sectionId = props.section.id;
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
  return key ? t(key, props.language) : props.section.label;
});

// Translated "Documentation" text
const documentationText = computed(() => {
  return t('nav.documentation', props.language);
});
</script>

<template>
  <header class="docs-header h-16 sticky top-0 z-10 bg-surface border-b border-default">
    <div class="flex items-center justify-between h-full px-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <ol class="flex items-center gap-2">
          <li>
            <a :href="homeLink" class="text-muted hover:dark:text-white hover:text-black transition-colors">
              {{ documentationText }}
            </a>
          </li>
          <li v-if="section" class="flex items-center gap-2">
            <span class="text-muted" aria-hidden="true">/</span>
            <a
              :href="sectionLink"
              class="text-black dark:text-white hover:text-black dark:hover:text-white transition-colors"
              :aria-current="item && !item.isIndex ? undefined : 'page'"
            >
              {{ sectionLabel }}
            </a>
          </li>
          <li v-if="item && !item.isIndex" class="flex items-center gap-2">
            <span class="text-muted" aria-hidden="true">/</span>
            <span class="dark:text-white text-black" aria-current="page">
              {{ item.navLabel }}
            </span>
          </li>
        </ol>
      </nav>
      
      <!-- Header actions -->
      <div class="flex items-center justify-end gap-2.5 min-w-[340px]">
        <!-- Search button -->
        <button 
          class="flex w-full max-w-sm items-center gap-2 px-3 py-1.5 text-sm text-muted border border-default bg-layer1 rounded-md hover:bg-layer1-hover transition-colors"
          aria-label="Search documentation"
          @click="openSearch"
        >
          <i class="pi pi-search text-sm" aria-hidden="true" />
          <span class="hidden sm:inline w-full text-left">Search</span>
          <kbd class="hidden sm:inline-flex px-1.5 py-0.5 text-xs text-black dark:text-white bg-surface border border-default rounded font-sans">⌘+K</kbd>
        </button>
        
        <!-- Version switcher -->
        <VersionSwitcher
          :current-version="getCurrentVersion()"
          :section="section?.id"
          :slug="item?.slug"
          :language="language"
        />
      </div>
    </div>
  </header>
</template>
