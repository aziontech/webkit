# C1c — builder journal and DONE (verbatim)

`JOURNAL.md` and `DONE.md` from job C1c, copied without edits.

---

# Journal — job C1c (console)

## 14:50 — start
Read BRIEF, pages.json and reference tiles for console-workload-detail, console-function-detail, console-firewall-rules.

## 14:54 — setup (~15 min)
- **worked well**: `npm create vite` + install of the 3 tarballs + `npx @aziontech/webkit init -y` wired everything (webkit.css, postcss/tailwind v4, eslint, stylelint, husky, CLAUDE.md, .claude/ skills). `doctor` 15 ok / 2 warn.
- **medium** — `@aziontech/webkit@5.12.0` package.json depends on `@aziontech/theme ^4.0.0`, so npm nests theme **4.3.1** inside `node_modules/@aziontech/webkit/node_modules` while the app gets the shipped theme **5.2.2**. Two theme majors in one tree; `doctor` reports "theme 5.2.2" and doesn't flag the nested 4.x. Left as is (app's webkit.css imports top-level 5.2.2).
- **low** — `init` adds devDeps pinned as `"latest"` (eslint, stylelint, husky…), then `doctor` warns about exactly those "latest" pins. Init should pin what doctor wants.
- **low** — `init` adds `"prepare": "husky"` before a git repo exists; `npm install` would fail/noise without `git init` first. Did `git init` before install.
- **low** — `webkit add <block> --variant X` writes the base variant file too (asked for Firewall, got RulesList.vue + RulesListFirewall.vue) but only prints the route for the base file; the summary line for rules-list did not mention RulesList.vue at all.
- **low** — Vite template `style.css` uses hex colours; removed (init doesn't touch it, and it fights the theme).
- **worked well**: `webkit search` found exact blocks for all three screens: `platform/detail/details-page --variant ServiceOverview` (summary + checklist + topology = workload page almost 1:1), `platform/edit/code-editor` (Code tab), `platform/view/rules-list --variant Firewall`. Unmodified blocks already render the console chrome near pixel-identical to the reference (only data/nav labels differ).
- **medium** — the rules-list Firewall block renders **without** the console shell or tab bar (bare content), unlike details-page/code-editor which ship the full shell. Must graft it into the shell myself (shells/console DetailPage).

## 14:56 — console-workload-detail (~20 min)
- **worked well**: `platform/detail/details-page --variant ServiceOverview` is this page: shell, breadcrumb with environment Select, PageTabs + outlined Deploy, summary Card (link + "+7", Visit, kebab, 4-col facts, CopyButton, Deployment Settings band with Shared tag), ProductionChecklist card, TopologyDiagram. Only data/copy edits were needed. iPhone layout (2-col facts, Visit + environment Select under the domain, horizontal-scroll topology) also matched with zero work.
- **medium** — each console block hard-codes its own ~180-line `navGroups`/`recentRows` and a full copy of the shell (Sidebar, Command, GlobalHeader, account menu) inline: 2,040 lines for one page. There's no shared shell component to feed a nav config; I moved the nav to `src/data/consoleNav.js` and imported it into each block (a Python helper strips the inline arrays). `webkit diff` will now report drift, which the docs treat as a smell.
- **medium** — block sample domain is "Services/Resources/Policies"; the Azion console reference uses "Workloads/Applications/Firewall/Custom Page/Connector". Renaming meant ~40 sed edits across data, aria-labels, toast copy and drawer copy (e.g. "Copy service ID", "Shared · 3 services", "Bind Policy").
- **low** — environment switcher in the breadcrumb: reference is a borderless text trigger "Production ▾"; `Select` (llms/components/select.md) has only size/invalid/disabled — no ghost/borderless trigger. Kept the bordered Select.Trigger.
- **low** — `TopologyDiagram` nodes: reference shows the node name at body size as a link with external-link icon and an inline "+" (Add Domain) in the name row; the shipped component draws the name small without the icon, and the `actions` slot only reaches the header row. Left as WebKit draws it.
- **low** — `SectionHeader size="small"` "Deployment topology" sits 8 px further in than the card edge (x=332 vs reference 324). Not adjustable without restyling.
- **low** — reference "Created" shows a photo avatar; no image asset, so `Avatar` falls back to initials "RO".
- **low** — iPhone `SearchTrigger` collapsed magnifier renders as a 44 px button vs 32 px in the reference (touch-target size, probably intentional).
- Icons: `@aziontech/icons` has product glyphs (`ai ai-workloads`, `ai-edge-firewall`, `ai-edge-functions`, `ai-custom-pages`…) — good, but nothing in webkit llms tells you the list; I had to grep `@aziontech/icons/dist/catalog.json`. (low)

## 14:57 — console-function-detail (~20 min)
- **worked well**: `platform/edit/code-editor` (Code variant) is this page: PageTabs Code/Settings, ToggleGroup Code|Arguments with the "JavaScript, running on request" caption, a fill `CodeEditor`. Settings tab is already there (General / Runtime / Execution environment / Status). Only breadcrumb, code and copy changed.
- **medium** — `CodeEditor` (llms/components/code-editor.md) defaults to a plain textarea with no syntax colours; the reference is Monaco. The doc says pass `loader: () => import('monaco-editor')` and "set up Monaco's workers in that module" but gives no worker snippet. With monaco-editor 0.57 the usual Vite recipe `monaco-editor/esm/vs/editor/editor.worker?worker` fails (package `exports` maps `./*` → `./esm/vs/*.js`); correct path is `monaco-editor/editor/editor.worker?worker`. Cost ~10 min. The block itself ships without a loader, so a copied block never looks like the reference.
- **low** — the block's `monaco-editor` is an *optional peer* not installed by `init` nor mentioned by `doctor`.
- **low** — reference gutter shows zero-padded "01…15" and 16 px line height, with function calls in orange; WebKit's Monaco theme (`themeFromTokens`) gives "1…15", ~20 px lines, and no distinct colour for function identifiers. No prop for line-number format or line height.
- **low** — iPhone: reference wraps the caption under the ToggleGroup; WebKit keeps it inline (truncating). Same component, different container behaviour.
- **low** — the block's copy talks about a "service" throughout (aria labels, field descriptions, ids `service-name`) — renamed visible strings to "function".
- **low (bug)** — dev console on the workload page: `[Vue warn]: injection "Symbol(FlowContext)" not found at <FlowAnchor> at <TopologyDiagramNode>` on every render. Diagram still draws.

## 15:01 — console-firewall-rules (~25 min)
- **medium** — `platform/view/rules-list --variant Firewall` ships page content only (`layout-boundary min-h-dvh` root, no Sidebar/GlobalHeader/PageTabs), although its guidelines call it "the Rules tab of a firewall". Grafted it into `shells/console --variant DetailPage` (AppLayout shell): `FirewallRules.vue` (shell, Firewall › edgeflow-production breadcrumb, Overview / Rules Engine / Settings tabs synced to `?tab=` with vue-router) + `FirewallRulesContent.vue` (block content). Had to remove the shell's environment Select, Deploy action and their state by hand.
- **medium** — the block's structure differs from the reference: an Accordion per phase ("Request phase · 5 rules"), a drag grip, a `Switch` for status, "2 months ago by Maya Chen". The reference is one flat bordered table: Order (number + up/down), Name, Description, Status *pill*, Last Modified (initials avatar + time). Replaced Card+Accordion with a single `TableRoot bordered :stackable="false"` with cell slots (`IconButton kind="transparent"`, `Tag`, `Avatar kind="square"`). Kept the block's move/announce logic.
- **low** — iPhone: `TableRoot` defaults to `stackable` (rows become cards below `--container-lg`); the reference scrolls horizontally, so I set `:stackable="false"`. Good that the prop exists.
- **low** — "Inactive" pill: the reference uses a light-orange pill. `Tag` severities are primary/secondary/success/info/warning/danger/accent/contrast; used `danger`, which reads red. llms/components/tag.md line 12 says "severity color via `kind`" but the prop is `severity` (doc inconsistency).
- **worked well**: `PageHeader` with Documentation / Add Rule stacks into full-width buttons on iPhone automatically, exactly like the reference.

## 15:01 — build + check (~15 min)
- **high** — `npm run build` as scaffolded (`vue-tsc -b && vite build`) fails on WebKit's own source: `node_modules/@aziontech/webkit/src/components/feedback/toast/index.ts(48,7): TS2352 … '$toast' is missing` (TypeScript 6 from create-vite). It also reports `Cannot find module '@aziontech/webkit/webkit-provider'` / `'@aziontech/webkit/link'` from `<script setup lang="ts">` (the exports map points straight at `.vue` sources with no `types`), and `@aziontech/icons` has no declaration for the side-effect import. The README claims "vue-tsc --noEmit checks it under strict". My fix: `src/env.d.ts` shims (`*.vue`, `@aziontech/icons`), App/Home as plain `<script setup>` (like the blocks), and `"build": "vite build"`, with type-checking moved to `"typecheck": "vue-tsc -b"` (that still fails on the WebKit toast file). Cost ~10 min.
- **low** — `webkit check` lint (`webkit/authoring-standards` prose-comment) flags a `/// <reference types="vite/client" />` triple-slash directive as a "comment in implementation code"; it's a tool directive. Removed it (tsconfig already has `types: ["vite/client"]`).
- **low** — `webkit check` lists "blocks drifting from the canonical copy" as part of the gate, but it reported nothing for my heavily edited `DetailsPageServiceOverview.vue` / `CodeEditor.vue` (0 errors). Unclear whether drift is checked for variant files at all.
- **low** — process: my own `pkill -f "vite --port 5136"` also killed the calling shell (exit 144). Not WebKit; noted for the time log.
- Result: `npm run build` ✓; `webkit check` 0 errors / 1 warning (the "latest" pins that init itself created).


---

# DONE — job C1c (console)

## Pages
- `console-workload-detail`: **built**. Shell, breadcrumb with environment Select, tabs + Deploy, summary card, Ship to production checklist and Deployment topology are all present. Gaps: the environment trigger has a border (Select has no borderless option); topology node names lack the reference's external-link icon and inline "+"; the Created avatar shows initials instead of a photo.
- `console-function-detail`: **built**. Shell, Functions › auth-handler, Code/Settings tabs, Code|Arguments ToggleGroup with caption, and a Monaco editor with the exact code and syntax colours. Gaps: the gutter shows 1…15 instead of 01…15, lines are slightly taller, and function identifiers aren't orange.
- `console-firewall-rules`: **built**. Shell, Firewall › edgeflow-production, Overview / Rules Engine / Settings tabs synced to `?tab=`, PageHeader with Documentation and Add Rule, Search rules, and the ordered table with move up/down, status pills, initials and relative time. Gaps: the Inactive pill is red (danger), not light orange; the Overview and Settings tabs are placeholders.

## WebKit pieces used most
- **Blocks:** `platform/detail/details-page` (ServiceOverview), `platform/edit/code-editor`, `platform/view/rules-list` (Firewall), `shells/console` (DetailPage).
- **Components:** `AppLayout`, `Sidebar`, `Menu`, `GlobalHeader`, `SearchTrigger`, `Command`, `Breadcrumb`, `PageTabs` + `Tabs`, `Card`, `TopologyDiagram`, `CodeEditor` (+ Monaco `loader`), `ToggleGroup`, `TableRoot`, `PageHeader`, `Tag`, `Avatar`, `IconButton`, `Tooltip`, `CopyButton`, `StatusIndicator`.
- **Icons and tokens:** `@aziontech/icons` `ai-*` product glyphs; theme tokens only, no hex.

## Top 5 WebKit problems (by impact)
1. **Type-checking fails out of the box.** `vue-tsc -b` errors inside WebKit's own `toast/index.ts` and can't resolve `.vue` subpath exports from `lang="ts"` files. I had to move type-checking out of `npm run build` (high).
2. **Every block carries its own full copy of the console shell and nav data** (800–2,000 lines each), written for a sample domain (Services/Resources/Policies). There is no shared shell component that takes a nav config, so every page needs a nav swap plus dozens of copy renames (medium).
3. **The `rules-list` Firewall block ships without the shell or tabs, and its structure differs** from the console's flat ordered table (accordion by phase, switches, drag grip). I had to graft it into `shells/console` and rewrite the table (medium).
4. **`CodeEditor` needs Monaco to match the reference, but the block doesn't wire it** and the docs give no worker snippet. The standard Vite worker import path breaks under monaco-editor 0.57's exports map (medium).
5. **Package and version setup has rough edges.** webkit 5.12 depends on theme ^4, so theme 4.3.1 is installed nested next to the shipped 5.2.2. `init` writes `"latest"` pins that `doctor` then warns about. `add --variant` quietly writes the base file too (medium/low).

## Build
- `npm run build` (now `vite build`) **passes**. `dist/` is a static SPA with history routes `/console-workload-detail`, `/console-function-detail`, `/console-firewall-rules` and the `/` index; unknown paths go to `/` once the host serves `index.html` as its fallback.
- `npx @aziontech/webkit check`: 0 errors.
- `npm run typecheck` (`vue-tsc -b`) still fails on WebKit's toast source; details in JOURNAL.md.
