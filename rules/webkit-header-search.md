# Rule: every app header has a SearchTrigger

Every header that navigates — the console and demo top bar, the docs header, the site header —
offers search the same way: one `SearchTrigger` (`@aziontech/webkit/search-trigger`) first in
`GlobalHeader.Right`, opening a `Command` palette, with `⌘K` on macOS and `Ctrl K` elsewhere.
A header without it is incomplete, even when nobody asked for search.

## Do

- Put the trigger first in `GlobalHeader.Right` and wire it to the palette:

  ```vue
  <script setup>
    import Command from '@aziontech/webkit/command'
    import GlobalHeader from '@aziontech/webkit/global-header'
    import SearchTrigger from '@aziontech/webkit/search-trigger'
    import { ref } from 'vue'

    const searchOpen = ref(false)
  </script>

  <template>
    <div class="@container w-full">
      <GlobalHeader aria-label="Console">
        <GlobalHeader.Left><!-- brand, breadcrumb --></GlobalHeader.Left>
        <GlobalHeader.Right>
          <SearchTrigger
            collapsible
            @open="searchOpen = true"
          />
          <!-- the header's other actions -->
        </GlobalHeader.Right>
      </GlobalHeader>
      <Command v-model:open="searchOpen"><!-- Command.Input, Command.List … --></Command>
    </div>
  </template>
  ```

- Wrap the header in an `@container` and set `collapsible`: the trigger is the field
  (`Search … ⌘K`) on a wide bar and folds to the magnifier on a narrow one. The site header keeps
  the folded form (no `@container` around it), as azion.com does.
- Name the scope in `label` when it is narrow (`label="Search docs"`).
- Without a `Command` on the page, `@open` still fires on `⌘K` / `Ctrl K`, so a custom search
  dialog gets the shortcut for free.
- Start from a header or shell block (`headers/docs-header`, `headers/site-header`,
  `headers/resource-header`, `shells/console`, `shells/documentation`, `shells/website`): each
  already carries the trigger and the palette.

## Do not

- Do not hand-roll the field (`<button>` or a read-only `Input` with a magnifier and a `Kbd`), and
  do not put a bare magnifier `IconButton` in a header.
- Do not bind `⌘K` yourself with a `keydown` listener: `Command` (or the trigger) owns it.
- Do not add search to a focused task header (sign-in, a create flow: back, brand, breadcrumb,
  avatar). It has no navigation and stays on the task.

## Enforced

`webkit/header-search-trigger` (ESLint, in the recommended preset and in `webkit check`) flags a
`GlobalHeader` with navigation (`GlobalHeader.Nav`, `NavigationMenu`, or a `Sidebar` in the same
template) and no `SearchTrigger`, any `aria-keyshortcuts="Meta+K"` / `Control+K` outside
`SearchTrigger`, and a `pi-search` button inside a `GlobalHeader`.
