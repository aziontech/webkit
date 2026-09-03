<script setup>
  // /preview/present/:slide — THE DECK, FULL SCREEN, AT ITS OWN URL.
  //
  // Presenting used to be a boolean on /preview. It is a ROUTE now, and the three things that
  // buys are the reason:
  //
  //   ADDRESSABLE  `/preview/present/14` is a slide you can send someone, drop in a calendar
  //                invite, or open on the machine that is actually plugged into the projector.
  //   RELOADABLE   a refresh mid-rehearsal comes back to the slide you were on, not to slide one.
  //   ESCAPABLE    Escape has somewhere to GO — back to the deck — instead of flipping a flag the
  //                browser's own back button knows nothing about.
  //
  // Moving between slides REPLACES the history entry rather than pushing one. Pushing would make
  // Back walk the deck backwards one slide at a time, so leaving a 22-slide rehearsal would take
  // 22 presses; replacing keeps exactly one presentation entry, and Back leaves it.
  //
  // The chrome fades on idle because this is the surface that gets screen-shared. It is not
  // hidden — a presenter needs to find Next without guessing — it just gets out of the way after
  // a few still seconds, and any movement brings it back.
  import Button from '@aziontech/webkit/button'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SlideRenderer from '../components/SlideRenderer.vue'
  import { useDeckTheme } from '../composables/use-deck-theme.js'
  import { DECK } from '../data/deck.js'
  import { indexFromParam, numberOf, presentPath } from '../lib/deck-nav.js'

  const route = useRoute()
  const router = useRouter()
  const slides = DECK.slides

  useDeckTheme()

  // THE URL IS THE STATE. There is no `current` ref to keep in sync with the address bar — the
  // index is derived from the param, so a typed URL, a reload and an arrow key all move the deck
  // through exactly one path.
  const current = computed(() => indexFromParam(route.params.slide, slides.length))
  const slide = computed(() => slides[current.value])

  const goTo = (index) => {
    const next = Math.min(slides.length - 1, Math.max(0, index))
    if (next === current.value) return
    router.replace(presentPath(next))
  }

  const go = (delta) => goTo(current.value + delta)
  // Leaving hands the deck the slide that was showing (`?slide=`), so Escape puts the reader back
  // where they were rather than at the top of 23 slides they have to scroll through again.
  const leave = () => router.push({ path: '/preview', query: { slide: String(current.value + 1) } })

  // ── The chrome that gets out of the way ──────────────────────────────────────────────
  const chromeVisible = ref(true)
  let idleTimer = null

  const wake = () => {
    chromeVisible.value = true
    globalThis.clearTimeout(idleTimer)
    idleTimer = globalThis.setTimeout(() => (chromeVisible.value = false), 2500)
  }

  // ── Native full screen ───────────────────────────────────────────────────────────────
  //
  // The route already fills the window; this fills the SCREEN, which is the difference between
  // rehearsing and presenting. `f` is the shortcut the deck has always used for it. The request
  // can be refused (a browser only grants it from a user gesture, and some refuse it outright),
  // so the promise is caught rather than assumed — a refusal must leave the deck usable.
  const fullscreen = ref(false)

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      // Refused. The presentation is already full-window, so there is nothing to recover from.
    }
  }

  const syncFullscreen = () => {
    fullscreen.value = Boolean(document.fullscreenElement)
  }

  // ONE HANDLER, and Escape is deliberately NOT in it when the document is full screen: the
  // browser consumes that press to leave full screen and never delivers it here. Handling both
  // would take one press out of the deck — the reader would leave full screen and land back on
  // /preview in the same keystroke, which reads as the app losing the presentation.
  const onKey = (event) => {
    wake()
    if (event.key === 'Escape') {
      if (!document.fullscreenElement) leave()
      return
    }
    if (event.key === 'f') {
      toggleFullscreen()
      return
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault()
      go(1)
      return
    }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault()
      go(-1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      goTo(slides.length - 1)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointermove', wake)
    document.addEventListener('fullscreenchange', syncFullscreen)
    wake()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('pointermove', wake)
    document.removeEventListener('fullscreenchange', syncFullscreen)
    globalThis.clearTimeout(idleTimer)
    // Leaving the route must not leave the SCREEN pinned to a deck that is no longer showing.
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
  })

  // An out-of-range or missing slide number is corrected in the URL rather than silently ignored,
  // so what the address bar says and what is on screen cannot disagree.
  watch(
    () => route.params.slide,
    (param) => {
      const canonical = presentPath(indexFromParam(param, slides.length))
      if (route.path !== canonical) router.replace(canonical)
    },
    { immediate: true }
  )
</script>

<template>
  <div
    class="relative flex h-dvh flex-col overflow-hidden bg-(--bg-canvas) text-(--text-default)"
    data-testid="deck-present"
  >
    <!-- THE SLIDE TAKES THE WHOLE WINDOW — no padding, edge to edge. The chrome floats over it
         (it is absolutely positioned, below) precisely so it steals no pixel of the artboard, and
         a stage inset by even one spacing step is a stage the presentation is not filling.
         Measured at 1600x1000: the padded version scaled to 1552x873 with a 24px margin all
         round; without it the slide is 1600x900 and touches both side edges.

         `contain` is still the fit, and that is not a compromise — it is the only one that can be
         right. The artboard is a FIXED 16:9 (the whole canvas contract, lib/deck-canvas.js: the
         browser and the Figma build have to agree on 1920x1080), so on a window that is not 16:9
         something has to give. `contain` gives up the unused strip on the long axis; `cover` would
         instead crop the slide's own frame off the top and bottom, and stretching would put the
         deck's type off its own scale. Press F: on a 16:9 display real full screen fills it
         exactly, with nothing left over. -->
    <main class="flex min-h-0 flex-1 items-center justify-center">
      <SlideRenderer
        :slide="slide"
        fit="contain"
      />
    </main>

    <!-- ── The chrome, on idle ──────────────────────────────────────────────────────── -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-md) transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      :class="chromeVisible ? 'opacity-100' : 'opacity-0'"
    >
      <span class="text-label-code-md text-(--text-muted)">
        {{ numberOf(current) }} / {{ numberOf(slides.length - 1) }}
      </span>
      <span class="truncate text-label-md text-(--text-muted)">{{ slide.section }}</span>
    </div>

    <div
      class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-md) transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      :class="chromeVisible ? 'opacity-100' : 'pointer-events-none opacity-0'"
    >
      <span class="text-label-md text-(--text-disabled)">
        Arrows or space to move · F for full screen · Escape to leave
      </span>

      <span class="flex items-center gap-(--spacing-xs)">
        <Button
          :label="fullscreen ? 'Exit full screen' : 'Full screen'"
          kind="text"
          size="medium"
          :icon="fullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"
          @click="toggleFullscreen"
        />
        <Button
          label="Back to deck"
          kind="text"
          size="medium"
          icon="pi pi-th-large"
          @click="leave"
        />
        <Button
          label="Previous"
          kind="outlined"
          size="medium"
          icon="pi pi-chevron-left"
          :disabled="current === 0"
          @click="go(-1)"
        />
        <Button
          label="Next"
          kind="outlined"
          size="medium"
          icon="pi pi-chevron-right"
          :disabled="current === slides.length - 1"
          @click="go(1)"
        />
      </span>
    </div>
  </div>
</template>
