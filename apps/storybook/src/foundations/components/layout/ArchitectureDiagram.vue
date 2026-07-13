<script setup>
  /**
   * Token architecture — primitives → theme → responsive semantic (DESIGN.md)
   */
  defineProps({
    layers: {
      type: Array,
      default: () => [
        {
          number: 'Layer 1',
          title: 'Primitives',
          description: 'Raw palettes, shape, typography, and effects. Theme-invariant.',
          code: 'primitives/colors/colors.js'
        },
        {
          number: 'Layer 2',
          title: 'Theme',
          description: 'Light/dark semantic roles: primary, surfaces, text, borders, feedback.',
          code: 'tokens/theme/primary.js'
        },
        {
          number: 'Layer 3',
          title: 'Responsive semantic',
          description: 'Mobile-first bundles: texts.data.js, spacings.data.js.',
          code: 'text-heading-md · var(--spacing-md)'
        }
      ]
    }
  })
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-0 items-center mb-12"
  >
    <template
      v-for="(layer, index) in layers"
      :key="index"
    >
      <div class="bg-surface/5 border border-default rounded-[10px] px-5 py-5">
        <p class="text-overline-xs text-muted m-0 mb-1.5">{{ layer.number }}</p>
        <p class="text-body-sm text-default font-semibold m-0 mb-1.5">{{ layer.title }}</p>
        <p class="text-body-xs text-muted m-0 mb-3 leading-relaxed">{{ layer.description }}</p>
        <code
          class="font-code text-[11px] text-muted bg-white/[0.04] px-1.5 py-0.5 rounded block break-all"
          >{{ layer.code }}</code
        >
      </div>
      <div
        v-if="index < layers.length - 1"
        class="hidden md:block px-3.5 text-muted text-xl select-none text-center"
      >
        →
      </div>
    </template>
  </div>
</template>
