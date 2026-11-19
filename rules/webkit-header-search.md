# Rule: every app header has a SearchTrigger

Every header that navigates — the console and demo top bar, the docs header, the site header —
offers search the same way: one `SearchTrigger` (`@aziontech/webkit/search-trigger`) first in
`AppHeader.End`, opening a `Command` palette, with `⌘K` on macOS and `Ctrl K` elsewhere.
A header without it is incomplete, even when nobody asked for search.

`ConsoleLayout`, `SiteLayout` and `DocLayout` already render the trigger and the palette, wired to
`⌘K` / `Ctrl K` and listing their navigation: an app built on them has nothing to add (extra palette
groups go in their `search` slot; a page opens the console palette with
`useConsoleLayout().openSearch()`). The sample below is for a header you compose yourself.

## Do

- Put the trigger first in `AppHeader.End` and wire it to the palette:

  ```vue
  <script setup>
    import Command from '@aziontech/webkit/command'
    import AppHeader from '@aziontech/webkit/app-header'
    import SearchTrigger from '@aziontech/webkit/search-trigger'
    import { ref } from 'vue'

    const searchOpen = ref(false)
  </script>

  <template>
    <div class="@container w-full">
      <AppHeader aria-label="Console">
        <AppHeader.Start><!-- brand, breadcrumb --></AppHeader.Start>
        <AppHeader.End>
          <SearchTrigger
            collapsible
            @open="searchOpen = true"
          />
          <!-- the header's other actions -->
        </AppHeader.End>
      </AppHeader>
      <Command v-model:open="searchOpen">
        <Command.Input placeholder="Search…" />
        <Command.List>
          <Command.Group label="Pages">
            <Command.Item value="applications">Applications</Command.Item>
          </Command.Group>
          <Command.Empty>No results.</Command.Empty>
        </Command.List>
      </Command>
    </div>
  </template>
  ```

- Wrap the header in an `@container` and set `collapsible`: the trigger is the field
  (`Search … ⌘K`) on a wide bar and folds to the magnifier, with its label as a tooltip, while
  the bar is narrower than 47rem (752 px, `--container-2xl`). That is the one threshold for every
  header: do not add your own `@min-[…]` around it. The folded square is drawn at 32 px like the
  header's other icon buttons; its 44 px touch area is built in. On a touch screen the keycap
  hides by itself (there is no keyboard to press it), and it reads `Ctrl K` off Apple platforms.
  Keep the trigger in the bar at every width, never only inside a mobile menu sheet: on a phone it
  is the magnifier beside the menu button and the call to action.
- Name the scope in `label` when it is narrow (`label="Search docs"`).
- On the marketing site, `SiteHeaderSection` already carries the folded trigger: listen to its `search` event
  (`<SiteHeaderSection @search="searchOpen = true" />`) and mount the `Command` beside it.
- Without a `Command` on the page, `@open` still fires on `⌘K` / `Ctrl K`, so a custom search
  dialog gets the shortcut for free.
- Start from a shell block (`shell/shell-console`, `shell/shell-docs`, `shell/shell-site`): each
  layout already renders its header with the trigger and the palette.

## Don't

- Do not hand-roll the field (`<button>` or a read-only `Input` with a magnifier and a `Kbd`), and
  do not put a bare magnifier `IconButton` in a header.
- Do not bind `⌘K` yourself with a `keydown` listener: `Command` (or the trigger) owns it.
- Do not mount a second `SearchTrigger` or `Command` inside a page rendered by an app layout: the
  layout's palette is the one palette.
- Do not add search to a focused task header (sign-in, a create flow: back, brand, breadcrumb,
  avatar). It has no navigation and stays on the task.

## Enforced

`webkit/require-header-search` (ESLint, in the recommended preset and in `webkit check`) flags a
`AppHeader` with navigation (`AppHeader.Center`, `NavigationMenu`, or a `Sidebar` in the same
template) and no `SearchTrigger`, any `aria-keyshortcuts="Meta+K"` / `Control+K` outside
`SearchTrigger`, and a `az-search` button inside a `AppHeader`.
