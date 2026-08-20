<script setup>
  // THE WIZARD PAGE — ./CreatePage.vue's anatomy, in parts.
  //
  // It IS the create page: the same CreationHeader, the same `layout-column-form`
  // measure, the same `--layout-section-gap` rhythm between bands, the same `<fieldset>`
  // lock, the same action band at the foot of the page, the same leave guard. A reader
  // who has created anything else in this console recognises every pixel of the chrome.
  // That is
  // deliberate — a wizard is not a different KIND of page, it is a create page whose
  // questions arrive in parts, and reshaping the chrome to announce that would have
  // taught a second habit for one task.
  //
  // WHAT IT ADDS, and only this:
  //   THE PROGRESS. ./WizardProgress.vue above the bands — how far through the parts,
  //     and what they are called. It replaces nothing; the create page simply had no
  //     position to report.
  //   THE ADVANCE. The bar carries the flow's two directions and nothing else: Back at
  //     the left end, the commit at the right — Next until the last part, where it
  //     becomes the create's own verb. From the second part on it is always there,
  //     disabled while the part is unanswered rather than removed, so the bar reads the
  //     same the whole way through; on the FIRST part there is neither direction to
  //     offer — nothing to go back to, and the part's own rows are the only forward —
  //     so the band retires rather than sitting there empty.
  //     The way OUT is not in the bar; it is the header's back and the breadcrumb,
  //     exactly where every other page in this console keeps it.
  //   THE SWAP. One part leaves as the next arrives, on the transition the console's
  //     stepped login flow already uses (../../pages/auth/LoginScreen.vue) — same theme
  //     tokens, same `leave-active` absolute trick so the leaving part is taken out of
  //     flow and the incoming one owns the layout immediately. An `out-in` swap would
  //     collapse the band area to nothing in between and the page would dip.
  //
  // WHEN TO REACH FOR IT. Only when the FIRST answer changes which questions follow.
  // Everything whose questions are fixed stays on ./CreatePage.vue — one screen of
  // bands is cheaper to fill in than three screens of one band, and splitting a fixed
  // form into parts buys the reader nothing but clicks.
  //
  // The PARTS come from the owner through the default slot, as `Section` bands — the
  // same bands a create page passes, in the same order (what the endpoint requires
  // first, then what the reader came to choose, then the collapsed optional tail).
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import { computed, useSlots, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { revealFirstInvalid } from '../../lib/behavior/reveal-invalid'
  import { useScrollFade } from '../../lib/behavior/scroll-fade'
  import UnsavedChangesGuard from '../form/UnsavedChangesGuard.vue'
  import CreationHeader from './CreationHeader.vue'
  import PageHeading from './PageHeading.vue'
  import WizardProgress from './WizardProgress.vue'

  const props = defineProps({
    // Breadcrumb trail for the flow, e.g.
    // [{ label: 'Applications', href: '/applications' }, { label: 'Create application' }]
    breadcrumb: { type: Array, default: () => [] },
    // Accessible label for the header's back button.
    backLabel: { type: String, default: 'Back' },
    // The page title — the create's own name. It does NOT change per part: the parts are
    // one task, and a title that rewrote itself on every Next would read as three pages.
    title: { type: String, default: '' },
    // One line saying what the resource IS and what the commit does. The page's only
    // prose: every other explanation belongs to a band, as its Hint.
    description: { type: String, default: '' },
    // Id on the <h1>, so the form can point `aria-labelledby` at it.
    titleId: { type: String, default: undefined },
    // The flow's parts, in order: [{ id, label }]. The progress renders exactly these.
    steps: { type: Array, default: () => [] },
    // Index into `steps` of the part showing now.
    currentStep: { type: Number, default: 0 },
    // The advance's own verb. Next on a middle part, the create's verb on the last.
    // Once the flow is running every part carries it, so the way forward is never
    // somewhere the reader has to look for it; a part the reader advances by CHOOSING
    // holds it DISABLED rather than dropping it (`nextDisabled`).
    // EMPTY renders no advance — for the FIRST part of a flow, whose own rows decide
    // which flow it is, and which therefore has no direction to offer in either
    // direction. With no Back either (see `atStart`), the band has nothing in it and
    // retires whole.
    nextLabel: { type: String, default: 'Next' },
    // Blocks the advance until the part is answered. For a part with nothing to report
    // inline — one whose whole answer is which row was pressed — this is what says so;
    // a part with fields keeps its advance live and reports the miss at the field.
    nextDisabled: { type: Boolean, default: false },
    // The owner's in-flight flag: locks the fieldset and spins the advance.
    submitting: { type: Boolean, default: false },
    // True while the flow holds input the reader has not committed — the leave guard's
    // trigger. The owner clears it right before the navigation that FOLLOWS a
    // successful create. Not `savable`: this flow's commit provisions real
    // infrastructure, which is not a thing a stray sidebar click should trigger.
    dirty: { type: Boolean, default: false },
    // THE PAGE'S OWN HEAD, ON OR OFF. On by default: the title names the create and the
    // description says what the commit does, which is what the reader opens the flow to
    // read. A terminal phase that brings its OWN heading turns it off — the outcome
    // screen announces itself ("Congratulations!", and where it deployed), and a page
    // title stacked above that is two headings for one screen, the second of which is
    // the answer to a question the reader has already stopped asking.
    heading: { type: Boolean, default: true },
    // THE FLOW IS PAST ITS QUESTIONS. After the commit there is a run to watch and an
    // outcome to read, and neither is something the reader answers — so this retires the
    // progress, the bands and the bar, hides the header's back (the resources exist
    // now), and hands the column to the `terminal` slot. It stays THIS page because the
    // chrome and the measure belong to the flow, not to the part.
    terminal: { type: Boolean, default: false }
  })

  const emit = defineEmits(['back', 'next', 'cancel', 'go'])

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow, so identity survives every hop.
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const atStart = computed(() => props.currentStep <= 0)

  // THE BAND ONLY EXISTS WHEN IT HOLDS SOMETHING. On the first part there is no Back
  // (nothing behind it) and, for a part whose own rows are the forward, no advance either
  // — and an action band with no actions is a strip of gradient the reader scans for a
  // control that is not in it. So the row's three occupants decide whether the row is
  // rendered at all, rather than the row being a fixed feature of the page.
  const slots = useSlots()
  const hasActions = computed(
    () => !atStart.value || Boolean(props.nextLabel) || Boolean(slots.start)
  )

  // THE ONE SCROLLER. Only the bands move, so a new part has to start at its own top:
  // the container keeps its scroll offset across a swap, and a reader arriving at
  // Configure from a deep-scrolled part would land mid-form with the fields above them.
  //
  // ITS EDGES FADE. The box is bounded by the two fixed rows — the progress above, the
  // action bar below — so a band that simply stops at either one reads as the end of the
  // form rather than as the end of the box. `../../lib/behavior/scroll-fade.js` dissolves
  // each edge only while there is content past it, so at rest (a part that fits) there is
  // no mask at all and nothing is dimmed.
  const { scroller, fadeStyle } = useScrollFade()
  watch(
    () => [props.currentStep, props.terminal],
    () => scroller.value?.scrollTo({ top: 0 })
  )

  // THE PART SWAP'S TIMING. Read from the theme primitives, applied inline because
  // Tailwind cannot emit per-state duration/easing utilities (DESIGN.md § Motion). Same
  // pair the login flow's step swap uses: the opacity carries the moderate duration so
  // the crossfade is legible, the movement a shorter one so the travel is over before the
  // fade finishes and the swap reads as one motion rather than a slide.
  //
  // `translate` is named, NOT only `transform`: Tailwind v4 compiles `translate-y-*` to
  // the standalone `translate` property, so a transition declared on `transform` alone
  // animates nothing and the movement snaps. `transform` is listed too, harmlessly, so a
  // utility that does use it still eases.
  //
  // AND REDUCED MOTION IS HANDLED HERE, not by a class. An inline `style="transition: …"`
  // beats every utility, so pairing this with `motion-reduce:transition-none` does
  // nothing — measured: 13 interpolated frames with the query on. The check therefore
  // has to live where the style is built, the same way ../../lib/behavior/auth-entrance.js
  // does it. Re-read per swap rather than cached at setup, so a reader who changes the
  // system setting mid-flow gets the answer they just asked for.
  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const timing = (property, ms) => `${property} ${ms} ${curve['productive-entrance']}`

  const partTransitionStyle = () =>
    prefersReducedMotion()
      ? { transition: 'none' }
      : {
          transition: [
            timing('opacity', duration['moderate-02']),
            timing('transform', duration['fast-02']),
            timing('translate', duration['fast-02'])
          ].join(', ')
        }

  // A crumb with an href means "go there"; a crumb without one is the current page, and
  // clicking it is the same intent as the header's back. Identical to CreatePage's
  // handler — CreationHeader has already filtered out modified clicks.
  const onCrumb = (event, href) => {
    if (!href || href === '#') {
      emit('cancel')
      return
    }
    const [path, queryString] = href.split('?')
    const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
    router.push({ path, query: { email: userEmail.value, ...extra } })
  }

  // THE WAY BACK TO WHAT BLOCKED THE ADVANCE. A part long enough to scroll can fail on a
  // field the reader cannot see from the bar they pressed — the press then reads as dead,
  // and the usual next move is to press it again. So the owner, on the failing branch of
  // its own validation, calls this: it takes the reader to the first field carrying
  // `data-field-invalid` (../../lib/behavior/reveal-invalid.js) and puts the caret in it.
  //
  // IT LIVES HERE because the search has to be bounded by THIS part — the scroller holds
  // exactly the part on screen, so a message still set on a part behind the reader can
  // never win — and because the scroller is what carries the scroll-padding that keeps the
  // landing clear of the pinned progress above it.
  //
  // The page does not decide WHEN: it does not know what any part requires, and a wizard
  // that guessed would fire on the parts whose advance is a row press. The owner validates;
  // this is what it calls when the answer is no.
  defineExpose({ revealInvalid: () => revealFirstInvalid(scroller.value) })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <UnsavedChangesGuard :dirty="dirty" />

    <CreationHeader
      :show-back="!terminal"
      :breadcrumb="terminal ? [] : breadcrumb"
      :back-label="backLabel"
      @back="emit('cancel')"
      @navigate="onCrumb"
    />

    <!-- THE VIEWPORT BOX. The page is exactly the screen (`h-dvh` on the root, not
         `100vh`: on mobile the dynamic unit follows the URL bar, so a bar that retracts
         does not leave the action bar cut off below the fold). Inside it, TWO rows — the
         scrolling body and the action band — and only the first one scrolls.
         Why: the reader's position in the flow and the way out of it are the two things
         they need at every scroll offset. When the whole page scrolled, a long Configure
         part pushed the progress off the top, so "how far along am I" became a scroll up,
         and the bar's Next only stayed reachable because it was sticky — two different
         pinning mechanisms for one intention. The band below is fixed by the layout, and
         the position pins itself INSIDE the scroller (see the sticky block there), so
         both are permanent while the heading is still free to scroll away.
         `min-h-0` on every ancestor of the scroller is what makes it scroll at all: a
         flex child's default `min-height:auto` refuses to shrink below its content, so a
         single missing `min-h-0` moves the overflow to the page and the pinning is gone
         with no error anywhere. -->
    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-labelledby="titleId"
        :aria-label="titleId ? undefined : title"
        novalidate
        @submit.prevent="emit('next')"
      >
        <!-- THE MIDDLE — the only scrolling box on the page. `layout-boundary-inline`
             gives the inner column its side padding only; the block padding is set here
             so the bands open on the same step they put between each other, exactly as
             CreatePage does. The inset is on the INNER block, so the scrollbar tracks the
             page edge rather than the measure. -->
        <!-- `scrollbar-gutter: stable both-edges` is what keeps the measure ALIGNED with
             the fixed rows above and below it. The scroller is full width so the bar sits
             at the page edge; without a reserved gutter its content box narrows by the
             bar's width the moment the bands overflow, and a centred column inside a
             narrower box moves left by half of that — the heading and the progress do not
             move, because they are not scrollers, so the page visibly steps out of line
             on the first part long enough to scroll. Reserving the gutter on BOTH edges
             keeps the column centred in the same box at every scroll length. It is inert
             where scrollbars are overlays (macOS), which is exactly right: there is no
             width to reserve there and nothing shifts. -->
        <!-- `fadeStyle` carries the mask and, from the same number, the scroll padding
             that keeps anything scrolled into view from landing inside the band. -->
        <div
          ref="scroller"
          :style="fadeStyle"
          class="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable_both-edges]"
        >
          <div class="flex flex-col pb-(--layout-section-gap)">
            <!-- THE HEADING SCROLLS AWAY. It names the page and says what the commit
                 does — read once, at the top, and then not again. Holding it in a fixed
                 row spent a band of every screen restating a title the breadcrumb is
                 already carrying, and on the parts that are long it was the reason the
                 fields started below the fold. So it lives in the scroll flow now: first
                 thing the reader sees, gone by the time they are typing.
                 It is COMPACT — `--spacing-lg` above it and `--spacing-md` under it,
                 where the head used to open and close on `--layout-section-gap`. The head
                 is a label, not a band, and it no longer has to hold its own against a
                 rule sized for the whole page. -->
            <div
              v-if="heading"
              class="layout-column-form layout-boundary-inline pb-(--spacing-md) pt-(--spacing-lg)"
            >
              <PageHeading
                :title="title"
                :description="description"
                :title-id="titleId"
              />
            </div>

            <!-- THE POSITION STAYS. Of the two halves of the old head this is the one
                 that answers a question the reader has at every scroll offset — how far
                 through the flow am I, and what is this part called — so it pins to the
                 top of the scrollport and the heading passes under it.
                 `sticky` INSIDE the box, not a row above it, because the heading has to
                 scroll past it: a row outside the scroller can only sit above everything
                 that scrolls, which would have put the position on top of the title.
                 Its background is the canvas and it is opaque, so content going under it
                 is hidden rather than showing through — and `scroll-fade` already knows
                 about pinned headers: it hit-tests the top edge, keeps whatever is pinned
                 there at full strength, and starts the dissolve at its BOTTOM edge, so
                 the band stays crisp while the form dissolves as it passes beneath.
                 THE RULE UNDER IT IS FULL-BLEED — the border is on this full-width
                 wrapper while its contents keep the form's measure, so the rule reads as
                 the floor of the page's head rather than as the top edge of another card
                 sized to the form. That is why the scroller's column is full width and
                 each part applies `layout-column-form` itself. -->
            <div
              v-if="!terminal && steps.length > 1"
              class="sticky top-0 z-10 border-b border-(--border-default) bg-(--bg-canvas)"
            >
              <div class="layout-column-form layout-boundary-inline py-(--spacing-md)">
                <WizardProgress
                  :steps="steps"
                  :current-step="currentStep"
                  :disabled="submitting"
                  @go="emit('go', $event)"
                />
              </div>
            </div>

            <!-- One flag locks every control while the commit is in flight. The fieldset
                 is the NATIVE safety net; each control still takes `:disabled` from the
                 same flag, because a webkit control renders its disabled visual from its
                 own prop and a fieldset alone would leave the part looking live. -->
            <fieldset
              v-if="!terminal"
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col border-0 p-0 pt-(--layout-section-gap)"
              :disabled="submitting"
            >
              <legend class="sr-only">{{ title }}</legend>

              <!-- THE PART SWAP. `relative` is what lets the leaving part go absolute, so
                 the incoming one owns the layout from the first frame and the page has a
                 single height to travel to. -->
              <div class="relative">
                <Transition
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-1"
                  leave-active-class="absolute inset-x-0 top-0"
                >
                  <div
                    :key="steps[currentStep]?.id ?? currentStep"
                    :style="partTransitionStyle()"
                    class="flex min-w-0 flex-col motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <slot />
                  </div>
                </Transition>
              </div>
            </fieldset>

            <div
              v-else
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pt-(--layout-section-gap)"
            >
              <slot name="terminal" />
            </div>
          </div>
        </div>

        <!-- THE ACTION BAR — A FULL-WIDTH BAND, NOT A CARD. The band spans the page;
             its CONTENTS sit on the same `layout-column-form layout-boundary-inline`
             measure as the progress above and every band in the scroller, so Back sits on
             the fields' left edge and the commit on their right at every viewport. A card
             sized by its own content had no relationship to the column — it drifted with
             the label lengths and sat centred under a form whose edges were elsewhere.
             NO BORDER, NO SURFACE. A ruled card at the foot of the page drew a second
             horizontal line under a form already made of ruled cards, and the eye read it
             as one more band rather than as the page's floor. What separates it now is a
             GRADIENT: transparent at the top, `--bg-canvas` by the bottom, so the form
             dissolves into the bar instead of stopping at a rule. It pairs with the
             scroller's own bottom mask (`scroll-fade`) — the mask dissolves the content
             while it is still inside the box, this carries the last of it to the page
             edge — and because both ends are the canvas, the seam between the two is not
             locatable at any scroll offset.
             It is the shell's bottom ROW, outside the scroller, so it is fixed by the
             layout rather than by a sticky offset and nothing ever slides under it. It
             retires on a terminal phase, where there is nothing left to commit — and on
             any part that gives it nothing to hold (`hasActions`), which is the first
             part of a flow whose rows are its own forward. -->
        <footer
          v-if="!terminal && hasActions"
          class="shrink-0 bg-gradient-to-b from-transparent to-(--bg-canvas) pb-(--spacing-lg) pt-(--spacing-xl)"
        >
          <div
            class="layout-column-form layout-boundary-inline flex w-full items-center gap-(--spacing-md)"
          >
            <!-- BACK LEADS, ON THE LEFT. The flow has exactly two directions and they sit
                 at the two ends of the band, which is the reading the geometry already
                 implies — backwards to the left, forwards to the right. It carries NO
                 arrow: the position is the direction, and a glyph repeating it was the
                 third thing saying "left" in one control.
                 Cancel is gone from here. The exit did not disappear — it is the header's
                 back and the breadcrumb, one level up, where every other page in this
                 console puts it. Keeping a third button in the bar made the reader choose
                 between two ways out at the moment they only wanted to step back one
                 part. -->
            <Button
              v-if="!atStart"
              key="back"
              type="button"
              label="Back"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="emit('back')"
            />

            <!-- `start` is for a bulk path belonging to the whole form, opposite the
                 commit — the same slot CreatePage exposes, for the same reason. -->
            <div
              v-if="$slots.start"
              class="flex min-w-0 items-center gap-(--spacing-sm)"
            >
              <slot name="start" />
            </div>

            <!-- `ms-auto` and not `justify-between` on the row: the first part has no
                 Back, and a space-between row would then walk the commit over to the left
                 edge. Pushed from the right, the advance is in the same place on every
                 part. -->
            <!-- The webkit Button renders a native type="button" and does not forward a
                 type, so the advance is driven from its click; the sr-only submit below
                 keeps Enter working. -->
            <Button
              v-if="nextLabel"
              key="next"
              class="ms-auto"
              :label="nextLabel"
              kind="primary"
              size="medium"
              :disabled="nextDisabled"
              :loading="submitting"
              @click="emit('next')"
            />
          </div>
        </footer>

        <button
          v-if="nextLabel && !terminal"
          type="submit"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
        >
          {{ nextLabel }}
        </button>
      </form>
    </main>
  </div>
</template>
