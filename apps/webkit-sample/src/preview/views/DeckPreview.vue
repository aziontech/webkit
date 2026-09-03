<script setup>
  // /preview — THE DECK, IN THE BROWSER, BEFORE IT IS IN FIGMA.
  //
  // This route is the deck's first form and its reference: the slides are composed from the
  // real design system, on the real 1920x1080 artboard, so every coordinate a Figma build
  // needs can be read off this page rather than invented. That ordering is deliberate — a deck
  // designed straight into Figma has no source of truth to check against, and a token that
  // changes later cannot reach it.
  //
  // IT IS THE REVIEWING SURFACE, and it is shaped like a deck editor because that is the shape
  // reviewing wants: a FILMSTRIP down the left to see where you are in 22 slides and jump, a
  // CANVAS in the middle holding one slide at a time at a size copy can actually be read at, and
  // a GRID behind a switch for the other question a deck raises — "do three of these in a row
  // look the same?" — which no amount of scrolling answers.
  //
  // Presenting is NOT here. It is its own route (`/preview/present/:slide`, DeckPresent.vue), so a
  // slide is addressable, a reload keeps its place, and Escape has somewhere to go back TO.
  //
  // The app shell pins html/body/#app to the viewport with overflow hidden (the console's layout
  // owns scrolling through its own regions), so this view owns its scroll regions the same way:
  // the filmstrip and the canvas each scroll themselves inside a fixed-height column.
  import Button from '@aziontech/webkit/button'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeckSlideCard from '../components/DeckSlideCard.vue'
  import DeckThumbnail from '../components/DeckThumbnail.vue'
  import SlideRenderer from '../components/SlideRenderer.vue'
  import { useDeckTheme } from '../composables/use-deck-theme.js'
  import { DECK, sections } from '../data/deck.js'
  import { CANVAS } from '../lib/deck-canvas.js'
  import { openPrintScope } from '../lib/deck-export.js'
  import { clampIndex, numberOf, presentPath } from '../lib/deck-nav.js'

  const route = useRoute()
  const router = useRouter()
  const slides = DECK.slides
  const rows = sections()

  useDeckTheme()

  /** `stacked` reads the deck one slide at a time; `grid` is the whole deck at once. */
  const view = ref('stacked')
  const VIEWS = [
    { label: 'Stacked', value: 'stacked' },
    { label: 'Grid', value: 'grid' }
  ]

  const current = ref(0)
  const exporting = ref(false)
  const slide = computed(() => slides[current.value])

  const present = (index = current.value) => router.push(presentPath(index))

  // ── Which slide is "current", and the two things that answer it ──────────────────────
  //
  // The filmstrip and the canvas are two scroll regions showing the same deck, and either can be
  // the one that moved. Scrolling the canvas has to light up the rail; clicking the rail has to
  // move the canvas. Both go through `current`, which is therefore written from two places and
  // read from three — so it is the ONE piece of state here, not a selection in the rail plus a
  // scroll position in the canvas that have to be kept agreeing.
  const scroller = ref(null)
  const stackEls = ref([])
  const gridEls = ref([])
  const railEls = ref([])

  const setStackEl = (el, index) => {
    stackEls.value[index] = el ?? null
  }
  const setGridEl = (el, index) => {
    gridEls.value[index] = el ?? null
  }
  const setRailEl = (el, index) => {
    railEls.value[index] = el ?? null
  }

  let observer = null

  // The canvas reports itself with an IntersectionObserver rather than a scroll listener: the
  // inset root margin turns the viewport into a thin band across the middle of the canvas, so the
  // slide that is intersecting is by construction the one the reader is looking at. A scroll
  // handler would have to re-derive that from offsets on every frame, and would get it wrong for
  // the first and last slide, which never reach the top of the region.
  const wireObserver = async () => {
    observer?.disconnect()
    observer = null
    if (view.value !== 'stacked') return
    await nextTick()
    if (!scroller.value) return
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number(entry.target.dataset.index)
          if (Number.isFinite(index)) current.value = index
        }
      },
      { root: scroller.value, rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    for (const el of stackEls.value) if (el) observer.observe(el)
  }

  // Selecting a slide from the rail or the grid: the canvas is where a slide is READ, so both
  // land there. The jump is instant, not smooth — a smooth scroll across 20 slides drags the
  // observer through every slide it passes, and the rail then chases the animation instead of
  // showing where the reader asked to go.
  const focusSlide = async (index) => {
    current.value = index
    view.value = 'stacked'
    await nextTick()
    stackEls.value[index]?.scrollIntoView({ block: 'start' })
  }

  // The rail follows the canvas, and only ever by the minimum: `nearest` scrolls it just enough
  // to bring the cell into view, so a reader scrolling one slide at a time never has the rail
  // jump under the pointer they are about to click with.
  watch(current, (index) => {
    railEls.value[index]?.scrollIntoView({ block: 'nearest' })
  })

  // SWITCHING THE VIEW KEEPS THE READER'S PLACE. Both views scroll the same region, so without
  // this the canvas keeps its pixel offset while the content under it changes wholesale — you
  // leave the grid on slide 16 and land in the stacked canvas at whatever slide happens to sit
  // at that many pixels down. Re-scrolling to `current` first, and only then re-wiring the
  // observer, is also what stops the observer's initial callback from overwriting the position
  // with whatever was under the middle band before the scroll.
  const onViewChange = async () => {
    const index = current.value
    await nextTick()
    if (view.value === 'grid') gridEls.value[index]?.scrollIntoView({ block: 'center' })
    else stackEls.value[index]?.scrollIntoView({ block: 'start' })
    await wireObserver()
  }

  watch(view, onViewChange)

  // `f` is the deck's own shortcut for "show this". It is the only key this surface takes —
  // arrows belong to the scroll region the reader is in, and taking them here would break
  // scrolling the canvas with the keyboard.
  const onKey = (event) => {
    if (event.key !== 'f' || event.metaKey || event.ctrlKey || event.altKey) return
    present()
  }

  // COMING BACK FROM THE PRESENTATION LANDS ON THE SLIDE THAT WAS SHOWING. `?slide=` is a
  // hand-off, not state: the presenter writes it on the way out, this reads it once and then
  // clears it, so the deck's URL stays `/preview` and a reload does not re-seed a position the
  // reader has since scrolled away from.
  //
  // The seed runs BEFORE the observer is wired, deliberately. An IntersectionObserver fires an
  // initial callback for everything it observes — wired first, it would report slide one, write
  // it to `current`, and take the reader back to the top of a deck they had just left in the
  // middle.
  onMounted(async () => {
    window.addEventListener('keydown', onKey)
    const seed = Number.parseInt(route.query.slide, 10)
    if (Number.isFinite(seed)) {
      await focusSlide(clampIndex(seed - 1, slides.length))
      router.replace({ path: '/preview' })
    }
    await wireObserver()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    observer?.disconnect()
  })

  /** A printed sheet is the artboard, exactly — same constant the stage and the `@page` rule take. */
  const sheetStyle = { width: `${CANVAS.width}px`, height: `${CANVAS.height}px` }

  // EXPORT — every slide, one per page, through the browser's print pipeline.
  //
  // No renderer and no dependency: the sheets below are the same SlideRenderer the deck shows,
  // at `fit="none"` (1:1), teleported to <body> so no ancestor of the app shell can clip them,
  // and revealed only by the print media query. The browser rasterises what it already knows
  // how to lay out, which is why the PDF is the artboard and not an approximation of it — the
  // alternative (a canvas snapshot, or a headless re-render) would have to reproduce the
  // theme's cascade to get there.
  //
  // The two awaits are load-bearing. `nextTick` puts the sheets in the DOM; `document.fonts.ready`
  // waits for Sora and Proto Mono, which arrive from the CDN — printing before they land renders
  // the deck in the fallback face, and print is a one-shot rasterisation with no reflow to fix it
  // afterwards.
  const exportPdf = async () => {
    if (exporting.value) return
    exporting.value = true
    await nextTick()
    await document.fonts?.ready

    const closeScope = openPrintScope(DECK.title)
    // `window.print()` blocks until the dialog closes in Chromium and WebKit, but not in every
    // engine — and tearing the sheets down while the dialog is still open would print a blank
    // deck. `afterprint` is the signal that holds in both cases; the timeout is only there so a
    // browser that fires neither cannot leave 22 artboards mounted forever.
    const dismissed = new Promise((resolve) => {
      window.addEventListener('afterprint', resolve, { once: true })
      setTimeout(resolve, 60_000)
    })
    try {
      window.print()
      await dismissed
    } finally {
      closeScope()
      exporting.value = false
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas) text-(--text-default)">
    <!-- The chrome is not part of the deck: it takes the app's own boundary inset and the
         console's control height, so nothing here can be mistaken for a slide. -->
    <header
      class="flex shrink-0 items-center justify-between gap-(--spacing-lg) border-b border-(--border-default) px-(--layout-boundary-inline) py-(--spacing-sm)"
    >
      <div class="flex min-w-0 items-baseline gap-(--spacing-md)">
        <span class="text-label-code-md text-(--primary)">/preview</span>
        <h1 class="m-0 truncate text-heading-xs text-(--text-default)">{{ DECK.title }}</h1>
        <span class="shrink-0 text-label-md text-(--text-muted)"
          >{{ slides.length }} slides · {{ rows.length }} sections</span
        >
      </div>

      <div class="flex shrink-0 items-center gap-(--spacing-md)">
        <Button
          label="Export PDF"
          kind="outlined"
          size="medium"
          icon="pi pi-file-pdf"
          :loading="exporting"
          @click="exportPdf"
        />
        <Button
          label="Present"
          kind="primary"
          size="medium"
          icon="pi pi-play"
          @click="present()"
        />
      </div>
    </header>

    <div class="flex min-h-0 flex-1">
      <!-- ── The filmstrip ──────────────────────────────────────────────────────────────
           Grouped by SECTION, because a section here is the slide-grid row the deck becomes in
           Figma Slides — the same grouping the editor labels beside the row and Presenter View
           lets a speaker jump between. A flat strip of 22 would hide the deck's structure at
           exactly the moment the reader is looking for it.

           It stands down in the grid view: the grid IS the overview, and a rail beside it would
           be the same 22 slides mounted twice. -->
      <aside
        v-if="view === 'stacked'"
        class="hidden w-(--container-3xs) shrink-0 overflow-y-auto overscroll-contain border-r border-(--border-default) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-md) lg:block"
        aria-label="Slides"
      >
        <nav class="flex flex-col gap-(--spacing-lg)">
          <div
            v-for="row in rows"
            :key="row.name"
            class="flex flex-col gap-(--spacing-xs)"
          >
            <h2 class="m-0 px-(--spacing-xxs) text-overline-md text-(--text-disabled)">
              {{ row.name }}
            </h2>
            <!-- The ref goes on the <li>, not on the component. A ref bound to a component hands
                 back its public instance, so reaching the DOM means going through `$el` — which
                 is the right element only for as long as that component keeps exactly one root
                 node, and silently becomes a comment node the day someone adds a note above it.
                 An element ref is the element. -->
            <ul class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0">
              <li
                v-for="entry in row.slides"
                :key="slides.indexOf(entry)"
                :ref="(el) => setRailEl(el, slides.indexOf(entry))"
              >
                <DeckThumbnail
                  :slide="entry"
                  :index="slides.indexOf(entry)"
                  :selected="current === slides.indexOf(entry)"
                  kind="rail"
                  @click="focusSlide(slides.indexOf(entry))"
                />
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- ── The canvas ─────────────────────────────────────────────────────────────────
           A shade off the chrome, so the matted slides read as objects ON a surface rather than
           as holes in one. This is the only region that scrolls with content in it, and it is
           centred in whatever the filmstrip leaves. -->
      <main
        ref="scroller"
        class="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-(--bg-surface)"
      >
        <!-- STACKED — one slide at a time, at reading size. -->
        <div
          v-if="view === 'stacked'"
          class="mx-auto flex w-full max-w-(--container-6xl) flex-col gap-(--spacing-xxl) px-(--spacing-xl) py-(--spacing-xl)"
        >
          <article
            v-for="(entry, index) in slides"
            :key="index"
            :ref="(el) => setStackEl(el, index)"
            :data-index="index"
            class="flex scroll-mt-(--spacing-xl) flex-col gap-(--spacing-md)"
          >
            <div class="flex items-baseline gap-(--spacing-md)">
              <span class="text-label-code-md text-(--primary)">{{ numberOf(index) }}</span>
              <span class="text-label-md text-(--text-muted)">{{ entry.section }}</span>
              <span class="text-label-md text-(--text-disabled)">{{ entry.kind }}</span>
              <button
                type="button"
                class="text-label-md text-(--text-link) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) motion-reduce:transition-none"
                @click="present(index)"
              >
                Present from here
              </button>
            </div>

            <DeckSlideCard :slide="entry" />

            <!-- Speaker notes travel with the slide from here into Figma unchanged, so this is
                 where they get written and reviewed. Figma renders them as markdown: lists,
                 bold, italic and strikethrough only. -->
            <details
              v-if="entry.notes"
              class="border-t border-(--border-muted) pt-(--spacing-sm)"
            >
              <summary class="cursor-pointer text-label-md text-(--text-muted)">
                Speaker notes
              </summary>
              <pre
                class="m-0 mt-(--spacing-sm) whitespace-pre-wrap text-body-code-sm text-(--text-muted)"
                >{{ entry.notes }}</pre>
            </details>
          </article>
        </div>

        <!-- GRID — the whole deck at once, which is the only way to see RHYTHM: three of the same
             layout in a row, a section that is all text, a run with no evidence in it. Clicking a
             cell opens it in the stacked canvas, the way an overview hands a slide back to the
             surface that can actually be read. -->
        <ul
          v-else
          class="mx-auto m-0 grid w-full max-w-(--container-7xl) list-none grid-cols-1 gap-(--spacing-xl) px-(--spacing-xl) py-(--spacing-xl) sm:grid-cols-2 xl:grid-cols-3"
        >
          <li
            v-for="(entry, index) in slides"
            :key="index"
            :ref="(el) => setGridEl(el, index)"
          >
            <DeckThumbnail
              :slide="entry"
              :index="index"
              :selected="current === index"
              kind="grid"
              @click="focusSlide(index)"
            />
          </li>
        </ul>
      </main>
    </div>

    <!-- ── The view switch ────────────────────────────────────────────────────────────
         Centred in its own row rather than parked in the header, for the same reason a zoom
         control is: it acts on the canvas below it, not on the deck as a document. The two
         readings on either side are what the switch is FOR — where you are, and how much there
         is — so they sit on the same rule. -->
    <footer
      class="grid shrink-0 grid-cols-3 items-center gap-(--spacing-md) border-t border-(--border-default) px-(--layout-boundary-inline) py-(--spacing-xs)"
    >
      <!-- The parts are spaced by a flex GAP, not by whitespace between the spans: Vue condenses
           whitespace that spans a newline to nothing, so a formatter wrapping this line is enough
           to turn `12 / 23` into `12/ 23`, with nothing to show for it in the diff. -->
      <span
        class="flex min-w-0 items-baseline gap-(--spacing-xxs) text-label-md text-(--text-muted)"
      >
        <span class="text-label-code-md text-(--primary)">{{ numberOf(current) }}</span>
        <span class="text-label-code-md text-(--text-disabled)">
          / {{ numberOf(slides.length - 1) }}
        </span>
        <span class="truncate">· {{ slide.section }}</span>
      </span>

      <span class="flex justify-center">
        <SegmentedButton
          v-model="view"
          :options="VIEWS"
          size="medium"
          aria-label="Slide layout"
        />
      </span>

      <span class="text-right text-label-md text-(--text-disabled)">F to present</span>
    </footer>

    <!-- ── Export: the print sheets ─────────────────────────────────────────────────── -->
    <!--
      Teleported to <body> because the shell above is a viewport-height, overflow-hidden column
      and the document itself is pinned the same way (src/style.css): anywhere inside it, a
      1920x1080 stack of sheets is clipped to one page. openPrintScope() hides #app and gives
      the document its height back for the duration of the dialog, leaving these as the only
      thing on the paper.

      Mounted only while exporting — 22 artboards is real work, and the canvas below already
      renders every slide once. `hidden print:block` is what keeps them off the screen in the
      moment between mounting and the dialog opening.
    -->
    <Teleport to="body">
      <div
        v-if="exporting"
        class="hidden print:block"
        aria-hidden="true"
        data-testid="deck-export-sheets"
      >
        <!-- One page per slide, each the artboard's own box. The explicit width matters: a
             block-level sheet would otherwise take the BODY's width, and if the dialog's paper
             is narrower than 1920 the 1:1 stage inside overflows and the slide loses its right
             edge — silently, since the page it lands on is still the right shape.

             The break goes on all but the last: Chrome honours a trailing `break-after: page`
             with a trailing blank page. `print-color-adjust` is what carries the dark canvas
             onto the paper — without it the browser drops every background and the deck prints
             as light text on white. -->
        <div
          v-for="(entry, index) in slides"
          :key="index"
          class="overflow-hidden [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
          :class="index < slides.length - 1 ? 'break-after-page' : ''"
          :style="sheetStyle"
        >
          <SlideRenderer
            :slide="entry"
            fit="none"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
