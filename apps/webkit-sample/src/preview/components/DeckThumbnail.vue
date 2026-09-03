<script setup>
  // ONE SLIDE AS A CELL — the unit the filmstrip and the overview grid are both made of.
  //
  // A thumbnail here is the REAL SLIDE, not a picture of one: DeckSlideCard mounts the same
  // SlideRenderer the deck and the presenter do. That is what the scaled stage buys
  // (SlideStage) — a 190px filmstrip cell and a 1920px artboard are the same DOM at two scales,
  // so a thumbnail can never show something the slide does not, and a copy fix lands in both the
  // moment it is typed.
  //
  // TWO KINDS, ONE CELL. The filmstrip puts the number to the LEFT of the card; the overview grid
  // puts it BELOW. That is the only difference between them, so it is a `data-kind` on the root
  // and two `order` / `gap` variants — not two components that drift apart.
  //
  // THE ROOT IS THE BUTTON, so a parent binds `@click` straight to it and every cell is reachable
  // by Tab — this component never has to invent an event of its own. `data-kind` and
  // `data-selected` carry the two variants, and the parts read them back through
  // `group-data-[…]`, which is the only way a state on the root can reach a child.
  //
  // NOTHING PRECEDES THAT ROOT IN THE TEMPLATE, comments included: Vue keeps template comments in
  // a dev build, so a comment above the root makes the component a FRAGMENT — two root nodes —
  // and a fragment silently drops the consumer's `class` and hands `$el` back as the comment node
  // instead of the element.
  import DeckSlideCard from './DeckSlideCard.vue'

  defineProps({
    /** The deck entry to render. */
    slide: { type: Object, required: true },
    /** 0-based position in the deck. Drives the number beside (rail) or below (grid) the card. */
    index: { type: Number, required: true },
    /** `rail` is the filmstrip cell — number to the left. `grid` is the overview cell — number below. */
    kind: { type: String, default: 'rail' },
    /** Marks this as the slide the canvas is showing. */
    selected: { type: Boolean, default: false }
  })
</script>

<template>
  <button
    type="button"
    :data-kind="kind"
    :data-selected="selected || null"
    :aria-current="selected ? 'true' : undefined"
    class="group flex w-full cursor-pointer text-left focus:outline-none data-[kind=grid]:flex-col data-[kind=grid]:gap-(--spacing-xs) data-[kind=rail]:items-center data-[kind=rail]:gap-(--spacing-sm)"
  >
    <span
      class="shrink-0 tabular-nums text-(--text-disabled) transition-colors duration-fast-02 ease-productive-entrance group-hover:text-(--text-muted) group-data-[selected]:text-(--primary) motion-reduce:transition-none group-data-[kind=grid]:order-2 group-data-[kind=grid]:text-label-md group-data-[kind=rail]:w-6 group-data-[kind=rail]:text-right group-data-[kind=rail]:text-label-code-md"
    >
      {{ index + 1 }}
    </span>

    <!-- `flex-1` only in the rail: in the grid the root is a COLUMN, and a `flex-basis: 0` child
         of an auto-height column resolves to zero height — the cell would vanish rather than
         letterbox. -->
    <DeckSlideCard
      :slide="slide"
      :selected="selected"
      class="min-w-0 group-data-[kind=rail]:flex-1"
    />
  </button>
</template>
