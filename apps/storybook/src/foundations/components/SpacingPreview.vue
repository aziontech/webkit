<script setup>
defineProps({
  /**
   * Spacing token object:
   * { name, category, label, property, description, desktop, tablet, mobile }
   */
  token: { type: Object, required: true },
});

/**
 * Parse a spacing value to get a numeric representation for visualization.
 * Returns the pixel value for display purposes.
 */
function parseValue(value) {
  if (!value) return 0;
  const match = value.match(/^(\d+(?:\.\d+)?)(px|rem)?$/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2] || 'px';
  return unit === 'rem' ? num * 16 : num;
}
</script>

<template>
  <div class="flex gap-6 py-5 border-b border-subtle items-start last:border-b-0 md:flex-col md:gap-4">
    <div class="flex-none w-80 flex flex-col gap-1.5 md:w-full">
      <p class="text-sm font-semibold text-default m-0">{{ token.label }}</p>
      <code class="font-code text-[11px] bg-white/[0.07] border border-white/15 text-code px-1.5 py-0.5 rounded w-fit">{{ token.name }}</code>
      <p class="text-xs text-muted m-0 mb-2 leading-relaxed">{{ token.description }}</p>
      
      <div class="grid grid-cols-2 gap-x-3 gap-y-1">
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Property</span>
          <span class="font-code text-[10px] text-muted">{{ token.property }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Desktop</span>
          <span class="font-code text-[10px] text-primary">{{ token.desktop }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Tablet</span>
          <span class="font-code text-[10px] text-muted">{{ token.tablet }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] font-semibold uppercase tracking-wider text-muted">Mobile</span>
          <span class="font-code text-[10px] text-muted">{{ token.mobile }}</span>
        </div>
      </div>
    </div>
    
    <div class="flex-1 min-w-0">
      <div class="bg-surface border border-default rounded-lg p-4 min-h-[80px] flex items-center justify-center">
        <div 
          v-if="token.property === 'max-width'"
          class="bg-primary/15 border-2 border-dashed border-primary rounded h-10 w-full flex items-center justify-center"
          :style="{ maxWidth: token.desktop }"
        >
          <span class="font-code text-[11px] text-muted">max-width</span>
        </div>
        
        <div 
          v-else-if="token.property.includes('padding')"
          class="bg-accent/15 rounded"
          :style="{ padding: token.desktop }"
        >
          <div class="bg-surface rounded px-3 py-2 min-w-[60px] text-center">
            <span class="font-code text-[11px] text-muted">{{ token.desktop }}</span>
          </div>
        </div>
        
        <div 
          v-else-if="token.property === 'gap'"
          class="flex w-full"
          :style="{ gap: token.desktop }"
        >
          <div class="flex-1 h-8 bg-success/30 rounded" />
          <div class="flex-1 h-8 bg-success/30 rounded" />
          <div class="flex-1 h-8 bg-success/30 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
