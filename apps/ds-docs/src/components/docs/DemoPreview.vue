<script setup lang="ts">
import { ref, computed } from 'vue';

/**
 * DemoPreview Component
 * 
 * Renders component demos with optional code display.
 * Supports interactive previews and code snippets.
 */

interface Props {
  title?: string;
  showCode?: boolean;
  codeLanguage?: string;
  responsive?: boolean;
  backgroundColor?: 'white' | 'gray' | 'dark';
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showCode: true,
  codeLanguage: 'vue',
  responsive: false,
  backgroundColor: 'white',
});

const isCodeVisible = ref(props.showCode);

const bgClass = computed(() => {
  switch (props.backgroundColor) {
    case 'gray':
      return 'bg-gray-50';
    case 'dark':
      return 'bg-gray-800';
    default:
      return 'bg-white';
  }
});
</script>

<template>
  <div class="my-6">
    <!-- Demo Title -->
    <div v-if="title" class="mb-3">
      <h4 class="text-sm font-medium text-muted">{{ title }}</h4>
    </div>
    
    <!-- Preview Area -->
    <div
      :class="[
        'flex items-center justify-center min-h-[100px] border border-default rounded-lg p-6',
        bgClass,
        { 'overflow-x-auto': responsive }
      ]"
    >
      <slot />
    </div>
    
    <!-- Code Toggle -->
    <div v-if="showCode" class="mt-3">
      <button
        @click="isCodeVisible = !isCodeVisible"
        class="text-sm text-muted hover:text-primary-hover flex items-center gap-1.5 transition-colors"
      >
        <i class="pi pi-code text-base shrink-0" aria-hidden="true" />
        {{ isCodeVisible ? 'Hide code' : 'Show code' }}
      </button>
    </div>
    
    <!-- Code Block -->
    <div v-if="isCodeVisible && $slots.code" class="mt-3">
      <div class="bg-surface-900 rounded-lg overflow-hidden">
        <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span class="text-xs text-muted font-code">{{ codeLanguage }}</span>
          <button class="text-xs text-muted hover:text-white transition-colors">
            Copy
          </button>
        </div>
        <pre class="p-4 overflow-x-auto"><code class="text-sm text-gray-100"><slot name="code" /></code></pre>
      </div>
    </div>
  </div>
</template>
