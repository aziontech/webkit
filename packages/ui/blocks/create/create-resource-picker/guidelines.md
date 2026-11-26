# Resource picker

The band a create flow uses when the resource being created needs another resource that may already exist. The user either reuses one of theirs or makes a new one on the spot, and answers it in one place: an Existing / New choice, then a searchable, paged list of what exists or the few fields that create a new one. The chosen row is marked, every search and load is announced, and a missing answer is flagged above the list where it is seen first. When the binding itself is optional (a firewall in front of a project), the same band sits behind an opt-in switch row and unfolds in place when it is turned on.

## When to use

- Use create-resource-picker inside a create flow to bind one resource the user may reuse or create; it is a card, not a page.
- A create flow binds a whole resource that the user may reuse or create: the project a service serves, the deployment a release is cut against, the firewall that protects a workload.
- The candidates can run past seven, so the list needs search, paging and a no-match line.
- Creating the bound resource takes one or a few fields that fit in the same card.
- The binding is optional and off by default: wrap the band in the opt-in switch row (OptionalBinding).

## When not to use

- A single field that references an existing resource (a certificate, an environment, a function): use a select row inside the form, as `create/create-wizard` (CreateAndDeploy) does for Environment.
- Choosing where a resource runs as a step of its own, with module tags and an inline create row: use the chooser in `create/create-wizard` or `create/create-deploy-template` (WhereItRuns).
- Browsing or managing the resources themselves: use `view/view-table`.
- Creating the bound resource needs its own full form: New opens that form in a drawer over the page (`create/create-drawer`) instead of nesting it in the band. Only a create of several steps opens its page in a new tab.

## Building blocks

### A. Band card — `Card` (required)

`Card :padded="false"` titled with the bound noun ("Project"), opening with one muted sentence on what the binding does. The card is flush so the list rows run edge to edge; text and controls carry their own padding. It sits in the form column (`layout-column-form`) like any other band.

For an optional binding (OptionalBinding), the card has no title: its first row is a compact `SettingsRow` titled with the action ("Protect with a firewall") whose `Switch` opts in, and the rest of the band unfolds under it with a grid-rows transition, `inert` while it is off. New then lists the resource's own modules as compact `SettingsRow`s with a `Switch` each under the Name field; a module that cannot be turned off is a disabled, checked `Switch`, and its row description ends with why ("Always on."); a disabled control takes no focus, so a tooltip on it would never reach keyboard or screen-reader users.

### B. Existing / New choice — `ToggleGroup` (required when something exists)

A `ToggleGroup` at `size="large"`, `fluid`, with two options, `Existing <noun>` and `New <noun>`, and an `aria-label` that names the question. Existing is the default when at least one resource exists. When none exist the toggle is not rendered, one line says a new resource is created, and the card opens on New (the Empty state). Switching modes keeps both answers: going to New and back finds the same row still chosen.

### C. New resource fields — `Field`, `Input` (required in New)

New swaps the list for the fields that create the resource, usually one Name `Field` with a large `Input` and a placeholder in the resource's own format. The `Field.Description` carries the allowed characters and becomes the required message once Next is pressed with it empty (the `Field` is `required` from the start and turns `invalid` then). Nothing is judged while the user types.

### D. Search and required message — `Input`, `FieldError` (optional)

A large `Input` with a search icon, placeholder and matching `aria-label`, shown only when the list pages (more than one batch). It matches name and description. A `FieldError` sits under the search and above the rows when Next is pressed with nothing chosen, and the wrapper takes `data-field-invalid`.

### E. Resource list — `Item`, `Skeleton` (required in Existing)

`Item.List` of small `clickable` `Item`s (native `button`s), one per resource: an icon in `Item.Media`, name in `Item.Title`, a secondary fact in `Item.Description`, and a radio circle in `Item.Actions`, filled on the chosen row. The rows are one named `radiogroup`; each row takes `role="radio"` and `aria-checked`, which fills the chosen one. While a batch loads, `Skeleton` rows in the same shape follow the visible ones, `aria-hidden`, with staggered widths. A value chosen beyond the first batch is revealed on open, never hidden behind Load more.

### F. Load more — `Button` (optional)

A transparent small full-width `Button` under the list while more matches remain, labelled with the size of the next batch and spinning with `:loading` while it fetches. The list pages five at a time. A no-match line replaces the rows when the search finds nothing, and a visually hidden `role="status"` line reports the count after every search and load.

## Data

The block takes its resources through props, keeps the answer in `v-model`s and emits Load more; it fetches nothing. `ResourcePickerOption`, `ResourcePickerMode` and `ResourcePickerProps` are exported from `create-resource-picker.vue`, and `sample.ts` holds the sample projects the block renders when `projects` is left out (and never while `loading` or `error` is set).

| Prop / model   | Type                     | What it does                                                                                                  |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `projects`     | `ResourcePickerOption[]` | The resources that can be bound; searched and paged five at a time in the browser. Pass `[]` when none exist. |
| `loading`      | `boolean`                | The next page is loading: skeleton rows follow the visible ones and Load more spins.                          |
| `error`        | `string`                 | The required message, shown under the search above the list, or under the Name field in New.                  |
| `v-model`      | `string`                 | The `value` of the chosen resource.                                                                           |
| `v-model:mode` | `ResourcePickerMode`     | `existing` or `new`. Left out, the card opens on Existing when anything exists and on New when nothing does.  |
| `v-model:name` | `string`                 | The Name of the resource to create in New.                                                                    |

| Event       | Payload   | When                                                       |
| ----------- | --------- | ---------------------------------------------------------- |
| `load-more` | `(event)` | Load more was pressed; the next five matches are revealed. |

To go live, render the block from the create flow that owns the request and the answer:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import CreateResourcePicker from './create-resource-picker.vue'

  const { data, pending } = useProjects()
  const project = ref('')
  const mode = ref<'existing' | 'new'>()
  const name = ref('')
  const required = ref('')
</script>

<template>
  <CreateResourcePicker
    v-model="project"
    v-model:mode="mode"
    v-model:name="name"
    :projects="data ?? []"
    :loading="pending"
    :error="required"
  />
</template>
```

Then delete `sample.ts` and its import. Set `error` when Next is pressed with nothing chosen and clear it once the user answers.

## Do

- Default to Existing when anything exists, and drop the toggle entirely when nothing does.
- Mark the chosen row three ways: background, filled trailing radio circle and `aria-checked`.
- Keep the required message above the rows, under the search, so it is read before the list is scanned.
- Offer the other mode in the no-match line, so an empty search leads to creating one.
- Keep the chosen value when the user switches to New and back.
- Keep an optional binding off by default, and prefill the new resource's name from the resource being created.
- Build the band once and pass the noun, icon and options; every flow that binds a resource reads the same (see `skills/webkit-create-surface`).

## Don't

- Don't use radio buttons or a select for a whole resource the user may also create; that is this band.
- Don't show the search for a list that fits in one batch.
- Don't validate the Name while it is being typed, or mark it invalid before Next is pressed.
- Don't render a loading spinner in place of the rows; show skeleton rows in the row shape and keep the visible ones.
- Don't put the create fields in a dialog or a second page; they belong in the same card.
- Don't hide a locked module or leave it looking editable; disable it, keep it on and say why in its row description, never only in a tooltip.

## Copy

- **Card title:** the bound noun, singular, e.g. "Project".
- **Lead:** one sentence on what the binding does, e.g. "What this service serves on each environment, so one service can serve different projects on Production and Preview."
- **Toggle options:** `Existing <noun>` and `New <noun>`, e.g. "Existing project", "New project".
- **Search:** placeholder and `aria-label` name the collection, e.g. "Search projects".
- **Load more:** the verb and the batch size, e.g. "Load 5 more".
- **No match:** the fact, then both ways out, e.g. "No project matches “api”. Create one instead, or clear the search."
- **Required:** what to do, as a sentence, e.g. "Select the project this service serves, or create a new one."
- **Name guidance:** the allowed characters, e.g. "Lowercase letters, numbers, and hyphens."
- **Opt-in row:** the action as the title, e.g. "Protect with a firewall", and what it does and that it is off by default as the description. A locked module's description ends with the fact, e.g. "Always on."
- Follow `skills/webkit-microcopy`: "Select", never "Pick" or "Choose"; sentence case; no em dash.

## Accessibility

- The `ToggleGroup` has an `aria-label` that states the question, e.g. "Where the project comes from".
- Each row is a native `button` with `role="radio"` and `aria-checked` reflecting the selection, inside a `radiogroup` named for the list; the radio circle is `aria-hidden`.
- Search has an `aria-label` that matches its placeholder.
- A `role="status"` region announces the count after every search, load and no-match, e.g. "5 of 19 projects".
- Skeleton rows are `aria-hidden`; the Load more `Button` carries `:loading` so its busy state is announced.
- The required message is tied to the search group by `data-field-invalid`, and focus stays where it was when it appears.
- The opt-in `Switch` and every module `Switch` carry an `aria-label` equal to their row title; the folded body is `inert`, so its controls leave the tab order while the switch is off; the reveal honours reduced motion.

## States

- Existing: `projects` holds resources; the toggle sits on Existing with the `v-model` row chosen in the first batch.
- New: `mode` is `new` (the user switched to New); the list gives way to the Name field with the allowed characters as helper text.
- Loading: `loading` is set after Load more; five skeleton rows follow the visible ones and the button spins.
- Required: `error` holds the required message after Next was pressed with nothing chosen; the required message sits under the search, above the list.
- Empty: `projects` is `[]`, nothing exists to bind; no toggle, one line saying a new project is created, and the Name field.
- OptionalBinding: the Protect with a firewall switch is on and New firewall is selected; the Name is prefilled from the project and the Firewall modules list has DDoS Protection locked on.

## Related

- `create/create-wizard` — its CreateAndDeploy variant binds its project with this band on the first step and reuses the list for the deployment.
- `create/create-wizard` — the step wizard whose Where it runs chooser follows the same list rules.
- `state/state-form-validation` — how required and invalid messages appear on submit.
- `Item` — the selectable row the list is built from; see `skills/webkit-form`.
- `ToggleGroup` — the Existing / New segment; see `skills/webkit-create-surface`.
