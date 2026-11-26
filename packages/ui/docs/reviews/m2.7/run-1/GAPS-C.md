# GAPS — 16 reference pages vs. WebKit (`eval/journey-c` @ `410437266`)

How I audited: I read every `description` in `ref/pages.json`, broke each page into regions, and
ran each region through WebKit's own discovery tools:

- `node packages/webkit/src/cli/cli.js search "<region in plain words>" --json` (about 55 queries);
- `cli.js view <id>` on the closest hits (API, use/avoid, examples);
- `packages/webkit/catalog.json` (`patterns`, 79 blocks) and `catalog/components/*.json`
  (282 entries, `purpose` / `useWhen` / `avoidWhen`);
- `grep` over `blocks/` to see how the blocks really compose the parts.

I did not start the MCP server as a client. `search`/`view` read the same `catalog.json` that the
MCP serves. I did not run the docs site for the audit; I ran it later to check the new pieces.

Legend: ✅ covered by an existing export or block · 🟡 covered by composition, but with friction or
partly · ❌ missing.

## Summary

WebKit already covers almost every **region** of the 16 pages. That includes 63 marketing
sections, 21 `doc-*` components, 17 AI components and 79 blocks. The gaps sit at two levels:

1. **Page level for docs.** No block composes the `doc-*` components into a documentation page.
   The `shells/documentation` block is the chrome only: its reading column is a hand-written
   `<h1>`/`<h2>`/`<p>` placeholder, and it uses none of `DocPageHeader`, `DocProse`,
   `DocCallout`, `DocSteps`, `DocCardGroup`, `DocItem`, `DocPagination` or `DocCta`. Outside
   `platform/view/marketplace` and `template-browser`, no block imports a `doc-*` component at
   all. An agent asked for "a docs article" or "the docs home" gets the shell and has to work out
   the page anatomy itself. This affects 4 of the 16 pages.
2. **One repeated hand-rolled control.** The field-shaped **"Search ⌘K" trigger** in every
   console, demo and docs top bar is not a component. It is copied as a raw `<button>` with a
   ~400-character class string in **75 `.vue` files** (`grep -rl 'aria-keyshortcuts="Meta+K"'`):
   blocks, variants, demos and the docs app layout. The `docs-header` block falls back to an icon
   button only. This affects 12 of the 16 pages.

Marketing pages are, by design, assembled by the site from section JSON
(`.claude/docs/SECTIONS.md`), so a missing "pricing page block" is not a WebKit gap. Every
section the four site pages need already exists.

## Per page

### site (dark-only)

| Region                                                        | WebKit                                                                            |                                                 |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| Site nav + mega-menus, mobile sheet                           | `site-nav`, `headers/site-header`, `shells/website`                               | ✅                                              |
| Footer: 4 columns, socials, status, language                  | `site-footer` / `footer` (site placement)                                         | ✅                                              |
| Framed column, registration marks, hatched spacer bands       | `section-container`, `section-gap`, `frame-box`, `band-stack`, `texture-material` | ✅                                              |
| `// EYEBROW` labels                                           | `overline`                                                                        | ✅                                              |
| Hero (H1 with accent line, 2 actions, dotted band)            | `hero-band`, `hero`, `banner-art`                                                 | ✅                                              |
| Logo marquee                                                  | `ticker`, `logo-wall`                                                             | ✅                                              |
| Primitives grid (Compute/AI/Data/Security)                    | `platform-directory`, `capability-grid`                                           | ✅                                              |
| Network band + pill stats + Americas dot map                  | `network-section`, `network-map`, `stats-band`                                    | 🟡 stats are figures, not orange outlined pills |
| Customer proof cards                                          | `customer-spotlight`, `card-grid`                                                 | ✅                                              |
| Why Azion (4 illustrated cells)                               | `feature-tiles`, `media-tile`, `illustration`                                     | ✅                                              |
| Use-case rows                                                 | `media-split-stack`, `media-split-band`, `use-cases`                              | ✅                                              |
| Recognition carousel                                          | `recognition-marquee`, `quote-carousel`                                           | ✅                                              |
| Client stories mosaic                                         | `client-mosaic`                                                                   | ✅                                              |
| Closing CTA                                                   | `closing-call-to-action` (+ agents/templates/newsletter)                          | ✅                                              |
| Pricing: plan cards + Monthly/Annual                          | `pricing-plans`, `card-pricing`                                                   | ✅                                              |
| Pricing: comparison matrix, sticky header, mobile plan picker | `compare-plans` (folds to one plan with a `select`)                               | 🟡 picker is not a sticky bottom bar            |
| FAQ, two columns                                              | `faq-section`, `faq`                                                              | ✅                                              |
| Functions: framework strip                                    | `ticker`                                                                          | ✅                                              |
| Functions: code showcase with tabs                            | `code-split`, `sticky-scroll-code`                                                | ✅                                              |
| Testimonial + logo tab row                                    | `quote-tabs`, `client-quotes`                                                     | ✅                                              |
| Split CTA ("Build once. Run everywhere.")                     | `closing-call-to-action-templates` / `banner`                                     | 🟡 nearest match, not identical                 |
| Contact: hero + lead form (phone with dial code)              | `hero-form`, `phone-input`                                                        | ✅                                              |
| Contact: support 2×2 grid ("Under a cyberattack?")            | `contact-hub` (has an `UnderAttack` example)                                      | ✅                                              |

### docs (light + dark)

| Region                                                                                                               | WebKit                                                         |                                                                 |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------- |
| Docs header (wordmark + DOCS tag, tabs, **search field "Search CTRL K"**, GitHub, Console)                           | `headers/docs-header`                                          | 🟡 search is an icon button only → **gap: SearchTrigger**       |
| Sidebar: collapsible groups, back link, theme switch, collapse                                                       | `shells/documentation`, `sidebar`, `menu`, `theme-switcher`    | ✅                                                              |
| On this page + GitHub/Community links + promo card                                                                   | `doc-on-this-page`, `doc-cta`                                  | ✅                                                              |
| Article masthead: breadcrumb, H1, lead, meta row (Last updated, Copy/View as Markdown, Agent setup)                  | `doc-page-header` (`lastUpdated`, `metaActions`)               | ✅                                                              |
| Callouts (info / tip)                                                                                                | `doc-callout`                                                  | ✅                                                              |
| Numbered steps with connector                                                                                        | `doc-steps`, `doc-step`                                        | ✅                                                              |
| Code blocks (language, line numbers, copy, max-height)                                                               | `code-block`, `doc-code-group`                                 | ✅                                                              |
| Installer tab strip (Homebrew/Windows/RPM…)                                                                          | `doc-tabs`, `doc-code-group`                                   | ✅                                                              |
| AI prompt card                                                                                                       | `doc-prompt`                                                   | ✅                                                              |
| Link-card grids, Next steps                                                                                          | `doc-card-group`, `doc-card`                                   | ✅                                                              |
| Related resources list                                                                                               | `doc-item`                                                     | ✅                                                              |
| Pager                                                                                                                | `doc-pagination`                                               | ✅ (but `search "pager next previous page"` does not return it) |
| Request-path / CLI flow diagram in a card with copy                                                                  | `diagram` (`name="applications"` or `spec`) inside `doc-frame` | 🟡 `diagram` is filed as marketing-only                         |
| Docs home hero: "Copy prompt" button carrying 4 AI-tool logos                                                        | `doc-prompt` / `section-command` / `button` + `ai-*` icons     | 🟡 no logo-stack button                                         |
| Docs home "Start by interface" dark banner 70/30                                                                     | `banner`                                                       | ✅                                                              |
| Framework template tiles                                                                                             | `doc-card` + `ai-react`, `ai-next`… icons                      | ✅                                                              |
| **A whole docs article page** (masthead → prose → callouts → steps → code → next steps → related → pager, plus rail) | none: `shells/documentation` is chrome with placeholder markup | ❌ **gap: block `docs/article`**                                |
| **The docs home / landing page** (hero + start-by grids + follow along)                                              | none                                                           | ❌ **gap: block `docs/landing`**                                |

### console (light + dark)

| Region                                                                                       | WebKit                                                                                         |                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------- |
| Shell: sidebar groups, footer account, top bar                                               | `shells/console`, `app-layout`, `headers/resource-header`                                      | ✅                        |
| **Top-bar "Search CTRL K" field**                                                            | hand-rolled `<button>` + `Kbd` in every block                                                  | 🟡 **gap: SearchTrigger** |
| Applications list: header, toolbar, table, pagination                                        | `platform/view/table-view`, `table`, `pagination`, `collection-preferences`                    | ✅                        |
| Repository cell / "Connect Git Repository"                                                   | `link` + `ai-github` icon inside `Table`                                                       | ✅                        |
| Create wizard: step rail + workload chooser ("19 more — type to narrow")                     | `platform/create/multipage-create`, `stepper`, `resource-picker`                               | ✅                        |
| Workload detail: tabs + Deploy, summary card, checklist, topology                            | `platform/detail/details-page` (`ServiceOverview`), `production-checklist`, `topology-diagram` | ✅                        |
| Breadcrumb environment switcher                                                              | `details-page` (ends its breadcrumb on the environment picker)                                 | ✅                        |
| Account settings (General, Company, Address, Login, Source control, Appearance, Danger zone) | `platform/account/profile`, `settings-section`, `setting-row`                                  | ✅                        |

### demo (light + dark)

| Region                                               | WebKit                                                     |                       |
| ---------------------------------------------------- | ---------------------------------------------------------- | --------------------- |
| Shell and top bar                                    | same as console; the demos import the blocks               | ✅ / 🟡 SearchTrigger |
| Resources list (mobile cards)                        | `platform/view/table-view`                                 | ✅                    |
| Create Resource + sticky footer with Import          | `platform/create/single-page-create`, `save-bar`           | ✅                    |
| Resource detail + Get started (CLI / GitHub Actions) | `details-page` (`Resource`), `platform/detail/get-started` | ✅                    |
| AI assistant (empty)                                 | `platform/ai/ai-chat`                                      | ✅                    |

## Ranked gaps

| #   | Gap                                                                                                                                            | Kind             | Pages                                          | Why it ranks here                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **SearchTrigger**: the field-shaped command-palette trigger (icon, placeholder, `⌘K`/`Ctrl K` keycap, collapses to an icon button when narrow) | component        | 12/16 (all docs, console, demo shells)         | 75 hand-rolled copies with a long class string. Each copy can drift on focus ring, `aria-keyshortcuts` and the narrow fallback. |
| 2   | **`docs/article`**: a documentation article page composed from the `doc-*` parts                                                               | block            | 3/16 (first-deploy, applications-ref, cli-ref) | 21 doc components exist, but no block shows an agent how they make one page. The shell's placeholder teaches the wrong markup.  |
| 3   | **`docs/landing`**: the documentation home (hero with agent prompt, start-by grids, follow-along)                                              | block            | 1/16 (docs-home)                               | The same problem on the docs front door.                                                                                        |
| 4   | Logo-stack button ("Copy prompt" + 4 AI logos)                                                                                                 | component / prop | 1/16                                           | Small; can be composed.                                                                                                         |
| 5   | Sticky bottom plan picker for `compare-plans` on mobile                                                                                        | prop/variant     | 1/16                                           | `compare-plans` folds to a select, but not as a sticky bar.                                                                     |
| 6   | Outlined "pill" stats on the network band                                                                                                      | variant          | 1/16                                           | `stats-band` shows figures, not pills.                                                                                          |
| 7   | `diagram` allowed on the docs surface (vertical request path, labelled return arrows)                                                          | docs/surface     | 2/16                                           | It works, but it is filed under marketing, so the catalog steers docs away from it.                                             |

Picked for this run: **1 (component)**, **2 (block)** and **3 (block)**.

**How they shipped:**

- 1 → `@aziontech/webkit/search-trigger`.
- 2 and 3 → first built as new blocks `docs/article` and `docs/landing`. A toolkit invariant then
  kept block ids inside `headers|shells|platform`, so they ended as variants `Article`,
  `Reference` and `Landing` of `shells/documentation` (see `JOURNAL.md` §5b).

## Discovery-tool findings (made during the audit)

- `search` ranks by single shared words. "pricing page", "product page", "contact sales page" and
  "documentation article page …" all return `doc-page-header`, `page-header` and `page-tabs`,
  because they share the word "page". "pager next previous page" does not return
  `doc-pagination`. "stats pills data centers latency" returns `flow`, `pagination` and `table`,
  not `stats-band` or `network-section`.
- `search` prints `webkit 5.12.0` while the branch is the v6 line (`MIGRATION-v6.md`,
  `feat/webkit-v6`).
- The block categories in `/webkit-new-block` (platform/* + shells) omit `headers/`, which exists,
  and offer nothing for docs or marketing pages.
