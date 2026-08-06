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

  import { ClientMark } from './ui/index.js'

  // Shared geometry, so a swapped pair and a filtered single mark measure the same.
  // The max-width is generous enough that a wide wordmark still reaches the full 48px
  // height — cap it too tightly and `object-contain` shrinks the mark to fit instead.
  const MARK = 'h-12 w-auto max-w-[240px] object-contain'

  defineProps({
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
    // Seconds for one full pass. Longer = calmer.
    duration: {
      type: Number,
      default: 44
    }
  })
</script>

<template>
  <div class="flex flex-col items-center gap-[var(--spacing-xl)]">
    <Overline
      v-if="label"
      show-cursor
      >{{ label }}</Overline
    >

    <!-- The mask fades both ends so marks enter and leave instead of popping. -->
    <div
      class="marquee relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      :style="{ '--brand-marquee-duration': `${duration}s` }"
    >
      <div class="track flex w-max">
        <!-- The row, twice: the second copy is decorative and hidden from AT. -->
        <ul
          v-for="copy in 2"
          :key="copy"
          class="row flex w-max shrink-0 items-center"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <li
            v-for="client in clients"
            :key="`${copy}-${client.name}`"
            class="flex shrink-0 items-center justify-center px-[var(--spacing-xl)]"
          >
            <component
              :is="client.href ? 'a' : 'span'"
              :href="client.href || undefined"
              :aria-label="client.href ? client.name : undefined"
              class="flex items-center text-[var(--text-muted)] opacity-70 transition-[color,opacity] duration-fast-02 ease-productive-entrance hover:text-[var(--text-default)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
            >
              <!-- No `loading="lazy"` on any of these: every mark starts off-screen and
                   scrolls into view seconds later, so lazy loading makes them pop in
                   mid-marquee. They are small vector files — load them upfront.

                   Two-asset marks swap by theme, single-asset ones are inverted only
                   where they would vanish, and a client with no asset falls back to a
                   typographic wordmark — all of it inside ClientMark. -->
              <ClientMark
                :client="client"
                :mark="MARK"
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
