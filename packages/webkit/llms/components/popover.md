# Popover

> Anchored, **non-modal** overlay that opens from a consumer-supplied trigger and renders rich, interactive content — a header (title + optional description + close), a free-form body, and a footer for actions — in a floating panel anchored to the trigger. Use for inline forms, filter builders, and contextual detail or confirmation that needs interactive children. Unlike `overlay/tooltip` (plain text, non-interactive) and `overlay/dialog` (modal, centered, focus-trapped), the popover leaves the page interactive, anchors to its trigger, and closes on `Esc` or outside-click. It differs from `navigation/dropdown`, which renders a menu of selectable options rather than free-form content.

- Import: `import PopoverRoot from '@aziontech/webkit/popover-root'`
- Compound import (dot notation, not tree-shakeable): `import Popover from '@aziontech/webkit/popover'`
- Category: overlay · Surface: product · Structure: composition
- API as JSON: [popover.json](https://github.com/aziontech/webkit/blob/main/.specs/popover.json)

## When to use

- Interactive content anchored to a trigger while the page stays usable: an inline form, a filter builder, a quick edit of one field.
- Contextual detail or a light confirmation that needs buttons or links inside it.

## Do

- Place `Popover.Trigger` first and `Popover.Content` after it. The trigger wires `aria-expanded`, `aria-controls` and the click toggle onto your element, so don't bind them yourself.
- Let `Popover.Trigger` show the pointer: its wrapper sets `cursor-pointer` (`cursor-not-allowed` when disabled), so a `Tag`, `Avatar` or icon slotted in reads as clickable. Don't put `cursor-pointer` on the slotted WebKit component — `webkit/no-style-override` blocks it.
- Include a `Popover.Title`. The panel takes its accessible name from it through `aria-labelledby`.
- Set `width` for forms and filter builders so the panel doesn't resize as content changes. Without it, the panel sizes fluidly between the `--container-3xs` and `--container-xs` tokens.
- Use `placement="auto"` for triggers that can sit near a viewport edge.
- Set `dismissible` to `false` only when an outside click would discard input. Then give the user a way out: `Popover.Close` or a footer action.

## Don’t

- A short, non-interactive hint on hover or focus → use `tooltip`.
- A list of actions or options to pick from → use `dropdown`.
- Choosing a form value from a list → use `select`.
- A blocking task that must be completed or cancelled first → use `dialog`.
- A long form or a secondary workflow → use `drawer`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tooltip](tooltip.md) — plain text only and non-interactive; opens on hover and focus, not on click.
- dropdown` — same trigger and anchoring model, but renders option rows and emits `select`.
- [dialog](dialog.md) — modal and centered, traps focus and locks scroll; the popover does neither.
- [drawer](drawer.md) — edge-anchored modal panel for longer content.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | false | Controlled open state. Use with `v-model:open` or `@update:open`. When omitted, the component is uncontrolled. |
| `placement` | `'auto' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | false | Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time based on available viewport space. |
| `offset` | `number` | `4` | false | Pixel gap between the trigger and the panel. |
| `disabled` | `boolean` | `false` | false | Prevents the trigger from opening the panel and applies disabled tokens. |
| `width` | `'small' \| 'medium' \| 'large'` | `undefined` | false | Panel width preset mapped to container tokens: `'small'` (`var(--container-xs)`), `'medium'` (`var(--container-sm)`), `'large'` (`var(--container-md)`). When omitted, the panel sizes fluidly between `var(--container-3xs)` and `var(--container-xs)`. |
| `dismissible` | `boolean` | `true` | false | Light-dismiss: when `true`, the panel closes on outside-click and `Esc`. Set `false` to keep it open until the trigger or `PopoverClose` closes it. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:open` | `boolean` | Fires on every open/closed transition; supports `v-model:open`. Emitted on trigger toggle, `Popover.Close`, `Esc`, and outside-click. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Place `<Popover.Trigger>` followed by `<Popover.Content>`. |

## Sub-component imports

- `@aziontech/webkit/popover-trigger`
- `@aziontech/webkit/popover-content`
- `@aziontech/webkit/popover-header`
- `@aziontech/webkit/popover-title`
- `@aziontech/webkit/popover-description`
- `@aziontech/webkit/popover-close`
- `@aziontech/webkit/popover-footer`

## Sub-components

The root `Popover` owns open/closed state, anchoring/placement (exposing the computed `panelStyle`), outside-click + `Esc` dismissal, focus containment and return. Shared state flows through `provide`/`inject` (`isOpen`, `triggerId`, `contentId`, `titleId`, `descriptionId`, `setOpen`, resolved `placement`, `width`, `panelStyle`, and the `panelRef` that `Popover.Content` assigns), so every sub-component is context-aware and the consumer wires nothing. **`Popover.Content` renders the single teleported, animated floating panel with its content inline** (the Select / Tooltip pattern — one `<Teleport>` + `<Transition>`, so the scale animation carries the whole panel on enter/leave); the panel element carries `role="dialog"`, the surface/border/radius/shadow tokens, the open/close `animate-popup-scale-*`, `--popup-origin` (via `panelStyle`), and `data-state` / `data-placement`, and assigns itself to the root's `panelRef` so the root's placement/focus logic operates on it. Member names mirror this component's anatomy; `Trigger` / `Content` are valid here because the popover has a real `data-state="open|closed"`.

- `popover-trigger/popover-trigger.vue` — as-child trigger. Reads `inject` for `isOpen`, `triggerId`, `contentId`, `setOpen`. Renders a non-interactive inline wrapper (no `role`, no `tabindex`) with the pointer cursor (`not-allowed` when disabled) that carries `data-testid`, `data-state` and `data-disabled` and toggles the panel on the bubbling `click`. It gives `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, `aria-disabled` (when the root is disabled) and the trigger `id` (unless the control already has one) to the slotted control, which is the one tab stop, the anchor the popover positions against and the focus-return target. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"` (`-1` when disabled), opening on `Enter` / `Space`; for these and for native elements this is in the server HTML too.
  - Props: _none_.
  - Events: _none_ (the root handles `update:open`).
  - Slots: `default` with scope `{ isOpen: boolean }` — the consumer's trigger element. The trigger forwards aria + click; the consumer must not bind those itself.
- `popover-content/popover-content.vue` — renders the floating panel via a single `<Teleport to="body">` + `<Transition>`, with its default slot (`Popover.Header`, the free-form body, `Popover.Footer`) arranged inline as a flex column inside the panel. It owns the panel element and its surface/border/radius/shadow, `position: fixed` anchoring (from the injected `panelStyle`), `role="dialog"` + `aria-modal="false"`, `aria-labelledby` / `aria-describedby` (from injected `titleId`/`descriptionId`), the open/close `animate-popup-scale-in` / `animate-popup-scale-out`, and `data-state` / `data-placement`. It assigns the panel element to the injected `panelRef` (function ref) so the root's placement, focus, `Esc`/`Tab` and outside-click logic operate on it. Because the content lives in the same teleported element as the animation, the scale animation carries the whole panel on enter/leave.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the popover anatomy (`Popover.Header`, body content, `Popover.Footer`).
- `popover-header/popover-header.vue` — full-width header region with a bottom divider and `py var(--spacing-sm)` / `px var(--spacing-md)` padding, laid out as a row with the title/description block on the left and the close affordance on the right.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — `Popover.Title`, optional `Popover.Description`, and `Popover.Close`.
- `popover-title/popover-title.vue` — title text (`.text-body-sm`, `var(--text-default)`). Registers its element id with the injected context so `Popover.Content` can reference it via `aria-labelledby`.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — plain-text title.
- `popover-description/popover-description.vue` — supporting description text (`.text-body-xs`, `var(--text-muted)`). Optional — omit it for a title-only header. Registers its element id with the injected context so `Popover.Content` can reference it via `aria-describedby`.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — plain-text description.
- `popover-close/popover-close.vue` — close control. Renders an `IconButton` (`pi pi-times`, `aria-label="Close"`) that calls the injected `setOpen(false)` on activation; focus returns to the trigger. Optional — omit when the popover is dismissed only by outside-click / `Esc` / a footer action.
  - Props: _none_.
  - Events: _none_ (root handles `update:open`).
  - Slots: _none_.
- `popover-footer/popover-footer.vue` — full-width footer region with a top divider and `py var(--spacing-sm)` / `px var(--spacing-md)` padding. Renders its default slot as a right-aligned button group (`gap var(--spacing-xs)`). Optional.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — action buttons (e.g. Cancel / Apply).

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values (root, trigger, floating panel): `open` | `closed`
- `data-disabled` mirrors the `disabled` prop on root and trigger
- Cursor: the trigger wrapper shows `pointer`, and `not-allowed` with `data-disabled`
- `data-placement` on the root mirrors the `placement` prop (`'auto'` stays as `'auto'`)
- `data-placement` on the floating panel mirrors the resolved placement (`'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`)

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the trigger and the close button.
- Keyboard map:
  - On the trigger: `Enter` / `Space` toggles the panel. When it opens, focus **stays on the trigger** — it is not moved into the panel.
  - `Esc` closes the panel and returns focus to the trigger, from anywhere (trigger or panel). `Tab` / `Shift+Tab` are **contained** within the trigger and the panel's focusable children: Tab from the trigger moves into the panel, Tab past the last panel child wraps back to the trigger, and Shift+Tab reverses. Tabbing **never** closes the panel — only `Esc` or an outside-click dismiss it.
  - Outside-click closes the panel; focus is not forced back to the trigger on outside-click.
  - Tests: `popover.test.ts` › keyboard map (spec).
  - A text `<input>` or `<textarea>` as the trigger control keeps its textbox role and gets none of `aria-haspopup`, `aria-expanded` or `aria-controls`, which ARIA does not allow on a textbox (`aria-allowed-attr`); a field that opens suggestions should be a `Combobox`.
- ARIA: the slotted control (or the wrapper, when the slot has none) exposes `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, with a single tab stop and in the server HTML; the floating panel (rendered by the root) uses `role="dialog"` with `aria-modal="false"`, `aria-labelledby` pointing at the `Popover.Title` id and `aria-describedby` pointing at the `Popover.Description` id (when present); `Popover.Close` is an `IconButton` with `aria-label="Close"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled trigger state (validated via `--text-muted` / `--text-disabled` tokens).
- `motion-reduce:animate-none` on `animate-popup-scale-*`; `motion-reduce:transition-none` on `transition-colors` for hover/focus states.
- Touch target ≥40×40 px on the trigger (consumer's element — flagged in docs); the close `IconButton` follows `IconButton`'s own target sizing.
- Teleported content: the teleported `role="dialog"` panel binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.
- `PopoverHeader` keeps its `header` tag with `role="none"`, so an open popover does not expose a `banner` landmark (pinned by `src/test/screen-reader.test.ts`).

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PopoverClose from '@aziontech/webkit/popover-close'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverHeader from '@aziontech/webkit/popover-header'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTitle from '@aziontech/webkit/popover-title'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger>
      <Button
        kind="secondary"
        label="Open popover"
      />
    </PopoverTrigger>

    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Popover title</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>

      <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
        This content is rendered inside the popover panel.
      </div>
    </PopoverContent>
  </PopoverRoot>
</template>
```

### Placements

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PopoverClose from '@aziontech/webkit/popover-close'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverHeader from '@aziontech/webkit/popover-header'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTitle from '@aziontech/webkit/popover-title'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
</script>

<template>
  <div
    class="grid grid-cols-2 gap-(--spacing-xxl) place-items-center min-h-[24rem] p-(--spacing-xxl)"
  >
    <PopoverRoot placement="bottom-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="bottom-start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>bottom-start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot placement="bottom-end">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="bottom-end"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>bottom-end</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot placement="top-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="top-start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>top-start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot placement="top-end">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="top-end"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>top-end</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>
```

### AutoPlacement

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PopoverClose from '@aziontech/webkit/popover-close'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverHeader from '@aziontech/webkit/popover-header'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTitle from '@aziontech/webkit/popover-title'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
</script>

<template>
  <div class="relative h-[30rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2 text-body-sm text-(--text-muted) text-center max-w-md"
    >
      All triggers use placement="auto". Each panel resolves to the best-fitting corner based on its
      position in the viewport.
    </p>

    <div class="absolute top-(--spacing-md) start-(--spacing-md)">
      <PopoverRoot
        :open="true"
        placement="auto"
      >
        <PopoverTrigger>
          <Button
            kind="secondary"
            label="top-left"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute top-(--spacing-md) end-(--spacing-md)">
      <PopoverRoot
        :open="true"
        placement="auto"
      >
        <PopoverTrigger>
          <Button
            kind="secondary"
            label="top-right"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute bottom-(--spacing-md) start-(--spacing-md)">
      <PopoverRoot
        :open="true"
        placement="auto"
      >
        <PopoverTrigger>
          <Button
            kind="secondary"
            label="bottom-left"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute bottom-(--spacing-md) end-(--spacing-md)">
      <PopoverRoot
        :open="true"
        placement="auto"
      >
        <PopoverTrigger>
          <Button
            kind="secondary"
            label="bottom-right"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  </div>
</template>
```
