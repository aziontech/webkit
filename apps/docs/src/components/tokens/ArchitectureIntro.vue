<script setup lang="ts">
  import { computed } from 'vue'

  import { messages } from '../../lib/i18n'

  const t = messages

  const layers = computed(() => [
    {
      step: '1',
      title: t.value.layerPrimitivesTitle,
      text: t.value.layerPrimitivesText,
      code: 'var(--color-orange-600)'
    },
    {
      step: '2',
      title: t.value.layerThemeTitle,
      text: t.value.layerThemeText,
      code: 'var(--primary)'
    },
    {
      step: '3',
      title: t.value.layerSemanticTitle,
      text: t.value.layerSemanticText,
      code: 'text-heading-md · var(--spacing-md)'
    }
  ])
</script>

<template>
  <section
    class="flex flex-col gap-(--spacing-sm)"
    aria-labelledby="token-architecture"
  >
    <div class="flex flex-col gap-(--spacing-xxs)">
      <h2
        id="token-architecture"
        class="text-heading-sm"
      >
        {{ t.architectureTitle }}
      </h2>
      <p class="text-body-sm text-(--text-muted)">{{ t.architectureLead }}</p>
    </div>
    <ol class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-3">
      <li
        v-for="(layer, at) in layers"
        :key="layer.step"
        class="relative flex flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
      >
        <span class="text-overline-sm text-(--text-muted)"
          >{{ layer.step }} · {{ layer.title }}</span
        >
        <p class="text-body-sm text-(--text-default)">{{ layer.text }}</p>
        <code class="mt-auto break-all text-label-code-sm text-(--text-muted)">{{
          layer.code
        }}</code>
        <i
          v-if="at < layers.length - 1"
          class="pi pi-arrow-right absolute end-[calc(var(--spacing-sm)/-2)] top-1/2 z-1 hidden -translate-y-1/2 translate-x-1/2 rounded-full bg-(--bg-canvas) p-(--spacing-xxs) text-(--text-muted) md:block rtl:-translate-x-1/2 rtl:rotate-180"
          aria-hidden="true"
        />
      </li>
    </ol>
  </section>
</template>
