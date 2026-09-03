<script setup>
  // THE CATALOGUE SLIDE — the whole product surface, in one wall.
  //
  // Every other slide in this deck argues something: a pressure, a perimeter, a table of
  // differences, three reasons. This one answers the question those raise last — "what is
  // actually in it?" — and the only thing it has to do is let a room find a name fast. So it
  // is a wall of four columns and nothing else: no drawing, no claim, no order to read it in.
  //
  // ── FOUR FRAMES ON THE DECK'S OWN GRID ──
  //
  // Each column is a FrameBox — the design system's framed box, the same component SlideStage
  // draws the deck's perimeter with — so a column reads as an object on the slide rather than
  // as a run of text that happens to be near other runs of text. Four columns with the grid's
  // own `--spacing-lg` gutter is the deck's own three-column module four times over — CONTENT
  // is 1428 wide and 4*span(3) + 3*24 comes to exactly that, so the wall sits on the same grid
  // every other slide measures from, and the Figma build reads the columns off `span(3)`.
  //
  // Measured, a column is 338.5 rather than 339: the deck's frame is a 1px rule on each side,
  // so the box the padding actually leaves is 1426, not the 1428 lib/deck-canvas.js names. The
  // whole deck carries that 2px (SlidePlatform subtracts it by hand for its drawing's height),
  // and a 24px gutter cannot divide what is left into four whole pixels — 22 or 26 could, and
  // neither is a step of the scale. The half-pixel goes to the two inner rules; the wall keeps
  // the deck's gutter.
  //
  // THE GUTTER IS WHY EACH FRAME IS WHOLE. Butting the four together (`flush="left"`, as the
  // site's frames do down a page) would be the tighter wall, but a shared edge means two
  // registration marks 8px apart at every junction — FrameBox's own contract says address the
  // corners individually when frames abut, and what that costs here is the very thing the
  // instruction asked for: four boxes each with its four marks. Separated by one gutter, no
  // rule is drawn twice and no mark has a neighbour.
  //
  // ── THE HEAD IS CENTRED, WHICH NOTHING ELSE IN THE DECK IS ──
  //
  // A left-aligned head points at the first column. On an argument slide that is correct — the
  // eye should start where the reading starts — but there is no first column here: the four
  // are peers, and the only question is which one holds the name you came for. A centred head
  // sits over the wall instead of at the head of a list.
  //
  // ── TWO GREYS AND ONE BLUE ──
  //
  // Orange is spent on the four column labels, because the taxonomy IS the navigation of this
  // slide. That is why the eyebrow above the headline is muted rather than the deck's usual
  // orange Overline: two oranges on one slide and the labels stop being the way in.
  //
  // The NEW marker is a Tag at `severity="info"` — the palette's blue, and the deck's only
  // one. It has to read as an annotation ON a product, not as an emphasis of it, and every
  // warm step in the palette is already an emphasis somewhere in this deck (orange names, red
  // warns, green confirms). Blue is the one hue with nothing else to say here.
  //
  // ── WHAT THE DATA CARRIES, AND WHAT IT DOES NOT ──
  //
  //   name   the product
  //   note   a parenthetical ON the name — a roadmap quarter (`Q1/27`) or a qualifier
  //          (`with Vector`). One shape for both, because they are the same typographic
  //          object: a smaller, muted aside that must not be mistaken for a second product.
  //   tag    the blue marker, `New` today. A string rather than a boolean, so a second kind
  //          of marker is a content edit and not a layout change.
  //   parts  capabilities sold as part of the product above, not beside it. They are nested
  //          in the data because they are nested in the offer — a flat list with an `indent`
  //          flag would let a part outlive its product on an edit.
  //
  // Nothing here decides a colour or a size, as everywhere in data/deck.js: a quarter is a
  // fact about the roadmap, and how a roadmap fact is drawn is this file's business.
  import FrameBox from '@aziontech/webkit/frame-box'
  import Tag from '@aziontech/webkit/tag'

  defineProps({
    slide: { type: Object, required: true }
  })
</script>

<template>
  <div class="flex h-full flex-col gap-(--spacing-xl)">
    <header class="flex shrink-0 flex-col items-center gap-(--spacing-lg) text-center">
      <span
        v-if="slide.eyebrow"
        class="text-overline-md uppercase text-(--text-muted)"
        >{{ slide.eyebrow }}</span
      >
      <h2 class="m-0 text-balance text-heading-2xl text-(--text-default)">{{ slide.headline }}</h2>
    </header>

    <!-- `items-stretch` is the default and the point: the four frames share a bottom rule even
         though OBSERVE holds four products and BUILD holds thirteen rows. A wall whose boxes
         end where their content ends is four cards, not a catalogue. -->
    <div class="grid flex-1 grid-cols-4 gap-(--spacing-lg)">
      <FrameBox
        v-for="column in slide.columns"
        :key="column.label"
        class="p-(--spacing-lg)"
      >
        <div class="flex flex-col gap-(--spacing-lg)">
          <span class="text-overline-md uppercase text-(--primary)">{{ column.label }}</span>

          <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
            <li
              v-for="product in column.products"
              :key="product.name"
            >
              <!-- Baseline alignment, so the name, its parenthetical and its Tag sit on one
                   line of type rather than on three centres. `flex-wrap` is the safety net for
                   the longest row this slide holds ("Private Access (Q1/27) New"): it wraps
                   inside the column instead of pushing the frame's rule. -->
              <div class="flex flex-wrap items-baseline gap-x-(--spacing-xs) gap-y-(--spacing-xxs)">
                <span class="text-heading-sm text-(--text-default)">{{ product.name }}</span>
                <span
                  v-if="product.note"
                  class="text-body-md text-(--text-muted)"
                  >({{ product.note }})</span
                >
                <Tag
                  v-if="product.tag"
                  severity="info"
                  size="small"
                  >{{ product.tag }}</Tag
                >
              </div>

              <!-- The parts, one step in and one step down: indented by `--spacing-md` so the
                   nesting is legible at the back of a room, and in the muted ink because they
                   are the product's inside, not another entry in the catalogue. -->
              <ul
                v-if="product.parts"
                class="m-0 mt-(--spacing-xs) flex list-none flex-col gap-(--spacing-xxs) p-0 pl-(--spacing-md)"
              >
                <li
                  v-for="part in product.parts"
                  :key="part"
                  class="text-body-md text-(--text-muted)"
                >
                  {{ part }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </FrameBox>
    </div>
  </div>
</template>
