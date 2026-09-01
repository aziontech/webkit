<script setup>
  // ARCHIVED — not mounted. See ./README.md.
  //
  // The signed-out screens are one CENTRED column now (../AuthColumn.vue): the split
  // this panel filled the other half of is gone, and what argues for the product at the
  // floor of the page is the client strip rather than the map. Kept whole because the
  // panel is a direction we expect to come back to — the map's 'panel' framing, the
  // claim chips over it and the two editorial props are all still correct, and nothing
  // about it was defective. Its imports are aliased (`@shared/…`), so mounting it again
  // is one import line.
  //
  // The art half of the Sign Up split: the network claim as the headline, its
  // claim chips under it, and the pixel world map as the ground. Two blocks over
  // one full-bleed backdrop — copy at the top, map everywhere else.
  //
  // It replaces the pixelate field that used to sit here. The map argues the one
  // thing that is actually persuasive while you are typing an email address, which
  // is scale you can see.
  //
  // ── WHAT CAME OUT, AND WHY ──
  //
  // The panel used to close with a trust strip: a tracked overline and a moving row
  // of client marks along the floor. Both are gone, and so is the vertical rule
  // this column drew against the form half.
  //
  // The rule went because it was doing the opposite of its job. The two halves are
  // not two panes of a table — they are one page whose left side happens to be a
  // form and whose right side happens to be a map, and a hairline down the middle
  // of a signed-out screen turns that into two documents sitting next to each
  // other. The map's own wash already ends the artwork before it reaches the
  // seam, so nothing needed a line to stop at.
  //
  // The marks went for a different reason: they were the wrong argument in the
  // wrong place. A logo row is evidence you offer someone deciding WHETHER to sign
  // up; on this screen they have already decided, and six greyed silhouettes at the
  // bottom of the column bought a fourth block of small type on a page that is
  // asking for an email address. Removing them also releases the two constraints
  // they had imposed on the artwork — a hard wash that erased the bottom fifth of
  // the map, and a mask cut that kept accent nodes off the strip (see MapBanner) —
  // so the map now runs to the floor of the column and fades there.
  //
  // Below `lg` the panel keeps its top border: stacked, the map sits UNDER the
  // card rather than beside it, and two blocks in one column with no rule between
  // them read as one continuous run of page.
  //
  // The claim chips came OUT of this panel once, on the argument that nobody is
  // comparing specs at the moment they are typing an email address. They are back
  // because the numbers are the Network section's whole case and the panel is where
  // that case gets made to someone deciding — but they are back as a PROP with the
  // list as its default, not as fixed furniture: a screen that wants the quieter
  // panel passes `:tags="[]"` and gets exactly the map-only version back.
  //
  // The backdrop is MapBanner in its 'panel' framing, not the hero one. A hero
  // band is wide and holds its copy to one side; this column is portrait and holds
  // its copy at the top. See MapBanner's own note for why that changes both the
  // fit and the wash.
  //
  // The headline and the claims are PROPS, because they are the two things a screen
  // has an opinion about: the claim that fits what it is asking for (signing up is
  // sold on reach, signing in is not sold at all) and how much evidence to put under
  // it. Everything else — the map, the proportions — is the panel's and is the same
  // wherever it appears. `tags` are the site Network band's own claim chips, from
  // the same list it reads (`site/ui/claims.js`) and through the same component
  // (`ClaimChips`), so the two surfaces cannot argue different numbers.
  import MapBanner from '@shared/ui/banners/MapBanner.vue'
  import ClaimChips from '@shared/ui/brand/ClaimChips.vue'
  import { NETWORK_CLAIMS } from '@shared/ui/brand/claims.js'

  defineProps({
    // The panel's headline.
    title: {
      type: String,
      default: 'Build on the most reliable network on the planet'
    },
    // Claim chips under the headline, as plain strings. Pass `[]` for a panel that
    // makes its case on the map alone — which is what this panel did before the
    // chips became configurable, and still the right call on a screen where the
    // user has already decided to be here.
    tags: {
      type: Array,
      default: () => NETWORK_CLAIMS
    }
  })
</script>

<template>
  <!-- No radius and no outer border: this is one HALF of a full-bleed split, so
       it runs to the page edges. The only rule it draws is a TOP edge, and only
       while stacked — side by side there is no line between the halves at all
       (see the note in the script).

       The ground is `--bg-canvas`, not `--bg-surface`. With the rule gone, a
       different surface tone IS the rule — a 6/255 step down the middle of the
       page in dark, which is the thing that was removed. It also makes the map's
       scrims honest: every stop in them dissolves to `var(--bg-canvas)`, so on a
       surface-toned ground the wash was painting a slightly different colour than
       the panel it was washing.

       `overflow-hidden` is what makes the backdrop a backdrop: MapBanner is
       absolutely positioned against this element (hence `relative isolate`) and
       its artwork is deliberately wider than the column, so the column crops it.

       The min-height applies only while stacked, where the panel has no form
       beside it to take its height from. Side by side the grid row stretches it
       to the taller half, and a min-height above that would push the page down.

       The column is a FLEX COLUMN of two blocks — the copy, then the map's region —
       not a backdrop with copy floated over it. See the region's own note below. -->
  <aside
    class="relative isolate flex min-h-[420px] flex-col overflow-hidden border-t border-(--border-default) bg-(--bg-canvas) pt-(--spacing-xl) lg:min-h-0 lg:border-t-0 lg:pt-(--spacing-xxl)"
    aria-label="The Azion network"
  >
    <!-- The headline, centred on the column and capped at container-md so it
         breaks into two balanced lines instead of running the full width. It is
         pinned to the top and nothing follows it, so everything below is map.

         The chips hang off the headline rather than sitting on their own, and they
         share its container-md cap: claim and evidence are one block, and both wrap
         on the same measure. They stay at the TOP with it because the body of the
         map is the whole composition, and a row of pills floated into it would be
         the one thing in front of the part worth looking at.

         `shrink-0` because this block sizes the one below it: the copy takes what it
         needs and the map gets the rest.

         The inline inset is `--layout-boundary-inline` below `lg`, matching the card
         column and the header bar rather than sitting 8px inside them — stacked, this
         copy is page copy and has to start on the same line as everything else on the
         screen. From `lg` it opens to `--spacing-xl` with the card half, where the
         number is a gutter inside a column and no longer a page edge. -->
    <header
      class="relative z-10 flex shrink-0 flex-col items-center gap-(--spacing-lg) px-(--layout-boundary-inline) text-center lg:px-(--spacing-xl)"
    >
      <h2 class="max-w-(--container-md) text-balance text-heading-lg text-(--text-default)">
        {{ title }}
      </h2>

      <ClaimChips
        v-if="tags.length"
        :claims="tags"
        class="max-w-(--container-md) justify-center"
      />
    </header>

    <!-- THE MAP'S REGION — everything the copy is not using, and the reason the map
         is a SIBLING of the headline rather than a backdrop behind it.

         MapBanner is `absolute inset-0`, so whatever box it is dropped into is the
         box it fills. Dropped into the ASIDE it filled the whole column, and "the map
         starts below the copy" could then only be expressed as a percentage of the
         column — which is a guess about how tall the copy is. Side by side the guess
         held (32% of an 844px column clears a two-line headline and two rows of
         chips). Stacked on a phone it was wrong by a mile: the same copy wraps to
         five rows in a 375px column and runs most of the way down a panel that has
         collapsed to its 420px minimum, so the dot grid came up THROUGH the gaps
         between the claim chips. Measured at 375x667 — the map's band opened at
         141px while the chips ran to 430px.

         Dropped into a `flex-1` SIBLING instead, the region IS "whatever the copy
         left", at every width, with no number to keep in sync. The map starts where
         the headline block ends because that is literally where this box starts.

         `min-h` is the floor for the STACKED case only, and the `max-lg:` is load
         bearing. Stacked, the panel's height is its content, so a floor makes the map
         a band tall enough to read as a map rather than as a strip of texture. Side
         by side the panel's height is the grid row's — fixed — so the same floor
         stops being a floor and becomes an OVERRUN: on a 1280x620 window the column
         is 564px, the copy takes 267 of them, and a 288px floor pushes the map 39px
         past the bottom of a box that clips. `flex-1` alone is the right answer
         there; it is already 51-77% of the column depending on the window.

         THE MARGIN IS NEGATIVE, and that is the whole trick. Two boxes stacked edge
         to edge still read as two boxes: the copy is a rectangle, the map is a
         rectangle, and the join between them is a flat horizontal line across the
         column no matter how softly the artwork fades below it. So the map's box is
         pulled UP by `--spacing-lg` (24 side by side, 16 stacked) and BLEEDS into the
         last row of claim chips. The chips are opaque pills, so they sit on the map's
         leading edge and the two blocks interlock instead of abutting.

         HOW FAR IT CAN BLEED IS A TRADE, not a free choice, and the two ends of it
         pull against each other: the further the artwork reaches up, the longer
         MapBanner's top ramp has to be to keep the overlap imperceptible — and a
         longer ramp is a softer map.

         The pull was 48px, against a 30% top ramp. Both halved, and the RAMP is what
         forced it: the panel's crop now fills the region with map instead of leaving
         the top third as empty bleed, so a ramp long enough to hide a 48px overlap
         reaches down into Europe (see MapBanner's mask note for the derivation). With
         the ramp down to 10%, ~60px, a 48px pull would put the artwork's leading edge
         almost at full strength under the pills. 24px sits inside the ramp's first
         third, which is where the bleed is free.

         Measured at 1440x900, dark: the map's grey peaks at 11/255 anywhere in the
         24px overlap band, against 32/255 in the body of the map below it — about a
         third of full strength, on a canvas it is 11 units away from. That is texture
         you notice only as the copy and the artwork belonging to each other, never as
         a dot grid showing through the gaps between pills.

         No bottom padding on the aside, and none here: the map is meant to reach the
         floor and dissolve into it on its own alpha (see MapBanner's seam masks), so
         an inset under it would show as a band of bare canvas below a map that just
         stops. -->
    <div class="relative -mt-(--spacing-lg) max-lg:min-h-[18rem] flex-1">
      <MapBanner kind="panel" />
    </div>
  </aside>
</template>
