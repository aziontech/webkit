<script setup>
  // THE CELL SLIDES — the hairline box grid, the signature module of the framed language.
  //
  // The internal rules of this grid are NOT borders: the wrapper fills `--border-default` and
  // a 1px gap lets that fill show through between cells, so every cell draws its own opaque
  // background and the lines between them are the wrapper showing. One line per junction, by
  // construction — two adjacent borders could never composite to the same weight.
  //
  // THAT IS ALSO WHY THIS SLIDE BLEEDS. The grid carries no perimeter of its own; its outer
  // edge IS the frame's rules, which is what makes the module read as drawn on the slide
  // rather than as a card sitting on it. SlideRenderer gives these kinds a bleeding stage, so
  // the header owns its own padding and its own bottom rule — the same anatomy the design
  // system's section header has.
  //
  //   grid     2..4 cells of prose, each with an index
  //   metrics  3 or 6 figures, each in the display face over its caption
  import Overline from '@aziontech/webkit/overline'

  import { DESCRIPTION_MAX } from '../lib/deck-canvas.js'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  const cells = () => props.slide.cells ?? props.slide.metrics ?? []

  // Four cells go two-by-two rather than four across: at 16:9, four columns under a header
  // leaves each cell twice as tall as it is wide, and a column of prose that narrow breaks
  // every second word. Three stay in one row, which is the proportion a figure wants.
  //
  // Six is that same row, twice — a figure carries no prose, so a 539x305 cell is wide for
  // what sits in it rather than narrow, and the two rows read as one wall because the column
  // edges line up straight down the slide. It is the only count above four this grid takes.
  const columnClass = () => {
    const count = cells().length
    if (count === 6) return 'grid-cols-3 grid-rows-2'
    if (count === 3) return 'grid-cols-3'
    if (count <= 2) return 'grid-cols-2'
    return 'grid-cols-2 grid-rows-2'
  }
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- The header row: padded, and dividing itself from the body with the one rule it owns. -->
    <header
      class="flex shrink-0 flex-col gap-(--spacing-lg) border-b border-(--border-default) p-(--spacing-xxl)"
    >
      <Overline
        v-if="slide.eyebrow"
        prefix="//"
        show-cursor
        >{{ slide.eyebrow }}</Overline
      >
      <h2 class="m-0 text-balance text-heading-xl text-(--text-default)">{{ slide.headline }}</h2>
      <p
        v-if="slide.description"
        class="m-0 text-pretty text-heading-sm text-(--text-muted)"
        :style="{ maxWidth: `${DESCRIPTION_MAX}px` }"
      >
        {{ slide.description }}
      </p>
    </header>

    <div
      class="grid flex-1 gap-px bg-(--border-default)"
      :class="columnClass()"
    >
      <!-- Every cell fills the canvas colour. Without that fill the gap trick has nothing to
           show through against and the whole cell goes border-coloured. -->
      <!-- A prose cell pushes its index to the cell's top edge and its copy to the bottom, so a
           row of them aligns on both; a figure has no index and centres instead, because a
           number pinned to the bottom of a 400px cell reads as a footnote. -->
      <article
        v-for="cell in cells()"
        :key="cell.title ?? cell.label"
        class="flex flex-col gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
        :class="cell.index ? 'justify-between' : 'justify-center'"
      >
        <span
          v-if="cell.index"
          class="text-overline-sm text-(--text-disabled)"
          >{{ cell.index }}</span
        >

        <!-- A figure leads with the number in the display face; a prose cell leads with its
             title. Both close on the muted line, so the cells align on their last baseline. -->
        <div class="flex flex-col gap-(--spacing-sm)">
          <span
            v-if="cell.value"
            class="text-big-number-lg text-(--primary)"
            >{{ cell.value }}</span
          >
          <h3
            v-if="cell.title"
            class="m-0 text-balance text-heading-md text-(--text-default)"
          >
            {{ cell.title }}
          </h3>
          <p
            v-if="cell.label"
            class="m-0 text-pretty text-heading-sm text-(--text-default)"
          >
            {{ cell.label }}
          </p>
          <p
            v-if="cell.body || cell.note"
            class="m-0 text-pretty text-body-md text-(--text-muted)"
          >
            {{ cell.body ?? cell.note }}
          </p>
        </div>
      </article>
    </div>
  </div>
</template>
