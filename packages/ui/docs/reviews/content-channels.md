# Content channels — which content components are not yet usable from Markdown or page JSON

Review for decisions RV-F2-1, RV-C2-1 and RV-K2-1 (2026-11-18). The rule is `rules/webkit-content-channels.md`: a content
component is usable from Vue (`app`), from a Markdown page (`docs`, a `DocMarkdown` tag) and from
the site's page JSON (`site`, a `SitePage` entry: a page section by `_id` or a scene by name),
unless the registry says why not. The registry is `scripts/lib/content-channels.mjs`; this list is
its `pending` entries (none left). Every component works from Vue today.

`FlowDiagram` is wired in all three (`<FlowDiagram nodes={[…]} edges={[…]} />`, the `FlowDiagram`
scene). The charts are wired in all three since RV-C2-1 (lane C2): `BarList`, `Chart` (its marks
nest as tags and as scene `children`), `DonutChart`, `GaugeChart`, `MapChart`, `SparkChart`,
`StatTile`, `StatTileGroup` (its tiles nest) and `Tracker`. `LogViewer`, `Trace`, `CodeEditor` and
`DataTable` are app-only, with the reason in the registry. Wired already: the `doc-` pieces as their tags (`<Note>`, `<Steps>`, `<CardGroup>`,
`<Card>`, `<Item>`, `<AccordionGroup>`, `<Accordion>`, `<CodeGroup>`, `<Frame>`, `<Prompt>`,
`<Update>`), the scenes `Diagram`, `Illustration` and `ConsoleMockup`, and the marketing pieces
through their page sections.

## Gaps

None. Since RV-K2-1 (lane K2) every content component is wired in all three channels or has the
reason it is not in the registry:

- **Docs tags added:** `<KeyValueList>` (with `<KeyValueListItem>` / `<KeyValueListGroup>`, the value
  is the text between the tags, inline Markdown included), `<Quote>`, `<Stats>`, `<Faq>`,
  `<ThirdPartyLogo>`, `<PricingCard>`, `<IntegrationCard>`, `<PlanFeatureList>`, `<Embed>`,
  `<Illustration>`, `<Diagram>`, `<ConsoleMockup>` and `<NetworkMap>` (each in a framed box, since
  they fill their container), `<Carousel>` (with `<CarouselItem>` slides; `DocMarkdown` adds the
  controls), `<AgentCard>` (DocAgentCard) and `<CallToAction>` (DocCallToAction).
- **Table in docs:** a Markdown pipe table renders as the WebKit `Table` (bordered, lines wrapping,
  column alignment kept), so a docs table looks like an app table. There is no `<Table>` tag: the
  pipe table is the Markdown way to write one. The site keeps `listing-table-section`.
- **Scenes added:** `KeyValueList` (+ `KeyValueListItem`, `KeyValueListGroup`), `Accordion`
  (+ `AccordionItem`, `AccordionTrigger`, `AccordionContent`), `Card`, `CodeBlock`, `Embed`,
  `IntegrationCard`, `PlanFeatureList`. A scene's `children` may now hold plain strings, drawn as
  text in its default slot (a list item's value, an accordion answer, a card body).
- **App-only:** `BrowserFrame` (a resizable viewport around a live Vue page), with `LogViewer`,
  `Trace`, `CodeEditor` and `DataTable` from RV-C2-1.

Every new Page JSON example sets `texture: "none"` on its `console-showcase-section`, so no texture
sits behind the list, card, code or embed (owner rule 2026-11-18: the texture goes behind text only).

## How to wire a new content component

- **Docs:** add the tag to `DOC_MARKDOWN_BLOCK_TAGS`, the loader to `src/assets/content-scenes.ts`
  and the name to `CONTENT_ROOTS` in `doc-markdown.vue` (parts to `CONTENT_PARTS`), add a
  `markdown.vue` example, and set `docs` to the tag name in the registry. The guard fails until the
  three agree.
- **Site:** add the scene to `src/assets/scene-registry.ts` (`contentScene('<Name>')`) or write a
  page section (a whole band), add a `page-entry.vue` + `page-entry.json` example on a band with no
  texture behind the scene, and set `site` in the registry.
- **Parts:** Markdown nests the part tags inside the root tag, and the text between a part's tags is
  its value; page JSON lists the parts as the scene's `children`, text as strings.
