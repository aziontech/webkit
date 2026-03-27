<script setup lang="ts">
/**
 * Tabs Component
 * 
 * A reusable tabs component for switching between different content views.
 * Used in the Components page to switch between Overview and Status tabs.
 * 
 * Features:
 * - Keyboard navigation (arrow keys, home, end)
 * - Accessible with proper ARIA attributes
 * - URL hash sync for deep linking
 * - Focus management
 */

import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface Props {
  tabs: Tab[];
  /** Initial active tab ID */
  defaultTab?: string;
  /** Sync active tab with URL hash */
  syncHash?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultTab: undefined,
  syncHash: true,
});

const emit = defineEmits<{
  (e: 'change', tabId: string): void;
}>();

// Active tab state
const activeTab = ref<string>(props.defaultTab || props.tabs[0]?.id || '');

// Tab button refs for keyboard navigation
const tabRefs = ref<HTMLButtonElement[]>([]);

/**
 * Set the active tab
 */
function setActiveTab(tabId: string, focus = true) {
  if (activeTab.value !== tabId) {
    activeTab.value = tabId;
    emit('change', tabId);
    
    // Update URL hash if enabled
    if (props.syncHash) {
      history.replaceState(null, '', `#${tabId}`);
    }
  }
  
  // Focus the tab button
  if (focus) {
    const index = props.tabs.findIndex(t => t.id === tabId);
    if (index >= 0 && tabRefs.value[index]) {
      tabRefs.value[index].focus();
    }
  }
}

/**
 * Handle keyboard navigation
 */
function handleKeydown(event: KeyboardEvent, currentIndex: number) {
  const tabsCount = props.tabs.length;
  let newIndex: number | null = null;
  
  switch (event.key) {
    case 'ArrowLeft':
      newIndex = currentIndex === 0 ? tabsCount - 1 : currentIndex - 1;
      break;
    case 'ArrowRight':
      newIndex = currentIndex === tabsCount - 1 ? 0 : currentIndex + 1;
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = tabsCount - 1;
      break;
    default:
      return;
  }
  
  if (newIndex !== null) {
    event.preventDefault();
    setActiveTab(props.tabs[newIndex].id);
  }
}

/**
 * Parse URL hash to get initial tab
 */
function getTabFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash.slice(1);
  if (hash && props.tabs.some(t => t.id === hash)) {
    return hash;
  }
  return null;
}

// Initialize from URL hash or default
onMounted(() => {
  const hashTab = getTabFromHash();
  if (hashTab) {
    activeTab.value = hashTab;
  }
  
  // Listen for hash changes
  if (props.syncHash) {
    window.addEventListener('hashchange', () => {
      const newTab = getTabFromHash();
      if (newTab && newTab !== activeTab.value) {
        setActiveTab(newTab, false);
      }
    });
  }
});

onUnmounted(() => {
  if (props.syncHash) {
    window.removeEventListener('hashchange', () => {});
  }
});

// Expose active tab for slot content
defineExpose({ activeTab });
</script>

<template>
  <div class="tabs-container">
    <!-- Tab List -->
    <div 
      role="tablist" 
      class="flex border-b border-default mb-6"
      aria-label="Content sections"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :ref="el => { if (el) tabRefs[index] = el as HTMLButtonElement }"
        :id="`tab-${tab.id}`"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        @click="setActiveTab(tab.id)"
        @keydown="handleKeydown($event, index)"
        :class="[
          'px-4 py-2.5 !text-sm font-medium border-b-2 transition-colors',
          activeTab === tab.id
            ? 'border-default text-default'
            : 'border-transparent text-muted hover:text-default hover:border-default'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- Tab Panels -->
    <div class="tab-panels">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :id="`panel-${tab.id}`"
        role="tabpanel"
        :aria-labelledby="`tab-${tab.id}`"
        :hidden="activeTab !== tab.id"
        :tabindex="activeTab === tab.id ? 0 : undefined"
      >
        <slot :name="tab.id" :active="activeTab === tab.id" />
      </div>
    </div>
  </div>
</template>
