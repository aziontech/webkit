<script setup>
import { ref, computed } from 'vue';
import { backgroundTokens, textTokens, borderTokens } from '../data/colors.js';

const CATEGORIES = [
  { key: 'background', label: 'Background', tokens: backgroundTokens, prefix: 'bg' },
  { key: 'text',       label: 'Text',       tokens: textTokens,       prefix: 'text' },
  { key: 'border',     label: 'Border',     tokens: borderTokens,     prefix: 'border' },
];

const selectedCategory = ref('background');
const selectedTokenName = ref(backgroundTokens[0].name);
const mode = ref('dark');

const activeTokens = computed(() =>
  CATEGORIES.find((c) => c.key === selectedCategory.value)?.tokens ?? []
);

const selectedToken = computed(() =>
  activeTokens.value.find((t) => t.name === selectedTokenName.value) ?? activeTokens.value[0]
);

const currentHex = computed(() =>
  mode.value === 'dark' ? selectedToken.value?.darkHex : selectedToken.value?.lightHex
);

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

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).catch(() => {});
}
</script>

<template>
  <div class="playground">
    <!-- Controls ─────────────────────────────────────────────────────────── -->
    <div class="controls">
      <div class="control-group">
        <label class="control-label">Category</label>
        <div class="btn-group">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.key"
            :class="['seg-btn', { active: selectedCategory === cat.key }]"
            @click="selectedCategory = cat.key; onCategoryChange()"
          >{{ cat.label }}</button>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Token</label>
        <select v-model="selectedTokenName" class="select">
          <option v-for="token in activeTokens" :key="token.name" :value="token.name">
            {{ token.tailwindClass }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label class="control-label">Mode</label>
        <div class="btn-group">
          <button :class="['seg-btn', { active: mode === 'light' }]" @click="mode = 'light'">Light</button>
          <button :class="['seg-btn', { active: mode === 'dark'  }]" @click="mode = 'dark'">Dark</button>
        </div>
      </div>
    </div>

    <!-- Preview ───────────────────────────────────────────────────────────── -->
    <div class="preview-area">
      <div class="preview-card" :style="previewStyle">
        <span class="preview-label" :style="previewTextStyle">
          {{ selectedToken?.tailwindClass }}
        </span>
      </div>

      <div class="meta-panel">
        <div class="meta-row">
          <span class="meta-label">Tailwind class</span>
          <button class="code-copy" @click="copyToClipboard(selectedToken?.tailwindClass)">
            <code>{{ selectedToken?.tailwindClass }}</code>
            <i class="pi pi-copy" style="font-size: 11px; opacity: 0.6;" />
          </button>
        </div>

        <div class="meta-row">
          <span class="meta-label">CSS variable</span>
          <button class="code-copy" @click="copyToClipboard(selectedToken?.cssVar)">
            <code>{{ selectedToken?.cssVar }}</code>
            <i class="pi pi-copy" style="font-size: 11px; opacity: 0.6;" />
          </button>
        </div>

        <div class="meta-row">
          <span class="meta-label">Resolved ({{ mode }})</span>
          <span class="hex-value">
            <span class="hex-chip" :style="{ background: currentHex ?? 'transparent' }" />
            <code>{{ currentHex }}</code>
          </span>
        </div>

        <div class="meta-row">
          <span class="meta-label">Description</span>
          <span class="meta-desc">{{ selectedToken?.description }}</span>
        </div>

        <div class="meta-row">
          <span class="meta-label">Light → Dark</span>
          <span class="hex-value">
            <span class="hex-chip" :style="{ background: selectedToken?.lightHex ?? 'transparent' }" />
            <code>{{ selectedToken?.lightHex }}</code>
            <span style="opacity: 0.4; font-size: 11px;">→</span>
            <span class="hex-chip" :style="{ background: selectedToken?.darkHex ?? 'transparent' }" />
            <code>{{ selectedToken?.darkHex }}</code>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Controls */
.controls {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #888);
}

.btn-group {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-default, #2a2a2a);
}

.seg-btn {
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: var(--text-muted, #888);
  border: none;
  transition: all 120ms ease;
}

.seg-btn:not(:last-child) {
  border-right: 1px solid var(--border-default, #2a2a2a);
}

.seg-btn.active {
  background: var(--background-primary, #fe601f);
  color: #fff;
  font-weight: 600;
}

.select {
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-default, #2a2a2a);
  background: var(--background-surface, #1a1a1a);
  color: var(--text-default, #eee);
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  min-width: 220px;
  cursor: pointer;
}

/* Preview */
.preview-area {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.preview-card {
  flex: 1;
  min-width: 220px;
  min-height: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-default, #2a2a2a);
  transition: all 200ms ease;
}

.preview-label {
  font-family: 'Roboto Mono', monospace;
  font-size: 15px;
  font-weight: 600;
}

/* Meta panel */
.meta-panel {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 8px;
  border: 1px solid var(--border-default, #2a2a2a);
  background: var(--background-surface, rgba(255, 255, 255, 0.02));
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #888);
}

.meta-desc {
  font-size: 13px;
  color: var(--text-default, #eee);
}

.code-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.code-copy:hover code {
  background: rgba(138, 132, 236, 0.15);
}

code {
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  background: rgba(138, 132, 236, 0.08);
  border: 1px solid rgba(138, 132, 236, 0.12);
  color: var(--text-accent, #8a84ec);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.hex-value {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.hex-chip {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  display: inline-block;
  border: 1px solid rgba(128, 128, 128, 0.3);
  flex-shrink: 0;
}
</style>
