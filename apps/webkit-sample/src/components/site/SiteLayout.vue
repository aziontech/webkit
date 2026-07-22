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
  import { onBeforeUnmount, onMounted } from 'vue'

  import SiteFooter from './SiteFooter.vue'
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
       The sticky SiteNav sticks to the top of THIS container as it scrolls. -->
  <div class="flex h-dvh flex-col overflow-y-auto bg-[var(--bg-canvas)] text-[var(--text-default)]">
    <SiteNav />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
