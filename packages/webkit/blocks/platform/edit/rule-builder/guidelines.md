# Rule builder

A drawer where the user writes one rule of a rules engine: when it runs (the phase), the conditions that decide whether it applies, and the ordered behaviors it performs when they match. The user composes groups of variable, operator and argument rows (every row in a group must match, any group is enough), picks behaviors that fit the phase, puts everything in order and saves, without leaving the resource's Rules tab.

## When to use

- A resource runs an ordered list of rules, each made of conditions and actions (request and response rules, firewall rules, routing).
- Conditions combine with And inside a group and Or across groups, and the order of behaviors matters.
- The rule is edited from a list inside the resource, so the drawer opens as `Add Rule` or `Edit Rule` and keeps the list in view behind it.

## When not to use

- Free-form pairs of a name and a value: use `platform/edit/attribute-editor`.
- A short create form of three fields or fewer: use `platform/create/create-in-drawer`.
- A resource's own settings: use `platform/edit/edit-resource`.
- Logic the user would rather write as code: use `platform/edit/code-editor`.

## Building blocks

### A. Drawer and trigger — `Drawer`, `DrawerTrigger`, `Button`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent` (required)

A right-side `Drawer` at `size="large"`. The `DrawerTrigger` wraps an outlined medium `Add Rule` `Button` that fills the width on a phone. `DrawerContent` holds one `form` named like the title; `PanelHeader` carries the `DrawerTitle` and `DrawerClose`, and `PanelContent` scrolls the five sections. The form resets each time the drawer opens, so content stays in place while it closes. See `skills/webkit-create-surface`.

### B. General — `SettingsSection`, `Field`, `Input` (required)

A `SettingsSection` with a hint, holding two `Field`s with large `Input`s: Name, which shows "Name is required." only after Save is pressed with it empty, and an optional Description. Fields are disabled while saving.

### C. Phase — `SettingsSection`, `Card`, `Field`, `RadioButton`, `HelperText` (optional)

Request and Response as choice cards: a flush `Card` of `Field`s, each a `RadioButton` with a title and a one-line description. When editing, the phase is locked and a `HelperText` explains why. A resource that only acts on requests has a single phase and omits this section.

### D. Criteria — `SettingsSection`, `AttributeEditor` (grouped), `Combobox`, `Select`, `Input` (required)

An `AttributeEditor` in grouped mode (`v-model:groups`), large, named "Criteria": each group is an AND group of condition rows, groups are joined by an "or" `Separator`, and the editor draws the labels, Add condition under each group, Add OR group at the end, Remove condition per row, the limits (10 conditions per group, 5 groups), focus after add and remove, and the polite "Item n added" and "Item n removed" announcements. Its cells are replaced through `cell-<key>` slots: the variable is a `Combobox` of the variables of the chosen phase that also takes a typed one, the operator a `Select`, and the argument an `Input` that turns into a disabled "No argument" field for exists and does not exist. `min-items="1"` keeps one condition. A missing variable shows "Enter the variable to compare." under it, only after Save, through the editor's `errors`. Conditions do not reorder: And and Or do not depend on order.

### E. Behaviors — `SettingsSection`, `Card`, `Select`, `Input`, `HelperText`, `Tooltip`, `IconButton`, `Button` (required)

A Then list run top to bottom. Each row is a behavior `Select` with its own search `Input`, listing only behaviors valid in the chosen phase, then an argument `Input` or `Select` that follows the behavior, with a `HelperText` where the argument needs one. Rows reorder by grip or Move up and Move down, and can be removed. An outlined Add behavior `Button` ends the list.

### F. Status — `SettingsSection`, `Card`, `Item`, `SettingRow`, `Switch` (required)

A flush `Card` with an `Item.List` holding one `SettingRow` titled Active with a `Switch`. The hint says an inactive rule keeps its place in the order and is skipped at runtime.

### G. Footer — `PanelFooter`, `Button` (required)

`PanelFooter` with one primary medium Save `Button` at the end, which submits the form and shows its loading state.

## Do

- Show the Name error only after a failed Save, never on first render, and move focus to the first field in error.
- Read the logic aloud in the layout: and inside a group, or between groups, then the behaviors in order.
- Make every argument field follow what was picked before it, so the user never types a value the operator or behavior cannot take.
- Offer both drag and buttons to reorder behaviors; the buttons are the keyboard path.
- Filter variables and behaviors by phase, and lock the phase on an existing rule.
- Follow `skills/webkit-form` for fields and `skills/webkit-errors` for error timing.

## Don't

- Don't put a Cancel button beside Save; `DrawerClose` and the overlay close the drawer.
- Don't nest groups inside groups; one level of Or over And is the whole model.
- Don't draw criteria rows by hand; `AttributeEditor` grouped mode owns their labels, errors, limits and announcements.
- Don't let the user switch an existing rule's phase; tell them to create a rule in the other phase.
- Don't open the drawer in a medium size; condition rows need three columns side by side.
- Don't clear the form while the drawer is closing.

## Copy

- **Drawer title and trigger:** `Add Rule` for a new rule, `Edit Rule` for an existing one.
- **Section hints:** one sentence saying what the section decides, e.g. "The conditions that decide whether the rule runs."
- **Logic labels:** single words, e.g. "and", "or", "Then".
- **Add buttons:** verb first, e.g. "Add condition", "Add OR group", "Add behavior".
- **Errors:** "Name is required.", "Enter the variable to compare."
- **Reorder controls:** name the item, e.g. "Move condition up", "Remove behavior".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Every `Input` and `Select` trigger has a label: a `Field.Label` tied by `for`, or an `aria-label` such as "Behavior"; the criteria cells are `Field`s of the `AttributeEditor`, labelled Variable, Operator and Argument, and groups are `group`s named "Group n".
- The variable `Combobox` is a `combobox` with a `listbox` of `option`s; picking one keeps focus in the field.
- Behavior drag grips are labeled, e.g. "Drag to reorder behavior, or use arrow keys", and the Move up and Move down buttons give the same result without a pointer.
- Icon-only controls carry an `aria-label` that matches their `Tooltip`; decorative icons carry `aria-hidden="true"`.
- The drawer traps focus while open and returns it to the trigger on close; motion respects reduced motion.

## States

- Default: Add Rule with an empty Name, the Request phase, one empty condition and one empty behavior, Active on.
- Composed: Edit Rule for the seeded Docs rewrite rule, the phase locked with its note, one URI condition and two behaviors.

## Related

- `platform/create/create-in-drawer` — the simpler drawer create this one extends.
- `platform/edit/attribute-editor` — a drawer for free key and value pairs; `AttributeEditor` is the component the criteria are built on.
- `platform/view/rules-list` — the list of rules by phase this drawer opens from.
- `platform/states/form-validation` — when errors appear after Save.
- `platform/edit/edit-resource` — the resource settings that sit beside the Rules tab.
- `Drawer` — the side panel; see `skills/webkit-create-surface`.
