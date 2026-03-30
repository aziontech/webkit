<script setup>
import { computed } from 'vue';

const props = defineProps({
  hex:    { type: String, default: null },
  shade:  { type: String, default: '' },
  cssVar: { type: String, default: '' },
});

/**
 * Returns black or white depending on perceived luminance of the background.
 * Used to keep the shade label readable on any color.
 */
const labelColor = computed(() => {
  const hex = (props.hex ?? '').replace('#', '').slice(0, 6);
  if (hex.length < 6) return '#fff';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? '#000' : '#fff';
});
</script>

<template>
  <div class="flex flex-col rounded-md overflow-hidden border border-gray-500/15 flex-1 min-w-[60px] max-w-[88px] cursor-default">
    <div
      class="h-[52px] flex items-end px-1.5 py-1"
      :style="{ background: hex ?? 'transparent' }"
    >
      <span
        class="text-[10px] font-bold font-code leading-none"
        :style="{ color: labelColor }"
      >{{ shade }}</span>
    </div>
    <div class="px-1.5 py-[5px] bg-black/25">
      <span class="text-[9px] font-code text-gray-400 block break-all leading-tight">{{ hex }}</span>
    </div>
  </div>
</template>
