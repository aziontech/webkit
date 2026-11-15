# Sidebar

> Helps users move between views or sections. Composable application sidebar with optional header and footer regions; navigation content scrolls inside a built-in `ScrollArea`. It also owns **the rail gesture** — sizing the sidebar by dragging its trailing edge, and collapsing it out of the layout entirely. That belongs here rather than in each shell: the interaction is not a small one (a pointer drag that crosses the collapse boundary continuously, a keyboard equivalent, token-derived bounds, a phase-aware transition, and an affordance that brings a collapsed rail back), and every app that has a sidebar wants the same one. Two shells re-implementing it is how the two drift apart. Both halves are **opt-in and independent**: `resizable` adds the drag, `collapsible` adds the collapse trigger and the edge affordance. `collapsible="icon"` collapses to an **icon rail** instead of leaving the layout, and `shortcut` adds the Ctrl+B / Cmd+B toggle. With neither set the component renders exactly as it always has, with the host owning the width — every existing consumer is unaffected.

- Import: `import SidebarRoot from '@aziontech/webkit/sidebar-root'`
- Compound import (dot notation, not tree-shakeable): `import Sidebar from '@aziontech/webkit/sidebar'`
- Category: layout · Surface: app · Structure: composition
- API as JSON: [sidebar.json](https://github.com/aziontech/webkit/blob/main/.specs/sidebar.json)

## When to use

- Use Sidebar only when not using ConsoleLayout, which already renders the rail; put a SidebarMenu inside it.
- The persistent navigation column of an app shell, with an optional header (brand, workspace switcher) and footer (profile, settings) around a scrolling `SidebarMenu`.
- The user should be able to resize the rail by dragging its trailing edge (`resizable`) or take it out of the layout and bring it back (`collapsible`).
- Wide work surfaces where the navigation should shrink to its icons rather than disappear (`collapsible="icon"`), so a destination stays one click away.
- The rail's size or collapsed state must survive navigation or reloads — bind `v-model:width` and `v-model:open` and persist them in the app.

## Do

- Put a `SidebarMenu` with `role="presentation"` in the default slot; the sidebar already renders the `nav` landmark and its `aria-label` (default `'Sidebar'`) names the region.
- Group the rows with `SidebarMenu.Group`; the sidebar has no group part of its own.
- Without `resizable` or `collapsible`, size the rail with a width class on the root; with either set, the sidebar owns the width and clamps it between `min-width-token` and `max-width-token`.
- When the sidebar is revealed after mount (for example leaving a mobile layout where it was hidden), call the exposed `measure()` so the rail does not keep a zero width.
- Keep the profile block in the `footer` slot; with `collapsible`, the collapse trigger renders in the same footer row.
- With `collapsible="icon"`, give every top-level `SidebarMenu.Item` and drill `SidebarMenu.SubTrigger` an icon: rows without one (and inline sub-menus) step aside in the rail. Use the `{ rail }` slot scope to compact header and footer content (an avatar without the name).
- Turn on `shortcut` for one sidebar per page only; Ctrl+B / Cmd+B is a page-wide key.

## Don’t

- Adjacent work areas the reader resizes (editor beside a preview, a terminal under it) → use `resizable`.
- Horizontal top-level navigation with dropdown panels → use `navigation-menu`.
- A temporary panel that slides over the page → use `drawer`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sidebar-menu](sidebar-menu.md) — the navigation rows, groups and drill levels that go in the sidebar's default slot.
- [resizable](resizable.md) — draggable splits between content regions; the sidebar's rail gesture is for navigation only.
- [app-header](app-header.md) — the top bar that usually sits above the sidebar in an app shell.
- [console-layout](console-layout.md) — the console layout template that composes the header, the sidebar and the page.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the navigation landmark. Empty uses the locale catalog (`Sidebar`). |
| `resizable` | `boolean` | `false` | false | Adds the drag handle on the trailing edge; dragging past the minimum collapses the rail. |
| `collapsible` | `boolean \| SidebarCollapsible` | `false` | false | Adds the collapse trigger; `true` or `'offcanvas'` takes a collapsed sidebar out of the layout (with the edge affordance that brings it back), `'icon'` keeps an icon rail. |
| `shortcut` | `boolean` | `false` | false | Lets Ctrl+B / Cmd+B toggle `open` while the sidebar is collapsible. Ignored while focus is in an editable field. |
| `minWidthToken` | `string` | `'--container-3xs'` | false | Theme container token the sized width is clamped up to, read off the document at runtime. |
| `maxWidthToken` | `string` | `'--container-sm'` | false | Theme container token the sized width is clamped down to, read off the document at runtime. |
| `collapseAriaLabel` | `string` | `''` | false | Accessible name for the collapse trigger. Empty uses the locale catalog (`Collapse sidebar`). |
| `expandAriaLabel` | `string` | `''` | false | Accessible name for the control and the grab bar that bring a collapsed rail back. Empty uses the locale catalog (`Expand sidebar`). |
| `resizeAriaLabel` | `string` | `''` | false | Accessible name for the drag handle separator. Empty uses the locale catalog (`Resize sidebar`). |
| `open` | `boolean` | `true` | false | Two-way value (`v-model:open`). |
| `width` | `number \| null` | `null` | false | Two-way value (`v-model:width`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | { rail: boolean } | The navigation. `rail` is true while the sidebar is collapsed to its icon rail. |
| `header` | { rail: boolean } | Named slot. Use `rail` to compact the content in the icon rail. |
| `footer` | { rail: boolean } | Named slot. The collapse trigger renders after this content in the same row, under one full-width separator, so a profile block and the trigger read as one footer. In the icon rail the row stacks and the trigger becomes the expand button. |

## Sub-component imports

- `@aziontech/webkit/sidebar-header`
- `@aziontech/webkit/sidebar-footer`

## Sub-components

The compound `@aziontech/webkit/sidebar` (its `index.ts`) attaches every part for dot-notation —
`Sidebar.Header`, `Sidebar.Footer` — and `@aziontech/webkit/sidebar-root` is the
standalone, tree-shakeable root with nothing attached. The flat sub-component paths below keep
working.

- `sidebar-footer.vue` — Public sub-component `sidebar-footer`.
- `sidebar-header.vue` — Public sub-component `sidebar-header`.

`Sidebar` does not import `SidebarMenu` and `SidebarMenu` does not import `Sidebar`. Two things pass between
them: the ring-offset surface below, and the sidebar context (`SidebarInjectionKey`, read with
`inject(…, null)` so a `SidebarMenu` outside a sidebar is unaffected), which tells the menu rows whether
the sidebar is an icon rail, which side their tooltips open on, the `Tooltip` component to wrap a rail row in (handed down so
`SidebarMenu` bundles no tooltip of its own), and how to expand it.

## v-model

| Model           | Type             | Default | Emits          | Notes                                                                                                                                                                                                                                                                                                                                                                          |
| --------------- | ---------------- | ------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model:open`  | `boolean`        | `true`  | `update:open`  | Whether the rail is in the layout. `false` collapses it: out of the layout (`collapsible` `true` / `'offcanvas'`) or down to its icon rail (`'icon'`) — by the trigger, the drag crossing the snap boundary, the keyboard nudge, or a double-click on the handle. Same name as shadcn's Sidebar `open`; the layouts that compose it call the same state `navigationOpen`.      |
| `v-model:width` | `number \| null` | `null`  | `update:width` | The sized width in px, already clamped to the token bounds and emitted continuously during a drag. `null` means _not sized yet_: the sidebar seeds it from its own natural width on mount, after which the gesture owns it. px is the model's native unit because it is the outcome of a pointer gesture; the **bounds** come from tokens (`minWidthToken` / `maxWidthToken`). |

Every model is inert unless `resizable` or `collapsible` is set. With neither, no inline width is
applied and the host's own `class="w-[280px]"` governs exactly as before. The models are declared
with `defineModel`, so their `update:*` events are not hand-declared.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state="closed"` on the root while the rail is collapsed (out of the layout, or down to the icon rail), `data-state="open"` otherwise
- `data-rail` on the root while `collapsible="icon"` and collapsed; the rail stays in the layout at
  `var(--size-14)`, is **not** `inert` or `aria-hidden`, renders no edge affordance, and its footer
  trigger becomes `__expand-button` (`Expand sidebar`). Menu rows inside it carry `data-rail` too:
  labels become screen-reader-only and move into a `Tooltip`, tags and group labels step aside,
  rows without an icon and inline sub-menus are hidden.
- `data-resizing` on the root and on the handle while a pointer drag is in flight
- `data-preview` on the collapsed edge zone while it is showing the rail's preview sliver
- `data-state` / `data-resizing` / `data-preview` are **reported state, not the motion
  driver**: the collapse/expand animation itself runs off the hidden checkbox's `:checked` (see
  Motion & Animations), so these attributes exist for consumer styling hooks and for tests, not
  because the component's own CSS depends on them for that transition.
- `data-hydrated` on the root once Vue has mounted — internal only (switches the native
  `resize: horizontal` pre-hydration fallback back off in favor of the JS-driven handle); not a
  documented consumer styling hook.
- `data-settled` on the root and on the panel two frames after mount — internal only (gates the
  rail's motion off until then, so a state restored at mount lands in place; see Motion &
  Animations); not a documented consumer styling hook.
- Region testids derived from the root: `__panel` (the fixed-width inner panel),
  `__collapse-input` (the hidden checkbox that carries the collapsed state, `!open`, for CSS — not an interactive
  control; see Accessibility), `__header`, `__nav`, `__scroll`, `__footer`, `__collapse` (the
  trigger), `__handle` (the drag separator), `__expand` / `__expand-button` (the collapsed
  affordance)
- A collapsed offcanvas rail carries `inert` + `aria-hidden`, so it holds no tab stops while it is out; an icon rail keeps its rows reachable

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
  The **scroll viewport is not a tab stop** (`tabindex="-1"` on the built-in `ScrollArea`): a scroll
  region needs one only when nothing inside it is focusable, and this one holds a `SidebarMenu` of rows —
  so `Tab` reaches the first row directly instead of the box around it.
  The region also keeps `var(--spacing-2xs)` of padding — and the same as `scroll-padding` — inside
  the clip, because the first row's focus ring (`ring-2` over `ring-offset-2`) reaches 4 px past the
  row and a viewport flush against it would cut the ring off.
  The **drag handle is a focusable `role="separator"`**, so the gesture has a keyboard equivalent:
  `ArrowLeft` / `ArrowRight` nudge the width, `ArrowLeft` past the snap boundary collapses, and
  `ArrowRight` from the collapsed splitter brings the rail back. Pointer-wise that same collapsed
  splitter is click-to-restore as well as drag-to-size, so the edge is never a drag-only control.
  Right-to-left: the rail sits on the inline start, so in an `rtl` subtree the keys and the drag
  mirror (`ArrowLeft` and a leftward drag widen it, `ArrowRight` narrows it), the expand affordance
  slides in from the right, and its tooltip opens on the left.
- **Shortcut** (`shortcut`): Ctrl+B / Cmd+B toggles `open` from anywhere on the page, except
  while focus is in an input, a textarea, a select or a contenteditable host, and not when another
  handler already called `preventDefault`. The collapse and expand triggers announce it with
  `aria-keyshortcuts="Control+B Meta+B"`.
- **Icon rail** (`collapsible="icon"`): every row keeps its label as its accessible name (visually
  hidden, not removed) and shows it in a `Tooltip` on hover and focus, opening toward the inline
  end (`right`, `left` under `rtl`). Activating a drill row in the rail expands the sidebar first.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component. Each
  separator is named (`resizeAriaLabel` / `expandAriaLabel`) because a bare separator announces
  nothing about what it sizes; the collapse trigger is named by `collapseAriaLabel`.
- A focusable `role="separator"` is a **window splitter**, so both separators report their position:
  `aria-valuenow` (the sized width in px, `0` while collapsed), `aria-valuemin="0"` and
  `aria-valuemax` (the resolved `maxWidthToken`). `aria-valuemin` is `0` rather than the minimum
  width token because collapsed is a real position of this splitter — the rail never rests between
  1 px and the minimum, and reporting the token bound would put the collapsed position outside the
  range the control announces. Without these, `axe` reports `aria-required-attr` and a screen reader
  announces a separator carrying no information at all.
- A **collapsed rail carries `inert` and `aria-hidden`** — the content is still mounted so its width
  can animate, and it must not be reachable while it is out of the layout. That is why the control
  that brings it back is a sibling of the rail rather than inside it.
- The **hidden checkbox that mirrors the collapsed state (`!open`)** (`__collapse-input`) carries `aria-hidden="true"`
  and `tabindex="-1"`: it is a CSS state carrier, not a second control, so it is never reachable by
  keyboard or announced by a screen reader. The trigger's accessible name and role are unaffected —
  the consumer-facing control is still the `IconButton`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states; the width /
  transform / opacity transition is dropped entirely under `prefers-reduced-motion`.
- Touch target ≥40×40 px where the control is interactive. The drag handle is a **justified
  deviation**: it is a `var(--spacing-xs)`-wide edge strip, which is the target a pointer resize
  wants, and it is not the only route — the trigger, the keyboard nudge, and double-click all reach
  the same state, so no capability depends on hitting it.

## Right-to-left

- The sidebar sits on the inline start; logical utilities (`border-e`, `start-0`, `ps-`/`pe-`) mirror
  it under `dir="rtl"`.
- The drag and the arrow keys mirror (`logicalArrowKey`); the expand affordance slides in from the
  right, and every tooltip (the expand button, the icon-rail rows) opens on the left.
- The collapse / expand glyphs (`ai-chevrons-left` / `-right`) keep their meaning through the
  direction-aware placement of the trigger.

## Internationalization

- All strings come from the locale catalog (`sidebar.label`, `sidebar.collapse`, `sidebar.expand`,
  `sidebar.resize`, `sidebar.expandByDragging`) and each has an `*AriaLabel` prop override. The icon
  rail adds no string: its tooltips show the consumer's own row labels.
- Labels truncate with an ellipsis at full width; in the rail the label lives in the tooltip, which
  wraps at `--container-3xs`.

## Responsive

- The sidebar is a column of an app shell; below `md` the shell hides it or turns it into a drawer
  (`app-layout` / `console-layout` own that, not the sidebar). Call `measure()` when it is revealed
  after mount.
- The icon rail is a fixed `var(--size-14)` column at every width; resizing is suspended while it is
  collapsed and the drag from the rail grows it back past the minimum.

## Examples

### Default

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import Command from '@aziontech/webkit/command-root'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import SidebarHeader from '@aziontech/webkit/sidebar-header'
  import SidebarMenuBack from '@aziontech/webkit/sidebar-menu-back'
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenu from '@aziontech/webkit/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/webkit/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/webkit/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/webkit/sidebar-menu-sub-trigger'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import { ref } from 'vue'

  const accountMenuOpen = ref(false)
  const paletteOpen = ref(false)
</script>

<template>
  <div class="h-screen w-[280px]">
    <Sidebar aria-label="Console">
      <template #header>
        <SidebarHeader>
          <SearchTrigger
            class="w-full"
            @open="paletteOpen = true"
          />

          <Command v-model:open="paletteOpen">
            <CommandInput placeholder="Search navigation and commands" />
            <CommandList>
              <CommandGroup label="Build">
                <CommandItem value="nav:applications">
                  <template #leading
                    ><i
                      class="ai ai-edge-application"
                      aria-hidden="true"
                  /></template>
                  Applications
                </CommandItem>
                <CommandItem value="nav:variables">
                  <template #leading
                    ><i
                      class="ai ai-variables"
                      aria-hidden="true"
                  /></template>
                  Variables
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup label="Account">
                <CommandItem value="cmd:settings">
                  <template #leading
                    ><i
                      class="ai ai-settings"
                      aria-hidden="true"
                  /></template>
                  Account Settings
                </CommandItem>
              </CommandGroup>

              <CommandEmpty>No navigation or command matches your search.</CommandEmpty>
            </CommandList>
          </Command>
        </SidebarHeader>
      </template>
      <SidebarMenu role="presentation">
        <SidebarMenuBack />
        <SidebarMenuGroup>
          <SidebarMenuItem
            label="Home"
            icon="ai ai-home"
            href="/"
            active
          />
          <SidebarMenuItem
            label="Marketplace"
            icon="ai ai-marketplace"
            href="/marketplace"
          />
        </SidebarMenuGroup>
        <SidebarMenuGroup label="Build">
          <SidebarMenuItem
            label="Applications"
            icon="ai ai-edge-application"
            href="/applications"
          />
          <SidebarMenuSub default-open>
            <SidebarMenuSubTrigger
              label="Edge Functions"
              type="inline"
            />
            <SidebarMenuSubContent>
              <SidebarMenuItem
                label="Runtime APIs"
                href="/functions/runtime-apis"
              />
              <SidebarMenuItem
                label="Bundlers"
                href="/functions/bundlers"
              />
            </SidebarMenuSubContent>
          </SidebarMenuSub>
          <SidebarMenuItem
            label="Variables"
            icon="ai ai-variables"
            href="/variables"
          />
        </SidebarMenuGroup>
        <SidebarMenuGroup label="Store">
          <SidebarMenuItem
            label="Object Storage"
            icon="ai ai-edge-storage"
            href="/object-storage"
          />
          <SidebarMenuItem
            label="SQL Database"
            icon="ai ai-edge-sql"
            href="/sql-database"
            tag-value="Preview"
            tag-variant="primary"
          />
        </SidebarMenuGroup>
        <SidebarMenuGroup label="Account">
          <SidebarMenuSub>
            <SidebarMenuSubTrigger
              label="Settings"
              icon="ai ai-settings"
              type="drill"
            />
            <SidebarMenuSubContent>
              <SidebarMenuGroup label="Organization">
                <SidebarMenuItem
                  label="General"
                  href="/settings/general"
                />
                <SidebarMenuItem
                  label="Members"
                  href="/settings/members"
                />
                <SidebarMenuItem
                  label="Billing"
                  href="/settings/billing"
                />
              </SidebarMenuGroup>
            </SidebarMenuSubContent>
          </SidebarMenuSub>
        </SidebarMenuGroup>
      </SidebarMenu>
      <template #footer>
        <SidebarFooter>
          <div class="flex items-center gap-(--spacing-xs)">
            <Avatar
              variant="square"
              size="small"
              label="AM"
              alt="Alex Morgan"
            />
            <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
              >Alex Morgan</span
            >
            <DropdownMenu
              v-model:open="accountMenuOpen"
              placement="top-end"
            >
              <DropdownMenuTrigger>
                <IconButton
                  icon="ai ai-ellipsis-vertical"
                  aria-label="Account menu"
                  variant="outline"
                  size="small"
                />
              </DropdownMenuTrigger>
              <DropdownMenuGroup>
                <template #header>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">Alex Morgan</span>
                    <span class="truncate text-body-xs text-(--text-muted)"
                      >rafael.umman@example.com</span
                    >
                  </div>
                </template>
                <DropdownMenuItem
                  value="settings"
                  label="Account Settings"
                />
                <DropdownMenuItem
                  value="personal-tokens"
                  label="Personal Tokens"
                />
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  value="logout"
                  label="Log Out"
                >
                  <template #trailing
                    ><i
                      class="ai ai-log-out"
                      aria-hidden="true"
                  /></template>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </template>
    </Sidebar>
  </div>
</template>
```

### IconRail

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import SidebarMenuBack from '@aziontech/webkit/sidebar-menu-back'
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenu from '@aziontech/webkit/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/webkit/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/webkit/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/webkit/sidebar-menu-sub-trigger'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <div class="relative flex h-screen min-h-0">
    <div class="flex min-h-0 shrink-0 max-md:hidden">
      <Sidebar
        v-model:open="open"
        collapsible="icon"
        shortcut
        aria-label="Console"
      >
        <SidebarMenu role="presentation">
          <SidebarMenuBack />
          <SidebarMenuGroup>
            <SidebarMenuItem
              label="Home"
              icon="ai ai-home"
              href="/"
              active
            />
            <SidebarMenuItem
              label="Marketplace"
              icon="ai ai-marketplace"
              href="/marketplace"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Build">
            <SidebarMenuItem
              label="Applications"
              icon="ai ai-edge-application"
              href="/applications"
            />
            <SidebarMenuItem
              label="Variables"
              icon="ai ai-variables"
              href="/variables"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Store">
            <SidebarMenuItem
              label="Object Storage"
              icon="ai ai-edge-storage"
              href="/object-storage"
            />
            <SidebarMenuItem
              label="SQL Database"
              icon="ai ai-edge-sql"
              href="/sql-database"
              tag-value="Preview"
              tag-variant="primary"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Account">
            <SidebarMenuSub>
              <SidebarMenuSubTrigger
                label="Settings"
                icon="ai ai-settings"
                type="drill"
              />
              <SidebarMenuSubContent>
                <SidebarMenuGroup label="Organization">
                  <SidebarMenuItem
                    label="General"
                    href="/settings/general"
                  />
                  <SidebarMenuItem
                    label="Members"
                    href="/settings/members"
                  />
                </SidebarMenuGroup>
              </SidebarMenuSubContent>
            </SidebarMenuSub>
          </SidebarMenuGroup>
        </SidebarMenu>
        <template #footer="{ rail }">
          <SidebarFooter>
            <div class="flex items-center gap-(--spacing-xs)">
              <Avatar
                variant="square"
                size="small"
                label="JD"
                alt="Jane Doe"
              />
              <span
                v-if="!rail"
                class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                >Jane Doe</span
              >
            </div>
          </SidebarFooter>
        </template>
      </Sidebar>
    </div>

    <main class="min-w-0 flex-1 p-(--spacing-lg)">
      <p class="text-body-sm text-(--text-muted)">
        Press Ctrl+B (Cmd+B on macOS) to switch between the icon rail and the full sidebar.
      </p>
    </main>
  </div>
</template>
```
