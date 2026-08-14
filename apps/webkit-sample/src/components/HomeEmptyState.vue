<script setup>
  // HomeEmptyState — /home-empty-state: Overview on a FIRST access, and the moment it
  // stops being one.
  //
  // The problem this page exists to settle: a first access and every access after it
  // are not the same screen, and today they are drawn as one. Home.vue opens on the
  // returning shape — a usage rail beside a resource table — and an account that owns
  // nothing gets that shape with zeros in it. Four metrics reading `0` and an empty
  // table do not read as "you are new"; they read as a dashboard for somebody else's
  // account, or as a console that failed to load.
  //
  // So this route holds BOTH states behind one condition, `hasAnyResource`:
  //
  //   NOTHING YET → a hero. One line naming what the reader came to do, the search
  //     field that opens the ⌘K palette, and three DOORS as cards with real art. No
  //     usage, no table, no filters, no tabs.
  //
  //   ONE RESOURCE → the returning Overview. The agent onboarding shrinks to the
  //     contrast pill (where the populated Overview already carries it), usage appears
  //     (see below), the resource filter appears, and the selected resource lists. The
  //     hero retires: the reader has been here before and is not welcomed twice.
  //
  // ── WHY USAGE WAITS ──
  //
  // Usage is metered per tenancy scope, so on an empty account every card is `0` — and
  // a zero has two unrelated meanings: "nothing served yet" and "nothing to serve
  // with". Showing them before the first resource teaches the second one. On the first
  // resource the same zeros mean something real (deployed, no traffic yet), so that is
  // when they arrive. This is the rule Gab asked for, expressed as one computed.
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
  // anything here (`home-first-use.js` argues the set):
  //
  //   Ship something new → ROUTES to /create, the platform's own create flow. The main
  //     road, the same one the header's Create button takes. A first access must not
  //     teach a shortcut that exists on one screen.
  //   Add a domain → takes the name IN the card, reports whether it is free, and on
  //     Register hands it to the domain's own create page (/domains/new, generated from
  //     the endpoint in ../lib/create-resources.js) with the name already filled in. The
  //     field reports availability in a Popover anchored to it — see THE DOMAIN CHECK
  //     below.
  //     The card seeded the row by itself for a while, which made the fastest path here
  //     also the only one that never showed what a domain actually needs: it belongs to a
  //     workload, it is served under a certificate, it has a TLS floor. None of that is a
  //     question the card can ask, and none of it has a defensible default the reader
  //     never sees. So the card keeps the part it can answer on its own — is this name
  //     free — and the page asks the rest, seeded so the answer already given is not
  //     asked for twice. It returns here with `?domain=`, which is what turns the first
  //     access into the returning Overview (see COMING BACK FROM THE CREATE PAGE).
  //   Onboard your agent → copies the setup prompt. No flow, no resource: the payoff is
  //     in the reader's own editor.
  //
  // "Reset to first access" puts the page back — a prototype affordance, and the only
  // control here that would not exist in the console.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Kbd from '@aziontech/webkit/kbd'
  import Popover from '@aziontech/webkit/popover'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import {
    coreResourceOptions,
    coreResources,
    firstUseDoors,
    usageMetrics
  } from '../home-first-use'
  import { AGENT_SETUP_PROMPT, useAgentOnboarding } from '../lib/agent-onboarding'
  import { createResourcePath } from '../lib/create-resources'
  import { useGreeting } from '../lib/greeting'
  import { useTenancyReload } from '../lib/tenancy-reload'
  import ContrastBanner from './ui/ContrastBanner.vue'
  import DeleteDialog from './ui/DeleteDialog.vue'
  import FirstUseCard from './ui/FirstUseCard.vue'
  import HomeFirstUseWire from './ui/HomeFirstUseWire.vue'

  const route = useRoute()
  const router = useRouter()

  const { tenancyReloading } = useTenancyReload()

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

  // What the account owns, per core resource. Empty on arrival: this route's whole
  // subject is the account that owns nothing.
  const rows = reactive({ applications: [], domains: [], workloads: [] })

  // THE ONE CONDITION. Everything the first access hides, and everything the
  // returning Overview shows, hangs off it.
  const hasAnyResource = computed(() =>
    coreResources.some((resource) => rows[resource.id].length > 0)
  )

  const selected = ref(coreResources[0].id)
  const current = computed(
    () => coreResources.find((resource) => resource.id === selected.value) ?? coreResources[0]
  )
  const currentRows = computed(() => rows[current.value.id])

  // The palette lives in the rail, and the shell that owns it is now Overview's
  // (../components/Overview.vue) — so the hero's ⌘K field ASKS for it instead of
  // reaching into a ref. Same palette either way: it owns the global shortcut and
  // the command list, and a second copy would fight the first for both.
  const emit = defineEmits(['open-palette'])
  const openPalette = () => emit('open-palette')

  // Dismissing the agent pill: the component removes itself, and the page decides
  // whether it stays gone. That decision is now persisted and SHARED with the
  // populated Overview (../lib/agent-onboarding.js) — the pill here and the pill
  // there are the same offer, so dismissing one and meeting the other again would be
  // the console telling the reader their answer did not count.
  const { agentOnboardingVisible, dismissAgentOnboarding } = useAgentOnboarding()

  // The greeting, shared with the populated Overview so /home opens the same way in
  // both versions — five time bands, re-read on the hour (../lib/greeting.js).
  const { greetingFor } = useGreeting()
  const greeting = computed(() => greetingFor(route.query.email))

  const onBannerClose = () => {
    dismissAgentOnboarding()
    toast.info('Agent onboarding removed.', {
      description: 'The setup prompt stays available from the docs.'
    })
  }

  // A door does one of three things, and the kind says which (see home-first-use.js).
  // One dispatcher rather than three handlers wired per card: the row is a v-for, so a
  // per-card handler would have to be selected by id anyway, one level further from the
  // data that decides it.
  const runDoor = (door) => {
    if (door.action.kind === 'create') return openCreateFlow()
    if (door.action.kind === 'copy-prompt') return copyAgentPrompt()
    // `seed`: the returning Overview's per-resource door, which stands in for a create
    // flow this prototype does not need to open twice.
    const resource = coreResources.find((item) => item.card === door)
    if (resource) create(resource)
  }

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

  // Creating: seed the resource, select it so the reader lands on what they just made,
  // and say what happened. The toast names the resource rather than the button,
  // because by the time it is read the button is gone.
  // `quiet` is for a resource that arrives from its own create page: that page already
  // reported the creation, and a second toast saying the same thing one navigation later
  // reads as the console having done it twice.
  const create = (resource, value, { quiet = false, ...rest } = {}) => {
    const row = resource.seed(value, rest)
    rows[resource.id].push(row)
    selected.value = resource.id
    if (quiet) return
    // The toast names the ROW, not the module: `resource.label` is plural
    // ("Domains created." for one domain), and by the time this is read the button
    // that said "Create app" is gone, so the name is the only useful subject left.
    toast.success(`${row.name} created.`, {
      description: `Usage and your ${resource.unit} list are on Overview now.`
    })
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
  // the two pinned versions of Overview (/home-empty-state, /home-populated) and /home are
  // the same component, and returning to the module's `listPath` would drop the reader on
  // a different one than they left.
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

  // ── COMING BACK FROM THE CREATE PAGE ──
  //
  // The card asks the one question it can answer on its own; /domains/new asks the rest
  // (the environment it binds, a certificate, a TLS floor — ../lib/create-resources.js).
  // Whoever finishes there lands back here with `?domain=<name>`, and this adopts it: the
  // row it seeds is what turns the first access into the returning Overview, which is the
  // one thing the prototype has to fake.
  //
  // `?workload=` rides along only when one was chosen — it is optional on that page — and
  // the row prints an em dash when it is absent rather than naming a binding nobody made.
  // The environment stays behind: the row has no column for it (see ../home-first-use.js).
  //
  // The query is stripped straight after, with `replace` so Back does not walk into it: a
  // seed is an EVENT, and a URL that still carries it would re-seed on every reload and on
  // every Back, quietly making the "reset to first access" button a no-op.
  const adopt = () => {
    const created = route.query.domain
    if (!created) return
    create(
      coreResources.find((resource) => resource.id === 'domains'),
      String(created),
      { quiet: true, workload: route.query.workload ? String(route.query.workload) : '' }
    )
    const query = { ...route.query }
    delete query.domain
    delete query.workload
    router.replace({ path: route.path, query })
  }

  onMounted(adopt)

  onUnmounted(() => {
    globalThis.clearTimeout(checkTimer)
    globalThis.clearTimeout(arrivalTimer)
  })

  const reset = () => {
    coreResources.forEach((resource) => {
      rows[resource.id] = []
    })
    selected.value = coreResources[0].id
    domain.value = ''
  }

  const onFilter = (event, value) => {
    selected.value = value
  }

  const statusSeverity = (value) =>
    ({ Active: 'success', 'Pending DNS': 'warning' })[value] ?? 'secondary'

  // The resource's own `unit` names it in the dialog ("Delete workload" → "Workload"),
  // so the seeded row a first access just created is removed by the same confirmation
  // its module list uses, not by a bare menu click.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)
  const deleteKind = computed(() => {
    const unit = current.value.unit ?? 'resource'
    return unit.charAt(0).toUpperCase() + unit.slice(1)
  })

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    rows[current.value.id] = currentRows.value.filter((item) => item.id !== row.id)
    toast.success(`${row.name} deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(row.name, { description: `${value} is disabled in the demo.` })
  }
</script>

<template>
  <!-- No AppLayout here: the shell is owned by Overview.vue, which holds it ACROSS
       the version swap (see the note there). -->
  <!-- The SAME measure the populated Overview uses (`layout-column-focused`,
         --container-4xl), not the wide one. Both states are the same page, so the
         content column cannot change width between them: a first access that is 600px
         wider than the Overview it becomes would make the first resource look like it
         resized the console. It also stops the three cards stretching to a width where
         each description runs as one long line. -->
  <main class="layout-column-focused flex min-h-full flex-col">
    <!-- The page's own wire, in the page's own column — see the note on the
           arrival window above. -->
    <HomeFirstUseWire v-if="arriving" />

    <!-- ── FIRST ACCESS ── -->
    <!-- Centred in the viewport, not hanging from the top: the hero and three cards
           do not fill a desktop screen, and a short block pinned to the top edge with
           a void under it reads as content that failed to load. `min-h-full` (never
           `h-full`) so the box still grows when the cards stack on mobile. -->
    <div
      v-else-if="!hasAnyResource"
      class="my-auto flex w-full flex-col gap-[var(--layout-section-gap)] py-[var(--spacing-xl)]"
    >
      <!-- The hero. Centred, because there is nothing else on screen to align a
             left edge against; the returning Overview is left-aligned, and the
             difference is part of how the two read as different screens. -->
      <div
        class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-[var(--spacing-lg)]"
      >
        <!-- The greeting, above the hero line rather than instead of it. They do
               two different jobs: the greeting says the console knows who arrived
               and roughly when, the hero line says what this screen is for. The
               populated Overview carries the same greeting as its heading, so /home
               opens the same way in both versions (../lib/greeting.js). -->
        <div class="flex flex-col items-center gap-[var(--spacing-xs)]">
          <p class="text-center text-body-md text-[var(--text-muted)]">{{ greeting }}</p>
          <h1 class="text-balance text-center text-heading-lg text-[var(--text-default)]">
            Let's build on Azion.
          </h1>
        </div>

        <!-- The ⌘K trigger, at hero width. It is the only control in the hero: the
               agent affordance below is the ContrastBanner, which is the console's
               real one. -->
        <div class="flex w-full max-w-[var(--container-2xl)] flex-col items-stretch">
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
        class="animate-content-enter motion-reduce:animate-none grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-3 [--content-enter-delay:var(--transition-duration-fast-01)]"
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
                    placeholder="Type in your domain..."
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
                      class="flex items-center justify-center gap-[var(--spacing-xs)] p-[var(--spacing-sm)] text-center text-body-sm text-[var(--text-muted)]"
                    >
                      <Spinner class="size-4 shrink-0 text-[var(--text-muted)]" />
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
                      class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-sm)]"
                    >
                      <p class="text-body-sm text-[var(--text-default)]">
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

    <!-- ── EVERY ACCESS AFTER ── -->
    <template v-else>
      <!-- The agent onboarding, now in its compact form and where the populated
             Overview already carries it (Home.vue puts the same pill here). On the
             first access it is a full door in the row above; once the account owns
             something it shrinks to a pill, and it is `closable` because by then it is
             a reminder rather than an offer. -->
      <!-- The `v-if` is on the wrapper, not the pill: a dismissed pill would
             otherwise leave this centring row behind as an empty strip. -->
      <div
        v-if="agentOnboardingVisible"
        class="layout-section-start flex justify-center"
      >
        <ContrastBanner
          closable
          @close="onBannerClose"
        />
      </div>

      <!-- The returning Overview: usage on the left, resources on the right, both
             left-aligned and hanging from the top like every other console page. -->
      <div
        class="layout-section-start flex flex-col gap-[var(--layout-boundary-start)] lg:flex-row lg:gap-[var(--layout-section-gap)]"
      >
        <!-- USAGE — present only because the account now owns something. The numbers
             are still zero, and that is the honest reading: deployed, nothing served
             yet. -->
        <aside
          class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-[var(--layout-group-gap)] lg:max-w-[var(--container-xs)]"
        >
          <div class="flex min-h-[var(--size-8)] items-center px-[var(--spacing-xs)]">
            <h2 class="text-heading-xxs text-[var(--text-default)]">Usage</h2>
          </div>

          <div
            class="grid grow auto-rows-fr grid-cols-2 gap-[var(--layout-group-gap)] lg:grid-cols-1"
          >
            <CardBox
              v-for="metric in usageMetrics"
              :key="metric.label"
              :padded="false"
            >
              <template #content>
                <div class="flex grow flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
                  <div class="flex items-center gap-[var(--spacing-xs)]">
                    <span class="min-w-0 truncate text-label-sm text-[var(--text-default)]">
                      {{ metric.label }}
                    </span>
                    <Tooltip :text="metric.hint">
                      <i
                        class="pi pi-info-circle text-body-sm text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                    </Tooltip>
                  </div>
                  <div class="flex items-baseline gap-[var(--spacing-xxs)]">
                    <!-- A reading from the scope we just left is worse than no
                         reading, so the number is a placeholder its own size while
                         the switch re-reads. -->
                    <Skeleton
                      v-if="tenancyReloading"
                      width="4.5rem"
                      height="1.75rem"
                    />
                    <template v-else>
                      <span class="text-big-number-sm tabular-nums text-[var(--text-default)]">
                        {{ metric.value }}
                      </span>
                      <span
                        v-if="metric.unit"
                        class="text-body-xs text-[var(--text-muted)]"
                        >{{ metric.unit }}</span
                      >
                    </template>
                  </div>
                </div>
                <ProgressBar
                  :value="tenancyReloading ? 0 : metric.percent"
                  :max="100"
                  size="small"
                  shape="flat"
                  class="w-full shrink-0"
                  :aria-label="`${metric.label} usage`"
                />
              </template>
            </CardBox>
          </div>
        </aside>

        <!-- RESOURCES — the core three, in the same filter Home uses, scoped to them. -->
        <section
          class="animate-content-enter motion-reduce:animate-none flex w-full min-w-0 flex-col gap-[var(--layout-group-gap)] lg:flex-1 [--content-enter-delay:var(--transition-duration-fast-01)]"
        >
          <header
            class="flex min-h-[var(--size-8)] items-center gap-[var(--spacing-sm)] px-[var(--spacing-xs)]"
          >
            <h2 class="text-heading-xxs text-[var(--text-default)]">Resources</h2>

            <Dropdown
              placement="bottom-start"
              @select="onFilter"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-sliders-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Filter by resource"
                />
              </Dropdown.Trigger>

              <Dropdown.Group label="Filter by Resource">
                <Dropdown.Option
                  v-for="option in coreResourceOptions"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                  :selected="selected === option.value"
                >
                  <template #left>
                    <i
                      :class="option.icon"
                      class="text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                  </template>
                  <template
                    v-if="selected === option.value"
                    #right
                  >
                    <i
                      class="pi pi-check text-[var(--text-default)]"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
            </Dropdown>

            <!-- Prototype only: the one control on this page the console would not
                 have. It sits at the end of the header, outlined and last, so it
                 never competes with the filter it follows. -->
            <Button
              label="Reset to first access"
              kind="outlined"
              size="small"
              icon="pi pi-refresh"
              class="ml-auto"
              @click="reset"
            />
          </header>

          <!-- A core resource the account still does not own keeps its first-access
               card, in place of the table. Same card as the row above, so the door is
               the same door wherever the reader meets it. -->
          <!-- Capped to ONE card's width, and not `grow`. Stretched across the
               resources column the same card falls apart: the stage becomes a wide
               band with a 170px scene adrift in the middle, and `flex-1` on the text
               opens a hole between the description and the field. A door is a door at
               one size — the same size it has in the row above. -->
          <FirstUseCard
            v-if="!currentRows.length && !tenancyReloading"
            :key="`empty-${current.id}`"
            :illustration="current.card.illustration"
            :title="current.card.title"
            :description="current.card.description"
            class="w-full max-w-[var(--container-xs)]"
          >
            <template #action>
              <form
                v-if="current.card.action.kind === 'domain'"
                class="w-full max-w-[var(--container-xs)]"
                @submit.prevent="addDomain"
              >
                <InputText
                  v-model="domain"
                  placeholder="Type in your domain..."
                  size="medium"
                  aria-label="Domain to add"
                  @input="measureField"
                />
              </form>
              <Button
                v-else
                :label="current.card.action.label"
                kind="outlined"
                size="medium"
                @click="runDoor(current.card)"
              />
            </template>
          </FirstUseCard>

          <CardBox
            v-else
            :key="`table-${current.id}`"
            :padded="false"
            class="grow"
          >
            <template #content>
              <Table
                :data="currentRows"
                :columns="current.columns"
                row-key="id"
                enable-sorting
                :loading="tenancyReloading"
                :page-size="6"
              >
                <template #cell-status="{ value }">
                  <Tag
                    :label="value"
                    :severity="statusSeverity(value)"
                    size="medium"
                  />
                </template>

                <template #cell-actions="{ row }">
                  <Dropdown
                    placement="bottom-end"
                    @select="(event, value) => onRowAction(event, value, row)"
                  >
                    <Dropdown.Trigger>
                      <Tooltip text="Row actions">
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="outlined"
                          size="small"
                          aria-label="Row actions"
                        />
                      </Tooltip>
                    </Dropdown.Trigger>

                    <Dropdown.Group>
                      <Dropdown.Option
                        value="View details"
                        label="View details"
                      />
                      <Dropdown.Option
                        value="Edit"
                        label="Edit"
                      />
                    </Dropdown.Group>

                    <Dropdown.Group>
                      <Dropdown.Option
                        value="delete"
                        label="Delete"
                      >
                        <template #left>
                          <i
                            class="pi pi-trash"
                            aria-hidden="true"
                          />
                        </template>
                      </Dropdown.Option>
                    </Dropdown.Group>
                  </Dropdown>
                </template>
              </Table>
            </template>
          </CardBox>
        </section>
      </div>
    </template>

    <DeleteDialog
      v-model:open="deleteOpen"
      :kind="deleteKind"
      :name="pendingDelete?.name ?? ''"
      @confirm="confirmDelete"
    />
  </main>
</template>
