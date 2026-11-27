# Dialog

> Modal surface above the page, built on the shared Panel shell. `Dialog.Content` is the whole modal: it teleports to `body`, renders the dimmed overlay behind the panel, traps focus and scroll-locks the page, so the page behind cannot be clicked, scrolled or tabbed to while the dialog is open. The consumer composes a trigger and the panel regions (header, body, footer); the header gets the close (X) button on its own unless `closable` is false; the body is the only region that scrolls. Below `md` it renders as a full-width bottom sheet.

- Import: `import DialogRoot from '@aziontech/ui/dialog-root'`
- Compound import (dot notation, not tree-shakeable): `import Dialog from '@aziontech/ui/dialog'`
- Category: overlay · Surface: app · Structure: composition
- API as JSON: [dialog.json](dialog.json)

## When to use

- A focused, blocking modal task or confirmation that should sit centered over the page and trap focus.
- The interaction must be completed or dismissed before returning to the page.

## Do

- Do not add an overlay, a portal or a close button by hand: `Dialog.Content` renders the overlay and the portal, and the header renders the close button while `closable` is true (the default). Set `:closable="false"` only when the dialog must be answered through its footer actions.
- While an action is in flight, set `:dismissible="false"` and `:closable="false"` together so neither Escape, the overlay nor the close button can close it.
- One clear primary action; keep the body scannable.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Don’t

- The content is a side panel or a long form that should slide from an edge, over the screen that owns it → use `drawer` (nothing inside a drawer navigates; a destination of its own is a page).
- It is small contextual content anchored to a trigger (a menu, info bubble, picker) → use a popover / `dropdown-menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [drawer](drawer.md) — edge-anchored panel for secondary tasks / long content.
- [dropdown-menu](dropdown-menu.md) — trigger-anchored menu for actions/options.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `closable` | `boolean` | `true` | false | Shows the close (X) button at the end of the dialog header. False removes it; Escape and overlay click still follow `dismissible`. |
| `dismissible` | `boolean` | `true` | false | Light-dismiss: when true, overlay click and Escape close the dialog. It does not govern the close button; see `closable`. |
| `size` | `DialogSize` | `'medium'` | false | Panel max-width preset passed to the inner Panel. |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## Sub-component imports

- `@aziontech/ui/dialog-close`
- `@aziontech/ui/dialog-content`
- `@aziontech/ui/dialog-description`
- `@aziontech/ui/dialog-title`
- `@aziontech/ui/dialog-trigger`
- `@aziontech/ui/dialog-header`
- `@aziontech/ui/dialog-body`
- `@aziontech/ui/dialog-footer`

## Sub-components

- `index.ts` — the compound: the root with every part attached by `Object.assign` (`Dialog.Trigger`, `.Content`, `.Title`, `.Description`, `.Close`), plus the shared Panel regions as `Dialog.Header`, `Dialog.Body` and `Dialog.Footer`, each importable on its own as `@aziontech/ui/dialog-header`, `dialog-body` and `dialog-footer` (the same `panel-header`, `panel-body` and `panel-footer` files). It adds no component of its own. Exported at `@aziontech/ui/dialog`; the root alone is `@aziontech/ui/dialog-root`. The parts stay in the root folder (flat).
- `dialog-close.vue` — Public sub-component `dialog-close`: the close (X) `IconButton`. `Dialog.Content` puts one at the end of its `PanelHeader` while `closable` is true, so a consumer places it by hand only in a custom header with `:closable="false"`. It always closes the dialog.
- `dialog-content.vue` — Public sub-component `dialog-content`: the modal itself. It teleports to `body` (kept mounted through the exit transition), renders the overlay (`aria-hidden`, `dialog-content__backdrop` test id; a click on it closes the dialog when `dismissible`) and the `role="dialog"` panel, traps focus, scroll-locks the page and restores focus on close.
- `dialog-description.vue` — Public sub-component `dialog-description`.
- `dialog-title.vue` — Public sub-component `dialog-title`.
- `dialog-trigger.vue` — Public sub-component `dialog-trigger`. As-child trigger: a non-interactive inline wrapper (no `role`, no `tabindex`) that opens the dialog on the bubbling `click` and gives `aria-haspopup="dialog"` and `aria-expanded` to the slotted control, which is the one tab stop and the element focus returns to on close. When the first node in the slot is an Azion UI `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"`, opening on `Enter` / `Space`; for these and for native elements this is in the server HTML too.

- Test ids: each part falls back to its own name (`dialog-trigger`, `dialog-content`, `dialog-title`, `dialog-description`, `dialog-close`, and `panel-header`, `panel-body`, `panel-footer` for the shared regions), and a `data-testid` passed to the part wins; the root's `data-testid` does not rename the parts. The inner overlay and shell of `dialog-content` are `dialog-content__backdrop`, `__portal` and `__panel-shell`. The close button `Dialog.Content` adds while `closable` belongs to the root: `dialog__close`, or `<root test id>__close`.

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                                                        |
| -------------- | --------- | ----------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Open state via `defineModel('open')`, the only declaration of `open`, so `@update:open` is typed `(value: boolean) => void` and fires once per open/closed transition (trigger, `Dialog.Close`, `Esc`, overlay click). While unbound the dialog is uncontrolled and starts at `defaultOpen`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)
- `data-size` on the motion wrapper mirrors `size`, reactively (a later `size` change resizes an open dialog).
- Attributes: the `Dialog` root forwards every consumer attribute (`id`, `class`, `aria-*`, `data-*`) to its root element; `DialogContent` forwards its attributes to the `role="dialog"` element.

#### Mobile sheet, height and scroll

- Below `md` the dialog is a bottom sheet, capped at 80% of the **visible** viewport (`dvh`, not `vh`: on mobile browsers `vh` is the largest viewport with the toolbars retracted, so a `vh` sheet can extend under the URL bar with its footer off-screen).
- Exactly one element caps the sheet (the panel) and exactly one element scrolls (`panel-body`), so the title and footer actions stay reachable while the body scrolls. The motion wrapper only positions and animates; it declares no cap and no scroll of its own.
- The page behind the overlay is scroll-locked while the dialog is open, and the lock is released on close.
- Phones: below `md` the panel is a bottom sheet: full width, as tall as its content (`h-fit`), rounded top corners, capped at 80 dvh and at 90 dvh below `sm`, where its body scrolls. It never grows to the full screen, so a short confirmation stays a compact sheet and the page it is about stays in view above it. The `PanelFooter` stays pinned under the scrolling content, its direct children stretch to equal widths and it keeps `env(safe-area-inset-bottom)` clear.
- Server render and hydration: the phone layout and its motion timing are CSS breakpoints (`max-md:` / `md:` utilities), so the server HTML and the hydrated DOM are identical at every width.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Enter`/`Space` on the trigger opens the dialog and moves focus into it: to the control marked `data-autofocus`, else the first form field (a text input, textarea, select, combobox or spinbutton), else the first focusable control, so a dialog that opens with a form starts in its first field rather than on the close button. Focus is trapped: `Tab` on the last control wraps to the first and `Shift+Tab` on the first wraps to the last. `Escape` closes it (unless the consumer blocks dismissal) and focus returns to the trigger; when the dialog was opened without a `Dialog.Trigger` (controlled `v-model:open`), focus returns to whatever element held it when the dialog opened. Tests: `dialog.test.ts` › keyboard map (spec).
- ARIA: the panel is `role="dialog"` with `aria-modal="true"`, `aria-labelledby` on the `DialogTitle` id, and `aria-describedby` on the `DialogDescription` id **only while a `DialogDescription` is mounted** (it registers itself, as in `Popover`), so the dialog never references a missing id. A consumer `role` passed to `DialogContent` (for example `role="alertdialog"` from `ConfirmDialog`) replaces `dialog`.
- Nested overlays: every open `DialogContent` joins the shared overlay layer stack (`composables/use-overlay-layer`). Only the top layer handles `Escape` and `Tab` trapping, so `Escape` in a dialog opened from a `Drawer` closes the dialog only, and a `Popover` teleported out of a dialog keeps its own `Tab` containment. Tests: `dialog.test.ts` › nested overlays.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on every animated element; nothing sets the transition inline. Tests: `dialog-motion.test.ts`.
- Touch target ≥40×40 px where the control is interactive.
- Overlay: every open dialog renders its overlay; there is no way to open a dialog without one, so the page behind is never clickable while it is open. Tests: `dialog.test.ts` › overlay.
- Teleported content: the portal wraps its content (overlay and panel) in a `display: contents` element that binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import Dialog from '@aziontech/ui/dialog'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import { ref } from 'vue'

  const open = ref(false)
  const name = ref('')
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <Dialog.Trigger>
      <Button
        label="Rename application"
        variant="primary"
      />
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header class="w-full">
        <Dialog.Title>Rename application</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div class="flex flex-col gap-(--spacing-md)">
          <Dialog.Description>
            The new name shows in the console and in the API. URLs and domains do not change.
          </Dialog.Description>
          <Field>
            <Field.Label>Name</Field.Label>
            <Input
              v-model="name"
              name="name"
              autocomplete="off"
            />
          </Field>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <Button
            label="Cancel"
            variant="outline"
            @click="open = false"
          />
          <Button
            label="Rename"
            variant="primary"
            @click="open = false"
          />
        </div>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>
</template>
```

### Sizes

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import DialogTrigger from '@aziontech/ui/dialog-trigger'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { reactive, watch } from 'vue'

  const sizes = ['small', 'medium', 'large']
  const sizeLabels = { small: 'Small', medium: 'Medium', large: 'Large' }
  const openBySize = reactive({ small: false, medium: false, large: false })

  watch(
    openBySize,
    () => {
      const openKey = sizes.find((key) => openBySize[key])
      if (!openKey) return
      sizes.forEach((key) => {
        if (key !== openKey) openBySize[key] = false
      })
    },
    { deep: true }
  )
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <Dialog
      v-for="size in sizes"
      :key="size"
      v-model:open="openBySize[size]"
      :size="size"
    >
      <DialogTrigger>
        <Button
          :label="sizeLabels[size]"
          variant="outline"
        />
      </DialogTrigger>
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>{{ sizeLabels[size] }}</DialogTitle>
        </PanelHeader>
        <PanelBody>
          <DialogDescription>
            Panel max-width preset for the {{ size }} dialog, applied from the md breakpoint up.
          </DialogDescription>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <Button
              label="Close"
              variant="outline"
              @click="openBySize[size] = false"
            />
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
```

### ScrollContent

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import DialogTrigger from '@aziontech/ui/dialog-trigger'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { ref } from 'vue'

  const open = ref(false)
  const settings = [
    {
      name: 'HTTPS redirect',
      value: 'Sends every HTTP request to the HTTPS address of the domain.'
    },
    {
      name: 'Minimum TLS version',
      value: 'Rejects clients that only speak a TLS version older than 1.2.'
    },
    { name: 'HTTP/3', value: 'Lets browsers that support QUIC open faster connections.' },
    { name: 'Certificate', value: 'Uses the managed certificate issued for shop.example.com.' },
    {
      name: 'Default cache TTL',
      value: 'Keeps a response on the edge for one hour when the origin sends no cache header.'
    },
    { name: 'Browser cache TTL', value: 'Tells browsers to keep static files for one day.' },
    {
      name: 'Query string in cache key',
      value: 'Caches each query string as a separate copy of the page.'
    },
    {
      name: 'Compression',
      value: 'Compresses text responses with Brotli, or gzip for older clients.'
    },
    {
      name: 'Image optimization',
      value: 'Resizes and converts images to WebP on the first request.'
    },
    {
      name: 'Origin timeout',
      value: 'Gives the origin 30 seconds to answer before the edge returns an error.'
    },
    {
      name: 'Origin host header',
      value: 'Sends origin.example.com as the Host header to the origin.'
    },
    {
      name: 'Retries',
      value: 'Tries the origin once more when the first attempt fails to connect.'
    },
    { name: 'Firewall', value: 'Runs the Acme production firewall before every request.' },
    {
      name: 'Rate limit',
      value: 'Blocks a client that sends more than 100 requests in 10 seconds.'
    },
    { name: 'Geo blocking', value: 'Allows traffic from every country.' },
    { name: 'Access logs', value: 'Streams every request to the acme-logs data stream.' },
    { name: 'Custom error pages', value: 'Shows custom pages for 404 and 500 responses.' },
    { name: 'Maintenance mode', value: 'Off: the domain serves the live application.' }
  ]
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <DialogTrigger>
      <Button
        label="Edit domain settings"
        variant="primary"
      />
    </DialogTrigger>
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Domain settings</DialogTitle>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <DialogDescription>Changes apply to new requests within a few minutes.</DialogDescription>
          <dl class="m-0 flex flex-col gap-(--spacing-sm)">
            <div
              v-for="setting in settings"
              :key="setting.name"
              class="flex flex-col gap-(--spacing-2xs)"
            >
              <dt class="text-label-md text-(--text-default)">{{ setting.name }}</dt>
              <dd class="m-0 text-body-sm text-(--text-muted)">{{ setting.value }}</dd>
            </div>
          </dl>
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <Button
            label="Cancel"
            variant="outline"
            @click="open = false"
          />
          <Button
            label="Save"
            variant="primary"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
```
