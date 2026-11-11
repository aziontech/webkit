# RulesList (`platform/view/rules-list`)

> An ordered list of rules grouped by phase, the Rules tab of an application or a firewall. A `PageHeader` with Documentation and Add Rule sits over a search `Input` and a flush `Card` holding an `Accordion` with one item per phase (Request, Response), each trigger reading the phase and its rule count and each panel a composed `Table` with Order, Name, Description, Status and Last modified. The Order cell carries a position `Input` (type a number and press Enter), a grip `IconButton` that drags the row or moves it with the up and down arrow keys, and Move up and Move down `IconButton`s; every move is announced in a polite status region and focus follows the moved rule. A leading locked rule (the default rule) keeps first place and cannot be turned off; a search turns reordering off and says so in an info `Alert`. The Status cell is a `Switch` that turns a rule on or off without losing its place. Any change raises a `SaveBar` with Discard and Review changes; Review changes opens a `Dialog` listing, per phase, every rule that moves (from and to) and every rule turned on or off, with Cancel and Save, and a danger `Alert` in the dialog when the save fails. A success toast confirms the saved order. Built from `PageHeader`, `Button`, `Input`, `Alert`, `Card`, `Accordion`, `Table` and its parts, `IconButton`, `Tooltip`, `Tag`, `Switch`, `Skeleton`, `EmptyState`, `SaveBar`, `Dialog` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter` and `Toaster`.

- Surface: product
- Source: `blocks/platform/view/rules-list/rules-list.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/rules-list")`
- Components: [Accordion](../../../components/accordion.md), [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Dialog](../../../components/dialog.md), `DialogClose`, `DialogContent`, `DialogDescription`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, [EmptyState](../../../components/empty-state.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [SaveBar](../../../components/save-bar.md), [Skeleton](../../../components/skeleton.md), [Switch](../../../components/switch.md), [Table](../../../components/table.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-errors`

## Asked as

rules list; rules engine list; reorder rules; rule order; drag and drop reorder; firewall rules; request and response phases; review changes; enable disable rule; lista de regras; ordem das regras; reordenar regras; regras do firewall; fases de requisição e resposta; lista de reglas; reordenar reglas

An ordered list of rules grouped by phase: the Rules tab of an application (Request and Response phases) or a firewall (Request only). Order is behavior here, so the list is built to change the order safely: drag, keys or a typed position move a rule, every move is announced, and nothing runs in the new order until the user reviews the changes and saves.

## When to use

- A resource runs an ordered program of rules and the user needs to see it, reorder it and turn rules on or off: application rules engine, firewall rules, routing rules.
- Rules split into phases that never interleave (request and response), each with its own order.
- Changes to the order must be reviewed before they apply to live traffic.

## When not to use

- Records whose order does not matter: use `platform/view/table-view`.
- Writing or editing one rule's criteria and behaviors: use `platform/edit/rule-builder`, which this list opens from Add Rule and from a rule's name.
- Fewer than two rules that can move: show the list without the Order controls.

## Building blocks

### A. Header — `PageHeader`, `Button` (required)

`PageHeader` at `size="small"` titled Rules, with a one-sentence description that says order is behavior and that an inactive rule keeps its place. Actions: outlined Documentation, then outlined Add Rule on the outer edge.

### B. Search — `Input`, `Alert` (required)

A medium `Input` with a search icon, named "Search rules", matching name, description and author. While it holds text, an info `Alert` says reordering is off and how to turn it back on; phases with matches open, and each trigger reads "n of total".

### C. Phases — `Card`, `Accordion` (required)

A flush `Card` holding an `Accordion` with `type="multiple"`, `size="large"`, the arrow on the start side, one item per phase, all open by default. Each trigger is an `h2` reading "Request phase" with the rule count in muted tabular figures. A resource with a single phase keeps the same anatomy with one item.

### D. Rules table — `Table`, `Table.Header`, `Table.Row`, `Table.HeadCell`, `Table.Cell`, `Tag`, `Switch` (required)

A composed `Table` per phase: Order (fixed width), Name (principal, a link that opens the rule in the rule builder, with a secondary "Default" `Tag` on a locked rule), Description (muted, truncated), Status (a `Switch` named "Run <rule>" beside a visible Active or Inactive, inside a 40 px label) and Last modified ("2 days ago by Maya Chen").

### E. Order controls — `Input`, `IconButton`, `Tooltip` (required)

In the Order cell, in this order: a small position `Input` (numeric, centered; Enter or blur moves the rule there, Escape cancels), a grip `IconButton` (`pi pi-bars`) that is the drag handle and moves the rule one place with the up and down arrow keys, and Move up and Move down `IconButton`s. Each control is named after its rule and phase, and its `Tooltip` repeats the action or, when it is disabled, the reason. Leading locked rules are pinned: their controls are disabled and nothing can move above them. After a move, focus returns to the same control on the moved rule (the grip when that control is now disabled), and a polite status region says "Docs rewrite moved to position 3 of 5 in the Request phase."

### F. Save bar and review — `SaveBar`, `Button`, `Dialog`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Alert`, `Toaster` (required)

Any move or status change raises a `SaveBar` counting the changes, with Discard (outlined, restores the saved order and announces it) and Review changes (primary). Review changes opens a medium `Dialog` titled "Review changes": a description of what saving does, then one section per phase with an `h3` and a list of lines such as "Docs rewrite moves from position 5 to 3." and "Maintenance page is turned on." The footer has Cancel and Save; Save shows its loading state and the dialog cannot be dismissed while saving. On success the dialog closes and a success toast says "Rule order saved." On failure the dialog stays open with a danger `Alert` at the top saying the rules still run in the saved order, and Save becomes Save again.

### G. States — `Skeleton`, `EmptyState` (required)

Loading: triggers read Loading, the search is disabled and each table shows three skeleton rows shaped like its columns. Empty phase: a small `EmptyState` ("No request rules yet") with an outlined Add Rule. No match in a phase: one muted line, "No request rule matches “cache”."

## Do

- Keep phases separate: a rule moves only within its phase, and drag ignores drops on another phase.
- Offer every way to move: drag for a pointer, arrow keys on the grip, Move up and Move down for touch and switch access, and a typed position for long lists.
- Say why a control is disabled, in its accessible name and its tooltip.
- Collect changes and apply them only after Review changes and Save; the review lists every rule whose position changes, not only the one the user dragged.
- Let a rule be turned off in place; an inactive rule keeps its position and is skipped at runtime.
- Follow `skills/webkit-tables` for the table, `skills/webkit-form` for the save bar and `skills/webkit-errors` for the failed save.

## Don't

- Don't save on every drop; one wrong drag would reorder live traffic.
- Don't allow reordering while a search hides rows; positions would be ambiguous.
- Don't let anything move above a locked default rule, or turn it off.
- Don't put the review in a toast or a popover; it is a decision with a list to read.
- Don't offer drag as the only way to reorder.

## Copy

- **Phase triggers:** "Request phase", "Response phase", with "5 rules" or "2 of 5" beside.
- **Order control names:** "Reorder Docs rewrite, position 5 of 5 in the Request phase. Use the up and down arrow keys to move it.", "Move Docs rewrite up".
- **Disabled reasons:** "The default rule runs first and stays first.", "Clear the search to change the order rules run in.", "There is no other rule in this phase to move it past."
- **Announcements:** "Docs rewrite moved to position 3 of 5 in the Request phase.", "Changes discarded. The rules are back in their saved order."
- **Save bar:** "3 changes to the rules, not saved yet." with Discard and Review changes.
- **Review lines:** "<Rule> moves from position 5 to 3.", "<Rule> is turned on."
- **Failure:** "The new order wasn't saved. The rules still run in the saved order; save again to apply it."
- **Success toast:** "Rule order saved." with "The application runs its rules in the new order."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Each phase is a disclosure: the trigger is a button inside an `h2` with `aria-expanded`, and the panel is a region named by it.
- Every Order control has a name that includes the rule and the phase; disabled controls include the reason.
- Keyboard: Tab reaches the position field, grip, Move up, Move down, the rule link and its switch, in that order; the grip moves the rule with Up and Down; Enter in the position field commits and Escape cancels. Focus follows the moved rule.
- Moves and discards are announced once in a polite `role="status"` region that exists from the first render.
- The `Switch` is named "Run <rule>"; its visible Active or Inactive text is hidden from the accessibility tree so the state is read once, from `aria-checked`.
- The review dialog traps focus, returns it to Review changes on close, and is not dismissible while saving; the failure `Alert` is read when it appears.
- Drop targets show a 2 px accent line and the dragged row fades; transitions respect reduced motion.

## States

- Application: Request and Response phases, a locked Default rule first in Request, one inactive rule per phase.
- Firewall: one Request phase, every rule movable.
- ReviewChanges: two moves and one status change, the save bar and the review dialog open.
- SaveFailed: the review dialog open with the failure `Alert` and Save again.
- Searching: "cache" typed, reordering off with its `Alert`, phases reading "n of total".
- Empty: a firewall with no rules, the Request phase showing its `EmptyState`.
- Loading: skeleton rows in each phase.

## Related

- `platform/edit/rule-builder` — the drawer that adds or edits one rule.
- `platform/view/table-view` — lists whose order does not matter.
- `platform/states/form-error` — the failed-save `Alert` pattern the review dialog follows.
- `platform/view/waf-tuning` — the WAF tuning list a firewall's WAF rule links to.

## Variants

- `Application` — primary (the code below)
- `Firewall` — A firewall's rules: one Request phase, five rules and no locked rule, so every rule moves; the page says rules run until one refuses the request.
- `ReviewChanges` — After two moves and one rule turned on: the SaveBar counts the changes and the Review changes dialog is open, listing Docs rewrite moving from 5 to 3 (and the rules it pushed down), Maintenance page turned on, and Security headers moving to the top of the Response phase.
- `SaveFailed` — The same changes after a failed save: the dialog stays open with a danger Alert saying the rules still run in the saved order, and Save reads Save again; the next attempt saves and closes the dialog with the success toast.
- `Searching` — A search for cache narrows both phases to their matches, the counts read n of total, an info Alert says reordering is off while searching, and every Order control is disabled with the reason in its name and tooltip.
- `Empty` — A firewall with no rules: the Request phase panel shows a small EmptyState with Add Rule instead of the table.
- `Loading` — While the rules load: both phases read Loading, the search is disabled, and each table shows three skeleton rows shaped like the columns.

Each variant is the same screen in another state: `get_pattern("platform/view/rules-list", { variant })`, or the file under `blocks/platform/view/rules-list/variants/`.

## Code (`Application`)

```vue
<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  const SUBJECT = 'application'
  const PAGE_DESCRIPTION =
    'Rules run top to bottom within each phase, so their order is their behavior. Turn a rule off to skip it without losing its place.'
  const PHASES = [
    { value: 'request', label: 'Request' },
    { value: 'response', label: 'Response' }
  ]

  const rule = (id, name, description, phase, author, modified, options = {}) => ({
    id,
    name,
    description,
    phase,
    author,
    modified,
    active: options.active ?? true,
    locked: options.locked ?? false
  })

  const seed = () => ({
    request: [
      rule(
        're-default',
        'Default rule',
        'Sends every request to the origin when no other rule matches first.',
        'request',
        'Maya Chen',
        '3 months ago',
        { locked: true }
      ),
      rule(
        're-maintenance',
        'Maintenance page',
        'Serves the maintenance page while the maintenance header is set.',
        'request',
        'Leo Park',
        '1 month ago',
        { active: false }
      ),
      rule(
        're-www',
        'Redirect www',
        'Sends the www host to the apex domain.',
        'request',
        'Ana Ruiz',
        '12 days ago'
      ),
      rule(
        're-gateway',
        'API gateway',
        'Sends API traffic to the gateway service, through the auth check.',
        'request',
        'Maya Chen',
        '2 days ago'
      ),
      rule(
        're-docs',
        'Docs rewrite',
        'Rewrites the docs path and caches it as a static asset.',
        'request',
        'Sam Okafor',
        '3 weeks ago'
      )
    ],
    response: [
      rule(
        're-cache-bypass',
        'Cache bypass',
        'Keeps API responses out of the cache.',
        'response',
        'Leo Park',
        '5 days ago'
      ),
      rule(
        're-security-headers',
        'Security headers',
        'Adds the security header set to successful responses.',
        'response',
        'Ana Ruiz',
        '9 days ago'
      ),
      rule(
        're-compress',
        'Compress assets',
        'Compresses script bundles on the way out.',
        'response',
        'Sam Okafor',
        '7 weeks ago',
        { active: false }
      )
    ]
  })

  const INITIAL_EDITS = []
  const INITIAL_SEARCH = ''
  const INITIAL_LOADING = false
  const REVIEW_ON_START = false
  const FAILED_ON_START = false
  const SAVE_FAILURES = 0

  const rules = reactive(seed())
  const phaseLabel = (phase) => PHASES.find((item) => item.value === phase)?.label ?? phase

  const snapshot = () => ({
    order: Object.fromEntries(PHASES.map(({ value }) => [value, rules[value].map((r) => r.id)])),
    active: Object.fromEntries(
      PHASES.flatMap(({ value }) => rules[value].map((r) => [r.id, r.active]))
    )
  })
  const saved = ref(snapshot())

  for (const edit of INITIAL_EDITS) {
    const list = rules[edit.phase]
    const from = list.findIndex((item) => item.id === edit.id)
    if (from < 0) continue
    if (edit.to !== undefined) list.splice(edit.to, 0, ...list.splice(from, 1))
    if (edit.active !== undefined)
      list[list.findIndex((item) => item.id === edit.id)].active = edit.active
  }

  const loading = ref(INITIAL_LOADING)
  const search = ref(INITIAL_SEARCH)
  const searching = computed(() => search.value.trim().length > 0)
  const matches = (item) => {
    const term = search.value.trim().toLowerCase()
    if (!term) return true
    return [item.name, item.description, item.author].some((field) =>
      field.toLowerCase().includes(term)
    )
  }

  const openPhases = ref(PHASES.map((item) => item.value))
  watch(search, () => {
    if (!searching.value) return
    const hits = PHASES.filter(({ value }) => rules[value].some(matches)).map(({ value }) => value)
    openPhases.value = [...new Set([...openPhases.value, ...hits])]
  })

  const groups = computed(() =>
    PHASES.map((phase) => {
      const list = rules[phase.value]
      return {
        ...phase,
        total: list.length,
        rows: list.map((item, index) => ({ item, index })).filter(({ item }) => matches(item))
      }
    })
  )

  const saving = ref(false)
  const pinned = (phase) => {
    const list = rules[phase]
    let count = 0
    while (count < list.length && list[count].locked) count += 1
    return count
  }
  const canReorder = (phase) =>
    !searching.value && !saving.value && rules[phase].length - pinned(phase) > 1
  const canMove = (phase, index, direction) => {
    if (!canReorder(phase) || index < pinned(phase)) return false
    const to = index + direction
    return to >= pinned(phase) && to < rules[phase].length
  }
  const lockReason = (phase, item) => {
    if (item.locked) return 'The default rule runs first and stays first.'
    if (searching.value) return 'Clear the search to change the order rules run in.'
    if (!canReorder(phase)) return 'There is no other rule in this phase to move it past.'
    return ''
  }

  const announcement = ref('')
  const announce = (text) => {
    announcement.value = ''
    nextTick(() => {
      announcement.value = text
    })
  }

  const listEl = ref(null)
  const focusControl = (id, control) =>
    nextTick(() => {
      const row = listEl.value?.querySelector(`[data-rule-id="${id}"]`)
      const target = row?.querySelector(`[data-control="${control}"]`)
      const usable =
        target && !target.disabled ? target : row?.querySelector('[data-control="grip"]')
      usable?.focus({ preventScroll: false })
    })

  const moveTo = (phase, from, to, control) => {
    const list = rules[phase]
    const head = pinned(phase)
    const target = Math.min(Math.max(to, head), list.length - 1)
    if (from < head || target === from || !canReorder(phase)) return
    const [moved] = list.splice(from, 1)
    list.splice(target, 0, moved)
    announce(
      `${moved.name} moved to position ${target + 1} of ${list.length} in the ${phaseLabel(phase)} phase.`
    )
    if (control) focusControl(moved.id, control)
  }
  const step = (phase, index, direction, control) => {
    if (!canMove(phase, index, direction)) return
    moveTo(phase, index, index + direction, control)
  }

  const drafts = reactive({})
  const positionValue = (item, index) => drafts[item.id] ?? String(index + 1)
  const commitPosition = (phase, item) => {
    const typed = Number.parseInt(drafts[item.id] ?? '', 10)
    delete drafts[item.id]
    if (!Number.isFinite(typed)) return
    const from = rules[phase].indexOf(item)
    moveTo(phase, from, typed - 1, 'position')
  }
  const cancelPosition = (item) => {
    delete drafts[item.id]
  }

  const drag = reactive({ phase: null, from: -1, over: -1 })
  const onDragStart = (phase, index, event) => {
    if (!canReorder(phase) || index < pinned(phase)) return
    drag.phase = phase
    drag.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', rules[phase][index].id)
      const row = event.currentTarget?.closest?.('[data-rule-id]')
      if (row) event.dataTransfer.setDragImage(row, 16, 16)
    }
  }
  const onDragEnter = (phase, index) => {
    if (drag.phase === phase) drag.over = index
  }
  const onDragEnd = () => {
    drag.phase = null
    drag.from = -1
    drag.over = -1
  }
  const onDrop = (phase, index) => {
    const from = drag.from
    const samePhase = drag.phase === phase
    onDragEnd()
    if (samePhase && from >= 0) moveTo(phase, from, index, null)
  }
  const isDragging = (phase, index) => drag.phase === phase && drag.from === index
  const isDropTarget = (phase, index) =>
    drag.phase === phase && drag.over === index && drag.from !== index && index >= pinned(phase)

  const setActive = (item, value) => {
    item.active = value
  }

  const dirty = computed(() => JSON.stringify(snapshot()) !== JSON.stringify(saved.value))
  const changes = computed(() =>
    PHASES.map((phase) => ({
      ...phase,
      items: rules[phase.value].flatMap((item, index) => {
        const lines = []
        const before = saved.value.order[phase.value].indexOf(item.id)
        if (before !== index) {
          lines.push({
            key: `${item.id}-order`,
            name: item.name,
            text: `moves from position ${before + 1} to ${index + 1}`
          })
        }
        if (saved.value.active[item.id] !== item.active) {
          lines.push({
            key: `${item.id}-status`,
            name: item.name,
            text: item.active ? 'is turned on' : 'is turned off'
          })
        }
        return lines
      })
    })).filter((phase) => phase.items.length)
  )
  const changeCount = computed(() =>
    changes.value.reduce((sum, phase) => sum + phase.items.length, 0)
  )

  const discard = () => {
    for (const { value } of PHASES) {
      const byId = Object.fromEntries(rules[value].map((item) => [item.id, item]))
      rules[value] = saved.value.order[value].map((id) => byId[id]).filter(Boolean)
      for (const item of rules[value]) item.active = saved.value.active[item.id]
    }
    announce('Changes discarded. The rules are back in their saved order.')
  }

  const reviewOpen = ref(REVIEW_ON_START)
  const saveFailed = ref(FAILED_ON_START)
  let failuresLeft = SAVE_FAILURES
  const openReview = () => {
    saveFailed.value = false
    reviewOpen.value = true
  }
  const save = () => {
    if (saving.value) return
    saving.value = true
    saveFailed.value = false
    setTimeout(() => {
      saving.value = false
      if (failuresLeft > 0) {
        failuresLeft -= 1
        saveFailed.value = true
        return
      }
      saved.value = snapshot()
      reviewOpen.value = false
      toast.success('Rule order saved.', {
        description: `The ${SUBJECT} runs its rules in the new order.`
      })
    }, 900)
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Rules"
        :description="PAGE_DESCRIPTION"
        size="small"
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/rules"
            target="_blank"
          />
          <Button
            label="Add Rule"
            icon="pi pi-plus"
            kind="outlined"
            size="medium"
          />
        </template>
      </PageHeader>

      <section
        ref="listEl"
        class="layout-section-start flex min-w-0 flex-1 flex-col gap-(--layout-group-gap) pb-(--layout-boundary-end)"
        aria-label="Rules by phase"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
          <Input
            v-model="search"
            size="medium"
            placeholder="Search rules"
            aria-label="Search rules"
            class="min-w-36 grow basis-(--container-2xs)"
            :disabled="loading"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </div>

        <Alert
          v-if="searching"
          severity="info"
          label="Reordering is off while a search narrows the list. Clear the search to change the order rules run in."
        />

        <Card :padded="false">
          <template #content>
            <Accordion
              v-model="openPhases"
              type="multiple"
              size="large"
              arrow-position="left"
            >
              <Accordion.Item
                v-for="group in groups"
                :key="group.value"
                :value="group.value"
              >
                <Accordion.Trigger :level="2">
                  <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                    <span class="truncate">{{ group.label }} phase</span>
                    <span
                      class="shrink-0 text-body-xs tabular-nums text-(--text-muted)"
                      :data-testid="`rules-list__count-${group.value}`"
                    >
                      {{
                        loading
                          ? 'Loading'
                          : searching
                            ? `${group.rows.length} of ${group.total}`
                            : `${group.total} ${group.total === 1 ? 'rule' : 'rules'}`
                      }}
                    </span>
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <Table v-if="loading || group.rows.length">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeadCell class="w-48 flex-none!">Order</Table.HeadCell>
                        <Table.HeadCell principal>Name</Table.HeadCell>
                        <Table.HeadCell :grow="3">Description</Table.HeadCell>
                        <Table.HeadCell class="w-36 flex-none!">Status</Table.HeadCell>
                        <Table.HeadCell :grow="2">Last modified</Table.HeadCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <template v-if="loading">
                        <Table.Row
                          v-for="n in 3"
                          :key="`wire-${n}`"
                        >
                          <Table.Cell class="w-48 flex-none!">
                            <Skeleton
                              width="7rem"
                              height="1.75rem"
                            />
                          </Table.Cell>
                          <Table.Cell principal>
                            <Skeleton width="70%" />
                          </Table.Cell>
                          <Table.Cell :grow="3">
                            <Skeleton width="85%" />
                          </Table.Cell>
                          <Table.Cell class="w-36 flex-none!">
                            <Skeleton width="4rem" />
                          </Table.Cell>
                          <Table.Cell :grow="2">
                            <Skeleton width="60%" />
                          </Table.Cell>
                        </Table.Row>
                      </template>
                      <template v-else>
                        <Table.Row
                          v-for="{ item, index } in group.rows"
                          :key="item.id"
                          :data-rule-id="item.id"
                          :data-dragging="isDragging(group.value, index) || null"
                          :data-drop="isDropTarget(group.value, index) || null"
                          class="relative transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-dragging:opacity-60 data-drop:shadow-[inset_0_2px_0_var(--accent)]"
                          @dragenter.prevent="onDragEnter(group.value, index)"
                          @dragover.prevent
                          @drop.prevent="onDrop(group.value, index)"
                        >
                          <Table.Cell class="w-48 flex-none! gap-(--spacing-xxs)">
                            <span
                              class="w-14 shrink-0 [&_input]:text-center [&_input]:tabular-nums"
                            >
                              <Input
                                :model-value="positionValue(item, index)"
                                size="small"
                                inputmode="numeric"
                                autocomplete="off"
                                data-control="position"
                                :disabled="Boolean(lockReason(group.value, item))"
                                :aria-label="
                                  lockReason(group.value, item)
                                    ? `Position ${index + 1} of ${group.total} in the ${group.label} phase. ${lockReason(group.value, item)}`
                                    : `Position of ${item.name} in the ${group.label} phase. Type a number from ${pinned(group.value) + 1} to ${group.total} and press Enter to move it.`
                                "
                                @update:model-value="drafts[item.id] = $event"
                                @focus="$event.target.select?.()"
                                @keydown.enter.prevent="commitPosition(group.value, item)"
                                @keydown.esc.prevent="cancelPosition(item)"
                                @blur="commitPosition(group.value, item)"
                              />
                            </span>
                            <Tooltip
                              :text="
                                lockReason(group.value, item) ||
                                'Drag to reorder, or use the arrow keys'
                              "
                            >
                              <IconButton
                                icon="pi pi-bars"
                                kind="outlined"
                                size="small"
                                data-control="grip"
                                :draggable="!lockReason(group.value, item)"
                                :disabled="Boolean(lockReason(group.value, item))"
                                :aria-label="
                                  lockReason(group.value, item)
                                    ? `${item.name} cannot be reordered. ${lockReason(group.value, item)}`
                                    : `Reorder ${item.name}, position ${index + 1} of ${group.total} in the ${group.label} phase. Use the up and down arrow keys to move it.`
                                "
                                @dragstart="onDragStart(group.value, index, $event)"
                                @dragend="onDragEnd"
                                @keydown.up.prevent="step(group.value, index, -1, 'grip')"
                                @keydown.down.prevent="step(group.value, index, 1, 'grip')"
                              />
                            </Tooltip>
                            <Tooltip text="Move up">
                              <IconButton
                                icon="pi pi-chevron-up"
                                kind="outlined"
                                size="small"
                                data-control="up"
                                :aria-label="`Move ${item.name} up`"
                                :disabled="!canMove(group.value, index, -1)"
                                @click="step(group.value, index, -1, 'up')"
                              />
                            </Tooltip>
                            <Tooltip text="Move down">
                              <IconButton
                                icon="pi pi-chevron-down"
                                kind="outlined"
                                size="small"
                                data-control="down"
                                :aria-label="`Move ${item.name} down`"
                                :disabled="!canMove(group.value, index, 1)"
                                @click="step(group.value, index, 1, 'down')"
                              />
                            </Tooltip>
                          </Table.Cell>
                          <Table.Cell principal>
                            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <a
                                :href="`#rule-${item.id}`"
                                class="min-w-0 truncate rounded-(--shape-button) text-(--text-default) underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                >{{ item.name }}</a
                              >
                              <Tag
                                v-if="item.locked"
                                label="Default"
                                severity="secondary"
                                size="small"
                              />
                            </span>
                          </Table.Cell>
                          <Table.Cell :grow="3">
                            <span class="min-w-0 truncate text-(--text-muted)">{{
                              item.description
                            }}</span>
                          </Table.Cell>
                          <Table.Cell class="w-36 flex-none!">
                            <label
                              class="flex min-h-10 items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
                            >
                              <Switch
                                :model-value="item.active"
                                :disabled="item.locked || saving"
                                :aria-label="`Run ${item.name}`"
                                @update:model-value="setActive(item, $event)"
                              />
                              <span aria-hidden="true">{{
                                item.active ? 'Active' : 'Inactive'
                              }}</span>
                            </label>
                          </Table.Cell>
                          <Table.Cell :grow="2">
                            <span class="min-w-0 truncate text-body-sm text-(--text-muted)"
                              >{{ item.modified }} by {{ item.author }}</span
                            >
                          </Table.Cell>
                        </Table.Row>
                      </template>
                    </Table.Body>
                  </Table>
                  <EmptyState
                    v-else-if="!group.total"
                    size="small"
                    :title="`No ${group.label.toLowerCase()} rules yet`"
                    :description="`Add a rule to act on every ${group.label.toLowerCase()} this ${SUBJECT} handles.`"
                  >
                    <template #actions>
                      <Button
                        label="Add Rule"
                        icon="pi pi-plus"
                        kind="outlined"
                        size="medium"
                      />
                    </template>
                  </EmptyState>
                  <p
                    v-else
                    class="m-0 px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                  >
                    No {{ group.label.toLowerCase() }} rule matches “{{ search.trim() }}”.
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </template>
        </Card>

        <p
          role="status"
          aria-live="polite"
          class="sr-only"
          data-testid="rules-list__announcer"
        >
          {{ announcement }}
        </p>
      </section>

      <SaveBar v-if="dirty">
        {{ changeCount }} {{ changeCount === 1 ? 'change' : 'changes' }} to the rules, not saved
        yet.
        <template #actions>
          <Button
            type="button"
            label="Discard"
            kind="outlined"
            size="medium"
            :disabled="saving"
            @click="discard"
          />
          <Button
            type="button"
            label="Review changes"
            kind="primary"
            size="medium"
            :disabled="saving"
            @click="openReview"
          />
        </template>
      </SaveBar>
    </main>

    <Dialog
      v-model:open="reviewOpen"
      :dismissible="!saving"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>Review changes</DialogTitle>
            <DialogClose />
          </PanelHeader>
          <PanelContent>
            <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
              <Alert
                v-if="saveFailed"
                severity="danger"
                label="The new order wasn't saved. The rules still run in the saved order; save again to apply it."
              />
              <DialogDescription>
                Rules run top to bottom within each phase. Saving applies this order to every
                {{ SUBJECT === 'firewall' ? 'request' : 'request and response' }} the
                {{ SUBJECT }} handles.
              </DialogDescription>
              <section
                v-for="phase in changes"
                :key="phase.value"
                class="flex min-w-0 flex-col gap-(--spacing-xs)"
                :aria-labelledby="`rules-review-${phase.value}`"
              >
                <h3
                  :id="`rules-review-${phase.value}`"
                  class="m-0 text-label-sm text-(--text-muted)"
                >
                  {{ phase.label }} phase
                </h3>
                <ul class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0">
                  <li
                    v-for="line in phase.items"
                    :key="line.key"
                    class="text-body-sm text-(--text-muted)"
                  >
                    <span class="font-medium text-(--text-default)">{{ line.name }}</span>
                    {{ line.text }}.
                  </li>
                </ul>
              </section>
            </div>
          </PanelContent>
          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              label="Cancel"
              kind="outlined"
              :disabled="saving"
              @click="reviewOpen = false"
            />
            <Button
              class="w-full md:w-auto"
              type="button"
              :label="saveFailed ? 'Save again' : 'Save'"
              kind="primary"
              :loading="saving"
              @click="save"
            />
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <Toaster position="bottom-right" />
  </div>
</template>
```
