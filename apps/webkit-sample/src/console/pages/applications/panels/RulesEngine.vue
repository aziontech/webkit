<script setup>
  // Application → Rules Engine. Conditional rules applied to requests and responses.
  //
  // TWO THINGS MAKE THIS TAB DIFFERENT FROM EVERY OTHER LIST IN THE CONSOLE, and
  // both are consequences of the same fact: a rules engine is not a set of records,
  // it is a PROGRAM.
  //
  //   1. THE PHASE IS A SWITCH, NOT A COLUMN. A rule runs in the request phase or
  //      the response phase, and the two are separate programs that never interleave
  //      — so the reader is always looking at exactly one of them. That is a
  //      SegmentedButton over the list, not a `Phase` column plus a `Phase` filter
  //      (two controls for one concept, and a column whose value is constant for
  //      every row on screen).
  //   2. THE ORDER IS THE BEHAVIOUR. Rules execute top to bottom, so the row order
  //      is data the user edits, not a view preference. Three things follow, and each
  //      is the reason for a piece of this file:
  //
  //      IT IS EDITED, SO IT COMMITS. Moving a row is an unsaved change to the
  //        application, exactly like editing a field on a settings page — so it
  //        brings up the same commit bar every settings surface in the console uses
  //        (ui/SettingsSaveBar.vue), with the same Discard and the same leave guard.
  //        A reorder that saved itself would be a destructive edit with no undo, made
  //        by a gesture as cheap as a drag.
  //      IT IS ANIMATED. A row that teleports to its new index tells the reader that
  //        something changed but not what: with five near-identical rows, the eye
  //        cannot tell a move from a re-sort. The rows FLIP to their new positions
  //        (../../lib/list-morph.js) so the move is legible as a move.
  //      IT IS NOT SORTABLE. A column sort would show an order that is not the order
  //        the rules run in, which is worse than no sort at all.
  //
  // Reordering is suspended while the search narrows the list — a drag across rows
  // that are not on screen cannot mean anything — and the list says so rather than
  // leaving a dead grip (see the Message below).
  //
  // THE ROW OPENS THE RULE. A rule's record is its criteria and its behaviors, which
  // is a whole form, so the row is a way IN to the same drawer that creates one
  // (../../components/CreateRuleDrawer.vue) seeded with the rule — the create-surface
  // rule's answer for editing inside a resource, and the same gesture the three list
  // tabs beside this one answer to.
  //
  // The ORDER CELL is the exception, and it stops the click itself: its four controls
  // (the position field, the grip, the two chevrons) are how the row is MOVED, and a
  // reorder that also opened a form would make every nudge cost a dismissal.
  //
  // SO THE ROW DOES NOT SUMMARISE THE CRITERIA. It identifies the rule and says who
  // touched it last: name, description, status, Last Modified — the four columns every
  // list in the console carries. A criteria column was a truncated fragment of a
  // program ("host ~ www.* +2 more"): too little to reason about the rule and too much
  // to read at a glance, in the place the reader's own sentence about it belongs. The
  // description is what the author wrote for whoever reads the rule next; the criteria
  // are read in the drawer, whole, where they are also changed.
  //
  // The table is HAND-COMPOSED (Table.Header / Table.Row / Table.Cell) rather than
  // data-driven: the row is the drag target and the FLIP subject, and only the
  // compound API lets this page own the row element.
  //
  // The "Create rule" button is on the page's tab row, not in this heading
  // (ApplicationDetail owns that row). The flow stays here: the shell calls the
  // `openCreate` this view exposes.
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { daysAgo } from '@shared/lib/dates'
  import { authorAt } from '@shared/lib/people'
  import { computed, nextTick, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { DRAG_ROW_CLASS, useDragReorder } from '../../../lib/behavior/drag-reorder'
  import { BLOCK_SWAP, MORPH_TRANSITION } from '../../../lib/behavior/list-morph'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import CreateRuleDrawer from '../CreateRuleDrawer.vue'

  const route = useRoute()
  const router = useRouter()

  // ── The phase ─────────────────────────────────────────────────────────────
  // In the URL like the tab it sits under, so a phase is linkable and survives a
  // reload — a support thread points at "the response rules", not at "the Rules
  // Engine tab, then switch".
  const phases = [
    { label: 'Request', value: 'request' },
    { label: 'Response', value: 'response' }
  ]
  const phase = computed({
    get: () => (phases.some((p) => p.value === route.query.phase) ? route.query.phase : 'request'),
    set: (value) => router.replace({ query: { ...route.query, phase: value } })
  })
  const phaseLabel = computed(() => phases.find((p) => p.value === phase.value).label)

  // ── The rules ─────────────────────────────────────────────────────────────
  // One list per phase, because the order is per phase: request rule 2 runs after
  // request rule 1 and has nothing to do with any response rule.
  //
  // The criteria are the STRUCTURED model the drawer edits, not a display string —
  // which is what lets a row be opened, changed and closed with nothing in this list
  // going stale. They are not rendered here (see the top of this file); they are the
  // record the row hands back to the drawer.
  const condition = (variable, operator, argument = '') => ({
    id: `${variable}-${operator}-${argument}`,
    join: null,
    variable,
    operator,
    argument
  })

  /**
   * Puts a face on every rule: the sample's round-robin roster, the same one every
   * other list's Last Modified cell reads (@shared/lib/people). The index runs across
   * BOTH phases so no two rules on screen wear the same avatar, and the decoration
   * happens here — one place — so a seeded rule and one written in the drawer carry
   * the same block.
   */
  const withAuthors = (byPhase) => {
    let index = 0
    return Object.fromEntries(
      Object.entries(byPhase).map(([key, list]) => [
        key,
        list.map((rule) => {
          const person = authorAt(index++)
          return { ...rule, author: person.name, authorAvatar: person.avatar }
        })
      ])
    )
  }

  const seed = () =>
    withAuthors({
      request: [
        {
          id: 're-maintenance',
          name: 'Maintenance page',
          description: 'Serves the maintenance page while the header is set.',
          phase: 'request',
          criteria: [{ id: 'c1', conditions: [condition('header', 'matches', 'x-maintenance')] }],
          // A behavior carries the ARGUMENT its type takes, keyed the way the
          // vocabulary declares it (../../../lib/data/rules-engine.js) — `target` for
          // a free-text value, `connectorId` / `cacheId` / `functionId` for a record
          // of this application. That is what the drawer opens populated from, so a
          // seeded rule and one written here are the same shape.
          behaviors: [{ id: 'b1', type: 'deliver' }],
          status: 'Inactive',
          modifiedAt: daysAgo(34)
        },
        {
          id: 're-www',
          name: 'Redirect www',
          description: 'Sends the www host to the apex domain.',
          phase: 'request',
          criteria: [{ id: 'c2', conditions: [condition('host', 'is-equal', 'www.*')] }],
          behaviors: [{ id: 'b2', type: 'redirect-301', target: 'https://edgeflow.com${uri}' }],
          status: 'Active',
          modifiedAt: daysAgo(12)
        },
        {
          id: 're-gateway',
          name: 'API gateway',
          description: 'Sends API traffic to the gateway connector, through the auth handler.',
          phase: 'request',
          criteria: [{ id: 'c3', conditions: [condition('path', 'matches', '/api/*')] }],
          behaviors: [
            { id: 'b3', type: 'set-connector', connectorId: '7710021' },
            { id: 'b3b', type: 'run-function', functionId: '4021884' }
          ],
          status: 'Active',
          modifiedAt: daysAgo(2)
        },
        {
          id: 're-docs',
          name: 'Docs rewrite',
          description: 'Rewrites the docs path and caches it as a static asset.',
          phase: 'request',
          criteria: [{ id: 'c4', conditions: [condition('path', 'matches', '/docs/*')] }],
          behaviors: [
            { id: 'b4', type: 'rewrite-request', target: '/documentation${uri}' },
            { id: 'b4b', type: 'set-cache-policy', cacheId: 'cs-static' }
          ],
          status: 'Active',
          modifiedAt: daysAgo(21)
        },
        {
          id: 're-remote-port',
          name: 'Add remote port header',
          description: 'Adds the client port to every request reaching the origin.',
          phase: 'request',
          criteria: [{ id: 'c5', conditions: [condition('path', 'matches', '/*')] }],
          behaviors: [
            { id: 'b5', type: 'add-request-header', target: 'x-remote-port: ${remote_port}' }
          ],
          status: 'Active',
          modifiedAt: daysAgo(58)
        }
      ],
      response: [
        {
          id: 're-cache-bypass',
          name: 'Cache bypass',
          description: 'Keeps API responses out of the cache.',
          phase: 'response',
          criteria: [{ id: 'c6', conditions: [condition('path', 'matches', '/api')] }],
          // The response phase looks at an answer already fetched, so it cannot set a
          // cache policy — that is a request-phase behavior. What it can do is say the
          // response is not to be stored.
          behaviors: [{ id: 'b6', type: 'add-response-header', target: 'cache-control: no-store' }],
          status: 'Active',
          modifiedAt: daysAgo(5)
        },
        {
          id: 're-security-headers',
          name: 'Security headers',
          description: 'Adds the security header set to successful responses.',
          phase: 'response',
          criteria: [{ id: 'c7', conditions: [condition('status', 'is-equal', '200')] }],
          behaviors: [
            {
              id: 'b7',
              type: 'add-response-header',
              target: 'strict-transport-security: max-age=31536000'
            }
          ],
          status: 'Active',
          modifiedAt: daysAgo(9)
        },
        {
          id: 're-compress',
          name: 'Compress assets',
          description: 'Compresses script bundles on the way out.',
          phase: 'response',
          criteria: [{ id: 'c8', conditions: [condition('path', 'matches', '*.js')] }],
          behaviors: [{ id: 'b8', type: 'enable-gzip' }],
          status: 'Inactive',
          modifiedAt: daysAgo(47)
        }
      ]
    })

  const rules = ref(seed())

  const phaseRules = computed(() => rules.value[phase.value])

  // Free-text search over the phase's rules — over WHAT THE ROW SHOWS (name,
  // description, status, the modifier's name), never over a field the reader cannot
  // see: a hit on a criterion the table does not render looks like a bug, not a match.
  // It narrows what is on screen, which is exactly why it also suspends reordering
  // below.
  const search = ref('')
  const visibleRules = computed(() => {
    const term = search.value.trim().toLowerCase()
    if (!term) return [...phaseRules.value]
    return phaseRules.value.filter((rule) =>
      [rule.name, rule.description, rule.status, rule.author].some((field) =>
        (field ?? '').toLowerCase().includes(term)
      )
    )
  })

  const narrowed = computed(() => visibleRules.value.length !== phaseRules.value.length)

  // ── The order, and its commit ─────────────────────────────────────────────
  // The baseline is the ORDER as last saved, both phases, as a plain list of ids —
  // it is the only thing a reorder changes, and comparing ids keeps an edit made in
  // the drawer (which commits itself) from also arming this bar.
  const orderOf = (value) =>
    JSON.stringify({
      request: value.request.map((rule) => rule.id),
      response: value.response.map((rule) => rule.id)
    })

  const savedOrder = ref(orderOf(rules.value))
  // The rows as they were at the last save, so Discard can put them back.
  let savedRows = { request: [...rules.value.request], response: [...rules.value.response] }

  const dirty = computed(() => orderOf(rules.value) !== savedOrder.value)
  const saving = ref(false)

  const saveOrder = async () => {
    if (saving.value) return
    saving.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      savedOrder.value = orderOf(rules.value)
      savedRows = { request: [...rules.value.request], response: [...rules.value.response] }
      toast.success('Rule order saved.')
    } catch (error) {
      toast.error('Could not save the rule order.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => saveOrder() }
      })
    } finally {
      saving.value = false
    }
  }

  // Restoring the arrays re-keys nothing, so the rows FLIP back to where they were
  // instead of snapping — a discard is a move like any other.
  const discardOrder = () => {
    rules.value = { request: [...savedRows.request], response: [...savedRows.response] }
  }

  // The shell marks this tab and asks before letting the reader leave it, because the
  // bar below sits in the same place as Main Settings' and neither tab can see the
  // other's pending work (../../lib/tab-dirty.js).
  useTabDirty(
    'rules-engine',
    { dirty, saving },
    { label: 'Rule order changed.', save: saveOrder, discard: discardOrder }
  )

  // ── Reordering ────────────────────────────────────────────────────────────
  // The list handed to the helper is the PHASE'S list, so a drag can never move a
  // rule across phases — which would silently change when it runs.
  //
  // THE FIRST RULE IS PINNED. A phase's first rule is where the phase STARTS: every
  // request that reaches this application is measured against it before anything else,
  // so it is part of the program's definition rather than a row that happens to be at
  // the top. It cannot be dragged, cannot be nudged, and nothing can be dropped above
  // it — one fact, enforced in one place (../../lib/drag-reorder.js), which is what
  // keeps the grip's disabled state, the two move buttons' and the drop indicator from
  // ever disagreeing about it.
  const PINNED_RULES = 1
  const canReorder = computed(() => !narrowed.value && phaseRules.value.length > PINNED_RULES + 1)
  const {
    canMove,
    isDragging,
    isDropTarget,
    onDragStart,
    onDragEnter,
    onDragEnd,
    drop,
    move,
    moveTo
  } = useDragReorder(() => rules.value[phase.value], {
    enabled: () => canReorder.value,
    pinned: () => PINNED_RULES
  })

  /**
   * Why a row's controls are inert, in the reader's words — the grip's tooltip, the
   * position field's, and the thing that decides whether either renders live at all.
   * Empty means it can move.
   *
   * THE SEARCH ANSWERS FIRST, because while the list is narrowed `index` is a position
   * in what is on SCREEN and not in the phase — so the pinned test below cannot be
   * trusted, and a single search hit would otherwise be told it is the rule that runs
   * first no matter where it actually sits.
   */
  const lockReason = (index) => {
    if (narrowed.value) return 'Clear the search to change the order rules run in.'
    if (index < PINNED_RULES) return 'The first rule runs first and stays first.'
    if (!canMove(index)) return 'There is no other rule in this phase to move it past.'
    return ''
  }

  // ── The position, typed ───────────────────────────────────────────────────
  // THE NUMBER IS THE CONTROL, not a label beside one. Drag and the two chevrons are
  // both single-step gestures: moving rule 24 to rule 3 is a hold-and-scroll or 21
  // clicks, and both of those get worse as the phase grows — while the reader already
  // knows the number they want. So the position cell is a field: type `3`, commit, and
  // the row travels there (FLIP-animated like any other move, arming the same save bar).
  //
  // ONE draft at a time, keyed by rule id rather than by index: the index is what the
  // commit CHANGES, so a draft held against it would belong to a different row the
  // moment the row moved. Every other row's field renders its own position, so the
  // column cannot show a stale number.
  const positionDraft = ref(null)

  /**
   * The rule's position IN THE PHASE — not its row number on screen. The two are the
   * same until a search narrows the list, and then they are not: the third hit of a
   * search is not rule 3, and a number field showing `3` for it would be the column
   * stating something false about the program. (The field is inert while narrowed, but
   * inert is not an excuse to be wrong.)
   */
  const rulePosition = (rule) => phaseRules.value.indexOf(rule) + 1

  const positionValue = (rule) =>
    positionDraft.value?.id === rule.id ? positionDraft.value.value : String(rulePosition(rule))

  const onPositionInput = (rule, value) => {
    positionDraft.value = { id: rule.id, value }
  }

  /**
   * Commit on Enter and on blur — the two ways a person says "that's the number". A
   * draft that is not a number is DISCARDED rather than reported: the field re-renders
   * from the row's real index, which is the correction, and an error under a cell that
   * shows the answer would be noise. Out-of-range numbers are clamped by `moveTo`.
   *
   * THE FIELD STEPS OUT OF THE WAY BEFORE THE ROW MOVES. A focused element inside the
   * moving row silently cancels the FLIP: `TransitionGroup` measures the row, then the
   * node is re-inserted at its new index, and Chrome's focus bookkeeping on that
   * re-insertion leaves nothing to interpolate — the row TELEPORTS, which is the exact
   * failure the animation exists to prevent, and it is invisible in review because the
   * row does end up in the right place. Measured on the Enter path: 1 sampled frame with
   * the field focused, 16 with it blurred first (the chevrons animate because a clicked
   * `IconButton` never held focus). So: blur, move, then put focus back on the same
   * field once it has arrived — `preventScroll`, so restoring focus cannot yank a long
   * list to the row's old position.
   */
  const commitPosition = (index, field) => {
    const draft = positionDraft.value
    positionDraft.value = null
    if (!draft) return
    const typed = Number.parseInt(draft.value, 10)
    if (!Number.isFinite(typed)) return
    field?.blur()
    const to = moveTo(index, typed)
    if (to === index || !field) return
    // Restored on the next tick — after the row's transform has been applied, which is
    // what the blur above bought, and measured not to cancel it (16 sampled frames with
    // the refocus, same as without). `nextTick` rather than the row's `transitionend`
    // because that event never fires under `prefers-reduced-motion`, and focus is not
    // something a motion preference may take away.
    nextTick(() => field.focus({ preventScroll: true }))
  }

  /** Escape abandons the edit — the field snaps back to where the row actually is. */
  const cancelPosition = () => {
    positionDraft.value = null
  }

  // ── Create and edit ───────────────────────────────────────────────────────
  // ONE drawer for both. `editingRule` is what tells it which it is; opening the
  // create clears it, so the two can never be confused for one another.
  const drawerOpen = ref(false)
  const editingRule = ref(null)

  const openCreate = () => {
    editingRule.value = null
    drawerOpen.value = true
  }

  const openRule = (rule) => {
    editingRule.value = rule
    drawerOpen.value = true
  }

  /**
   * Stamps a saved rule with WHO touched it and WHEN — the record the drawer emits is
   * the request body, and the modification is this side's fact. Writing it here means
   * the Last Modified column answers for a rule written a second ago exactly as it
   * does for one seeded weeks ago, instead of leaving a blank cell behind a save.
   */
  const stampModified = (rule) => {
    const person = authorAt(0)
    return { ...rule, modifiedAt: new Date(), author: person.name, authorAvatar: person.avatar }
  }

  const onCreated = (created) => {
    const rule = stampModified(created)
    // A new rule lands at the END of its phase: it runs last until someone moves it,
    // which is the only honest default for an ordered list.
    rules.value[rule.phase] = [...rules.value[rule.phase], rule]
    savedOrder.value = orderOf(rules.value)
    savedRows = { request: [...rules.value.request], response: [...rules.value.response] }
    phase.value = rule.phase
  }

  const onUpdated = (saved) => {
    const rule = stampModified(saved)
    const previous = editingRule.value
    // The phase is editable in the drawer, so a save can MOVE the rule between the
    // two lists. Removing it from wherever it was and appending it to the phase it
    // now belongs to is what keeps the two programs correct.
    for (const key of ['request', 'response']) {
      rules.value[key] = rules.value[key].filter((item) => item.id !== rule.id)
    }
    if (previous && previous.phase === rule.phase) {
      // Same phase: put it back where it was, so a content edit does not silently
      // reorder the program.
      const index = savedRows[rule.phase].findIndex((item) => item.id === rule.id)
      const next = [...rules.value[rule.phase]]
      next.splice(index < 0 ? next.length : index, 0, rule)
      rules.value[rule.phase] = next
    } else {
      rules.value[rule.phase] = [...rules.value[rule.phase], rule]
      phase.value = rule.phase
    }
    savedOrder.value = orderOf(rules.value)
    savedRows = { request: [...rules.value.request], response: [...rules.value.response] }
    editingRule.value = null
  }

  // Opened from the page's tab row (ApplicationDetail).
  defineExpose({ openCreate })
</script>

<template>
  <!-- `flex-1` + a growing content section is what puts the commit bar ON THE BOTTOM.
       The bar is `sticky bottom-0`, and sticky can only pin inside its own parent's
       box: with five rules the page is far shorter than the scroll region, so the
       column ended at the last row and the bar floated there, mid-screen, with dead
       space under it (measured: 243px above the fold). Filling the region and letting
       the section absorb the slack gives sticky something to stick to — and once the
       list is long enough to scroll, the same rule pins the bar over the rows.

       `pb-0` on the boundary, and the inset moved onto the section: sticky cannot leave
       its parent's padding box, so the boundary's own bottom padding held the bar 24px
       off the edge. The section carries that inset instead, which is also what keeps
       the last row clear of the bar once the list does scroll. -->
  <div class="layout-column layout-boundary flex min-w-0 flex-1 flex-col pb-0">
    <PageHeading
      title="Rules Engine"
      description="Conditional rules applied to requests and responses. Rules run top to bottom, so their order is their behavior."
      size="small"
    />

    <!-- The page's parent section. It holds one band here — the controls row over
         the table it narrows, at the GROUP step — and spaces whatever sits inside
         it at --layout-section-gap. -->
    <section
      class="layout-section-start flex min-w-0 flex-1 flex-col gap-(--layout-section-gap) pb-(--layout-boundary-end)"
    >
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <!-- The band's CONTROLS: the phase switch and the search that narrows it,
             above the card — the same row every list in the console opens with. The
             phase leads because it selects WHICH list the search then narrows. -->
        <ControlsHeader>
          <SegmentedButton
            v-model="phase"
            :options="phases"
            aria-label="Rule phase"
            class="shrink-0"
          />
          <InputText
            v-model="search"
            size="large"
            :placeholder="`Search ${phaseLabel.toLowerCase()} rules`"
            aria-label="Search rules"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </ControlsHeader>

        <!-- Said ONCE, above the rows, rather than as a disabled tooltip repeated on
             every grip: the reason is the same for the whole list. -->
        <Message
          v-if="narrowed"
          severity="info"
          label="Reordering is unavailable while a search narrows the list. Clear the search to change the order rules run in."
        />

        <CardBox :padded="false">
          <template #content>
            <!-- Hand-composed: this page owns the row element so the row can be the
                 drop target and the FLIP subject. `enable-sorting` is deliberately
                 absent — see the top of this file. -->
            <Table :border="false">
              <Table.Header>
                <Table.Row>
                  <!-- Wider than a number needs, because the number IS a control: the
                       position field plus the grip and the two nudges. -->
                  <Table.HeadCell
                    align="center"
                    class="w-48 flex-none!"
                  >
                    <span class="sr-only">Order</span>
                    <span aria-hidden="true">#</span>
                  </Table.HeadCell>
                  <Table.HeadCell principal>Name</Table.HeadCell>
                  <Table.HeadCell :grow="3">Description</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell :grow="2">Last Modified</Table.HeadCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <!-- THE PHASE SWAPS AS ONE BLOCK. Request and Response are two different
                     programs, so switching between them is a REPLACEMENT, not a change to
                     this list — and animating it as a change was exactly what made the
                     switch read as broken: every request row played its own leave while
                     every response row played its own enter and the FLIP moved whatever
                     survived, five little journeys for one press of a segmented button.
                     The keyed wrapper below is what turns that back into one gesture (see
                     ../../lib/list-morph.js). The key has to sit on this plain ELEMENT —
                     keying a component instead renders the incoming block blank under
                     `mode: out-in`. -->
                <Transition v-bind="BLOCK_SWAP">
                  <div
                    :key="phase"
                    class="w-full"
                  >
                    <!-- THE MOVE, MADE VISIBLE. `TransitionGroup` measures each keyed row
                         before and after the splice and animates the difference, so a
                         reorder reads as the row travelling to its new index rather than
                         as the whole list redrawing. `relative`, because a leaving row is
                         taken out of flow so the survivors can close the gap immediately.

                         It carries `Table.Body`'s own last-child rule because it is now
                         the element the rows are children of, and that rule is what drops
                         the final row's border onto the card edge. -->
                    <TransitionGroup
                      tag="div"
                      class="relative flex w-full flex-col [&>*:last-child_[role=row]]:border-b-0"
                      v-bind="MORPH_TRANSITION"
                    >
                      <!-- THE FLIP SUBJECT IS THIS WRAPPER, not `Table.Row`. Two reasons,
                       and the second is the one that actually decides it:

                         The row already ships its own `transition-colors` for the
                           hover fill, and Vue PROBES the move class before using it —
                           a child that declares its own `transition-property` can
                           silently switch the whole move off.
                         The drag state belongs here anyway. The wrapper is the drop
                           zone and the thing that dims and outlines while lifted, so
                           `DRAG_ROW_CLASS` (which carries its own transition) sits on
                           it rather than fighting the row for the same property. -->
                      <div
                        v-for="(rule, index) in visibleRules"
                        :key="rule.id"
                        data-drag-row
                        :data-dragging="isDragging(index) || null"
                        :data-drop="isDropTarget(index) || null"
                        :class="['w-full', DRAG_ROW_CLASS]"
                        @dragenter.prevent="onDragEnter(index)"
                        @dragover.prevent
                        @drop="drop(index)"
                      >
                        <!-- THE ROW OPENS THE RULE, from anywhere that is not a
                             control: the same drawer the name cell opens, so the
                             whole row is the target the reader aims at rather than
                             one word of it. The order cell stops the click (below) —
                             a position typed or a chevron nudged is that control's
                             click, not a request to open the form. -->
                        <Table.Row @click="openRule(rule)">
                          <!-- THE ORDER CELL: the position — typed — the grip, and the two
                         buttons that nudge it one step without a pointer. All four drive
                         one `move`/`moveTo` and all four read one `canMove`, so a rule
                         that cannot go up has a dim chevron, a dim grip, a disabled
                         position field and a drop indicator that refuses to land there,
                         rather than four controls with four opinions. -->
                          <Table.Cell
                            align="center"
                            class="w-48 flex-none! gap-(--spacing-xxs)"
                            @click.stop
                          >
                            <!-- THE POSITION IS A FIELD, and it is the only control here
                                 that crosses a long list in one action. Committed on Enter
                                 or blur, abandoned on Escape; the text is selected on focus
                                 so typing REPLACES the number instead of appending to it
                                 (`24` + `3` = position 243, clamped to the last row — the
                                 one way this control could surprise someone).
                                 `InputText` passes `$attrs` through to its real `<input>`,
                                 which is what lets the key and focus handlers land there —
                                 and the WIDTH sits on the WRAPPER below: `Tooltip`'s
                                 trigger appends `w-fit` and `InputText`'s root appends
                                 `w-full` AFTER the class each is passed, and this package
                                 composes classes without tailwind-merge — so a width handed
                                 to either one loses to the one already there. Measured: the
                                 field came out 168px wide instead of 56. -->
                            <span class="w-14 shrink-0 [&>span]:w-full">
                              <Tooltip
                                key="position-locked"
                                v-if="lockReason(index)"
                                :text="lockReason(index)"
                              >
                                <InputText
                                  :model-value="positionValue(rule)"
                                  size="small"
                                  disabled
                                  class="[&_input]:text-center [&_input]:tabular-nums"
                                  :aria-label="`Position ${rulePosition(rule)}. ${lockReason(index)}`"
                                />
                              </Tooltip>
                              <Tooltip
                                key="position"
                                v-else
                                text="Type a position to move the rule there"
                              >
                                <InputText
                                  :model-value="positionValue(rule)"
                                  size="small"
                                  inputmode="numeric"
                                  class="[&_input]:text-center [&_input]:tabular-nums"
                                  :aria-label="`Position of ${rule.name}. Type a number from ${PINNED_RULES + 1} to ${visibleRules.length} to move it.`"
                                  @update:model-value="onPositionInput(rule, $event)"
                                  @focus="$event.target.select()"
                                  @keydown.enter.prevent="commitPosition(index, $event.target)"
                                  @keydown.esc.prevent="cancelPosition()"
                                  @blur="commitPosition(index, $event.target)"
                                />
                              </Tooltip>
                            </span>
                            <!-- The grip is the drag source and the keyboard control at
                           once: hold it to drag, or focus it and press the arrows.
                           All three controls are the same outlined `IconButton`, so the
                           row reads as one cluster instead of a glyph next to two
                           buttons — and every one of them carries a tooltip that says
                           what it does, or why it is inert.

                           The drag wiring sits on the `Tooltip`, not on the button:
                           `IconButton` does not forward `$attrs`, but `Tooltip`'s
                           trigger span does — so `draggable` lands on the span, and the
                           arrow keys reach it by bubbling up from the focused button. -->
                            <Tooltip
                              key="grip-locked"
                              v-if="lockReason(index)"
                              :text="lockReason(index)"
                            >
                              <IconButton
                                icon="pi pi-bars"
                                kind="outlined"
                                size="small"
                                disabled
                                :aria-label="`${rule.name} cannot be reordered. ${lockReason(index)}`"
                              />
                            </Tooltip>
                            <Tooltip
                              key="grip"
                              v-else
                              text="Drag to reorder, or use the arrow keys"
                              draggable="true"
                              class="cursor-grab active:cursor-grabbing"
                              @dragstart="onDragStart(index, $event)"
                              @dragend="onDragEnd"
                              @keydown.up.prevent="move(index, -1)"
                              @keydown.down.prevent="move(index, 1)"
                            >
                              <IconButton
                                icon="pi pi-bars"
                                kind="outlined"
                                size="small"
                                class="cursor-grab active:cursor-grabbing"
                                :aria-label="`Reorder ${rule.name}. Position ${index + 1} of ${visibleRules.length}. Use the arrow keys to move it.`"
                              />
                            </Tooltip>
                            <Tooltip text="Move up">
                              <IconButton
                                icon="pi pi-chevron-up"
                                kind="outlined"
                                size="small"
                                :aria-label="`Move ${rule.name} up`"
                                :disabled="!canMove(index, -1)"
                                @click="move(index, -1)"
                              />
                            </Tooltip>
                            <Tooltip text="Move down">
                              <IconButton
                                icon="pi pi-chevron-down"
                                kind="outlined"
                                size="small"
                                :aria-label="`Move ${rule.name} down`"
                                :disabled="!canMove(index, 1)"
                                @click="move(index, 1)"
                              />
                            </Tooltip>
                          </Table.Cell>
                          <!-- The way IN. `clickable` is TableCell's own affordance for a
                         cell that owns its click, so the name reads as the link it is
                         and the click never also fires on the row. -->
                          <Table.Cell
                            principal
                            clickable
                          >
                            <button
                              type="button"
                              class="min-w-0 cursor-pointer truncate rounded-(--shape-button) text-left outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                              @click="openRule(rule)"
                            >
                              {{ rule.name }}
                            </button>
                          </Table.Cell>
                          <!-- What the author wrote for whoever reads this rule next. Not
                         the criteria: those are a program, and a truncated fragment of
                         one says less than the sentence a person wrote about it. -->
                          <Table.Cell :grow="3">
                            <span class="min-w-0 truncate">{{ rule.description }}</span>
                          </Table.Cell>
                          <!-- Status is a chip, Active/Inactive, the same pair every console
                         list reads (Applications.vue) — never bare text in a cell. -->
                          <Table.Cell>
                            <Tag
                              :label="rule.status"
                              :severity="rule.status === 'Active' ? 'success' : 'secondary'"
                              size="medium"
                            />
                          </Table.Cell>
                          <!-- WHO changed it and WHEN, in one column: the modifier's avatar
                         (their name on its tooltip) plus the relative time — the same
                         cell every console list ends on (ui/LastModifiedCell.vue). The
                         face is why there is no separate "Created by" column. -->
                          <Table.Cell :grow="2">
                            <LastModifiedCell
                              :author="rule.author"
                              :avatar-src="rule.authorAvatar"
                              :date="rule.modifiedAt"
                            />
                          </Table.Cell>
                        </Table.Row>
                      </div>
                    </TransitionGroup>

                    <!-- Two different empties, because they need two different answers:
                         a phase with no rules at all is offered the create; a search
                         that matched nothing is offered nothing but the fact. Both sit
                         INSIDE the keyed block, so an empty phase arrives and leaves as
                         the same one gesture a populated one does. -->
                    <div
                      v-if="!visibleRules.length"
                      class="p-(--spacing-lg)"
                    >
                      <EmptyState
                        v-if="!phaseRules.length"
                        size="medium"
                        :title="`No ${phaseLabel.toLowerCase()} rules yet`"
                        :description="`Create a rule to act on every ${phaseLabel.toLowerCase()} this application handles.`"
                      />
                      <p
                        v-else
                        class="py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                      >
                        No rules match "{{ search }}".
                      </p>
                    </div>
                  </div>
                </Transition>
              </Table.Body>
            </Table>
          </template>
        </CardBox>
      </section>
    </section>

    <!-- MOVING A ROW IS AN UNSAVED EDIT, so it commits through the same bar as every
         other settings surface: it arrives on the first move, Discard puts the order
         back, and the bar brings its own leave guard so the order cannot be walked
         away from by accident. -->
    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      :route-guard="false"
      label="Rule order changed."
      hint="Saving applies the new order to every request this application handles."
      @save="saveOrder"
      @discard="discardOrder"
    />

    <!-- ONE drawer, create and edit: `rule` is null for a create and the record for
         an edit. -->
    <CreateRuleDrawer
      v-model:open="drawerOpen"
      :rule="editingRule"
      @created="onCreated"
      @updated="onUpdated"
    />
  </div>
</template>
