# ViewRuleList (`view/view-rule-list`)

> An ordered list of rules grouped by phase, the Rules tab of an application or a firewall. A `PageHeader` with Documentation and Add Rule sits over a search `Input` and a flush `Card` holding an `Accordion` with one item per phase (Request, Response), each trigger reading the phase and its rule count and each panel a data-driven `DataTable` (scrolling sideways when narrow) with the grip, Position, Name, Description, Status and Last modified. The table is `reorderable`: its grip drags the row or moves it with the arrow keys, Home and End, and `row-reorderable` pins the locked rule; a Position cell adds a numeric position `Input` (type a position and press Enter to move the rule there; disabled with the lock reason on the locked rule) and Move up and Move down `IconButton`s, folded on a phone into one Move `DropdownMenu` (Move to top, Move up, Move down, Move to bottom) in a Move column pinned to the end edge beside a pinned Status; every move is announced in a polite status region and focus follows the moved rule. A leading locked rule (the default rule) keeps first place and cannot be turned off; a search turns reordering off and says so in an info `Alert`. The Status cell is a `Switch` that turns a rule on or off without losing its place. Any change raises a `SaveBar` with Discard and Review changes; Review changes opens a `Dialog` listing, per phase, every rule that moves (from and to) and every rule turned on or off, with Cancel and Save, and a danger `Alert` in the dialog when the save fails. A success toast confirms the saved order. Built from `PageHeader`, `Button`, `Input`, `Alert`, `Card`, `Accordion`, `DataTable`, `IconButton`, `DropdownMenu`, `Tooltip`, `Tag`, `Switch`, `EmptyState`, `SaveBar`, `Dialog` and its parts, `PanelHeader`, `PanelBody`, `PanelFooter`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/view/view-rule-list/view-rule-list.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-rule-list")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [AttributeEditor](../../components/attribute-editor.md), [Button](../../components/button.md), [Card](../../components/card.md), [Combobox](../../components/combobox.md), [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), `FieldDescription`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [RadioGroup](../../components/radio-group.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Switch](../../components/switch.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-shortcuts`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-errors`

## Asked as

rules list; rules engine list; reorder rules; rule order; drag and drop reorder; firewall rules; request and response phases; review changes; enable disable rule; lista de regras; ordem das regras; reordenar regras; regras do firewall; fases de requisição e resposta; lista de reglas; reordenar reglas

An ordered list of rules grouped by phase: the Rules tab of an application (Request and Response phases) or a firewall (Request only). Order is behavior here, so the list is built to change the order safely: drag, keys, a typed position or Move up and Move down move a rule, every move is announced, and nothing runs in the new order until the user reviews the changes and saves.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- A resource runs an ordered program of rules and the user needs to see it, reorder it and turn rules on or off: application rules engine, firewall rules, routing rules.
- Rules split into phases that never interleave (request and response), each with its own order.
- Changes to the order must be reviewed before they apply to live traffic.

## When not to use

- Records whose order does not matter: use `view/view-table`.
- Writing or editing one rule's criteria and behaviors: use `edit/edit-rule-builder`, which this list opens from Add Rule and from a rule's name.
- Fewer than two rules that can move: show the list without the Order controls.

## Building blocks

### A. Header — `PageHeader`, `Button` (required)

`PageHeader` at `size="small"` titled Rules, with a one-sentence description that says order is behavior and that an inactive rule keeps its place. Actions: outlined Documentation, then outlined Add Rule on the outer edge.

### B. Search — `Input`, `Alert` (required)

A medium `Input` with a search icon, named "Search rules", matching name, description and author. While it holds text, an info `Alert` says reordering is off and how to turn it back on; phases with matches open, and each trigger reads "n of total".

### C. Phases — `Card`, `Accordion` (required)

A flush `Card` holding an `Accordion` with `type="multiple"`, `size="large"`, the arrow on the start side, one item per phase, all open by default. Each trigger is an `h2` reading "Request phase" with the rule count in muted tabular figures. A resource with a single phase keeps the same anatomy with one item.

### D. Rules table — `DataTable`, `Tag`, `Field`, `Switch` (required)

A data-driven `DataTable` per phase (`row-key="id"`, no sorting: order is the data's, `reorderable` with `:row-reorderable` and `@update:data`; no `stackable`: on a phone it switches to the narrow column set below): the table's own grip column (Order), Position (168 px), Name (principal, a link that opens the rule in the rule builder, with a secondary "Default" `Tag` on a locked rule), Description (muted, truncated), Status (a `Switch` named "Run <rule>" beside a visible Active or Inactive, inside a 40 px label) and Last modified ("2 days ago by Maya Chen"). The table draws the drag: the grip, the dragged row's dashed outline, the 2 px drop line and its own polite announcement ("Moved Docs rewrite to position 4 of 5."); the block only writes the new order back to its phase on `update:data`.

### E. Order controls — `Input`, `IconButton`, `Tooltip`, `DropdownMenu` (required)

The grip comes from `Table` `reorderable`: drag it, or focus it and press Arrow Up, Arrow Down, Home or End. `row-reorderable` returns false for a locked rule, while a search narrows the list and while saving, so those grips are disabled and no row can be dropped on or moved past a pinned rule. The Position cell starts with a small numeric `Input` showing the rule's position: type a number and press Enter (or leave the field) to move the rule there, clamped below the pinned rules and to the end of the phase; Escape or a value that is not a number keeps the rule in place, and after Enter focus stays in the field on the moved rule. On a locked rule, while searching and while saving the field is disabled and its name and `Tooltip` carry the reason ("Position 1 of Default rule in the Request phase. The default rule runs first and stays first."). Then the cell holds Move up and Move down `IconButton`s, the single-pointer way to reorder (WCAG 2.5.7), revealed when the row is hovered or a control in the cell has focus (always shown on a coarse pointer), so a row at rest shows the grip and the position field, not four reorder controls; each is named after its rule and, when disabled, carries the reason ("Move Default rule down. The default rule runs first and stays first."), which its `Tooltip` repeats. After a move with them, focus returns to the same button on the moved rule (the other one, or the grip, when that one is now disabled) and the block's polite status region says "Docs rewrite moved to position 3 of 5 in the Request phase."

Below 48rem of the viewport every phase table shows the same narrow column set: Name, filling the row, then the `Switch` (its Active or Inactive text kept for screen readers only) and a Move column pinned to the end edge (`frozen: 'end'`, 64 px and 56 px). Description and Last modified are left to the wide layout and the rule builder, so no phase table lets a cut column peek out between Name and Status; the Position cell folds into one medium ghost `IconButton` named "Move Docs rewrite, position 5 of 5" that opens a `DropdownMenu` with Move to top, Move up, Move down and Move to bottom, each disabled when the rule cannot go that way; the typed position and the drag grip are left to the wide layout (the table is not `reorderable` there), so a phone row carries one reorder control. Focus returns to the menu button on the moved rule.

### F. Save bar and review — `SaveBar`, `Button`, `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Alert` (required)

Any move or status change raises a `SaveBar` counting the changes, with Discard (outlined, restores the saved order and announces it) and Review changes (primary). Review changes opens a medium `Dialog` titled "Review changes": a description of what saving does, then one section per phase with an `h3` and a list of lines such as "Docs rewrite moves from position 5 to 3." and "Maintenance page is turned on." The footer has Cancel and Save; Save emits `save` with every rule in its new order, shows its loading state while `saving` is set, and the dialog cannot be dismissed while saving. On success (`saving` turns off with no `saveError`) the dialog closes, focus moves to the rules region (the Review changes button is gone) and a success toast says "Rule order saved." On failure (`saveError` set) the dialog stays open with a danger `Alert` at the top saying the rules still run in the saved order, and Save becomes Save again. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

### G. States — `EmptyState`, `Alert` (required)

Loading: triggers read Loading, the search and Add Rule are disabled and each `DataTable` shows as many skeleton rows as the phase had when it last loaded, or three, never a full page of ten, so the page does not jump when the rules land (`loading`). Load failure: the heading and the disabled search stay and a danger `Alert`, "Couldn't load the rules. Check your connection and retry.", with Retry takes the phases' place. Empty phase: a small `EmptyState` ("No request rules yet") with an outlined Add Rule. No match in a phase: a small `EmptyState` in the table's `empty` slot, "No request rule matches “cache”", with an outlined Clear search.

A rule's name is a `Button variant="link"` named "Edit <rule>" that emits `edit` with the event and the rule; the page opens `edit/edit-rule-builder` from it, as EditRule shows.

Each phase renders every rule, unpaged: paging an ordered list would hide the neighbours a move lands between. A phase is sized for the tens of rules people manage by hand; past about 200 rules, split them across phases or rule sets rather than paging one phase.

### H. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

The block takes its rules through props and emits every action; it fetches nothing. `RuleListRule`, `RuleListEdit` and `RuleListProps` are exported from `view-rule-list.vue`, and `sample.ts` holds the sample application and firewall rules the block renders when `rules` is left out (and never while `loading` or `error` is set). Moves and switches stay a local draft until Save. A new `rules` list (a rule edited or added elsewhere) updates the rows and keeps the unsaved moves and switches on top of it; a rule that was not there before lands where the list puts it and opens its phase.

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
  import ViewRuleList, { type RuleListRule } from './view-rule-list.vue'

  const { data, pending, error, refresh } = useRules()
  const { run: saveOrder, pending: saving, error: saveFailed } = useSaveRuleOrder()
  const save = (_event: MouseEvent, rules: RuleListRule[]) => saveOrder(rules)
</script>

<template>
  <ViewRuleList
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
- `⌘ S` (`Ctrl S` off Apple) opens Review changes while the rules have unsaved changes, the same as the `SaveBar`'s primary button, so the save still goes through the review; with no changes it does nothing. Review changes carries `aria-keyshortcuts` and a `Kbd` keycap.

## States

- Application: the default `subject`; Request and Response phases, a locked Default rule first in Request, one inactive rule per phase.
- Firewall: `subject="firewall"`; one Request phase, every rule movable.
- ReviewChanges: `defaultEdits` (two moves and one status change) and `defaultReviewOpen`: the save bar and the review dialog open.
- SaveError: the same with `saveError` set: the failure `Alert` and Save again.
- Searching: `defaultSearch` "cache": reordering off with its `Alert`, phases reading "n of total".
- Empty: `subject="firewall"` and `rules` `[]`: the Request phase shows its `EmptyState`.
- Loading: `loading`: skeleton rows in each phase, the search and Add Rule disabled.
- LoadError: `error` set: a danger `Alert` with Retry replaces the phases.
- EditRule: the list composed with `edit/edit-rule-builder`, opening on the builder for Docs rewrite. A rule's name is a button ("Edit Docs rewrite") that opens the builder `Drawer` as Edit Rule, seeded with the rule and its phase locked; Add Rule in the header or in an empty phase opens it as Add Rule in that phase. Saving an edit updates the row and says so in a toast; a new rule lands last in its phase with a toast that offers Edit. Neither is an order change, so the `SaveBar` still counts only moves and switches. Product pages (an application's or a firewall's Rules tab) compose the two the same way.

## Related

- `edit/edit-rule-builder` — the drawer that adds or edits one rule.
- `view/view-table` — lists whose order does not matter.
- `state/state-form-validation` (SectionRejected) — the failed-save `Alert` pattern the review dialog follows.
- `view/view-waf-tuning` — the WAF tuning list a firewall's WAF rule links to.

## Variants

- `Application` — primary (the code below)
- `Firewall` — A firewall's rules: one Request phase, five rules and no locked rule, so every rule moves; the page says rules run until one refuses the request.
- `ReviewChanges` — After two moves and one rule turned on: the SaveBar counts the changes and the Review changes dialog is open, listing Docs rewrite moving from 5 to 3 (and the rules it pushed down), Maintenance page turned on, and Security headers moving to the top of the Response phase.
- `SaveError` — The same changes after a failed save: the dialog stays open with a danger Alert saying the rules still run in the saved order, and Save reads Save again; pressing it emits `save` once more, and when `saving` turns off with no `saveError` the dialog closes with the success toast.
- `Searching` — A search for cache narrows both phases to their matches, the counts read n of total, an info Alert says reordering is off while searching, and every Order control is disabled with the reason in its name and tooltip.
- `Empty` — A firewall with no rules: the Request phase panel shows a small EmptyState with Add Rule instead of the table.
- `Loading` — While the rules load: both phases read Loading, the search is disabled, and each table shows three skeleton rows shaped like the columns.
- `LoadError` — The rules could not load: the heading and the disabled search stay, Add Rule is disabled, and a danger Alert with Retry takes the phases' place.
- `EditRule` — The list composed with `edit/edit-rule-builder`: a rule's name opens the large edit-rule-builder `Drawer` as Edit Rule, seeded with that rule's criteria and behaviors and its phase locked; Add Rule in the header (or in an empty phase) opens it as Add Rule in that phase. Saving an edit updates the row in place and confirms it in a toast; a new rule lands last in its phase, the phase opens, and the toast offers Edit. Neither changes the run order, so the SaveBar only counts moves and status switches.

Each variant is the same screen in another state: `get_block("view/view-rule-list", { variant })`, or the file under `blocks/view/view-rule-list/variants/`.

## Code (`Application`)

```vue
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import { toast } from '@aziontech/webkit/toast'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { computed, reactive, ref, watch } from 'vue'

  import { useNarrowViewport } from './composables/use-narrow-viewport'
  import { useRuleListAnnouncement } from './composables/use-rule-list-announcement'
  import { useRuleListDraft } from './composables/use-rule-list-draft'
  import { useRuleListPosition } from './composables/use-rule-list-position'
  import { useRuleListReorder } from './composables/use-rule-list-reorder'
  import {
    ALL_PHASES,
    matchesSearch,
    pageDescription,
    ruleColumns,
    type RuleListDraft
  } from './lib/rule-list'
  import RulePhaseTable from './parts/rule-phase-table.vue'
  import RuleReviewDialog from './parts/rule-review-dialog.vue'
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

  const SUBJECT = computed(() => props.subject)
  const PAGE_DESCRIPTION = computed(() => pageDescription(props.subject))
  const PHASES = computed(() =>
    props.subject === 'firewall' ? ALL_PHASES.slice(0, 1) : ALL_PHASES
  )

  const source = computed<RuleListRule[]>(
    () =>
      props.rules ??
      (props.loading || props.error
        ? []
        : props.subject === 'firewall'
          ? sampleFirewallRules
          : sampleApplicationRules)
  )
  const loadFailed = computed(() => props.error !== '')

  const draft = reactive<RuleListDraft>({ request: [], response: [] })
  const {
    dirty,
    changes,
    changeCount,
    markSaved,
    discard: discardDraft
  } = useRuleListDraft(draft, source, PHASES, () => props.defaultEdits)

  const loading = computed(() => props.loading)
  const saving = computed(() => props.saving)
  const search = ref(props.defaultSearch)
  const searchEl = ref<InstanceType<typeof Input> | null>(null)
  useShortcuts({
    keys: '/',
    label: 'Focus search',
    element: () => (searchEl.value?.$el as HTMLElement | null | undefined) ?? null,
    when: () => !props.loading && !loadFailed.value,
    handler: () => searchEl.value?.focus()
  })
  const searching = computed(() => search.value.trim().length > 0)
  const matches = (item: RuleListRule) => matchesSearch(item, search.value)

  const openPhases = ref<string[]>(PHASES.value.map((item) => item.value))
  watch(search, () => {
    if (!searching.value) return
    const hits = PHASES.value
      .filter(({ value }) => draft[value].some(matches))
      .map(({ value }) => value)
    openPhases.value = [...new Set([...openPhases.value, ...hits])]
  })
  watch(source, (next, previous) => {
    if (!previous?.length) return
    const known = new Set(previous.map((item) => item.id))
    const added = next.filter((item) => !known.has(item.id)).map((item) => item.phase)
    if (added.length) openPhases.value = [...new Set([...openPhases.value, ...added])]
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

  const listEl = ref<HTMLElement | null>(null)
  const { announcement, announce } = useRuleListAnnouncement()
  const reorder = useRuleListReorder(draft, searching, saving, listEl, announce)
  const positioning = useRuleListPosition(draft, reorder)

  const narrow = useNarrowViewport('(width < 48rem)')
  const columns = computed(() => ruleColumns(narrow.value))

  const setActive = (item: RuleListRule, value: boolean) => {
    item.active = value
  }

  const discard = () => {
    discardDraft()
    announce('Changes discarded. The rules are back in their saved order.')
  }

  const reviewOpen = ref(props.defaultReviewOpen)
  const saveFailed = ref(props.saveError !== '')
  const openReview = () => {
    saveFailed.value = false
    reviewOpen.value = true
  }
  const onSaveShortcut = () => {
    if (!dirty.value || saving.value || reviewOpen.value) return
    openReview()
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
      markSaved()
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
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/rules"
            target="_blank"
          />
          <Button
            label="Add Rule"
            icon="az az-plus"
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
              ref="searchEl"
              v-model="search"
              size="medium"
              placeholder="Search rules"
              aria-keyshortcuts="/"
              aria-label="Search rules"
              class="w-full"
              :disabled="loading || loadFailed"
            >
              <template #leading>
                <i
                  class="az az-search"
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
                <Accordion.Content :padded="false">
                  <div>
                    <RulePhaseTable
                      v-if="loading || group.total"
                      :group="group"
                      :columns="columns"
                      :loading="loading"
                      :saving="saving"
                      :narrow="narrow"
                      :search="search"
                      :reorder="reorder"
                      :positioning="positioning"
                      @edit="(event, rule) => emit('edit', event, rule)"
                      @set-active="setActive"
                      @clear-search="search = ''"
                    />
                    <EmptyState
                      v-else
                      size="small"
                      :title="`No ${group.label.toLowerCase()} rules yet`"
                      :description="`Add a rule to act on every ${group.label.toLowerCase()} this ${SUBJECT} handles.`"
                    >
                      <template #actions>
                        <Button
                          label="Add Rule"
                          icon="az az-plus"
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

      <SaveBar
        v-if="dirty"
        @save="onSaveShortcut"
      >
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
            variant="primary"
            size="medium"
            :disabled="saving"
            @click="openReview"
            aria-keyshortcuts="Meta+S Control+S"
          >
            Review changes
            <span
              class="pointer-coarse:hidden"
              aria-hidden="true"
              data-testid="shortcut-hint"
            >
              <Kbd
                meta
                size="small"
                >S</Kbd
              >
            </span>
          </Button>
        </template>
      </SaveBar>
    </div>

    <RuleReviewDialog
      v-model:open="reviewOpen"
      :changes="changes"
      :subject="SUBJECT"
      :saving="saving"
      :save-failed="saveFailed"
      :save-error="saveError"
      @save="save"
    />
  </div>
</template>
```

## `sample.ts`

```ts
import type { BehaviorDefinition, BuilderPhase, RuleDetails } from './lib/rule-builder'
import type { RuleListPhase, RuleListRule } from './view-rule-list.vue'

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

export const sampleBehaviorCatalog: BehaviorDefinition[] = [
  {
    value: 'add-request-cookie',
    label: 'Add Request Cookie',
    phases: ['request'],
    argument: { kind: 'text', field: 'target', placeholder: 'cookie-name=value', label: 'Cookie' }
  },
  {
    value: 'add-request-header',
    label: 'Add Request Header',
    phases: ['request'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'header-name: value',
      label: 'Header'
    }
  },
  {
    value: 'add-response-cookie',
    label: 'Add Response Cookie',
    phases: ['response'],
    argument: { kind: 'text', field: 'target', placeholder: 'cookie-name=value', label: 'Cookie' }
  },
  {
    value: 'add-response-header',
    label: 'Add Response Header',
    phases: ['response'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'header-name: value',
      label: 'Header'
    }
  },
  {
    value: 'apply-policy',
    label: 'Apply Policy',
    phases: ['request', 'response'],
    argument: { kind: 'select', field: 'policyId', source: 'policies', label: 'Policy' }
  },
  {
    value: 'bypass-cache',
    label: 'Bypass Cache',
    phases: ['request'],
    argument: null
  },
  {
    value: 'capture-match-groups',
    label: 'Capture Match Groups',
    phases: ['request', 'response'],
    argument: {
      kind: 'group',
      fields: [
        {
          field: 'capturedArray',
          placeholder: 'Captured array name',
          label: 'Captured array'
        },
        { field: 'subject', placeholder: 'Subject', label: 'Subject' },
        { field: 'regex', placeholder: 'Regex', label: 'Regex' }
      ]
    }
  },
  {
    value: 'deliver',
    label: 'Deliver',
    phases: ['request', 'response'],
    argument: null
  },
  {
    value: 'deny',
    label: 'Deny (403 Forbidden)',
    phases: ['request'],
    argument: null
  },
  {
    value: 'enable-gzip',
    label: 'Enable Gzip',
    phases: ['request', 'response'],
    argument: null
  },
  {
    value: 'filter-request-cookie',
    label: 'Filter Request Cookie',
    phases: ['request'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'cookie-name or cookie-name=cookie-value',
      label: 'Cookie'
    }
  },
  {
    value: 'filter-request-header',
    label: 'Filter Request Header',
    phases: ['request'],
    argument: { kind: 'text', field: 'target', placeholder: 'header-name', label: 'Header' }
  },
  {
    value: 'filter-response-cookie',
    label: 'Filter Response Cookie',
    phases: ['response'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'cookie-name or cookie-name=cookie-value',
      label: 'Cookie'
    }
  },
  {
    value: 'filter-response-header',
    label: 'Filter Response Header',
    phases: ['response'],
    argument: { kind: 'text', field: 'target', placeholder: 'header-name', label: 'Header' }
  },
  {
    value: 'forward-cookies',
    label: 'Forward Cookies',
    phases: ['request'],
    argument: null
  },
  {
    value: 'no-content',
    label: 'No Content (204)',
    phases: ['request'],
    argument: null
  },
  {
    value: 'optimize-images',
    label: 'Optimize Images',
    phases: ['request'],
    argument: null
  },
  {
    value: 'redirect-http-to-https',
    label: 'Redirect HTTP to HTTPS',
    phases: ['request'],
    argument: null
  },
  {
    value: 'redirect-301',
    label: 'Redirect To (301 Moved Permanently)',
    phases: ['request', 'response'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'https://example.com${uri}',
      label: 'Location'
    }
  },
  {
    value: 'redirect-302',
    label: 'Redirect To (302 Found)',
    phases: ['request', 'response'],
    argument: {
      kind: 'text',
      field: 'target',
      placeholder: 'https://example.com${uri}',
      label: 'Location'
    }
  },
  {
    value: 'rewrite-request',
    label: 'Rewrite Request',
    phases: ['request'],
    argument: { kind: 'text', field: 'target', placeholder: 'URL-path', label: 'Path' }
  },
  {
    value: 'route-to-service',
    label: 'Route to Service',
    phases: ['request'],
    argument: { kind: 'select', field: 'serviceId', source: 'services', label: 'Service' }
  },
  {
    value: 'set-cache-policy',
    label: 'Set Cache Policy',
    phases: ['request'],
    argument: {
      kind: 'select',
      field: 'cacheId',
      source: 'cache-settings',
      label: 'Cache policy'
    }
  }
]

export const sampleVariables = [
  '${arg_}',
  '${args}',
  '${cookie_}',
  '${domain}',
  '${geoip_city}',
  '${geoip_city_continent_code}',
  '${geoip_city_country_code}',
  '${geoip_city_country_name}',
  '${geoip_continent_code}',
  '${geoip_country_code}',
  '${geoip_country_name}',
  '${geoip_region}',
  '${geoip_region_name}',
  '${host}',
  '${http_}',
  '${remote_addr}',
  '${remote_port}',
  '${remote_user}',
  '${request}',
  '${request_body}',
  '${request_method}',
  '${request_uri}',
  '${scheme}',
  '${uri}'
]

export const samplePhaseVariables: Record<RuleListPhase, string[]> = {
  request: ['${server_addr}', '${server_port}'],
  response: [
    '${sent_http_name}',
    '${status}',
    '${tcpinfo_rtt}',
    '${upstream_addr}',
    '${upstream_cookie_}',
    '${upstream_http_}',
    '${upstream_status}'
  ]
}

export const samplePolicies = [
  { value: '4021884', label: 'auth-check', scope: 'request' },
  { value: '4021885', label: 'rate-limit', scope: 'request' },
  { value: '4021886', label: 'geo-routing', scope: 'request' },
  { value: '4021887', label: 'ab-test-split', scope: 'request' },
  { value: '4021890', label: 'security-headers', scope: 'any' }
]

export const sampleOptionSources = {
  'cache-settings': [
    { value: 'cs-default', label: 'Default Cache' },
    { value: 'cs-static', label: 'Static Assets' }
  ],
  services: [
    { value: '7710021', label: 'api-primary' },
    { value: '7710022', label: 'static-assets' },
    { value: '7710023', label: 'api-failover' },
    { value: '7710024', label: 'uploads' },
    { value: '7710025', label: 'live-events' },
    { value: '7710026', label: 'legacy-cms' },
    { value: '7710027', label: 'docs-static' }
  ]
}

export const sampleRuleDetails: Partial<Record<string, RuleDetails>> = {
  're-docs': {
    criteria: [
      {
        conditions: [{ join: null, variable: '${uri}', operator: 'matches', argument: '/docs/*' }]
      }
    ],
    behaviors: [
      { type: 'rewrite-request', target: '/documentation${uri}' },
      { type: 'set-cache-policy', cacheId: 'cs-static' }
    ]
  },
  're-www': {
    criteria: [
      {
        conditions: [
          { join: null, variable: '${host}', operator: 'is-equal', argument: 'www.example.com' }
        ]
      }
    ],
    behaviors: [{ type: 'redirect-301', target: 'https://example.com${uri}' }]
  },
  're-cache-bypass': {
    criteria: [
      {
        conditions: [{ join: null, variable: '${uri}', operator: 'starts-with', argument: '/api/' }]
      }
    ],
    behaviors: [{ type: 'bypass-cache' }]
  }
}

export const sampleBuilderPhases: BuilderPhase[] = [
  {
    value: 'request',
    label: 'Request phase',
    description: 'Configure the requests the service receives.'
  },
  {
    value: 'response',
    label: 'Response phase',
    description: 'Configure the responses sent back to clients.'
  }
]
export const sampleOperators = [
  { value: 'is-equal', label: 'is equal' },
  { value: 'is-not-equal', label: 'is not equal' },
  { value: 'starts-with', label: 'starts with' },
  { value: 'does-not-start-with', label: 'does not start with' },
  { value: 'matches', label: 'matches' },
  { value: 'does-not-match', label: 'does not match' },
  { value: 'exists', label: 'exists' },
  { value: 'does-not-exist', label: 'does not exist' }
]
```

## `composables/use-behavior-drag.ts`

```ts
import { reactive } from 'vue'

import { type DragScope, type DragState, reorderItem, type RuleForm } from '../lib/rule-builder'

/** Dragging behaviors into a new order. */
export interface UseBehaviorDragReturn {
  /** The row is the one being dragged. */
  isDragging: (scope: DragScope, index: number) => boolean
  /** The row is where the drag would drop. */
  isDropTarget: (scope: DragScope, index: number) => boolean
  /** Starts dragging a row. */
  onDragstart: (scope: DragScope, index: number, event: DragEvent) => void
  /** Ends the drag. */
  onDragend: () => void
  /** A drag enters a row of the list. */
  onListDragenter: (event: DragEvent) => void
  /** A drag moves over the list. */
  onListDragover: (event: DragEvent) => void
  /** A drag drops on a row of the list. */
  onListDrop: (event: DragEvent) => void
}

const rowIndexOf = (event: DragEvent) => {
  const row = (event.target as Element | null)?.closest?.('[data-drag-row]')
  return row instanceof HTMLElement ? Number(row.dataset.index) : -1
}

export function useBehaviorDrag(form: RuleForm): UseBehaviorDragReturn {
  const dnd = reactive<DragState>({ scope: null, from: -1, over: -1 })

  const onDragstart = (scope: DragScope, index: number, event: DragEvent) => {
    dnd.scope = scope
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      const row = (event.currentTarget as Element | null)?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 12, 12)
    }
  }
  const onDragend = () => {
    dnd.scope = null
    dnd.from = -1
    dnd.over = -1
  }

  const onListDragenter = (event: DragEvent) => {
    const index = rowIndexOf(event)
    if (index < 0) return
    event.preventDefault()
    if (dnd.scope === 'behavior') dnd.over = index
  }
  const onListDragover = (event: DragEvent) => {
    if (rowIndexOf(event) >= 0) event.preventDefault()
  }
  const onListDrop = (event: DragEvent) => {
    const index = rowIndexOf(event)
    if (index < 0 || dnd.scope !== 'behavior') return
    reorderItem(form.behaviors, dnd.from, index)
    onDragend()
  }

  return {
    isDragging: (scope, index) => dnd.scope === scope && dnd.from === index,
    isDropTarget: (scope, index) => dnd.scope === scope && dnd.over === index && dnd.from !== index,
    onDragstart,
    onDragend,
    onListDragenter,
    onListDragover,
    onListDrop
  }
}
```

## `composables/use-narrow-viewport.ts`

```ts
import { computed, type ComputedRef, onMounted, onScopeDispose, ref } from 'vue'

export function useNarrowViewport(query: string): ComputedRef<boolean> {
  const narrow = ref(false)
  const media = globalThis.matchMedia?.(query)
  const onChange = (event: MediaQueryListEvent) => {
    narrow.value = event.matches
  }
  onMounted(() => {
    if (!media) return
    narrow.value = media.matches
    media.addEventListener('change', onChange)
  })
  onScopeDispose(() => media?.removeEventListener('change', onChange))
  return computed(() => narrow.value)
}
```

## `composables/use-rule-behaviors.ts`

```ts
import { computed, type ComputedRef, reactive, watch } from 'vue'

import {
  behaviorAllowedIn,
  behaviorArgument,
  behaviorOptions,
  behaviorsFor,
  isTerminalBehavior,
  moveItem,
  type OptionSource,
  type RuleForm
} from '../lib/rule-builder'

/** One option of a behavior or argument select. */
export interface RuleBehaviorOption {
  /** The value. */
  value: string
  /** The label. */
  label: string
}

/** The behaviors list of the rule builder. */
export interface UseRuleBehaviorsReturn {
  /** The search text of each behavior select, by behavior id. */
  behaviorQuery: Record<number, string>
  /** The behaviors the search keeps for one select. */
  behaviorMatches: (id: number) => RuleBehaviorOption[]
  /** Clears a select's search when it closes. */
  onBehaviorPanel: (id: number, isOpen: boolean) => void
  /** The options of an argument source in the form's phase. */
  optionsFor: (source: OptionSource) => RuleBehaviorOption[]
  /** The label of an argument value. */
  optionLabelIn: (source: OptionSource, value: unknown) => string
  /** Changes a behavior's type and clears its arguments. */
  setBehaviorType: (index: number, type: string) => void
  /** Another behavior can be added. */
  canAddBehavior: ComputedRef<boolean>
  /** Adds a behavior at the end. */
  addBehavior: () => void
  /** Removes a behavior, never the last one. */
  removeBehavior: (index: number) => void
  /** Moves a behavior one step. */
  moveBehavior: (index: number, direction: number) => void
}

const keepInPhase = (form: RuleForm, phase: RuleForm['phase']) => {
  form.behaviors.forEach((behavior, index) => {
    if (!behaviorAllowedIn(behavior.type, phase)) {
      form.behaviors[index] = { id: behavior.id, type: 'deliver' }
      return
    }
    const argument = behaviorArgument(behavior.type)
    if (argument?.kind !== 'select') return
    const stillOffered = behaviorOptions(argument.source, phase).some(
      (option) => option.value === behavior[argument.field]
    )
    if (!stillOffered) behavior[argument.field] = ''
  })
}

export function useRuleBehaviors(
  form: RuleForm,
  newBehavior: () => RuleForm['behaviors'][number]
): UseRuleBehaviorsReturn {
  const behaviorsForPhase = computed(() =>
    behaviorsFor(form.phase).map(({ value, label }) => ({ value, label }))
  )
  const behaviorQuery = reactive<Record<number, string>>({})
  const behaviorMatches = (id: number) => {
    const query = (behaviorQuery[id] ?? '').trim().toLowerCase()
    if (!query) return behaviorsForPhase.value
    return behaviorsForPhase.value.filter((option) => option.label.toLowerCase().includes(query))
  }

  const optionsFor = (source: OptionSource) => behaviorOptions(source, form.phase)

  watch(
    () => form.phase,
    (phase) => keepInPhase(form, phase)
  )

  return {
    behaviorQuery,
    behaviorMatches,
    onBehaviorPanel: (id, isOpen) => {
      if (!isOpen) behaviorQuery[id] = ''
    },
    optionsFor,
    optionLabelIn: (source, value) =>
      optionsFor(source).find((option) => option.value === value)?.label ?? '',
    setBehaviorType: (index, type) => {
      if (form.behaviors[index].type === type) return
      form.behaviors[index] = { id: form.behaviors[index].id, type }
    },
    canAddBehavior: computed(() => {
      if (form.behaviors.length >= 10) return false
      return !isTerminalBehavior(form.behaviors[form.behaviors.length - 1]?.type)
    }),
    addBehavior: () => {
      form.behaviors.push(newBehavior())
    },
    removeBehavior: (index) => {
      if (form.behaviors.length <= 1) return
      form.behaviors.splice(index, 1)
    },
    moveBehavior: (index, direction) => moveItem(form.behaviors, index, direction)
  }
}
```

## `composables/use-rule-builder-form.ts`

```ts
import { computed, type ComputedRef, nextTick, type Ref, ref, watch } from 'vue'

import {
  type ArgumentField,
  type Behavior,
  formIsValid,
  type RuleForm,
  type RuleSeed
} from '../lib/rule-builder'
import type { RuleListPhase } from '../view-rule-list.vue'

/** The rule builder form's validation and submit. */
export interface UseRuleBuilderFormReturn {
  /** The submit is in flight. */
  submitting: ComputedRef<boolean>
  /** The name is missing after a submit. */
  nameError: ComputedRef<boolean>
  /** The criteria errors per group and condition after a submit. */
  criteriaErrors: ComputedRef<Record<string, string>[][]>
  /** A required behavior argument is empty after a submit. */
  argumentMissing: (behavior: Behavior, field: ArgumentField) => boolean
  /** Validates, then saves after a short delay. */
  submit: () => void
}

/** What the form opens with. */
export interface RuleBuilderSeed {
  /** The drawer is open. */
  open: Ref<boolean>
  /** The rule being edited, or nothing for a new one. */
  seed: () => RuleSeed | null
  /** The phase a new rule starts in. */
  newPhase: () => RuleListPhase
  /** Builds the form for a seed. */
  formFor: (seed: RuleSeed | null) => RuleForm
}

const INVALID_FIELD =
  ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'

export function useRuleBuilderForm(
  form: RuleForm,
  { open, seed, newPhase, formFor }: RuleBuilderSeed,
  formEl: Ref<HTMLElement | null>,
  onDone: () => void
): UseRuleBuilderFormReturn {
  const submitted = ref(false)
  const submitting = ref(false)

  watch(
    open,
    (isOpen) => {
      if (!isOpen) return
      Object.assign(form, formFor(seed()))
      if (!seed()) form.phase = newPhase()
      submitted.value = false
    },
    { immediate: true }
  )

  const submit = () => {
    submitted.value = true
    if (submitting.value) return
    if (!formIsValid(form)) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>(INVALID_FIELD)?.focus())
      return
    }
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
      onDone()
    }, 900)
  }

  return {
    submitting: computed(() => submitting.value),
    nameError: computed(() => submitted.value && !form.name.trim()),
    criteriaErrors: computed(() =>
      submitted.value
        ? form.criteria.map((group) =>
            group.map((condition): Record<string, string> =>
              condition.variable.trim() ? {} : { variable: 'Enter the variable to compare.' }
            )
          )
        : []
    ),
    argumentMissing: (behavior, field) => submitted.value && !String(behavior[field] ?? '').trim(),
    submit
  }
}
```

## `composables/use-rule-editing.ts`

```ts
import { toast } from '@aziontech/webkit/toast'
import { computed, type ComputedRef, ref, type WritableComputedRef } from 'vue'

import { type RuleForm, type RuleSeed, seedFor } from '../lib/rule-builder'
import { phaseLabel } from '../lib/rule-list'
import { sampleApplicationRules } from '../sample'
import type { RuleListPhase, RuleListRule } from '../view-rule-list.vue'

/** The rules of the Edit Rule variant and the rule open in the builder. */
export interface UseRuleEditingReturn {
  /** The rules, as saved. */
  rules: ComputedRef<RuleListRule[]>
  /** The order is saving. */
  saving: ComputedRef<boolean>
  /** The builder is open. */
  builderOpen: WritableComputedRef<boolean>
  /** The rule open in the builder, or nothing for a new one. */
  editingRule: ComputedRef<RuleSeed | null>
  /** The phase a new rule starts in. */
  newRulePhase: ComputedRef<RuleListPhase>
  /** Saves the new order after a short delay. */
  onSave: (event: MouseEvent, next: RuleListRule[]) => void
  /** Opens a rule in the builder. */
  openRule: (row: RuleListRule | null) => void
  /** Opens the builder for a new rule. */
  addRule: (phase?: RuleListPhase) => void
  /** Takes what the builder saved. */
  applyRule: (form: RuleForm) => void
}

const updatedRule = (row: RuleListRule, form: RuleForm): RuleListRule => ({
  ...row,
  name: form.name.trim(),
  description: form.description.trim(),
  active: form.active,
  modified: 'just now',
  author: 'You'
})

const createdRule = (id: string, form: RuleForm): RuleListRule => ({
  id,
  name: form.name.trim(),
  description: form.description.trim(),
  phase: form.phase,
  author: 'You',
  modified: 'just now',
  active: form.active,
  locked: false
})

export function useRuleEditing(): UseRuleEditingReturn {
  const rules = ref<RuleListRule[]>(sampleApplicationRules.map((item) => ({ ...item })))
  const saving = ref(false)
  const builderOpen = ref(false)
  const editingRule = ref<RuleSeed | null>(null)
  const editingRow = ref<RuleListRule | null>(null)
  const newRulePhase = ref<RuleListPhase>('request')
  let createdCount = 0

  const openRule = (row: RuleListRule | null) => {
    editingRow.value = row
    editingRule.value = row ? seedFor(row) : null
    builderOpen.value = true
  }

  const applyRule = (form: RuleForm) => {
    const row = editingRow.value
    if (row) {
      const updated = updatedRule(row, form)
      rules.value = rules.value.map((item) => (item.id === row.id ? updated : item))
      toast.success(`${updated.name} saved.`, {
        description: 'The rule runs with its new criteria and behaviors.'
      })
      return
    }
    const created = createdRule(`re-new-${(createdCount += 1)}`, form)
    rules.value = [...rules.value, created]
    toast.success(`${created.name} added.`, {
      description: `It runs last in the ${phaseLabel(form.phase)} phase. Move it to change when it runs.`,
      actions: [{ label: 'Edit', onClick: () => openRule(created) }]
    })
  }

  return {
    rules: computed(() => rules.value),
    saving: computed(() => saving.value),
    builderOpen: computed({
      get: () => builderOpen.value,
      set: (value) => {
        builderOpen.value = value
      }
    }),
    editingRule: computed(() => editingRule.value),
    newRulePhase: computed(() => newRulePhase.value),
    onSave: (_event, next) => {
      if (saving.value) return
      saving.value = true
      setTimeout(() => {
        rules.value = next
        saving.value = false
      }, 900)
    },
    openRule,
    addRule: (phase = 'request') => {
      newRulePhase.value = phase
      openRule(null)
    },
    applyRule
  }
}
```

## `composables/use-rule-list-announcement.ts`

```ts
import { computed, type ComputedRef, nextTick, ref } from 'vue'

/** The message the list's live region reads out. */
export interface UseRuleListAnnouncementReturn {
  /** The last message. */
  announcement: ComputedRef<string>
  /** Reads a message out, even when it repeats. */
  announce: (text: string) => void
}

export function useRuleListAnnouncement(): UseRuleListAnnouncementReturn {
  const announcement = ref('')
  const announce = (text: string) => {
    announcement.value = ''
    nextTick(() => {
      announcement.value = text
    })
  }
  return { announcement: computed(() => announcement.value), announce }
}
```

## `composables/use-rule-list-draft.ts`

```ts
import { computed, type ComputedRef, type MaybeRefOrGetter, ref, toValue, watch } from 'vue'

import {
  ALL_PHASES,
  applyEdits,
  changesOf,
  keepUnsaved,
  type RuleListDraft,
  type RuleListPhaseChanges,
  type RuleListPhaseOption,
  type RuleListSnapshot,
  snapshotOf
} from '../lib/rule-list'
import type { RuleListEdit, RuleListRule } from '../view-rule-list.vue'

/** The saved order of the rules and the edits made since. */
export interface UseRuleListDraftReturn {
  /** The draft differs from the saved order or status. */
  dirty: ComputedRef<boolean>
  /** The changes per phase, for the review dialog. */
  changes: ComputedRef<RuleListPhaseChanges[]>
  /** How many changes there are. */
  changeCount: ComputedRef<number>
  /** Takes the draft as the saved state. */
  markSaved: () => void
  /** Puts the draft back in the saved order and status. */
  discard: () => void
}

export function useRuleListDraft(
  draft: RuleListDraft,
  source: MaybeRefOrGetter<RuleListRule[]>,
  phases: MaybeRefOrGetter<RuleListPhaseOption[]>,
  defaultEdits: MaybeRefOrGetter<RuleListEdit[]>
): UseRuleListDraftReturn {
  const snapshot = () => snapshotOf(draft, toValue(phases))
  const saved = ref<RuleListSnapshot>(snapshot())

  let seeded = false
  watch(
    () => toValue(source),
    (next) => {
      const before = seeded ? snapshot() : null
      const savedBefore = saved.value
      for (const { value } of ALL_PHASES) {
        draft[value] = next.filter((item) => item.phase === value).map((item) => ({ ...item }))
      }
      saved.value = snapshot()
      if (before) keepUnsaved(draft, before, savedBefore, saved.value)
      if (!seeded && next.length) {
        seeded = true
        applyEdits(draft, toValue(defaultEdits))
      }
    },
    { immediate: true }
  )

  const dirty = computed(() => JSON.stringify(snapshot()) !== JSON.stringify(saved.value))
  const changes = computed(() => changesOf(draft, saved.value, toValue(phases)))
  const changeCount = computed(() =>
    changes.value.reduce((sum, phase) => sum + phase.items.length, 0)
  )

  const discard = () => {
    for (const { value } of toValue(phases)) {
      const byId = Object.fromEntries(draft[value].map((item) => [item.id, item]))
      draft[value] = saved.value.order[value].map((id) => byId[id]).filter(Boolean)
      for (const item of draft[value]) item.active = saved.value.active[item.id]
    }
  }

  const markSaved = () => {
    saved.value = snapshot()
  }

  return { dirty, changes, changeCount, markSaved, discard }
}
```

## `composables/use-rule-list-position.ts`

```ts
import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
import { type Ref, ref } from 'vue'

import type { RuleListControl, RuleListDraft } from '../lib/rule-list'
import type { RuleListPhase, RuleListRule } from '../view-rule-list.vue'

/** The typed position of a rule, kept until it is committed. */
export interface UseRuleListPositionReturn {
  /** The value the position field shows. */
  positionValue: (phase: RuleListPhase, item: RuleListRule) => string
  /** Keeps what was typed. */
  onPositionInput: (item: RuleListRule, value: string) => void
  /** Moves the rule to the typed position. */
  commitPosition: (phase: RuleListPhase, item: RuleListRule, refocus: boolean) => void
  /** Forgets what was typed. */
  cancelPosition: () => void
  /** Runs the move the narrow menu picked. */
  onMoveSelect: (phase: RuleListPhase, item: RuleListRule, value: DropdownMenuItemValue) => void
}

/** The moves the position controls run. */
export interface RuleListMoves {
  /** How many locked rules lead the phase. */
  pinned: (phase: RuleListPhase) => number
  /** The zero-based position of the rule in its phase. */
  position: (phase: RuleListPhase, item: RuleListRule) => number
  /** Moves a rule to a position. */
  moveTo: (phase: RuleListPhase, from: number, to: number, control?: RuleListControl) => void
  /** Moves a rule one step. */
  step: (phase: RuleListPhase, index: number, direction: number, control?: RuleListControl) => void
}

export function useRuleListPosition(
  draft: RuleListDraft,
  { pinned, position, moveTo, step }: RuleListMoves
): UseRuleListPositionReturn {
  const typed: Ref<{ value: string; id: string } | null> = ref(null)

  const positionValue = (phase: RuleListPhase, item: RuleListRule) =>
    typed.value?.id === item.id ? typed.value.value : String(position(phase, item) + 1)

  const onPositionInput = (item: RuleListRule, value: string) => {
    typed.value = { value, id: item.id }
  }

  const commitPosition = (phase: RuleListPhase, item: RuleListRule, refocus: boolean) => {
    const entry = typed.value
    typed.value = null
    if (!entry || entry.id !== item.id) return
    const target = Number.parseInt(entry.value, 10)
    if (!Number.isFinite(target)) return
    moveTo(phase, position(phase, item), target - 1, refocus ? 'position' : undefined)
  }

  const onMoveSelect = (phase: RuleListPhase, item: RuleListRule, value: DropdownMenuItemValue) => {
    const from = position(phase, item)
    if (value === 'top') moveTo(phase, from, pinned(phase), 'menu')
    if (value === 'up') step(phase, from, -1, 'menu')
    if (value === 'down') step(phase, from, 1, 'menu')
    if (value === 'bottom') moveTo(phase, from, draft[phase].length - 1, 'menu')
  }

  return {
    onMoveSelect,
    positionValue,
    onPositionInput,
    commitPosition,
    cancelPosition: () => {
      typed.value = null
    }
  }
}
```

## `composables/use-rule-list-reorder.ts`

```ts
import { type ComputedRef, nextTick, type Ref } from 'vue'

import { phaseLabel, pinnedCount, type RuleListControl, type RuleListDraft } from '../lib/rule-list'
import type { RuleListPhase, RuleListRule } from '../view-rule-list.vue'

/** Moving rules within their phase, and what each move says. */
export interface UseRuleListReorderReturn {
  /** How many locked rules lead the phase. */
  pinned: (phase: RuleListPhase) => number
  /** The rule at this index can move one step this way. */
  canMove: (phase: RuleListPhase, index: number, direction: number) => boolean
  /** Why the rule cannot move, or nothing. */
  lockReason: (phase: RuleListPhase, item: RuleListRule) => string
  /** The zero-based position of the rule in its phase. */
  position: (phase: RuleListPhase, item: RuleListRule) => number
  /** Moves a rule to a position. */
  moveTo: (phase: RuleListPhase, from: number, to: number, control?: RuleListControl) => void
  /** Moves a rule one step. */
  step: (phase: RuleListPhase, index: number, direction: number, control?: RuleListControl) => void
  /** Takes the order the table was dragged into. */
  reorderRows: (phase: RuleListPhase, next: RuleListRule[]) => void
  /** Whether the table lets a row be dragged. */
  reorderable: (phase: RuleListPhase) => (row: RuleListRule) => boolean
}

const lockText = {
  locked: 'The default rule runs first and stays first.',
  searching: 'Clear the search to change the order rules run in.',
  saving: 'Wait for the save to finish.',
  alone: 'There is no other rule in this phase to move it past.'
}

const focusControl = (listEl: Ref<HTMLElement | null>, id: string, control: RuleListControl) =>
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

export function useRuleListReorder(
  draft: RuleListDraft,
  searching: ComputedRef<boolean>,
  saving: ComputedRef<boolean>,
  listEl: Ref<HTMLElement | null>,
  announce: (text: string) => void
): UseRuleListReorderReturn {
  const pinned = (phase: RuleListPhase) => pinnedCount(draft[phase])
  const canReorder = (phase: RuleListPhase) =>
    !searching.value && !saving.value && draft[phase].length - pinned(phase) > 1
  const canMove = (phase: RuleListPhase, index: number, direction: number) => {
    if (!canReorder(phase) || index < pinned(phase)) return false
    const to = index + direction
    return to >= pinned(phase) && to < draft[phase].length
  }
  const lockReason = (phase: RuleListPhase, item: RuleListRule) => {
    if (item.locked) return lockText.locked
    if (searching.value) return lockText.searching
    if (saving.value) return lockText.saving
    if (!canReorder(phase)) return lockText.alone
    return ''
  }

  const moveTo = (phase: RuleListPhase, from: number, to: number, control?: RuleListControl) => {
    const list = draft[phase]
    const head = pinned(phase)
    const target = Math.min(Math.max(to, head), list.length - 1)
    if (from < head || target === from || !canReorder(phase)) return
    const [moved] = list.splice(from, 1)
    list.splice(target, 0, moved)
    announce(
      `${moved.name} moved to position ${target + 1} of ${list.length} in the ${phaseLabel(phase)} phase.`
    )
    if (control) focusControl(listEl, moved.id, control)
  }
  const step = (
    phase: RuleListPhase,
    index: number,
    direction: number,
    control?: RuleListControl
  ) => {
    if (!canMove(phase, index, direction)) return
    moveTo(phase, index, index + direction, control)
  }
  const position = (phase: RuleListPhase, item: RuleListRule) => draft[phase].indexOf(item)

  return {
    pinned,
    canMove,
    lockReason,
    position,
    moveTo,
    step,
    reorderRows: (phase, next) => {
      if (searching.value) return
      draft[phase] = next
    },
    reorderable: (phase) => (row) => !lockReason(phase, row)
  }
}
```

## `lib/rule-builder.ts`

```ts
import {
  sampleBehaviorCatalog,
  sampleBuilderPhases as BUILDER_PHASES,
  sampleOperators as OPERATORS,
  sampleOptionSources,
  samplePhaseVariables,
  samplePolicies,
  sampleRuleDetails,
  sampleVariables
} from '../sample'
import type { RuleListPhase, RuleListRule } from '../view-rule-list.vue'

export type OptionSource = 'policies' | 'cache-settings' | 'services'
export type ArgumentField =
  'target' | 'policyId' | 'serviceId' | 'cacheId' | 'capturedArray' | 'subject' | 'regex'
export type DragScope = 'behavior'

export interface BuilderPhase {
  value: RuleListPhase
  label: string
  description: string
}

export interface TextArgument {
  kind: 'text'
  field: ArgumentField
  placeholder: string
  label: string
}

export interface SelectArgument {
  kind: 'select'
  field: ArgumentField
  source: OptionSource
  label: string
}

export interface GroupField {
  field: ArgumentField
  placeholder: string
  label: string
}

export interface GroupArgument {
  kind: 'group'
  fields: GroupField[]
}

export type BehaviorArgument = TextArgument | SelectArgument | GroupArgument

export interface BehaviorDefinition {
  value: string
  label: string
  phases: RuleListPhase[]
  argument: BehaviorArgument | null
}

export type BehaviorFields = Partial<Record<ArgumentField, string>>

export interface BehaviorSeed extends BehaviorFields {
  type: string
}

export interface Behavior extends BehaviorSeed {
  id: number
}

export type Condition = {
  id: number
  variable: string
  operator: string
  argument: string
}

export interface SeedCondition {
  join: string | null
  variable: string
  operator: string
  argument: string
}

export interface RuleDetails {
  criteria: { conditions: SeedCondition[] }[]
  behaviors: BehaviorSeed[]
}

export interface RuleSeed extends RuleDetails {
  name: string
  description: string
  phase: RuleListPhase
  status: string
}

export interface RuleForm {
  name: string
  description: string
  phase: RuleListPhase
  criteria: Condition[][]
  behaviors: Behavior[]
  active: boolean
}

export interface DragState {
  scope: DragScope | null
  from: number
  over: number
}

export { BUILDER_PHASES, OPERATORS }

export const criteriaColumns = [
  { key: 'variable', label: 'Variable', required: true },
  { key: 'operator', label: 'Operator' },
  { key: 'argument', label: 'Argument' }
]

const byValue = Object.fromEntries(
  sampleBehaviorCatalog.map((behavior) => [behavior.value, behavior])
)

export const operatorLabel = (value: string) =>
  OPERATORS.find((o) => o.value === value)?.label ?? ''
export const takesArgument = (operator: string) =>
  operator !== 'exists' && operator !== 'does-not-exist'
export const behaviorLabel = (value: string) => byValue[value]?.label ?? ''
export const behaviorArgument = (value: string) => byValue[value]?.argument ?? null
export const textArgument = (value: string) => behaviorArgument(value) as TextArgument
export const selectArgument = (value: string) => behaviorArgument(value) as SelectArgument
export const groupArgument = (value: string) => behaviorArgument(value) as GroupArgument
export const behaviorsFor = (phase: RuleListPhase) =>
  sampleBehaviorCatalog.filter((behavior) => behavior.phases.includes(phase))
export const behaviorAllowedIn = (value: string, phase: RuleListPhase) =>
  Boolean(byValue[value]?.phases.includes(phase))
export const isTerminalBehavior = (value: string) =>
  ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302'].includes(value)
export const behaviorOptions = (source: OptionSource, phase: RuleListPhase) => {
  if (source === 'policies') {
    return samplePolicies
      .filter((policy) => phase !== 'response' || policy.scope === 'any')
      .map(({ value, label }) => ({ value, label }))
  }
  return sampleOptionSources[source] ?? []
}
export const behaviorArgumentNote = (source: OptionSource, phase: RuleListPhase) =>
  source === 'policies' && phase === 'response'
    ? 'Only policies scoped to any phase run in the response phase.'
    : ''
export const variablesFor = (phase: RuleListPhase) =>
  [...sampleVariables, ...samplePhaseVariables[phase]]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value }))

const behaviorFilled = (behavior: Behavior) => {
  const argument = behaviorArgument(behavior.type)
  if (!argument) return true
  const fields: { field: ArgumentField }[] =
    argument.kind === 'group' ? argument.fields : [argument]
  return fields.every(({ field }) => String(behavior[field] ?? '').trim())
}

export const formIsValid = (form: RuleForm) =>
  Boolean(form.name.trim()) &&
  form.criteria.every((group) => group.every((condition) => condition.variable.trim())) &&
  form.behaviors.length > 0 &&
  form.behaviors.every(behaviorFilled)

export const moveItem = <T>(list: T[], index: number, direction: number) => {
  const target = index + direction
  if (target < 0 || target >= list.length) return
  const [moved] = list.splice(index, 1)
  list.splice(target, 0, moved)
}

export const reorderItem = <T>(list: T[], from: number, to: number) => {
  if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)
}

const fallbackDetails = (row: RuleListRule): RuleDetails => ({
  criteria: [
    {
      conditions: [{ join: null, variable: '${uri}', operator: 'starts-with', argument: '/' }]
    }
  ],
  behaviors: [{ type: row.phase === 'response' ? 'enable-gzip' : 'deliver' }]
})

export const seedFor = (row: RuleListRule): RuleSeed => ({
  name: row.name,
  description: row.description,
  phase: row.phase,
  ...(sampleRuleDetails[row.id] ?? fallbackDetails(row)),
  status: row.active ? 'Active' : 'Inactive'
})

export const BEHAVIOR_ROW_CLASS =
  'relative grid grid-cols-1 items-start gap-(--spacing-xs) rounded-(--shape-card) transition-[opacity,scale,outline-color] ' +
  'motion-reduce:transition-none ' +
  'data-dragging:scale-[0.98] data-dragging:opacity-70 data-dragging:outline-2 data-dragging:outline-(--accent) data-dragging:outline-dashed ' +
  'data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-0 data-drop:before:-top-(--spacing-2xs) data-drop:before:border-t-2 ' +
  "data-drop:before:border-(--accent) data-drop:before:content-[''] " +
  'sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'

export const DRAG_HANDLE_CLASS =
  'inline-flex size-10 shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) outline-none transition-colors ' +
  'hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing motion-reduce:transition-none'

export const ruleFormFactory = () => {
  let nextId = 0
  const uid = () => (nextId += 1)
  const newCondition = (): Condition => ({
    id: uid(),
    variable: '',
    operator: 'is-equal',
    argument: ''
  })
  const newBehavior = (): Behavior => ({ id: uid(), type: 'deliver' })
  const blankForm = (): RuleForm => ({
    name: '',
    description: '',
    phase: BUILDER_PHASES[0].value,
    criteria: [[newCondition()]],
    behaviors: [newBehavior()],
    active: true
  })
  const formFor = (seed: RuleSeed | null): RuleForm =>
    !seed
      ? blankForm()
      : {
          name: seed.name,
          description: seed.description,
          phase: seed.phase,
          criteria: seed.criteria.map((group) =>
            group.conditions.map(({ variable, operator, argument }) => ({
              id: uid(),
              variable,
              operator,
              argument
            }))
          ),
          behaviors: seed.behaviors.map((behavior) => ({ ...behavior, id: uid() })),
          active: seed.status === 'Active'
        }
  return { newCondition, newBehavior, blankForm, formFor }
}
```

## `lib/rule-list.ts`

```ts
import type { TableColumn } from '@aziontech/webkit/data-table'

import type { RuleListEdit, RuleListPhase, RuleListRule } from '../view-rule-list.vue'

/** A phase and its label. */
export interface RuleListPhaseOption {
  /** The phase. */
  value: RuleListPhase
  /** Its label. */
  label: string
}

/** The saved order and status of every rule. */
export interface RuleListSnapshot {
  /** Rule ids per phase, in run order. */
  order: Record<string, string[]>
  /** Whether each rule runs, by id. */
  active: Record<string, boolean>
}

/** One line of the review dialog. */
export interface RuleListChangeLine {
  /** Stable key. */
  key: string
  /** The rule's name. */
  name: string
  /** What changed. */
  text: string
}

/** The changes of one phase. */
export interface RuleListPhaseChanges extends RuleListPhaseOption {
  /** Its lines. */
  items: RuleListChangeLine[]
}

/** The rules of every phase, as edited. */
export type RuleListDraft = Record<RuleListPhase, RuleListRule[]>

/** The control that moved a rule, to focus it again. */
export type RuleListControl = 'up' | 'down' | 'position' | 'menu'

export const ALL_PHASES: RuleListPhaseOption[] = [
  { value: 'request', label: 'Request' },
  { value: 'response', label: 'Response' }
]

export const phaseLabel = (phase: RuleListPhase) =>
  ALL_PHASES.find((item) => item.value === phase)?.label ?? phase

export const snapshotOf = (
  draft: RuleListDraft,
  phases: RuleListPhaseOption[]
): RuleListSnapshot => ({
  order: Object.fromEntries(phases.map(({ value }) => [value, draft[value].map((r) => r.id)])),
  active: Object.fromEntries(
    phases.flatMap(({ value }) => draft[value].map((r) => [r.id, r.active]))
  )
})

export const applyEdits = (draft: RuleListDraft, edits: RuleListEdit[]) => {
  for (const edit of edits) {
    const list = draft[edit.phase]
    const from = list.findIndex((item) => item.id === edit.id)
    if (from < 0) continue
    if (edit.to !== undefined) list.splice(edit.to, 0, ...list.splice(from, 1))
    if (edit.active !== undefined)
      list[list.findIndex((item) => item.id === edit.id)].active = edit.active
  }
}

const keepOrder = (draft: RuleListDraft, phase: RuleListPhase, order: string[]) => {
  const rank = (id: string) => {
    const at = order.indexOf(id)
    return at < 0 ? order.length : at
  }
  draft[phase] = [...draft[phase]].sort((a, b) => rank(a.id) - rank(b.id))
}

export const keepUnsaved = (
  draft: RuleListDraft,
  before: RuleListSnapshot,
  savedBefore: RuleListSnapshot,
  savedNow: RuleListSnapshot
) => {
  for (const { value } of ALL_PHASES) {
    const order = before.order[value] ?? []
    if (order.join() !== (savedBefore.order[value] ?? []).join()) keepOrder(draft, value, order)
    for (const item of draft[value]) {
      const local = before.active[item.id]
      const changedHere = local !== undefined && local !== savedBefore.active[item.id]
      if (changedHere && savedNow.active[item.id] === savedBefore.active[item.id])
        item.active = local
    }
  }
}

const changeLines = (
  item: RuleListRule,
  index: number,
  phase: RuleListPhase,
  saved: RuleListSnapshot
) => {
  const lines: RuleListChangeLine[] = []
  const before = saved.order[phase].indexOf(item.id)
  if (before !== index) {
    lines.push({
      key: `${item.id}-order`,
      name: item.name,
      text: `moves from position ${before + 1} to ${index + 1}`
    })
  }
  if (saved.active[item.id] !== item.active) {
    lines.push({
      key: `${item.id}-status`,
      name: item.name,
      text: item.active ? 'is turned on' : 'is turned off'
    })
  }
  return lines
}

export const changesOf = (
  draft: RuleListDraft,
  saved: RuleListSnapshot,
  phases: RuleListPhaseOption[]
): RuleListPhaseChanges[] =>
  phases
    .map((phase) => ({
      ...phase,
      items: draft[phase.value].flatMap((item, index) =>
        changeLines(item, index, phase.value, saved)
      )
    }))
    .filter((phase) => phase.items.length)

export const pinnedCount = (list: RuleListRule[]) => {
  let count = 0
  while (count < list.length && list[count].locked) count += 1
  return count
}

export const matchesSearch = (item: RuleListRule, search: string) => {
  const term = search.trim().toLowerCase()
  if (!term) return true
  return [item.name, item.description, item.author].some((field) =>
    field.toLowerCase().includes(term)
  )
}

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

export const ruleColumns = (narrow: boolean): TableColumn[] =>
  narrow
    ? [
        nameColumn,
        { ...statusColumn, width: 64, frozen: 'end' },
        { ...moveColumn, header: 'Move', width: 56, align: 'center', frozen: 'end' }
      ]
    : [
        { ...moveColumn, width: 168 },
        nameColumn,
        descriptionColumn,
        { ...statusColumn, width: 152 },
        modifiedColumn
      ]

export const pageDescription = (subject: string) =>
  subject === 'firewall'
    ? 'Rules run top to bottom on every request this firewall sees, until one of them refuses it. Turn a rule off to skip it without losing its place.'
    : 'Rules run top to bottom within each phase, so their order is their behavior. Turn a rule off to skip it without losing its place.'
```

## `parts/rule-behaviors-card.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldDescription from '@aziontech/webkit/field-description'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref, watch } from 'vue'

  import type { UseBehaviorDragReturn } from '../composables/use-behavior-drag'
  import type { UseRuleBehaviorsReturn } from '../composables/use-rule-behaviors'
  import {
    type ArgumentField,
    type Behavior,
    BEHAVIOR_ROW_CLASS,
    behaviorArgument,
    behaviorArgumentNote,
    behaviorLabel,
    DRAG_HANDLE_CLASS,
    groupArgument,
    type RuleForm,
    selectArgument,
    textArgument
  } from '../lib/rule-builder'

  export interface RuleBehaviorsCardProps {
    /** The rule form. */
    form: RuleForm
    /** The form is saving. */
    submitting: boolean
    /** A required argument is empty after a submit. */
    argumentMissing: (behavior: Behavior, field: ArgumentField) => boolean
    /** The behaviors list. */
    list: UseRuleBehaviorsReturn
    /** Dragging behaviors into a new order. */
    drag: UseBehaviorDragReturn
  }

  const props = defineProps<RuleBehaviorsCardProps>()

  const {
    behaviorQuery,
    behaviorMatches,
    onBehaviorPanel,
    optionsFor,
    optionLabelIn,
    setBehaviorType,
    canAddBehavior,
    addBehavior,
    removeBehavior,
    moveBehavior
  } = props.list
  const {
    isDragging,
    isDropTarget,
    onDragstart,
    onDragend,
    onListDragenter,
    onListDragover,
    onListDrop
  } = props.drag

  const listEl = ref<HTMLElement | null>(null)
  watch(
    listEl,
    (el, _previous, onCleanup) => {
      if (!el) return
      el.addEventListener('dragenter', onListDragenter)
      el.addEventListener('dragover', onListDragover)
      el.addEventListener('drop', onListDrop)
      onCleanup(() => {
        el.removeEventListener('dragenter', onListDragenter)
        el.removeEventListener('dragover', onListDragover)
        el.removeEventListener('drop', onListDrop)
      })
    },
    { flush: 'sync' }
  )
</script>

<template>
  <Card :padded="false">
    <template #default>
      <div
        class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
      >
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
          <div class="flex items-center gap-(--spacing-xs)">
            <span class="text-overline-sm text-(--text-muted)">Then</span>
            <span class="h-px flex-1 bg-(--border-default)" />
          </div>

          <div
            ref="listEl"
            class="relative flex flex-col gap-(--spacing-sm)"
          >
            <div
              v-for="(behavior, bIdx) in form.behaviors"
              :key="behavior.id"
              data-drag-row
              :data-index="bIdx"
              :data-dragging="isDragging('behavior', bIdx) || null"
              :data-drop="isDropTarget('behavior', bIdx) || null"
              :class="BEHAVIOR_ROW_CLASS"
            >
              <div class="w-full min-w-0">
                <Select
                  :model-value="behavior.type"
                  size="large"
                  class="w-full"
                  :disabled="submitting"
                  :display-value="behaviorLabel"
                  @update:model-value="setBehaviorType(bIdx, $event)"
                  @update:open="onBehaviorPanel(behavior.id, $event)"
                >
                  <Select.Trigger aria-label="Behavior" />
                  <Select.Content>
                    <template #search>
                      <Input
                        v-model="behaviorQuery[behavior.id]"
                        size="medium"
                        class="w-full"
                        placeholder="Search behaviors"
                        aria-label="Search behaviors"
                        @keydown.stop
                      >
                        <template #leading>
                          <i
                            class="az az-search"
                            aria-hidden="true"
                          />
                        </template>
                      </Input>
                    </template>
                    <Select.Item
                      v-for="option in behaviorMatches(behavior.id)"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                    <p
                      v-if="!behaviorMatches(behavior.id).length"
                      class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                    >
                      No behavior matches “{{ behaviorQuery[behavior.id] }}”.
                    </p>
                  </Select.Content>
                </Select>
              </div>

              <div class="min-w-0">
                <template v-if="behaviorArgument(behavior.type)?.kind === 'text'">
                  <Input
                    v-model="behavior[textArgument(behavior.type).field]"
                    size="large"
                    class="w-full"
                    :aria-label="textArgument(behavior.type).label"
                    :placeholder="textArgument(behavior.type).placeholder"
                    :disabled="submitting"
                    required
                    :invalid="argumentMissing(behavior, textArgument(behavior.type).field)"
                  />
                </template>

                <template v-else-if="behaviorArgument(behavior.type)?.kind === 'select'">
                  <div class="flex flex-col gap-(--spacing-2xs)">
                    <Select
                      v-model="behavior[selectArgument(behavior.type).field]"
                      size="large"
                      class="w-full"
                      :disabled="submitting"
                      :placeholder="`Select a ${selectArgument(behavior.type).label.toLowerCase()}`"
                      required
                      :invalid="argumentMissing(behavior, selectArgument(behavior.type).field)"
                      :display-value="
                        (value) => optionLabelIn(selectArgument(behavior.type).source, value)
                      "
                    >
                      <Select.Trigger :aria-label="selectArgument(behavior.type).label" />
                      <Select.Content>
                        <Select.Item
                          v-for="option in optionsFor(selectArgument(behavior.type).source)"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                    <FieldDescription
                      v-if="behaviorArgumentNote(selectArgument(behavior.type).source, form.phase)"
                    >
                      {{ behaviorArgumentNote(selectArgument(behavior.type).source, form.phase) }}
                    </FieldDescription>
                  </div>
                </template>

                <template v-else-if="behaviorArgument(behavior.type)?.kind === 'group'">
                  <div class="flex flex-col gap-(--spacing-xs)">
                    <Input
                      v-for="part in groupArgument(behavior.type).fields"
                      :key="part.field"
                      v-model="behavior[part.field]"
                      size="large"
                      class="w-full"
                      :aria-label="part.label"
                      :placeholder="part.placeholder"
                      :disabled="submitting"
                      required
                      :invalid="argumentMissing(behavior, part.field)"
                    />
                  </div>
                </template>
              </div>

              <div class="flex items-center gap-(--spacing-2xs)">
                <span
                  v-if="form.behaviors.length > 1"
                  role="button"
                  tabindex="0"
                  aria-label="Drag to reorder behavior, or use arrow keys"
                  draggable="true"
                  :class="DRAG_HANDLE_CLASS"
                  @dragstart="onDragstart('behavior', bIdx, $event)"
                  @dragend="onDragend"
                  @keydown.up.prevent="moveBehavior(bIdx, -1)"
                  @keydown.down.prevent="moveBehavior(bIdx, 1)"
                >
                  <i
                    class="az az-menu"
                    aria-hidden="true"
                  />
                </span>
                <Tooltip content="Move behavior up">
                  <IconButton
                    icon="az az-chevron-up"
                    variant="outline"
                    size="large"
                    aria-label="Move behavior up"
                    :disabled="submitting || bIdx === 0"
                    @click="moveBehavior(bIdx, -1)"
                  />
                </Tooltip>
                <Tooltip content="Move behavior down">
                  <IconButton
                    icon="az az-chevron-down"
                    variant="outline"
                    size="large"
                    aria-label="Move behavior down"
                    :disabled="submitting || bIdx === form.behaviors.length - 1"
                    @click="moveBehavior(bIdx, 1)"
                  />
                </Tooltip>
                <Tooltip content="Remove behavior">
                  <IconButton
                    icon="az az-trash"
                    variant="outline"
                    size="large"
                    aria-label="Remove behavior"
                    :disabled="submitting || form.behaviors.length <= 1"
                    @click="removeBehavior(bIdx)"
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-(--spacing-sm)">
            <Button
              type="button"
              label="Add behavior"
              variant="outline"
              size="medium"
              icon="az az-circle-plus"
              :disabled="submitting || !canAddBehavior"
              @click="addBehavior"
            />
            <span
              v-if="!canAddBehavior"
              class="text-body-sm text-(--text-muted)"
            >
              {{
                form.behaviors.length >= 10
                  ? 'A rule holds up to 10 behaviors.'
                  : `${behaviorLabel(form.behaviors[form.behaviors.length - 1].type)} ends the rule. Nothing after it runs.`
              }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
```

## `parts/rule-builder-drawer.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed, reactive, ref } from 'vue'

  import { useBehaviorDrag } from '../composables/use-behavior-drag'
  import { useRuleBehaviors } from '../composables/use-rule-behaviors'
  import { useRuleBuilderForm } from '../composables/use-rule-builder-form'
  import {
    BUILDER_PHASES,
    type RuleForm,
    ruleFormFactory,
    type RuleSeed,
    variablesFor
  } from '../lib/rule-builder'
  import type { RuleListPhase } from '../view-rule-list.vue'
  import RuleBehaviorsCard from './rule-behaviors-card.vue'
  import RuleCriteriaEditor from './rule-criteria-editor.vue'

  export interface RuleBuilderDrawerProps {
    /** The rule being edited, or nothing for a new one. */
    seed?: RuleSeed | null
    /** The phase a new rule starts in. */
    newPhase?: RuleListPhase
  }

  const props = withDefaults(defineProps<RuleBuilderDrawerProps>(), {
    seed: null,
    newPhase: 'request'
  })

  const emit = defineEmits<{
    apply: [form: RuleForm]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const { newCondition, newBehavior, blankForm, formFor } = ruleFormFactory()
  const form = reactive(blankForm())
  const formEl = ref<HTMLElement | null>(null)
  const editing = computed(() => Boolean(props.seed))

  const { submitting, nameError, criteriaErrors, argumentMissing, submit } = useRuleBuilderForm(
    form,
    { open, seed: () => props.seed, newPhase: () => props.newPhase, formFor },
    formEl,
    () => emit('apply', form)
  )
  const behaviorList = useRuleBehaviors(form, newBehavior)
  const drag = useBehaviorDrag(form)
  const variablesForPhase = computed(() => variablesFor(form.phase))
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="editing ? 'Edit Rule' : 'Add Rule'"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ editing ? 'Edit Rule' : 'Add Rule' }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Handle the conditional execution of behaviors through logical operators.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">{{ editing ? 'Edit Rule' : 'Add Rule' }}</legend>
            <SettingsGroup
              label="General"
              hint="Names the rule in the list and in the deployment log."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <Field
                  :disabled="submitting"
                  required
                  :invalid="nameError"
                >
                  <Field.Label for="rule-name">Name</Field.Label>
                  <Input
                    id="rule-name"
                    v-model="form.name"
                    size="large"
                    placeholder="My rule"
                  />
                  <Field.Description v-if="nameError">Name is required.</Field.Description>
                </Field>

                <Field :disabled="submitting">
                  <Field.Label for="rule-description">Description</Field.Label>
                  <Input
                    id="rule-description"
                    v-model="form.description"
                    size="large"
                    placeholder="Optional"
                  />
                  <Field.Description
                    >For whoever reads this rule next. It never affects what the rule
                    does.</Field.Description
                  >
                </Field>
              </div>
            </SettingsGroup>

            <SettingsGroup
              label="Phase"
              hint="When the rule runs. Request rules act on what arrives at the service; response rules act on what leaves it. The two are separate programs and never interleave."
            >
              <Card :padded="false">
                <template #default>
                  <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <RadioGroup
                        v-model="form.phase"
                        variant="card"
                        name="rule-phase"
                        aria-label="Phase"
                        :disabled="submitting || editing"
                      >
                        <RadioGroup.Item
                          v-for="phase in BUILDER_PHASES"
                          :key="phase.value"
                          :value="phase.value"
                          :description="phase.description"
                          >{{ phase.label }}</RadioGroup.Item
                        >
                      </RadioGroup>
                      <FieldDescription v-if="editing"
                        >A rule’s phase is set when it is created. Create a rule in the other phase
                        to run these behaviors there.</FieldDescription
                      >
                    </div>
                  </div>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              label="Criteria"
              hint="The conditions that decide whether the rule runs. Every condition in a group must match, and any one group is enough."
            >
              <RuleCriteriaEditor
                v-model:groups="form.criteria"
                :new-condition="newCondition"
                :errors="criteriaErrors"
                :variables="variablesForPhase"
                :submitting="submitting"
              />
            </SettingsGroup>

            <SettingsGroup
              label="Behaviors"
              hint="What the rule does when its criteria are met, run top to bottom in this order."
            >
              <RuleBehaviorsCard
                :form="form"
                :submitting="submitting"
                :argument-missing="argumentMissing"
                :list="behaviorList"
                :drag="drag"
              />
            </SettingsGroup>

            <SettingsGroup
              label="Status"
              hint="An inactive rule stays in the list and in its place in the order, but is skipped at runtime."
            >
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Active"
                      description="Turn the rule on right after it is created."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.active"
                        aria-label="Active"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </SettingsGroup>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
            <Button
              label="Save"
              variant="primary"
              size="medium"
              :loading="submitting"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
```

## `parts/rule-criteria-editor.vue`

```ts
<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Combobox from '@aziontech/webkit/combobox'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'

  import {
    type Condition,
    criteriaColumns,
    operatorLabel,
    OPERATORS,
    takesArgument
  } from '../lib/rule-builder'

  export interface RuleCriteriaEditorProps {
    /** Builds an empty condition. */
    newCondition: () => Condition
    /** The errors per group and condition. */
    errors: Record<string, string>[][]
    /** The variables of the rule's phase. */
    variables: { value: string }[]
    /** The form is saving. */
    submitting: boolean
  }

  defineProps<RuleCriteriaEditorProps>()

  const groups = defineModel<Condition[][]>('groups', { required: true })
</script>

<template>
  <AttributeEditor
    v-model:groups="groups"
    :definition="criteriaColumns"
    :new-item="newCondition"
    :errors="errors"
    :limit="10"
    :group-limit="5"
    :min-items="1"
    :disabled="submitting"
    size="large"
    add-button-label="Add condition"
    add-group-label="Add OR group"
    remove-button-label="Remove condition"
    aria-label="Criteria"
  >
    <template #cell-variable="{ value, update, invalid }">
      <div class="contents font-code">
        <Combobox
          :model-value="value"
          :options="variables"
          size="large"
          placeholder="${uri}"
          empty-title="No variable matches. Type the one you need."
          required
          :invalid="invalid"
          :disabled="submitting"
          @update:model-value="update"
        />
      </div>
    </template>
    <template #cell-operator="{ value, update }">
      <Select
        :model-value="value"
        size="large"
        class="w-full"
        :disabled="submitting"
        :display-value="operatorLabel"
        @update:model-value="update"
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item
            v-for="op in OPERATORS"
            :key="op.value"
            :value="op.value"
          >
            {{ op.label }}
          </Select.Item>
        </Select.Content>
      </Select>
    </template>
    <template #cell-argument="{ item, value, update }">
      <Input
        v-if="takesArgument(item.operator)"
        key="argument"
        :model-value="value"
        size="large"
        class="w-full"
        autocomplete="off"
        :spellcheck="false"
        :disabled="submitting"
        @update:model-value="update"
      />
      <Input
        v-else
        key="no-argument"
        model-value=""
        size="large"
        class="w-full"
        placeholder="No argument"
        disabled
      />
    </template>
  </AttributeEditor>
</template>
```

## `parts/rule-move-cell.vue`

```ts
<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { RuleListControl } from '../lib/rule-list'
  import type { RuleListRule } from '../view-rule-list.vue'

  export interface RuleMoveCellProps {
    /** The rule of the row. */
    row: RuleListRule
    /** The label of its phase. */
    phaseLabel: string
    /** How many rules the phase has. */
    total: number
    /** The narrow layout: one Move menu instead of the position field and the arrows, and no drag handle. */
    narrow: boolean
    /** Why the rule cannot move, or nothing. */
    lockReason: string
    /** The zero-based position of the rule. */
    position: number
    /** How many locked rules lead the phase. */
    pinned: number
    /** The rule can move up. */
    canMoveUp: boolean
    /** The rule can move down. */
    canMoveDown: boolean
    /** The value the position field shows. */
    positionValue: string
  }

  defineProps<RuleMoveCellProps>()

  const emit = defineEmits<{
    'menu-select': [value: DropdownMenuItemValue]
    step: [direction: number, control: RuleListControl]
    'position-input': [value: string]
    commit: [refocus: boolean]
    cancel: []
  }>()
</script>

<template>
  <div
    v-if="narrow"
    :data-rule-id="row.id"
    class="flex items-center justify-center"
  >
    <DropdownMenu
      side="bottom"
      align="end"
      :disabled="Boolean(lockReason)"
      @select="(_event, value) => emit('menu-select', value)"
    >
      <DropdownMenu.Trigger>
        <IconButton
          icon="az az-move-vertical"
          variant="ghost"
          size="medium"
          data-control="menu"
          :disabled="Boolean(lockReason)"
          :aria-label="
            lockReason
              ? `Move ${row.name}, position ${position + 1} of ${total}. ${lockReason}`
              : `Move ${row.name}, position ${position + 1} of ${total}`
          "
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Group>
        <DropdownMenu.Item
          value="top"
          label="Move to top"
          :disabled="!canMoveUp"
        />
        <DropdownMenu.Item
          value="up"
          label="Move up"
          :disabled="!canMoveUp"
        />
        <DropdownMenu.Item
          value="down"
          label="Move down"
          :disabled="!canMoveDown"
        />
        <DropdownMenu.Item
          value="bottom"
          label="Move to bottom"
          :disabled="!canMoveDown"
        />
      </DropdownMenu.Group>
    </DropdownMenu>
  </div>
  <div
    v-else
    :data-rule-id="row.id"
    class="flex items-center gap-(--spacing-2xs)"
  >
    <Tooltip :content="lockReason || 'Type a position to move the rule there'">
      <span class="inline-flex w-14 shrink-0 tabular-nums [&_input]:text-center">
        <Input
          :model-value="positionValue"
          size="small"
          inputmode="numeric"
          autocomplete="off"
          data-control="position"
          class="w-full"
          :disabled="Boolean(lockReason)"
          :aria-label="
            lockReason
              ? `Position ${position + 1} of ${row.name} in the ${phaseLabel} phase. ${lockReason}`
              : `Position of ${row.name} in the ${phaseLabel} phase. Type a number from ${pinned + 1} to ${total} to move it.`
          "
          @update:model-value="(value: string) => emit('position-input', value)"
          @focus="($event.target as HTMLInputElement).select()"
          @keydown.enter.prevent="emit('commit', true)"
          @keydown.esc.prevent="emit('cancel')"
          @blur="emit('commit', false)"
        />
      </span>
    </Tooltip>
    <span
      data-slot="step-buttons"
      class="flex items-center gap-(--spacing-2xs) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance focus-within:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none [[data-reorder-row]:hover_&]:opacity-100"
    >
      <Tooltip :content="lockReason || 'Move up'">
        <IconButton
          icon="az az-chevron-up"
          variant="outline"
          size="small"
          data-control="up"
          :aria-label="lockReason ? `Move ${row.name} up. ${lockReason}` : `Move ${row.name} up`"
          :disabled="!canMoveUp"
          @click="emit('step', -1, 'up')"
        />
      </Tooltip>
      <Tooltip :content="lockReason || 'Move down'">
        <IconButton
          icon="az az-chevron-down"
          variant="outline"
          size="small"
          data-control="down"
          :aria-label="
            lockReason ? `Move ${row.name} down. ${lockReason}` : `Move ${row.name} down`
          "
          :disabled="!canMoveDown"
          @click="emit('step', 1, 'down')"
        />
      </Tooltip>
    </span>
  </div>
</template>
```

## `parts/rule-phase-table.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { UseRuleListPositionReturn } from '../composables/use-rule-list-position'
  import type { UseRuleListReorderReturn } from '../composables/use-rule-list-reorder'
  import type { RuleListPhaseOption } from '../lib/rule-list'
  import type { RuleListRule } from '../view-rule-list.vue'
  import RuleMoveCell from './rule-move-cell.vue'

  /** One phase as the list shows it. */
  export interface RulePhaseGroup extends RuleListPhaseOption {
    /** How many rules the phase has. */
    total: number
    /** The rules the search keeps. */
    items: RuleListRule[]
  }

  export interface RulePhaseTableProps {
    /** The phase and its rules. */
    group: RulePhaseGroup
    /** The table columns for the layout. */
    columns: TableColumn[]
    /** The rules are loading. */
    loading: boolean
    /** The save is in flight. */
    saving: boolean
    /** The narrow layout. */
    narrow: boolean
    /** The search text. */
    search: string
    /** Moving rules within their phase. */
    reorder: UseRuleListReorderReturn
    /** The typed position and the Move menu. */
    positioning: UseRuleListPositionReturn
  }

  const props = defineProps<RulePhaseTableProps>()

  const emit = defineEmits<{
    edit: [event: MouseEvent, rule: RuleListRule]
    'set-active': [rule: RuleListRule, value: boolean]
    'clear-search': []
  }>()

  const loadingRows = computed<RuleListRule[]>(() =>
    Array.from({ length: props.group.total || 3 }, (_, index) => ({
      id: `loading-${index}`,
      name: '',
      description: '',
      phase: props.group.value,
      author: '',
      modified: '',
      active: false,
      locked: false
    }))
  )

  const { pinned, canMove, lockReason, position, step, reorderRows, reorderable } = props.reorder
  const { positionValue, onPositionInput, commitPosition, cancelPosition, onMoveSelect } =
    props.positioning
</script>

<template>
  <DataTable
    :data="loading ? loadingRows : group.items"
    :columns="columns"
    row-key="id"
    :bordered="false"
    :loading="loading"
    :reorderable="!narrow"
    :row-reorderable="reorderable(group.value)"
    :aria-label="`${group.label} phase rules, in the order they run`"
    @update:data="(next: RuleListRule[]) => reorderRows(group.value, next)"
  >
    <template #cell-move="{ row }">
      <RuleMoveCell
        :row="row"
        :phase-label="group.label"
        :total="group.total"
        :narrow="narrow"
        :lock-reason="lockReason(group.value, row)"
        :position="position(group.value, row)"
        :pinned="pinned(group.value)"
        :can-move-up="canMove(group.value, position(group.value, row), -1)"
        :can-move-down="canMove(group.value, position(group.value, row), 1)"
        :position-value="positionValue(group.value, row)"
        @menu-select="(value) => onMoveSelect(group.value, row, value)"
        @step="
          (direction, control) => step(group.value, position(group.value, row), direction, control)
        "
        @position-input="(value) => onPositionInput(row, value)"
        @commit="(refocus) => commitPosition(group.value, row, refocus)"
        @cancel="cancelPosition"
      />
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
      <span class="min-w-0 truncate text-(--text-muted)">{{ row.description }}</span>
    </template>
    <template #cell-status="{ row }">
      <div class="flex min-h-10 min-w-0 items-center">
        <Field orientation="horizontal">
          <Switch
            :model-value="row.active"
            :disabled="row.locked || saving"
            :aria-label="`Run ${row.name}`"
            @update:model-value="(value: boolean) => emit('set-active', row, value)"
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
        icon="az az-search"
        :title="`No ${group.label.toLowerCase()} rule matches “${search.trim()}”`"
      >
        <template #actions>
          <Button
            label="Clear search"
            variant="outline"
            size="small"
            @click="emit('clear-search')"
          />
        </template>
      </EmptyState>
    </template>
  </DataTable>
</template>
```

## `parts/rule-review-dialog.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'

  import type { RuleListPhaseChanges } from '../lib/rule-list'
  import type { RuleListSubject } from '../view-rule-list.vue'

  export interface RuleReviewDialogProps {
    /** The changes per phase. */
    changes: RuleListPhaseChanges[]
    /** What runs the rules. */
    subject: RuleListSubject
    /** The save is in flight. */
    saving: boolean
    /** The last save failed. */
    saveFailed: boolean
    /** Why the save failed. */
    saveError: string
  }

  defineProps<RuleReviewDialogProps>()

  const emit = defineEmits<{
    save: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog
    v-model:open="open"
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
            {{ subject === 'firewall' ? 'request' : 'request and response' }} the
            {{ subject }} handles.
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
              @click="open = false"
            />
          </div>
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              type="button"
              :label="saveFailed ? 'Save again' : 'Save'"
              variant="primary"
              :loading="saving"
              @click="(event: MouseEvent) => emit('save', event)"
            />
          </div>
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
```
