<script setup>
  // HomeEmptyState — /home on a FIRST access: the account that owns nothing.
  //
  // The problem this page exists to settle: a first access and every access after it
  // are not the same screen, and they used to be drawn as one. Home.vue opens on the
  // returning shape — a usage rail beside what the account owns — and an account that
  // owns nothing got that shape with zeros in it. Four metrics reading `0` and an empty
  // list do not read as "you are new"; they read as a dashboard for somebody else's
  // account, or as a console that failed to load.
  //
  // So this half is a hero: one line naming what the reader came to do, the search
  // field that opens the ⌘K palette, and three DOORS as cards with real art. No usage,
  // no table, no filters, no tabs.
  //
  // ── IT IS ONLY THE FIRST ACCESS ──
  //
  // It used to hold BOTH states: create something and the page seeded a row, grew a
  // usage rail and drew its own table of what it had just made. That table was a second,
  // private version of the populated Overview — a shape nothing else in the console
  // has, next to a Home.vue that answers the same question with Recents and resource
  // cards. The moment did not earn a second page.
  //
  // So the transition is gone from here. Creating the first resource turns the sample's
  // VERSION (../lib/sample-mode.js) and the reader lands on the populated Overview we
  // already have — the flip is Overview.vue's, since the version is its call and the
  // reader may be returning to a pinned address. Going back to a first access is the
  // same knob the other way, in the Sample preset panel.
  //
  // ── THE ⌘K TRIGGER ──
  //
  // The field is a read-only ⌘K trigger, the same control the rail carries, opening the
  // SAME palette (the shell forwards `showPalette` — see ui/AppLayout.vue). It cannot
  // mount its own: the palette owns the global shortcut and the command list, and a
  // second copy would fight the first for both. It is the only control in the hero — an
  // "Ask the Agent" button was drafted beside it and cut, because no such feature
  // exists and a first access is the worst place to promise one.
  //
  // ── WHAT EACH DOOR ACTUALLY DOES ──
  //
  // The three doors do three different KINDS of thing, and only one of them creates
  // anything (`home-first-use.js` argues the set):
  //
  //   Ship something new → ROUTES to /create, the platform's own create flow. The main
  //     road, the same one the header's Create button takes. A first access must not
  //     teach a shortcut that exists on one screen.
  //   Add a domain → takes the name IN the card, reports whether it is free, and on
  //     Register hands it to the domain's own create page (/domains/new, generated from
  //     the endpoint in ../lib/create-resources.js) with the name already filled in. The
  //     field reports availability in a Popover anchored to it — see THE DOMAIN CHECK
  //     below.
  //     The card registered the name by itself for a while, which made the fastest path
  //     here also the only one that never showed what a domain actually needs: it belongs
  //     to a workload, it is served under a certificate, it has a TLS floor. None of that
  //     is a question the card can ask, and none of it has a defensible default the reader
  //     never sees. So the card keeps the part it can answer on its own — is this name
  //     free — and the page asks the rest, seeded so the answer already given is not asked
  //     for twice.
  //   Onboard your agent → copies the setup prompt. No flow, no resource: the payoff is
  //     in the reader's own editor.
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Kbd from '@aziontech/webkit/kbd'
  import Popover from '@aziontech/webkit/popover'
  import Spinner from '@aziontech/webkit/spinner'
  import { toast } from '@aziontech/webkit/toast'
  import { AGENT_SETUP_PROMPT } from '@shared/lib/agent-onboarding'
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FirstUseCard from '../../components/home/FirstUseCard.vue'
  import HomeFirstUseWire from '../../components/home/HomeFirstUseWire.vue'
  import { createResourcePath } from '../../lib/data/create-resources'
  import { useGreeting } from '../../lib/data/greeting'
  import { firstUseDoors } from '../../lib/data/home-first-use'

  const route = useRoute()
  const router = useRouter()

  // THE COLD ARRIVAL. /home is read on arrival in both versions of the sample — usage
  // is metered per tenancy scope and the resource list is a query — and it is that
  // read coming back empty that decides the reader gets this screen. So the first
  // access opens as its OWN wire (ui/HomeFirstUseWire.vue) and settles once, exactly
  // as the populated Overview does (Home.vue), with the same window.
  //
  // It is also what puts the entrance in the right order. `animate-content-enter` on the hero
  // and the card row fires on mount; without this window that mount happens while the
  // route transition is still travelling, so the content rises through the page's own
  // slide — two moves, two axes, at once. Landing the page first and settling the
  // content after is the choreography the rest of the console uses.
  const LOAD_MS = 620
  const arriving = ref(true)
  let arrivalTimer
  onMounted(() => {
    arrivalTimer = globalThis.setTimeout(() => {
      arriving.value = false
    }, LOAD_MS)
  })

  // The palette lives in the rail, and the shell that owns it is Overview's
  // (../components/Overview.vue) — so the hero's ⌘K field ASKS for it instead of
  // reaching into a ref. Same palette either way: it owns the global shortcut and
  // the command list, and a second copy would fight the first for both.
  const emit = defineEmits(['open-palette'])
  const openPalette = () => emit('open-palette')

  // The greeting, shared with the populated Overview so /home opens the same way in
  // both versions — five time bands, re-read on the hour (../lib/greeting.js).
  const { greetingFor } = useGreeting()
  const greeting = computed(() => greetingFor(route.query.email))

  // A door does one of two things here, and the kind says which (see
  // home-first-use.js). The domain door is the third, and it is not dispatched: its
  // action is the field itself.
  const runDoor = (door) =>
    door.action.kind === 'copy-prompt' ? copyAgentPrompt() : openCreateFlow()

  // THE MAIN ROAD. Shipping something new hands the reader to the platform's own
  // create flow (/create — import from Git, or start from a template), which is where
  // the header's Create button goes too. A first access must not teach a shortcut that
  // exists on one screen: the reader learns the door they will use every time after
  // this. The email rides along, the way every route in this prototype carries it.
  const openCreateFlow = () =>
    router.push({ path: '/create', query: { email: route.query.email || undefined } })

  // The agent door's whole action is the clipboard: there is no page to open, and a
  // button that opened one to then offer a copy button would be a step with no
  // decision in it. Same prompt the contrast pill copies (lib/agent-onboarding.js).
  const copyAgentPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_SETUP_PROMPT)
      toast.success('Setup prompt copied.', {
        description: 'Paste it into Claude, Cursor, Windsurf, Codex or OpenCode.'
      })
    } catch {
      toast.error("Couldn't copy the prompt.", {
        description: 'Clipboard access was blocked by the browser.'
      })
    }
  }

  // ── THE DOMAIN CHECK ──
  //
  // A domain is the one thing on this screen the reader supplies rather than picks, and
  // the answer they need is not a validation ("that looks like a domain") but a FACT
  // about the world: is this name free, and if it is not, do they already own it. So the
  // field reports a lookup, and it reports it in a Popover anchored to the field —
  // beside the thing being answered, not in a toast that leaves, and not as an inline
  // line that would shove the card's own button down mid-type.
  //
  // It opens on the SPINNER, deliberately. A panel that appears only once the answer
  // lands reads as if the answer was instant and therefore not really checked; showing
  // the wait is what makes the verdict credible. Same reason the panel keeps the domain
  // it is talking about in its text: by the time the answer arrives the reader may have
  // typed further.
  //
  // One timer does debounce AND latency: it restarts on every keystroke, so the spinner
  // stays up while the reader types and the verdict lands a beat after they stop. Two
  // timers would let a stale verdict overtake a fresh keystroke.
  const domain = ref('')

  // Shape only — enough to know a lookup is worth starting. The verdict is the answer;
  // this is just "there is something to ask about".
  const DOMAIN_SHAPE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i

  // What the prototype treats as already registered. A fixed list rather than a random
  // roll: a demo that answers differently on the same input cannot be shown twice.
  const REGISTERED = ['azion.com', 'google.com', 'example.com', 'cloudflare.com']

  const CHECK_MS = 900

  const check = reactive({ open: false, loading: false, name: '', registered: false })
  let checkTimer

  // The panel is sized to the FIELD, not to its own content: a lookup about what the
  // reader just typed should be the width of the thing they typed it in, or it reads as a
  // second, unrelated surface. Measured off the field on every keystroke rather than
  // watched with a ResizeObserver — the check already runs there, and a panel that is
  // only ever open right after a keystroke can never hold a stale width.
  //
  // It has to be an inline width on the panel's own content, because PopoverContent sets
  // `inheritAttrs: false` and binds no `$attrs` to the panel, so a class or style passed
  // from here never reaches it. Worth fixing in the DS; see the note in the report.
  //
  // Measured off the INPUT EVENT rather than a template ref: the field lives in a slot
  // passed to FirstUseCard from inside a `v-for`, and a string ref never binds through
  // that (it stayed null, and the panel silently fell back to its own min-width). The
  // event always carries the real element.
  const fieldWidth = ref(0)

  const measureField = (event) => {
    const form = event?.target?.closest?.('form')
    if (form) fieldWidth.value = Math.round(form.offsetWidth)
  }

  watch(domain, (value) => {
    globalThis.clearTimeout(checkTimer)
    const name = value.trim().toLowerCase()
    if (!DOMAIN_SHAPE.test(name)) {
      // Nothing to answer yet: an incomplete name is the reader mid-word, not an error.
      check.open = false
      check.loading = false
      return
    }
    check.open = true
    check.loading = true
    check.name = name
    checkTimer = globalThis.setTimeout(() => {
      check.loading = false
      check.registered = REGISTERED.includes(name)
    }, CHECK_MS)
  })

  // The panel's own open state is driven by the check, not by the trigger: a click on
  // the field must not toggle a lookup panel. So `true` from the Popover is ignored and
  // only `false` is honoured, which keeps light-dismiss (outside click, Escape) working.
  const onCheckOpen = (value) => {
    if (!value) {
      check.open = false
      releaseSwapHeight()
    }
  }

  // The height pin, in the three moments `mode="out-in"` gives us. Nothing here measures
  // twice or holds a value at rest: `swapHeight` is '' (auto) except for the length of the
  // move, which is what keeps the panel responsive to a long domain or a wrapped line.
  const swapHeight = ref('')

  // The leaving content, still at its natural height: pin the box to it.
  const pinSwapHeight = (el) => {
    swapHeight.value = `${el.offsetHeight}px`
  }

  // The entering content is in the DOM but the box is still pinned to the old value, so
  // reading it here gives the target and px → px interpolates.
  const growSwapHeight = (el) => {
    swapHeight.value = `${el.offsetHeight}px`
  }

  // Back to auto the moment it lands.
  const releaseSwapHeight = () => {
    swapHeight.value = ''
  }

  // Register — and Enter in the field, which is the same gesture — hands the checked name
  // to the domain's create page. The name rides as `?domain=`, which CreateResource reads
  // as the answer to its own first field, and `?from=` pins the return to THIS address:
  // the pinned version of Overview (/home-empty-state) and /home are the same component,
  // and returning to the module's `listPath` would drop the reader on a different one
  // than they left. What that page sends back — `?domain=` again, this time as the
  // creation — is read by Overview.vue, which turns the sample's version over to the
  // populated Home.
  const addDomain = () => {
    const typed = domain.value.trim()
    if (!typed) {
      // No amber prompt on a one-field card: the field IS the instruction, and the
      // placeholder already says what goes in it. Pressing Enter on an empty field is
      // a no-op, not an error worth a line of red.
      return
    }
    // A taken name has nowhere to go. Enter obeys the same rule as the panel's button:
    // the panel keeps reporting, and the create page is not opened on a name the check
    // has already said is not available.
    if (check.registered && check.name === typed.toLowerCase() && !check.loading) return
    globalThis.clearTimeout(checkTimer)
    check.open = false
    releaseSwapHeight()
    router.push({
      path: createResourcePath('domains'),
      query: {
        domain: typed,
        from: route.path,
        email: route.query.email || undefined
      }
    })
    domain.value = ''
  }

  onUnmounted(() => {
    globalThis.clearTimeout(checkTimer)
    globalThis.clearTimeout(arrivalTimer)
  })
</script>

<template>
  <!-- No AppLayout here: the shell is owned by Overview.vue, which holds it ACROSS
       the version swap (see the note there). -->
  <!-- THE STANDARD PAGE CONTAINER (`layout-column`, --layout-measure / 1388px) — the
         SAME measure the populated Overview takes. Both halves of /home are now one
         width, which is the whole point of standardizing it: an account that creates its
         first resource watches this screen become that one, and a container that resized
         under that transition made a change of CONTENT read as a change of PAGE.
         This half used to keep the tighter FOCUSED cap (1024px) because the data measure
         it was arguing against was 1620px, where a hero of one sentence and three cards
         left each card description running as a single long line. At 1388px the row of
         three lands at ~440px a card, and the two things in the hero that a wide column
         would actually stretch carry their own caps anyway — the ⌘K trigger is capped at
         `--container-2xl` and the hero line is `text-balance`. So the argument for a
         second measure here is spent, and the shared one costs the cards nothing.
         `layout-boundary` rides on the SAME block as the measure because Overview.vue
         passes `padded=false` to the shell (see the note there). This is the documented
         self-padded shape, and it does NOT narrow the page: the column utility grows
         its cap by exactly the inset it now contains
         (`max-width: calc(measure + 2 * --layout-boundary-inline)`, packages/theme/src/
         tokens/semantic/layouts.data.js), so the content column is the full 1388px. -->
  <main class="layout-column layout-boundary flex min-h-full flex-col">
    <!-- The page's own wire, in the page's own column — see the note on the
           arrival window above. -->
    <HomeFirstUseWire v-if="arriving" />

    <!-- Centred in the viewport, not hanging from the top: the hero and three cards
           do not fill a desktop screen, and a short block pinned to the top edge with
           a void under it reads as content that failed to load. `min-h-full` (never
           `h-full`) so the box still grows when the cards stack on mobile. -->
    <div
      v-else
      class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)"
    >
      <!-- The hero. Centred, because there is nothing else on screen to align a
             left edge against; the returning Overview is left-aligned, and the
             difference is part of how the two read as different screens. -->
      <div
        class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)"
      >
        <!-- The greeting, above the hero line rather than instead of it. They do
               two different jobs: the greeting says the console knows who arrived
               and roughly when, the hero line says what this screen is for. The
               populated Overview carries the same greeting as its heading, so /home
               opens the same way in both versions (../lib/greeting.js). -->
        <div class="flex flex-col items-center gap-(--spacing-xs)">
          <p class="text-center text-body-md text-(--text-muted)">{{ greeting }}</p>
          <h1 class="text-balance text-center text-heading-lg text-(--text-default)">
            Let's build on Azion.
          </h1>
        </div>

        <!-- The ⌘K trigger, at hero width. It is the only control in the hero. -->
        <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
          <!-- Read-only ⌘K trigger: the palette owns the search, the same way the
                 rail's field does. `cursor-pointer` reaches the inner input too, so
                 the whole control reads as pressable rather than typeable. -->
          <div
            class="min-w-0 flex-1 cursor-pointer [&_input]:cursor-pointer"
            @click="openPalette"
            @keydown.enter="openPalette"
          >
            <InputText
              model-value=""
              placeholder="Search products, resources and commands"
              size="large"
              readonly
              aria-label="Search products, resources and commands"
              aria-keyshortcuts="Meta+K"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
              <template #iconRight>
                <Kbd
                  meta
                  size="small"
                  >K</Kbd
                >
              </template>
            </InputText>
          </div>
        </div>
      </div>

      <!-- ── THE CARD ROW ──
             The three doors, equal weight. Every control is `outlined`: a filled one
             among three would answer a question the reader has not been asked, and the
             answer is not the same for a team bringing a domain, a team shipping an app
             and a team whose editor should learn to deploy. One beat behind the hero
             (`--content-enter-delay`) so the page assembles in reading order. -->
      <div
        class="animate-content-enter motion-reduce:animate-none grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3 [--content-enter-delay:var(--transition-duration-fast-01)]"
      >
        <FirstUseCard
          v-for="door in firstUseDoors"
          :key="door.id ?? door.title"
          :illustration="door.illustration"
          :title="door.title"
          :description="door.description"
        >
          <template #action>
            <!-- The domain door's action is its field: `submit.prevent` so Enter adds
                   it, which is the gesture the placeholder implies. The lookup rides in
                   a Popover anchored to the field — `w-full` on both the Popover and its
                   Trigger because each is `inline-block` / `w-fit` by default and would
                   otherwise shrink the field to its content. -->
            <Popover
              v-if="door.action.kind === 'domain'"
              :open="check.open"
              placement="bottom-start"
              :offset="8"
              class="w-full"
              @update:open="onCheckOpen"
            >
              <Popover.Trigger class="w-full">
                <form
                  class="w-full"
                  @submit.prevent="addDomain"
                >
                  <InputText
                    v-model="domain"
                    placeholder="Type in your domain"
                    size="medium"
                    aria-label="Domain to add"
                    @input="measureField"
                  />
                </form>
              </Popover.Trigger>

              <Popover.Content>
                <!-- THE SWAP, ANIMATED.
                       The panel opens on a spinner and then REPLACES it with a verdict —
                       a content change inside a box whose height is a runtime fact, which
                       is the one case `/add-animation` says must not be a keyframe (both
                       ends are unknown at author time and `auto` is not interpolable). So
                       it is the pin recipe from `lib/animate-height.js`, driven off the
                       Transition's own hooks because the two states never coexist under
                       `mode="out-in"`: pin the leaving height, set the entering one, then
                       release to `auto`.
                       The cross-fade itself is catalogue only — `animate-fade-out` /
                       `animate-fade-in`, both `motion-reduce:animate-none` — and the
                       height rides a `transition-[height]` on the same tokens the rest of
                       the page uses. -->
                <div
                  class="overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                  :style="{
                    ...(fieldWidth ? { width: `${fieldWidth}px` } : {}),
                    ...(swapHeight ? { height: swapHeight } : {})
                  }"
                >
                  <Transition
                    mode="out-in"
                    enter-active-class="animate-fade-in motion-reduce:animate-none"
                    leave-active-class="animate-fade-out motion-reduce:animate-none"
                    @before-leave="pinSwapHeight"
                    @enter="growSwapHeight"
                    @after-enter="releaseSwapHeight"
                  >
                    <!-- WAITING. The spinner sits beside the sentence rather than
                           replacing it: the reader has to know what is being looked up,
                           not just that something is. -->
                    <p
                      v-if="check.loading"
                      key="checking"
                      class="flex items-center justify-center gap-(--spacing-xs) p-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
                    >
                      <Spinner class="size-4 shrink-0 text-(--text-muted)" />
                      Checking {{ check.name }}...
                    </p>

                    <!-- THE VERDICT. Registered is not an error, so it is not red: it is
                           the ordinary outcome for a name somebody already took. A single
                           element, because a Transition takes one child — and keyed, so
                           the swap is a real enter/leave rather than a patch of the same
                           node.
                           A TAKEN NAME OFFERS NOTHING. There was a "Connect" button here,
                           on the theory that a reader who owns the domain elsewhere would
                           want to point it at Azion — but that is a different flow
                           (delegation, records, proof of ownership) with a different shape,
                           and a button that only looks like the one beside it is the worst
                           way to enter it. So the panel REPORTS and stops; the only action
                           it offers is the one it can actually complete. -->
                    <div
                      v-else
                      key="verdict"
                      class="flex flex-col gap-(--spacing-sm) p-(--spacing-sm)"
                    >
                      <p class="text-body-sm text-(--text-default)">
                        <template v-if="check.registered">
                          {{ check.name }} is already registered. Try another name.
                        </template>
                        <template v-else>
                          {{ check.name }} is available. Azion registers it and issues the
                          certificate.
                        </template>
                      </p>
                      <!-- ONE control, and only on a name that can be taken. A `Kbd` chip
                             sat beside it at first to advertise that Enter does the same
                             thing, and it read as a second button — two things to press for
                             one outcome. The field already accepts Enter; the panel does
                             not need to say so twice. -->
                      <Button
                        v-if="!check.registered"
                        label="Register"
                        kind="secondary"
                        size="medium"
                        class="w-full"
                        @click="addDomain"
                      />
                    </div>
                  </Transition>
                </div>
              </Popover.Content>
            </Popover>
            <!-- `medium`, and the field beside it is `medium` too: the three actions
                   are the same kind of control on the same row, so they have to be the
                   same height or they never sit on one line. -->
            <Button
              v-else
              :label="door.action.label"
              kind="outlined"
              size="medium"
              :icon="door.action.kind === 'copy-prompt' ? 'pi pi-copy' : ''"
              @click="runDoor(door)"
            />
          </template>
        </FirstUseCard>
      </div>
    </div>
  </main>
</template>
