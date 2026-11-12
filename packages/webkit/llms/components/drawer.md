# Drawer

> Layered surface above the page (modal, drawer, menu). Lives at `packages/webkit/src/components/overlay/drawer/`.

- Import: `import Drawer from '@aziontech/webkit/drawer'`
- Category: overlay · Surface: product · Structure: composition
- API as JSON: [drawer.json](https://github.com/aziontech/webkit/blob/main/.specs/drawer.json)

## When to use

- A panel that slides in from a screen edge for secondary tasks, filters, long forms, or navigation, while keeping page context.
- The content is too large or persistent for a centered modal.

## Do

- Pick the edge (side) intentionally and keep it consistent across the app.
- Trap focus while open and provide an obvious close affordance.

## Don’t

- It is a short, focused confirmation/task best centered and fully blocking → use `dialog`.
- It is a small overlay anchored to a trigger → use a popover / `dropdown`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [dialog](dialog.md) — centered, blocking modal for focused tasks/confirmations.
- [sidebar](sidebar.md) — persistent (non-overlay) side navigation.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `dismissible` | `boolean` | `true` | false | When true, overlay click and Escape close the drawer. |
| `side` | `DrawerSide` | `'right'` | false | Edge the drawer panel slides from. |
| `size` | `DrawerSize` | `'medium'` | false | Panel max-width preset (`small` 384px, `medium` 672px, `large` 1024px). Height is always 100% viewport. |
| `open` | `boolean \| undefined` | `undefined` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## Sub-component imports

- `@aziontech/webkit/drawer-close`
- `@aziontech/webkit/drawer-content`
- `@aziontech/webkit/drawer-description`
- `@aziontech/webkit/drawer-overlay`
- `@aziontech/webkit/drawer-portal`
- `@aziontech/webkit/drawer-title`
- `@aziontech/webkit/drawer-trigger`

## Sub-components

- `drawer-close.vue` — Public sub-component `drawer-close`.
- `drawer-content.vue` — Public sub-component `drawer-content`.
- `drawer-description.vue` — Public sub-component `drawer-description`.
- `drawer-overlay.vue` — Public sub-component `drawer-overlay`.
- `drawer-portal.vue` — Public sub-component `drawer-portal`.
- `drawer-title.vue` — Public sub-component `drawer-title`.
- `drawer-trigger.vue` — Public sub-component `drawer-trigger`. As-child trigger: a non-interactive inline wrapper (no `role`, no `tabindex`) that opens the drawer on the bubbling `click` and gives `aria-haspopup="dialog"` and `aria-expanded` to the slotted control, which is the one tab stop and the element focus returns to on close. When the first node in the slot is a WebKit `Button` / `IconButton` or a native control (`button`, `a[href]`, form controls, `[role=button]`, `[tabindex]` ≥ 0), or one of those as the first node inside a `Tooltip` (the trigger looks through the `Tooltip` to its slotted control), the ARIA and `id` are merged into that control at render, so server-rendered HTML already carries them on the control; for anything else (a control nested in another component) the trigger forwards them onto the first focusable element in its slot after mount and on every update. When the slot holds no focusable element (plain text, an icon, an `Avatar`, or a `Badge` / `Tag` / `SeverityTag` without slot content), the wrapper itself becomes the control: `role="button"`, `tabindex="0"`, opening on `Enter` / `Space`; for these and for native elements this is in the server HTML too.

## v-model

| Model          | Type                   | Default     | Emits         | Notes                                                                                                                                    |
| -------------- | ---------------------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean \| undefined` | `undefined` | `update:open` | Controlled open state through `defineModel('open')`, the single declaration of `open`, so `@update:open` carries the model type `boolean | undefined`(the`undefined`of an unbound model; a transition always sends a boolean), as on`dialog`and`popover`. Fires once per transition. While unbound the drawer is uncontrolled and starts at `defaultOpen`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)
- Phones: below `md` the drawer is a bottom sheet (full width, 80 dvh); below `sm` it becomes a full-height, full-width sheet (`top-0`, `h-dvh`, no radius, no border). The `PanelFooter` stays pinned under the scrolling content with full-width actions.
- Server render and hydration: the phone layout reads the viewport only after mount (`use-overlay-mobile` gates the media query on `useMounted`), so a drawer rendered open on the server hydrates with the desktop panel and switches to the phone sheet in the same tick as mount, before paint.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Enter`/`Space` on the trigger opens the drawer and moves focus to its first focusable control. Focus is trapped: `Tab` on the last control wraps to the first and `Shift+Tab` on the first wraps to the last. `Escape` closes it and focus returns to the trigger, or, when opened without a `Drawer.Trigger`, to the element that held focus when it opened. Tests: `drawer.test.ts` › keyboard map (spec).
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
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Drawer
    v-model:open="open"
    dismissible
    side="right"
    size="medium"
  >
    <DrawerTrigger>
      <Button
        label="Open drawer"
        kind="primary"
      />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <DrawerDescription>
            Side panel content. Uses the same Panel header, body, and footer regions as Dialog.
          </DrawerDescription>
        </PanelContent>
        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <Button
              label="Cancel"
              kind="outlined"
              @click="open = false"
            />
            <Button
              label="Save"
              kind="primary"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
```

### Sizes

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { reactive, watch } from 'vue'

  const sizes = ['small', 'medium', 'large']
  const sizeLabels = {
    small: 'Small (384px)',
    medium: 'Medium (672px)',
    large: 'Large (1024px)'
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
      side="right"
    >
      <DrawerTrigger>
        <Button
          :label="sizeLabels[size]"
          kind="primary"
        />
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <PanelHeader class="w-full">
            <DrawerTitle>{{ sizeLabels[size] }}</DrawerTitle>
            <DrawerClose />
          </PanelHeader>
          <PanelContent>
            <DrawerDescription>
              Panel max-width preset for the {{ size }} drawer. Height is always 100% viewport.
            </DrawerDescription>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
              <Button
                label="Cancel"
                kind="outlined"
                @click="openBySize[size] = false"
              />
              <Button
                label="Save"
                kind="primary"
              />
            </div>
          </PanelFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
```

### ScrollContent

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { ref } from 'vue'

  const open = ref(false)
  const scrollSections = Array.from({ length: 12 }, (_, index) => ({
    title: `Section ${index + 1}`,
    body: `Scrollable drawer body copy for section ${index + 1}. Only PanelContent scrolls; header and footer stay in the panel layout.`
  }))
</script>

<template>
  <Drawer
    v-model:open="open"
    dismissible
    side="right"
    size="medium"
  >
    <DrawerTrigger>
      <Button
        label="Open scrollable drawer"
        kind="primary"
      />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Scrollable drawer</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <div class="flex flex-col gap-(--spacing-4)">
            <DrawerDescription>
              Place long forms, lists, or settings inside PanelContent. Only the body scrolls inside
              ScrollArea while header and footer stay in the panel layout.
            </DrawerDescription>
            <section
              v-for="section in scrollSections"
              :key="section.title"
              class="flex flex-col gap-(--spacing-2) rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) p-(--spacing-4)"
            >
              <h3 class="m-0 text-body-md text-(--text-default)">{{ section.title }}</h3>
              <p class="m-0 text-body-sm text-(--text-muted)">{{ section.body }}</p>
            </section>
          </div>
        </PanelContent>
        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <Button
              label="Cancel"
              kind="outlined"
              @click="open = false"
            />
            <Button
              label="Save"
              kind="primary"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
```
