<script setup>
import { ref, computed } from 'vue';
import { useViewport } from '../composables/useViewport.js';

const BREAKPOINT_ORDER = ['_', 'sm', 'md', 'lg', 'xl', '2xl'];

const props = defineProps({
  /** Token from texts.data.js (via from-tokens.js) */
  token: { type: Object, required: true },
});

const { breakpoint } = useViewport();

const BREAKPOINT_LABELS = {
  _: 'Base',
  sm: 'sm ≥640',
  md: 'md ≥768',
  lg: 'lg ≥1024',
  xl: 'xl ≥1280',
  '2xl': '2xl ≥1536',
};

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

const activeValues = computed(() => {
  const index = BREAKPOINT_ORDER.indexOf(breakpoint.value);
  for (let i = index; i >= 0; i -= 1) {
    const bp = BREAKPOINT_ORDER[i];
    if (props.token.responsive[bp]?.fontSize) return props.token.responsive[bp];
  }
  return props.token.responsive._ ?? { fontSize: '', lineHeight: '' };
});
</script>

<template>
  <div class="flex flex-col gap-4 py-5 border-b border-subtle items-start last:border-b-0 sm:flex-row sm:gap-6">
    <div class="w-full flex flex-col gap-1.5 sm:w-80 sm:flex-none">
      <p class="text-sm font-semibold text-default m-0">{{ token.label }}</p>
      <button
        class="inline-flex items-center gap-1.5 bg-none border-none p-0 cursor-pointer font-inherit group"
        @click="copyToClipboard(token.usageClass, token.name)"
        :title="'Copy class: ' + token.usageClass"
      >
        <code class="font-code text-[11px] bg-white/[0.07] border border-white/15 text-code px-1.5 py-0.5 rounded w-fit">{{ token.usageClass }}</code>
        <i
          :class="[
            'pi text-[10px] transition-opacity duration-100',
            isCopied(token.name) ? 'pi-check text-success' : 'pi-copy opacity-0 group-hover:opacity-50',
          ]"
        />
      </button>
      <p class="text-xs text-muted m-0 mb-2 leading-relaxed">{{ token.description }}</p>
      <p class="text-[10px] text-muted m-0 font-code">Source: packages/theme/src/tokens/semantic/texts.data.js</p>

      <div class="grid grid-cols-2 gap-x-3 gap-y-3 m-0 mt-3">
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Font</span>
          <span class="font-code text-[10px] text-muted">{{ token.fontFamily }}</span>
        </div>
        <div
          v-for="(values, bp) in token.responsive"
          :key="bp"
          class="flex flex-col gap-0.5"
        >
          <span
            :class="[
              'text-[9px] font-semibold uppercase tracking-wider',
              breakpoint === bp ? 'text-primary' : 'text-muted',
            ]"
          >{{ BREAKPOINT_LABELS[bp] ?? bp }}</span>
          <span class="font-code text-[10px] text-muted">{{ values.fontSize }} / {{ values.lineHeight }}</span>
        </div>
      </div>
    </div>

    <div class="flex-1 min-w-0 w-full">
      <div class="bg-surface border border-default rounded-lg p-6 flex items-center justify-center min-h-[80px]">
        <span :class="[token.usageClass, 'text-default']">{{ token.sample }}</span>
      </div>
      <p class="text-[10px] text-muted m-0 mt-2 font-code">
        Active ({{ BREAKPOINT_LABELS[breakpoint] ?? breakpoint }}): {{ activeValues.fontSize }} / {{ activeValues.lineHeight }}
      </p>
    </div>
  </div>
</template>
