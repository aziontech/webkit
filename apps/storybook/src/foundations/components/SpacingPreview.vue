<script setup>
import { ref } from 'vue';
import { useViewport } from '../composables/useViewport.js';

defineProps({
  /**
   * Spacing token object:
   * { name, category, label, property, description, desktop, tablet, mobile }
   */
  token: { type: Object, required: true },
});

const { breakpoint } = useViewport();

const copiedKey = ref(null);
let copyTimeout = null;

function copyToClipboard(text, key) {
  navigator.clipboard?.writeText(text).catch(() => {});
  copiedKey.value = key;
  if (copyTimeout) clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => {
    copiedKey.value = null;
  }, 1000);
}

function isCopied(key) {
  return copiedKey.value === key;
}
</script>

<template>
  <div class="flex w-full flex-col gap-4 py-5 border-b border-subtle items-start last:border-b-0 sm:flex-row sm:gap-6">
    <div class="flex flex-col w-full gap-1.5 sm:w-72 sm:flex-none">
      <p class="text-sm font-semibold text-default m-0">{{ token.label }}</p>
      <button
        class="inline-flex items-center gap-1.5 bg-none border-none p-0 cursor-pointer font-inherit group"
        @click="copyToClipboard(token.name, token.name)"
        :title="'Copy: ' + token.name"
      >
        <code class="font-code text-[11px] bg-white/[0.07] border border-white/15 text-code px-1.5 py-0.5 rounded w-fit">{{ token.name }}</code>
        <i :class="[
          'pi text-[10px] transition-opacity duration-100',
          isCopied(token.name) ? 'pi-check text-success' : 'pi-copy opacity-0 group-hover:opacity-50'
        ]" />
      </button>
      <p class="text-xs text-muted m-0 mb-2 leading-relaxed">{{ token.description }}</p>

      <div class="grid grid-cols-2 gap-x-3 gap-y-3 w-full m-0">
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Property</span>
          <span class="font-code text-[10px] text-muted">{{ token.property }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span :class="['text-[9px] font-semibold uppercase tracking-wider', breakpoint === 'desktop' ? 'text-primary' : 'text-muted']">Desktop</span>
          <span class="font-code text-[10px] text-muted">{{ token.desktop }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span :class="['text-[9px] font-semibold uppercase tracking-wider', breakpoint === 'tablet' ? 'text-primary' : 'text-muted']">Tablet</span>
          <span class="font-code text-[10px] text-muted">{{ token.tablet }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span :class="['text-[9px] font-semibold uppercase tracking-wider', breakpoint === 'mobile' ? 'text-primary' : 'text-muted']">Mobile</span>
          <span class="font-code text-[10px] text-muted">{{ token.mobile }}</span>
        </div>
      </div>
    </div>

    <div class="flex w-full">
      <div class="bg-surface border border-default rounded-lg p-4 min-h-[80px] flex items-center justify-center w-full">
        <!-- Max-width visualization -->
        <div
          v-if="token.property === 'max-width'"
          class="bg-orange-500/15 border-2 border-dashed border-primary rounded h-10 w-full flex items-center justify-center"
          :style="{ maxWidth: token[breakpoint] ?? token.desktop }"
        >
          <span class="font-code text-[11px] text-muted">{{ token[breakpoint] ?? token.desktop }}</span>
        </div>

        <!-- Padding visualization -->
        <div
          v-else-if="token.property.includes('padding')"
          class="w-full"
        >
          <div
            class="bg-orange-500/15 rounded border-2 border-dashed border-primary"
            :style="{ padding: token[breakpoint] ?? token.desktop }"
          >
            <div class="bg-surface rounded border border-subtle px-3 py-2 min-w-[80px] text-center">
              <span class="font-code text-[11px] text-default">{{ token[breakpoint] ?? token.desktop }}</span>
            </div>
          </div>
        </div>

        <!-- Gap visualization -->
        <div
          v-else-if="token.property === 'gap'"
          class="flex w-full"
          :style="{ gap: token[breakpoint] ?? token.desktop }"
        >
          <div class="flex-1 h-8 rounded bg-orange-500/30" />
          <div class="flex-1 h-8 rounded bg-orange-500/30" />
          <div class="flex-1 h-8 rounded bg-orange-500/30" />
        </div>
      </div>
    </div>
  </div>
</template>
