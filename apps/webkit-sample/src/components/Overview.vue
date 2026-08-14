<script setup>
  // /home — the console's landing page, which is two screens under one URL, and the
  // one place that owns the shell around them.
  //
  // An account that owns nothing and an account that owns things are not the same
  // page, and the reader should not have to know which one they are getting: it is
  // the same address, and what changes is the version of the sample in force
  // (../lib/sample-mode.js owns the condition and argues it).
  //
  //   HomeEmptyState → the hero, the ⌘K field and the three doors. A brand-new
  //     account has nothing to meter and nothing to list.
  //   Home           → usage beside the resource list, opening on Applications.
  //
  // ── WHY THE SHELL LIVES HERE ──
  //
  // AppLayout is mounted ONCE, here, and the two versions render only their content.
  // When each version owned its own shell, switching versions unmounted the sidebar
  // and the header and mounted new ones: measured 120ms after the switch, the nav,
  // the header and the content zone were all gone from the DOM and `pageEnter` was
  // running again at opacity 0.8 / −4.9px. Nothing had navigated — the same URL was
  // showing the same page's other half — but it read as a full reload of the app.
  //
  // With the shell hoisted, a version switch changes only what is inside the content
  // zone: the chrome holds still, the route transition does not replay (it is keyed
  // on the path, which did not change), and the incoming version plays its own
  // arrival — its wire, then `animate-content-enter`. Which is the truth of what happened:
  // the page did not arrive, its content did.
  //
  // ── PINNING A VERSION ──
  //
  // `version` pins one regardless of the mode, for the routes that exist so a review
  // can link to a specific shape (/home-empty-state, /home-populated). Unset — the
  // /home case — follows the sample's mode.
  import { computed, ref } from 'vue'

  import { useSampleMode } from '../lib/sample-mode'
  import Home from './Home.vue'
  import HomeEmptyState from './HomeEmptyState.vue'
  import AppLayout from './ui/AppLayout.vue'

  const props = defineProps({
    /** `'empty'` / `'populated'` to pin one version; empty follows the sample mode. */
    version: { type: String, default: '' }
  })

  const { accountEmpty } = useSampleMode()

  const showFirstUse = computed(() =>
    props.version ? props.version === 'empty' : accountEmpty.value
  )

  // The ⌘K palette belongs to the shell, so the hero's search field asks for it
  // through an event rather than reaching for a ref it no longer has.
  const shell = ref(null)
  const openPalette = () => shell.value?.showPalette()
</script>

<template>
  <AppLayout
    ref="shell"
    active="overview"
    :breadcrumb="[{ label: 'Overview' }]"
  >
    <HomeEmptyState
      v-if="showFirstUse"
      @open-palette="openPalette"
    />
    <Home v-else />
  </AppLayout>
</template>
