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
  <div class="swatch">
    <div class="swatch-chip" :style="{ background: hex ?? 'transparent' }">
      <span class="swatch-shade" :style="{ color: labelColor }">{{ shade }}</span>
    </div>
    <div class="swatch-meta">
      <span class="swatch-hex">{{ hex }}</span>
    </div>
  </div>
</template>

<style scoped>
.swatch {
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(128, 128, 128, 0.15);
  flex: 1;
  min-width: 60px;
  max-width: 88px;
  cursor: default;
}

.swatch-chip {
  height: 52px;
  display: flex;
  align-items: flex-end;
  padding: 4px 6px;
}

.swatch-shade {
  font-size: 10px;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  line-height: 1;
}

.swatch-meta {
  padding: 5px 6px;
  background: rgba(0, 0, 0, 0.25);
}

.swatch-hex {
  font-size: 9px;
  font-family: 'Roboto Mono', monospace;
  color: #ccc;
  display: block;
  word-break: break-all;
  line-height: 1.3;
}
</style>
