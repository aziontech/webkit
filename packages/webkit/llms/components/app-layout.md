# App Layout

> The frame every signed-in product page renders inside. It places named regions — navigation, header, notifications, breadcrumbs, content, tools (the help panel) and the split panel — and owns how they open, close, resize and remember their state. It responds to its **own** width, not the viewport's: below `compactBelow` pixels the navigation and the tools turn into drawers and the split panel moves to the bottom. The regions are slots, so the shell (the `shells/console` block) keeps its own `Sidebar`, `GlobalHeader` and page content and only hands the frame to `AppLayout`.

- Import: `import AppLayout from '@aziontech/webkit/app-layout'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [app-layout.json](https://github.com/aziontech/webkit/blob/main/.specs/app-layout.json)

## When to use

- A product shell needs a navigation rail, a global header and a scrolling content area that turn into a drawer-based layout on phones.
- A page offers contextual help beside the work (`HelpPanel` in the tools region) that the reader opens and closes.
- A list or table needs a resizable detail panel under it or beside it (the split panel), showing the selected item without leaving the page.
- Page-level flash messages (`Alert`) must sit above the content and stay visible while the content scrolls.

## Do

- One `AppLayout` per page, at the root. Do not nest them.
- Keep the navigation in the `navigation` slot and read its `drawer` scope flag to drop rail-only controls (resize, collapse) when it renders inside the drawer.
- Put the control that opens the navigation drawer in the header, and show it only when the header scope's `compact` is true.
- Put a help button in the header that calls `toggleTools`; the tools region carries its own close button.
- Use the split panel for the selected item of a collection. Close it when the selection clears.
- Pass `storageKey` when the reader's choices (split panel size and position, navigation and tools open) should survive a reload.
- Flash notifications belong in the `notifications` slot, one `Alert` per message, dismissible. Use toasts for results of actions that finish in the background.

## Don’t

- A single resizable split inside a page, with no shell around it → use `resizable`.
- A navigation rail on its own (resize, collapse, footer) → use `sidebar`; put it in the `navigation` slot.
- A one-off overlay for a task (a create form, a detail preview) → use `drawer`.
- Marketing and documentation pages → use the `shells/website` and `shells/documentation` blocks.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sidebar](sidebar.md) — the navigation rail that goes in the `navigation` slot; it owns its own width, resize and collapse.
- [global-header](global-header.md) — the bar that goes in the `header` slot.
- [help-panel](help-panel.md) — the content of the tools region.
- [drawer](drawer.md) — what the navigation and tools regions become below `compactBelow`.
- [resizable](resizable.md) — a split between panes inside a page, without the shell.
- [alert](alert.md) — the flash messages composed into the `notifications` slot.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `navigationOpen` | `boolean` | `true` | false | Whether the navigation region shows beside the content. Use with `v-model:navigation-open`. Not used while compact. |
| `navigationLabel` | `string` | `''` | false | Accessible name of the navigation drawer. Empty uses the locale catalog (`Navigation`). |
| `toolsOpen` | `boolean` | `false` | false | Whether the tools region (help) is open; while compact it drives the tools drawer. Use with `v-model:tools-open`. |
| `toolsLabel` | `string` | `''` | false | Title of the tools region, shown in its header. Empty uses the locale catalog (`Help`). |
| `toolsWidth` | `number` | `320` | false | Width of the tools region in pixels while not compact. |
| `splitPanelOpen` | `boolean` | `false` | false | Whether the split panel is open. Use with `v-model:split-panel-open`. |
| `splitPanelPosition` | `'bottom' \| 'side'` | `'bottom'` | false | Where the split panel sits: under the content or beside it. Use with `v-model:split-panel-position`. Bottom while compact. |
| `splitPanelSize` | `number` | `320` | false | Height (bottom) or width (side) of the split panel in pixels. Use with `v-model:split-panel-size`. |
| `splitPanelTitle` | `string` | `''` | false | Title of the split panel, shown in its header. Empty uses the locale catalog (`Details`). |
| `storageKey` | `string` | `''` | false | When set, the split panel size and position and the navigation and tools open state are kept in `localStorage` under it. |
| `compactBelow` | `number` | `768` | false | Width of the layout itself, in pixels, under which navigation and tools become drawers and the split panel moves down. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:navigationOpen` | `boolean` | v-model:navigation-open. |
| `update:toolsOpen` | `boolean` | v-model:tools-open. |
| `update:splitPanelOpen` | `boolean` | v-model:split-panel-open. |
| `update:splitPanelPosition` | `'bottom' \| 'side'` | v-model:split-panel-position. |
| `update:splitPanelSize` | `number` | v-model:split-panel-size; on every step. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The page content (the consumer's `<main>`). Scrolls on its own. |
| `navigation` | { drawer: boolean } | The navigation rail. Rendered once: beside the content, or inside the navigation drawer when compact. |
| `header` | { compact: boolean, openNavigation: () => void, toggleNavigation: () => void, toggleTools: () => void } | The global header, above content, tools and split panel. |
| `notifications` | — | Flash messages (`Alert`) above the breadcrumbs and the content; stays in place while content scrolls. |
| `breadcrumbs` | — | Breadcrumbs above the content, inside the scroll area. |
| `tools` | — | The tools region's body, usually a `HelpPanel`. |
| `split-panel` | — | The split panel's body. |

## States

- Visual states: `default`, `compact`; per region `open` / `closed`; the split separator `focus-visible` and `resizing`.
- `data-compact` on the root while the layout is narrower than `compactBelow`.
- `data-navigation`, `data-tools`, `data-split-panel` on the root: `open` | `closed`.
- `data-split-panel-position` on the root: `bottom` | `side` (always `bottom` while compact).
- `data-resizing` on the split separator while it is dragged.
- First render (server and client) is the wide layout; the compact layout applies after mount, once the layout has measured itself.

## Accessibility

- Visible focus: the separator shows `var(--accent)` on `focus-visible`; the region buttons are `IconButton` with their own ring.
- Keyboard map: `Tab` reaches the region controls in DOM order (navigation, header, content, split panel, tools). On the split separator: `ArrowUp` / `ArrowDown` grow and shrink a bottom panel; `ArrowLeft` / `ArrowRight` grow and shrink a side panel (mirrored under RTL); `Shift` makes the step 64 px instead of 16 px; `Home` / `End` go to the minimum / maximum. `Escape` closes a compact drawer (from `Drawer`) and returns focus to the control that opened it. The split panel and tools bodies are focusable scroll regions (`tabindex="0"`, `role="group"` named by their heading), so a keyboard reader can scroll them when they hold no control.
- ARIA: the tools region and the split panel are `<section aria-labelledby>` their header title (`<h2>`); the separator is `role="separator"` with `aria-orientation`, `aria-valuenow` / `aria-valuemin` / `aria-valuemax` in pixels, `aria-controls` the split panel and an accessible name from the catalog. The compact drawers are named by `navigationLabel` and `toolsLabel`. The layout adds no landmark of its own around the content; the consumer's `<main>` and `Sidebar` `<nav>` are the landmarks.
- Contrast ≥4.5:1 for the region titles; ≥3:1 for the separator against the surfaces.
- `motion-reduce:transition-none` on the separator transition.
- Touch target: the separator's hit area is 16 px across (a `before:` pseudo-element) over a 4 px line; region buttons are 32 px `IconButton` (40 px on `pointer: coarse` from `IconButton`).

## Right-to-left

- Layout: logical utilities only (`border-s`, `border-e`, `ms-auto`); the navigation sits at the inline start and the tools and side split panel at the inline end.
- Icons: the position toggle icons (`pi pi-window-maximize` family) are not mirrored; close is not mirrored.
- Keyboard: on a side split panel, the arrow that points away from the panel grows it — `ArrowLeft` in LTR, `ArrowRight` in RTL.
- User data: none.

## Internationalization

| Key                          | English source          | Override prop     |
| ---------------------------- | ----------------------- | ----------------- |
| `appLayout.navigation`       | Navigation              | `navigationLabel` |
| `appLayout.tools`            | Help                    | `toolsLabel`      |
| `appLayout.closeTools`       | Close help              | —                 |
| `appLayout.splitPanel`       | Details                 | `splitPanelTitle` |
| `appLayout.closeSplitPanel`  | Close panel             | —                 |
| `appLayout.resizeSplitPanel` | Resize panel            | —                 |
| `appLayout.showAtSide`       | Show beside the content | —                 |
| `appLayout.showAtBottom`     | Show under the content  | —                 |

- Formatting: none.

## Responsive

- Container queries: the root is `@container/app-layout`; a `ResizeObserver` on the root switches to compact when its own width is under `compactBelow` (768 px by default), so the layout also goes compact inside a narrow host, not only on a narrow viewport.
- Narrow (compact): navigation renders in a `Drawer` from the inline end (the design sample's phone menu), the tools in a `Drawer`, the split panel is forced to the bottom and its position toggle hides; the split panel's maximum is 70 % of the layout height.
- Touch: region buttons are `IconButton`; the separator has a 16 px hit area and pointer drag works with touch (pointer events).
- Reflow: the content scrolls on its own; no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
  import AppLayout from '@aziontech/webkit/app-layout'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import Link from '@aziontech/webkit/link'
  import Menu from '@aziontech/webkit/menu'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const toolsOpen = ref(true)
  const splitPanelOpen = ref(true)
  const notice = ref(true)

  const crumbs = [{ label: 'Services', href: '#' }, { label: 'web-app-prod' }]
</script>

<template>
  <div class="h-dvh">
    <AppLayout
      v-model:tools-open="toolsOpen"
      v-model:split-panel-open="splitPanelOpen"
      split-panel-title="web-app-prod"
      tools-label="Help: Services"
    >
      <template #navigation="{ drawer }">
        <Sidebar
          aria-label="Main navigation"
          :resizable="!drawer"
          :collapsible="!drawer"
        >
          <Menu role="presentation">
            <MenuGroup>
              <MenuItem
                label="Home"
                icon="ai ai-home"
                href="#"
              />
              <MenuItem
                label="Services"
                icon="ai ai-edge-application"
                href="#"
                selected
              />
              <MenuItem
                label="Variables"
                icon="ai ai-variables"
                href="#"
              />
            </MenuGroup>
          </Menu>
        </Sidebar>
      </template>

      <template #header="{ compact, openNavigation, toggleTools }">
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left class="justify-start!">
            <IconButton
              v-if="compact"
              icon="pi pi-bars"
              aria-label="Open navigation"
              kind="outlined"
              size="medium"
              @click="openNavigation"
            />
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <IconButton
              icon="pi pi-question-circle"
              aria-label="Help"
              kind="outlined"
              size="medium"
              :aria-pressed="toolsOpen"
              @click="toggleTools"
            />
          </GlobalHeader.Right>
        </GlobalHeader>
      </template>

      <template #notifications>
        <Alert
          v-if="notice"
          severity="info"
          closable
          @close="notice = false"
        >
          Scheduled maintenance on Nov 20 from 02:00 to 03:00 UTC. Services keep serving traffic.
        </Alert>
      </template>

      <template #breadcrumbs>
        <Breadcrumb :items="crumbs" />
      </template>

      <main class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <PageHeader
          title="web-app-prod"
          description="The service that answers shop.example.com."
        />
        <div class="flex flex-wrap gap-(--spacing-xs)">
          <Button
            label="Show details"
            kind="outlined"
            size="medium"
            @click="splitPanelOpen = true"
          />
        </div>
      </main>

      <template #split-panel>
        <KeyValuePairs aria-label="Service details">
          <KeyValuePairs.Item label="Status">
            <StatusIndicator
              severity="success"
              label="Active"
            />
          </KeyValuePairs.Item>
          <KeyValuePairs.Item label="Domain">shop.example.com</KeyValuePairs.Item>
          <KeyValuePairs.Item label="Last deploy">Nov 10, 2026, 14:32</KeyValuePairs.Item>
        </KeyValuePairs>
      </template>

      <template #tools>
        <HelpPanel aria-label="Help: Services">
          <HelpPanel.Header
            title="Services"
            description="Where your domains meet the code that answers them."
          />
          <HelpPanel.Section title="What is a service?">
            <p>A service binds one or more domains to the code and rules that answer them.</p>
          </HelpPanel.Section>
          <HelpPanel.Links>
            <Link
              label="Services documentation"
              href="https://example.com/docs"
              target="_blank"
            />
          </HelpPanel.Links>
        </HelpPanel>
      </template>
    </AppLayout>
  </div>
</template>
```

### SplitPanelSide

```vue
<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { computed, ref } from 'vue'

  const services = [
    { id: 'web-app-prod', domain: 'shop.example.com', status: 'success', label: 'Active' },
    { id: 'payments-api', domain: 'pay.example.com', status: 'success', label: 'Active' },
    { id: 'status-page', domain: 'status.example.com', status: 'warning', label: 'Degraded' }
  ]

  const selectedId = ref('web-app-prod')
  const selected = computed(() => services.find((service) => service.id === selectedId.value))
  const splitPanelOpen = computed({
    get: () => Boolean(selected.value),
    set: (open) => {
      if (!open) selectedId.value = ''
    }
  })
</script>

<template>
  <AppLayout
    v-model:split-panel-open="splitPanelOpen"
    split-panel-position="side"
    :split-panel-title="selected ? selected.id : ''"
    storage-key="example-services-layout"
    class="h-dvh"
  >
    <main class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
      <PageHeader
        title="Services"
        description="Select a service to see its details beside the list."
      />
      <ul
        aria-label="Services"
        class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0"
      >
        <li
          v-for="service in services"
          :key="service.id"
        >
          <button
            type="button"
            :aria-pressed="selectedId === service.id"
            class="flex w-full items-center justify-between gap-(--spacing-sm) rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-md text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) aria-pressed:border-(--accent) motion-reduce:transition-none"
            @click="selectedId = service.id"
          >
            <span class="min-w-0 truncate">{{ service.id }}</span>
            <StatusIndicator
              :severity="service.status"
              :label="service.label"
            />
          </button>
        </li>
      </ul>
    </main>

    <template #split-panel>
      <KeyValuePairs
        v-if="selected"
        aria-label="Service details"
      >
        <KeyValuePairs.Item label="Status">
          <StatusIndicator
            :severity="selected.status"
            :label="selected.label"
          />
        </KeyValuePairs.Item>
        <KeyValuePairs.Item label="Domain">{{ selected.domain }}</KeyValuePairs.Item>
      </KeyValuePairs>
    </template>
  </AppLayout>
</template>
```

### Compact

```vue
<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Sidebar from '@aziontech/webkit/sidebar'
</script>

<template>
  <div class="mx-auto h-dvh w-full max-w-(--container-xs) border-x border-(--border-default)">
    <AppLayout>
      <template #navigation="{ drawer }">
        <Sidebar
          aria-label="Main navigation"
          :resizable="!drawer"
          :collapsible="!drawer"
        >
          <Menu role="presentation">
            <MenuGroup>
              <MenuItem
                label="Home"
                icon="ai ai-home"
                href="#"
                selected
              />
              <MenuItem
                label="Services"
                icon="ai ai-edge-application"
                href="#"
              />
            </MenuGroup>
          </Menu>
        </Sidebar>
      </template>

      <template #header="{ compact, openNavigation, toggleTools }">
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left class="justify-start!">
            <IconButton
              v-if="compact"
              icon="pi pi-bars"
              aria-label="Open navigation"
              kind="outlined"
              size="medium"
              @click="openNavigation"
            />
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <IconButton
              icon="pi pi-question-circle"
              aria-label="Help"
              kind="outlined"
              size="medium"
              @click="toggleTools"
            />
          </GlobalHeader.Right>
        </GlobalHeader>
      </template>

      <main class="p-(--spacing-md)">
        <PageHeader
          title="Home"
          description="On a narrow screen the navigation and the help open as drawers."
        />
      </main>

      <template #tools>
        <HelpPanel aria-label="Help: Home">
          <HelpPanel.Header
            title="Home"
            description="A summary of what is running in this account."
          />
        </HelpPanel>
      </template>
    </AppLayout>
  </div>
</template>
```
