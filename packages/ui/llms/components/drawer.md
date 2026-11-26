# Drawer

> A panel that slides in from an edge of the screen and keeps the page behind it in view. It holds secondary work that is too large or too long-lived for a dialog: filters, a long form, the details of a row. Nothing inside a drawer navigates: no tabs, breadcrumb or links to other pages. `Drawer.Content` is the whole modal: it teleports to `body`, renders the dimmed overlay, traps focus and scroll-locks the page, so the page behind cannot be clicked or tabbed to while it is open. The header gets the close (X) button on its own unless `closable` is false. It closes on Escape and on an overlay click when `dismissible`, and returns focus to its trigger. `:modal="false"` is the one opt-out: no overlay, no focus trap, no scroll lock, for a side panel that works next to the page it talks about (as Radix `modal={false}`).

- Import: `import DrawerRoot from '@aziontech/ui/drawer-root'`
- Compound import (dot notation, not tree-shakeable): `import Drawer from '@aziontech/ui/drawer'`
- Category: overlay · Surface: app · Structure: composition
- API as JSON: [drawer.json](drawer.json)

## When to use

- A panel that slides in from a screen edge to add or edit one item of the screen behind it (a rule, an origin, a record inside a resource), while keeping that screen in view.
- The reader already stands on the screen that owns the item: the drawer is the last step of the path (rail, list, resource page, tab), never the first.
- A form needs a resource that does not exist yet (the certificate of a workload being created): the field offers to create it, and the drawer holds that resource's create form over the form, then selects it. Use it every time; never send the reader away to create it.
- The content is too large or persistent for a centered modal.

## Do

- Pick the edge (side) intentionally and keep it consistent across the app.
- The first drawer of a flow is `large`, the default and the widest: 40% of the screen. A nested drawer stacked on it is `size="medium"`, at most one, never a third. The AI assistant drawer is the one `medium` first drawer.
- Do not add an overlay, a portal or a close button by hand: `Drawer.Content` renders the overlay and the portal, and the header renders the close button while `closable` is true (the default).
- Keep the drawer modal (the default). Use `:modal="false"` only when the reader must keep reading or using the page beside the drawer, such as an assistant that answers questions about the page.
- While an action is in flight, set `:dismissible="false"` and `:closable="false"` together so nothing can close it.
- Bind the open state with `v-model:open`, or `:open` plus an `@update:open` handler typed `(open: boolean) => void`. The payload is always a `boolean`, so the handler needs no cast and no `Boolean(...)`.

## Don’t

- It is a short, focused confirmation/task best centered and fully blocking → use `dialog`.
- It is a small overlay anchored to a trigger → use a popover / `dropdown`.
- It opens, configures or edits a product or a resource (Configure, Settings, Edit) → navigate to the resource's page, on its settings tab.
- It needs tabs, a breadcrumb or its own navigation, or a third drawer would stack → it is a page.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [dialog](dialog.md) — centered, blocking modal for focused tasks/confirmations.
- [sidebar](sidebar.md) — persistent (non-overlay) side navigation.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `closable` | `boolean` | `true` | false | Shows the close (X) button at the end of the drawer header. False removes it; Escape and overlay click still follow `dismissible`. |
| `dismissible` | `boolean` | `true` | false | Light-dismiss: when true, overlay click and Escape close the drawer. It does not govern the close button; see `closable`. |
| `modal` | `boolean` | `true` | false | Renders the overlay, traps focus and locks page scroll. False leaves the page beside the drawer usable: no overlay, no focus trap, no scroll lock, `aria-modal` false; Escape, the close button and focus restore still work. |
| `side` | `DrawerSide` | `'end'` | false | Edge the drawer panel slides from, in reading direction (`start` or `end`). |
| `size` | `DrawerSize` | `'large'` | false | Panel width preset: `small` `--container-sm`, `medium` 30% of the screen (at least `--container-md`), `large` 40% of the screen (at least `--container-lg`), the widest and the default. Height is always 100% viewport. |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## Sub-component imports

- `@aziontech/ui/drawer-close`
- `@aziontech/ui/drawer-content`
- `@aziontech/ui/drawer-description`
- `@aziontech/ui/drawer-title`
- `@aziontech/ui/drawer-trigger`
- `@aziontech/ui/drawer-header`
- `@aziontech/ui/drawer-body`
- `@aziontech/ui/drawer-footer`

## Sub-components

- `index.ts` — the compound: the root with every part attached by `Object.assign` (`Drawer.Trigger`, `.Content`, `.Title`, `.Description`, `.Close`), plus the shared Panel regions as `Drawer.Header`, `Drawer.Body` and `Drawer.Footer`, each importable on its own as `@aziontech/ui/drawer-header`, `drawer-body` and `drawer-footer` (the same `panel-header`, `panel-body` and `panel-footer` files). It adds no component of its own. Exported at `@aziontech/ui/drawer`; the root alone is `@aziontech/ui/drawer-root`. The parts stay in the root folder (flat).
- `drawer-close.vue` — Public sub-component `drawer-close`: the close (X) `IconButton`. `Drawer.Content` puts one at the end of its `PanelHeader` while `closable` is true, so a consumer places it by hand only in a custom header with `:closable="false"`. It always closes the drawer.
- `drawer-content.vue` — Public sub-component `drawer-content`: the drawer itself. It teleports to `body` (kept mounted through the exit transition), renders the overlay while `modal` (`aria-hidden`, `drawer-content__backdrop` test id; a click on it closes the drawer when `dismissible`) and the `role="dialog"` panel, traps focus and scroll-locks the page while `modal`, and restores focus on close.
- `drawer-description.vue` — Public sub-component `drawer-description`.
- `drawer-title.vue` — Public sub-component `drawer-title`.
- `drawer-trigger.vue` — Public sub-component `drawer-trigger`. As-child trigger: a non-interactive inline wrapper (no `role`, no `tabindex`) that opens the drawer on the bubbling `click` and gives `aria-haspopup="dialog"` and `aria-expanded` to the slotted control, which is the one tab stop and the element focus returns to on close. When the first node in the slot is an Azion UI `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"`, opening on `Enter` / `Space`; for these and for native elements this is in the server HTML too.

- Test ids: each part falls back to its own name (`drawer-trigger`, `drawer-content`, `drawer-title`, `drawer-description`, `drawer-close`, and `panel-header`, `panel-body`, `panel-footer` for the shared regions), and a `data-testid` passed to the part wins; the root's `data-testid` does not rename the parts. The inner overlay and shell of `drawer-content` are `drawer-content__backdrop`, `__portal` and `__panel-shell`. The close button `Drawer.Content` adds while `closable` belongs to the root: `drawer__close`, or `<root test id>__close`.

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                                                                                                                        |
| -------------- | --------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Controlled open state through `defineModel('open')`, the single declaration of `open`, so `@update:open` is typed `(value: boolean) => void`, as on `dialog` and `popover`. Fires once per transition. While unbound the drawer is uncontrolled and starts at `defaultOpen`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)
- Phones: below `md` the drawer is a bottom sheet (full width, 80 dvh); below `sm` it becomes a full-height, full-width sheet (`top-0`, `h-dvh`, no radius, no border). The `PanelFooter` stays pinned under the scrolling content with full-width actions.
- Server render and hydration: the phone layout is CSS breakpoints only (`max-md:` / `md:`), so the server HTML and the hydrated DOM are identical at every width.
- `data-side` and `data-size` on the `role="dialog"` element mirror `side` and `size`, reactively; `side`, `size` and `dismissible` are read live from the root, so `:dismissible="!saving"` locks an open drawer while it saves. The width comes from utilities on the element (`data-[size=small]:md:max-w-(--container-sm)`, `medium` `max(30vw, var(--container-md))`, `large` `max(40vw, var(--container-lg))`), not a JS map or an inline `max-width`.
- Attributes: the `Drawer` root forwards every consumer attribute to its root element; `DrawerContent` forwards its attributes to the `role="dialog"` element.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Enter`/`Space` on the trigger opens the drawer and moves focus into it: to the control marked `data-autofocus`, else the first form field (a text input, textarea, select, combobox or spinbutton), else the first focusable control, so a drawer that opens with a form starts in its first field rather than on the close button. Focus is trapped: `Tab` on the last control wraps to the first and `Shift+Tab` on the first wraps to the last. `Escape` closes it and focus returns to the trigger, or, when opened without a `Drawer.Trigger`, to the element that held focus when it opened. Tests: `drawer.test.ts` › keyboard map (spec).
- ARIA: the panel is `role="dialog"` with `aria-modal="true"` (`false` with `:modal="false"`, where focus moves in on open but `Tab` is not trapped), `aria-labelledby` on the `DrawerTitle` id, and `aria-describedby` on the `DrawerDescription` id only while a `DrawerDescription` is mounted.
- Nested overlays: every open `DrawerContent` joins the shared overlay layer stack, so only the top layer handles `Escape` and `Tab` trapping: `Escape` in a `ConfirmDialog` opened from the drawer closes the confirm and leaves the drawer open. Tests: `drawer.test.ts` › nested overlays.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on every animated element.
- Touch target ≥40×40 px where the control is interactive.
- Overlay: a modal drawer (the default) always renders its overlay, so the page behind is never clickable while it is open. Tests: `drawer.test.ts` › overlay.
- Teleported content: the portal wraps its content (overlay and panel) in a `display: contents` element that binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import Drawer from '@aziontech/ui/drawer'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Drawer
    v-model:open="open"
    dismissible
    side="end"
    size="large"
  >
    <Drawer.Trigger>
      <Button
        label="Edit cache settings"
        variant="primary"
      />
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header class="w-full">
        <Drawer.Title>Cache settings</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Drawer.Description>
          Choose how long edge nodes keep a copy of each response before they ask the origin again.
        </Drawer.Description>
      </Drawer.Body>
      <Drawer.Footer>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <Button
            label="Cancel"
            variant="outline"
            @click="open = false"
          />
          <Button
            label="Save"
            variant="primary"
            @click="open = false"
          />
        </div>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer>
</template>
```

### Sizes

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerDescription from '@aziontech/ui/drawer-description'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import DrawerTrigger from '@aziontech/ui/drawer-trigger'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { reactive, watch } from 'vue'

  const sizes = ['small', 'medium', 'large']
  const sizeLabels = {
    small: 'Small (408px)',
    medium: 'Medium (30%)',
    large: 'Large (40%)'
  }
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
  <div class="flex flex-wrap items-center justify-center gap-(--spacing-4)">
    <Drawer
      v-for="size in sizes"
      :key="size"
      :size="size"
      v-model:open="openBySize[size]"
      dismissible
      side="end"
    >
      <DrawerTrigger>
        <Button
          :label="sizeLabels[size]"
          variant="primary"
        />
      </DrawerTrigger>
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>{{ sizeLabels[size] }}</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <DrawerDescription>
            Panel max-width preset for the {{ size }} drawer. Height is always 100% viewport.
          </DrawerDescription>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <Button
              label="Cancel"
              variant="outline"
              @click="openBySize[size] = false"
            />
            <Button
              label="Save"
              variant="primary"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
```

### ScrollContent

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerDescription from '@aziontech/ui/drawer-description'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import DrawerTrigger from '@aziontech/ui/drawer-trigger'
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
    }
  ]
</script>

<template>
  <Drawer
    v-model:open="open"
    dismissible
    side="end"
    size="large"
  >
    <DrawerTrigger>
      <Button
        label="Edit domain settings"
        variant="primary"
      />
    </DrawerTrigger>
    <DrawerContent>
      <PanelHeader class="w-full">
        <DrawerTitle>Domain settings</DrawerTitle>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <DrawerDescription>
            Changes apply to new requests on shop.example.com within a few minutes.
          </DrawerDescription>
          <section
            v-for="setting in settings"
            :key="setting.name"
            class="flex flex-col gap-(--spacing-xs) rounded-(--shape-control) border border-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
          >
            <h3 class="m-0 text-body-md text-(--text-default)">{{ setting.name }}</h3>
            <p class="m-0 text-body-sm text-(--text-muted)">{{ setting.value }}</p>
          </section>
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
    </DrawerContent>
  </Drawer>
</template>
```
