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
  // rule's answer for editing inside a resource. The table shows a derived SUMMARY of
  // those criteria; the drawer is where the model itself is read and changed.
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
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
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
  // The criteria are the STRUCTURED model the drawer edits, not a display string.
  // That is what lets a row be opened, changed and closed with the table's own
  // summary following the edit; a hand-written `'host = www.*'` would go stale the
  // moment anyone touched the rule.
  const condition = (variable, operator, argument = '') => ({
    id: `${variable}-${operator}-${argument}`,
    join: null,
    variable,
    operator,
    argument
  })

  const seed = () => ({
    request: [
      {
        id: 're-maintenance',
        name: 'Maintenance page',
        description: 'Serves the maintenance page while the header is set.',
        phase: 'request',
        criteria: [{ id: 'c1', conditions: [condition('header', 'matches', 'x-maintenance')] }],
        behaviors: [{ id: 'b1', type: 'deliver' }],
        status: 'Inactive'
      },
      {
        id: 're-www',
        name: 'Redirect www',
        description: 'Sends the www host to the apex domain.',
        phase: 'request',
        criteria: [{ id: 'c2', conditions: [condition('host', 'is-equal', 'www.*')] }],
        behaviors: [{ id: 'b2', type: 'redirect-301' }],
        status: 'Active'
      },
      {
        id: 're-gateway',
        name: 'API gateway',
        description: 'Routes API traffic to the gateway origin.',
        phase: 'request',
        criteria: [{ id: 'c3', conditions: [condition('path', 'matches', '/api/*')] }],
        behaviors: [{ id: 'b3', type: 'run-function' }],
        status: 'Active'
      },
      {
        id: 're-docs',
        name: 'Docs rewrite',
        description: 'Rewrites the docs path onto the documentation origin.',
        phase: 'request',
        criteria: [{ id: 'c4', conditions: [condition('path', 'matches', '/docs/*')] }],
        behaviors: [{ id: 'b4', type: 'deliver' }],
        status: 'Active'
      },
      {
        id: 're-remote-port',
        name: 'Add remote port header',
        description: 'Adds the client port to every request reaching the origin.',
        phase: 'request',
        criteria: [{ id: 'c5', conditions: [condition('path', 'matches', '/*')] }],
        behaviors: [{ id: 'b5', type: 'deliver' }],
        status: 'Active'
      }
    ],
    response: [
      {
        id: 're-cache-bypass',
        name: 'Cache bypass',
        description: 'Keeps API responses out of the cache.',
        phase: 'response',
        criteria: [{ id: 'c6', conditions: [condition('path', 'matches', '/api')] }],
        behaviors: [{ id: 'b6', type: 'set-cache-policy' }],
        status: 'Active'
      },
      {
        id: 're-security-headers',
        name: 'Security headers',
        description: 'Adds the security header set to successful responses.',
        phase: 'response',
        criteria: [{ id: 'c7', conditions: [condition('status', 'is-equal', '200')] }],
        behaviors: [{ id: 'b7', type: 'deliver' }],
        status: 'Active'
      },
      {
        id: 're-compress',
        name: 'Compress assets',
        description: 'Compresses script bundles on the way out.',
        phase: 'response',
        criteria: [{ id: 'c8', conditions: [condition('path', 'matches', '*.js')] }],
        behaviors: [{ id: 'b8', type: 'deliver' }],
        status: 'Inactive'
      }
    ]
  })

  const rules = ref(seed())

  // The operator's own words, so the summary reads as the rule reads in the drawer.
  const OPERATOR_LABELS = {
    'is-equal': '=',
    'is-not-equal': '≠',
    matches: '~',
    'does-not-match': '!~',
    'starts-with': '^',
    exists: 'exists'
  }

  /**
   * The table's Criteria cell, derived from the structured model rather than stored
   * beside it — so it cannot disagree with what the drawer just saved. Long rules
   * state their first condition and count the rest; the row is a summary, and the
   * drawer is where the whole thing is read.
   */
  const criteriaSummary = (rule) => {
    const conditions = (rule.criteria ?? []).flatMap((group) => group.conditions)
    if (!conditions.length) return '—'
    const [first, ...rest] = conditions
    const head = [first.variable, OPERATOR_LABELS[first.operator] ?? first.operator, first.argument]
      .filter(Boolean)
      .join(' ')
    return rest.length ? `${head} +${rest.length} more` : head
  }

  const phaseRules = computed(() => rules.value[phase.value])

  // Free-text search over the phase's rules. It narrows what is on screen, which is
  // exactly why it also suspends reordering below.
  const search = ref('')
  const visibleRules = computed(() => {
    const term = search.value.trim().toLowerCase()
    if (!term) return [...phaseRules.value]
    return phaseRules.value.filter((rule) =>
      [rule.name, criteriaSummary(rule), rule.status].some((field) =>
        field.toLowerCase().includes(term)
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
  const { canMove, isDragging, isDropTarget, onDragStart, onDragEnter, onDragEnd, drop, move } =
    useDragReorder(() => rules.value[phase.value], {
      enabled: () => canReorder.value,
      pinned: () => PINNED_RULES
    })

  /**
   * Why a row's controls are inert, in the reader's words — the grip's tooltip, and the
   * thing that decides whether the grip renders live at all. Empty means it can move.
   */
  const lockReason = (index) => {
    if (index < PINNED_RULES) return 'The first rule runs first and stays first.'
    if (narrowed.value) return 'Clear the search to change the order rules run in.'
    if (!canMove(index)) return 'There is no other rule in this phase to move it past.'
    return ''
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

  const onCreated = (rule) => {
    // A new rule lands at the END of its phase: it runs last until someone moves it,
    // which is the only honest default for an ordered list.
    rules.value[rule.phase] = [...rules.value[rule.phase], rule]
    savedOrder.value = orderOf(rules.value)
    savedRows = { request: [...rules.value.request], response: [...rules.value.response] }
    phase.value = rule.phase
  }

  const onUpdated = (rule) => {
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
      class="layout-section-start flex min-w-0 flex-1 flex-col gap-[var(--layout-section-gap)] pb-[var(--layout-boundary-end)]"
    >
      <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
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
            class="min-w-36 grow basis-[var(--container-2xs)]"
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
                  <Table.HeadCell
                    align="center"
                    class="w-32 !flex-none"
                  >
                    <span class="sr-only">Order</span>
                    <span aria-hidden="true">#</span>
                  </Table.HeadCell>
                  <Table.HeadCell principal>Name</Table.HeadCell>
                  <Table.HeadCell :grow="2">Criteria</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
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
                        <Table.Row>
                          <!-- THE ORDER CELL: the position, the grip, and the two buttons that
                         do the same thing without a pointer. All three drive one `move`,
                         and all three read one `canMove` — so a rule that cannot go up
                         has a dim chevron, a dim grip and a drop indicator that refuses
                         to land there, rather than three controls with three opinions. -->
                          <Table.Cell
                            align="center"
                            class="w-32 !flex-none gap-[var(--spacing-xxs)]"
                          >
                            <span class="w-4 text-body-xs tabular-nums text-[var(--text-muted)]">
                              {{ index + 1 }}
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
                              class="min-w-0 cursor-pointer truncate rounded-[var(--shape-button)] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
                              @click="openRule(rule)"
                            >
                              {{ rule.name }}
                            </button>
                          </Table.Cell>
                          <Table.Cell :grow="2">
                            <span class="min-w-0 truncate font-code text-label-code-sm">
                              {{ criteriaSummary(rule) }}
                            </span>
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
                      class="p-[var(--spacing-lg)]"
                    >
                      <EmptyState
                        v-if="!phaseRules.length"
                        size="medium"
                        :title="`No ${phaseLabel.toLowerCase()} rules yet`"
                        :description="`Create a rule to act on every ${phaseLabel.toLowerCase()} this application handles.`"
                      />
                      <p
                        v-else
                        class="py-[var(--spacing-lg)] text-center text-body-sm text-[var(--text-muted)]"
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
