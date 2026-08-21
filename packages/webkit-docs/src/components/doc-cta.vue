<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import { useId } from 'vue'

  /**
   * The rail's CLOSING OFFER — the one commercial block on a documentation page,
   * parked at the foot of "On this page".
   *
   * It sits BELOW the outline and the complementary groups, last in the rail, for
   * the same reason the outline is first: a reader who opened this page came to
   * read it, and the rail's job is to serve that reading before it asks for
   * anything. By the time the eye reaches the bottom of the rail the page has
   * already been offered its own sections, its repository and its community — so
   * the sell arrives after the help, not in front of it.
   *
   * IT IS A DOCS CARD, BUILT THE WAY EVERY OTHER CARD ON THE PAGE IS. Square, one
   * hairline per edge, four corner registration marks — the same `FrameBox` the
   * `DocCardGroup` grid and the section bands draw, at the same
   * `--border-default`. A rounded, brand-coloured box would have been a second
   * card language on one screen, competing with the frame the reader has already
   * scrolled past three times. The frame is the page's; only what is INSIDE it is
   * this block's.
   *
   * ITS FACE IS `--bg-surface`, FLAT. That is the whole of what separates it from
   * the rail around it: everything above it is bare links on `--bg-canvas`, so one
   * step up the surface palette is already enough to read as a distinct object,
   * and it is the step `DocCard` itself moves to on hover. A brand-tinted wash was
   * the first answer and it was doing too much — at 223x265 a 20% orange is not a
   * tint but a face, and one loud enough to invert the rail's hierarchy (the offer
   * shouting over the page's own sections) while flattening the block's internal
   * one at the same time. The colour in this block belongs to the wordmark and the
   * primary button, which is where a reader's eye should land anyway.
   *
   * THE INTERNAL RHYTHM IS `DocCard`'S, not a new one: mark, then
   * `--spacing-md`, then the title, then the copy only `--spacing-xxs` under it so
   * it reads as that title's subtitle rather than a third loose line. The box model
   * is `px-6 py-5` for the same reason — it is the reference inset every cell on
   * the page already uses.
   *
   * IT IS SET ON THE RAIL'S SCALE, THOUGH, NOT THE PROSE COLUMN'S. `DocCard` sits
   * in a 300-400px grid cell and reads at 16/14; the same pair in a 173px measure
   * is a block whose own copy is larger than the outline sitting above it, which
   * inverts the rail's hierarchy — the offer would out-shout the page's own
   * sections. So the ladder drops one step across the board: 14px headline
   * (`text-heading-xxs`), 12px copy (`text-body-xs`, the size the outline links
   * are), and the mark at 14px. The block then reads as the loudest thing in the
   * rail because of its surface, not because of its type.
   *
   * THE LOCKUP IS THE WORDMARK ALONE, at 14px tall — the headline's own size,
   * standing where a `DocCard` opens with its glyph. Not at the glyph's 24px: the
   * wordmark is a 5:1 lockup, so 24px tall is 120px wide in a 173px column and the
   * block opens with a masthead instead of a mark. At 14px it is 70px, under half
   * the measure — the mass of a glyph rather than of a title. It is the `small`
   * token trimmed by 2px rather than a fourth size, because `Brand` ships 16/24/32
   * and 16 is still a fifth wider than the headline it sits over. The extended
   * lockup
   * was the first try and it was wrong twice over: its tagline is set to read at
   * poster size, so at 24px in a 225px rail it is a grey smudge under the letters,
   * and it ships as a fixed near-white (`#EDEDED`) because the brand sheet draws it
   * on dark — invisible on a light canvas without recolouring a path by hand. The
   * wordmark on its own needs neither fix: it is `--primary` orange in both themes
   * by design, and it is the whole of what this block has to say about whose
   * platform it is.
   *
   * The actions stack full-width rather than sitting side by side: the rail is
   * 225px, and two buttons across it would each be too narrow to hold their label
   * without wrapping. Stacked, the primary is unambiguously first.
   */
  defineOptions({ name: 'DocCta' })

  interface Props {
    /** The offer's headline. */
    title?: string
    /** Fallback copy when the default slot is empty. */
    label?: string
    /** The primary action's label. */
    primaryLabel?: string
    /** Where the primary action goes. */
    primaryHref?: string
    /** The secondary action's label; empty renders no secondary action. */
    secondaryLabel?: string
    /** Where the secondary action goes. */
    secondaryHref?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Ready to build?',
    label: '',
    primaryLabel: 'Start for free',
    primaryHref: '',
    secondaryLabel: '',
    secondaryHref: ''
  })

  defineSlots<{
    /** The offer's copy. */
    default(): unknown
  }>()

  // The block is a complementary landmark, named by the headline it already
  // renders — `aria-labelledby` rather than `aria-label` so the name and the
  // visible text cannot drift apart. It rides on `FrameBox`'s own root through
  // `$attrs`, so the frame and the landmark are one element rather than a wrapper
  // around one.
  const titleId = useId()
</script>

<template>
  <FrameBox
    data-testid="doc-cta"
    role="complementary"
    :aria-labelledby="titleId"
    class="w-full"
  >
    <!-- One step up the surface palette from the rail's canvas, and opaque, so the
         block reads as its own object wherever it is dropped. -->
    <div class="flex flex-col bg-(--bg-surface) px-6 py-5">
      <Brand
        kind="default"
        size="small"
        class="mb-(--spacing-md) [&>svg]:h-3.5!"
      />

      <p
        :id="titleId"
        class="m-0 text-heading-xxs text-(--text-default)"
      >
        {{ title }}
      </p>

      <p
        v-if="$slots.default || label"
        class="m-0 mt-(--spacing-xxs) text-pretty text-body-xs text-(--text-muted)"
      >
        <slot>{{ label }}</slot>
      </p>

      <div class="mt-(--spacing-md) flex flex-col gap-(--spacing-xs)">
        <Button
          :label="primaryLabel"
          :href="primaryHref"
          size="medium"
          class="w-full"
        />
        <Button
          v-if="secondaryLabel"
          :label="secondaryLabel"
          :href="secondaryHref"
          kind="outlined"
          size="medium"
          class="w-full"
        />
      </div>
    </div>
  </FrameBox>
</template>
