<script setup lang="ts">
/**
 * Theme Switcher Component
 *
 * Allows users to switch between documentation themes.
 * Persists preference using localStorage.
 * Supports Light, Dark, and System (auto) modes.
 */

import { ref, onMounted, computed, nextTick } from 'vue';
import { useDropdownPosition } from '@/composables/useDropdownPosition';

type Theme = 'light' | 'dark' | 'system';

interface Props {
  /** Current theme (defaults to system) */
  currentTheme?: Theme;
}

const props = withDefaults(defineProps<Props>(), {
  currentTheme: 'system',
});

const emit = defineEmits<{
  (e: 'change', theme: Theme): void;
}>();

// State
const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const selectedTheme = ref<Theme>(props.currentTheme);

// Dropdown positioning
const { position, dropdownClasses, updatePosition } = useDropdownPosition(
  triggerRef,
  dropdownRef,
  {
    defaultPosition: 'bottom-start',
    estimatedHeight: 150,
  }
);

// Theme options
const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'desktop' },
];

// Computed
const currentThemeLabel = computed(() => {
  const theme = themes.find((t) => t.value === selectedTheme.value);
  return theme?.label ?? 'System';
});

/**
 * Apply theme to document.
 * Keeps Tailwind dark: utilities (.dark) and Azion PrimeVue theme vars (azion-light/azion-dark) in sync.
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  let isDark = false;

  if (theme === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = theme === 'dark';
  }

  root.classList.toggle('dark', isDark);
  root.classList.toggle('azion-dark', isDark);
  root.classList.toggle('azion-light', !isDark);
}

/**
 * Handle theme selection
 */
function selectTheme(theme: Theme) {
  if (theme !== selectedTheme.value) {
    selectedTheme.value = theme;
    emit('change', theme);

    // Persist to localStorage
    localStorage.setItem('docs-theme', theme);

    // Apply the theme
    applyTheme(theme);
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

/**
 * Listen for system theme changes
 */
function handleSystemThemeChange(event: MediaQueryListEvent) {
  if (selectedTheme.value === 'system') {
    document.documentElement.classList.toggle('dark', event.matches);
  }
}

// Initialize on mount
onMounted(() => {
  // Load saved preference
  const savedTheme = localStorage.getItem('docs-theme') as Theme | null;
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    selectedTheme.value = savedTheme;
  }

  // Apply initial theme
  applyTheme(selectedTheme.value);

  // Add click outside listener
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscape);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleSystemThemeChange);
});
</script>

<template>
  <div class="relative inline-flex font-mono" ref="triggerRef">
    <button
      type="button"
      class="inline-flex items-center gap-2 py-1.5 px-3 min-w-[114px] text-xs font-medium text-black dark:text-white bg-surface border border-default rounded-md cursor-pointer transition-all duration-150 hover:bg-layer1-hover"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="`Current theme: ${currentThemeLabel}. Change theme.`"
      @click="toggleDropdown"
    >
      <div class="flex gap-1.5 items-center">
        <i class="pi pi-sun" v-if="selectedTheme === 'light'" />
        <i class="pi pi-moon" v-if="selectedTheme === 'dark'" />
        <i class="pi pi-desktop" v-if="selectedTheme === 'system'" />
        <span class="font-medium">{{ currentThemeLabel }}</span>
      </div>
      <i
        class="pi pi-angle-down text-muted transition-transform duration-150"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute min-w-32 text-xs bg-surface border border-default rounded-md shadow-lg z-50 overflow-hidden theme-switcher__dropdown"
        :class="dropdownClasses"
        role="listbox"
        aria-label="Select theme"
      >
        <button
          v-for="theme in themes"
          :key="theme.value"
          type="button"
          class="flex items-center gap-2 w-full py-2 px-3 bg-transparent border-0 text-black dark:text-white cursor-pointer transition-colors duration-150 text-left hover:bg-layer1-hover focus:outline-none focus:bg-layer1-hover"
          :class="{ 'font-medium': theme.value === selectedTheme }"
          role="option"
          :aria-selected="theme.value === selectedTheme"
          @click="selectTheme(theme.value)"
        >
          <i class="pi pi-sun" v-if="theme.icon === 'sun'" />
          <i class="pi pi-moon" v-else-if="theme.icon === 'moon'" />
          <i class="pi pi-desktop" v-else-if="theme.icon === 'desktop'" />
          <span class="flex-1">{{ theme.label }}</span>
          <i class="pi pi-check text-black dark:text-white shrink-0" v-if="theme.value === selectedTheme" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Positioning from useDropdownPosition composable */
.theme-switcher__dropdown.dropdown--below { top: calc(100% + 0.25rem); }
.theme-switcher__dropdown.dropdown--above { bottom: calc(100% + 0.25rem); }
.theme-switcher__dropdown.dropdown--align-start { left: 0; }
.theme-switcher__dropdown.dropdown--align-end { right: 0; }
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-0.25rem); }
</style>
