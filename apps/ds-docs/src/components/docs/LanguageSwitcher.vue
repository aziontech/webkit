<script setup lang="ts">
/**
 * Language Switcher Component
 *
 * Allows users to switch between documentation languages.
 * Maintains the current page when possible, falls back to English if translation doesn't exist.
 */

import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import {
  getAllLanguages,
  getLanguageLabel,
  isDefaultLanguage,
  getDefaultLanguage,
} from '@/config';
import { useDropdownPosition } from '@/composables/useDropdownPosition';

interface Props {
  /** Current language */
  currentLanguage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentLanguage: () => getDefaultLanguage(),
});

const emit = defineEmits<{
  (e: 'change', language: string): void;
}>();

// State
const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

// Dropdown positioning
const { position, dropdownClasses, updatePosition } = useDropdownPosition(
  triggerRef,
  dropdownRef,
  {
    defaultPosition: 'bottom-end',
    estimatedHeight: 150,
  }
);

// Computed
const languages = computed(() => getAllLanguages());

const currentLanguageLabel = computed(() => {
  return getLanguageLabel(props.currentLanguage);
});

/**
 * Build URL for a language by manipulating the current URL
 */
function buildLanguageUrl(language: string): string {
  const currentPath = window.location.pathname;
  const isDefault = isDefaultLanguage(language);
  
  // Check if current path starts with a language prefix
  const langPrefixMatch = currentPath.match(/^\/(pt|en)(\/.*)?$/);
  
  let pathWithoutLang: string;
  if (langPrefixMatch) {
    // Remove the language prefix from the current path
    pathWithoutLang = langPrefixMatch[2] || '/';
  } else {
    // Current path has no language prefix (it's in English)
    pathWithoutLang = currentPath;
  }
  
  // Build the new URL
  if (isDefault) {
    // Default language (English) - no prefix
    return pathWithoutLang || '/';
  } else {
    // Other languages - add language prefix
    return `/${language}${pathWithoutLang}`;
  }
}

/**
 * Handle language selection
 */
function selectLanguage(language: string) {
  if (language !== props.currentLanguage) {
    emit('change', language);
    
    // Navigate to the new language version
    const url = buildLanguageUrl(language);
    window.location.href = url;
  }
  
  isOpen.value = false;
}

/**
 * Toggle dropdown
 */
function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    // Update position when opening
    nextTick(() => {
      updatePosition();
    });
  }
}

/**
 * Close dropdown when clicking outside
 */
function handleClickOutside(event: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.contains(event.target as Node)) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      isOpen.value = false;
    }
  }
}

/**
 * Handle escape key
 */
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
    triggerRef.value?.focus();
  }
}

// Add event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <div class="relative inline-flex font-mono text-xs" ref="triggerRef">
    <button
      type="button"
      class="inline-flex items-center gap-2 py-1.5 px-3 font-medium text-black dark:text-white bg-surface border border-default rounded-md cursor-pointer transition-all duration-150 hover:bg-layer1-hover hover:border-default focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="`Current language: ${currentLanguageLabel}. Change language.`"
      @click="toggleDropdown"
    >
      <i class="pi pi-globe"/>
      <span class="font-medium">{{ currentLanguageLabel }}</span>
      <i class="pi pi-angle-down"/>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute min-w-40 text-xs bg-surface border border-default rounded-md shadow-lg z-50 overflow-hidden language-switcher__dropdown"
        :class="dropdownClasses"
        role="listbox"
        :aria-label="'Select language'"
      >
        <button
          v-for="language in languages"
          :key="language"
          type="button"
          class="flex items-center gap-2 w-full py-2 px-3 text-xs bg-transparent border-0 text-black dark:text-white cursor-pointer transition-colors duration-150 text-left hover:bg-layer1-hover focus:outline-none focus:bg-layer1-hover"
          :class="{ 'font-medium': language === currentLanguage }"
          role="option"
          :aria-selected="language === currentLanguage"
          @click="selectLanguage(language)"
        >
          <span class="flex-1">{{ getLanguageLabel(language) }}</span>
          <i class="pi pi-check text-black dark:text-white shrink-0" v-if="language === currentLanguage"/>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.language-switcher__dropdown.dropdown--below { top: calc(100% + 0.25rem); }
.language-switcher__dropdown.dropdown--above { bottom: calc(100% + 0.25rem); }
.language-switcher__dropdown.dropdown--align-start { left: 0; }
.language-switcher__dropdown.dropdown--align-end { right: 0; }
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-0.25rem); }
</style>
