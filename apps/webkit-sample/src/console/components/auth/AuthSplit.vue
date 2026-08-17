<script setup>
  // The composition every signed-out screen is built on: AuthShell's chrome, a
  // full-bleed 50 / 50 split, the caller's card in the default slot, and the
  // NetworkPanel filling the other half. Below lg it collapses to a single column
  // and the panel stacks under the card.
  //
  // It exists because the entrance has to belong to the SPLIT, not to the screen
  // inside it. Sign Up, Check Inbox and Sign In each used to own this markup and
  // each called `useAuthEntrance` themselves, so every route change re-mounted the
  // panel and re-ran the whole slide — three page loads where the user only
  // changed step, and the map visibly re-arriving each time even though it never
  // changes. Hoisting the split into one component means the entrance runs once,
  // wherever this component mounts: for the signup flow that is its parent route
  // (see SignupFlow.vue), so the panel holds still and only the card swaps.
  //
  // The card half is the default slot rather than a fixed child, so a screen puts
  // whatever it needs in the column — the card plus anything that belongs on the
  // canvas under it (Sign Up's "Already have an account?", Sign In's recovery
  // link), which is why the column carries the gap and the centring.
  import { useAuthEntrance } from '../../lib/behavior/auth-entrance'
  import AuthShell from './AuthShell.vue'
  import NetworkPanel from './NetworkPanel.vue'

  // The panel's two editorial props, forwarded. The panel is only ever instantiated
  // in here, so without this pass-through nothing could actually reach them — and
  // they are exactly the two things a SCREEN has an opinion about (see
  // NetworkPanel). Prefixed, because on a layout a bare `title` would read as the
  // split's own. Both default to `undefined` so the panel's own defaults apply and
  // this component states no editorial opinion of its own.
  defineProps({
    // Overrides the panel's headline.
    panelTitle: {
      type: String,
      default: undefined
    },
    // Overrides the panel's claim chips. `[]` for the map-and-marks-only panel.
    panelTags: {
      type: Array,
      default: undefined
    }
  })

  // The shared signed-out choreography (`lib/auth-entrance.js`), the same rule
  // Onboarding enters by: each half comes inward from its OWN outer edge (the card
  // along +X, the panel along -X, a beat behind), so the split assembles around
  // its seam instead of the page fading in as one flat block.
  const { entered, leadStyle, followStyle } = useAuthEntrance()
</script>

<template>
  <AuthShell>
    <!-- Two equal halves, flush and full-bleed. No max-width and no padding on
         the split itself: the seam down the middle IS the composition, and any
         gutter around it would turn one page into two floating panels. The
         breathing room lives INSIDE each half, so the art half can still bleed
         its artwork to the page edge. -->
    <div class="grid flex-1 grid-cols-1 lg:min-h-0 lg:grid-cols-2">
      <!-- The card half. It centres its content rather than filling the column —
           the column is as tall as the page, a card is only as tall as its own
           fields, and a card pinned to the top of a full-height column floats
           with nothing under it.

           THE SCROLL LIVES HERE, not on the page (see AuthShell). From `lg` this
           column is exactly the leftover viewport height and owns its own overflow,
           so a tall card scrolls WITHIN its half while the panel beside it holds
           still — instead of pushing the whole page down and taking the panel, the
           header and the links under the card off screen with it.

           THE CENTRING IS `m-auto` ON THE INNER BLOCK, not `justify-center` on the
           column, and that is the load-bearing part. A flex container that centres
           content taller than itself overflows in BOTH directions and clips the top,
           which a scroll container cannot reach — the classic version of this bug is
           a card whose first field is unreachable. Auto margins collapse to 0 the
           moment there is no free space, so the same markup centres a short card and
           scrolls a tall one from its true top.

           The inset drops from `--spacing-xxl` to `--spacing-xl`: at lg that is 96px
           of vertical padding instead of 192px, which is most of the overrun this
           screen had, spent on nothing but air. -->
      <div
        :data-entered="entered || null"
        :style="leadStyle"
        class="flex -translate-x-6 flex-col px-(--spacing-xl) py-(--spacing-xl) opacity-0 data-entered:translate-x-0 data-entered:opacity-100 lg:min-h-0 lg:overflow-y-auto motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
      >
        <div class="m-auto flex w-full flex-col items-center gap-(--spacing-md)">
          <slot />
        </div>
      </div>

      <!-- The art half. Stacks under the card below lg, where half a phone is
           narrower than the copy it carries.

           Enters from its own edge, against the card's — `translate-x-6` and not
           the `translate-x-12` Onboarding's console travels: that one runs off
           the page and keeps going, while this panel IS the page's right edge, so
           a longer offset would open a visible strip of bare canvas beside it on
           the way in. -->
      <NetworkPanel
        :title="panelTitle"
        :tags="panelTags"
        :data-entered="entered || null"
        :style="followStyle"
        class="translate-x-6 opacity-0 data-entered:translate-x-0 data-entered:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
      />
    </div>
  </AuthShell>
</template>
