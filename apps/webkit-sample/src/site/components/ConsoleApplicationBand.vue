<script setup>
  // The Console band — the one band on the Web Apps page the live site does not have.
  //
  // Every other band of AzionWebApps is azion.com/en/solutions/web-apps, verbatim (see
  // that file's header). This one is ours, and it is there because this app IS the console
  // reference: the page that argues for building web apps here ends up next to the product
  // that does the building. It follows the platform primitives, which is where a reader
  // has just been told what the pieces are and not yet where they are configured.
  //
  // Nothing about it is page-specific, so it can be mounted in any framed column — it was
  // written against the Hub's home and moved here without a change to its markup. It shows
  // the Application detail page — the drawing on the left, and on the right the six tabs that
  // page carries, one line each. The two halves are one thing: the list is the CONTROL
  // SURFACE and the drawing is what it is talking about, so reading down the six lines
  // plays the screen they describe.
  //
  // FORM IS THE PAGE'S, like every other band. The pair is one SectionModule — the title
  // in its `#header` slot, the split in its body — so the rule between them is the
  // header's own `border-b` (the shape DevPlatform settled for "argument beside the thing
  // it is talking about"). The body FrameBox is `flush` with `borders="y"`, which lands
  // its top rule on the title above and hands the vertical rules back to the column.
  //
  // WHO DRIVES IT.
  //
  //   THE READER, from the right column. Hover, focus or tap a line and the mock cuts to
  //   that tab: the tab bar's marker moves, the page enters, its rows settle, and then
  //   the create surface that tab opens comes in. Hovering the list also takes the clock
  //   away from the autoplay below — the reader has taken over, and a scene that keeps
  //   advancing under the row they are reading is fighting them.
  //
  //   THE CLOCK, otherwise. Nothing about the six tabs is discoverable from a still
  //   frame, and hover does not exist on a phone, so the band cycles on its own at
  //   STEP_MS while it is on screen and nobody is driving. It stops when the band
  //   scrolls out of view (an IntersectionObserver — VueUse's `useElementVisibility`
  //   would do it, but VueUse is not a dependency of this app, so it is the observer by
  //   hand, disconnected on unmount) and it never starts under
  //   `prefers-reduced-motion`, where the reader gets the first tab, settled, and their
  //   own hover.
  //
  // THE MOCK IS NOT A CONTROL. It is `aria-hidden` and `pointer-events-none`
  // (ConsoleApplicationScene.vue): there is no second place to click, no tab stop inside
  // a picture, and nothing for assistive tech to walk. The six buttons in the list are
  // the whole interactive surface, which is also what makes the band operable by
  // keyboard — a Tab through the list plays the same six scenes a mouse does.
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { SectionModule } from '@shared/ui/layout/index.js'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import { APPLICATION_TABS } from '../data/console-application.js'
  import { ConsoleApplicationScene } from '../ui/index.js'

  // How long a tab holds before the clock moves on. Long enough for the scene's own
  // second move (its SECOND_MOVE_MS, plus the drawer's own 240ms slide) to play and be
  // read, and for the reader to finish the line beside it.
  const STEP_MS = 4600

  const router = useRouter()

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  // The observed element is the SPLIT, not the module: it is a real element (a component
  // ref would hand back an instance), and it is the half that has to be on screen for a
  // scene nobody can see to be worth playing.
  const band = ref(null)
  const active = ref(APPLICATION_TABS[0].value)

  // The two conditions that hand the clock over: the band has to be on screen, and the
  // reader must not be driving it themselves.
  const onScreen = ref(false)
  const driving = ref(false)
  const playing = computed(() => onScreen.value && !driving.value)

  let timer = null

  const stop = () => {
    clearTimeout(timer)
    timer = null
  }

  const schedule = () => {
    stop()
    if (!playing.value || prefersReducedMotion()) return
    timer = setTimeout(() => {
      const at = APPLICATION_TABS.findIndex((entry) => entry.value === active.value)
      active.value = APPLICATION_TABS[(at + 1) % APPLICATION_TABS.length].value
      schedule()
    }, STEP_MS)
  }

  watch(playing, schedule)

  // The list is `BoxGridSelection` — the design system's own "pick one of N described
  // options" control, so the rows come with the selected/hover/focus treatment, the roving
  // tabindex and the arrow-key model already right. `label` + `description` are its own
  // fields, which is why the tab copy needs no markup here.
  const TAB_OPTIONS = APPLICATION_TABS.map((entry) => ({
    value: entry.value,
    label: entry.label,
    description: entry.lead
  }))

  /** The reader picks a tab: show it, and hold the clock while they are in the list. */
  const drive = (value) => {
    driving.value = true
    active.value = value
  }

  // Hover and focus are DELEGATED from the group rather than bound per row: the option
  // element belongs to the component, not to this file, so the pointer is resolved to a tab
  // by its position in the group instead of by a handler we cannot attach to it. Clicking
  // an option goes through `update:modelValue`, so a tap parks the clock the same way.
  const onOptionEnter = (event) => {
    const option = event.target.closest?.('[role="radio"]')
    if (!option) return
    const at = [...event.currentTarget.querySelectorAll('[role="radio"]')].indexOf(option)
    if (at >= 0) drive(APPLICATION_TABS[at].value)
  }

  /** They have left the list — the clock takes over again from wherever they left it. */
  const release = () => {
    driving.value = false
  }

  const openConsole = () => router.push('/applications/1784552864')

  let observer = null

  onMounted(() => {
    // No observer (older browser, or a test env): treat the band as visible, so the
    // fallback is a playing scene rather than a frozen one.
    if (!('IntersectionObserver' in window) || !band.value) {
      onScreen.value = true
      schedule()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        onScreen.value = entries.some((entry) => entry.isIntersecting)
      },
      { threshold: 0.25 }
    )
    observer.observe(band.value)
  })

  onBeforeUnmount(() => {
    stop()
    observer?.disconnect()
    observer = null
  })
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        kind="left"
        eyebrow="Azion Console"
        title="The Application, tab by tab"
        description="One resource carries every second-level pattern in the Console: a navigation tab bar over pages that each own their own list, their own create drawer and their own save. Pick a tab to open it."
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <!-- Art and control, side by side. The art half takes the slack (the mock is a page,
         the list is a column of type), and below `lg` the two stack in that order — the
         drawing first, then the lines that drive it.
         `grid-cols-1` is explicit, not implicit: an implicit track is `auto`, which sizes
         to its content's MAX-CONTENT width, and the mock's tab bar is deliberately wider
         than its frame — so the stacked band would have been as wide as six tab labels. -->
      <div
        ref="band"
        class="grid grid-cols-1 gap-(--spacing-xl) p-(--spacing-xl) lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:gap-(--spacing-xxl)"
      >
        <ConsoleApplicationScene :tab="active" />

        <!-- One list, one clock owner: the pointer and focus handlers sit on the GROUP, not
           on each row, so moving between rows never reads as leaving and re-entering. -->
        <div
          class="flex min-w-0 flex-col"
          @mouseleave="release"
          @focusout="release"
        >
          <BoxGridSelection
            :items="TAB_OPTIONS"
            :model-value="active"
            class="flex-col gap-(--spacing-sm)"
            @update:model-value="drive"
            @mouseover="onOptionEnter"
            @focusin="onOptionEnter"
          />

          <!-- Where the drawing stops being a drawing. -->
          <div class="mt-(--spacing-xl) pt-(--spacing-xs) lg:mt-auto">
            <MiniButton
              label="Open the Console"
              show-icon
              icon="pi pi-arrow-right"
              @click="openConsole"
            />
          </div>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
