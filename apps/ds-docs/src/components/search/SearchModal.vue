<script setup lang="ts">
/**
 * SearchModal
 *
 * Full-featured search modal with keyboard navigation,
 * result highlighting, and category grouping.
 *
 * Uses global state from useSearch composable.
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { motion, AnimatePresence } from 'motion-v';
import type { SearchResult, SearchContentType } from '@/lib/search/types';
import { TYPE_LABELS, SECTION_LABELS } from '@/lib/search/types';
import { initSearchEngine } from '@/lib/search';
import { useSearch } from '@/lib/search/use-search';
import { t } from '@/lib/i18n';
import { getDefaultLanguage } from '@/config';

const { isOpen, closeSearch } = useSearch();

// Get current language from URL
const currentLanguage = computed(() => {
  if (typeof window === 'undefined') return getDefaultLanguage();
  const path = window.location.pathname;
  const langMatch = path.match(/^\/(pt|en)/);
  return langMatch ? langMatch[1] : getDefaultLanguage();
});

// Translated strings
const placeholderText = computed(() => t('search.placeholder', currentLanguage.value));
const noResultsText = computed(() => t('search.noResults', currentLanguage.value));
const startTypingText = computed(() => t('search.startTyping', currentLanguage.value));

// State
const query = ref('');
const results = ref<SearchResult[]>([]);
const loading = ref(false);
const selectedIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

// Computed
const groupedResults = computed(() => {
  const groups = new Map<SearchContentType, SearchResult[]>();
  
  for (const result of results.value) {
    const type = result.entry.type;
    if (!groups.has(type)) {
      groups.set(type, []);
    }
    groups.get(type)!.push(result);
  }
  
  return groups;
});

const groupedResultsArray = computed(() => {
  return Array.from(groupedResults.value.entries());
});

const flatResults = computed(() => {
  const flat: { result: SearchResult; globalIndex: number }[] = [];
  let globalIndex = 0;
  
  groupedResultsArray.value.forEach(([type, typeResults]) => {
    for (const result of typeResults) {
      flat.push({ result, globalIndex });
      globalIndex++;
    }
  });
  
  return flat;
});

const hasResults = computed(() => results.value.length > 0);

// Methods
async function performSearch() {
  if (!query.value.trim()) {
    results.value = [];
    return;
  }
  
  loading.value = true;
  
  try {
    const engine = await initSearchEngine();
    results.value = engine.search(query.value, {
      limit: 30,
      language: currentLanguage.value,
    });
    selectedIndex.value = 0;
  } catch (error) {
    console.error('Search failed:', error);
    results.value = [];
  } finally {
    loading.value = false;
  }
}

function selectResult(result: SearchResult) {
  window.location.href = result.entry.url;
  closeSearch();
}

function selectSelected() {
  const selected = flatResults.value.find(r => r.globalIndex === selectedIndex.value);
  if (selected) {
    selectResult(selected.result);
  }
}

function moveUp() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
    scrollToSelected();
  }
}

function moveDown() {
  if (selectedIndex.value < flatResults.value.length - 1) {
    selectedIndex.value++;
    scrollToSelected();
  }
}

function scrollToSelected() {
  const element = document.querySelector(`[data-index="${selectedIndex.value}"]`);
  element?.scrollIntoView({ block: 'nearest' });
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return;
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      moveDown();
      break;
    case 'ArrowUp':
      event.preventDefault();
      moveUp();
      break;
    case 'Enter':
      event.preventDefault();
      selectSelected();
      break;
    case 'Escape':
      closeSearch();
      break;
  }
}

// Watch for query changes
let debounceTimer: ReturnType<typeof setTimeout>;
watch(query, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(performSearch, 150);
});

// Watch for modal open
watch(isOpen, (open) => {
  if (open) {
    setTimeout(() => {
      inputRef.value?.focus();
    }, 50);
  } else {
    query.value = '';
    results.value = [];
    selectedIndex.value = 0;
  }
});

// Keyboard event handling
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="isOpen"
      key="search-root"
      class="fixed inset-0 z-50 overflow-y-auto"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: 0.15 }"
    >
      <!-- Backdrop -->
      <motion.div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.15 }"
        @click="closeSearch"
      />

      <!-- Modal -->
      <div
        class="relative min-h-screen flex items-start justify-center p-4 pt-[15vh]"
        @click="closeSearch"
      >
        <motion.div
          class="w-full max-w-2xl bg-surface rounded-xl shadow-2xl overflow-hidden border border-default"
          :initial="{ opacity: 0, scale: 0.98, y: -8 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.98, y: -8 }"
          :transition="{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }"
          @keydown="handleKeydown"
          @click.stop
        >
        <!-- Search Input -->
        <div class="relative border-b border-default">
          <i class="pi pi-search text-sm absolute left-4 top-[48%] -translate-y-1/2 text-muted" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="placeholderText"
            class="w-full pl-10 text-sm pr-4 py-4 leading-none border-0 focus:outline-none focus:ring-0 text-default bg-surface"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
          />
          <kbd
            v-if="query"
            class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-muted bg-surface rounded"
          >
            ESC
          </kbd>
        </div>
        
        <!-- Results -->
        <div class="max-h-[60vh] overflow-y-auto">
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex items-center justify-center py-12"
          >
            <div class="w-6 h-6 border-2 border-default border-t-transparent rounded-full animate-spin" />
          </div>
          
          <!-- Empty State -->
          <div
            v-else-if="query && !hasResults"
            class="px-4 py-12 text-center text-xs"
          >
            <p class="text-muted">{{ noResultsText.replace('{query}', query) }}</p>
          </div>
          
          <!-- Initial State -->
          <div
            v-else-if="!query"
            class="px-4 py-8 text-center text-xs"
          >
            <p class="text-muted">{{ startTypingText }}</p>
          </div>
          
          <!-- Results List -->
          <template v-else>
            <template v-for="[type, typeResults] in groupedResultsArray" :key="type">
              <!-- Category Header -->
              <div class="px-4 py-2 text-xs font-medium text-muted uppercase tracking-wider bg-layer1">
                {{ TYPE_LABELS[type] || type }}
              </div>
              
              <!-- Result Items -->
              <button
                v-for="result in typeResults"
                :key="result.entry.id"
                :data-index="flatResults.find(r => r.result === result)?.globalIndex"
                class="w-full px-4 py-3 text-left hover:bg-layer1-hover focus:bg-layer1-hover focus:outline-none transition-colors"
                :class="{
                  'bg-layer1': selectedIndex === flatResults.find(r => r.result === result)?.globalIndex,
                }"
                @click="selectResult(result)"
              >
                <div class="flex items-start gap-3">
                  <!-- Type Icon -->
                  <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-layer2 flex items-center justify-center mt-0.5">
                    <i class="pi pi-box text-base text-muted" aria-hidden="true" />
                  </div>
                  
                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <h4
                        class="text-sm font-medium text-default"
                        v-html="result.highlightedTitle"
                      />
                      <span
                        v-if="result.entry.status"
                        class="px-1.5 py-0.5 text-xs rounded"
                        :class="{
                          'bg-green-500/20 text-green-700': result.entry.status === 'stable',
                          'bg-blue-500/20 text-blue-700': result.entry.status === 'beta',
                          'bg-yellow-500/20 text-yellow-700': result.entry.status === 'deprecated',
                          'bg-gray-500/20 text-gray-700': result.entry.status === 'planned',
                          'bg-purple-500/20 text-purple-700': result.entry.status === 'experimental',
                        }"
                      >
                        {{ result.entry.status }}
                      </span>
                    </div>
                    <p
                      v-if="result.highlightedDescription"
                      class="mt-1 text-sm text-muted line-clamp-2"
                      v-html="result.highlightedDescription"
                    />
                    <div class="mt-1 flex items-center gap-2 text-xs text-muted">
                      <span>{{ SECTION_LABELS[result.entry.section] || result.entry.section }}</span>
                      <span v-if="result.entry.category">• {{ result.entry.category }}</span>
                    </div>
                  </div>
                </div>
              </button>
            </template>
          </template>
        </div>
        
        <!-- Footer -->
        <div class="px-4 py-3 border-t border-default bg-surface flex items-center justify-between text-xs text-muted">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-surface rounded border border-default">↑</kbd>
              <kbd class="px-1.5 py-0.5 bg-surface rounded border border-default">↓</kbd>
              to navigate
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-surface rounded border border-default">↵</kbd>
              to select
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-surface rounded border border-default">esc</kbd>
              to close
            </span>
          </div>
          <span v-if="hasResults">{{ results.length }} results</span>
        </div>
        </motion.div>
      </div>
    </motion.div>
  </AnimatePresence>
</template>

<style scoped>
/* Highlight styling */
:deep(.search-highlight) {
  background-color: theme('colors.yellow.200');
  padding: 0;
  border-radius: 2px;
}

/* Line clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
