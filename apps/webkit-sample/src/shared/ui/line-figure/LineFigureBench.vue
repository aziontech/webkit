<script setup lang="ts">
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { useTheme } from '@shared/lib/theme.js'
  import { computed, ref, useId } from 'vue'

  import { lineFigureNames } from './figures/registry'
  import LineFigure from './LineFigure.vue'

  defineOptions({ name: 'LineFigureBench' })

  type ThemeValue = 'system' | 'dark' | 'light'

  const { theme } = useTheme()
  const themeValue = computed<ThemeValue>({
    get: () => (theme.value as ThemeValue | null) ?? 'system',
    set: (next) => {
      theme.value = next
    }
  })
  const intensity = ref(0.5)
  const play = ref(false)
  const name = ref(lineFigureNames[0])
  const captions = ref<Record<string, string>>({})
  const sliderId = useId()

  function onRead(stage: string, caption: string) {
    captions.value = { ...captions.value, [stage]: caption }
  }
</script>

<template>
  <main
    data-testid="shared-line-figure-bench"
    class="flex min-h-dvh w-full flex-col gap-(--spacing-xl) bg-(--bg-canvas) px-(--spacing-lg) py-(--spacing-xl) text-(--text-default)"
  >
    <header class="flex flex-wrap items-end justify-between gap-(--spacing-md)">
      <div class="flex flex-col gap-(--spacing-xxs)">
        <h1 class="text-heading-md">Line figures</h1>
        <p class="text-body-sm text-(--text-muted)">
          One stroke in four weights. Hover a stage; the read-out names what is under the pointer.
        </p>
      </div>
      <ThemeSwitcher
        v-model:value="themeValue"
        aria-label="Theme"
      />
    </header>

    <section class="flex flex-wrap items-center gap-(--spacing-lg)">
      <div class="flex min-w-64 flex-col gap-(--spacing-xxs)">
        <label
          :for="sliderId"
          class="text-label-sm text-(--text-default)"
        >
          Intensity · {{ intensity.toFixed(2) }}
        </label>
        <input
          :id="sliderId"
          v-model.number="intensity"
          type="range"
          min="0"
          max="1"
          step="0.05"
          class="accent-(--primary)"
        />
      </div>
      <FieldSwitch
        v-model="play"
        label="Play"
        description="Walks the tour until a pointer arrives."
      />
      <label class="flex items-center gap-(--spacing-xs) text-label-sm">
        Figure
        <select
          v-model="name"
          class="rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm"
        >
          <option
            v-for="option in lineFigureNames"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </label>
    </section>

    <section class="grid gap-(--spacing-xl) md:grid-cols-[240px_400px] md:items-start">
      <figure class="flex flex-col gap-(--spacing-xs)">
        <div class="w-60">
          <LineFigure
            :name="name"
            :intensity="intensity"
            :play="play"
            @read="(caption) => onRead('small', caption)"
          />
        </div>
        <figcaption class="flex justify-between text-body-code-sm text-(--text-muted)">
          <span>240px</span>
          <span>{{ captions.small ?? '' }}</span>
        </figcaption>
      </figure>
      <figure class="flex flex-col gap-(--spacing-xs)">
        <div class="w-100">
          <LineFigure
            :name="name"
            :intensity="intensity"
            :play="play"
            @read="(caption) => onRead('large', caption)"
          />
        </div>
        <figcaption class="flex justify-between text-body-code-sm text-(--text-muted)">
          <span>400px</span>
          <span>{{ captions.large ?? '' }}</span>
        </figcaption>
      </figure>
      <figure class="flex flex-col gap-(--spacing-xs) md:col-span-2">
        <div
          class="w-80 rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) [--line-figure-plate:var(--bg-surface)]"
        >
          <LineFigure
            :name="name"
            :intensity="intensity"
            :play="play"
            @read="(caption) => onRead('card', caption)"
          />
        </div>
        <figcaption class="flex justify-between text-body-code-sm text-(--text-muted)">
          <span>on a card (plate = surface)</span>
          <span>{{ captions.card ?? '' }}</span>
        </figcaption>
      </figure>
    </section>
  </main>
</template>
