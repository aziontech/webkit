<script setup>
  // THE section. One shape for every band in the console that groups fields or
  // content under a title: create pages, account settings, application settings,
  // the forms index. Same container, same separation, same rhythm, everywhere.
  //
  // THE SPLIT. The title and its hint sit on the LEFT; the content sits on the
  // RIGHT; nothing is boxed. The card the console used to draw around each band
  // (a flush CardBox wrapping an Item.List) is what made settings verbose: it
  // spent a border and two paddings on separation, forced every field into a row
  // whose control was capped at `--layout-measure-control` and pushed to the far
  // right, and repeated a description under every single row. The split spends a
  // hairline on separation instead, lets the controls fill the column they are
  // being typed into, and says once — in the left column — what the whole band is
  // for. Fewer pixels, more field.
  //
  // SEPARATION IS THE COMPONENT'S JOB, not the consumer's. Every Section after the
  // first in a container opens with the band step above it — `--layout-section-gap`,
  // the same step every settings page in the console puts between its bands, so a
  // create page and the page it becomes breathe identically — and, when `divided`,
  // a rule with the same step below it. It keys off `:not(:first-of-type)` rather
  // than `:first-child` because the container is usually a `<fieldset>` whose first
  // child is its `<legend>`. So a page just stacks Sections; it never spaces or
  // divides them by hand, and no two pages can drift apart on how far apart their
  // bands sit.
  //
  // The left column is `sticky` from `md` up, so on a long band the title stays
  // beside the fields it names instead of scrolling away from them.
  //
  // `stacked` turns the split off: the title sits ABOVE full-width content. That is
  // for a band whose content needs the whole measure — a table, a resource list, a
  // grid of cards — where a 20rem title column would only squeeze it.
  //
  // The heading is rendered here rather than through SectionHeading: that component
  // bakes in a `--spacing-xs` optical inset to line its title up with the padded
  // rows of the flush CardBox beneath it, and paints the title muted because the
  // card already separates the band. Neither holds without the card — here the
  // title is the only thing naming the band, and it aligns with the page heading's
  // own left edge.
  import Hint from '@aziontech/webkit/hint'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, onScopeDispose, ref, useId, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { userDriven } from '../../lib/interaction'


  const props = defineProps({
    // The band title (the <h2>).
    title: { type: String, default: '' },
    // Optional glyph before the title (an icon-font class, e.g. `pi pi-cog`). It is
    // decoration for the title, never the only thing naming the band — the title
    // always carries the meaning, so the glyph is `aria-hidden` and a band with no
    // icon reads identically to a screen reader.
    icon: { type: String, default: '' },
    // Guidance for the band, rendered as webkit's `Hint` — the info glyph beside
    // the title that reveals its text on hover or focus. NOT a paragraph: a
    // sentence printed under every band is prose the reader has to cross to reach
    // the controls, and on a page of four bands it costs more room than the fields
    // do. The glyph costs 20px and answers only when asked.
    hint: { type: String, default: '' },
    // Title above full-width content instead of beside it. For bands whose content
    // needs the whole measure: tables, lists, card grids, and any band built the
    // ItemGroup way (a flush CardBox of Item rows), where the card is the thing the
    // title names and a column beside it would only narrow it.
    stacked: { type: Boolean, default: false },
    // The hairline rule that opens every band after the first. On by default,
    // because a boxless band needs something to separate it from the one above.
    // Turn it OFF when the bands are CARDS: the card's own border already draws
    // that edge, so a rule above it is a second line saying the same thing.
    divided: { type: Boolean, default: true },
    // When true, the band becomes linkable: the <h2> takes a stable id and a link
    // glyph in the GUTTER copies the deep link to it. Opt-in, because an id only
    // earns its keep on a band that persists at a URL — and because two ids must
    // never collide on one page.
    anchor: { type: Boolean, default: false },
    // Makes the band a DISCLOSURE: the title becomes the trigger and the content
    // collapses under it. This is how a form hides what it does not need to ask —
    // the optional half of a request body, the settings almost nobody changes —
    // without inventing a second page or nesting an Accordion inside the card. The
    // band keeps its title and its hint while collapsed, so what is inside is
    // legible before it is opened.
    collapsible: { type: Boolean, default: false },
    // Whether a collapsible band starts open. Collapsed is the default — a band
    // that opens expanded is not hiding anything and does not need to collapse.
    defaultOpen: { type: Boolean, default: false },
    // Optional id on the <h2>, so a <fieldset> can point aria-labelledby at it.
    titleId: { type: String, default: undefined }
  })

  const route = useRoute()

  // Uncontrolled on purpose: no page has needed to drive a band's open state from
  // outside yet, and a `v-model:open` nobody binds is API nobody reads.
  const open = ref(props.defaultOpen)
  const isOpen = computed(() => !props.collapsible || open.value)

  const regionId = useId()

  // An explicit `titleId` always wins; otherwise the id is derived from the title,
  // and only when `anchor` is on. Derivation is deliberately not unconditional: the
  // same title recurs across the app ("General" titles a band on four pages), and
  // two elements sharing an id is invalid HTML that also breaks any
  // aria-labelledby pointing at it.
  const anchorId = computed(() => {
    if (props.titleId) return props.titleId
    if (!props.anchor) return undefined
    return props.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  })

  // Built from the router's `fullPath` rather than read off `window.location` once:
  // these views are held by <KeepAlive>, so a value captured at setup would keep
  // copying the URL of whichever tab happened to be open first. Any existing hash is
  // dropped so copying twice can't produce `#a#b`.
  const anchorUrl = computed(
    () => `${globalThis.location?.origin ?? ''}${route.fullPath.split('#')[0]}#${anchorId.value}`
  )

  // Copying is silent by nature, so it toasts: without the confirmation the only
  // feedback is a glyph that flickers under the cursor.
  const copyAnchor = async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(anchorUrl.value)
      toast.success('Link copied.')
    } catch {
      toast.error('Could not copy the link.')
    }
  }

  // ── The band resizes when its CONTENT changes ──────────────────────────────
  //
  // A form reshapes as it is answered: a connector's type swaps three address rows
  // for one, a data stream's destination swaps the whole band. Until this existed,
  // that landed in a single frame — measured on /connectors/new, the form went from
  // 727px to 595px with ONE distinct height across 36 sampled frames — so every band
  // below the change leapt 132px up the page. The reader's eye has to re-find the
  // thing it was reading, which is exactly the cost a transition exists to remove.
  //
  // The move rides the property the band ALREADY transitions. The disclosure is the
  // standard CSS collapse — a one-row grid easing `grid-template-rows` between `0fr`
  // and `1fr` — so an open band's track is already "the content's height", and a
  // content change is just that track landing somewhere new. Pinning the track to the
  // old height and releasing it to the new one therefore needs no second transition,
  // no second timing, and cannot fight the disclosure: there is one animated property
  // on this element, and open/closed and grew/shrank are two values of it.
  //
  // Why a ResizeObserver rather than a watcher: this component does not know what its
  // slot holds. A page would otherwise have to tell it "these fields changed", which
  // is the coupling the slot exists to avoid — and would have to be remembered on
  // every conditional field anyone adds later. The observer asks the DOM instead.
  //
  // HEIGHT IS NOT AN ENTRANCE. The observer is deliberately deaf to every resize that
  // is not the direct result of someone acting on this page: arriving on a tab, a font
  // resolving, a container reflowing, a KeepAlive view re-activating. A band easing its
  // height on arrival would be animating a number the reader never saw a previous value
  // for — motion with nothing to compare it to, which reads as the page settling rather
  // than as an answer taking effect. Entrances are the page's own transition; this move
  // exists for ONE thing: the reader flipped a switch or picked an option, and the form
  // grew or shrank because of it. So a resize only animates when it lands in the short
  // window after a real input event.
  const regionRef = ref(null)
  const contentRef = ref(null)



  // The last natural content height the observer saw. `null` until the first
  // observation, which is what keeps the band from animating on mount.
  let lastHeight = null
  // Set while a pin is in flight, so an interrupted move can be landed before the
  // next one measures.
  let release = null

  const reducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  // Long enough to outlast duration-moderate-02 (240ms) with room for a delayed
  // frame. It only matters when `transitionend` never arrives — an interrupted
  // transition, a band unmounted mid-move — and its whole job is to guarantee the
  // track cannot stay pinned. A pinned track would stop responding to a resize.
  const RELEASE_FALLBACK_MS = 600

  const animateTrack = (from, to) => {
    const node = regionRef.value
    if (!node) return

    // A second change mid-move: read where the track ACTUALLY is right now rather
    // than where the previous move started, so an interrupted animation continues
    // from what the reader is looking at instead of snapping back to a height that
    // was never on screen.
    const current = release ? globalThis.getComputedStyle(node).gridTemplateRows : null
    release?.()

    // THE PIN MUST NOT ANIMATE. The band already transitions this property, so
    // writing the old height is itself a change the browser will happily ease into —
    // and then the real move retargets a transition that is 30ms into travelling the
    // WRONG way. That is what made grow and shrink behave differently: measured on
    // /connectors/new, growing snapped to the start and then eased (14 distinct
    // frames) while shrinking produced a 2px bump and nothing else. Suppressing
    // transitions for the length of the pin makes the start value land instantly, so
    // both directions begin from the same place.
    node.style.transitionProperty = 'none'
    node.style.gridTemplateRows = current ?? `${from}px`
    void node.offsetHeight // commit the start value with transitions off
    node.style.transitionProperty = '' // hand the property back to the class

    let frame = null
    let timer = null
    const finish = () => {
      node.removeEventListener('transitionend', onEnd)
      globalThis.cancelAnimationFrame(frame)
      globalThis.clearTimeout(timer)
      // Back to the class's `1fr` — the band is responsive again, and the disclosure
      // owns the property once more.
      node.style.transitionProperty = ''
      node.style.gridTemplateRows = ''
      release = null
    }
    const onEnd = (event) => {
      if (event.propertyName === 'grid-template-rows' && event.target === node) finish()
    }

    node.addEventListener('transitionend', onEnd)
    timer = globalThis.setTimeout(finish, RELEASE_FALLBACK_MS)
    release = finish

    // TWO frames, and the reason is specific to where this runs. A ResizeObserver
    // callback fires inside the frame the browser is ALREADY laying out, and the
    // track has by then been recomputed to its new natural value — so writing the
    // old height and the new one in the same callback is two writes the browser
    // folds into one style recalculation. It sees no change, starts no transition,
    // and the band snaps exactly as it did before. Forcing a reflow between them is
    // not enough either: the flush lands inside that same pass.
    //
    // Deferring the end value to a later frame is what makes the two values two
    // separate style change events. The first rAF can still land in the pass being
    // painted, so it takes the second — the same guard `lib/animate-height.js`
    // documents for the plain-height version of this move.
    frame = globalThis.requestAnimationFrame(() => {
      frame = globalThis.requestAnimationFrame(() => {
        // Guard against a release between the two frames.
        if (release === finish) node.style.gridTemplateRows = `${to}px`
      })
    })
  }

  onMounted(() => {
    if (!contentRef.value) return

    // A BAND THAT WAS JUST REVEALED grows into place. Build's cache options, a
    // connector's load-balancer band, any `v-if` band a switch turns on: without this
    // the band and everything under it appear in one frame, which is the same jump the
    // resize animation exists to remove — only bigger, because a whole band is more
    // than a row. Same guard as a resize: this only happens when the mount followed an
    // interaction, so a band arriving with the page still arrives with the page.
    if (userDriven() && !reducedMotion() && regionRef.value) {
      const to = contentRef.value.getBoundingClientRect().height
      lastHeight = to
      if (to > 0) animateTrack(0, to)
    }

    if (!globalThis.ResizeObserver) return

    const observer = new globalThis.ResizeObserver(([entry]) => {
      const next = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
      const previous = lastHeight
      lastHeight = next

      // First observation seeds the baseline; a change of nothing is not a change.
      if (previous === null || previous === next) return
      // Not the reader's doing — an entrance, a reflow, a late font. The page's own
      // transition owns those; see the note above.
      if (!userDriven()) return
      // While collapsed the track is `0fr` and the content is clipped, so its height
      // is not on screen — animating to it would be animating something invisible,
      // and would leave an inline track for the disclosure to fight on the way open.
      if (!isOpen.value) return
      if (reducedMotion()) return

      animateTrack(previous, next)
    })

    observer.observe(contentRef.value)
    onScopeDispose(() => {
      observer.disconnect()
      release?.()
    })
  })

  // Toggling the disclosure hands the property back to the class. An inline track
  // left over from a content change would otherwise beat `data-[open]:grid-rows-[1fr]`
  // and the band would refuse to open.
  watch(open, () => release?.())
</script>

<template>
  <section
    :data-stacked="stacked || null"
    :data-divided="divided || null"
    class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-[var(--spacing-md)] [&:not(:first-of-type)]:mt-[var(--layout-section-gap)] data-[divided]:[&:not(:first-of-type)]:border-t-[length:var(--border-width-default)] data-[divided]:[&:not(:first-of-type)]:border-[var(--border-muted)] data-[divided]:[&:not(:first-of-type)]:pt-[var(--layout-section-gap)] md:not-data-[stacked]:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
  >
    <!-- Left: what this band is. `self-start` keeps the column at its own height
         so `sticky` has room to work inside the grid row. -->
    <div
      :data-stacked="stacked || null"
      class="flex min-w-0 flex-col gap-[var(--spacing-xxs)] md:not-data-[stacked]:sticky md:not-data-[stacked]:top-[var(--spacing-lg)] md:not-data-[stacked]:self-start"
    >
      <!-- Title + its anchor share a row, so the copy button reads as belonging to
           the heading. `scroll-mt-*` keeps the title clear of the sticky bar above
           when a deep link lands here. The reveal classes live on the WRAPPER, not
           on CopyButton: that component sets `inheritAttrs: false` and never
           spreads `$attrs`, so a `class` passed to it is dropped on the floor. -->
      <div
        v-if="title"
        class="group/heading relative flex min-w-0 items-center gap-[var(--spacing-xxs)]"
      >
        <!-- The deep link lives in the GUTTER, absolutely positioned outside the
             content column, so it costs the page no horizontal space and the title
             does not shift when it appears. A bare glyph, not a boxed CopyButton: a
             button-sized control beside a 14px heading reads as an action on the
             band rather than as a reference to it. Hidden by opacity — not
             `hidden` — so it stays in the tab order and appears on keyboard focus
             exactly as it does on hover. -->
        <button
          v-if="anchor"
          type="button"
          :aria-label="`Copy link to the ${title} section`"
          class="absolute -left-[1.5rem] flex size-5 shrink-0 items-center justify-center rounded-[var(--shape-button)] text-[var(--text-muted)] opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-[var(--text-default)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
          @click="copyAnchor"
        >
          <i
            class="pi pi-link text-body-xs"
            aria-hidden="true"
          />
        </button>
        <!-- The heading stays an <h2> either way; when the band is a disclosure the
             BUTTON goes inside it, the same shape webkit's Accordion uses. That
             keeps the document outline intact — a collapsed band is still a
             section of this page — while giving the trigger real button semantics
             (Enter/Space, aria-expanded, aria-controls). -->
        <h2
          :id="anchorId"
          class="scroll-mt-[var(--spacing-xl)] text-balance text-heading-xxs text-[var(--text-default)]"
        >
          <button
            v-if="collapsible"
            type="button"
            :aria-expanded="open"
            :aria-controls="regionId"
            :data-state="open ? 'open' : 'closed'"
            class="group/disclosure -mx-[var(--spacing-xxs)] flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xxs)] text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
            @click="open = !open"
          >
            <i
              v-if="icon"
              :class="icon"
              class="shrink-0 text-[0.9em] leading-none text-[var(--text-muted)]"
              aria-hidden="true"
            />
            {{ title }}
            <i
              class="pi pi-chevron-down shrink-0 text-[0.75em] leading-none text-[var(--text-muted)] transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
          <span
            v-else
            class="flex items-center gap-[var(--spacing-xs)]"
          >
            <i
              v-if="icon"
              :class="icon"
              class="shrink-0 text-[0.9em] leading-none text-[var(--text-muted)]"
              aria-hidden="true"
            />
            {{ title }}
          </span>
        </h2>
        <!-- OUTSIDE the <h2>, always: when the band is collapsible the heading
             already contains a <button>, and a Hint nested in it would be a button
             inside a button — invalid HTML that browsers recover from by moving
             the inner one out, taking its tooltip with it. -->
        <Hint
          v-if="hint"
          :text="hint"
          class="shrink-0"
        />
      </div>
      <!-- Anything else that documents the band — a note, a badge, a second link. -->
      <slot name="aside" />
    </div>

    <!-- Right: the content. `lg` between rows is the Form Layout's field rhythm.
         A collapsible band animates its HEIGHT, and `height: auto` is not
         animatable — so the region is a one-row grid transitioning
         `grid-template-rows` between `1fr` and `0fr`, the standard CSS-only
         collapse: no JS measurement, no component-local keyframes. Exactly ONE
         property is transitioned because Tailwind's extractor drops a comma inside
         `transition-[...]`, so a two-property list compiles to nothing.
         `inert` is what makes the collapsed state honest: the rows are still in the
         DOM, so without it a keyboard user would tab into fields nobody can see. -->
    <div
      :id="collapsible ? regionId : undefined"
      :data-open="isOpen || null"
      ref="regionRef"
      :inert="!isOpen || undefined"
      :aria-hidden="!isOpen || undefined"
      class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-[open]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div class="min-w-0 overflow-hidden">
        <!-- The height alone is not the entrance. A clip that opens on its own
             reveals the content already fully painted — the rows do not arrive,
             they are uncovered, which reads as a jump however long the clip takes.
             So the content ALSO fades and rises the same 240ms on the same curve:
             the band grows and its rows settle into it as one movement.
             Two elements, one transition each, because they animate different
             properties on different boxes — and `translate` is named, never
             `transform`, since that is the property Tailwind v4's translate
             utilities actually set. -->
        <div
          ref="contentRef"
          :data-open="isOpen || null"
          class="flex min-w-0 -translate-y-1 flex-col gap-[var(--spacing-lg)] opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-[open]:translate-y-0 data-[open]:opacity-100 motion-reduce:transition-none"
        >
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
