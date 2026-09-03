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
  // the syntax palette, the line-number gutter and the staggered line entrance. It keeps its
  // own card border and its `--shape-elements` radius: the half is a ground, not a frame, so
  // the snippet has to say where it ends. Without the rule it dissolved into the surface it
  // sits on — the two share `--bg-surface` — and the half read as a page of code rather than
  // as one artefact quoted beside the claim.
  import CodeBlock from '@aziontech/webkit/code-block'
  import DotGridBanner from '@shared/ui/banners/DotGridBanner.vue'

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

    <!-- The evidence half is a surface, one step up from the canvas, carrying the site's own
         hero lattice in the brand ink: the snippet is a card ON a ground, and the ground has
         to be visibly one — a bare surface at this size read as empty space the card had been
         dropped into. The dots are the marketing site's `dot-grid`, pitch and geometry
         untouched, with only `--dot-grid-ink` swapped for `--primary`; at a 2px dot on a 48px
         lattice the field is 0.17% ink, so full-strength orange scatters rather than glows and
         never competes with the code's own syntax colour. `min-h-0` is what keeps a long
         snippet scrolling inside the half instead of stretching the grid row past the frame. -->
    <div
      class="relative flex min-h-0 flex-col justify-center overflow-hidden bg-(--bg-surface) p-(--spacing-xxl)"
    >
      <DotGridBanner class="[--dot-grid-ink:var(--primary)]" />

      <!-- The snippet's properties, stated as the artefact's own tags rather than as another
           bullet in the claim opposite: they are what the file IS, so they sit on the evidence
           side, on the panel's own left edge, in the panel's own face. Drawn here rather than
           composed from the design system's Chip for the reason SlideEvidence gives — a 24px
           control with a 12px label is a caption on a 1920px artboard — so the row keeps the
           chip's tokens (the rule, the surface fill) at the scale this canvas reads at. The
           fill is not decoration: the lattice runs under this whole half, and a tag has to
           cover it the same way the panel below does or the dots read through the words. -->
      <ul
        v-if="slide.code.tags"
        class="relative m-0 flex list-none flex-wrap gap-(--spacing-sm) p-0"
      >
        <li
          v-for="tag in slide.code.tags"
          :key="tag"
          class="inline-flex items-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-lg) py-(--spacing-sm) text-label-code-lg text-(--text-muted)"
        >
          {{ tag }}
        </li>
      </ul>

      <!-- TWO OVERRIDES, BOTH BECAUSE THIS IS AN ARTBOARD AND NOT A PAGE, and both hung on the
           component's own testids — the surface .claude/rules/testid.md makes a public,
           structure-independent handle — rather than on its internal markup.
           TYPE: CodeBlock sets its lines at `text-label-code-sm` (12px), which is right in a
           console panel read at arm's length and is half the size of the description opposite
           when the same 12px is projected as 1/1920th of a wall. `text-label-code-lg` (16px) is
           the top of the code ladder and the closest step to this deck's own body copy; there
           is no larger code token, and a raw length is the one thing a slide may not write.
           HEIGHT: the component caps its content at 320px and scrolls past it, which a slide
           cannot do — a snippet that outgrew the cap would go silently short on the wall. The
           cap comes off, so the panel always states its full height and an over-long snippet
           shows up here as a slide that overflows its frame, which is a thing you can see.
           THE BACKSLASHES ARE LOAD-BEARING: Tailwind reads `_` in an arbitrary variant as a
           SPACE, so the unescaped form compiles to `[data-testid^=data-code-block line]` — a
           selector that matches nothing, emits no error, and leaves the panel exactly as it
           was. `\_\_` is what keeps the testid's own underscores. -->
      <CodeBlock
        :tabs="tabs()"
        animate-lines
        show-line-numbers
        class="relative [&_[data-testid^=data-code-block\_\_line]]:text-label-code-lg [&_[data-testid=data-code-block\_\_content]]:max-h-none"
      />
    </div>
  </div>
</template>
