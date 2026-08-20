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
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AppLayout from '../../components/shell/AppLayout.vue'
  import { setMode, useSampleMode } from '../../lib/state/sample-mode'
  import Home from './Home.vue'
  import HomeEmptyState from './HomeEmptyState.vue'

  const props = defineProps({
    /** `'empty'` / `'populated'` to pin one version; empty follows the sample mode. */
    version: { type: String, default: '' }
  })

  const { accountEmpty } = useSampleMode()

  const showFirstUse = computed(() =>
    props.version ? props.version === 'empty' : accountEmpty.value
  )

  // ── THE FIRST RESOURCE ──
  //
  // /domains/new returns here carrying what it made (`?domain=`, see
  // ./CreateResource.vue). That is the account ceasing to be empty — and the console
  // already HAS the page for an account that owns things: the populated Overview, with
  // its Recents trail and its resource cards. So the signal flips the sample's VERSION
  // and lands on /home.
  //
  // The first access used to answer this itself, by seeding a row and drawing its own
  // usage rail beside its own table. That was a second, private version of the
  // populated Overview — a shape nothing else in the console has — kept alive only to
  // animate the empty → populated moment. The moment is not worth a second page: the
  // version is a knob (../lib/sample-mode.js), and creating the first resource is just
  // that knob turning.
  //
  // It runs HERE and not inside HomeEmptyState because the version is this component's
  // to decide, and because the reader may return to a PINNED address
  // (/home-empty-state), where flipping the mode alone would change nothing on screen.
  // The query is dropped in the same move: a creation is an EVENT, and a URL that still
  // carried it would re-fire on every reload and every Back.
  const route = useRoute()
  const router = useRouter()

  onMounted(() => {
    if (!route.query.domain) return
    setMode('populated')
    router.replace({ path: '/home', query: { email: route.query.email || undefined } })
  })

  // The ⌘K palette belongs to the shell, so the hero's search field asks for it
  // through an event rather than reaching for a ref it no longer has.
  const shell = ref(null)
  const openPalette = () => shell.value?.showPalette()
</script>

<template>
  <!-- `padded=false`: BOTH versions carry their own boundary, on the same block as
       the measure — and it is now the SAME measure for both, the standard page container
       (`layout-column layout-boundary`, --layout-measure / 1388px). One width under one
       URL: the empty half BECOMES the populated one the moment an account creates its
       first resource, and a container that resized under that transition made a change
       of content read as a change of page. (The empty half used to keep the focused cap
       at 1024px; each file carries the argument.) The shell's inset is the right
       default for a page that just flows, and the wrong one for these two: Home is a
       frame from `xl` (only its resource list scrolls), and a frame whose inset lives
       outside it scrolls to an edge it cannot measure. Passing the boundary down means
       the inset and the measure are declared together, in the file that owns the
       layout, which is also the documented self-padded shape (Foundations/Layout). -->
  <AppLayout
    ref="shell"
    active="overview"
    :padded="false"
    :breadcrumb="[{ label: 'Overview' }]"
  >
    <HomeEmptyState
      v-if="showFirstUse"
      @open-palette="openPalette"
    />
    <Home v-else />
  </AppLayout>
</template>
