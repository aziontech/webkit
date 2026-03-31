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
  <div class="flex flex-col gap-8">
    <!-- Controls -->
    <div class="flex gap-5 items-center flex-wrap">
      <div class="relative flex-1 min-w-[200px] max-w-[400px]">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm" />
        <input
          v-model="searchQuery"
          type="text"
          class="w-full px-2.5 py-2.5 pl-9 rounded-md border border-default bg-surface text-default text-sm font-sans placeholder:text-muted focus:outline-none focus:border-primary"
          placeholder="Search icons by name..."
        />
        <span
          v-if="searchQuery"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted font-code"
        >
          {{ filteredIcons.length }} / {{ icons.length }}
        </span>
      </div>
      
      <div class="flex items-center gap-2.5">
        <label class="text-[10px] font-semibold uppercase tracking-wider text-muted">Size</label>
        <input
          v-model.number="iconSize"
          type="range"
          min="12"
          max="64"
          step="4"
          class="w-[100px] h-1 appearance-none bg-neutral-700 rounded cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <span class="text-[11px] font-code text-muted min-w-[40px]">{{ iconSize }}px</span>
      </div>
    </div>

    <!-- Azion Icons -->
    <div v-if="azionIcons.length > 0" class="flex flex-col gap-3">
      <div class="flex items-baseline gap-3">
        <h3 class="text-base font-semibold text-default m-0">Azion Icons</h3>
        <span class="text-[11px] font-code text-muted">{{ azionIcons.length }} / {{ totalAzion }}</span>
      </div>
      <p class="text-[13px] text-muted m-0 mb-2">
        Custom Azion product and technology icons.
      </p>
      
      <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
        <button
          v-for="icon in azionIcons"
          :key="icon.name"
          class="relative flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-md border border-subtle bg-surface cursor-pointer transition-all duration-100 font-inherit text-inherit hover:border-primary hover:bg-primary/5"
          :title="'Click to copy: ' + icon.icon"
          @click="copyIconCode(icon)"
        >
          <i :class="icon.icon" :style="{ fontSize: `${iconSize}px` }" class="text-default" />
          <span class="text-[9px] font-code text-muted text-center leading-tight w-full px-1 truncate max-w-20">{{ icon.name.replace('ai-', '') }}</span>
          <i :class="[
            'absolute top-1.5 right-1.5 text-[10px] transition-opacity duration-100',
            isCopied(icon.name) ? 'pi pi-check !opacity-100 text-success' : 'pi pi-copy opacity-0 group-hover:opacity-50'
          ]" />
        </button>
      </div>
    </div>

    <!-- PrimeIcons -->
    <div v-if="primeIcons.length > 0" class="flex flex-col gap-3">
      <div class="flex items-baseline gap-3">
        <h3 class="text-base font-semibold text-default m-0">PrimeIcons</h3>
        <span class="text-[11px] font-code text-muted">{{ primeIcons.length }} / {{ totalPrime }}</span>
      </div>
      <p class="text-[13px] text-muted m-0 mb-2">
        General-purpose UI icons from PrimeIcons.
      </p>
      
      <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
        <button
          v-for="icon in primeIcons"
          :key="icon.name"
          class="relative flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-md border border-subtle bg-surface cursor-pointer transition-all duration-100 font-inherit text-inherit hover:border-primary hover:bg-primary/5"
          :title="'Click to copy: ' + icon.icon"
          @click="copyIconCode(icon)"
        >
          <i :class="icon.icon" :style="{ fontSize: `${iconSize}px` }" class="text-default" />
          <span class="text-[9px] font-code text-muted text-center leading-tight w-full px-1 truncate max-w-20">{{ icon.name.replace('pi-', '') }}</span>
          <i :class="[
            'absolute top-1.5 right-1.5 text-[10px] transition-opacity duration-100',
            isCopied(icon.name) ? 'pi pi-check !opacity-100 text-success' : 'pi pi-copy opacity-0 group-hover:opacity-50'
          ]" />
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredIcons.length === 0" class="flex flex-col items-center justify-center px-5 py-[60px] border border-dashed border-default rounded-lg">
      <i class="pi pi-search text-5xl opacity-30" />
      <p class="text-body-md text-muted mt-4 mb-1">No icons found</p>
      <p class="text-body-sm text-muted m-0">Try a different search term</p>
    </div>
  </div>
</template>
