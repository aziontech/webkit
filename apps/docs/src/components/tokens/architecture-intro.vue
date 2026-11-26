<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import { computed } from 'vue'

  import { messages } from '../../lib/i18n'

  const t = messages

  const layers = computed(() => [
    {
      step: '1',
      title: t.value.layerPrimitivesTitle,
      text: t.value.layerPrimitivesText
    },
    {
      step: '2',
      title: t.value.layerThemeTitle,
      text: t.value.layerThemeText
    },
    {
      step: '3',
      title: t.value.layerSemanticTitle,
      text: t.value.layerSemanticText
    }
  ])
</script>

<template>
  <section
    class="flex flex-col gap-(--spacing-sm)"
    aria-labelledby="token-architecture"
  >
    <div class="flex flex-col gap-(--spacing-2xs)">
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
        class="relative flex"
      >
        <Card class="w-full">
          <div class="flex h-full flex-col gap-(--spacing-xs)">
            <span class="text-overline-sm text-(--text-muted)"
              >{{ layer.step }} · {{ layer.title }}</span
            >
            <p class="text-body-sm text-(--text-default)">{{ layer.text }}</p>
          </div>
        </Card>
        <span
          v-if="at < layers.length - 1"
          class="absolute end-[calc(var(--spacing-sm)/-2)] top-1/2 z-1 hidden -translate-y-1/2 translate-x-1/2 rounded-full bg-(--bg-canvas) p-(--spacing-2xs) text-(--text-muted) md:flex rtl:-translate-x-1/2"
          aria-hidden="true"
        >
          <i class="az az-arrow-right" />
        </span>
      </li>
    </ol>
  </section>
</template>
