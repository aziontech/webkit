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
  <div class="family-row">
    <div class="family-header">
      <span class="family-name">{{ family.label }}</span>
      <span class="family-role">{{ family.role }}</span>
    </div>
    <div class="shades-row">
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

<style scoped>
.family-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-subtle, #1e1e1e);
  margin-bottom: 20px;
}

.family-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.family-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.family-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-default, #eee);
  min-width: 72px;
}

.family-role {
  font-size: 12px;
  color: var(--text-muted, #888);
}

.shades-row {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 2px;
}
</style>
