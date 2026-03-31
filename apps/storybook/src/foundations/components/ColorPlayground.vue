<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { backgroundTokens, textTokens, borderTokens } from '../data/colors.js';

const CATEGORIES = [
  { key: 'background', label: 'Background', tokens: backgroundTokens, prefix: 'bg' },
  { key: 'text',       label: 'Text',       tokens: textTokens,       prefix: 'text' },
  { key: 'border',     label: 'Border',     tokens: borderTokens,     prefix: 'border' },
];

const selectedCategory = ref('background');
const selectedTokenName = ref(backgroundTokens[0].name);

// Detect global theme from Storybook's theme addon (azion-light/azion-dark class)
const isDark = ref(true);
let observer = null;

function updateTheme() {
  const lightEl = document.querySelector('.azion-light');
  isDark.value = !lightEl;
}

onMounted(() => {
  updateTheme();
  // Watch for class changes on document body or html element
  observer = new MutationObserver(updateTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  observer?.disconnect();
});

const activeTokens = computed(() =>
  CATEGORIES.find((c) => c.key === selectedCategory.value)?.tokens ?? []
);

const selectedToken = computed(() =>
  activeTokens.value.find((t) => t.name === selectedTokenName.value) ?? activeTokens.value[0]
);

const currentHex = computed(() =>
  isDark.value ? selectedToken.value?.darkHex : selectedToken.value?.lightHex
);

const modeLabel = computed(() => isDark.value ? 'dark' : 'light');

const previewStyle = computed(() => {
  const hex = currentHex.value;
  if (!hex) return {};
  const cat = selectedCategory.value;
  if (cat === 'background') return { backgroundColor: hex };
  if (cat === 'text')       return { color: hex };
  if (cat === 'border')     return { borderColor: hex, borderWidth: '2px', borderStyle: 'solid' };
  return {};
});

const previewTextStyle = computed(() => {
  if (selectedCategory.value === 'text') return { color: currentHex.value };
  return { color: labelColor(currentHex.value) };
});

function labelColor(hex) {
  if (!hex || hex.length < 7) return '#888';
  const h = hex.replace('#', '').slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? '#000' : '#fff';
}

function onCategoryChange() {
  selectedTokenName.value = activeTokens.value[0]?.name ?? '';
}

// Track copied state
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
  <div class="flex flex-col gap-6">
    <!-- Controls ─────────────────────────────────────────────────────────── -->
    <div class="flex gap-5 items-end flex-wrap">
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-semibold uppercase tracking-wider text-muted">Category</label>
        <div class="flex rounded-md overflow-hidden border border-default">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.key"
            :class="[
              'px-3.5 py-1.5 text-xs font-medium cursor-pointer bg-transparent transition-all duration-100',
              selectedCategory === cat.key
                ? 'bg-primary text-white font-semibold'
                : 'text-muted border-r border-default last:border-r-0'
            ]"
            @click="selectedCategory = cat.key; onCategoryChange()"
          >{{ cat.label }}</button>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-semibold uppercase tracking-wider text-muted">Token</label>
        <select
          v-model="selectedTokenName"
          class="px-3 py-1.5 rounded-md border border-default bg-surface text-default font-code text-xs min-w-[220px] cursor-pointer"
        >
          <option v-for="token in activeTokens" :key="token.name" :value="token.name">
            {{ token.tailwindClass }}
          </option>
        </select>
      </div>
    </div>

    <!-- Preview ───────────────────────────────────────────────────────────── -->
    <div class="flex gap-5 items-start flex-wrap">
      <div
        class="flex-1 min-w-[220px] min-h-[160px] rounded-[10px] flex items-center justify-center transition-all duration-200"
        :class="selectedCategory !== 'border' ? 'border border-default' : ''"
        :style="previewStyle"
      >
        <span
          class="font-code text-[15px] font-semibold"
          :style="previewTextStyle"
        >
          {{ selectedToken?.tailwindClass }}
        </span>
      </div>

      <div class="flex-1 min-w-[280px] flex flex-col gap-3.5 p-4 rounded-lg border border-default bg-surface">
        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-muted">Tailwind class</span>
          <button
            class="group inline-flex items-center gap-1.5 bg-none border-none p-0 cursor-pointer text-left hover:brightness-110"
            @click="copyToClipboard(selectedToken?.tailwindClass, 'tw')"
          >
            <code class="font-code text-[11px] border bg-white/10 border-white/15 text-code px-1.5 py-0.5 rounded">{{ selectedToken?.tailwindClass }}</code>
            <i :class="['pi text-[11px] opacity-0 group-hover:!opacity-50', isCopied('css') ? 'pi-check text-success' : 'pi-copy']" />
          </button>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-muted">CSS variable</span>
          <button
            class="group inline-flex items-center gap-1.5 bg-none border-none p-0 cursor-pointer text-left hover:brightness-110"
            @click="copyToClipboard(selectedToken?.cssVar, 'css')"
          >
            <code class="font-code text-[11px] border bg-white/10 border-white/15 text-code px-1.5 py-0.5 rounded">{{ selectedToken?.cssVar }}</code>
            <i :class="['pi text-[11px] opacity-0 group-hover:!opacity-50', isCopied('css') ? 'pi-check text-success' : 'pi-copy']" />
          </button>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-muted">Resolved ({{ modeLabel }})</span>
          <span class="flex items-center gap-1.5 flex-wrap">
            <span
              class="w-3.5 h-3.5 rounded flex-shrink-0 border border-gray-500/30"
              :style="{ background: currentHex ?? 'transparent' }"
            />
            <code class="font-code text-[11px] border bg-white/10 border-white/15 text-code px-1.5 py-0.5 rounded">{{ currentHex }}</code>
          </span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-muted">Description</span>
          <span class="text-[13px] text-default">{{ selectedToken?.description }}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-muted">Light → Dark</span>
          <span class="flex items-center gap-1.5 flex-wrap">
            <span
              class="w-3.5 h-3.5 rounded flex-shrink-0 border border-gray-500/30"
              :style="{ background: selectedToken?.lightHex ?? 'transparent' }"
            />
            <code class="font-code text-[11px] border bg-white/10 border-white/15 text-code px-1.5 py-0.5 rounded">{{ selectedToken?.lightHex }}</code>
            <span class="opacity-40 text-[11px]">→</span>
            <span
              class="w-3.5 h-3.5 rounded flex-shrink-0 border border-gray-500/30"
              :style="{ background: selectedToken?.darkHex ?? 'transparent' }"
            />
            <code class="font-code text-[11px] border bg-white/10 border-white/15 text-code px-1.5 py-0.5 rounded">{{ selectedToken?.darkHex }}</code>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
