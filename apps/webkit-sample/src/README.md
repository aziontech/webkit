# `src/` — how this app is arranged

Three products live in this sample, and they are the three top-level folders. A fourth
folder holds what more than one of them needs.

```
src/
  main.js  App.vue  style.css     the composition root
  router/                         one route module per area, assembled in index.js
  site/                           azion.com — the landing pages and the docs site
  hub/                            the Webkit Hub — the design-system reference
  console/                        the product console — every signed-in screen
  shared/                         what two or more of the three need
```

## The one rule

> **`site`, `hub` and `console` never import each other.** Anything two of them need
> moves to `shared`, which imports none of them.

That rule is visible in the import line itself, because a path that leaves its area has
to name the area it is going to:

| Import                                    | Meaning                                           |
| ----------------------------------------- | ------------------------------------------------- |
| `./FieldRow.vue`, `../lib/data/functions` | inside my own area — relative                     |
| `@shared/ui/layout`                       | reaching into the shared kit — fine from anywhere |
| `@console/...` inside `src/site`          | **a bug.** Grep for it.                           |

Aliases are declared once, in [`vite.config.js`](../vite.config.js), and mirrored in
[`jsconfig.json`](../jsconfig.json) so the editor resolves them too.

## The layers, inside each area

Every area keeps the same layers; only their contents differ.

| Layer                              | Holds                                               |
| ---------------------------------- | --------------------------------------------------- |
| `views/` (`pages/` in the console) | the routed screens, one folder per module           |
| `components/`                      | that area's own components, grouped by concern      |
| `lib/`                             | that area's logic and fixture data                  |
| `composables/`, `data/`            | where an area has enough of them to earn the folder |

### `console/`

```
console/
  pages/       home · auth · applications · workloads · deployments · build · secure ·
               observe · edge-dns · storage · sql · marketplace · account · resources ·
               forms · lab
               (a module's sub-views live beside it, in `panels/`)
  components/  shell · page · list · form · auth · onboarding · home · billing ·
               deployment · workload · observability · function · marketplace · sql ·
               diagrams · monaco-editor
  lib/
    state/     module-level singletons that outlive the route (session, tenancy, theme
               preferences, the sample's own mode/preset switches)
    data/      the pretend account — resources, plans, teams, templates, empty states
    behavior/  interaction helpers (entrance motion, height animation, drag reorder,
               dirty-tab tracking, filter state)
    format/    pure formatters and parsers (dates, dotenv, zone files, postgres types)
```

### `site/`

```
site/
  views/       LandingAzion · LandingFunctions
  components/  the page bands (hero, capabilities, client stories, CTA) + SiteLayout/Nav
  ui/          the site's own UI kit, re-exporting the shared brand parts (see ui/index.js)
  composables/
  docs/        the documentation site, with its own views / components / lib
```

### `hub/`

```
hub/
  views/       WebkitHub — the shell that swaps one view per sidebar section
  components/  HubSidebar, the section views, the component grid
    foundations/  the token previews (color, type, spacing, icons)
  lib/  data/  composables/
```

### `shared/`

```
shared/
  lib/         cross-area logic and fixtures (theme, dates, applications, workloads,
               deploys, provisioning, people)
  ui/
    layout/    the framed-grid page kit — see .claude/docs/CONTAINERS.md
    banners/   hero backdrops, chosen by name through BannerContainer
    brand/     brand and client marks, claim pills, the carousel
    illustration/  the platform artwork the Site and the Hub both show
    deployment/    the deploy log view the console and the Site demo both render
```

## Adding something

1. **A console screen** — a `.vue` in `console/pages/<module>/`, a line in
   `router/console.routes.js`. Nothing else.
2. **A component used by one area** — put it in that area's `components/<concern>/`.
3. **A component a second area starts needing** — move it to `shared/ui/`, then fix the
   import in both. Do not import across areas instead; that is the one thing this layout
   exists to prevent.
