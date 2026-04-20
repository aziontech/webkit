<script setup lang="ts">
/**
 * DocsSidebarItem
 *
 * Renders a single navigation item in the sidebar.
 */

import { computed } from 'vue';
import { motion } from 'motion-v';
import type { NavItem } from '@/lib/content/types';
import { getDefaultLanguage } from '@/config';

const props = defineProps<{
  /** Navigation item data */
  item: NavItem;
  /** Whether this item is currently active */
  isActive: boolean;
  /** Current language */
  language?: string;
}>();

const currentLanguage = computed(() => props.language || getDefaultLanguage());
const isDefaultLang = computed(() => currentLanguage.value === getDefaultLanguage());

// Build item link with language prefix
const itemLink = computed(() => {
  if (isDefaultLang.value) {
    return props.item.href;
  }
  return `/${currentLanguage.value}${props.item.href}`;
});
</script>

<template>
  <motion.a
    :href="itemLink"
    class="block rounded-md px-3 py-1.5 text-sm text-color font-medium transition-colors border-l-2 border-l-transparent hover:bg-layer2-hover hover:border-l-base"
    :class="[
      isActive ? 'bg-surface' : ''
    ]"
    :aria-current="isActive ? 'page' : undefined"
    :whileHover="{ x: 2 }"
    :transition="{ duration: 0.15 }"
  >
    {{ item.navLabel }}
  </motion.a>
</template>
