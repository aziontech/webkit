# JOURNAL — building an Azion-console-like app with WebKit, AI only (eval-m27 / A)

Agent: Claude (Opus 5.5) acting as a product developer new to WebKit. Machine: 4 CPUs, shared.
Sources allowed: only what ships in `node_modules/@aziontech/webkit` + its CLI/MCP. Timestamps UTC.

## Log

### 05:26 — Read the brief and the reference set

- Read `ref/README.md`, `ref/pages.json` (8 console/demo pages), looked at the desktop-light screenshots of
  applications-list and workload-detail to get the visual target.

### 05:29 — Scaffold + install (≈4 min)

- `pnpm create vite app --template vue-ts`, then `pnpm add <3 tarballs> vue-router`.
- **Friction:** `@aziontech/webkit@5.12.0` declares `"@aziontech/theme": "^4.0.0"` as a _dependency_, but the
  set I was given is theme **5.2.2**. pnpm therefore pulled `@aziontech/theme@4.3.1` from npm next to 5.2.2 → two
  themes in `node_modules/.pnpm`. Either webkit should peer-depend on theme, or its range must include 5.x.
- **Friction (naming/versioning):** the package is `5.12.0` but ships `MIGRATION-v6.md`, blocks are named with the
  v6 `platform/<task>/…` scheme, and the README talks about `apps/docs`/`apps/demos` (repo-only, not shipped). A
  consumer has no docs site — the README's "Docs site / playground" sections are unusable from the package.
- README says `import '@aziontech/theme/globals.css'`; the `webkit-usage` skill says `import '@aziontech/theme'`.
  Two different entry imports for the same thing (minor).

### 05:33 — `npx @aziontech/webkit init` (≈3 min)

- `init --dry-run` then `init`: wrote eslint/stylelint/postcss configs, `.mcp.json`, husky hook, `.claude/{agents,rules,skills}`,
  AGENTS.md/CLAUDE.md fences, `src/webkit.css` and patched `src/main.ts`. Smooth, readable plan output.
- **Friction:** init adds 8 devDependencies pinned as `"latest"` — and the very next `doctor` WARNs "8 pinned as latest —
  consider pinning". The tool flags its own output. I pinned them by hand.
- **Friction:** pnpm 11 refuses to finish install until build scripts are approved: `@aziontech/icons` has a runtime
  dependency on `fantasticon` (an icon _build_ tool) which drags `ttf2woff2` (native build) + `es5-ext`. A font package
  should not ship its generator as a dependency. Wrote `allowBuilds: false` for the three in `pnpm-workspace.yaml`.
- Note: init's NOTE says "Theme defaults to LIGHT; set `<html data-theme="dark">`" — useful, the one line I needed for dark mode.
- `doctor`: 15 ok, 2 warn (no WebkitProvider yet; the "latest" pins).

### 05:36 — Finding the blocks (≈10 min) — `search` is the best part of the toolkit

- `npx @aziontech/webkit search "<page in plain words>"` returned the right block **first** for 7/8 pages:
  `platform/view/table-view` (lists), `platform/create/multipage-create` (wizard step 1 "Where it runs" — literally the
  design's step name), `platform/detail/details-page` (+ variants `ServiceOverview` = workload detail with checklist and
  topology, `ResourceOverview` = resource detail with Get started), `platform/account/profile` (account settings: exactly
  the design's sections General / Company / Address / Login / Source control / Appearance / Danger zone),
  `platform/create/single-page-create` (create resource), `platform/ai/ai-chat` (assistant, `Empty` variant), and
  `shells/console` (shell). The designs are visibly built from these blocks.
- `view <id>` prints guidelines + the primary SFC. Guidelines are excellent (when to use / not, building blocks A..S,
  copy, a11y, states). But `view` only prints the **primary** variant's SFC; to read `ServiceOverview` I had to `add` it.
- **Contradiction between blocks:** `shells/console` (ListPage) says a first-level list has **no PageHeader** ("the crumb
  names the first-level list and the page opens on its controls row"); `platform/view/table-view` says the opposite
  ("PageHeader … At first level this heading is the only place the module name appears; the breadcrumb starts at the
  second level"). The designs follow table-view (H1 'Applications', no crumb). I followed the designs.
- **Privacy smell:** table-view's mock avatars are real `ca.slack-edge.com` URLs of real employees. A public design
  system block should not hot-link people's Slack photos. I replaced them with initials.

### 05:46 — `add` (≈6 min)

- `add <id> --dest <file>` copies the SFC, verifies imports ("16 subpaths, all exported"), records a checksum in
  `webkit.blocks.json`. Good.
- **Friction:** `add platform/detail/details-page --variant ServiceOverview --dest src/views/WorkloadDetail.vue` wrote the
  **primary** variant (ResourceOverview) to `WorkloadDetail.vue` _and_ the requested one to
  `WorkloadDetailServiceOverview.vue`. With `--dest <file.vue>` I expect exactly that file to be the variant I asked for.
- **Friction:** the "Add the route" hint ignores my dest and suggests `path: '/details-page'` / `'/table-view'` — the
  block id, not anything route-like.
- **Big structural inconsistency:** blocks disagree on whether they include the shell.
  - `table-view`, `profile`, `ai-chat` are body-only (good — they drop into a layout).
  - `details-page` variants each embed a **complete private copy of the console shell** (Sidebar + Command palette + Menu
    - 150-line nav data + account dropdown + GlobalHeader + a mobile Drawer), and _not_ built on `AppLayout` like
      `shells/console` is. 1383 and 2067 lines respectively. To use them in a routed app I must surgically cut ~900
      lines of shell out of each page and move the breadcrumb (+ environment Select) into my shared shell.
  - `shells/console` itself is a page (ListPage with a stand-in table body), not a layout with a `<RouterView>`/slot.
    WebKit needs a real `ConsoleLayout` (component or block variant) whose default slot is the page, with breadcrumb/tab
    hooks, and page blocks that never carry the shell.

### Shell + router (`date` ≈05:30 local clock; this machine's clock runs oddly — I log what `date` says)

- Decision: one `ConsoleShell.vue` layout route (from `add shells/console`) with `<RouterView>` in `AppLayout`'s default
  slot; pages with no rail (`/applications/new`, `/resources/new`, `/assistant`) are top-level routes.
  `route.meta.surface` picks the nav tree (console sample vs demo nav — the two design sets have different sidebars),
  `meta.nav` the Menu `active-id`, `meta.crumbs` the header breadcrumb, `meta.menuPath` drills the Menu into Settings for
  `/account` (Menu's `v-model:path` gives the design's "settings sidebar with ‹ Back" for free).
- Rewrote the shell's script (≈150 lines): router-driven active id, Create/Agent/avatar/palette navigation, ⌘K/Ctrl+K
  binding (the block announces `aria-keyshortcuts="Meta+K"` but **does not bind the key** — I added the listener).
- **Missing:** no theme composable. `ThemeSwitcher` "applies no global side effect", the theming skill says "set
  data-theme on <html>", so every app re-writes the same matchMedia + localStorage + data-theme code. I wrote
  `useTheme.ts` (40 lines). WebKit should ship `useTheme()` (and the shell block should use it).
- WebkitProvider + ToastPlugin wired in App/main as the usage skill says; `doctor` warning cleared.
- Icons: `@aziontech/icons` has product glyphs for nearly every console module (`ai-edge-application`, `ai-workloads`,
  `ai-edge-firewall`, `ai-real-time-purge`…), found by grepping `dist/azionicons.css` — there is no icon search in
  `webkit search` and no icon list in `llms/`. **Friction:** the colour brand icons' CSS header says use
  `<i class="ai ai-google-cor">`, but the real selector is `.ai-cor.ai-js` (two classes). My JS/HTML logos rendered
  blank until I read the CSS rules.

### Page 1 — Applications list (console) (~25 min incl. tooling)

- From `platform/view/table-view`: kept PageHeader, PropertyFilter, Refresh/Download CSV/CollectionPreferences,
  `TableRoot` via `useCollection`, row menu, delete ConfirmDialog, empty/no-match states. Changed copy, columns
  (Name/Repository/Workloads/Status/Last Editor/Last Modified), 20 mock apps, page size 8.
- Design differences I accepted because WebKit prescribes otherwise: the design has a "Filter" button + search input;
  the block says "one control narrows the list" → `PropertyFilter` (funnel icon in the field). Columns button →
  `CollectionPreferences` (gear). Status uses `StatusIndicator` (dot, as in the design) instead of the block's
  `Table.CellStatus` tag.
- Hand-written bits: logo/GitHub/cube icon before `Table.CellLink` (CellLink has **no leading-icon prop**, and every
  console list has an icon before the name); Last Editor cell = `Avatar` + name (no preset; `Table.CellTime` merges
  author and time but the design has them as two columns).
- **Bug in the block:** table-view sorts "Last Modified" on the `lastModified` _string_ ("just now", "3 weeks ago")
  rather than the date → alphabetical sort. I switched the accessor to `modifiedAt`.
- `Table.CellLink` with `to` (in-app) still draws the external-link mark; the design shows plain names. Can't turn it off.
- Mobile: the table turns into label/value cards automatically (matches the _demo_ design; the console design scrolls
  horizontally instead — WebKit picks the cards, fine).
- Result after the first screenshot: desktop is **very close** to the reference in both themes.

### Page 5 — Resources list (demo) (~5 min)

- Same block, almost unchanged: it _is_ the demo design (Live/Inactive tags, domains +N with copy, initials + time).
  Only removed the Slack avatars, set 8 rows / resource-07 Inactive, routed Create/rows, fixed the sort accessor.

### Detail pages — the shell surgery (pages 3 and 7)

- `WorkloadDetail.vue` (ServiceOverview, 2067 lines) and `ResourceDetail.vue` (ResourceOverview, 1383 lines): I cut
  the embedded rail, header, mobile nav Drawer (≈1300 lines per file in total) with a line-range script and kept the
  `<main>` (PageTabs + body) and, for the workload, the deploy Drawer. `webkit diff` now reports `+62 −642` for the
  workload page: the "drift" check can't tell "I removed the duplicated shell" from "I rewrote the page".
- The workload breadcrumb ends on an environment `Select` that lives in the page's state; my shell can't render it
  from route meta, so the page **teleports** its breadcrumb into a `#shell-crumbs` slot I added to the shell header
  (`<Teleport defer>`). A real `AppLayout`-based console layout should expose a `breadcrumb` slot/provide for this.
- **Tabs don't work in the blocks.** Both variants render the Overview body whatever tab is selected (`activeTab` is
  a ref nobody reads). The design asks for tabs synced to `?tab=`. I made `activeTab` a computed over the route
  query and wrote `components/DetailTab.vue` (SectionHeader + flush TableRoot for Deployments/Versions, EmptyState for
  Settings/Build) following the details-page guideline "Give Versions and Deployments the same controls row and table
  shape". (The block's `Application` variant reportedly has working tabs, but it is a different page.)
- Copy: renamed Service→Workload, Policy→Firewall, Error Page→Custom Page, Resource→Application node,
  `analytics-app`→`resource-01`, `acme-production`→`magalu-storefront`. That is all `sed` — the blocks hard-code the
  demo vocabulary across script _and_ template (≈40 occurrences in the workload page), nothing is a prop/data.
- Result: desktop and 390px both match the reference screenshots almost 1:1 (summary card, +7 chip, Visit, Deployment
  Settings band with "Shared · 3 workloads", checklist "0 of 3", TopologyDiagram with dashed staged nodes; mobile 2-col
  grid with Visit + environment select under the domain). TopologyDiagram's bind/stage/Deploy drawer/toast all work.
- Duplicate Toaster: profile and details-page blocks each mount `<Toaster>` although `webkit-usage` says wire
  `ToastPlugin` once and "never add both blindly". Removed the per-page ones.

### Page 4 — Account settings (~10 min)

- `platform/account/profile` is the design: same 7 sections, rows, Selects, Switches, Source control with GitHub
  Active tag, Danger zone, SaveBar on change, field validation and toasts. I changed copy + mock values and bound the
  "System appearance" Select to my `useTheme()` so it actually switches the theme.
- The settings sidebar of the design came free from the shell: `Menu` drill (`kind: 'drill'`) + `v-model:path`.
- Body-only block — dropped straight into the shell. Easiest page of the eight.

### Page 2 — Create Application wizard (~15 min, one wrong turn)

- First pick `platform/create/multipage-create` (top hit for "create wizard stepper") turned out to be an **Access
  List** creation flow. Re-searched with "create application wizard deploy from git" → `platform/create/source-wizard`,
  whose 4 rail steps are literally the design's (Where it runs / Select a method / Select a source / Create and deploy).
  Lesson: `search` ranks on the _words_; it would help if results showed each block's step names/sections.
- Re-adding a block to the same dest needs manual surgery of `webkit.blocks.json` (no `remove`/`--force` command).
- The block plots only steps 1–2 ("source, repository, target and configure steps … are not plotted here") and the
  method rows have **no click handler**. I wired: workload pick → step 2 (block), method pick → toast + back to list.
- Copy: Projects→Applications, Service→Workload, 25 mock workloads ("19 more. Type to narrow the list." matches).

### Page 6 — Create Resource (~8 min)

- `platform/create/single-page-create` = the design (focus header, General card with 2 SettingRows, collapsible
  Advanced, plain SaveBar with Import + caption, Cancel/Save, validation). It is a _Create Domain_ form; changed copy,
  wired Back/Cancel/Save (toast + navigate). Submit with empty fields shows required errors.

### Page 8 — AI assistant (~3 min)

- `platform/ai/ai-chat` (Empty variant) is complete and _working_: suggestions send, thinking → streaming answer with
  citations, sources, feedback, follow-ups, stop/retry, New chat, char counter. Used as-is. Best block of the set.

### Verification

- `npx @aziontech/webkit check` first run: **14 errors**, all from rules meant for WebKit _contributors_ applied to my
  app by the default `--strict` preset: "Comment in implementation code" (any `//` comment in app code is an error)
  and "Runtime object defineProps — use interface Props". A product team will hit this on day one; forbidding all
  comments in an application is overreach. I removed the comments (rationale moved here) and typed the props.
  Second run: `0 error(s), 0 warning(s) in 19 source file(s)` → `A/check.txt`.
  Note: check passes on the block files because they are `<script setup>` JS; lint never sees how much I changed.
- **TypeScript does not pass.** `vue-tsc -b` (the Vite template's `build`) fails with WebKit-caused errors only:
  1. `Cannot find module '@aziontech/webkit/card'` (and every other `.vue` subpath) from any `lang="ts"` file —
     the `exports` map points at raw `.vue` files and TS can't resolve them (tried TS 6.0 and 5.9, plus the README's
     `vueCompilerOptions.htmlAttributes`). JS SFCs don't notice because they aren't type-checked.
  2. `node_modules/@aziontech/webkit/src/components/feedback/toast/index.ts(48,7): TS2352` — WebKit's own source fails
     `strict`, and since it ships `.ts` sources, `skipLibCheck` can't skip it.
  3. `@aziontech/icons` side-effect import has no types (TS 6 `noUncheckedSideEffectImports`) — shimmed in `env.d.ts`.
     Decision: `build` = `vite build` (passes), `typecheck` = `vue-tsc -b` kept as a script, **failing** for (1)+(2).
     The README's claim "vue-tsc --noEmit checks it under strict" did not hold for me.
- Screenshots: own Playwright runner (`mcr.microsoft.com/playwright:v1.62.0-noble`, flock'd, static server with SPA
  fallback, viewport grown by the AppLayout inner scroller like the reference captures). 32 shots =
  8 routes × {1440, 390} × {light, dark} in `A/shots/`, named like the reference; 8 interaction shots in
  `A/shots/interactions/` (filter "docs" → 2 rows, Workload Deployments tab, wizard step 2, account SaveBar,
  Create Resource validation, ⌘K palette, mobile nav drawer). Only console noise: a 404 for `/favicon.svg`.

## Hand-written pieces (and why)

| Piece                                                                                  | Why WebKit didn't cover it                                                                           |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `composables/useTheme.ts` (40 lines)                                                   | No theme composable; ThemeSwitcher has no side effect.                                               |
| Shell script rewrite (~150 lines) + `#shell-crumbs` teleport target + Ctrl/⌘K listener | `shells/console` is a page with a stand-in body, not a router layout; ⌘K is announced but not bound. |
| `data/nav.ts`, `data/applications.ts`, `router.ts`                                     | App data — expected.                                                                                 |
| Icon + `Table.CellLink` wrappers, Avatar+name "Last Editor" cell                       | CellLink has no leading icon; no "person" cell preset.                                               |
| `components/DetailTab.vue`                                                             | details-page variants render Overview for every tab.                                                 |
| Method click → finish, Create Resource submit → toast + navigate                       | Blocks stop at step 2 / validate only.                                                               |
| ~1300 deleted lines of duplicated shell in 2 pages                                     | details-page variants embed their own shell.                                                         |
| `env.d.ts` shims                                                                       | `.vue` exports unresolvable by TS; icons CSS has no types.                                           |

## Time per page (approximate; the machine clock is unreliable — `date` read 05:26 at start and 05:43 at the end,

which is clearly wrong for this amount of work — so these are my effort estimates in relative terms)

| Page                                                          | Effort | Status                                                        |
| ------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| Setup (scaffold, install, init, doctor, pinning, pnpm builds) | ~10%   | —                                                             |
| Reading docs / search / view / add                            | ~15%   | —                                                             |
| Console shell layout                                          | ~15%   | done                                                          |
| 1 Applications list                                           | ~12%   | done                                                          |
| 2 Create Application wizard                                   | ~10%   | done (steps 3–4 not in WebKit; method pick finishes the flow) |
| 3 Workload detail                                             | ~12%   | done                                                          |
| 4 Account settings                                            | ~5%    | done                                                          |
| 5 Resources list                                              | ~3%    | done                                                          |
| 6 Create Resource                                             | ~4%    | done                                                          |
| 7 Resource detail                                             | ~5%    | done                                                          |
| 8 AI assistant                                                | ~2%    | done                                                          |
| check / typecheck / screenshots / journal                     | ~7%    | build ✔, check ✔, typecheck ✘ (WebKit)                        |

## What WebKit must change so this is effortless

1. **A real console layout.** Ship `ConsoleLayout` (or make `shells/console` a layout block) built on `AppLayout` with
   a default slot / `<RouterView>`, router-aware Menu (`to`), and `breadcrumb`/`actions` slots. Then **no page block
   should embed the shell** (details-page variants carry ~650 lines of shell each, not even on AppLayout).
2. **Make blocks consistent about chrome.** Today: list/profile/chat are body-only, details-page has a full shell,
   create blocks carry the focus header. Say it in the metadata (`chrome: none|console|focus`) and keep them uniform.
3. **TypeScript must work for consumers**: publish `.d.ts` (or `.vue.d.ts`) for every `.vue` export, fix the
   `toast/index.ts` strict error, and test `vue-tsc -b` on a fresh `create-vite vue-ts` app in CI.
4. **`add` ergonomics:** `--variant X --dest file.vue` must write exactly X to that file; route hint should use
   the dest; add `remove`/`--force` for re-adding; data-driven copy (resource vocabulary in one object) so adapting
   "Service" to "Workload" isn't 40 seds.
5. **Blocks should finish what they start**: detail tabs that switch content and sync to `?tab=`; wizard method
   rows with handlers; create forms that emit `submit`/navigate. And fix the table-view "Last Modified" string sort.
6. **Ship `useTheme()`** (system/dark/light, data-theme, persistence) and use it in the shell's ThemeSwitcher.
7. **Lint presets by audience:** a consumer preset must not forbid comments or runtime `defineProps`; keep those for
   WebKit contributors. And `init` must not write `"latest"` that its own `doctor` then warns about.
8. **Packaging:** webkit should peer-depend on theme (5.12 pulls theme 4.3.1 next to 5.2.2); `@aziontech/icons` must
   not depend on `fantasticon` (native build scripts at install); version naming (5.12 vs MIGRATION-v6/v6 ids).
9. **Resolve guideline contradictions** (shell ListPage "no PageHeader at first level" vs table-view "PageHeader is
   the only place the module name appears"), and keep contributor/spec prose ("this spec is menu-item's only spec",
   "deliberately deferred … visual breaking change") out of consumer `llms/components/*.md`.
10. **Small component gaps:** `Table.CellLink` leading icon + option to hide the external mark for in-app links; a
    person cell (avatar + name); `search`/`view` for icons; correct the colour-icon usage comment (`ai-cor ai-js`,
    not `ai-js-cor`); remove real people's Slack avatar URLs from blocks; `view --variant` should print that variant.

## What worked really well (to be fair)

- `search` found the right block for every page (7/8 on the first query). The designs are clearly made from them.
- Guidelines in `view` are the best part: when-to-use, building blocks, copy, a11y, states.
- Once wired, the _components_ are excellent: `useCollection` + PropertyFilter + CollectionPreferences + TableRoot
  (sorting, URL state, CSV, card rows on mobile), TopologyDiagram, the AI chat, AppLayout's compact drawer, the
  Menu drill-in for settings, SettingRow/SaveBar. Light/dark worked with zero per-theme edits.
- `init` + `doctor` + `check` are a coherent toolchain; `check` passing gives real confidence on imports/tokens.
