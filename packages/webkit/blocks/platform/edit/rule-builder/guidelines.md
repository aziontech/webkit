# Rule builder

A drawer where the user writes one rule of a rules engine: when it runs (the phase), the conditions that decide whether it applies, and the ordered behaviors it performs when they match. The user composes If and Or groups of variable, operator and argument rows, picks behaviors that fit the phase, puts everything in order and saves, without leaving the resource's Rules tab.

## When to use

- A resource runs an ordered list of rules, each made of conditions and actions (request and response rules, firewall rules, routing).
- Conditions combine with And inside a group and Or across groups, and the order of groups, conditions and behaviors matters.
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

### D. Criteria — `SettingsSection`, `Card`, `Tooltip`, `IconButton`, `Input`, `ScrollArea`, `Select`, `Button`, `Separator` (required)

Groups read If, then Or. Each group holds condition rows of three large controls: a variable `Input` with a suggestion list in a `ScrollArea` filtered by phase, an operator `Select`, and an argument `Input` or `Select` that follows the operator. Rows after the first read And or Or. Under each group, outlined And and Or `Button`s add a row; a `Separator` and Add criteria start a new group. Each group and row has a drag grip, Move up and Move down `IconButton`s and, for rows, Remove condition, each named by a `Tooltip`.

### E. Behaviors — `SettingsSection`, `Card`, `Select`, `Input`, `HelperText`, `Tooltip`, `IconButton`, `Button` (required)

A Then list run top to bottom. Each row is a behavior `Select` with its own search `Input`, listing only behaviors valid in the chosen phase, then an argument `Input` or `Select` that follows the behavior, with a `HelperText` where the argument needs one. Rows reorder by grip or Move up and Move down, and can be removed. An outlined Add behavior `Button` ends the list.

### F. Status — `SettingsSection`, `Card`, `Item`, `SettingRow`, `Switch` (required)

A flush `Card` with an `Item.List` holding one `SettingRow` titled Active with a `Switch`. The hint says an inactive rule keeps its place in the order and is skipped at runtime.

### G. Footer — `PanelFooter`, `Button` (required)

`PanelFooter` with one primary medium Save `Button` at the end, which submits the form and shows its loading state.

## Do

- Show the Name error only after a failed Save, never on first render.
- Read the logic aloud in the layout: If, And, Or, Then, in that order.
- Make every argument field follow what was picked before it, so the user never types a value the operator or behavior cannot take.
- Offer both drag and buttons to reorder; the buttons are the keyboard path.
- Filter variables and behaviors by phase, and lock the phase on an existing rule.
- Follow `skills/webkit-form` for fields and `skills/webkit-errors` for error timing.

## Don't

- Don't put a Cancel button beside Save; `DrawerClose` and the overlay close the drawer.
- Don't nest groups inside groups; one level of Or over And is the whole model.
- Don't let the user switch an existing rule's phase; tell them to create a rule in the other phase.
- Don't open the drawer in a medium size; condition rows need three columns side by side.
- Don't clear the form while the drawer is closing.

## Copy

- **Drawer title and trigger:** `Add Rule` for a new rule, `Edit Rule` for an existing one.
- **Section hints:** one sentence saying what the section decides, e.g. "The conditions that decide whether the rule runs."
- **Logic labels:** single words, e.g. "If", "And", "Or", "Then".
- **Add buttons:** verb first, e.g. "Add criteria", "Add behavior".
- **Error:** "Name is required."
- **Reorder controls:** name the item, e.g. "Move condition up", "Remove behavior".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Every `Input` and `Select` trigger has a label: a `Field.Label` tied by `for`, or an `aria-label` such as "Variable", "Operator", "Argument", "Behavior".
- The variable suggestions are a `listbox` of `option`s with `aria-selected`; picking one does not steal focus from the field.
- Drag grips are labeled, e.g. "Drag to reorder condition, or use arrow keys", and the Move up and Move down buttons give the same result without a pointer.
- Icon-only controls carry an `aria-label` that matches their `Tooltip`; decorative icons carry `aria-hidden="true"`.
- The drawer traps focus while open and returns it to the trigger on close; motion respects reduced motion.

## States

- Default: Add Rule with an empty Name, the Request phase, one empty condition and one empty behavior, Active on.
- Composed: Edit Rule for the seeded Docs rewrite rule, the phase locked with its note, one URI condition and two behaviors.

## Related

- `platform/create/create-in-drawer` — the simpler drawer create this one extends.
- `platform/edit/attribute-editor` — a drawer for free key and value pairs.
- `platform/states/form-validation` — when errors appear after Save.
- `platform/edit/edit-resource` — the resource settings that sit beside the Rules tab.
- `Drawer` — the side panel; see `skills/webkit-create-surface`.
