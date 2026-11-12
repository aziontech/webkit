# Delete with confirmation

The last stop before a resource is gone for good. The user chose Delete from a row menu or a settings page and now has to see what goes with the resource, take one deliberate step to prove they mean this one, and either confirm or back out. The dialog makes the irreversible action slow on purpose: Delete stays disabled until the typed name matches.

## When to use

- Any permanent delete of a resource, a folder of files or a record, opened from the row Delete action of `platform/view/table-view`, `platform/view/file-browser` or `platform/detail/record-table`.
- The resource takes other things with it (settings, instances, files) and the user must read that before confirming.
- A delete that lives in a settings page as its own row: use the LabelledField variant, a labelled field inside a medium `Dialog` opened from an outlined `Item`.

## When not to use

- Detaching a reference while the object survives: that is Remove, a plain action with an undo toast, not this dialog.
- A reversible change such as disabling or archiving: save it through `platform/settings/settings-form` or `platform/edit/edit-resource`.
- A plain yes-or-no decision with nothing to type: use `ConfirmDialog` with its actions only, without the typed name.
- A failed or slow delete request: the submit lifecycle is `platform/states/async-submit`.

## Building blocks

### A. Dialog and trigger — `ConfirmDialog`, `Button` (required)

`ConfirmDialog` at `size="medium"`, bound with `v-model:open`, closed by default. Its `#trigger` slot holds the visible `Button kind="danger"` that opens it; in a list the trigger is the row menu's Delete option instead. The title reads Delete plus the resource kind, the same string as the trigger. The body goes in the default slot and the buttons in the `#actions` slot.

### B. Consequence — `Alert` (required)

A `severity="warning"` `Alert` first in the body states that the action cannot be reversed. Below it, one muted sentence names what goes with the resource and links the Help Center. A container that holds other items (a folder, a database) passes its own consequence sentence instead of the generic one.

### C. Name chip — `Tooltip` (required)

The prompt "Type … to confirm." shows the resource name as a click-to-copy chip inside a `Tooltip` reading Copy to clipboard. Clicking copies the name and reveals Copied with a check icon for two seconds. The chip truncates a long name instead of wrapping the dialog wider.

### D. Typed confirmation — `Input` (required)

A full-width `Input` with `autocomplete="off"`, labelled by the prompt paragraph through `aria-labelledby`. The value is compared trimmed and must match the name exactly. Enter confirms only when it matches. The input and the Copied reveal reset each time the dialog opens, never as it closes, so the content stays put during the exit motion.

### E. Actions — `Button` (required)

In the `#actions` slot: an outlined Cancel that calls the slot's `close`, then `kind="danger"` Delete resource, the title repeated, `:disabled` until the typed name matches. Both are medium. In the LabelledField variant the same pair sits in `PanelFooter`, stacked full width on a phone, and Delete takes `:loading` while the request runs.

## Do

- Name the resource kind in the title and the resource itself in the chip, so the user knows exactly what goes.
- Keep the confirm button disabled until the trimmed value equals the name; that is the prevention, not a toast after the fact.
- Reset the typed value each time the dialog opens.
- Let the user copy the name from the chip; never block paste in the input.
- Put the consequence in the `Alert` and the sentence below it, before the input that asks for the decision.
- Use the LabelledField variant on a settings page, so the confirmation is a real labelled `Field`.

## Don't

- Don't delete on the first click, from a row menu or anywhere else.
- Don't enable Delete on a partial or case-insensitive match.
- Don't put the warning in the input's label or placeholder.
- Don't make Delete the only button, or use primary for it; it is `kind="danger"` beside an outlined Cancel.
- Don't clear the input as the dialog closes; the field would flash empty during the exit.

## Copy

- **Title:** Delete plus the resource kind, in sentence case, e.g. "Delete workload"; the visible trigger and the confirm button repeat it.
- **Trigger:** verb and object, e.g. "Delete resource" on a visible button; "Delete" in a row menu.
- **Alert:** one fact, e.g. "Once confirmed, this action can't be reversed."
- **Consequence:** one sentence naming what goes with it, e.g. "The selected bucket will be deleted, along with all its files."
- **Prompt:** "Type" before the name chip and "to confirm." after it; never a position such as "in the box below".
- **Confirm:** the title's verb and object, e.g. "Delete resource"; never "OK", "Confirm" or "Yes".
- **Cancel:** exactly "Cancel".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- `ConfirmDialog` traps focus, closes on Escape and returns focus to the trigger.
- The input is named by the prompt paragraph through `aria-labelledby`, so a screen reader hears the name to type.
- The name chip is a real `button` whose `aria-label` switches from "Copy resource-01 to the clipboard" to "Copied resource-01"; its icons carry `aria-hidden="true"`.
- Enter in the input confirms only when the name matches; otherwise focus moves on to Cancel and Delete in reading order.
- In the LabelledField variant the `Field` label carries the prompt, so the name to type is part of the input's accessible name.
- Motion on the Copied reveal is turned off under `prefers-reduced-motion`.

## States

- Default: the danger trigger is visible; opening it shows the warning, the name chip and the empty input with Delete resource disabled.
- LabelledField: an outlined `Item` row on a settings page opens a medium `Dialog` asking for the name through a labelled `Field`, with Delete resource disabled until it matches.

## Related

- `platform/view/table-view` — the row menu Delete that opens this dialog.
- `platform/view/file-browser` — Delete on a file or folder row.
- `platform/detail/record-table` — Delete on a record of a resource.
- `platform/settings/settings-form` — where the LabelledField variant sits.
- `platform/states/async-submit` — the delete request in flight and its failure.
- `ConfirmDialog` — the dialog this block fills; see `skills/webkit-form` for the Dialog form type.
