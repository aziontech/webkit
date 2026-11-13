# Site Page

> The page renderer of the marketing site: it takes a page as data — the page JSON `{ hero, sections }` whose entries are `{ _id, props, scenes?, gap?, submission? }` — and renders each entry with the page section published at `@aziontech/webkit/<_id>`, binding `props` onto it. Openings (`hero`) run full bleed; the column (`sections`) sits in one `SectionContainer max-width="site"` with a hatched `SectionGap` before each band and one more after the last, the hatched break a page closes on before the footer (in the design sample that break is drawn by the closing call to action of every page), as the design sample's `SitePage` lays a page out. A scene named in `scenes` is resolved by name through the scene registry and drawn in the section's slot of that name (`hero-band` `top` / `bottom`, `console-panel` `scene`). Every section and scene is loaded on demand, so a page pulls in only the sections it lists. An `_id` or scene name the renderer does not know is skipped with a development warning naming it, never silently. It reverses the earlier rule in `.claude/docs/SECTIONS.md` ("the package ships no registry and no dispatcher"): the owner decided to ship the renderer (ROADMAP M2.10 row 44), and that doc is updated with it. **Section registry.** `src/components/marketing/site-page/site-page-sections.ts`, beside the component, maps every folder in `src/components/sections/` except `site-nav` and `site-footer` (the frame, which `shells/website` owns) to a `() => import('../../sections/<name>/<name>.vue')` thunk, keyed by the folder name, which is the `_id`. The component test fails when a section folder has no entry. **Scene registry.** `src/assets/scene-registry.ts` exports `sceneAssets` (scene name to a `() => import(...)` thunk), the `SceneName` union of its keys and `resolveScene(name)`, which returns one cached async component per name or `null` for a name it does not hold. It is seeded with `BrandGlobeScene` and `SpinningGlobe` (the two scenes `media-split-band` drew from a private map) and with `Diagram`, `ProductWidget` and `Illustration`, the components a scene slot already takes. `media-split-band` moves from its private `SCENES` constant onto it in the same change, so the system has one scene map, and a scene ported later (`ConsoleApplicationScene`, `ConsoleTraceScene`, `FunctionsHeroCanvas`) becomes drawable on every page by one entry there. **Root.** A plain `div` with no role, carrying `v-bind="$attrs"` and the `data-testid` fallback `marketing-site-page`.

- Import: `import SitePage from '@aziontech/webkit/site-page'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [site-page.json](https://github.com/aziontech/webkit/blob/main/.specs/site-page.json)

## When to use

- Rendering a marketing page stored as data (a CMS entry, a JSON file, the site's page modules) on WebKit sections.
- A campaign landing built from existing sections with no page-specific code.

## Do

- Write `_id` as the section's public subpath (`use-cases` for `@aziontech/webkit/use-cases`); the `props` object is exactly what the section's own `site-*.json` example carries.
- Put openings (`hero-band`, `hero-form`, `hero-with-opening`, `hero-copy-on-top-art`, `article-body`, `pricing-plans`) in `hero` and every band after them in `sections`.
- Keep scenes as names (`{ component: 'BrandGlobeScene' }`), never as code, so the page stays plain JSON.
- Use `gap` only to change the default break: `none` for a band that follows its neighbour with no break, `small` for two bands that belong together.
- Keep transport details of a form (`endpoint`, `hiddenFields`) in `submission`, next to `props`; the renderer passes the entry back on `submit` and the site sends.
- Watch the development console after changing a page: an unknown `_id` or scene is named there.
- Keep one opening per page: every opening renders the page `h1`, so two openings put two `h1` on the page.
- Render the page on the server when layout shift matters: a section still loading on the client reserves no space.

## Don’t

- A page that composes marketing primitives by hand (`Hero`, `MediaSplit`, `CardGrid`) — write the SFC with `SectionContainer` / `SectionGap` instead.
- A console screen or a docs page — use `shells/console` or `shells/documentation`.
- One section on its own — import that section (`@aziontech/webkit/<name>`) and bind its props.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-container](section-container.md) — the column the renderer lays `sections` in.
- [section-gap](section-gap.md) — the hatched break it draws before each band.
- The page sections (`hero-band`, `use-cases`, `faq-section`, …) — what each `_id` names.
- shells/website` — the nav and footer frame a page renders inside.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `hero` | `SitePageSection[]` | `() => []` | false | Opening sections, rendered full bleed above the column in order; each is `{ _id, props?, scenes?, gap?, submission? }`. |
| `sections` | `SitePageSection[]` | `() => []` | false | Column sections, rendered in order inside the site column with a hatched gap before each and after the last; each is `{ _id, props?, scenes?, gap?, submission? }`. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: SubmitEvent, payload: SitePageSubmit)` | A section's form passed its own validation (`hero-form`, `closing-call-to-action-newsletter`); the site sends it and feeds `loading` / `submitted` / `error` back through that entry's `props`. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.
- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.

## States

- No state of its own; each section owns its states (`loading`, `submitted`, `error` on a form band come from its `props`).
- An unknown `_id` or scene name renders nothing in its place and warns once per name in development.
- A section or scene still loading renders nothing in its place until its chunk arrives.
- A section or scene whose chunk fails to load (network failure, deploy skew) or takes longer than 10 s renders nothing in its place, the rest of the page keeps rendering, and a development warning names the `_id` or scene; it does not retry (`defineAsyncComponent` with `timeout` and `onError`).

## Accessibility

- The renderer adds no landmark, heading or focusable element of its own; each section owns its landmark (`<section>` named by its title) and its keyboard model.
- Openings render before the column, so the page `h1` (in the opening) comes first in reading order.
- The breaks are decorative (`SectionGap` is `aria-hidden`).
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

- Container queries: none of its own; the column follows `SectionContainer` and each section its own breakpoints.
- Narrow (≤ 640 px): the column runs edge to edge as `SectionContainer` does; sections stack themselves.
- Touch: no targets of its own.
- Reflow: no horizontal scroll at 320 px from the renderer; the sections hold the same contract.

## Examples

### Default

```vue
<script setup lang="ts">
  import SitePage, { type SitePageSection } from '@aziontech/webkit/site-page'

  const hero: SitePageSection[] = [
    {
      _id: 'hero-band',
      props: {
        kind: 'title-band',
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
      _id: 'use-cases',
      props: {
        eyebrow: 'SQL Database',
        title: 'What teams use SQL Database for',
        description: 'Teams use it to:',
        primaryAction: { label: 'Docs', href: '/docs', trailing: true },
        items: [
          {
            icon: 'pi pi-comments',
            title: 'RAG applications',
            description: 'Build topic-specific chatbots on data stored in SQL Database.'
          },
          {
            icon: 'pi pi-search',
            title: 'Search applications',
            description: 'Power search with vector similarity queries on stored embeddings.'
          },
          {
            icon: 'pi pi-sync',
            title: 'AI context injection',
            description: 'Give AI applications relevant context from vector embeddings.'
          },
          {
            icon: 'pi pi-globe',
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
      _id: 'closing-call-to-action',
      props: {
        kind: 'primary',
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
