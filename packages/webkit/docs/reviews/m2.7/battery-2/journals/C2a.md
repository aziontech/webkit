# C2a — builder journal and DONE (verbatim)

`JOURNAL.md` and `DONE.md` from job C2a, copied without edits.

---

# Journal — C2a

## 14:48 start

## 14:53 setup (Vite 8 + Vue 3.5 + TS 6 template, webkit 5.12.0 / theme 5.2.2 / icons 4.4.0)

- **medium — `npx @aziontech/webkit init` adds deps as `@latest`** (eslint, stylelint, husky…) and plans `add-dep @aziontech/webkit@latest` even when the three are already installed as `file:` tarballs. It did *not* overwrite my file: entries in the end, but the dry-run plan says it will, which is alarming. ~3 min checking.
- **medium — theme version mismatch.** webkit 5.12.0 depends on `@aziontech/theme ^4.0.0`, so npm installs a nested theme 4.3.1 under webkit while the job ships theme 5.2.2 at the top level. `src/webkit.css` imports `@aziontech/theme` (the 5.2.2 one). Nothing visibly broke, but two theme versions in one app is not what the README "install the three packages" implies. `npx @aziontech/webkit doctor` is the place this should be flagged.
- **high — `vue-tsc -b` (the Vite template's `npm run build`) fails because of WebKit.** (1) `node_modules/@aziontech/webkit/src/components/feedback/toast/index.ts(48,7)` TS2352 — webkit ships .ts source, so its own type error lands in my build (skipLibCheck does not help). (2) From any `<script setup lang="ts">` SFC, *every* `.vue` export (`@aziontech/webkit/button`, `/card`, `/webkit-provider`) fails with TS2307 "Cannot find module" under TS 6 + vue-tsc 3 even with the README's `vueCompilerOptions.htmlAttributes: []`. README claims "`vue-tsc --noEmit` checks it under strict". Decision: all SFCs use plain `<script setup>` (the blocks are JS anyway), `allowJs`, and `build` = `vite build`; type-check kept as `npm run typecheck` (fails, for the reason above). ~10 min.
- **works well:** `npx @aziontech/webkit search` / `view` / `add` are excellent. `search "file browser"`, `"settings form"`, `"console shell"` each returned the right block first. `add --dest` copies a working SFC + variant.
- **low — `add` prints a route for a `/console` path** that is irrelevant when the block is a shell (it's meant to wrap pages, not be a page). The shell block has no slot: ListPage/DetailPage hard-code a stand-in body, so making it reusable meant copying the 860-line SFC into my own `ConsoleShell.vue` and adding a `<slot/>`. A `ConsoleShell` component (or a block with a slot) is missing. ~10 min.

## 14:53 console-edge-dns-zone

- Pieces: `shells/console` (adapted), `PageTabs`+`Tabs.Item`, `SettingsSection`, `Card :padded=false`, `Item.List`, `SettingRow` (field/compact), `Input`, `InputGroupRoot`+`InputGroupInput readonly`+`CopyButton` for the copyable values, `Switch`, `HelperText`, `SaveBar` (only when dirty).
- **medium — no "read-only value with copy" field.** `Input` has only icon slots; `Input` has no `copyable`. Found the pattern only by guessing `input-group` in catalog.json; no block shows Input + CopyButton together (edit-resource uses CopyButton only inline in text). Rendered result matches the reference. ~8 min.
- **low — `SettingRow` vertically centres the copy against a tall control.** Reference top-aligns "Nameservers" with the first input; SettingRow centres it. No prop (`kind` is field/compact/stacked). Left as is.
- **medium — `SettingRow` stacks below a container width on iPhone** (control drops under the text, full width). Reference keeps two columns with the help text ellipsised. No prop to keep the row horizontal. Left as WebKit does it.
- **low — I first added `gap-(--layout-section-gap)` between `SettingsSection`s** (as rule `webkit-page-layout` says to) and got double spacing: SettingsSection already carries its own top spacing. The rule and the component disagree; the profile block has no gap. ~3 min.
- **low — Menu icons.** Nav icons are guesses from the icons font list (`ai-edge-dns`, `ai-edge-sql`, `ai-edge-storage`…); the shell block uses unrelated `pi` icons. A product → icon map is missing. They render close to the reference.

## 14:53 pre-commit hook from `init`

- **high — the husky pre-commit hook that `init` writes (`npx eslint .` + `npx stylelint "**/*.{css,scss,vue}"`) lints `dist/`.** The generated `eslint.config.mjs` has no `ignores` and no `.stylelintignore` is written, so the first commit after any `npm run build` fails with 500+ errors from WebKit's *own compiled CSS/JS* (hex colours, literal ms, `0px`). Fixed by adding `{ ignores: ['dist/**'] }` and a `.stylelintignore`. ~5 min.
- **medium — a block copied verbatim by `npx @aziontech/webkit add platform/view/file-browser` fails WebKit's own lint**: `src/blocks/FileBrowser.vue:326 vuejs-accessibility/label-has-for` (the Columns popover `<label>` wrapping a `Switch`). Also the blocks use runtime JS `<script setup>` which the `webkit/authoring-standards` rule forbids for *my* components (`defineProps({...})` → error) — so a page started from a block, given props, immediately fails lint. I keep the pristine block copies under `src/blocks/` (ignored by lint) as references.
- **low — the Vite template's `vite.config.ts` comment (`// https://vite.dev/config/`) fails `webkit/authoring-standards` ("prose-comment")**. Overreaching for a config file.

## 14:54 console-sql-database

- Pieces: `platform/view/query-editor` variant **EmptyDatabase** (Tables tab body copied: inner `Sidebar` as the tables panel, `Input` with `#iconLeft`, `IconButton`s in `Tooltip`s, `Card` + dashed frame + `EmptyState` with the stacked icon tile, secondary `Button`), `PageTabs`.
- **works well:** the EmptyDatabase variant *is* this screen. Found with `search "split view"` → `view platform/view/query-editor` (variants list). ~10 min total including shoot.
- **low — the variant is a 1988-line SFC** bundling the whole shell, palette, editor, drawers; extracting only the Tables tab body by hand is the real work. A per-tab partial (or the shell as a slot component) would make blocks reusable.
- **low — tables panel width:** block text says "288px at rest", but it sets `--sidebar-width: var(--container-2xs)`, which renders 300px (reference: 288px). Kept the token.
- **low — iPhone header `SearchTrigger collapsible`** renders a 40px magnifier box while the other header icon buttons are 32px (reference: all 32px). No size prop on SearchTrigger. Same on every page.
- Editor tab: not in the reference; rendered a plain `EmptyState` stand-in rather than `CodeEditor` (needs the optional `monaco-editor` peer).

## 14:55 console-bucket-browser

- Pieces: `platform/view/file-browser` (Default) nearly verbatim: `Card :padded=false`, `TableRoot` data-driven with `#toolbar`, `TableSearch`, `IconButton`+`Tooltip`, Columns `PopoverRoot`+`Switch`, `Breadcrumb :items`, `SplitButton`, `Table.CellTime`, `Table.CellActions`, `ConfirmDialog`, `EmptyState`. Only data/copy changed. ~10 min. **This block is excellent** — desktop matched the reference on the first shot.
- **medium — the copied block fails WebKit's own lint** (Columns popover `<label>` → `vuejs-accessibility/label-has-for`). Changed the row to a `<div>` and gave the `Switch` an `aria-label`.
- **medium — iPhone: `TableRoot` stacks rows into cards by default below --container-lg**; reference keeps the scrolling grid. The block doesn't say so; found `stackable` (default true) in `llms/components/table.md`. Set `:stackable="false"` → matches. ~4 min.
- **low — avatar photo.** Reference shows Robson Junior's photo in Last Modified; `Table.CellTime` takes `avatar-src` but I have no local image (no network), so it shows initials "RO" (Avatar keeps the first two letters of a name — guidelines say "pass initials", but CellTime passes the full author name).
- **low — the block's own `:class` ternaries** (`row.kind !== 'file' ? 'cursor-pointer hover:underline' : ''`) contradict rule `webkit-component-states`/`webkit-styling` ("never a :class ternary"). Lint doesn't flag it; left as the block has it.

## 14:56 console-account-settings

- Pieces: `platform/account/profile` block (which is literally this page: same 7 sections, same help copy), `PageHeader size=small`, `SettingsSection`, `Card`, `Item.List`, `SettingRow` (field / stacked / compact), `Input`, `Textarea`, `Select`, `Switch`, `Item` with `Item.Media` + `Tag severity=success`, `Button kind=danger`, `SaveBar` (only when dirty), `Toaster`. Shell: `Menu` with the Settings `kind: 'drill'` level opened through `v-model:path=['settings']` + `Menu.Back` — gives exactly the reference's "‹ Back / Settings / Access / Billing" sidebar. ~12 min.
- **works well:** `search "settings form"` returned `platform/account/profile` third; its output needed only copy changes (Account Name, State/Region, "Apartment, floor, etc.", Remove personal account…). Desktop matched the reference on the first shot.
- **medium — contradictory "When not to use" routing:** `settings-form` says "resource settings tab → use edit-resource" and "account settings → profile"; `profile` says "a resource's settings tab → use settings-form"; `edit-resource` says "account settings → settings-form". Three blocks point at each other in a circle. Cost ~5 min to pick (I went by content: profile for the account, edit-resource-style composition for the DNS zone).
- **low — `SettingsSection anchor`** shows a permanent copy-link glyph on touch widths (hover-only on desktop). The block guideline says every section carries an `anchor`; the reference has none. Dropped `anchor` for fidelity.
- **low — `Input readonly`** draws a dashed border (Client ID). Reference shows a normal border. Kept WebKit's readonly look since the description says "read-only input".
- **low — title-only `SettingRow`s** (Postal Code, Country…) centre the title vertically; reference top-aligns it. No prop.
- **medium — iPhone: `SettingRow` stacks** (same as DNS page): reference keeps 2 columns with ellipsised help text. Page is ~400px taller on iPhone than the reference because of this.
- **low — Settings drill via `Menu`:** the Settings rows have no route except General, so they do nothing. "Back" pops to the main menu, as expected.

## 14:58 wrap-up

- `npx @aziontech/webkit check`: 0 errors, 1 warning — **low/funny: `doctor` warns that 8 dev deps are pinned as "latest"**, which is exactly what `init` wrote. It does *not* flag the nested theme 4.3.1 vs top-level 5.2.2 mismatch.
- **low — `Link` draws an external-link glyph for internal routes** (`href="/console-…"`) on the `/` index page. No prop found to mark it internal in a quick read; left as is.
- `npm run build` (= `vite build`) passes; `dist/` served by `vite preview` returns index.html for `/`, each page and an unknown deep path; pages render with no console errors.
- Final shots of all 4 pages in `shots/` + `shots/tiles/`. Dev server stopped. (Port 5128 was already taken by someone else's server; I did not touch it.)


---

# DONE — job C2a (console)

## Pages
- `console-edge-dns-zone`: **built** — tabs, 4 setting groups, read-only values with copy buttons, switches, save bar on edit. Gaps: rows centre the label against tall controls (reference top-aligns); on iPhone rows stack instead of staying two-column; "Records" tab is a stand-in.
- `console-sql-database`: **built** — tabs, tables panel (collapsible inner Sidebar, search, refresh/+), dashed empty-state card with black "Create Table". Gaps: panel 300px vs 288px; Editor tab is a stand-in (no CodeEditor, monaco not installed).
- `console-bucket-browser`: **built** — file-browser block: title, search, Refresh/Download/Columns, path breadcrumb, orange "Add to files" split button, 3 rows with folder/file icons, CellTime, row menus, delete confirm. Gap: author photo shows initials "RO" (no image available offline).
- `console-account-settings`: **built** — settings drill sidebar (‹ Back, Settings/Access/Billing), all 7 groups with verbatim copy, switches, selects, textarea, Source control items with Active tag, danger button; save bar on edit. Gaps: Client ID read-only input is dashed (WebKit readonly look); title-only rows centre the title; on iPhone rows stack (page ~400px taller than reference).
- `/` lists links to all four pages; shared console shell (sidebar, breadcrumb header, Search ⌘K palette, Create, Agent, avatar, compact drawer on iPhone).

## WebKit pieces used most
`shells/console` (adapted into `src/layouts/ConsoleShell.vue`: `AppLayout`, `Sidebar`, `Menu` incl. drill + `Menu.Back`, `GlobalHeader`, `Breadcrumb`, `SearchTrigger`, `Command`, `Button`, `ButtonHighlight`, `IconButton`, `Tooltip`, `Avatar`, `DropdownMenu`), `platform/account/profile`, `platform/view/file-browser`, `platform/view/query-editor` (EmptyDatabase), `PageTabs`+`Tabs.Item`, `SettingsSection`, `SettingRow`, `Card`, `Item`, `Input`, `InputGroupRoot`/`InputGroupInput`, `CopyButton`, `Switch`, `Select`, `Textarea`, `Tag`, `EmptyState`, `TableRoot`/`TableSearch`/`Table.CellTime`/`Table.CellActions`, `SplitButton`, `SaveBar`, `PageHeader`. Tokens only, no hex.

## Top 5 problems with WebKit (by impact)
1. **TypeScript build breaks** (high): the Vite template's `vue-tsc -b && vite build` fails — webkit's shipped `.ts` source has its own error (`toast/index.ts` TS2352), and from `<script setup lang="ts">` no `.vue` export (`@aziontech/webkit/button`, …) resolves (TS2307), despite the README's TS claim. Had to switch `build` to `vite build` and write JS SFCs (`npm run typecheck` kept, fails for these reasons).
2. **`init`'s pre-commit hook + lint config lint `dist/`** (high): first commit after a build fails with 500+ errors from WebKit's own compiled CSS/JS; no `ignores`/`.stylelintignore` is generated. Also blocks copied by `add` fail the same lint (`label-has-for` in file-browser; runtime `defineProps` is forbidden for your own components but used by every block).
3. **Shell is not reusable** (medium): `shells/console` has no slot — every variant hard-codes a stand-in body; blocks like query-editor are ~2000-line SFCs bundling the whole shell. Building 4 pages meant hand-extracting the shell and each page body.
4. **`SettingRow` layout is not controllable** (medium): it stacks on narrow containers (reference keeps 2 columns with ellipsis) and vertically centres copy against tall controls (reference top-aligns). No prop for either; affects 2 of 4 pages on iPhone.
5. **Discoverability gaps / contradictions** (medium): no read-only-value-with-copy field (had to discover `input-group` + `CopyButton` from catalog.json); `TableRoot` silently stacks rows into cards on phones (`stackable` only in the component doc); the "When not to use" sections of settings-form / profile / edit-resource point at each other in a circle; webkit 5.12.0 pulls a nested theme 4.3.1 next to the shipped theme 5.2.2 and `doctor` doesn't flag it.

## Build
`npm run build` passes (`vite build`, output in `app/dist/`), and `dist/` works as a static SPA: `/`, every page, and unknown deep paths fall back to `index.html`. `npx @aziontech/webkit check`: 0 errors. `npm run typecheck` (vue-tsc) fails because of WebKit (see problem 1).
