<script setup lang="ts">
/**
 * DocsFooter
 *
 * Documentation footer component with user preferences section.
 * Contains Language Switcher and Theme Switcher grouped as preferences.
 * Also includes social links and copyright.
 */

import { computed } from 'vue';
import LanguageSwitcher from './LanguageSwitcher.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';
import { getDefaultLanguage } from '@/config';
import { t } from '@/lib/i18n';

interface Props {
  /** Current language */
  language?: string;
  /** Last updated date (optional) */
  lastUpdated?: string;
}

const props = withDefaults(defineProps<Props>(), {
  language: () => getDefaultLanguage(),
});

// Translated labels
const preferencesLabel = computed(() => t('footer.preferences', props.language));
const languageLabel = computed(() => t('footer.language', props.language));
const themeLabel = computed(() => t('footer.theme', props.language));
const copyrightText = computed(() => t('footer.copyright', props.language));
const lastUpdatedLabel = computed(() => t('footer.lastUpdated', props.language));

// Current year for copyright
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="mt-auto border-t border-default bg-layer1">
    <div class="px-6 py-6">
      <!-- Footer Bottom -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div class="flex flex-row gap-4">
          <!-- Preferences Section -->
          <div class="flex flex-col gap-3">
            <div class="flex gap-3">
              <div class="flex flex-col gap-1.5">
                <LanguageSwitcher :current-language="language" />
              </div>
              <div class="flex flex-col gap-1.5">
                <ThemeSwitcher />
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/aziontech/webkit"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center p-1 text-muted hover:text-default transition-colors"
              aria-label="View on GitHub"
            >
              <i class="pi pi-github text-lg" aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com/aziontech"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center p-1 text-muted hover:text-default transition-colors"
              aria-label="Follow on Twitter"
            >
              <i class="pi pi-twitter text-lg" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/company/aziontech"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center p-1 text-muted hover:text-default transition-colors"
              aria-label="Follow on LinkedIn"
            >
              <i class="pi pi-linkedin text-lg" aria-hidden="true" />
            </a>
          </div>
        </div>

        <!-- Last Updated (optional) -->
        <div v-if="lastUpdated" class="text-xs text-muted">
          {{ lastUpdatedLabel }}: {{ lastUpdated }}
        </div>

        <!-- Copyright -->
        <div class="text-xs text-text-foreground font-mono">
          © {{ currentYear }} {{ copyrightText }}
        </div>
      </div>
    </div>
  </footer>
</template>
