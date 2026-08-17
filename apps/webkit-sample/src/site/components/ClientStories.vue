<script setup>
  // Client stories — Figma `Illustrations` nodes 365:114155 / 365:114206.
  //
  // A section title with a trailing action, then a horizontally scrolling row of
  // client cards, each closing on a "Read the story" action.
  //
  // Figma → ours:
  //   • Its `Button` and `ButtonMini` instances are webkit components (the Button
  //     carries a Code Connect mapping), so they come from the DS rather than being
  //     redrawn: Button `secondary/large`, MiniButton with its trailing icon. Its two
  //     `IconButton` chevrons are not drawn — see "The row has no controls" below.
  //   • THE CARD WEARS THE CLIENT'S BRAND (Figma node 456:140792). Each card is painted
  //     in the client's own colour — Renner red, MadeiraMadeira orange, HeroSpark pink,
  //     Magalu blue — with the client's symbol centred on it and its white wordmark on
  //     the bottom-start edge. The colours are the one deliberate exception to
  //     tokens-only, and they live in the client registry (`ui/clients/index.js`), not
  //     here: a brand's red is a fact about that client, like its logo file. This
  //     component reads `client.brand` and hard-codes nothing.
  //     The two 354px ellipses the design floats over the fill (top-left and
  //     bottom-centre) are CSS radial-gradients in the same brand colour — one recipe,
  //     driven by data, rather than four exported PNGs.
  //   • The section sits on plain canvas — no textured backdrop behind the cards, which
  //     carry a brand fill of their own and are the only colour the band needs.
  //   • Copy is the design's, in English (the design's own strings are Portuguese; the
  //     rest of this page is English, so the wording stays and only the design changes).
  //     The design authors two stories and repeats them across its cards; that
  //     repetition is carried here as-is and needs the real per-client stories before
  //     this ships.
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MiniButton from '@aziontech/webkit/mini-button'
  import Overline from '@aziontech/webkit/overline'
  import { SectionModule } from '@shared/ui/layout/index.js'

  import { CLIENTS } from '../ui/index.js'

  const byName = (name) => CLIENTS.find((client) => client.name === name)

  // The card face, from the client's own colours: the flat brand fill, then the two
  // ellipses the design floats over it — top-left and bottom-centre, the geometry the
  // Figma frame uses. Everything else about the card is tokens.
  const cardFace = (client) => ({
    background: [
      `radial-gradient(354px 354px at -15% -15%, ${client.brand.glow}, transparent 70%)`,
      `radial-gradient(354px 354px at 45% 115%, ${client.brand.glow}, transparent 70%)`,
      client.brand.base
    ].join(', ')
  })

  // PLACEHOLDER PAIRING: the design authors two stories and repeats them. Kept as
  // designed so nothing is invented about a client that the design does not claim.
  const HEROSPARK_STORY =
    'HeroSpark sped up access to its education platform and scaled content delivery to thousands of students and creators on Azion’s distributed infrastructure.'
  const MAGALU_STORY =
    'See how Magalu runs zero-trust security on Azion, improving availability and web application security with effective bot management.'

  // The four clients the design tells a story for — the four that ship a symbol and a
  // white wordmark. A card without both would have an empty centre, so the row is the
  // set that has them, not a longer list padded out.
  const stories = [
    { key: 'renner', client: byName('Renner'), story: MAGALU_STORY },
    { key: 'madeira', client: byName('MadeiraMadeira'), story: HEROSPARK_STORY },
    { key: 'herospark', client: byName('HeroSpark'), story: HEROSPARK_STORY },
    { key: 'magalu', client: byName('Magalu'), story: MAGALU_STORY }
  ]

  // The row has no controls of its own: it is a scroll container with snap points, so a
  // trackpad, a swipe, a shift-wheel and the keyboard all already move it, and a pair of
  // chevrons under it only duplicated what the surface does natively — while implying the
  // row is the one thing on the page you cannot simply drag.
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
    class="relative overflow-hidden"
  >
    <!-- The header is its own frame in the `#header` slot, the way every other section on
         this page is built — it draws the band's opening rule and the rule that divides
         the copy from the body, so the header is a boundary rather than the top of a
         single tall box.

         A FrameBox around this markup rather than SectionTitle, because the design's
         header here is a 3-column split (heading against the start edge, supporting line
         in the third column, action under both) and SectionTitle's `horizontal` layout
         puts its action in a centred row. Same boundary either way; the markup stays. -->
    <template #header>
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div
          class="flex flex-col gap-[var(--spacing-xl)] px-[var(--spacing-xl)] py-[var(--spacing-xxl)]"
        >
          <Overline
            prefix="//"
            show-cursor
            >Clients</Overline
          >
          <div class="grid gap-[var(--spacing-xl)] lg:grid-cols-3">
            <h2 class="col-span-2 m-0 text-balance text-heading-xl text-[var(--text-default)]">
              Organizations shaping the future of the web with us
            </h2>
            <p class="m-0 text-pretty text-heading-sm text-[var(--text-muted)]">
              From payments to retail to education, teams run their most demanding traffic on the
              same distributed platform.
            </p>
          </div>
          <div>
            <Button
              label="Azion Enterprise"
              kind="secondary"
              size="large"
              href="#contact"
            />
          </div>
        </div>
      </FrameBox>
    </template>

    <!-- The body is the second frame: the row of stories. `flush` leaves the rule above to
         the header, `borders="y"` hands the vertical rules back to the column, and
         `marks="bottom"` ticks the band's own floor. -->
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="relative z-10 flex flex-col gap-[var(--spacing-xxl)] py-[var(--spacing-xxl)]">
        <!-- The row. `snap-x` plus per-card `snap-start` means a swipe or a wheel lands on
           a card edge rather than mid-card.

           `scroll-pl` matches the track's own `px`: without it the snapport starts at
           the content edge, so `snap-mandatory` immediately scrolls the padding away
           and parks the first card's border flat against the column's frame rule. The
           scroll padding moves the snap position inward instead, which is what keeps
           the row's left inset at rest. -->
        <div
          class="flex snap-x snap-mandatory gap-[var(--spacing-xl)] overflow-x-auto scroll-pl-[var(--spacing-xl)] px-[var(--spacing-xl)] pb-[var(--spacing-xs)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <article
            v-for="entry in stories"
            :key="entry.key"
            class="flex w-[300px] shrink-0 snap-start flex-col gap-[var(--spacing-lg)]"
          >
            <!-- The card face, as the design composes it: the client's brand fill with its
               two ellipses, the symbol centred, the wordmark standing on the bottom-start
               edge. The symbol is what the eye lands on; the wordmark signs the card.

               340px, not the design's 456: at 300 wide that was a 1:1.52 portrait, tall
               enough that one card and its caption filled a laptop screen on their own and
               the row read as a stack of posters. 340 is roughly 1:1.13 — the fill still
               carries the brand, the symbol still has air around it, and four cards fit the
               band without the section becoming the tallest thing on the page.

               `justify-end` is the design's own anatomy — the card is a column whose
               only in-flow child is the wordmark, so it sits on the floor while the
               symbol is placed dead centre over it. Both marks ship white, so nothing
               is filtered or theme-swapped here: the card is brand-coloured on either
               theme, and white reads on all four fills. -->
            <div
              v-if="entry.client?.brand"
              class="relative flex h-[340px] flex-col items-start justify-end overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] pb-[var(--spacing-lg)] pl-[var(--spacing-lg)] pr-[var(--spacing-xl)]"
              :style="cardFace(entry.client)"
            >
              <img
                :src="entry.client.symbol"
                alt=""
                aria-hidden="true"
                decoding="async"
                class="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] object-contain"
              />
              <img
                :src="entry.client.wordmark"
                :alt="entry.client.name"
                decoding="async"
                class="relative h-6 w-auto max-w-full object-contain object-left"
              />
            </div>

            <p class="m-0 min-h-[5lh] text-pretty text-body-sm text-[var(--text-default)]">
              {{ entry.story }}
            </p>

            <MiniButton
              label="Read the story"
              show-icon
              icon="pi pi-arrow-right"
              href="#"
            />
          </article>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
