<script setup>
  // Segregated marketing shell — the counterpart to AppLayout, with NO console
  // sidebar. It stacks the website nav, the page content, and the site footer in
  // a single scrolling column, so landing-page examples render full-width behind
  // the azion.com-style header. Pages pass their own contained sections through
  // the default slot.
  import SiteFooter from './SiteFooter.vue'
  import SiteNav from './SiteNav.vue'
</script>

<template>
  <!-- The global shell locks html/body/#app to `height: 100dvh; overflow: hidden`
       (the console AppLayout owns scrolling internally), so this marketing shell
       must own its own scroll region: a full-height, vertically-scrolling column.
       The sticky SiteNav sticks to the top of THIS container as it scrolls. -->
  <div class="flex h-dvh flex-col overflow-y-auto bg-[var(--bg-canvas)] text-[var(--text-default)]">
    <SiteNav />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
