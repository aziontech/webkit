# Dialog

> Modal surface above the page, built on the shared Panel shell. The consumer composes a trigger, an overlay backdrop and the panel regions (header, body, footer); the body is the only region that scrolls. Below `md` it renders as a full-width bottom sheet.

- Import: `import Dialog from '@aziontech/webkit/dialog'`
- Category: overlay · Surface: product · Structure: composition
- API as JSON: [dialog.json](https://github.com/aziontech/webkit/blob/main/.specs/dialog.json)

## When to use

- A focused, blocking modal task or confirmation that should sit centered over the page and trap focus.
- The interaction must be completed or dismissed before returning to the page.

## Do

- Trap focus, restore it on close, and close on Escape and overlay click.
- One clear primary action; keep the body scannable.

## Don’t

- The content is a side panel, long form, or navigation that should slide from an edge → use `drawer`.
- It is small contextual content anchored to a trigger (a menu, info bubble, picker) → use a popover / `dropdown`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [drawer](drawer.md) — edge-anchored panel for secondary tasks / long content.
- dropdown` — trigger-anchored menu for actions/options.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | false | Controlled open state. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `dismissible` | `boolean` | `true` | false | When true, overlay click and Escape close the dialog. |
| `size` | `DialogSize` | `'medium'` | false | Panel max-width preset passed to the inner Panel. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:open` | `value: boolean` | v-model:open. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## Sub-component imports

- `@aziontech/webkit/dialog-close`
- `@aziontech/webkit/dialog-content`
- `@aziontech/webkit/dialog-description`
- `@aziontech/webkit/dialog-overlay`
- `@aziontech/webkit/dialog-portal`
- `@aziontech/webkit/dialog-title`
- `@aziontech/webkit/dialog-trigger`

## Sub-components

- `dialog-close.vue` — Public sub-component `dialog-close`.
- `dialog-content.vue` — Public sub-component `dialog-content`.
- `dialog-description.vue` — Public sub-component `dialog-description`.
- `dialog-overlay.vue` — Public sub-component `dialog-overlay`.
- `dialog-portal.vue` — Public sub-component `dialog-portal`.
- `dialog-title.vue` — Public sub-component `dialog-title`.
- `dialog-trigger.vue` — Public sub-component `dialog-trigger`. As-child trigger: a non-interactive inline wrapper (no `role`, no `tabindex`) that opens the dialog on the bubbling `click` and gives `aria-haspopup="dialog"` and `aria-expanded` to the slotted control, which is the one tab stop and the element focus returns to on close. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"`, opening on `Enter` / `Space`; for these and for native elements this is in the server HTML too.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)

#### Mobile sheet, height and scroll

- Below `md` the dialog is a bottom sheet, capped at 80% of the **visible** viewport (`dvh`, not `vh`: on mobile browsers `vh` is the largest viewport with the toolbars retracted, so a `vh` sheet can extend under the URL bar with its footer off-screen).
- Exactly one element caps the sheet (the panel) and exactly one element scrolls (`panel-content`), so the title and footer actions stay reachable while the body scrolls. The motion wrapper only positions and animates; it declares no cap and no scroll of its own.
- The page behind the overlay is scroll-locked while the dialog is open, and the lock is released on close.
- Phones: below `md` the panel is a bottom sheet (full width, 80 dvh); below `sm` it becomes a full-height, full-width sheet (`h-dvh`, no radius, no border). The `PanelFooter` stays pinned under the scrolling content, its direct children stretch to equal widths and it keeps `env(safe-area-inset-bottom)` clear.
- Server render and hydration: the phone layout reads the viewport only after mount (`use-overlay-mobile` gates the media query on `useMounted`), so a dialog rendered open on the server hydrates with the desktop layout and switches to the bottom sheet in the same tick as mount, before paint.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Teleported content: the portal wraps its content (overlay and panel) in a `display: contents` element that binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <DialogTrigger>
      <Button
        label="Open dialog"
        kind="primary"
      />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent>
          <DialogDescription>
            Modal content. Uses the shared Panel header, body, and footer regions.
          </DialogDescription>
        </PanelContent>
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Cancel"
            kind="outlined"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            label="Save"
            kind="primary"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
```

### Sizes

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'

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
          kind="outlined"
        />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>{{ sizeLabels[size] }}</DialogTitle>
            <DialogClose />
          </PanelHeader>
          <PanelContent>
            <DialogDescription>
              Panel max-width preset for the {{ size }} dialog, applied from the md breakpoint up.
            </DialogDescription>
          </PanelContent>
          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              label="Close"
              kind="outlined"
              @click="openBySize[size] = false"
            />
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </div>
</template>
```

### ScrollContent

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <DialogTrigger>
      <Button
        label="Open dialog"
        kind="primary"
      />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Domain settings</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent>
          <DialogDescription>Body taller than the dialog, so it has to scroll.</DialogDescription>
          <p>
            Setting 1 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 2 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 3 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 4 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 5 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 6 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 7 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 8 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 9 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 10 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 11 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 12 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 13 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 14 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 15 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 16 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 17 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
          <p>
            Setting 18 — the body is the only region that scrolls, so the title and the footer
            actions stay reachable.
          </p>
        </PanelContent>
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Cancel"
            kind="outlined"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            label="Save"
            kind="primary"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
```
