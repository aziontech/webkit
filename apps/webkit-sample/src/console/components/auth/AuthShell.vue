<script setup>
  // The shared chrome for every unauthenticated screen (Sign Up, Check Inbox,
  // Onboarding): the black GlobalHeader with the Azion brand mark + a
  // Documentation link and a flex-1 slotted body. Screens compose their own
  // two-column layout inside the default slot.
  //
  // Kept as one component so the brand and the Documentation affordance are
  // defined once and stay identical across the whole signup flow — mirroring how
  // CreationHeader centralizes the header for the creation flows.
  //
  // ── THE SHELL IS THE VIEWPORT, AND IT OWNS THE SCROLL ZONE ──
  //
  // A signed-out screen is ONE card. Nothing is below it, so a page that scrolls is a
  // page telling the reader there is more when there is not — and on the split screens
  // that scroll was real: a header plus a centred card plus a `--spacing-xxl` inset top
  // and bottom (6rem each at lg) overran a laptop viewport by enough to hide the bottom
  // of the card and the Sign in / Documentation links under it.
  //
  // So the shell IS the viewport, at EVERY width: `h-dvh`, its own scroll turned off, and
  // the overflow handed to a region inside it. The page never moves; the header stays put;
  // whatever cannot fit scrolls in the region that owns it.
  //
  // WHICH region owns it depends on the layout, and that is the whole rule:
  //
  //   from `lg` — the split is two columns, so each HALF owns its overflow (see
  //     AuthSplit). A tall card scrolls inside its own column while the panel beside it
  //     holds still, which is the only honest place for that scroll to live.
  //   below `lg` — the halves are stacked, so there are no columns to scroll and the
  //     whole stack is one run of page. `main` is the scroll zone.
  //
  // THE SCROLL ZONE IS NOT OPTIONAL, and this is the part that was actually broken. The
  // stacked case used to be `min-h-dvh` plus the DOCUMENT scroll — but this app pins
  // `html`, `body` and `#app` to `100dvh; overflow: hidden` (src/style.css), because the
  // console shell scrolls through its own regions and the document must never move. So
  // there was no document scroll to fall back to: everything past the fold was simply
  // clipped and unreachable. Measured on a 375x667 phone before this change — /signup
  // overran by 481px, /login by 290px, /signup/onboarding by 186px, with ZERO scrollable
  // elements on the page. The network panel and the bottom of the form could not be
  // reached at all. A shell that is the viewport has to carry the scroll zone itself.
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // Routed rather than followed, so the docs open without a full document load. A modified click
  // (new tab, new window) is left to the browser — that is what the real `href` is for.
  const onDocs = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    router.push('/site/docs')
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <!-- `kind="content"`, the same call the docs bar and the console's own bar make.
         The kind is what decides the INSET: `app` is a flat `--spacing-md` (16 at every
         width) while every other bar in this app opens on `--layout-boundary-inline`
         (16, then 24 from `sm`). This bar was the last one left on `app`, so from `sm`
         up its brand sat 8px to the left of the brand on the site nav the reader just
         came from and the docs bar the Documentation button leads to. -->
    <GlobalHeader
      kind="content"
      aria-label="Azion Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <!-- Signed-out screens: the brand mark goes back to the marketing home
             (the console home lives behind the login), matching how the website
             nav links its own logo (see SiteNav.vue).

             The DS `Brand` component, not a hand-inlined copy of the wordmark SVG:
             the lockup and its heights are the component's contract, so a header
             cannot drift to a size nobody else uses. The inlined copy here rendered
             at the 18px GlobalHeader.Brand pins any raw `svg` to; `kind="default"` +
             `size="small"` (16px) is the pair the site nav, docs bar, hub bar, rail
             and CreationHeader all render, so one brand reads at one size. -->
        <RouterLink
          to="/site/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </RouterLink>
      </GlobalHeader.Brand>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <!-- The demo's OWN documentation (/site/docs), not azion.com: it is a real page in
             this app, so the link stays in the SPA and drops the external-link glyph and the
             new tab that said otherwise. `href` keeps it a real anchor — middle-click and
             "open in new tab" still work — while the click is routed. -->
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          href="/site/docs"
          @click="onDocs"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <!-- The body is the leftover height, and below `lg` it is also the SCROLL ZONE.
         `min-h-0` is what lets it actually be the leftover instead of its own content
         height — without it a flex child refuses to shrink below its content and the
         "no page scroll" above becomes a clip with nothing to scroll.
         From `lg` the scroll moves down a level, into whichever half needs it. -->
    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <slot />
    </main>
  </div>
</template>
