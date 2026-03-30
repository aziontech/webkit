<script setup>
import { ref } from 'vue';

defineProps({
  /**
   * Typography token object:
   * { name, category, label, description, desktop, tablet, mobile, fontFamily, sample }
   */
  token: { type: Object, required: true },
});

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
  <div class="typography-row">
    <div class="meta-col">
      <p class="token-name">{{ token.label }}</p>
      <button
        class="token-class-btn"
        @click="copyToClipboard(token.name, token.name)"
        :title="'Copy: ' + token.name"
      >
        <code class="token-class">{{ token.name }}</code>
        <i :class="['pi', isCopied(token.name) ? 'pi-check' : 'pi-copy']" />
      </button>
      <p class="token-desc">{{ token.description }}</p>
      
      <div class="specs-grid">
        <div class="spec-item">
          <span class="spec-label">Font</span>
          <span class="spec-value">{{ token.fontFamily }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Desktop</span>
          <span class="spec-value">{{ token.desktop.fontSize }} / {{ token.desktop.lineHeight }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Tablet</span>
          <span class="spec-value">{{ token.tablet.fontSize }} / {{ token.tablet.lineHeight }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Mobile</span>
          <span class="spec-value">{{ token.mobile.fontSize }} / {{ token.mobile.lineHeight }}</span>
        </div>
        <div v-if="token.desktop.letterSpacing" class="spec-item">
          <span class="spec-label">Tracking</span>
          <span class="spec-value">{{ token.desktop.letterSpacing }}</span>
        </div>
        <div v-if="token.desktop.textTransform" class="spec-item">
          <span class="spec-label">Transform</span>
          <span class="spec-value">{{ token.desktop.textTransform }}</span>
        </div>
      </div>
    </div>
    
    <div class="preview-col">
      <div class="preview-box">
        <span :class="token.name">{{ token.sample }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.typography-row {
  display: flex;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-subtle, #1e1e1e);
  align-items: flex-start;
}

.typography-row:last-child {
  border-bottom: none;
}

.meta-col {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.token-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-default, #eee);
  margin: 0;
}

.token-class-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
}

.token-class-btn .pi-copy {
  font-size: 10px;
  opacity: 0;
  transition: opacity 120ms ease;
}

.token-class-btn:hover .pi-copy {
  opacity: 0.5;
}

.token-class-btn .pi-check {
  font-size: 10px;
  color: #22c55e;
}

.token-class {
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-code, #aaa);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.token-desc {
  font-size: 12px;
  color: var(--text-muted, #888);
  margin: 0 0 8px;
  line-height: 1.5;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.spec-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #666);
}

.spec-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 10px;
  color: var(--text-muted, #888);
}

.preview-col {
  flex: 1;
  min-width: 0;
}

.preview-box {
  background: var(--background-surface, rgba(255, 255, 255, 0.02));
  border: 1px solid var(--border-default, #2a2a2a);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  color: var(--text-default, #eee);
}

.preview-box span {
  color: var(--text-default, #eee);
}

@media (max-width: 768px) {
  .typography-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .meta-col {
    flex: none;
    width: 100%;
  }
}
</style>
