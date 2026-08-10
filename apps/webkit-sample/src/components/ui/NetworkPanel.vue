<script setup>
  // The art half of the Sign Up split: the pixel world map as the ground, the
  // network claim as the headline, and the client marks as the proof that closes
  // it. Three blocks, top / middle / bottom, over one full-bleed backdrop.
  //
  // It replaces the pixelate field that used to sit here. The map argues the one
  // thing that is actually persuasive while you are typing an email address, which
  // is scale you can see. The marks underneath say the same thing about the company
  // instead of the network — and they are the reason the panel is the map and not
  // the pixelate field: the trust strip needs a quiet floor to sit on, and the
  // map's is quiet exactly where the strip lands.
  //
  // The claim chips came OUT of this panel once, on the argument that nobody is
  // comparing specs at the moment they are typing an email address. They are back
  // because the numbers are the Network section's whole case and the panel is where
  // that case gets made to someone deciding — but they are back as a PROP with the
  // list as its default, not as fixed furniture: a screen that wants the quieter
  // panel passes `:tags="[]"` and gets exactly the map-and-marks version back.
  //
  // The backdrop is MapBanner in its 'panel' framing, not the hero one. A hero
  // band is wide and holds its copy to one side; this column is portrait and
  // holds its copy at the two ends. See MapBanner's own note for why that changes
  // both the fit and the wash.
  //
  // The headline and the claims are PROPS, because they are the two things a screen
  // has an opinion about: the claim that fits what it is asking for (signing up is
  // sold on reach, signing in is not sold at all) and how much evidence to put under
  // it. Everything else — the map, the trust strip, the proportions — is the panel's
  // and is the same wherever it appears. `tags` are the site Network band's own claim
  // chips, from the same list it reads (`site/ui/claims.js`) and through the same
  // component (`ClaimChips`), so the two surfaces cannot argue different numbers.
  import BrandCarousel from '../site/BrandCarousel.vue'
  import MapBanner from '../site/ui/banners/MapBanner.vue'
  import ClaimChips from '../site/ui/ClaimChips.vue'
  import { NETWORK_CLAIMS } from '../site/ui/claims.js'
  import { CLIENTS } from '../site/ui/clients/index.js'

  defineProps({
    // The panel's headline.
    title: {
      type: String,
      default: 'The most reliable distributed network on the planet'
    },
    // Claim chips under the headline, as plain strings. Pass `[]` for a panel that
    // makes its case on the map and the client marks alone — which is what this
    // panel did before the chips became configurable, and still the right call on a
    // screen where the user has already decided to be here.
    tags: {
      type: Array,
      default: () => NETWORK_CLAIMS
    }
  })
</script>

<template>
  <!-- No radius and no outer border: this is one HALF of a full-bleed split, so
       it runs to the page edges and the only rule it draws is the seam against
       the form half — a top edge while stacked, a leading edge once they sit
       side by side.

       `overflow-hidden` is what makes the backdrop a backdrop: MapBanner is
       absolutely positioned against this element (hence `relative isolate`) and
       its artwork is deliberately wider than the column, so the column crops it.

       The min-height applies only while stacked, where the panel has no form
       beside it to take its height from. Side by side the grid row stretches it
       to the taller half, and a min-height above that would push the page down. -->
  <aside
    class="relative isolate flex min-h-[420px] flex-col overflow-hidden border-t border-[var(--border-default)] bg-[var(--bg-surface)] py-[var(--spacing-xxl)] lg:min-h-0 lg:border-t-0 lg:border-l"
    aria-label="The Azion network"
  >
    <MapBanner kind="panel" />

    <!-- The headline, centred on the column and capped at container-md so it
         breaks into two balanced lines instead of running the full width. It is
         pinned to the top and the trust strip to the bottom (`justify-between`
         via the spacer below), so the middle of the map — the dense part, the
         part worth looking at — is left clear between them.

         The chips hang off the headline rather than sitting on their own, and they
         share its container-md cap: claim and evidence are one block, and both wrap
         on the same measure. They stay at the TOP with it for the same reason the
         trust strip stays at the bottom — the clear middle of the map is the whole
         composition, and a row of pills floated into it would be the one thing in
         front of the part worth looking at. -->
    <header
      class="relative z-10 flex flex-col items-center gap-[var(--spacing-lg)] px-[var(--spacing-xl)] text-center"
    >
      <h2
        class="max-w-[var(--container-md)] text-balance text-heading-lg text-[var(--text-default)]"
      >
        {{ title }}
      </h2>

      <ClaimChips
        v-if="tags.length"
        :claims="tags"
        class="max-w-[var(--container-md)] justify-center"
      />
    </header>

    <div class="flex-1" />

    <!-- The trust strip. The overline is rendered here rather than passed to
         BrandCarousel's own `label`: that one is the site hero's treatment —
         accent-coloured, `whitespace-nowrap`, with a blinking cursor — and this
         line is a long muted sentence that has to wrap inside half a page and
         must not blink next to a form someone is filling in. -->
    <!-- The gap is a step above the one the frame drew (md), because the marks
         are no longer the frame's: at 24px and one ink they are a quiet strip,
         and the tracked mono line above them is nearly as light. Set 16px apart
         the two read as one four-line block of small grey type. -->
    <footer class="relative z-10 flex flex-col gap-[var(--spacing-xl)]">
      <!-- The same overline the marketing hero puts over this row, so the strip
           is captioned identically wherever it appears. It is short enough to
           hold one line at any width the panel takes, which is why it needs
           neither the balancing nor the tightened gutter the frame's longer
           sentence did — it sits on the headline's own gutter. -->
      <p
        class="px-[var(--spacing-xl)] text-center text-overline-sm text-[var(--text-muted)] uppercase"
      >
        Trusted by mission-critical workloads
      </p>

      <!-- No `label` (see above) — the strip is just the moving row here — and
           the small mark, because this is half a page, not a full-width hero.

           `monochrome`: one ink for every mark. Here the row is a LIST — the claim
           is the number of names, not any one of them — and rendered in their own
           palettes the marks argued with each other and with the form beside them
           (a coloured Agibank pulling harder than the Sign Up button). Flat
           silhouettes let the eye count the row instead of reading it one brand at
           a time, and they hold up identically on both themes. The marketing hero
           keeps its true brand colours, where each mark is given room to be a
           brand. -->
      <BrandCarousel
        :clients="CLIENTS"
        size="small"
        monochrome
      />
    </footer>
  </aside>
</template>
