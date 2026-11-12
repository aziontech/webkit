# Reference set — Azion WebKit AI evaluation, battery 2 (eval-m27b)

Captured 2026-11-12. **66 pages**: 46 site (every marketing page reachable from the header and footer of https://www.azion.com/en/) and 20 console screens (design sample).

## Files

- `pages.json` — one entry per page: `{ id, surface: "site"|"console", title, url_or_route, screenshots: {desktop, iphone}, description }`.
  - **site** descriptions contain: the global site chrome (nav, mega-menus, footer, visual language), the page-template layout notes (product / solution / hub / docs shell), hand notes for pages from battery 1 and for the client-rendered index pages, then the **full server-rendered component tree of `<main>`** in order — every section, its layout props (columns, mobile columns, kind, orientation), and the exact copy, buttons and link targets. Blog, Resource Hub and Success Cases lists are client-rendered, so their rendered text is appended.
  - **console** descriptions contain: the console chrome, the screen type, a hand-written page description (regions, components in order, content, states, interactions, iPhone behaviour) and the DOM outline of the top bar + main region at 1440px with boxes and exact copy.
  - Note: the site tree uses humanized names of the live site's own component `data-testid`s (e.g. "card grid (kind=frame columns=3 mobile-columns=1)"). The live azion.com site is itself built on WebKit marketing blocks, so these names closely mirror WebKit block names. Strip the `▸` lines before handing descriptions to agents if that is considered a hint.
- `site-pages.json` — the discovered site page list (id, url, `linked_from` = header menu/footer link text, HTTP status, final URL, title), `not_found_404` (empty) and `excluded` (links that are not marketing pages, with the reason).
- `shots/` — 132 PNGs `<id>--desktop.png` and `<id>--iphone.png`, plus `<id>--outline.txt` (DOM outline) and `<id>--sections.json` (coarse section/grid extraction) from the desktop capture, and `_log-*.json`.
- `structure/` — `<id>.txt` site component trees (from `tools/ssr_outline.py`) and `<id>--text.txt` rendered text of the 3 client-rendered list pages.
- `tools/` (not in the repository: `battery-2-capture-tools.tar.gz` on the preview server, see ROADMAP M2.7 "Battery 2") — `discover.mjs` (header/footer link discovery, opens every mega-menu), `mksite.py`, `cap2.mjs` (capture), `probe.mjs` (console route probing), `scrape.mjs`, `tile.mjs`, `ssr_outline.py`, `mkpages2.py` (builds pages.json + site-pages.json), job lists, `run.sh` (Playwright 1.62 in `mcr.microsoft.com/playwright:v1.62.0-noble` under the shared `.vt.lock` flock; `RUN_TIMEOUT` limits only the container and removes it on timeout).

## Device profiles (both full page)

| profile | settings                                                                                                                                                                        | file                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| desktop | 1440×900 viewport, DPR 1, Chromium                                                                                                                                              | `<id>--desktop.png` |
| iPhone  | Playwright `devices['iPhone 15']` (393×659, DPR 3, iOS Safari UA, mobile + touch) run in **Chromium**; saved at CSS-pixel scale (`scale:'css'`, 393px wide) to keep files small | `<id>--iphone.png`  |

Themes: site **dark only** (the site has no light theme; `colorScheme: dark`); console **light**.

## Site — 46 pages

| group                               | count | pages                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| core                                | 3     | home, pricing, contact                                                                                                                                                                                                                                                                                                      |
| solutions (Solutions menu)          | 8     | web-apps, performance, ai, security, streaming, financial-services, technology, retail                                                                                                                                                                                                                                      |
| products (Products menu)            | 21    | functions, cache, application-accelerator, image-processor, ai-inference, durable-objects, orchestrator, sql-database, object-storage, kv-store, web-application-firewall, bot-manager, network-shield, edge-dns, load-balancer, secure-internet-access, ai-gateway, data-stream, real-time-events, edge-pulse, our-network |
| resources (Resources menu + footer) | 9     | blog (index only), resource-hub, success-cases (index only), partners, marketplace, support, professional-services, learning, recognitions                                                                                                                                                                                  |
| company (footer)                    | 4     | about-us, careers, compliance, scale-up (`/en/lp/azion-scale-up/`)                                                                                                                                                                                                                                                          |
| legal (footer)                      | 1     | privacy-policy (`/en/documentation/agreements/privacy-policy/`)                                                                                                                                                                                                                                                             |

- **404s: none.** All 46 returned 200 without redirects. Links that point into the docs or other hosts are listed under `excluded` in `site-pages.json`:
  - Docs pages, excluded by the brief: Azion Docs, Guides, Dev Tools, Release Notes, and How to start. Three of these redirect inside the docs: `products/guides/` → `guides/`, `products/release-notes/` → `changelog/`, and `products/azion-platform-overview/` → `fundamentals/how-it-works/`.
  - Other hosts: API Reference (api.azion.com), Login/Signup (console), status page, Discord/community, and social links.
  - `for-ai.md`, a raw Markdown file.
- **Legal page.** The footer's only legal link is Privacy Policy. It is rendered by the **documentation app**, with the docs shell captured in dark. It is kept because the brief asks for legal pages. The other agreements are reachable only from its docs sidebar, not from the site header or footer.
- **Capture fixes:**
  - The hide-on-scroll header was pinned to the top before each shot, so it no longer reappears mid-page.
  - Transitions were disabled so reveal animations are complete.
  - The cookie banner was accepted and the HubSpot chat was removed.
  - The first privacy-policy capture was hijacked: the cookie-dismiss matcher clicked an "Acceptable Use Policy" link. The matcher was tightened to buttons only and the page was recaptured.
- Marquees and carousels are frozen mid-scroll.

## Console — 20 screens (design sample)

Source: `origin/design/sample`, `apps/webkit-sample`, built from **`06094cfce`**, the same commit battery 1 used.

- The branch head throws `website-bundle: no "StickyCarousel"…` and renders blank. `git diff 06094cfce <head> -- apps/webkit-sample/src/console` is empty, so the console screens match the head.
- Build steps: a temporary `git worktree add --detach`, then `pnpm install --frozen-lockfile --filter webkit-sample...`, `pnpm icons:build`, and `vite build`.
- The worktree was removed afterwards and nothing was committed. `pnpm install` ran husky's `prepare`, which (re)writes `core.hooksPath=.husky/_` in the shared repo config. That value was already present from earlier installs.
- The built app is kept at `../sample-dist` (served on `localhost:4391` with SPA fallback) for recaptures.
- Console layout uses a nested scroll container, so "full page" means the viewport was grown by the inner overflow. The left sidebar's own overflow makes most desktop shots 1136px tall.
- Data is the sample's `Populated account` mode, except `console-functions-empty`, which uses `localStorage['webkit-sample-mode']='empty'`.

| #   | id                         | route                              | coverage                                |
| --- | -------------------------- | ---------------------------------- | --------------------------------------- |
| 1   | console-overview           | /home                              | dashboard (KPIs + quick links)          |
| 2   | console-home-empty         | /home-empty-state                  | empty account + **AI agent onboarding** |
| 3   | console-functions-empty    | /functions (empty mode)            | empty state                             |
| 4   | console-real-time-metrics  | /real-time-metrics                 | analytics                               |
| 5   | console-real-time-events   | /real-time-events                  | logs/events                             |
| 6   | console-applications-list  | /applications                      | list                                    |
| 7   | console-application-create | /applications/new                  | create wizard                           |
| 8   | console-workload-detail    | /workloads/1020655                 | detail with tabs + topology             |
| 9   | console-function-detail    | /functions/4021884                 | detail with tabs, code editor           |
| 10  | console-firewall-rules     | /firewall/5540117?tab=rules-engine | detail tab, ordered rules               |
| 11  | console-edge-dns-zone      | /edge-dns/6442                     | edit/settings form                      |
| 12  | console-sql-database       | /sql-database/db-store-sessions    | detail with tabs, empty data state      |
| 13  | console-bucket-browser     | /object-storage/azion-assets-prod  | file browser                            |
| 14  | console-account-settings   | /account                           | account settings                        |
| 15  | console-billing            | /account/billing                   | billing + invoices                      |
| 16  | console-users              | /account/users                     | team                                    |
| 17  | console-team-create        | /teams/new                         | permissions matrix form                 |
| 18  | console-marketplace        | /marketplace                       | marketplace                             |
| 19  | console-creation-center    | /create                            | deploy flow (Git import / templates)    |
| 20  | console-deployments        | /deployments                       | deploy history                          |

Substitutions and quirks:

- **AI.** At `06094cfce` the sample has no AI chat or assistant screen; the top-bar "Agent" button has no handler. The AI slot is covered by the home empty state's "Onboard your agent" door, which has Copy prompt and AI-tool logos. The Functions empty state also has a "Set up Azion with your agent" card.
- **SQL Database detail.** It shows the sample's default name `my-new-database` and the "No tables yet" state whatever the id. It is kept as a detail-with-tabs plus empty-data screen.
- **Deploy flow.** The Creation Center is the start of the flow. Its next step (`/deploy`, "Connect a Git provider") is described in text but not captured.
- **Timestamps.** Real-Time Events and the Billing "Last Update" use the capture time.
- **Document title.** Every console page has the static title "Login · Azion WebKit" (sample quirk). The titles in `pages.json` are descriptive.
- **Repeats from battery 1.** Four console screens are the same pages as battery 1: applications-list, application-create, workload-detail, and account-settings. Their hand descriptions are reused, with the iPhone width updated.
