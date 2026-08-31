<script setup>
  // Client logo carousel — the trust strip that closes the hero: an overline
  // headline over an infinitely scrolling row of client marks.
  //
  // The loop is CSS only (no carousel library, per .claude/rules/dependencies.md):
  // the track holds the row twice and translates by exactly -50%, so the second
  // copy lands where the first started and the seam is invisible. The duplicate is
  // `aria-hidden`, so a screen reader hears each client once. Hover (or focus
  // inside) pauses it, and `prefers-reduced-motion` stops it outright and lets the
  // row wrap into a static grid — the whole list stays reachable either way.
  //
  // Each client renders as an <img> from `ui/clients/index.js`, and falls back to a
  // typographic wordmark when an entry has no `logo` — so the strip is complete
  // before every asset has landed.
  //
  // A mark reaches both themes one of two ways (see ui/clients/index.js):
  //
  //   • `logo` + `logoLight` — two real assets, one per theme. Both are rendered and
  //     CSS shows exactly one, so the light theme gets the mark's true brand colors
  //     instead of a filtered approximation. Preferred whenever both files exist.
  //   • `logo` + `artwork` — a single asset, filtered only where it would vanish:
  //       'color' → untouched on both themes.
  //       'light' → white artwork: inverted on the LIGHT theme.
  //       'dark'  → black artwork: inverted on the DARK theme.
  //
  // The theme is read from `[data-theme=dark]` on the document root — the attribute
  // the theme package keys its own variables off, and the one SiteLayout pins while
  // the marketing shell is mounted. Tailwind's stock `dark:` variant is NOT used: it
  // follows `prefers-color-scheme`, which says nothing about the app's chosen theme,
  // so a manual toggle would leave these marks inverted the wrong way.
  import Overline from '@aziontech/webkit/overline'
  import { computed } from 'vue'

  import ClientMark from './ClientMark.vue'

  // Shared geometry, so a swapped pair and a filtered single mark measure the same.
  // The max-width is generous enough that a wide wordmark still reaches the full
  // height — cap it too tightly and `object-contain` shrinks the mark to fit instead.
  //
  // Two steps, because the strip runs in two very different ROLES. 'medium' is the
  // marketing hero, where the strip is a band of the page and the row spans it.
  // 'small' is the signed-out strip on the floor of the auth column (AuthColumn),
  // where it is the quietest thing on a page that is asking for one field.
  //
  // 'small' is 24px, not 32: it is proof, not a feature. It sits under a form as the
  // last thing on the page, and at 32px each mark carried the visual weight of the
  // card above it. Smaller also puts more marks in frame at once, which is what makes
  // the row read as a list of clients rather than as a slideshow. It was sized for a
  // half-page column originally — the auth screen's art half, since archived — and it
  // holds at the full width of the page frame for the same reason: the number of marks
  // in frame is what the step is protecting.
  //
  // 'medium' is a RESPONSIVE step, not one height. The same 48px mark that reads as a
  // row on a 1440px hero is a slideshow on a phone: at 375px a 48px wordmark plus its
  // gutters is most of the viewport, so barely one and a half marks are ever in frame
  // and both edges sit in the mask's fade — the strip stops reading as a list of
  // clients and starts reading as one logo drifting past.
  //
  // THE LADDER IS ONE MARK HEIGHT PER DEVICE CLASS: 32px on a phone, 40px on a tablet
  // (`md`), 48px on a desktop (`lg`). The rungs are the device classes themselves, not
  // the nearest breakpoint that happened to look right — which is what `sm`/`md` gave
  // before, and it put the full desktop 48px on a 768px tablet. The max-width cap moves
  // with the height for the same reason the base comment gives: cap it at the desktop
  // 240px on a phone and a wide wordmark never reaches the shorter height, so two marks
  // in one row measure differently.
  //
  // Because the ladder lives HERE and not at the call sites, every site strip (Home's
  // clients and its tool stack, Functions, Pricing) scales identically; a page cannot
  // drift to its own mobile size. 'small' stays a single height: at 24px it is already
  // below the bottom rung of the 'medium' ladder, so the ladder would have nowhere to
  // go — a phone keeps ~three marks in frame at that height without one.
  const MARK = {
    medium: 'h-8 md:h-10 lg:h-12 w-auto max-w-(--brand-cell) object-contain',
    small: 'h-6 w-auto max-w-(--brand-cell) object-contain'
  }

  // ── THE CELL IS FIXED; THE MARK IS NOT ────────────────────────────────────
  // A gap only spaces the marks' EDGES. With the cell sized to its own artwork, that
  // leaves the marks on an uneven pitch — our artwork runs 27px (Jekyll) to 240px
  // (Anthropic), so the same 32px gutter reads as crowding beside a wordmark and as a
  // hole beside a symbol. azion.com avoids this by giving every mark a fixed cell and
  // centring the artwork in it, so the row advances by one constant pitch; its own
  // strip is an 1782px row of 11 × 130px cells. (Its artwork is all symbols, 38–72px,
  // which is why 130 is enough there and is NOT enough here.)
  //
  // The rung IS the artwork cap we already had — 150 / 200 / 240 — so every mark keeps
  // exactly the size it rendered at before and the only thing that changes is that the
  // pitch is now even. Declared once per rung as `--brand-cell` and read twice: the
  // cell's own width, and the artwork's max-width (so a wordmark can fill its cell but
  // never overflow it). Two class strings with the same three numbers would drift.
  const CELL = {
    medium: '[--brand-cell:150px] md:[--brand-cell:200px] lg:[--brand-cell:240px]',
    small: '[--brand-cell:120px]'
  }

  // THE SPACING IS THE ROW'S GAP, NOT EACH MARK'S PADDING — the site's own rule for
  // this strip: `gap-(--spacing-4) md:gap-(--spacing-8)` with a matching `pr`, i.e. 16px
  // between marks on a phone and 32px from `md` up. Per-item padding was the wrong
  // mechanism twice over: it doubles at every junction (16px each side reads as 32px
  // between), and it puts air outside the first and last mark that the row does not
  // want.
  //
  // THE TRAILING `pr` IS LOAD-BEARING, and it is why the site declares it alongside the
  // gap. `gap` only draws space BETWEEN siblings, so it does nothing at the marquee's
  // seam: the track holds the row twice and translates by exactly -50%, which lands the
  // second copy's first mark directly against the first copy's last one. The `pr` is the
  // one gap that junction has, and it has to equal the gap or the loop visibly stutters
  // once per pass. Matching it to the gap at both rungs is what keeps the seam invisible.
  //
  // The numeric steps are the right tokens here rather than the semantic ones: this is a
  // flat 16 → 32 pair, and the semantic scale has no flat 32 (`--spacing-xl` is
  // 24/32/48, so it would land 48px on a desktop — the widest layout with the marks
  // furthest apart, which reads as gaps with logos in them rather than as a list).
  const ROW_SPACING = {
    medium: 'gap-(--spacing-4) pr-(--spacing-4) md:gap-(--spacing-8) md:pr-(--spacing-8)',
    // The auth strip keeps the spacing it had at its base width (2 × `--spacing-lg`);
    // stated as one flat gap now that the row owns its spacing, so it no longer widens
    // to 48px from `sm`.
    small: 'gap-(--spacing-8) pr-(--spacing-8)'
  }

  const props = defineProps({
    // [{ name, logo?, logoLight?, artwork?, href? }] — `logo` is an asset URL,
    // `logoLight` its light-theme counterpart, `artwork` one of the ARTWORK_FILTER
    // keys ('color' when omitted), `href` makes the mark a link.
    clients: {
      type: Array,
      required: true
    },
    // Overline above the row.
    label: {
      type: String,
      default: ''
    },
    // Seconds for one full pass. Longer = calmer. Left at 0 it is DERIVED from the
    // number of marks, which is what keeps every strip moving at one speed — see
    // SECONDS_PER_MARK. Pass a number only to override that deliberately.
    duration: {
      type: Number,
      default: 0
    },
    // Mark scale: 'medium' for a full-width strip, 'small' for a column.
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['medium', 'small'].includes(value)
    },
    // Paint every mark in one ink instead of its own brand colours — for a strip
    // read as a LIST of clients, where twelve palettes in one row become noise.
    // See ClientMark / clients/index.js § "One ink for every mark".
    monochrome: {
      type: Boolean,
      default: false
    }
  })

  const mark = computed(() => MARK[props.size])
  const rowSpacing = computed(() => ROW_SPACING[props.size])
  const cell = computed(() => CELL[props.size])

  // ── SPEED IS THE CONSTANT, NOT DURATION ───────────────────────────────────
  // The track holds the row twice and translates by exactly -50%, so one pass covers
  // ONE COPY: `marks x pitch` px. A fixed duration therefore does not mean a fixed
  // speed — it means a 30-mark strip scrolls three times faster than an 11-mark one,
  // which is what the old flat 44s did (36 px/s on Home's clients against 63 px/s on
  // its tool stack). Fixing the cell made every pitch bigger and turned that drift
  // into a real problem: the same 44s over a 3x longer track.
  //
  // So the number stated here is SECONDS PER MARK, and the duration is derived. Every
  // strip on the site now advances one mark every 5.4s — 50 px/s at the desktop rung
  // (272px pitch), which is the midpoint of the two speeds the flat duration used to
  // produce, so the calmest strip is unchanged and none is faster than it was. The
  // narrower rungs come out slower in absolute px (43 tablet, 31 phone), which is
  // right: less width in frame should not mean marks flying past.
  const SECONDS_PER_MARK = 5.4

  const passDuration = computed(
    () => props.duration || Math.round(props.clients.length * SECONDS_PER_MARK)
  )
</script>

<template>
  <div class="flex flex-col items-center gap-(--spacing-xl)">
    <Overline
      v-if="label"
      show-cursor
      >{{ label }}</Overline
    >

    <!-- The mask fades both ends so marks enter and leave instead of popping. -->
    <div
      class="marquee relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      :style="{ '--brand-marquee-duration': `${passDuration}s` }"
    >
      <div class="track flex w-max">
        <!-- The row, twice: the second copy is decorative and hidden from AT. -->
        <ul
          v-for="copy in 2"
          :key="copy"
          class="row flex w-max shrink-0 items-center"
          :class="[rowSpacing, cell]"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <li
            v-for="client in clients"
            :key="`${copy}-${client.name}`"
            class="flex w-(--brand-cell) shrink-0 items-center justify-center"
          >
            <component
              :is="client.href ? 'a' : 'span'"
              :href="client.href || undefined"
              :aria-label="client.href ? client.name : undefined"
              class="flex items-center text-(--text-muted) opacity-70 transition-[color,opacity] duration-fast-02 ease-productive-entrance hover:text-(--text-default) hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-4 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
            >
              <!-- No `loading="lazy"` on any of these: every mark starts off-screen and
                   scrolls into view seconds later, so lazy loading makes them pop in
                   mid-marquee. They are small vector files — load them upfront.

                   Two-asset marks swap by theme, single-asset ones are inverted only
                   where they would vanish, and a client with no asset falls back to a
                   typographic wordmark — all of it inside ClientMark. -->
              <ClientMark
                :client="client"
                :mark="mark"
                :monochrome="monochrome"
              />
            </component>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .track {
    animation: brand-marquee var(--brand-marquee-duration, 44s) linear infinite;
  }

  /* Pause on hover or when something inside takes focus, so a link is clickable. */
  .marquee:hover .track,
  .marquee:focus-within .track {
    animation-play-state: paused;
  }

  @keyframes brand-marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  /* Reduced motion: no scroll at all, and the row wraps so nothing is cut off. */
  @media (prefers-reduced-motion: reduce) {
    .track {
      width: 100%;
      animation: none;
      flex-wrap: wrap;
      justify-content: center;
    }

    .row {
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--spacing-md);
    }

    .row[aria-hidden='true'] {
      display: none;
    }
  }
</style>
