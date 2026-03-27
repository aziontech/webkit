<script setup lang="ts">
import { ref, computed, watch, onMounted, shallowRef } from 'vue';
import type { GeneratedCode } from './types';
import { codeToHtml } from 'shiki';

/**
 * PlaygroundCode
 * 
 * Displays the generated code snippet with syntax highlighting
 * and copy-to-clipboard functionality.
 */

interface Props {
  code: GeneratedCode;
  showCopy?: boolean;
  initiallyExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCopy: true,
  initiallyExpanded: true,
});

const emit = defineEmits<{
  copy: [code: string];
}>();

const isExpanded = ref(props.initiallyExpanded);
const isCopied = ref(false);
const highlightedHtml = shallowRef<string>('');
const isLoading = ref(true);

// Format code for display
const formattedCode = computed(() => props.code.code);

// Highlight code using Shiki
async function highlightCode(code: string) {
  const wasEmpty = !highlightedHtml.value;
  if (wasEmpty) {
    isLoading.value = true;
  }
  try {
    const html = await codeToHtml(code, {
      lang: 'vue',
      theme: 'github-dark',
    });
    highlightedHtml.value = html;
  } catch (error) {
    console.error('Failed to highlight code:', error);
    // Fallback to plain text
    highlightedHtml.value = `<pre style="background-color: #1f2937;"><code>${escapeHtml(code)}</code></pre>`;
  } finally {
    isLoading.value = false;
  }
}

// Escape HTML for fallback
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Watch for code changes and re-highlight
watch(() => props.code.code, (newCode) => {
  highlightCode(newCode);
}, { immediate: true });

// Copy to clipboard
async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code.code);
    isCopied.value = true;
    emit('copy', props.code.code);
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy code:', err);
  }
}

// Toggle code visibility
function toggleCode() {
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <div class="overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between py-2 px-3 bg-white border-b border-default dark:bg-surface-950">
      <button
        class="flex items-center gap-2 py-1 px-1.5 pr-2 text-muted bg-transparent border-0 rounded cursor-pointer transition-colors duration-150 hover:bg-layer1-hover"
        @click="toggleCode"
      >
        <i
          :class="['pi pi-chevron-right text-base shrink-0 transition-transform', { 'rotate-90': isExpanded }]"
          aria-hidden="true"
        />
        <span class="text-sm font-medium">Code</span>
      </button>

      <button
        v-if="showCopy && isExpanded"
        class="flex items-center gap-1.5 py-1 px-1.5 pr-2 text-muted bg-transparent border-0 rounded cursor-pointer transition-all duration-150 hover:text-default hover:bg-layer1-hover font-mono"
        @click="copyCode"
      >
        <i class="pi pi-copy" v-if="!isCopied"/>
        <i class="pi pi-check text-green-500" v-else/>
        <span class="text-xs">{{ isCopied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>

    <!-- Code content -->
    <div
      v-show="isExpanded"
      class="bg-surface-900 overflow-x-auto"
    >
      <div
        v-if="isLoading && !highlightedHtml"
        class="py-4 text-center"
      >
        <span class="text-muted text-sm">Loading...</span>
      </div>
      <div
        v-else-if="highlightedHtml"
        class="p-4 [&_pre]:m-0 [&_pre]:p-0 [&_pre]:!bg-transparent [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:leading-[1.6]"
        v-html="highlightedHtml"
      />
    </div>
  </div>
</template>
