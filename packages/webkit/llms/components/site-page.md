# Site Page

> The page renderer of the marketing site: it takes a page as data — the page JSON `{ hero, sections }` whose entries are `{ _id, props, scenes?, gap?, submission? }` — and renders each entry with the page section published at `@aziontech/webkit/<_id>`, binding `props` onto it. Openings (`hero`) run full bleed; the column (`sections`) sits in one `Container max-width="site"` with a hatched `Spacer` before each band and one more after the last, the hatched break a page closes on before the footer, as the design sample's `SitePage` lays a page out. A page that ends on a closing band (`closing-call-to-action-section`, `newsletter-section`, or a `template-gallery-section` with `closing: true`) closes on that band's own closing frame instead, so no trailing gap is drawn; two closing bands in a row share one frame (the upper one is bound with `hatch: false`); and a `closing-call-to-action-section` of `variant: 'frame'` takes no gap before it. A scene named in `scenes` is resolved by name through the scene registry and drawn in the section's slot of that name (`hero-section` `top` / `bottom`, `console-showcase-section` `scene`). Every section and scene is loaded on demand, so a page pulls in only the sections it lists. An `_id` or scene name the renderer does not know is skipped with a development warning naming it, never silently. It reverses the earlier rule in `contributing/docs/SECTIONS.md` ("the package ships no registry and no dispatcher"): the owner decided to ship the renderer (ROADMAP M2.10 row 44), and that doc is updated with it. **Section registry.** `src/components/marketing/site-page/site-page-sections.ts`, beside the component, maps every folder in `src/components/section/` except `site-header-section` and `site-footer-section` (the frame, which `shell/shell-site` owns) to a `() => import('../../section/<name>/<name>.vue')` thunk, keyed by the folder name, which is the `_id`. The component test fails when a section folder has no entry. **Retired `_id` aliases.** Page JSON lives outside this repo, so an `_id` retired by a 6.0 merge keeps rendering: `sitePageSectionAliases` in the same file maps each retired id to the section that absorbed it and an optional transform of its props (`'hero-copy-on-top-art'` and `'hero-with-opening'` → `hero-section`; `'closing-call-to-action-agents'` → `closing-call-to-action-section` `variant: 'primary'`; `'closing-call-to-action-templates'` → `template-gallery-section` `closing: true`; `'customer-spotlight'` → `client-story-columns-section` `reveal: 'hover'` (`items` → `cells`, `description` → `story`); `'sticky-carousel'` → `process-scroll-section` `pinned` (`items` → `steps`); `'sticky-scroll-code'` → `feature-scroll-section`; `'compare-support-tiers'` → `plan-comparison-section` (`tiers` → `plans`); `'article-index-blog'` / `'article-index-resource-hub'` → `article-index-section` `filters: 'category-search' | 'facets'`; `'use-case-links'` / `'resource-grid'` → `capability-grid-section`; `'code-split'` → `media-split-section`). `resolveSectionEntry(id, props)` applies it before the section is resolved and before the closing rules read the entry, and no warning is raised; the entry handed back on `submit` is the page's own. Renamed props travel the same way: before any alias transform, `resolveSectionEntry` translates the section's old prop names and values from the 6.0 rename map (`src/cli/migrations/v6-props.json`, copied into `lib/legacy-entries.ts` beside it and kept in step by the component test), for every entry whether its `_id` is retired or current, so `{ _id: 'hero-band', props: { kind: 'centered' } }` renders `hero-section` with `variant: 'center'`; an old name is dropped only when its new name is not already set. Layouts and media removed in 6.0 are translated after the renames: a hero `variant` (or v5 `kind`) `pixel-floor` renders as `title-band`; a closing band's `split` renders as `panel`, with `titleMuted` joined onto `title`; a media stack drops its old `variant` and each band's `diagram`; and a media band (`media-split-section`, or a retired `'code-split'` or `'media-split-band'` entry) with no picture is routed to the section that now shows its media, so code (`codeTabs`) renders as a `feature-scroll-section` with one step per file and a request-flow `diagram` as a `console-showcase-section` with `variant: 'diagram'` and the diagram in its `scene` slot (`resolveSectionEntry` hands back that `scenes` entry, and a scene the page JSON sets for the slot wins); a band that has a picture keeps it and drops the retired media props. This is the only alias the package keeps: no retired export or prop is re-exported. **Scene registry.** `src/assets/scene-registry.ts` exports `sceneAssets` (scene name to a `() => import(...)` thunk), the `SceneName` union of its keys and `resolveScene(name)`, which returns one cached async component per name or `null` for a name it does not hold. It is seeded with `BrandGlobeScene` and `SpinningGlobe` (the two scenes `media-split-section` drew from a private map) and with `Diagram`, `ConsoleMockup` and `Illustration`, the components a scene slot already takes; `FlowDiagram` joined it for decision RV-F2-1, so a band places a diagram from data (`nodes`, `edges`), and the charts joined it for decision RV-C2-1 (`BarList`, `Chart` and its marks `ChartGrid`, `ChartAxis`, `ChartArea`, `ChartBar`, `ChartLine`, `ChartScatter`, `ChartReference`, `ChartCrosshair`, `ChartTooltip`, `ChartLegend`, `DonutChart`, `GaugeChart`, `MapChart`, `SparkChart`, `StatTile`, `StatTileGroup`, `Tracker`), then the content components for decision RV-K2-1 (`KeyValueList` with `KeyValueListItem` and `KeyValueListGroup`, `Accordion` with `AccordionItem`, `AccordionTrigger` and `AccordionContent`, `Card`, `CodeBlock`, `Embed`, `IntegrationCard`, `PlanFeatureList`), and `StatusIndicator` for decision A5P3-L02-1, so a `KeyValueListItem` status child draws the same dot and label as in Vue. A scene may list `children`, scenes or plain strings drawn in its default slot in order, so a `Chart` names its marks, a `StatTileGroup` its tiles and a `KeyValueListItem` its value as text in plain JSON; a mark used outside a `Chart` throws, as it does in Vue. `media-split-section` moves from its private `SCENES` constant onto it in the same change, so the system has one scene map, and a scene ported later (`ConsoleApplicationScene`, `ConsoleTraceScene`, `FunctionsHeroCanvas`) becomes drawable on every page by one entry there. **Root.** A plain `div` with no role, carrying `v-bind="$attrs"` and the `data-testid` fallback `site-page`.

- Import: `import SitePage from '@aziontech/webkit/site-page'`
- Category: marketing · Surface: site · Structure: monolithic
- API as JSON: [site-page.json](site-page.json)

## When to use

- Use SitePage inside SiteLayout to render a page from its JSON.
- Rendering a marketing page stored as data (a CMS entry, a JSON file, the site's page modules) on WebKit sections.
- A campaign landing built from existing sections with no page-specific code.

## Do

- Write `_id` as the section's public subpath (`customer-use-cases-section` for `@aziontech/webkit/customer-use-cases-section`); the `props` object is exactly what the section's own `site-*.json` example carries.
- Put openings (`hero-section`, `hero-form-section`, `article-body-section`, `pricing-plans-section`) in `hero` and every band after them in `sections`.
- Keep scenes as names (`{ component: 'BrandGlobeScene' }`), never as code, so the page stays plain JSON.
- Use `gap` only to change the default break: `none` for a band that follows its neighbour with no break, `small` for two bands that belong together.
- End a page on a closing band, or on `{ _id: 'closing-call-to-action-section', props: { variant: 'frame' } }` when its last band already carries its actions; never set `hatch` yourself on stacked closings, the renderer does.
- Keep transport details of a form (`endpoint`, `hiddenFields`) in `submission`, next to `props`; the renderer passes the entry back on `submit` and the site sends.
- Watch the development console after changing a page: an unknown `_id` or scene is named there.
- Keep one opening per page: every opening renders the page `h1`, so two openings put two `h1` on the page.
- Render the page on the server when layout shift matters: a section still loading on the client reserves no space.

## Don’t

- A page that composes marketing primitives by hand (`Hero`, `MediaSplit`, `CardGrid`) — write the SFC with `Container` / `Spacer` instead.
- A console screen or a docs page — use `shell/shell-console` or `shell/shell-docs`.
- One section on its own — import that section (`@aziontech/webkit/<name>`) and bind its props.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [container](container.md) — the column the renderer lays `sections` in.
- [spacer](spacer.md) — the hatched break it draws before each band.
- The page sections (`hero-section`, `customer-use-cases-section`, `faq-section`, …) — what each `_id` names.
- `shell/shell-site` — the nav and footer frame a page renders inside.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `hero` | `SitePageSection[]` | `() => []` | false | Opening sections, rendered full bleed above the column in order; each is `{ _id, props?, scenes?, gap?, submission? }`. |
| `sections` | `SitePageSection[]` | `() => []` | false | Column sections, rendered in order inside the site column with a hatched gap before each and after the last; each is `{ _id, props?, scenes?, gap?, submission? }`. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: SubmitEvent, payload: SitePageSubmit)` | A section's form passed its own validation (`hero-form-section`, `newsletter-section`); the site sends it and feeds `loading` / `submitted` / `error` back through that entry's `props`. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.
- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Marquee` prints it as a typographic wordmark, the quote components show no mark.

## States

- No state of its own; each section owns its states (`loading`, `submitted`, `error` on a form band come from its `props`).
- An unknown `_id` or scene name renders nothing in its place and warns once per name in development.
- A retired `_id` renders with its successor through `sitePageSectionAliases`, with the props transform applied.
- An old prop name or value of a section (`kind: 'centered'` on a hero) renders as its 6.0 successor (`variant: 'center'`).
- Closing bands: a closing band followed directly by another is bound with `hatch: false` (an explicit `hatch` in its `props` is overridden), so stacked closings share the lower band's closing frame; a `closing-call-to-action-section` with `variant: 'frame'` takes no gap before it; when the last column entry is a closing band that draws its frame, the trailing gap is omitted.
- A section or scene still loading renders nothing in its place until its chunk arrives.
- A section or scene whose chunk fails to load (network failure, deploy skew) or takes longer than 10 s renders nothing in its place, the rest of the page keeps rendering, and a development warning names the `_id` or scene; it does not retry (`defineAsyncComponent` with `timeout` and `onError`).

- A scene that is not a backdrop scene (`backdropScenes` in `src/assets/scene-registry.ts`: the console mock-up and console scenes, the globes, `Illustration`, `Diagram`) is stamped `data-plain-ground` on its root, so a band texture beside it hides itself; page JSON never puts content other than text on a texture (RV-T2-1).

## Accessibility

- The renderer adds no landmark, heading or focusable element of its own; each section owns its landmark (`<section>` named by its title) and its keyboard model.
- Openings render before the column, so the page `h1` (in the opening) comes first in reading order.
- The breaks are decorative (`Spacer` is `aria-hidden`).
- Keyboard map: none of its own; focus moves through the sections in page order.

## Right-to-left

- Layout: block flow only; the column and the sections use logical utilities.
- Icons: none of its own.
- Keyboard: none of its own.
- User data: none of its own; sections isolate their own user data.

## Internationalization

- Built-in strings: none. Every visible string comes from the page data.
- Development warnings are English and never rendered.

## Responsive

- Container queries: none of its own; the column follows `Container` and each section its own breakpoints.
- Narrow (≤ 640 px): the column runs edge to edge as `Container` does; sections stack themselves.
- Touch: no targets of its own.
- Reflow: no horizontal scroll at 320 px from the renderer; the sections hold the same contract.

## Examples

### Default

```vue
<script setup lang="ts">
  import SitePage, { type SitePageSection } from '@aziontech/webkit/site-page'

  const hero: SitePageSection[] = [
    {
      _id: 'hero-section',
      props: {
        variant: 'title-band',
        size: 'large',
        eyebrow: 'SQL Database',
        title: 'Relational data, next to every user',
        description:
          'Query a distributed SQL database from your functions, with reads served from the nearest location.',
        primaryAction: { label: 'Start for free', href: '/signup' },
        secondaryAction: { label: 'Docs', href: '/docs', trailing: true }
      }
    }
  ]

  const sections: SitePageSection[] = [
    {
      _id: 'customer-use-cases-section',
      props: {
        title: 'What teams use SQL Database for',
        description: 'Four ways teams put vector search and SQL to work.',
        primaryAction: { label: 'Docs', href: '/docs', trailing: true },
        items: [
          {
            icon: 'az az-comments',
            title: 'RAG applications',
            description: 'Build topic-specific chatbots on data stored in SQL Database.'
          },
          {
            icon: 'az az-search',
            title: 'Search applications',
            description: 'Power search with vector similarity queries on stored embeddings.'
          },
          {
            icon: 'az az-sync',
            title: 'AI context injection',
            description: 'Give AI applications relevant context from vector embeddings.'
          },
          {
            icon: 'az az-globe',
            title: 'AI workflows',
            description: 'Pair stored embeddings with AI Inference to run RAG on Azion.'
          }
        ]
      }
    },
    {
      _id: 'faq-section',
      props: {
        anchor: 'faq',
        title: 'Frequently asked questions',
        items: [
          {
            question: 'Which SQL dialect does it speak?',
            answer: 'SQLite-compatible SQL, so existing queries and tools work unchanged.'
          },
          {
            question: 'Where are reads served from?',
            answer: 'From the replica closest to the request; writes go to the primary.'
          }
        ]
      }
    },
    {
      _id: 'closing-call-to-action-section',
      props: {
        variant: 'primary',
        anchor: 'contact',
        title: 'Build, run, and protect applications everywhere.',
        description: 'Get faster launches, lower latency, and less infrastructure overhead.',
        primaryAction: { label: 'Start for free', href: '/signup' },
        secondaryAction: { label: 'Docs', href: '/docs', trailing: true }
      }
    }
  ]
</script>

<template>
  <SitePage
    :hero="hero"
    :sections="sections"
  />
</template>
```

### Closings

```vue
<script setup lang="ts">
  import SitePage, { type SitePageSection } from '@aziontech/webkit/site-page'

  const sections: SitePageSection[] = [
    {
      _id: 'faq-section',
      props: {
        anchor: 'faq',
        title: 'Frequently asked questions',
        items: [
          {
            question: 'Can I start without a credit card?',
            answer: 'Yes. The free plan needs only an email address.'
          }
        ]
      }
    },
    {
      _id: 'closing-call-to-action-section',
      props: {
        variant: 'panel',
        title: 'Ready to join us?',
        description: 'See our open positions and find the right fit.',
        primaryAction: { label: 'See open roles', href: '/careers/jobs', trailing: true }
      }
    },
    {
      _id: 'closing-call-to-action-section',
      props: {
        variant: 'primary',
        anchor: 'contact',
        title: 'Build, run, and protect applications everywhere.',
        description: 'Get faster launches, lower latency, and less infrastructure overhead.',
        primaryAction: { label: 'Start for free', href: '/signup' },
        secondaryAction: { label: 'Docs', href: '/docs', trailing: true }
      }
    }
  ]

  const legal: SitePageSection[] = [
    {
      _id: 'faq-section',
      props: {
        title: 'Privacy questions',
        items: [
          {
            question: 'Where is my data stored?',
            answer: 'In the regions you choose for each workload.'
          }
        ]
      }
    },
    { _id: 'closing-call-to-action-section', props: { variant: 'frame' } }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <SitePage :sections="sections" />
    <SitePage :sections="legal" />
  </div>
</template>
```
