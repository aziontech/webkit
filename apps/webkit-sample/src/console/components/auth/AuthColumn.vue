<script setup>
  // The composition every signed-out screen is built on: AuthShell's chrome, ONE
  // centred column on the canvas, the caller's card in the default slot, and the
  // client strip at the column's floor.
  //
  // ── WHY THERE IS NO SECOND HALF ──
  //
  // This was a full-bleed 50 / 50 split with the network panel filling the other side
  // (kept whole at ./archive/NetworkPanel.vue). The panel was not the problem; the
  // split was. Half the page argued for the network while the other half asked for an
  // email address, so a screen whose whole task is a form read as a page ABOUT the
  // product with a form beside it — and the argument was aimed at someone who, by the
  // time they are on it, has already decided. On a laptop the form also spent its half
  // being a narrow column with a card floating in the middle of it.
  //
  // What is left is the card, centred in the PAGE rather than in half of one, and the
  // page's boundaries around it: the column is `layout-column-site`, so it is centred,
  // capped at the site measure, and inset one --layout-boundary-inline from each window
  // edge below that cap — the same vertical every bar and every page column in this app
  // opens on. It draws NO rules. There is nothing on this screen for a frame to
  // organise, and a hairline around a single card would put the composition back to
  // being a box on a page, which is the shape the split already was.
  //
  // ── THE CLIENT STRIP ──
  //
  // The floor of the column is the trust strip: the overline the marketing hero puts
  // over this row, then the same BrandCarousel the site's Home, Functions and Pricing
  // pages close with, in its `small` step and one monochrome ink. It is the one piece
  // of the old panel's job worth keeping here, because it is the cheapest possible
  // version of it — proof, not a feature.
  //
  // The caption is rendered here rather than passed as BrandCarousel's own `label`:
  // that one is the site hero's treatment — accent-coloured, with a blinking cursor —
  // and this line must not blink next to a form someone is filling in.
  //
  // The fade is the carousel's own: the row is masked at both ends, so marks enter and
  // leave instead of popping at the column's edges, and the loop is CSS only (no
  // carousel library — .claude/rules/dependencies.md). Hover pauses it; reduced motion
  // stops it and wraps the row so every client stays reachable.
  //
  // ── WHERE THE SCROLL LIVES ──
  //
  // From `lg` the module region owns its overflow, so a tall card scrolls WITHIN the
  // column while the strip stays on its floor and the header holds still. Below `lg`
  // the scroll zone is `main` (see AuthShell) and this column simply rides it at its
  // natural height, with the strip arriving after the card.
  //
  // The card is the default slot rather than a fixed child, so a screen puts whatever
  // it needs in the column — the card plus anything that belongs on the canvas under it
  // (Sign Up's "Already have an account?", Sign In's consent line), which is why the
  // column carries the gap and the centring.
  //
  // It exists as a component because the entrance has to belong to the COMPOSITION, not
  // to the screen inside it. Sign Up, Check Inbox and Sign In each used to own this
  // markup and each called `useAuthEntrance` themselves, so every route change re-ran
  // the whole slide — three page loads where the user only changed step. Hoisting it
  // here means the entrance runs once, wherever this component mounts: for the signup
  // flow that is its parent route (see SignupFlow.vue), so the strip holds still and
  // only the card swaps.
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  import { CLIENTS } from '@shared/ui/brand/clients/index.js'

  import { useAuthEntrance } from '../../lib/behavior/auth-entrance'
  import AuthShell from './AuthShell.vue'

  // The shared signed-out choreography (`lib/behavior/auth-entrance.js`), the same rule
  // Onboarding enters by: a lead part arrives, and its counterpart follows one fast-01
  // behind — a stagger reads as choreography where a simultaneous arrival reads as a
  // slide transition.
  //
  // The module keeps the HORIZONTAL entrance it had as the form half. There is no
  // second half to assemble against any more, but the axis is what makes moving between
  // Sign In and Sign Up read as one movement between two flows rather than as two
  // unrelated page loads — the card leaves along the same axis it arrives on.
  //
  // The strip rises instead, and that is deliberate: it is the floor of the page, so it
  // comes UP into place, and a horizontal entrance on a row that is itself scrolling
  // horizontally would read as the marquee starting early.
  const { entered, leadStyle, followStyle } = useAuthEntrance()
</script>

<template>
  <AuthShell>
    <!-- The page column: centred, capped at the site measure, and one boundary in from
         each window edge below that cap — the boundary is the whole geometry here, and
         it is why the card, the header's brand and the strip all open on one vertical.
         `flex-1` so the column is the whole leftover height (which is what puts the
         strip on the floor of the screen rather than under the card), `lg:min-h-0` so
         the module inside it can be a scroll region instead of growing past it. -->
    <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
      <!-- The module. It centres its content rather than filling the column — the
           column is as tall as the page, a card is only as tall as its own fields, and a
           card pinned to the top of a full-height column floats with nothing under it.

           THE CENTRING IS `m-auto` ON THE INNER BLOCK, not `justify-center` on the
           region, and that is the load-bearing part. A flex container that centres
           content taller than itself overflows in BOTH directions and clips the top,
           which a scroll container cannot reach — the classic version of this bug is a
           card whose first field is unreachable. Auto margins collapse to 0 the moment
           there is no free space, so the same markup centres a short card and scrolls a
           tall one from its true top.

           No inline padding of its own: the column is already inset by the boundary, so
           a second inset would put the card one step further in than the brand above
           it. And no BOTTOM padding: the region is the scroller, so padding there is
           48px of dead height a tall card has to scroll through, while the air under
           the card is already the strip's own top inset. `pt` stays — that one is the
           top of the scroll, and without it a tall card starts flush against the
           header. -->
      <div class="flex flex-1 flex-col pt-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
        <div
          :data-entered="entered || null"
          :style="leadStyle"
          class="m-auto flex w-full -translate-x-6 flex-col items-center gap-(--spacing-md) opacity-0 data-entered:translate-x-0 data-entered:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
        >
          <slot />
        </div>
      </div>

      <!-- The strip. `shrink-0` so it keeps its height when the module above it is
           scrolling, and the pair is set `--spacing-xl` apart rather than closer: the
           caption is tracked mono at the muted ink and the marks are one flat ink at
           24px, so at a tighter gutter the two read as a single block of small grey
           type instead of a caption over a row.

           The strip owns the whole separation from the card above it, because the
           module's region is the scroller and carries no bottom padding of its own —
           padding there would be dead scroll height that also disappears below the fold
           on a viewport where the card just overflows (Sign Up at 900px). This inset is
           outside the scroller, so it is always there. -->
      <footer
        :data-entered="entered || null"
        :style="followStyle"
        class="flex shrink-0 translate-y-2 flex-col gap-(--spacing-xl) py-(--spacing-xl) opacity-0 data-entered:translate-y-0 data-entered:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
      >
        <!-- `text-balance` for the one case it has to wrap: below ~390px the sentence
             takes two lines, and balanced they split near the middle instead of leaving
             a single orphaned word under a full line. -->
        <p class="text-balance text-center text-overline-sm text-(--text-muted) uppercase">
          Trusted by mission-critical workloads
        </p>

        <!-- `monochrome`: one ink for every mark. The row is a LIST — the claim is the
             number of names, not any one of them — and in their own palettes the marks
             argue with each other and with the form above them (a coloured mark pulling
             harder than the primary button). Flat silhouettes let the eye count the row
             instead of reading it one brand at a time, and they hold up identically on
             both themes. Every site strip reads the row the same way, so a mark looks
             the same wherever it appears. -->
        <BrandCarousel
          :clients="CLIENTS"
          size="small"
          monochrome
        />
      </footer>
    </div>
  </AuthShell>
</template>
