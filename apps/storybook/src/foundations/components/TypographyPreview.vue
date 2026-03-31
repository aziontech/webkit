<script setup>
import { ref } from 'vue';
import { useViewport } from '../composables/useViewport.js';

defineProps({
  /**
   * Typography token object:
   * { name, category, label, description, desktop, tablet, mobile, fontFamily, sample }
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
  <div class="flex flex-col gap-4 py-5 border-b border-subtle items-start last:border-b-0 sm:flex-row sm:gap-6">
    <div class="w-full flex flex-col gap-1.5 sm:w-72 sm:flex-none">
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

      <div class="grid grid-cols-2 gap-x-3 gap-y-3 m-0">
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Font</span>
          <span class="font-code text-[10px] text-muted">{{ token.fontFamily }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span :class="['text-[9px] font-semibold uppercase tracking-wider', breakpoint === 'desktop' ? 'text-primary' : 'text-muted']">Desktop</span>
          <span class="font-code text-[10px] text-muted">{{ token.desktop.fontSize }} / {{ token.desktop.lineHeight }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span :class="['text-[9px] font-semibold uppercase tracking-wider', breakpoint === 'tablet' ? 'text-primary' : 'text-muted']">Tablet</span>
          <span class="font-code text-[10px] text-muted">{{ token.tablet.fontSize }} / {{ token.tablet.lineHeight }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span :class="['text-[9px] font-semibold uppercase tracking-wider', breakpoint === 'mobile' ? 'text-primary' : 'text-muted']">Mobile</span>
          <span class="font-code text-[10px] text-muted">{{ token.mobile.fontSize }} / {{ token.mobile.lineHeight }}</span>
        </div>
        <div v-if="token.desktop.letterSpacing" class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Tracking</span>
          <span class="font-code text-[10px] text-muted">{{ token[breakpoint]?.letterSpacing ?? token.desktop.letterSpacing }}</span>
        </div>
        <div v-if="token.desktop.textTransform" class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Transform</span>
          <span class="font-code text-[10px] text-muted">{{ token[breakpoint]?.textTransform ?? token.desktop.textTransform }}</span>
        </div>
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <div class="bg-surface border border-default rounded-lg p-6 flex items-center justify-center min-h-[80px]">
        <span
          :class="token.name"
          class="text-default"
          :style="{
            fontSize: token[breakpoint]?.fontSize ?? token.desktop.fontSize,
            lineHeight: token[breakpoint]?.lineHeight ?? token.desktop.lineHeight,
          }"
        >{{ token.sample }}</span>
      </div>
    </div>
  </div>
</template>
