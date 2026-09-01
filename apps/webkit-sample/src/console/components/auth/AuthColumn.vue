<script setup>
  // The composition every signed-out screen is built on: AuthShell's chrome, ONE
  // centred column on the canvas, and the caller's card in the default slot.
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
  // ── AND NO CLIENT STRIP, FOR NOW ──
  //
  // The floor of the column carried the trust strip: the marketing hero's overline over
  // the same BrandCarousel the site's Home, Functions and Pricing pages close with, in
  // its `small` step and one monochrome ink. It was the one piece of the old panel's job
  // kept here — proof, not a feature — and it is out for now, so what is on a signed-out
  // screen is the task and nothing else.
  //
  // Bringing it back is a `<footer>` at the end of this column (`shrink-0`, its own
  // `py-(--spacing-xl)`, `followStyle` for the rise) holding that overline and
  // `<BrandCarousel :clients="CLIENTS" size="small" monochrome />`. Two things it has to
  // get right, both of which cost a cycle the first time: the caption is rendered in the
  // footer rather than passed as the carousel's own `label` — that one is the site hero's
  // treatment, accent-coloured with a blinking cursor, and it must not blink next to a
  // form someone is filling in — and the module region above it drops its bottom padding,
  // because the strip's own top inset is then the air under the card.
  //
  // ── WHERE THE SCROLL LIVES ──
  //
  // From `lg` the module region owns its overflow, so a tall card scrolls WITHIN the
  // column while the header holds still. Below `lg` the scroll zone is `main` (see
  // AuthShell) and this column simply rides it at its natural height.
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
  // flow that is its parent route (see SignupFlow.vue), so only the card swaps.
  import { useAuthEntrance } from '../../lib/behavior/auth-entrance'
  import AuthShell from './AuthShell.vue'

  // The shared signed-out choreography (`lib/behavior/auth-entrance.js`), the same rule
  // Onboarding enters by. Only the LEAD half is used here: the stagger exists so a part
  // and its counterpart arrive one fast-01 apart, and with the strip gone there is one
  // part on this screen. `followStyle` is what the strip's rise would take.
  //
  // The module keeps the HORIZONTAL entrance it had as the form half. There is no
  // second half to assemble against any more, but the axis is what makes moving between
  // Sign In and Sign Up read as one movement between two flows rather than as two
  // unrelated page loads — the card leaves along the same axis it arrives on.
  const { entered, leadStyle } = useAuthEntrance()
</script>

<template>
  <AuthShell>
    <!-- The page column: centred, capped at the site measure, and one boundary in from
         each window edge below that cap — the boundary is the whole geometry here, and
         it is why the card and the header's brand open on one vertical. `flex-1` so the
         column is the whole leftover height — which is what lets the card centre in the
         PAGE rather than sit under the header — and `lg:min-h-0` so the module inside it
         can be a scroll region instead of growing past it. -->
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
           it. The block insets are symmetric and both load-bearing now that the strip
           is gone: `pt` is the top of the scroll (without it a tall card starts flush
           against the header) and `pb` is the air under it (which the strip's own top
           inset used to provide). On a short card they cost nothing — the auto margins
           absorb them. -->
      <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
        <div
          :data-entered="entered || null"
          :style="leadStyle"
          class="m-auto flex w-full -translate-x-6 flex-col items-center gap-(--spacing-md) opacity-0 data-entered:translate-x-0 data-entered:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none"
        >
          <slot />
        </div>
      </div>
    </div>
  </AuthShell>
</template>
