# Sidebar

> Helps users move between views or sections. Composable application sidebar with optional header and footer regions; navigation content scrolls inside a built-in `ScrollArea`. It also owns **the rail gesture** — sizing the sidebar by dragging its trailing edge, and collapsing it out of the layout entirely. That belongs here rather than in each shell: the interaction is not a small one (a pointer drag that crosses the collapse boundary continuously, a keyboard equivalent, token-derived bounds, a phase-aware transition, and an affordance that brings a collapsed rail back), and every app that has a sidebar wants the same one. Two shells re-implementing it is how the two drift apart. Both halves are **opt-in and independent**: `resizable` adds the drag, `collapsible` adds the collapse trigger and the edge affordance. With neither set the component renders exactly as it always has, with the host owning the width — every existing consumer is unaffected.

- Import: `import Sidebar from '@aziontech/webkit/sidebar'`
- Category: layout · Surface: product · Structure: composition
- API as JSON: [sidebar.json](https://github.com/aziontech/webkit/blob/main/.specs/sidebar.json)

## When to use

- The persistent navigation column of an app shell, with an optional header (brand, workspace switcher) and footer (profile, settings) around a scrolling `Menu`.
- The user should be able to resize the rail by dragging its trailing edge (`resizable`) or take it out of the layout and bring it back (`collapsible`).
- The rail's size or collapsed state must survive navigation or reloads — bind `v-model:width` and `v-model:collapsed` and persist them in the app.

## Do

- Put a `Menu` with `role="presentation"` in the default slot; the sidebar already renders the `nav` landmark and its `aria-label` (default `'Sidebar'`) names the region.
- Use `Menu.Group` for new navigation — `SidebarGroup` still works but is superseded.
- Without `resizable` or `collapsible`, size the rail with a width class on the root; with either set, the sidebar owns the width and clamps it between `min-width-token` and `max-width-token`.
- When the sidebar is revealed after mount (for example leaving a mobile layout where it was hidden), call the exposed `measure()` so the rail does not keep a zero width.
- Keep the profile block in the `footer` slot; with `collapsible`, the collapse trigger renders in the same footer row.

## Don’t

- Adjacent work areas the reader resizes (editor beside a preview, a terminal under it) → use `resizable`.
- Horizontal top-level navigation with dropdown panels → use `navigation-menu`.
- A temporary panel that slides over the page → use `drawer`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [menu](menu.md) — the navigation rows, groups and drill levels that go in the sidebar's default slot.
- [resizable](resizable.md) — draggable splits between content regions; the sidebar's rail gesture is for navigation only.
- [global-header](global-header.md) — the top bar that usually sits above the sidebar in an app shell.
- platform-shell` — the console layout template that composes the header, the sidebar and the page.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the navigation landmark. Empty uses the locale catalog (`Sidebar`). |
| `resizable` | `boolean` | `false` | false | Adds the drag handle on the trailing edge; dragging past the minimum collapses the rail. |
| `collapsible` | `boolean` | `false` | false | Adds the collapse trigger at the bottom of the rail and the edge affordance that brings a collapsed rail back. |
| `minWidthToken` | `string` | `'--container-3xs'` | false | Theme container token the sized width is clamped up to, read off the document at runtime. |
| `maxWidthToken` | `string` | `'--container-sm'` | false | Theme container token the sized width is clamped down to, read off the document at runtime. |
| `collapseAriaLabel` | `string` | `''` | false | Accessible name for the collapse trigger. Empty uses the locale catalog (`Collapse sidebar`). |
| `expandAriaLabel` | `string` | `''` | false | Accessible name for the control and the grab bar that bring a collapsed rail back. Empty uses the locale catalog (`Expand sidebar`). |
| `resizeAriaLabel` | `string` | `''` | false | Accessible name for the drag handle separator. Empty uses the locale catalog (`Resize sidebar`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:collapsed` | `boolean` | v-model:collapsed` — the rail entered or left the layout, by the trigger, the drag crossing the snap boundary, the keyboard nudge, or a double-click on the handle. |
| `update:width` | `number` | v-model:width` — the sized width in px, already clamped to the token bounds. Emitted continuously during a drag. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |
| `header` | — | Named slot. |
| `footer` | — | Named slot. The collapse trigger renders after this content in the same row, under one full-width separator, so a profile block and the trigger read as one footer. |

## Sub-component imports

- `@aziontech/webkit/sidebar-group`
- `@aziontech/webkit/sidebar-header`
- `@aziontech/webkit/sidebar-footer`

## Sub-components

- `sidebar-footer.vue` — Public sub-component `sidebar-footer`.
- `sidebar-group.vue` — Public sub-component `sidebar-group`. One flat block of rows under an
  optional title, **superseded by `Menu.Group`**: the docs, the stories and every example here
  compose `Menu`, which does everything this does and also nests, collapses and drills. It keeps
  working untouched for existing consumers and is **not** deprecated (no `@deprecated` tag, because
  `webkit/no-deprecated-component` is `error` in the recommended config and would turn a consumer's
  lint green→red on a minor). Reach for `Menu` in anything new.
- `sidebar-header.vue` — Public sub-component `sidebar-header`.

`Sidebar` does not import `Menu` and `Menu` does not import `Sidebar`; the only thing that passes
between them is the ring-offset surface below.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-collapsed` on the root while the rail is out of the layout
- `data-resizing` on the root and on the handle while a pointer drag is in flight
- `data-preview` on the collapsed edge zone while it is showing the rail's preview sliver
- `data-collapsed` / `data-resizing` / `data-preview` are **reported state, not the motion
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
  `__collapse-input` (the hidden checkbox that carries `collapsed` for CSS — not an interactive
  control; see Accessibility), `__header`, `__nav`, `__scroll`, `__footer`, `__collapse` (the
  trigger), `__handle` (the drag separator), `__expand` / `__expand-button` (the collapsed
  affordance)
- A collapsed rail carries `inert` + `aria-hidden`, so it holds no tab stops while it is out

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
  The **scroll viewport is not a tab stop** (`tabindex="-1"` on the built-in `ScrollArea`): a scroll
  region needs one only when nothing inside it is focusable, and this one holds a `Menu` of rows —
  so `Tab` reaches the first row directly instead of the box around it.
  The region also keeps `var(--spacing-xxs)` of padding — and the same as `scroll-padding` — inside
  the clip, because the first row's focus ring (`ring-2` over `ring-offset-2`) reaches 4 px past the
  row and a viewport flush against it would cut the ring off.
  The **drag handle is a focusable `role="separator"`**, so the gesture has a keyboard equivalent:
  `ArrowLeft` / `ArrowRight` nudge the width, `ArrowLeft` past the snap boundary collapses, and
  `ArrowRight` from the collapsed splitter brings the rail back. Pointer-wise that same collapsed
  splitter is click-to-restore as well as drag-to-size, so the edge is never a drag-only control.
  Right-to-left: the rail sits on the inline start, so in an `rtl` subtree the keys and the drag
  mirror (`ArrowLeft` and a leftward drag widen it, `ArrowRight` narrows it), the expand affordance
  slides in from the right, and its tooltip opens on the left.
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
- The **hidden checkbox that mirrors `collapsed`** (`__collapse-input`) carries `aria-hidden="true"`
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

## Examples

### Default

```vue
<script setup>
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarHeader from '@aziontech/webkit/sidebar-header'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'
  import Avatar from '@aziontech/webkit/avatar'
  import IconButton from '@aziontech/webkit/icon-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import Command from '@aziontech/webkit/command'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import Menu from '@aziontech/webkit/menu'
  import MenuBack from '@aziontech/webkit/menu-back'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
  import { ref } from 'vue'

  const accountMenuOpen = ref(false)
  const paletteOpen = ref(false)
</script>

<template>
  <Sidebar
    aria-label="Console"
    class="h-screen w-[280px]"
  >
    <template #header>
      <SidebarHeader>
        <div
          class="cursor-pointer [&_input]:cursor-pointer"
          @click="paletteOpen = true"
          @keydown.enter="paletteOpen = true"
        >
          <Input
            model-value=""
            placeholder="Search"
            size="large"
            readonly
            aria-label="Search navigation and commands"
            aria-keyshortcuts="Meta+K"
          >
            <template #iconLeft
              ><i
                class="pi pi-search"
                aria-hidden="true"
            /></template>
            <template #iconRight
              ><Kbd
                meta
                size="small"
                >K</Kbd
              ></template
            >
          </Input>
        </div>

        <Command v-model:open="paletteOpen">
          <CommandInput placeholder="Search navigation and commands" />
          <CommandList>
            <CommandGroup heading="Build">
              <CommandItem value="nav:applications">
                <template #prefix
                  ><i
                    class="ai ai-edge-application"
                    aria-hidden="true"
                /></template>
                Applications
              </CommandItem>
              <CommandItem value="nav:variables">
                <template #prefix
                  ><i
                    class="ai ai-variables"
                    aria-hidden="true"
                /></template>
                Variables
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Account">
              <CommandItem value="cmd:settings">
                <template #prefix
                  ><i
                    class="pi pi-cog"
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
    <Menu role="presentation">
      <MenuBack />
      <MenuGroup>
        <MenuItem
          label="Home"
          icon="ai ai-home"
          href="/"
          selected
        />
        <MenuItem
          label="Marketplace"
          icon="ai ai-marketplace"
          href="/marketplace"
        />
      </MenuGroup>
      <MenuGroup label="Build">
        <MenuItem
          label="Applications"
          icon="ai ai-edge-application"
          href="/applications"
        />
        <MenuSub default-open>
          <MenuSubTrigger
            label="Edge Functions"
            kind="inline"
          />
          <MenuSubContent>
            <MenuItem
              label="Runtime APIs"
              href="/functions/runtime-apis"
            />
            <MenuItem
              label="Bundlers"
              href="/functions/bundlers"
            />
          </MenuSubContent>
        </MenuSub>
        <MenuItem
          label="Variables"
          icon="ai ai-variables"
          href="/variables"
        />
      </MenuGroup>
      <MenuGroup label="Store">
        <MenuItem
          label="Object Storage"
          icon="ai ai-edge-storage"
          href="/object-storage"
        />
        <MenuItem
          label="SQL Database"
          icon="ai ai-edge-sql"
          href="/sql-database"
          tag-value="Preview"
          tag-severity="primary"
        />
      </MenuGroup>
      <MenuGroup label="Account">
        <MenuSub>
          <MenuSubTrigger
            label="Settings"
            icon="pi pi-cog"
            kind="drill"
          />
          <MenuSubContent>
            <MenuGroup label="Organization">
              <MenuItem
                label="General"
                href="/settings/general"
              />
              <MenuItem
                label="Members"
                href="/settings/members"
              />
              <MenuItem
                label="Billing"
                href="/settings/billing"
              />
            </MenuGroup>
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
    </Menu>
    <template #footer>
      <SidebarFooter class="flex items-center gap-(--spacing-xs)">
        <Avatar
          kind="square"
          size="small"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
          alt="Alex Moreira"
        />
        <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
          >Alex Moreira</span
        >
        <DropdownMenu
          v-model:open="accountMenuOpen"
          placement="top-end"
        >
          <DropdownMenuTrigger>
            <IconButton
              icon="pi pi-ellipsis-v"
              aria-label="Account menu"
              kind="outlined"
              size="small"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <template #top>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-label-md text-(--text-default)">Alex Moreira</span>
                <span class="truncate text-body-xs text-(--text-muted)"
                  >rafael.umman@example.com</span
                >
              </div>
            </template>
            <DropdownMenuOption
              value="settings"
              label="Account Settings"
            />
            <DropdownMenuOption
              value="personal-tokens"
              label="Personal Tokens"
            />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuOption
              value="logout"
              label="Log Out"
            >
              <template #right
                ><i
                  class="pi pi-sign-out"
                  aria-hidden="true"
              /></template>
            </DropdownMenuOption>
          </DropdownMenuGroup>
        </DropdownMenu>
      </SidebarFooter>
    </template>
  </Sidebar>
</template>
```
