# RuleList (`view/rule-list`)

> An ordered list of rules grouped by phase, the Rules tab of an application or a firewall. A `PageHeader` with Documentation and Add Rule sits over a search `Input` and a flush `Card` holding an `Accordion` with one item per phase (Request, Response), each trigger reading the phase and its rule count and each panel a data-driven `DataTable` (scrolling sideways when narrow) with the grip, Position, Name, Description, Status and Last modified. The table is `reorderable`: its grip drags the row or moves it with the arrow keys, Home and End, and `row-reorderable` pins the locked rule; a Position cell adds a numeric position `Input` (type a position and press Enter to move the rule there; disabled with the lock reason on the locked rule) and Move up and Move down `IconButton`s, folded on a phone into one Move `DropdownMenu` (Move to top, Move up, Move down, Move to bottom) after Name and Status; every move is announced in a polite status region and focus follows the moved rule. A leading locked rule (the default rule) keeps first place and cannot be turned off; a search turns reordering off and says so in an info `Alert`. The Status cell is a `Switch` that turns a rule on or off without losing its place. Any change raises a `SaveBar` with Discard and Review changes; Review changes opens a `Dialog` listing, per phase, every rule that moves (from and to) and every rule turned on or off, with Cancel and Save, and a danger `Alert` in the dialog when the save fails. A success toast confirms the saved order. Built from `PageHeader`, `Button`, `Input`, `Alert`, `Card`, `Accordion`, `DataTable`, `IconButton`, `DropdownMenu`, `Tooltip`, `Tag`, `Switch`, `EmptyState`, `SaveBar`, `Dialog` and its parts, `PanelHeader`, `PanelBody`, `PanelFooter`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/view/rule-list/rule-list.vue` in `@aziontech/webkit`
- MCP: `get_block("view/rule-list")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [AttributeEditor](../../components/attribute-editor.md), [Button](../../components/button.md), [Card](../../components/card.md), [Combobox](../../components/combobox.md), [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), `FieldDescription`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [RadioGroup](../../components/radio-group.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsRow](../../components/settings-row.md), [SettingsSection](../../components/settings-section.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-errors`

## Asked as

rules list; rules engine list; reorder rules; rule order; drag and drop reorder; firewall rules; request and response phases; review changes; enable disable rule; lista de regras; ordem das regras; reordenar regras; regras do firewall; fases de requisição e resposta; lista de reglas; reordenar reglas

An ordered list of rules grouped by phase: the Rules tab of an application (Request and Response phases) or a firewall (Request only). Order is behavior here, so the list is built to change the order safely: drag, keys, a typed position or Move up and Move down move a rule, every move is announced, and nothing runs in the new order until the user reviews the changes and saves.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`.

## When to use

- A resource runs an ordered program of rules and the user needs to see it, reorder it and turn rules on or off: application rules engine, firewall rules, routing rules.
- Rules split into phases that never interleave (request and response), each with its own order.
- Changes to the order must be reviewed before they apply to live traffic.

## When not to use

- Records whose order does not matter: use `view/table-view`.
- Writing or editing one rule's criteria and behaviors: use `edit/rule-builder`, which this list opens from Add Rule and from a rule's name.
- Fewer than two rules that can move: show the list without the Order controls.

## Building blocks

### A. Header — `PageHeader`, `Button` (required)

`PageHeader` at `size="small"` titled Rules, with a one-sentence description that says order is behavior and that an inactive rule keeps its place. Actions: outlined Documentation, then outlined Add Rule on the outer edge.

### B. Search — `Input`, `Alert` (required)

A medium `Input` with a search icon, named "Search rules", matching name, description and author. While it holds text, an info `Alert` says reordering is off and how to turn it back on; phases with matches open, and each trigger reads "n of total".

### C. Phases — `Card`, `Accordion` (required)

A flush `Card` holding an `Accordion` with `type="multiple"`, `size="large"`, the arrow on the start side, one item per phase, all open by default. Each trigger is an `h2` reading "Request phase" with the rule count in muted tabular figures. A resource with a single phase keeps the same anatomy with one item.

### D. Rules table — `DataTable`, `Tag`, `Field`, `Switch` (required)

A data-driven `DataTable` per phase (`row-key="id"`, no sorting: order is the data's, `reorderable` with `:row-reorderable` and `@update:data`; no `stackable`, so on a phone the grid keeps its columns and scrolls sideways inside the panel, after the narrow reorder below): the table's own grip column (Order), Position (168 px), Name (principal, a link that opens the rule in the rule builder, with a secondary "Default" `Tag` on a locked rule), Description (muted, truncated), Status (a `Switch` named "Run <rule>" beside a visible Active or Inactive, inside a 40 px label) and Last modified ("2 days ago by Maya Chen"). The table draws the drag: the grip, the dragged row's dashed outline, the 2 px drop line and its own polite announcement ("Moved Docs rewrite to position 4 of 5."); the block only writes the new order back to its phase on `update:data`.

### E. Order controls — `Input`, `IconButton`, `Tooltip`, `DropdownMenu` (required)

The grip comes from `Table` `reorderable`: drag it, or focus it and press Arrow Up, Arrow Down, Home or End. `row-reorderable` returns false for a locked rule, while a search narrows the list and while saving, so those grips are disabled and no row can be dropped on or moved past a pinned rule. The Position cell starts with a small numeric `Input` showing the rule's position: type a number and press Enter (or leave the field) to move the rule there, clamped below the pinned rules and to the end of the phase; Escape or a value that is not a number keeps the rule in place, and after Enter focus stays in the field on the moved rule. On a locked rule, while searching and while saving the field is disabled and its name and `Tooltip` carry the reason ("Position 1 of Default rule in the Request phase. The default rule runs first and stays first."). Then the cell holds Move up and Move down `IconButton`s, the single-pointer way to reorder (WCAG 2.5.7); each is named after its rule and, when disabled, carries the reason ("Move Default rule down. The default rule runs first and stays first."), which its `Tooltip` repeats. After a move with them, focus returns to the same button on the moved rule (the other one, or the grip, when that one is now disabled) and the block's polite status region says "Docs rewrite moved to position 3 of 5 in the Request phase."

Below 48rem of the viewport the row leads with Name and the `Switch` (its Active or Inactive text kept for screen readers only), and the Position cell folds into one medium ghost `IconButton` named "Move Docs rewrite, position 5 of 5" that opens a `DropdownMenu` with Move to top, Move up, Move down and Move to bottom, each disabled when the rule cannot go that way; the typed position is left to the wide layout and the grip still drags. Focus returns to the menu button on the moved rule.

### F. Save bar and review — `SaveBar`, `Button`, `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Alert` (required)

Any move or status change raises a `SaveBar` counting the changes, with Discard (outlined, restores the saved order and announces it) and Review changes (primary). Review changes opens a medium `Dialog` titled "Review changes": a description of what saving does, then one section per phase with an `h3` and a list of lines such as "Docs rewrite moves from position 5 to 3." and "Maintenance page is turned on." The footer has Cancel and Save; Save emits `save` with every rule in its new order, shows its loading state while `saving` is set, and the dialog cannot be dismissed while saving. On success (`saving` turns off with no `saveError`) the dialog closes, focus moves to the rules region (the Review changes button is gone) and a success toast says "Rule order saved." On failure (`saveError` set) the dialog stays open with a danger `Alert` at the top saying the rules still run in the saved order, and Save becomes Save again. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so the page never renders a `Toaster`.

### G. States — `EmptyState`, `Alert` (required)

Loading: triggers read Loading, the search and Add Rule are disabled and each `DataTable` shows its skeleton rows (`loading`). Load failure: the heading and the disabled search stay and a danger `Alert`, "Couldn't load the rules. Check your connection and retry.", with Retry takes the phases' place. Empty phase: a small `EmptyState` ("No request rules yet") with an outlined Add Rule. No match in a phase: a small `EmptyState` in the table's `empty` slot, "No request rule matches “cache”", with an outlined Clear search.

A rule's name is a `Button variant="link"` named "Edit <rule>" that emits `edit` with the event and the rule; the page opens `edit/rule-builder` from it, as EditRule shows.

Each phase renders every rule, unpaged: paging an ordered list would hide the neighbours a move lands between. A phase is sized for the tens of rules people manage by hand; past about 200 rules, split them across phases or rule sets rather than paging one phase.

## Data

The block takes its rules through props and emits every action; it fetches nothing. `RuleListRule`, `RuleListEdit` and `RuleListProps` are exported from `rule-list.vue`, and `sample.ts` holds the sample application and firewall rules the block renders when `rules` is left out (and never while `loading` or `error` is set). Moves and switches stay a local draft until Save.

| Prop                | Type                          | What it does                                                                                                 |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `subject`           | `'application' \| 'firewall'` | What runs the rules: an application has Request and Response phases, a firewall only Request. Sets the copy. |
| `rules`             | `RuleListRule[]`              | The saved rules, each phase in run order. Pass `[]` for none.                                                |
| `loading`           | `boolean`                     | The rules are loading: each phase reads Loading and shows skeleton rows; the search and Add Rule disable.    |
| `error`             | `string`                      | Why the rules failed to load, shown in the danger `Alert` with Retry that replaces the phases.               |
| `saving`            | `boolean`                     | The save is in flight. When it turns off with no `saveError`, the draft becomes the saved order.             |
| `saveError`         | `string`                      | Why the save failed, shown at the top of the review dialog; Save reads Save again.                           |
| `defaultEdits`      | `RuleListEdit[]`              | Unsaved moves and switches the list opens with.                                                              |
| `defaultSearch`     | `string`                      | The search the list opens with.                                                                              |
| `defaultReviewOpen` | `boolean`                     | Opens the Review changes dialog.                                                                             |

| Event    | Payload           | When                                                            |
| -------- | ----------------- | --------------------------------------------------------------- |
| `edit`   | `(event, rule)`   | A rule's name.                                                  |
| `create` | `(event, phase?)` | Add Rule in the heading, or in an empty phase (with its phase). |
| `retry`  | `(event)`         | Retry in the load error alert.                                  |
| `save`   | `(event, rules)`  | Save in the review dialog; every rule of every phase, in order. |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import RuleList, { type RuleListRule } from './rule-list.vue'

  const { data, pending, error, refresh } = useRules()
  const { run: saveOrder, pending: saving, error: saveFailed } = useSaveRuleOrder()
  const save = (_event: MouseEvent, rules: RuleListRule[]) => saveOrder(rules)
</script>

<template>
  <RuleList
    :rules="data ?? []"
    :loading="pending"
    :error="error ? 'Couldn\'t load the rules. Check your connection and retry.' : ''"
    :saving="saving"
    :save-error="
      saveFailed
        ? 'The new order wasn\'t saved. The rules still run in the saved order; save again to apply it.'
        : ''
    "
    @retry="refresh"
    @save="save"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep phases separate: a rule moves only within its phase, and drag ignores drops on another phase.
- Offer every way to move: drag for a pointer, arrow keys, Home and End on the grip, a typed position for long jumps, and Move up and Move down for touch and switch access.
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
- **Order control names:** "Reorder Docs rewrite, position 5 of 5" (the table's grip, described by its drag-or-arrow hint), "Position of Docs rewrite in the Request phase. Type a number from 2 to 5 to move it.", "Move Docs rewrite up", and when disabled "Move Default rule down. The default rule runs first and stays first."
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
- Keyboard: Tab reaches the grip, the position field, Move up, Move down, the rule link and its switch, in that order; the grip moves the rule with Up, Down, Home and End and Escape cancels a drag. Focus follows the moved rule.
- Moves and discards are announced once in a polite `role="status"` region that exists from the first render.
- The `Switch` is named "Run <rule>"; its visible Active or Inactive text is hidden from the accessibility tree so the state is read once, from `aria-checked`.
- The review dialog traps focus, returns it to Review changes on close, and is not dismissible while saving; the failure `Alert` is read when it appears.
- Drop targets show a 2 px accent line and the dragged row fades; transitions respect reduced motion.

## States

- Application: the default `subject`; Request and Response phases, a locked Default rule first in Request, one inactive rule per phase.
- Firewall: `subject="firewall"`; one Request phase, every rule movable.
- ReviewChanges: `defaultEdits` (two moves and one status change) and `defaultReviewOpen`: the save bar and the review dialog open.
- SaveError: the same with `saveError` set: the failure `Alert` and Save again.
- Searching: `defaultSearch` "cache": reordering off with its `Alert`, phases reading "n of total".
- Empty: `subject="firewall"` and `rules` `[]`: the Request phase shows its `EmptyState`.
- Loading: `loading`: skeleton rows in each phase, the search and Add Rule disabled.
- LoadError: `error` set: a danger `Alert` with Retry replaces the phases.
- EditRule: the list composed with `edit/rule-builder`. A rule's name is a button ("Edit Docs rewrite") that opens the builder `Drawer` as Edit Rule, seeded with the rule and its phase locked; Add Rule in the header or in an empty phase opens it as Add Rule in that phase. Saving an edit updates the row and says so in a toast; a new rule lands last in its phase with a toast that offers Edit. Neither is an order change, so the `SaveBar` still counts only moves and switches. Product pages (an application's or a firewall's Rules tab) compose the two the same way.

## Related

- `edit/rule-builder` — the drawer that adds or edits one rule.
- `view/table-view` — lists whose order does not matter.
- `state/form-validation` (SectionRejected) — the failed-save `Alert` pattern the review dialog follows.
- `view/waf-tuning` — the WAF tuning list a firewall's WAF rule links to.

## Variants

- `Application` — primary (the code below)
- `Firewall` — A firewall's rules: one Request phase, five rules and no locked rule, so every rule moves; the page says rules run until one refuses the request.
- `ReviewChanges` — After two moves and one rule turned on: the SaveBar counts the changes and the Review changes dialog is open, listing Docs rewrite moving from 5 to 3 (and the rules it pushed down), Maintenance page turned on, and Security headers moving to the top of the Response phase.
- `SaveError` — The same changes after a failed save: the dialog stays open with a danger Alert saying the rules still run in the saved order, and Save reads Save again; pressing it emits `save` once more, and when `saving` turns off with no `saveError` the dialog closes with the success toast.
- `Searching` — A search for cache narrows both phases to their matches, the counts read n of total, an info Alert says reordering is off while searching, and every Order control is disabled with the reason in its name and tooltip.
- `Empty` — A firewall with no rules: the Request phase panel shows a small EmptyState with Add Rule instead of the table.
- `Loading` — While the rules load: both phases read Loading, the search is disabled, and each table shows three skeleton rows shaped like the columns.
- `LoadError` — The rules could not load: the heading and the disabled search stay, Add Rule is disabled, and a danger Alert with Retry takes the phases' place.
- `EditRule` — The list composed with `edit/rule-builder`: a rule's name opens the large rule-builder `Drawer` as Edit Rule, seeded with that rule's criteria and behaviors and its phase locked; Add Rule in the header (or in an empty phase) opens it as Add Rule in that phase. Saving an edit updates the row in place and confirms it in a toast; a new rule lands last in its phase, the phase opens, and the toast offers Edit. Neither changes the run order, so the SaveBar only counts moves and status switches.

Each variant is the same screen in another state: `get_block("view/rule-list", { variant })`, or the file under `blocks/view/rule-list/variants/`.

## Code (`Application`)

```vue
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onScopeDispose, reactive, ref, watch } from 'vue'

  import { sampleApplicationRules, sampleFirewallRules } from './sample'

  /** What runs the rules: an application has Request and Response phases, a firewall only Request. */
  export type RuleListSubject = 'application' | 'firewall'
  /** The phase a rule runs in. */
  export type RuleListPhase = 'request' | 'response'

  /** One rule, in the order it runs within its phase. */
  export interface RuleListRule {
    /** Stable key. */
    id: string
    /** Display name; it opens the rule. */
    name: string
    /** What the rule does, in one line. */
    description: string
    /** The phase it runs in. */
    phase: RuleListPhase
    /** Who changed it last. */
    author: string
    /** When it changed last, as shown. */
    modified: string
    /** Whether it runs; an inactive rule keeps its place. */
    active: boolean
    /** Pinned first in its phase: it cannot move or turn off. */
    locked: boolean
  }

  /** An unsaved change the list opens with. */
  export interface RuleListEdit {
    /** The rule's phase. */
    phase: RuleListPhase
    /** The rule's id. */
    id: string
    /** The zero-based position it moves to. */
    to?: number
    /** The status it switches to. */
    active?: boolean
  }

  export interface RuleListProps {
    /** What runs the rules; it sets the phases and the copy. */
    subject?: RuleListSubject
    /** The saved rules of every phase, each phase in run order. Pass an empty list for none. Left out, the sample renders. */
    rules?: RuleListRule[]
    /** The rules are loading: each phase shows skeleton rows and the search and Add Rule disable. */
    loading?: boolean
    /** Why the rules could not load; a danger alert with Retry takes the phases' place. */
    error?: string
    /** Unsaved moves and switches the list opens with, so the save bar shows. */
    defaultEdits?: RuleListEdit[]
    /** The search the list opens with. */
    defaultSearch?: string
    /** Opens the Review changes dialog when the block opens. */
    defaultReviewOpen?: boolean
    /** The save is in flight: the dialog locks and Save spins. When it turns off with no saveError, the order is saved. */
    saving?: boolean
    /** Why the save failed, shown at the top of the review dialog; Save reads Save again. */
    saveError?: string
  }

  const props = withDefaults(defineProps<RuleListProps>(), {
    subject: 'application',
    rules: undefined,
    loading: false,
    error: '',
    defaultEdits: () => [],
    defaultSearch: '',
    defaultReviewOpen: false,
    saving: false,
    saveError: ''
  })

  const emit = defineEmits<{
    edit: [event: MouseEvent, rule: RuleListRule]
    create: [event: MouseEvent, phase?: RuleListPhase]
    retry: [event: MouseEvent]
    save: [event: MouseEvent, rules: RuleListRule[]]
  }>()

  const ALL_PHASES: { value: RuleListPhase; label: string }[] = [
    { value: 'request', label: 'Request' },
    { value: 'response', label: 'Response' }
  ]

  type Phase = RuleListPhase
  type Rule = RuleListRule
  type Control = 'up' | 'down' | 'position' | 'menu'

  interface Snapshot {
    order: Record<string, string[]>
    active: Record<string, boolean>
  }

  interface ChangeLine {
    key: string
    name: string
    text: string
  }

  const SUBJECT = computed(() => props.subject)
  const PAGE_DESCRIPTION = computed(() =>
    props.subject === 'firewall'
      ? 'Rules run top to bottom on every request this firewall sees, until one of them refuses it. Turn a rule off to skip it without losing its place.'
      : 'Rules run top to bottom within each phase, so their order is their behavior. Turn a rule off to skip it without losing its place.'
  )
  const PHASES = computed(() =>
    props.subject === 'firewall' ? ALL_PHASES.slice(0, 1) : ALL_PHASES
  )

  const source = computed<Rule[]>(
    () =>
      props.rules ??
      (props.loading || props.error
        ? []
        : props.subject === 'firewall'
          ? sampleFirewallRules
          : sampleApplicationRules)
  )
  const loadFailed = computed(() => props.error !== '')

  const draft = reactive<Record<Phase, Rule[]>>({ request: [], response: [] })
  const phaseLabel = (phase: Phase) =>
    ALL_PHASES.find((item) => item.value === phase)?.label ?? phase

  const snapshot = (): Snapshot => ({
    order: Object.fromEntries(
      PHASES.value.map(({ value }) => [value, draft[value].map((r) => r.id)])
    ),
    active: Object.fromEntries(
      PHASES.value.flatMap(({ value }) => draft[value].map((r) => [r.id, r.active]))
    )
  })
  const saved = ref(snapshot())

  const applyEdits = (edits: RuleListEdit[]) => {
    for (const edit of edits) {
      const list = draft[edit.phase]
      const from = list.findIndex((item) => item.id === edit.id)
      if (from < 0) continue
      if (edit.to !== undefined) list.splice(edit.to, 0, ...list.splice(from, 1))
      if (edit.active !== undefined)
        list[list.findIndex((item) => item.id === edit.id)].active = edit.active
    }
  }

  let seeded = false
  watch(
    source,
    (next) => {
      for (const { value } of ALL_PHASES) {
        draft[value] = next.filter((item) => item.phase === value).map((item) => ({ ...item }))
      }
      saved.value = snapshot()
      if (!seeded && next.length) {
        seeded = true
        applyEdits(props.defaultEdits)
      }
    },
    { immediate: true }
  )

  const loading = computed(() => props.loading)
  const search = ref(props.defaultSearch)
  const searching = computed(() => search.value.trim().length > 0)
  const matches = (item: Rule) => {
    const term = search.value.trim().toLowerCase()
    if (!term) return true
    return [item.name, item.description, item.author].some((field) =>
      field.toLowerCase().includes(term)
    )
  }

  const openPhases = ref<string[]>(PHASES.value.map((item) => item.value))
  watch(search, () => {
    if (!searching.value) return
    const hits = PHASES.value
      .filter(({ value }) => draft[value].some(matches))
      .map(({ value }) => value)
    openPhases.value = [...new Set([...openPhases.value, ...hits])]
  })

  const groups = computed(() =>
    PHASES.value.map((phase) => {
      const list = draft[phase.value]
      return {
        ...phase,
        total: list.length,
        items: list.filter(matches)
      }
    })
  )

  const saving = computed(() => props.saving)
  const pinned = (phase: Phase) => {
    const list = draft[phase]
    let count = 0
    while (count < list.length && list[count].locked) count += 1
    return count
  }
  const canReorder = (phase: Phase) =>
    !searching.value && !saving.value && draft[phase].length - pinned(phase) > 1
  const canMove = (phase: Phase, index: number, direction: number) => {
    if (!canReorder(phase) || index < pinned(phase)) return false
    const to = index + direction
    return to >= pinned(phase) && to < draft[phase].length
  }
  const lockReason = (phase: Phase, item: Rule) => {
    if (item.locked) return 'The default rule runs first and stays first.'
    if (searching.value) return 'Clear the search to change the order rules run in.'
    if (saving.value) return 'Wait for the save to finish.'
    if (!canReorder(phase)) return 'There is no other rule in this phase to move it past.'
    return ''
  }

  const announcement = ref('')
  const announce = (text: string) => {
    announcement.value = ''
    nextTick(() => {
      announcement.value = text
    })
  }

  const listEl = ref<HTMLElement | null>(null)
  const focusControl = (id: string, control: Control) =>
    nextTick(() => {
      const row = listEl.value?.querySelector(`[data-rule-id="${id}"]`)
      const target = row?.querySelector<HTMLButtonElement>(`[data-control="${control}"]`)
      const usable =
        target && !target.disabled
          ? target
          : (row?.querySelector<HTMLElement>('[data-control]:not(:disabled)') ??
            row?.closest('[data-reorder-row]')?.querySelector<HTMLElement>('[data-reorder-handle]'))
      usable?.focus({ preventScroll: false })
    })

  const moveTo = (phase: Phase, from: number, to: number, control?: Control) => {
    const list = draft[phase]
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
  const step = (phase: Phase, index: number, direction: number, control?: Control) => {
    if (!canMove(phase, index, direction)) return
    moveTo(phase, index, index + direction, control)
  }

  const position = (phase: Phase, item: Rule) => draft[phase].indexOf(item)
  const positionDraft = ref<{ value: string; id: string } | null>(null)
  const positionValue = (phase: Phase, item: Rule) =>
    positionDraft.value?.id === item.id
      ? positionDraft.value.value
      : String(position(phase, item) + 1)
  const onPositionInput = (item: Rule, value: string) => {
    positionDraft.value = { value, id: item.id }
  }
  const commitPosition = (phase: Phase, item: Rule, refocus: boolean) => {
    const draft = positionDraft.value
    positionDraft.value = null
    if (!draft || draft.id !== item.id) return
    const typed = Number.parseInt(draft.value, 10)
    if (!Number.isFinite(typed)) return
    moveTo(phase, position(phase, item), typed - 1, refocus ? 'position' : undefined)
  }
  const cancelPosition = () => {
    positionDraft.value = null
  }
  const reorderRows = (phase: Phase, next: Rule[]) => {
    if (searching.value) return
    draft[phase] = next
  }
  const reorderable = (phase: Phase) => (row: Rule) => !lockReason(phase, row)

  const narrow = ref(false)
  const narrowQuery = globalThis.matchMedia?.('(width < 48rem)')
  const onNarrowChange = (event: MediaQueryListEvent) => {
    narrow.value = event.matches
  }
  onMounted(() => {
    if (!narrowQuery) return
    narrow.value = narrowQuery.matches
    narrowQuery.addEventListener('change', onNarrowChange)
  })
  onScopeDispose(() => narrowQuery?.removeEventListener('change', onNarrowChange))

  const nameColumn: TableColumn = {
    accessorKey: 'name',
    header: 'Name',
    principal: true,
    hideable: false
  }
  const descriptionColumn: TableColumn = {
    accessorKey: 'description',
    header: 'Description',
    grow: 3
  }
  const modifiedColumn: TableColumn = { accessorKey: 'modified', header: 'Last modified', grow: 2 }
  const statusColumn: TableColumn = { id: 'status', header: 'Status' }
  const moveColumn: TableColumn = { id: 'move', header: 'Position', hideable: false }
  const columns = computed<TableColumn[]>(() =>
    narrow.value
      ? [
          nameColumn,
          { ...statusColumn, width: 64 },
          { ...moveColumn, width: 56, align: 'center' },
          descriptionColumn,
          modifiedColumn
        ]
      : [
          { ...moveColumn, width: 168 },
          nameColumn,
          descriptionColumn,
          { ...statusColumn, width: 152 },
          modifiedColumn
        ]
  )

  const onMoveSelect = (phase: Phase, item: Rule, value: DropdownMenuItemValue) => {
    const from = position(phase, item)
    if (value === 'top') moveTo(phase, from, pinned(phase), 'menu')
    if (value === 'up') step(phase, from, -1, 'menu')
    if (value === 'down') step(phase, from, 1, 'menu')
    if (value === 'bottom') moveTo(phase, from, draft[phase].length - 1, 'menu')
  }

  const setActive = (item: Rule, value: boolean) => {
    item.active = value
  }

  const dirty = computed(() => JSON.stringify(snapshot()) !== JSON.stringify(saved.value))
  const changes = computed(() =>
    PHASES.value
      .map((phase) => ({
        ...phase,
        items: draft[phase.value].flatMap((item, index) => {
          const lines: ChangeLine[] = []
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
      }))
      .filter((phase) => phase.items.length)
  )
  const changeCount = computed(() =>
    changes.value.reduce((sum, phase) => sum + phase.items.length, 0)
  )

  const discard = () => {
    for (const { value } of PHASES.value) {
      const byId = Object.fromEntries(draft[value].map((item) => [item.id, item]))
      draft[value] = saved.value.order[value].map((id) => byId[id]).filter(Boolean)
      for (const item of draft[value]) item.active = saved.value.active[item.id]
    }
    announce('Changes discarded. The rules are back in their saved order.')
  }

  const reviewOpen = ref(props.defaultReviewOpen)
  const saveFailed = ref(props.saveError !== '')
  const openReview = () => {
    saveFailed.value = false
    reviewOpen.value = true
  }
  const save = (event: MouseEvent) => {
    if (saving.value) return
    saveFailed.value = false
    emit(
      'save',
      event,
      PHASES.value.flatMap(({ value }) => draft[value].map((item) => ({ ...item })))
    )
  }

  watch(
    () => props.saveError,
    (next) => {
      saveFailed.value = next !== ''
    }
  )

  watch(
    () => props.saving,
    (now, before) => {
      if (!before || now) return
      if (props.saveError) {
        saveFailed.value = true
        return
      }
      saved.value = snapshot()
      reviewOpen.value = false
      setTimeout(() => listEl.value?.focus(), 0)
      toast.success('Rule order saved.', {
        description: `The ${SUBJECT.value} runs its rules in the new order.`
      })
    }
  )
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Rules"
        :description="PAGE_DESCRIPTION"
        size="small"
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/rules"
            target="_blank"
          />
          <Button
            label="Add Rule"
            icon="ai ai-plus"
            variant="outline"
            size="medium"
            :disabled="loading || loadFailed"
            @click="(event: MouseEvent) => emit('create', event)"
          />
        </template>
      </PageHeader>

      <section
        ref="listEl"
        tabindex="-1"
        class="layout-section-start flex min-w-0 flex-1 flex-col gap-(--layout-group-gap) pb-(--layout-boundary-end) outline-none"
        aria-label="Rules by phase"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
          <div class="min-w-36 grow basis-(--container-2xs)">
            <Input
              v-model="search"
              size="medium"
              placeholder="Search rules"
              aria-label="Search rules"
              class="w-full"
              :disabled="loading || loadFailed"
            >
              <template #leading>
                <i
                  class="ai ai-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
        </div>

        <Alert
          v-if="loadFailed"
          key="load-error"
          severity="danger"
          :label="error"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <Alert
          v-else-if="searching"
          key="searching"
          severity="info"
          label="Reordering is off while a search narrows the list. Clear the search to change the order rules run in."
        />

        <Card
          v-if="!loadFailed"
          :padded="false"
        >
          <template #default>
            <Accordion
              v-model="openPhases"
              type="multiple"
              size="large"
              icon-position="leading"
            >
              <Accordion.Item
                v-for="group in groups"
                :key="group.value"
                :value="group.value"
              >
                <Accordion.Trigger :heading-level="2">
                  <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                    <span class="truncate">{{ group.label }} phase</span>
                    <span
                      class="shrink-0 text-body-xs tabular-nums text-(--text-muted)"
                      :data-testid="`rule-list__count-${group.value}`"
                    >
                      {{
                        loading
                          ? 'Loading'
                          : searching
                            ? `${group.items.length} of ${group.total}`
                            : `${group.total} ${group.total === 1 ? 'rule' : 'rules'}`
                      }}
                    </span>
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div>
                    <DataTable
                      v-if="loading || group.total"
                      :data="loading ? [] : group.items"
                      :columns="columns"
                      row-key="id"
                      :bordered="false"
                      :loading="loading"
                      reorderable
                      :row-reorderable="reorderable(group.value)"
                      :aria-label="`${group.label} phase rules, in the order they run`"
                      @update:data="reorderRows(group.value, $event)"
                    >
                      <template #cell-move="{ row }">
                        <div
                          v-if="narrow"
                          :data-rule-id="row.id"
                          class="flex items-center justify-center"
                        >
                          <DropdownMenu
                            side="bottom"
                            align="end"
                            :disabled="Boolean(lockReason(group.value, row))"
                            @select="(_event, value) => onMoveSelect(group.value, row, value)"
                          >
                            <DropdownMenu.Trigger>
                              <IconButton
                                icon="ai ai-move-vertical"
                                variant="ghost"
                                size="medium"
                                data-control="menu"
                                :disabled="Boolean(lockReason(group.value, row))"
                                :aria-label="
                                  lockReason(group.value, row)
                                    ? `Move ${row.name}, position ${position(group.value, row) + 1} of ${group.total}. ${lockReason(group.value, row)}`
                                    : `Move ${row.name}, position ${position(group.value, row) + 1} of ${group.total}`
                                "
                              />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Group>
                              <DropdownMenu.Item
                                value="top"
                                label="Move to top"
                                :disabled="!canMove(group.value, position(group.value, row), -1)"
                              />
                              <DropdownMenu.Item
                                value="up"
                                label="Move up"
                                :disabled="!canMove(group.value, position(group.value, row), -1)"
                              />
                              <DropdownMenu.Item
                                value="down"
                                label="Move down"
                                :disabled="!canMove(group.value, position(group.value, row), 1)"
                              />
                              <DropdownMenu.Item
                                value="bottom"
                                label="Move to bottom"
                                :disabled="!canMove(group.value, position(group.value, row), 1)"
                              />
                            </DropdownMenu.Group>
                          </DropdownMenu>
                        </div>
                        <div
                          v-else
                          :data-rule-id="row.id"
                          class="flex items-center gap-(--spacing-2xs)"
                        >
                          <Tooltip
                            :content="
                              lockReason(group.value, row) ||
                              'Type a position to move the rule there'
                            "
                          >
                            <span
                              class="inline-flex w-14 shrink-0 tabular-nums [&_input]:text-center"
                            >
                              <Input
                                :model-value="positionValue(group.value, row)"
                                size="small"
                                inputmode="numeric"
                                autocomplete="off"
                                data-control="position"
                                class="w-full"
                                :disabled="Boolean(lockReason(group.value, row))"
                                :aria-label="
                                  lockReason(group.value, row)
                                    ? `Position ${position(group.value, row) + 1} of ${row.name} in the ${group.label} phase. ${lockReason(group.value, row)}`
                                    : `Position of ${row.name} in the ${group.label} phase. Type a number from ${pinned(group.value) + 1} to ${group.total} to move it.`
                                "
                                @update:model-value="onPositionInput(row, $event)"
                                @focus="($event.target as HTMLInputElement).select()"
                                @keydown.enter.prevent="commitPosition(group.value, row, true)"
                                @keydown.esc.prevent="cancelPosition()"
                                @blur="commitPosition(group.value, row, false)"
                              />
                            </span>
                          </Tooltip>
                          <Tooltip :content="lockReason(group.value, row) || 'Move up'">
                            <IconButton
                              icon="ai ai-chevron-up"
                              variant="outline"
                              size="small"
                              data-control="up"
                              :aria-label="
                                lockReason(group.value, row)
                                  ? `Move ${row.name} up. ${lockReason(group.value, row)}`
                                  : `Move ${row.name} up`
                              "
                              :disabled="!canMove(group.value, position(group.value, row), -1)"
                              @click="step(group.value, position(group.value, row), -1, 'up')"
                            />
                          </Tooltip>
                          <Tooltip :content="lockReason(group.value, row) || 'Move down'">
                            <IconButton
                              icon="ai ai-chevron-down"
                              variant="outline"
                              size="small"
                              data-control="down"
                              :aria-label="
                                lockReason(group.value, row)
                                  ? `Move ${row.name} down. ${lockReason(group.value, row)}`
                                  : `Move ${row.name} down`
                              "
                              :disabled="!canMove(group.value, position(group.value, row), 1)"
                              @click="step(group.value, position(group.value, row), 1, 'down')"
                            />
                          </Tooltip>
                        </div>
                      </template>
                      <template #cell-name="{ row }">
                        <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
                          <Button
                            variant="link"
                            :label="row.name"
                            data-rule-name
                            :aria-label="`Edit ${row.name}`"
                            class="min-w-0"
                            @click="(event: MouseEvent) => emit('edit', event, row)"
                          />
                          <Tag
                            v-if="row.locked"
                            label="Default"
                            severity="neutral"
                            size="small"
                          />
                        </div>
                      </template>
                      <template #cell-description="{ row }">
                        <span class="min-w-0 truncate text-(--text-muted)">{{
                          row.description
                        }}</span>
                      </template>
                      <template #cell-status="{ row }">
                        <div class="flex min-h-10 min-w-0 items-center">
                          <Field orientation="horizontal">
                            <Switch
                              :model-value="row.active"
                              :disabled="row.locked || saving"
                              :aria-label="`Run ${row.name}`"
                              @update:model-value="setActive(row, $event)"
                            />
                            <Field.Label>
                              <span
                                class="text-body-sm max-md:sr-only"
                                aria-hidden="true"
                                >{{ row.active ? 'Active' : 'Inactive' }}</span
                              >
                            </Field.Label>
                          </Field>
                        </div>
                      </template>
                      <template #cell-modified="{ row }">
                        <span class="min-w-0 truncate text-body-sm text-(--text-muted)"
                          >{{ row.modified }} by {{ row.author }}</span
                        >
                      </template>
                      <template #empty>
                        <EmptyState
                          size="small"
                          icon="ai ai-search"
                          :title="`No ${group.label.toLowerCase()} rule matches “${search.trim()}”`"
                        >
                          <template #actions>
                            <Button
                              label="Clear search"
                              variant="outline"
                              size="small"
                              @click="search = ''"
                            />
                          </template>
                        </EmptyState>
                      </template>
                    </DataTable>
                    <EmptyState
                      v-else
                      size="small"
                      :title="`No ${group.label.toLowerCase()} rules yet`"
                      :description="`Add a rule to act on every ${group.label.toLowerCase()} this ${SUBJECT} handles.`"
                    >
                      <template #actions>
                        <Button
                          label="Add Rule"
                          icon="ai ai-plus"
                          variant="outline"
                          size="medium"
                          @click="(event: MouseEvent) => emit('create', event, group.value)"
                        />
                      </template>
                    </EmptyState>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </template>
        </Card>

        <p
          role="status"
          aria-live="polite"
          class="sr-only"
          data-testid="rule-list__announcer"
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
            variant="outline"
            size="medium"
            :disabled="saving"
            @click="discard"
          />
          <Button
            type="button"
            label="Review changes"
            variant="primary"
            size="medium"
            :disabled="saving"
            @click="openReview"
          />
        </template>
      </SaveBar>
    </div>

    <Dialog
      v-model:open="reviewOpen"
      :dismissible="!saving"
      :closable="!saving"
      size="medium"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Review changes</DialogTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
            <Alert
              v-if="saveFailed"
              severity="danger"
              :label="saveError"
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
              <ul class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0">
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
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                type="button"
                label="Cancel"
                variant="outline"
                :disabled="saving"
                @click="reviewOpen = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                type="button"
                :label="saveFailed ? 'Save again' : 'Save'"
                variant="primary"
                :loading="saving"
                @click="save"
              />
            </div>
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
```

## `sample.ts`

```ts
import type { RuleListRule } from './rule-list.vue'

export const sampleApplicationRules: RuleListRule[] = [
  {
    id: 're-default',
    name: 'Default rule',
    description: 'Sends every request to the origin when no other rule matches first.',
    phase: 'request',
    author: 'Maya Chen',
    modified: '3 months ago',
    active: true,
    locked: true
  },
  {
    id: 're-maintenance',
    name: 'Maintenance page',
    description: 'Serves the maintenance page while the maintenance header is set.',
    phase: 'request',
    author: 'Leo Park',
    modified: '1 month ago',
    active: false,
    locked: false
  },
  {
    id: 're-www',
    name: 'Redirect www',
    description: 'Sends the www host to the apex domain.',
    phase: 'request',
    author: 'Emily Clark',
    modified: '12 days ago',
    active: true,
    locked: false
  },
  {
    id: 're-gateway',
    name: 'API gateway',
    description: 'Sends API traffic to the gateway service, through the auth check.',
    phase: 'request',
    author: 'Maya Chen',
    modified: '2 days ago',
    active: true,
    locked: false
  },
  {
    id: 're-docs',
    name: 'Docs rewrite',
    description: 'Rewrites the docs path and caches it as a static asset.',
    phase: 'request',
    author: 'Sam Okafor',
    modified: '3 weeks ago',
    active: true,
    locked: false
  },
  {
    id: 're-cache-bypass',
    name: 'Cache bypass',
    description: 'Keeps API responses out of the cache.',
    phase: 'response',
    author: 'Leo Park',
    modified: '5 days ago',
    active: true,
    locked: false
  },
  {
    id: 're-security-headers',
    name: 'Security headers',
    description: 'Adds the security header set to successful responses.',
    phase: 'response',
    author: 'Emily Clark',
    modified: '9 days ago',
    active: true,
    locked: false
  },
  {
    id: 're-compress',
    name: 'Compress assets',
    description: 'Compresses script bundles on the way out.',
    phase: 'response',
    author: 'Sam Okafor',
    modified: '7 weeks ago',
    active: false,
    locked: false
  }
]

export const sampleFirewallRules: RuleListRule[] = [
  {
    id: 'fw-office',
    name: 'Allow office network',
    description: 'Lets the office network through before any other rule looks at it.',
    phase: 'request',
    author: 'Maya Chen',
    modified: '2 months ago',
    active: true,
    locked: false
  },
  {
    id: 'fw-scanners',
    name: 'Block scanners',
    description: 'Refuses requests from the scanner network list.',
    phase: 'request',
    author: 'Leo Park',
    modified: '3 weeks ago',
    active: true,
    locked: false
  },
  {
    id: 'fw-login-rate',
    name: 'Rate limit sign-in',
    description: 'Allows 20 sign-in requests per minute from one address.',
    phase: 'request',
    author: 'Emily Clark',
    modified: '6 days ago',
    active: true,
    locked: false
  },
  {
    id: 'fw-geo',
    name: 'Restrict countries',
    description: 'Refuses requests from countries outside the allowed list.',
    phase: 'request',
    author: 'Sam Okafor',
    modified: '1 month ago',
    active: false,
    locked: false
  },
  {
    id: 'fw-waf-api',
    name: 'WAF on API',
    description: 'Runs the API rule set on every request to the API path.',
    phase: 'request',
    author: 'Maya Chen',
    modified: 'yesterday',
    active: true,
    locked: false
  }
]
```
