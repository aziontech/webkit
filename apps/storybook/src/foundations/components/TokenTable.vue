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
  <div class="overflow-x-auto rounded-lg border border-default">
    <table class="w-full border-collapse text-[13px]">
      <thead>
        <tr>
          <th class="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider border-b border-default text-muted whitespace-nowrap bg-black/15">Token</th>
          <th class="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider border-b border-default text-muted whitespace-nowrap bg-black/15">CSS Variable</th>
          <th class="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider border-b border-default text-muted whitespace-nowrap bg-black/15">Tailwind</th>
          <th class="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider border-b border-default text-muted whitespace-nowrap bg-black/15">Description</th>
          <th class="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider border-b border-default text-muted whitespace-nowrap bg-black/15">Light</th>
          <th class="px-3.5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider border-b border-default text-muted whitespace-nowrap bg-black/15">Dark</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="token in tokens"
          :key="token.name"
          class="hover:bg-white/5"
        >
          <td class="px-3.5 py-2.5 border-b border-subtle align-middle text-default font-code text-xs font-semibold whitespace-nowrap">{{ token.name }}</td>
          <td class="px-3.5 py-2.5 border-b border-subtle align-middle">
            <button
              class="inline-flex items-center gap-1.5 bg-none border-none p-0 cursor-pointer hover:opacity-80 transition-opacity"
              @click="copyToClipboard(token.cssVar, `${token.name}-css`)"
              :title="isCopied(`${token.name}-css`) ? 'Copied!' : 'Copy CSS variable'"
            >
              <code class="font-code text-[11px] border bg-white/10 border-white/15 text-code px-1.5 py-0.5 rounded">{{ token.cssVar }}</code>
              <i :class="['pi text-[10px] opacity-50', isCopied(`${token.name}-css`) ? 'pi-check !text-success !opacity-100' : 'pi-copy']" />
            </button>
          </td>
          <td class="px-3.5 py-2.5 border-b border-subtle align-middle">
            <button
              class="inline-flex items-center gap-1.5 bg-none border-none p-0 cursor-pointer hover:opacity-80 transition-opacity"
              @click="copyToClipboard(token.tailwindClass, `${token.name}-tw`)"
              :title="isCopied(`${token.name}-tw`) ? 'Copied!' : 'Copy Tailwind class'"
            >
              <code class="font-code text-[11px] border bg-white/10 border-white/15 text-code px-1.5 py-0.5 rounded">{{ token.tailwindClass }}</code>
              <i :class="['pi text-[10px] opacity-50', isCopied(`${token.name}-tw`) ? 'pi-check !text-success !opacity-100' : 'pi-copy']" />
            </button>
          </td>
          <td class="px-3.5 py-2.5 border-b border-subtle align-middle text-muted text-xs min-w-[200px]">{{ token.description }}</td>
          <td class="px-3.5 py-2.5 border-b border-subtle align-middle">
            <div
              class="inline-flex items-center justify-center rounded px-2 py-0.5 min-w-[88px] border border-gray-500/20 font-code text-[10px] whitespace-nowrap"
              :style="{ background: token.lightHex ?? 'transparent' }"
            >
              <span :style="{ color: labelColor(token.lightHex) }">{{ token.lightHex }}</span>
            </div>
          </td>
          <td class="px-3.5 py-2.5 border-b border-subtle align-middle">
            <div
              class="inline-flex items-center justify-center rounded px-2 py-0.5 min-w-[88px] border border-gray-500/20 font-code text-[10px] whitespace-nowrap"
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
