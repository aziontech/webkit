<script setup>
  // Segregated marketing shell — the counterpart to AppLayout, with NO console
  // sidebar. It stacks the website nav, the page content, and the site footer in
  // a single scrolling column, so landing-page examples render full-width behind
  // the azion.com-style header. Pages pass their own contained sections through
  // the default slot.
  //
  // The marketing site is dark-only by design (the azion.com look): while this
  // shell is mounted we pin the document root to the dark theme regardless of the
  // global light/dark/system toggle, then restore the previous theme on leave so
  // the console pages keep the user's chosen mode.
  import SiteFooter from '@shared/ui/SiteFooter.vue'
  import { onBeforeUnmount, onMounted } from 'vue'

  import SiteNav from './SiteNav.vue'

  let previous = null

  onMounted(() => {
    const root = document.documentElement
    previous = {
      dataTheme: root.getAttribute('data-theme'),
      dark: root.classList.contains('azion-dark'),
      light: root.classList.contains('azion-light')
    }
    root.setAttribute('data-theme', 'dark')
    root.classList.add('azion', 'azion-dark')
    root.classList.remove('azion-light')
  })

  onBeforeUnmount(() => {
    if (!previous) return
    const root = document.documentElement
    if (previous.dataTheme) root.setAttribute('data-theme', previous.dataTheme)
    root.classList.toggle('azion-dark', previous.dark)
    root.classList.toggle('azion-light', previous.light)
  })
</script>

<template>
  <!-- The global shell locks html/body/#app to `height: 100dvh; overflow: hidden`
       (the console AppLayout owns scrolling internally), so this marketing shell
       must own its own scroll region: a full-height, vertically-scrolling column.
       The sticky SiteNav sticks to the top of THIS container as it scrolls.

       THE BOUNDARY IS NOT RE-DECLARED HERE. `--layout-boundary-inline` is one token with
       one value for the whole app, and the nav reads it and every band below it reads
       it — which is what makes "the bar and the page open on the same vertical" a fact
       instead of two numbers kept equal by hand. It was two numbers: the nav took the
       token while the bands hard-coded `xl`, so on every width narrower than the
       frame's cap — where the frame IS the window — the logo sat inside the headline
       under it. The bands read the token now (BannerContainer, SectionContainer), so
       there is nothing left for this shell to say. Above the caps the two part company by
       design: the frame centres at `--layout-measure-site` (1388) while the bar centres at
       its own `--layout-measure-site-header` (1620). Measured: one shared inset up to 1280,
       2px apart at 1440 (where the frame has just capped), 82 at 1600, and a flat 92 from
       1668 up, where the bar caps too — chrome held out at the window's two ends, content
       held to a reading frame. See SiteNav and `GlobalHeader kind="site"`. -->
  <div class="flex h-dvh flex-col overflow-y-auto bg-(--bg-canvas) text-(--text-default)">
    <SiteNav />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
