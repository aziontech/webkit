<script setup>
  // /preview — THE DECK, IN THE BROWSER, BEFORE IT IS IN FIGMA.
  //
  // This route is the deck's first form and its reference: the slides are composed from the
  // real design system, on the real 1920x1080 artboard, so every coordinate a Figma build
  // needs can be read off this page rather than invented. That ordering is deliberate — a deck
  // designed straight into Figma has no source of truth to check against, and a token that
  // changes later cannot reach it.
  //
  // TWO MODES, one for each job:
  //
  //   Deck     every slide in order, each with its number, its section and its speaker notes.
  //            This is the reviewing surface — it is where copy gets fixed and where you see
  //            that three layouts in a row are the same shape.
  //   Present  one slide, fit to the window, arrow keys to move. This is the rehearsing
  //            surface, and it is also what you screen-share if Figma is not in the room.
  //
  // The app shell pins html/body/#app to the viewport with overflow hidden (the console's
  // layout owns scrolling through its own regions), so this view owns its scroll region the
  // same way the marketing shell does: one full-height column that scrolls itself.
  //
  // The deck is DARK. The marketing site pins the dark theme while it is mounted, for the same
  // reason: the framed language was designed against `--bg-canvas` at #000, and the corner
  // ticks and hairlines are tuned to read on it. The previous theme is restored on leave so
  // the console keeps whatever the reader had chosen.
  import Button from '@aziontech/webkit/button'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

  import SlideRenderer from '../components/SlideRenderer.vue'
  import { DECK, sections } from '../data/deck.js'
  import { CANVAS } from '../lib/deck-canvas.js'
  import { openPrintScope } from '../lib/deck-export.js'

  const presenting = ref(false)
  const exporting = ref(false)
  const current = ref(0)
  const slides = DECK.slides

  const slide = computed(() => slides[current.value])
  const rows = sections()

  const go = (delta) => {
    current.value = Math.min(slides.length - 1, Math.max(0, current.value + delta))
  }

  // One handler for both modes: the arrows move the presented slide, and Escape leaves
  // presenting. `f` enters it, which is the one shortcut worth having on a rehearsal surface.
  const onKey = (event) => {
    if (event.key === 'f' && !presenting.value) {
      presenting.value = true
      return
    }
    if (event.key === 'Escape') {
      presenting.value = false
      return
    }
    if (!presenting.value) return
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault()
      go(1)
    }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault()
      go(-1)
    }
  }

  let previousTheme = null

  onMounted(() => {
    const root = document.documentElement
    previousTheme = {
      dataTheme: root.getAttribute('data-theme'),
      dark: root.classList.contains('azion-dark'),
      light: root.classList.contains('azion-light')
    }
    root.setAttribute('data-theme', 'dark')
    root.classList.add('azion', 'azion-dark')
    root.classList.remove('azion-light')
    window.addEventListener('keydown', onKey)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    if (!previousTheme) return
    const root = document.documentElement
    if (previousTheme.dataTheme) root.setAttribute('data-theme', previousTheme.dataTheme)
    root.classList.toggle('azion-dark', previousTheme.dark)
    root.classList.toggle('azion-light', previousTheme.light)
  })

  const numberOf = (index) => String(index + 1).padStart(2, '0')

  /** A printed sheet is the artboard, exactly — same constant the stage and the `@page` rule take. */
  const sheetStyle = { width: `${CANVAS.width}px`, height: `${CANVAS.height}px` }

  const presentFrom = (entry) => {
    current.value = slides.indexOf(entry)
    presenting.value = true
  }

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
    // browser that fires neither cannot leave 15 artboards mounted forever.
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
        <span
          v-if="presenting"
          class="text-label-md text-(--text-muted)"
          >{{ numberOf(current) }} / {{ numberOf(slides.length - 1) }} · {{ slide.section }}</span
        >
        <Button
          label="Export PDF"
          kind="outlined"
          size="medium"
          icon="pi pi-file-pdf"
          :loading="exporting"
          @click="exportPdf"
        />
        <Button
          :label="presenting ? 'Back to deck' : 'Present'"
          :kind="presenting ? 'outlined' : 'primary'"
          size="medium"
          :icon="presenting ? 'pi pi-list' : 'pi pi-play'"
          @click="presenting = !presenting"
        />
      </div>
    </header>

    <!-- ── Present: one slide, fit to the window ────────────────────────────────────── -->
    <main
      v-if="presenting"
      class="flex min-h-0 flex-1 flex-col"
    >
      <div class="flex min-h-0 flex-1 items-center justify-center p-(--spacing-lg)">
        <SlideRenderer
          :slide="slide"
          fit="contain"
        />
      </div>
      <footer
        class="flex shrink-0 items-center justify-between gap-(--spacing-lg) border-t border-(--border-default) px-(--layout-boundary-inline) py-(--spacing-xs)"
      >
        <span class="text-label-md text-(--text-muted)"
          >Arrows or space to move · Escape to leave</span
        >
        <span class="flex items-center gap-(--spacing-xs)">
          <Button
            label="Previous"
            kind="text"
            size="medium"
            icon="pi pi-chevron-left"
            :disabled="current === 0"
            @click="go(-1)"
          />
          <Button
            label="Next"
            kind="text"
            size="medium"
            icon="pi pi-chevron-right"
            :disabled="current === slides.length - 1"
            @click="go(1)"
          />
        </span>
      </footer>
    </main>

    <!-- ── Deck: every slide, with its notes ────────────────────────────────────────── -->
    <main
      v-else
      class="min-h-0 flex-1 overflow-y-auto"
    >
      <div
        class="mx-auto flex w-full max-w-(--container-7xl) flex-col gap-(--spacing-xxl) px-(--layout-boundary-inline) py-(--spacing-xl)"
      >
        <section
          v-for="row in rows"
          :key="row.name"
          class="flex flex-col gap-(--spacing-xl)"
        >
          <!-- The section name is the slide-grid ROW in Figma Slides: it labels the row in the
               editor and lets a speaker jump between groups in Presenter View. -->
          <h2
            class="m-0 flex items-baseline gap-(--spacing-md) border-b border-(--border-default) pb-(--spacing-sm) text-overline-md text-(--text-muted)"
          >
            {{ row.name }}
            <span class="text-label-md text-(--text-disabled)">{{ row.slides.length }} slides</span>
          </h2>

          <article
            v-for="entry in row.slides"
            :key="entry.headline"
            class="flex flex-col gap-(--spacing-md)"
          >
            <div class="flex items-baseline gap-(--spacing-md)">
              <span class="text-label-code-md text-(--primary)">{{
                numberOf(slides.indexOf(entry))
              }}</span>
              <span class="text-label-md text-(--text-muted)">{{ entry.kind }}</span>
              <button
                type="button"
                class="text-label-md text-(--text-link) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) motion-reduce:transition-none"
                @click="presentFrom(entry)"
              >
                Present from here
              </button>
            </div>

            <SlideRenderer :slide="entry" />

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
        </section>
      </div>
    </main>

    <!-- ── Export: the print sheets ─────────────────────────────────────────────────── -->
    <!--
      Teleported to <body> because the shell above is a viewport-height, overflow-hidden column
      and the document itself is pinned the same way (src/style.css): anywhere inside it, a
      1920x1080 stack of 15 sheets is clipped to one page. openPrintScope() hides #app and gives
      the document its height back for the duration of the dialog, leaving these as the only
      thing on the paper.

      Mounted only while exporting — 15 artboards is real work, and the deck below already
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
