/**
 * Search Composable
 * 
 * Global search state management using Vue composables.
 * This allows the search modal to be controlled from anywhere in the app.
 */

import { ref, readonly } from 'vue';

// Global state
const isOpen = ref(false);
const searchQuery = ref('');

// Global functions (defined at module level for immediate availability)
function openSearch() {
  isOpen.value = true;
}

function closeSearch() {
  isOpen.value = false;
  searchQuery.value = '';
}

function toggleSearch() {
  if (isOpen.value) {
    closeSearch();
  } else {
    openSearch();
  }
}

// Register event listener at module load time (not in onMounted)
// This ensures the listener is active before any user interaction
if (typeof document !== 'undefined') {
  document.addEventListener('toggle-search', toggleSearch);
}

/**
 * Composable for managing global search state
 */
export function useSearch() {
  return {
    isOpen: readonly(isOpen),
    searchQuery: readonly(searchQuery),
    openSearch,
    closeSearch,
    toggleSearch,
  };
}
