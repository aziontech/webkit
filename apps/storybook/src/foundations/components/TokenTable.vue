<script setup>
import { ref } from 'vue';

defineProps({
  /**
   * Array of token objects:
   * { name, cssVar, tailwindClass, description, lightHex, darkHex }
   */
  tokens: { type: Array, required: true },
});

// Track copied state per token + field
const copiedKey = ref(null);
let copyTimeout = null;

function labelColor(hex) {
  if (!hex || hex.length < 7) return '#888';
  const h = hex.replace('#', '').slice(0, 6);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? '#000' : '#fff';
}

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
  <div class="table-wrap">
    <table class="token-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>CSS Variable</th>
          <th>Tailwind</th>
          <th>Description</th>
          <th>Light</th>
          <th>Dark</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="token in tokens" :key="token.name">
          <td class="cell-name">{{ token.name }}</td>
          <td>
            <button
              class="copy-btn"
              @click="copyToClipboard(token.cssVar, `${token.name}-css`)"
              :title="isCopied(`${token.name}-css`) ? 'Copied!' : 'Copy CSS variable'"
            >
              <code class="code-tag">{{ token.cssVar }}</code>
              <i :class="['pi', isCopied(`${token.name}-css`) ? 'pi-check' : 'pi-copy']" />
            </button>
          </td>
          <td>
            <button
              class="copy-btn"
              @click="copyToClipboard(token.tailwindClass, `${token.name}-tw`)"
              :title="isCopied(`${token.name}-tw`) ? 'Copied!' : 'Copy Tailwind class'"
            >
              <code class="code-tag tw-tag">{{ token.tailwindClass }}</code>
              <i :class="['pi', isCopied(`${token.name}-tw`) ? 'pi-check' : 'pi-copy']" />
            </button>
          </td>
          <td class="cell-desc">{{ token.description }}</td>
          <td>
            <div
              class="color-cell"
              :style="{ background: token.lightHex ?? 'transparent' }"
            >
              <span :style="{ color: labelColor(token.lightHex) }">{{ token.lightHex }}</span>
            </div>
          </td>
          <td>
            <div
              class="color-cell"
              :style="{ background: token.darkHex ?? 'transparent' }"
            >
              <span :style="{ color: labelColor(token.darkHex) }">{{ token.darkHex }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--border-default, #2a2a2a);
}

.token-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.token-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--border-default, #2a2a2a);
  color: var(--text-muted, #888);
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.15);
}

.token-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle, #1e1e1e);
  vertical-align: middle;
  color: var(--text-default, #eee);
}

.token-table tr:last-child td {
  border-bottom: none;
}

.token-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.cell-name {
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  transition: opacity 120ms ease;
}

.copy-btn:hover {
  opacity: 0.8;
}

.copy-btn .pi-copy,
.copy-btn .pi-check {
  font-size: 10px;
  opacity: 0.5;
}

.copy-btn .pi-check {
  color: #22c55e;
  opacity: 1;
}

.cell-desc {
  font-size: 12px;
  color: var(--text-muted, #888);
  min-width: 200px;
}

.code-tag {
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  border: 1px solid;
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--text-code, #AAA);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  display: inline-block;
}

.color-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 3px 8px;
  min-width: 88px;
  border: 1px solid rgba(128, 128, 128, 0.2);
  font-size: 10px;
  font-family: 'Roboto Mono', monospace;
  white-space: nowrap;
}
</style>
