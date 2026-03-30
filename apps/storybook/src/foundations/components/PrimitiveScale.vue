<script setup>
import ColorSwatch from './ColorSwatch.vue';

defineProps({
  /**
   * { name, label, role, shades: [{ shade, hex, cssVar }] }
   */
  family: { type: Object, required: true },
});
</script>

<template>
  <div class="flex flex-col gap-2 pb-5 border-b border-subtle mb-5 last:border-b-0 last:mb-0 last:pb-0">
    <div class="flex items-baseline gap-3">
      <span class="text-[13px] font-semibold text-default min-w-[72px]">{{ family.label }}</span>
      <span class="text-xs text-muted">{{ family.role }}</span>
    </div>
    <div class="flex gap-1 flex-nowrap overflow-x-auto pb-0.5">
      <ColorSwatch
        v-for="swatch in family.shades"
        :key="swatch.shade"
        :hex="swatch.hex"
        :shade="swatch.shade"
        :css-var="swatch.cssVar"
      />
    </div>
  </div>
</template>
