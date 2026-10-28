<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { SITE_FOOTER, SITE_NAV } from '../data/site-shell'
  import { useForceDarkTheme } from '../composables/useForceDarkTheme'
  import SiteFooter from '../ui/sections/SiteFooter.vue'
  import SiteNav from '../ui/sections/SiteNav.vue'

  defineProps({
    /** Float the nav over the page's first band instead of stacking it above. */
    navOverlay: { type: Boolean, default: false }
  })

  useForceDarkTheme()

  // a route with `meta.embed` renders the page with no nav or footer, for embedding on its own
  const route = useRoute()
  const embed = computed(() => route.meta.embed === true)
</script>

<template>
  <div
    v-if="navOverlay"
    class="grid h-dvh grid-cols-1 grid-rows-[1fr_auto] overflow-y-auto [&>header]:col-start-1 [&>header]:row-span-2 [&>header]:row-start-1 [&>header]:self-start scroll-smooth bg-(--bg-canvas) text-(--text-default) selection:bg-(--primary-mask) selection:text-(--primary) motion-reduce:scroll-auto"
  >
    <SiteNav
      v-if="!embed"
      v-bind="SITE_NAV"
    />
    <main class="col-start-1 row-start-1 min-w-0">
      <slot />
    </main>
    <SiteFooter
      v-if="!embed"
      v-bind="SITE_FOOTER"
      class="col-start-1 row-start-2"
    />
  </div>
  <div
    v-else
    class="flex h-dvh flex-col overflow-y-auto scroll-smooth [--banner-offset:3.5rem] bg-(--bg-canvas) text-(--text-default) selection:bg-(--primary-mask) selection:text-(--primary) motion-reduce:scroll-auto"
  >
    <SiteNav
      v-if="!embed"
      v-bind="SITE_NAV"
    />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter
      v-if="!embed"
      v-bind="SITE_FOOTER"
    />
  </div>
</template>
