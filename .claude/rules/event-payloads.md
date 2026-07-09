# Rule: event payloads — activation events emit `(event, item)`

Every **activation event** a component emits — a `click`, an `item-click`, a `select`, a `remove`, a `row-click`, a `step-click`, any event that fires because the user *activated* something — carries the **DOM event first** and, when the activation targets a specific subject, **that subject second**:

```ts
emit('item-click', event, item) // ✅ event first, subject second
```

The consumer must always be able to answer two questions from the payload alone: **what happened** (the `event`, with `target`, modifier keys, `preventDefault`) and **which thing it happened to** (the `item`). This rule fixes that shape so every component reads the same way and no handler has to reach back into the DOM to recover context.

## The rule

> An **activation event** emits `(event: Event, item?)`. The DOM `event` is **always the first argument**. When the activation concerns a specific subject — a row, a menu action, a selected value, a tab, a chip, a crumb — that subject is the **second argument**. The subject is whatever identifies *which* element was activated: its bound data object, or its `value` / `label` / `href` when there is no richer model. A control with no distinct subject (a lone button) emits `(event)` alone.

**Model / value events are not activation events** and are unchanged: `update:*` emits the new value, `value-change` / `page-change` / `sort` / `toggle` emit their value or state. They already answer "what is the new value"; they do not take a DOM event.

## What counts as the `item`

The `item` is a per-component decision — pick the smallest thing that unambiguously says *which* element was activated, and **never duplicate** the same datum in more than one place:

| Component shape | `item` |
|---|---|
| Emits a row/record from a data set (`table` row-click) | the record (`row.original`) |
| Emits a matched entry from a `model` array (`split-button` item-click) | the matched item object |
| Emits an applied filter/tag being removed or edited | the filter object |
| A menu selection carrying a value (`dropdown` select) | the selected `value` |
| A leaf that owns a `value` (`tab-view-item`) | its `value` |
| A leaf identified only by display fields (`chip`, `menu-item`, `breadcrumb-item`) | `label` / `href` — or `{ label, href }` when more than one is needed |
| A structured activation (`pick-list` item-double-click) | `(event, { list, item, index })` — the existing payload object, with `event` promoted to first arg |
| A lone control with no subject (`button`, `icon-button`, `link`, a paginator page button) | nothing — emit `(event)` |

Two shapes are allowed for the second argument, never mixed within one event:

- **`(event, item)`** — the subject is a single value or object. Preferred.
- **`(event, payload)`** — the activation carries structured context (multiple coordinates). The `payload` object holds the item and its context; do **not** also pass the item positionally, and do **not** keep the `event` inside the object (it is already the first argument).

## Ordering is deliberate — and breaking

`event` goes first so the signature is uniform across the system and reads like a native listener (`(event, …extra)`). There is **no non-breaking way** to move the event to the front of an event that previously emitted `(item)` or `(item, event)` — the argument at position 0 changes. Reshaping an existing event's payload is therefore a **breaking change** (major bump). Do it deliberately, mark the commit `BREAKING CHANGE:`, and update the component's spec Events table, its Storybook `argTypes`, and the "Show code" snippet in the same change.

## What this means in practice

```ts
// ❌ Before — subject only, no event; or wrong order; or event buried in an object
emit('item-click', item)
emit('step-click', index, event)
emit('select', { value, event })
emit('row-click', row.original)

// ✅ After — event first, subject second, no duplication
emit('item-click', event, item)
emit('step-click', event, index)
emit('select', event, value)
emit('row-click', event, row.original)
```

```ts
// Leaf components: the item is whatever says which one
emit('click', event, value)          // tab-view-item — owns a value
emit('click', event, label)          // chip — identified by its label
emit('click', event, { label, href })// menu-item / breadcrumb-item — needs both
```

```ts
// ✅ Unchanged — a lone control has no subject
emit('click', event)                 // button, icon-button, link, mini-button

// ✅ Unchanged — model / value events take the value, never a DOM event
emit('update:value', next)
emit('value-change', next)
emit('sort', direction)
```

## Documenting it

Each activation event's row in the spec's **## Events** table states the full payload, event first:

```md
| `item-click` | `(event: MouseEvent, item: SplitButtonItem)` | Fired when a menu action is selected; `item` is the matched `model` entry. |
```

The Storybook `argTypes` entry mirrors it (`type: { summary: '(event: MouseEvent, item: SplitButtonItem)' }`), and the story's `@event` handler and "Show code" snippet use the `(event, item)` signature so the panel is copy-paste-correct (see [`storybook-source.md`](./storybook-source.md)).

## Hard prohibitions

- Do not emit an activation event without the DOM `event` as the first argument.
- Do not put the subject before the event (`(item, event)`) — event is always first.
- Do not bury the `event` inside a payload object; promote it to the first positional argument.
- Do not pass the same datum both positionally and inside a payload object (no duplication).
- Do not add a DOM `event` to a model/value event (`update:*`, `value-change`, `sort`, `toggle`) — those emit their value.
- Do not reshape an event's payload without marking the change breaking and updating the spec, `argTypes`, and "Show code" together.

## Why this rule exists

Event payloads had drifted apart: `split-button/click` emitted `(event, item)`, `split-button/item-click` emitted `(item)`, `table/row-click` emitted `(row)`, `deploy-success/step-click` emitted `(index, event)`, and `dropdown/select` buried the event inside `{ value, event }`. A consumer could not write one handler shape across the system, and half the events forced a reach back into `event.target` to learn what was clicked. Fixing the order once, everywhere, makes every activation handler `(event, item) => …` and every "Show code" snippet honest.
