# Content channels — which content components are not yet usable from Markdown or page JSON

Review for decision RV-F2-1 (2026-11-18). The rule is `rules/webkit-content-channels.md`: a content
component is usable from Vue (`app`), from a Markdown page (`docs`, a `DocMarkdown` tag) and from
the site's page JSON (`site`, a `SitePage` entry: a page section by `_id` or a scene by name),
unless the registry says why not. The registry is `scripts/lib/content-channels.mjs`; this list is
its `pending` entries. Every component works from Vue today.

`FlowDiagram` is wired in all three (`<FlowDiagram nodes={[…]} edges={[…]} />`, the `FlowDiagram`
scene). The charts are wired in all three since RV-C2-1 (lane C2): `BarList`, `Chart` (its marks
nest as tags and as scene `children`), `DonutChart`, `GaugeChart`, `MapChart`, `SparkChart`,
`StatTile`, `StatTileGroup` (its tiles nest) and `Tracker`. `LogViewer`, `Trace`, `CodeEditor` and
`DataTable` are app-only, with the reason in the registry. Wired already: the `doc-` pieces as their tags (`<Note>`, `<Steps>`, `<CardGroup>`,
`<Card>`, `<Item>`, `<AccordionGroup>`, `<Accordion>`, `<CodeGroup>`, `<Frame>`, `<Prompt>`,
`<Update>`), the scenes `Diagram`, `Illustration` and `ConsoleMockup`, and the marketing pieces
through their page sections.

## Gaps

"site" lists the section or scene that already places the component; **missing** is a gap; "out of
scope" has its reason in the registry (a docs piece on the site, or a marketing piece whose docs
form is a `doc-` piece).

| Component            | Folder    | Docs (Markdown tag) | Site (page JSON)            |
| -------------------- | --------- | ------------------- | --------------------------- |
| `illustration`       | content   | **missing**         | scene Illustration          |
| `console-mockup`     | content   | **missing**         | scene ConsoleMockup         |
| `diagram`            | marketing | **missing**         | scene Diagram               |
| `table`              | data      | **missing**         | listing-table-section       |
| `carousel`           | content   | **missing**         | card-carousel-section       |
| `network-map`        | content   | **missing**         | network-section             |
| `pricing-card`       | content   | **missing**         | pricing-plans-section       |
| `third-party-logo`   | content   | **missing**         | logo-wall-section           |
| `accordion`          | content   | out of scope        | **missing**                 |
| `browser-frame`      | content   | **missing**         | **missing**                 |
| `card`               | content   | out of scope        | **missing**                 |
| `embed`              | content   | **missing**         | **missing**                 |
| `integration-card`   | content   | **missing**         | **missing**                 |
| `key-value-list`     | content   | **missing**         | **missing**                 |
| `plan-feature-list`  | content   | **missing**         | **missing**                 |
| `code-block`         | code      | out of scope        | **missing**                 |
| `doc-agent-card`     | docs      | **missing**         | out of scope                |
| `doc-call-to-action` | docs      | **missing**         | out of scope                |
| `faq`                | marketing | **missing**         | faq-section                 |
| `quote`              | marketing | **missing**         | recognition-marquee-section |
| `stats`              | marketing | **missing**         | stats-section               |

## How to close a gap

- **Docs:** add the tag to `DOC_MARKDOWN_BLOCK_TAGS` and the component to `doc-markdown.vue`'s map
  as a `defineAsyncComponent` import (a data-only component also joins `CHROME_BLOCKS`, so the
  prose styles stay out of it), add a `markdown.vue` example, and move `docs` from `pending` to the
  tag name in the registry. The guard fails until the three agree.
- **Site:** add the component to `src/assets/scene-registry.ts` (a piece a band frames) or write a
  page section (a whole band), add a `page-entry.vue` + `page-entry.json` example, and move `site`
  from `pending` in the registry.
- **Parts that are data:** a root whose parts carry only data (`Chart` and its marks,
  `StatTileGroup` and its tiles) also registers the parts as tags and scenes; Markdown nests the
  part tags inside the root tag, page JSON lists them as the scene's `children`.

## Suggested order

1. `table` and `key-value-list` in Markdown — docs reference pages (limits, pricing, API fields).
   Both are composed parts whose value is a slot (`KeyValueList.Item` holds text or components),
   so a tag needs inline text children inside part tags (`<KeyValueListItem label="Region">US
East</KeyValueListItem>`), which the part renderer does not read yet; a pipe table already covers
   most docs tables. Next lane.
2. `code-block` as a scene, `quote`, `stats` and `faq` as tags — shared between blog posts and docs.
3. The rest of the list above, one by one.
