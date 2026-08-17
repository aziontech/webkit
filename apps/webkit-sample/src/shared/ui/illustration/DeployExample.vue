<script setup>
  // A cell of the illustrations bento: one `azion deploy`, played back live in the
  // SAME view the console uses for a deployment — the step accordion of
  // ui/DeploymentLogs.vue, streaming the real pipeline from src/lib/azion-deploys.js.
  // Its sibling in that row draws a deploy; this one runs it, in the console's own
  // component rather than in a marketing lookalike of it.
  //
  // That reuse is the point of the cell. The steps, their log lines, the per-step
  // feedback tags and timings, the Phased / Complete switch and the progress bar all
  // come from the console surface; the home page only decides WHEN the run starts and
  // WHICH deployment it replays.
  //
  //   • It starts when the cell first scrolls into view, via IntersectionObserver, so
  //     the deploy is not already finished by the time anyone looks at it. VueUse
  //     would give us `useElementVisibility`, but it is not a dependency of this app,
  //     so this is the observer by hand — including its disconnect.
  //   • `prefers-reduced-motion` renders the same deployment settled, with every step
  //     complete and its logs in place. The information is the point; the streaming
  //     is decoration.
  //
  // The observer is torn down on unmount (and DeploymentLogs clears its own timers),
  // so leaving the page mid-deploy leaves nothing running.
  import CardBox from '@aziontech/webkit/card-box'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import { deployById, stepsOf } from '../../lib/azion-deploys'
  import DeploymentLogs from '../deployment/DeploymentLogs.vue'

  // The deploy that actually shipped this app: `azion deploy --auto --local` from a
  // terminal, production, no failed step. `stepsOf` resolves its log lines with that
  // record's real artifacts (bucket, prefix, worker, domain).
  const deploy = deployById('d_7Kq2mVbHZ')

  // Three steps, not the console's ten. This cell is an ASSET — the shape of a deploy,
  // read at a glance beside the drawing of one — and the drawing next to it says
  // build → deploy → live. The console page is where the full pipeline belongs, one
  // row per resource that can fail on its own; ten rows here would be a screenshot of
  // a different surface. The three kept are the pipeline's real steps with their real
  // log lines, in order — nothing is summarised or invented.
  const CELL_STEPS = ['build', 'upload', 'finish']
  const steps = computed(() =>
    deploy ? stepsOf(deploy).filter((step) => CELL_STEPS.includes(step.key)) : []
  )

  const cell = ref(null)
  // null until we know which way to render: streaming, or already settled.
  const mode = ref('')

  // ── The card's height, animated ────────────────────────────────────────────
  // A run opens the streaming step and closes the one before it, so the log's natural
  // height moves the whole time it plays and lands back on the collapsed base when the
  // deploy settles. The card FOLLOWS that height with a transition instead of jumping
  // between the two, which is the difference between a deploy that plays and a box
  // that flickers. A ResizeObserver reads the content's natural height (the measured
  // element is never the one being sized, so there is no feedback loop) and the wrapper
  // animates to it.
  //
  // This is the one place a LAYOUT property is animated: the animation catalogue's only
  // height utility is `animate-slide-down`, which is a 0 → auto disclosure, and this is
  // an incremental resize with no catalogued equivalent. Timing still comes from the
  // tokens, and `motion-reduce` drops the transition entirely.
  const content = ref(null)
  const contentHeight = ref(0)

  let observer = null
  let resizeObserver = null

  onMounted(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      mode.value = 'static'
      return
    }

    // No IntersectionObserver (older browser, or a test env): just play.
    if (!('IntersectionObserver' in window) || !cell.value) {
      mode.value = 'live'
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        observer = null
        mode.value = 'live'
      },
      { threshold: 0.3 }
    )
    observer.observe(cell.value)

    if (!('ResizeObserver' in window) || !content.value) return
    resizeObserver = new ResizeObserver(([entry]) => {
      contentHeight.value = Math.round(entry.contentRect.height)
    })
    resizeObserver.observe(content.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    resizeObserver?.disconnect()
    resizeObserver = null
  })
</script>

<template>
  <!-- `bg-(--bg-canvas)` is required of every divider-grid child: the grid's 1px
       gaps ARE its rules, and a cell that does not fill its own background lets the
       wrapper's border colour flood it. -->
  <article
    ref="cell"
    class="flex flex-col gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-lg)"
  >
    <header
      class="flex items-center gap-(--spacing-xs) text-label-code-md text-(--text-muted)"
    >
      <i
        class="ai ai-azion-cli leading-none text-(--primary)"
        aria-hidden="true"
      />
      Deploy
    </header>

    <!-- The reserve. `h-96` is the first step of the size scale that clears the run's
         TALLEST moment (measured 329px of content plus the card's border) — the scale
         step, not a measured literal, so the box moves with the tokens. It holds that
         height for as long as the cell exists, so the card inside can grow and shrink
         without a single pixel of the page moving. The card is the thing that animates;
         this box is the space it animates in — and it animates around the box's CENTRE
         (`justify-center`), so the run opens and closes evenly from the middle instead
         of unrolling downward from the top edge. -->
    <div class="flex h-96 flex-col justify-center">
      <!-- A CardBox, flush (`:padded="false"`): the steps run edge to edge inside it,
           the way an ItemList does, so the card's own border is the only frame and the
           step rows keep their full-width dividers.

           Its height follows the log — collapsed base while nothing is open, taller
           while the streaming step is, and back to the base when the deploy settles —
           over `duration-moderate-02` / `ease-productive-entrance`, which is the run
           reading as one continuous motion instead of a box snapping between sizes.
           `min-h-44` is the scale step at the collapsed base, so the card is already at
           its resting size before the first step streams.

           The console's deployment view runs inside with its chrome off
           (`:header="false"`): no title row, no Phased/Complete switch, no copy control
           — the three steps and the progress bar only.

           Each streamed line fades in as it lands. The rows are LogView's own markup, so
           the catalogued `animate-fade-in` is applied through a descendant variant on
           the `div[data-type]` line element — a CSS animation runs once per element when
           it enters the DOM, so only the NEW line animates while the ones above it sit
           still. `div[…]` and not `[data-type]`: the message span carries the attribute
           too, and animating both would double the fade on every row. -->
      <CardBox
        :padded="false"
        :style="contentHeight ? { height: `${contentHeight}px` } : undefined"
        class="max-h-full min-h-44 transition-[height] duration-moderate-02 ease-productive-entrance [&_div[data-type]]:animate-fade-in motion-reduce:transition-none motion-reduce:[&_div[data-type]]:animate-none"
      >
        <template #content>
          <!-- The measured element is INSIDE the one being sized and is never given a
               height of its own, so the observer reads the log's natural height and the
               card animating to it cannot feed back into the measurement. -->
          <div
            ref="content"
            class="flex flex-col"
          >
            <DeploymentLogs
              v-if="mode"
              :key="mode"
              :steps="steps"
              :live="mode === 'live'"
              :interval="140"
              :header="false"
            />
          </div>
        </template>
      </CardBox>
    </div>

    <p class="text-pretty text-body-sm text-(--text-muted)">
      <span class="font-medium text-(--text-default)">One command.</span>
      {{ ' ' }}The CLI builds, uploads the function, and propagates it across the network. Every
      step is streamed back as it happens.
    </p>
  </article>
</template>
