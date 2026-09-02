<script setup>
  // THE SPLIT SLIDE — an argument beside its evidence, divided by exactly one rule.
  //
  // Two halves of the content box in a `gap-px` grid over `--border-default`: the gap is the
  // divider, so the rule between the halves is the wrapper showing through and neither half
  // draws a border of its own. Like the cell grid, this slide bleeds — the halves' outer edges
  // are the frame's rules — which is what lets the divider run the frame's full height and
  // meet the top and bottom rules exactly.
  //
  // The code half uses the design system's CodeBlock, not a hand-built panel: it already owns
  // the syntax palette, the line-number gutter and the staggered line entrance. `border` is
  // off because this half is already framed, and passing it would put a second rule 48px
  // inside the first.
  import CodeBlock from '@aziontech/webkit/code-block'

  import { DESCRIPTION_MAX } from '../lib/deck-canvas.js'
  import SlideHeading from './SlideHeading.vue'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  const tabs = () => {
    const { code } = props.slide
    return [
      {
        label: code.fileName,
        value: 'source',
        code: code.code,
        language: code.language ?? 'html',
        fileName: code.fileName
      }
    ]
  }
</script>

<template>
  <div class="grid h-full grid-cols-2 gap-px bg-(--border-default)">
    <div class="flex flex-col justify-center bg-(--bg-canvas) p-(--spacing-xxl)">
      <SlideHeading
        :eyebrow="slide.eyebrow"
        :headline="slide.headline"
        :description="slide.description"
      />
    </div>

    <!-- The evidence half is a surface, one step up from the canvas, so the snippet reads as
         an inset panel without needing a border to say so. `min-h-0` is what keeps a long
         snippet scrolling inside the half instead of stretching the grid row past the frame. -->
    <div class="flex min-h-0 flex-col justify-center bg-(--bg-surface) p-(--spacing-xxl)">
      <CodeBlock
        :tabs="tabs()"
        :border="false"
        animate-lines
        show-line-numbers
        :style="{ maxWidth: `${DESCRIPTION_MAX}px` }"
      />
    </div>
  </div>
</template>
