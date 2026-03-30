<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  /**
   * Icon catalog from @aziontech/icons/catalog
   * [{ icon: 'ai ai-azion', name: 'ai-azion', keywords: '' }, ...]
   */
  icons: { type: Array, required: true },
  initialSize: { type: Number, default: 24 },
});

const searchQuery = ref('');
const iconSize = ref(props.initialSize);

// Track copied state
const copiedKey = ref(null);
let copyTimeout = null;

// Filter icons based on search query
const filteredIcons = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.icons;
  
  return props.icons.filter((icon) => {
    const name = icon.name.toLowerCase();
    const keywords = (icon.keywords || '').toLowerCase();
    return name.includes(query) || keywords.includes(query);
  });
});

// Split into Azion icons (ai prefix) and PrimeIcons (pi prefix)
const azionIcons = computed(() => 
  filteredIcons.value.filter((icon) => icon.name.startsWith('ai-'))
);

const primeIcons = computed(() => 
  filteredIcons.value.filter((icon) => icon.name.startsWith('pi-'))
);

// Stats
const totalAzion = computed(() => props.icons.filter((i) => i.name.startsWith('ai-')).length);
const totalPrime = computed(() => props.icons.filter((i) => i.name.startsWith('pi-')).length);

// Copy icon code to clipboard
function copyIconCode(icon) {
  const code = `<i class="${icon.icon}"/>`;
  navigator.clipboard?.writeText(code).catch(() => {});
  copiedKey.value = icon.name;
  if (copyTimeout) clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => {
    copiedKey.value = null;
  }, 1000);
}

function isCopied(name) {
  return copiedKey.value === name;
}
</script>

<template>
  <div class="icon-grid-container">
    <!-- Controls -->
    <div class="controls">
      <div class="search-group">
        <i class="pi pi-search search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search icons by name..."
        />
        <span v-if="searchQuery" class="search-count">
          {{ filteredIcons.length }} / {{ icons.length }}
        </span>
      </div>
      
      <div class="size-group">
        <label class="size-label">Size</label>
        <input
          v-model.number="iconSize"
          type="range"
          min="12"
          max="64"
          step="4"
          class="size-slider"
        />
        <span class="size-value">{{ iconSize }}px</span>
      </div>
    </div>

    <!-- Azion Icons -->
    <div v-if="azionIcons.length > 0" class="icon-section">
      <div class="section-header">
        <h3 class="section-title">Azion Icons</h3>
        <span class="section-count">{{ azionIcons.length }} / {{ totalAzion }}</span>
      </div>
      <p class="section-desc">Custom Azion product and technology icons.</p>
      
      <div class="icon-grid">
        <button
          v-for="icon in azionIcons"
          :key="icon.name"
          class="icon-card"
          :title="'Click to copy: ' + icon.icon"
          @click="copyIconCode(icon)"
        >
          <i :class="icon.icon" :style="{ fontSize: `${iconSize}px` }" />
          <span class="icon-name max-w-20 truncate">{{ icon.name.replace('ai-', '') }}</span>
          <i :class="['corner-icon', isCopied(icon.name) ? 'pi pi-check' : 'pi pi-copy']" />
        </button>
      </div>
    </div>

    <!-- PrimeIcons -->
    <div v-if="primeIcons.length > 0" class="icon-section">
      <div class="section-header">
        <h3 class="section-title">PrimeIcons</h3>
        <span class="section-count">{{ primeIcons.length }} / {{ totalPrime }}</span>
      </div>
      <p class="section-desc">General-purpose UI icons from PrimeIcons.</p>
      
      <div class="icon-grid">
        <button
          v-for="icon in primeIcons"
          :key="icon.name"
          class="icon-card"
          :title="'Click to copy: ' + icon.icon"
          @click="copyIconCode(icon)"
        >
          <i :class="icon.icon" :style="{ fontSize: `${iconSize}px` }" />
          <span class="icon-name max-w-20 truncate">{{ icon.name.replace('pi-', '') }}</span>
          <i :class="['corner-icon', isCopied(icon.name) ? 'pi pi-check' : 'pi pi-copy']" />
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredIcons.length === 0" class="empty-state">
      <i class="pi pi-search" style="font-size: 48px; opacity: 0.3;" />
      <p class="text-body-md text-muted" style="margin: 16px 0 4px;">No icons found</p>
      <p class="text-body-sm text-muted" style="margin: 0;">Try a different search term</p>
    </div>
  </div>
</template>

<style scoped>
.icon-grid-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Controls */
.controls {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-group {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted, #888);
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border-radius: 6px;
  border: 1px solid var(--border-default, #2a2a2a);
  background: var(--background-surface, #1a1a1a);
  color: var(--text-default, #eee);
  font-size: 14px;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--text-muted, #666);
}

.search-input:focus {
  outline: none;
  border-color: var(--border-primary, #fe601f);
}

.search-count {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: var(--text-muted, #888);
  font-family: 'Roboto Mono', monospace;
}

.size-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.size-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #888);
}

.size-slider {
  width: 100px;
  height: 4px;
  appearance: none;
  background: var(--border-default, #2a2a2a);
  border-radius: 2px;
  cursor: pointer;
}

.size-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--text-primary, #fe601f);
  cursor: pointer;
}

.size-value {
  font-size: 11px;
  font-family: 'Roboto Mono', monospace;
  color: var(--text-muted, #888);
  min-width: 40px;
}

/* Sections */
.icon-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-default, #eee);
  margin: 0;
}

.section-count {
  font-size: 11px;
  font-family: 'Roboto Mono', monospace;
  color: var(--text-muted, #888);
}

.section-desc {
  font-size: 13px;
  color: var(--text-muted, #888);
  margin: 0 0 8px;
}

.section-desc code {
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  background: rgba(138, 132, 236, 0.08);
  border: 1px solid rgba(138, 132, 236, 0.12);
  color: var(--text-accent, #8a84ec);
  padding: 1px 5px;
  border-radius: 3px;
}

/* Grid */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

@media (min-width: 640px) {
  .icon-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (min-width: 1024px) {
  .icon-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

.icon-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle, #1e1e1e);
  background: var(--background-surface, rgba(255, 255, 255, 0.02));
  cursor: pointer;
  transition: all 120ms ease;
  font: inherit;
  color: inherit;
}

.icon-card:hover {
  border-color: var(--border-primary, #fe601f);
  background: rgba(254, 96, 31, 0.04);
}

.icon-card i {
  color: var(--text-default, #eee);
}

.corner-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 10px !important;
  opacity: 0;
  transition: opacity 120ms ease;
}

.icon-card:hover .corner-icon.pi-copy {
  opacity: 0.5;
}

.corner-icon.pi-check {
  opacity: 1 !important;
  color: #22c55e !important;
}

.icon-name {
  font-size: 9px;
  font-family: 'Roboto Mono', monospace;
  color: var(--text-muted, #666);
  text-align: center;
  line-height: 1.2;
  width: 100%;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  border: 1px dashed var(--border-default, #2a2a2a);
  border-radius: 8px;
}
</style>
