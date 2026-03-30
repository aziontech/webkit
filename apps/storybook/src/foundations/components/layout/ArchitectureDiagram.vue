<script setup>
/**
 * ArchitectureDiagram - Visual representation of token architecture
 * Shows the flow from primitives to semantic to specific tokens
 */
defineProps({
  layers: {
    type: Array,
    default: () => [
      {
        number: 'Layer 1',
        title: 'Primitive Colors',
        description: 'Raw palette values. 9 color families × 11 shades each.',
        code: 'primitives.brand.500'
      },
      {
        number: 'Layer 2',
        title: 'Semantic Tokens',
        description: 'Intent-based roles with automatic light/dark resolution.',
        code: 'text-primary'
      },
      {
        number: 'Layer 3',
        title: 'Specific Tokens',
        description: 'Class names for specific components.',
        code: 'text-button-primary'
      }
    ]
  }
})
</script>

<template>
  <div class="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-0 items-center mb-12">
    <template v-for="(layer, index) in layers" :key="index">
      <div class="bg-surface/5 border border-default rounded-[10px] px-5 py-5">
        <p class="text-overline-xs text-muted m-0 mb-1.5">{{ layer.number }}</p>
        <p class="text-body-sm text-default font-semibold m-0 mb-1.5">{{ layer.title }}</p>
        <p class="text-body-xs text-muted m-0 mb-3 leading-relaxed">{{ layer.description }}</p>
        <code class="font-code text-[11px] text-muted bg-white/[0.04] px-1.5 py-0.5 rounded">{{ layer.code }}</code>
      </div>
      <div
        v-if="index < layers.length - 1"
        class="px-3.5 text-muted text-xl select-none"
      >
        →
      </div>
    </template>
  </div>
</template>
