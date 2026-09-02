<script setup>
  // THE SPACING SPECIMEN — the scale, the canvas, and the grid, all at their real size.
  //
  // Three things, each drawn rather than described:
  //
  //   THE SCALE      seven bars, each exactly as wide as the token it names. `w-(--spacing-xl)`
  //                  is the token, so a bar cannot disagree with the value beside it.
  //   THE CANVAS     the slide's own geometry at 1:4 — bezel, frame, padding, content box.
  //                  Every number comes from lib/deck-canvas.js, the same module the Figma
  //                  build reads, so this diagram is the contract and not an illustration of it.
  //   THE GRID       the 12 columns at 1:1. The strip below runs the full content width, which
  //                  is why the columns under it are 97px and not "about 97": twelve of them
  //                  plus eleven 24px gutters is 1428, the content box, with nothing left over.
  import { CANVAS, CONTENT, FRAME, FRAME_PADDING, GRID, span } from '../lib/deck-canvas.js'
  import SlideHeading from './SlideHeading.vue'

  defineProps({
    slide: { type: Object, required: true }
  })

  // The steps, largest first, each paired with the utility that draws it at its own width.
  const STEPS = [
    { token: 'spacing-xxl', width: 'w-(--spacing-xxl)', px: '96' },
    { token: 'spacing-xl', width: 'w-(--spacing-xl)', px: '48' },
    { token: 'spacing-lg', width: 'w-(--spacing-lg)', px: '24' },
    { token: 'spacing-md', width: 'w-(--spacing-md)', px: '16' },
    { token: 'spacing-sm', width: 'w-(--spacing-sm)', px: '12' },
    { token: 'spacing-xs', width: 'w-(--spacing-xs)', px: '8' },
    { token: 'spacing-xxs', width: 'w-(--spacing-xxs)', px: '4' }
  ]

  // 1:4, so the whole 1920x1080 canvas fits beside the scale without either shrinking below
  // legibility. The divisor is stated on the slide — a diagram at an unstated scale is a lie.
  const S = 4
  const at = (n) => `${n / S}px`
</script>

<template>
  <div class="flex h-full flex-col gap-(--spacing-lg)">
    <SlideHeading
      :eyebrow="slide.eyebrow"
      :headline="slide.headline"
      :description="slide.description"
    />

    <div class="flex flex-1 items-start gap-(--spacing-xxl)">
      <!-- The scale. Bars are measured by the token, labelled by its name and its value. -->
      <dl class="m-0 flex flex-1 flex-col">
        <div
          v-for="step in STEPS"
          :key="step.token"
          class="flex items-center gap-(--spacing-md) border-t border-(--border-muted) py-(--spacing-xs) first:border-t-0"
        >
          <dt class="m-0 w-40 shrink-0 text-label-code-md text-(--primary)">{{ step.token }}</dt>
          <dd class="m-0 flex flex-1 items-center gap-(--spacing-md)">
            <span
              class="h-2 shrink-0 bg-(--primary)"
              :class="step.width"
            />
            <span class="text-label-md text-(--text-muted)">{{ step.px }} px</span>
          </dd>
        </div>
      </dl>

      <!-- The canvas, drawn. The outer box is the artboard, the inner box the frame, and the
           dashed box the content the layouts actually fill. -->
      <figure
        class="m-0 flex shrink-0 flex-col gap-(--spacing-sm)"
        :style="{ width: at(CANVAS.width) }"
      >
        <div
          class="relative border border-(--border-muted) bg-(--bg-surface-raised)"
          :style="{ height: at(CANVAS.height) }"
        >
          <div
            class="absolute border border-(--border-strong) bg-(--bg-canvas)"
            :style="{
              left: at(FRAME.x),
              top: at(FRAME.y),
              width: at(FRAME.width),
              height: at(FRAME.height)
            }"
          />
          <div
            class="absolute border border-dashed border-(--primary)"
            :style="{
              left: at(CONTENT.x),
              top: at(CONTENT.y),
              width: at(CONTENT.width),
              height: at(CONTENT.height)
            }"
          />
        </div>
        <figcaption class="text-label-md text-(--text-muted)">
          1 : {{ S }} — canvas {{ CANVAS.width }}×{{ CANVAS.height }} · frame {{ FRAME.width }}×{{
            FRAME.height
          }}
          at {{ FRAME.x }},{{ FRAME.y }} · padding {{ FRAME_PADDING }} · content
          {{ CONTENT.width }}×{{ CONTENT.height }}
        </figcaption>
      </figure>
    </div>

    <!-- The grid at 1:1. This strip is the content box, so its twelve fractions ARE the 97px
         column — nothing here is scaled, and the numbers below it can be measured off the slide. -->
    <figure class="m-0 flex shrink-0 flex-col gap-(--spacing-sm)">
      <div class="grid grid-cols-12 gap-(--spacing-lg)">
        <span
          v-for="i in GRID.columns"
          :key="i"
          class="h-12 bg-(--primary-mask)"
        />
      </div>
      <figcaption class="text-label-md text-(--text-muted)">
        1 : 1 — {{ GRID.columns }} columns · {{ GRID.column }} px · {{ GRID.gutter }} px gutter ·
        {{ GRID.columns }} × {{ GRID.column }} + {{ GRID.columns - 1 }} × {{ GRID.gutter }} =
        {{ span(GRID.columns) }} px
      </figcaption>
    </figure>
  </div>
</template>
