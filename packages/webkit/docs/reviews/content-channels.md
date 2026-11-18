# Content channels — which content components are not yet usable from Markdown or page JSON

Review for decision RV-F2-1 (2026-11-18). The rule is `rules/webkit-content-channels.md`: a content
component is usable from Vue (`app`), from a Markdown page (`docs`, a `DocMarkdown` tag) and from
the site's page JSON (`site`, a `SitePage` entry: a page section by `_id` or a scene by name),
unless the registry says why not. The registry is `scripts/lib/content-channels.mjs`; this list is
its `pending` entries. Every component works from Vue today.

`FlowDiagram` is wired in all three (`<FlowDiagram nodes={[…]} edges={[…]} />`, the `FlowDiagram`
scene). Wired already: the `doc-` pieces as their tags (`<Note>`, `<Steps>`, `<CardGroup>`,
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
| `data-table`         | data      | **missing**         | **missing**                 |
| `bar-list`           | chart     | **missing**         | **missing**                 |
| `chart`              | chart     | **missing**         | **missing**                 |
| `donut-chart`        | chart     | **missing**         | **missing**                 |
| `gauge-chart`        | chart     | **missing**         | **missing**                 |
| `map-chart`          | chart     | **missing**         | **missing**                 |
| `spark-chart`        | chart     | **missing**         | **missing**                 |
| `stat-tile`          | chart     | **missing**         | **missing**                 |
| `stat-tile-group`    | chart     | **missing**         | **missing**                 |
| `tracker`            | chart     | **missing**         | **missing**                 |
| `code-block`         | code      | out of scope        | **missing**                 |
| `code-editor`        | code      | **missing**         | **missing**                 |
| `log-viewer`         | code      | **missing**         | **missing**                 |
| `trace`              | code      | **missing**         | **missing**                 |
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

## Suggested order

1. Charts (`chart`, `bar-list`, `donut-chart`, `stat-tile`, `stat-tile-group`) — data-only props, so
   a tag and a scene each are one line plus an example; product pages and docs both show figures.
2. `table` and `key-value-list` in Markdown — docs reference pages (limits, pricing, API fields).
3. `code-block` as a scene, `quote`, `stats` and `faq` as tags — shared between blog posts and docs.
4. The app-only viewers (`log-viewer`, `trace`, `code-editor`, `data-table`, `tracker`) — decide per
   component whether docs or site need them; if not, mark them out of scope with the reason.
