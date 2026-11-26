# Rule: content channels — one component, three ways in

A content component (a diagram, a table, a callout, a card, stats, a quote, logos, code, a chart)
is written once and used in three places. Each place has its own way in, and a content component
is usable through all three unless the Azion UI channel registry records why not.

| Channel | Who writes it                     | Way in                                                                                |
| ------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| `app`   | a developer, in an app or block   | `import FlowDiagram from '@aziontech/ui/flow-diagram'`                                |
| `docs`  | a docs author, in a Markdown page | a tag `DocMarkdown` renders: `<FlowDiagram nodes={[…]} edges={[…]} />`                |
| `site`  | the marketing site's page JSON    | an entry `SitePage` renders: a page section by `_id`, or a scene a band draws by name |

The catalog lists the channels a component is wired for (`channels` on its entry, and the
`channels` legend at the top), so `get_component` tells you which ways in exist before you write.

## Do

- Use the same data shape in every channel. The Markdown attribute values and the page JSON
  props are the component's own props, written as JSON:

  ```mdx
  <FlowDiagram
    aria-label="Request path"
    nodes={[{ "id": "you", "title": "You" }, { "id": "azion", "title": "Azion" }]}
    edges={[{ "from": "you", "to": "azion", "label": "18 ms" }]}
  />
  ```

  ```json
  {
    "_id": "console-showcase-section",
    "props": { "variant": "diagram", "title": "Every request takes the shortest path" },
    "scenes": {
      "scene": {
        "component": "FlowDiagram",
        "props": { "nodes": [{ "id": "you", "title": "You" }], "edges": [] }
      }
    }
  }
  ```

- On the site, place a content component that is not a band itself as a **scene** inside a band
  (`console-showcase-section` `scene`, `hero-section` `top` / `bottom`). Only page sections take an
  `_id`; the band gives the piece its frame, title and spacing.
- In docs, write the tag. A tag takes data attributes only: the composed form with hand-written
  parts is for Vue. The one exception is a root whose parts are data too: a `<Chart>` takes its
  marks as tags inside it, and a `<StatTileGroup>` its `<StatTile />` tags. In page JSON the same
  parts are the scene's `children`:

  ```mdx
  <Chart aria-label="Requests" labels={["14:00", "14:05"]} series={[{ "id": "requests", "name": "Requests", "values": [1460, 1610] }]}>
    <ChartAxis type="x" />
    <ChartLine ids={["requests"]} />
  </Chart>
  ```

  ```json
  {
    "component": "Chart",
    "props": { "labels": ["14:00", "14:05"], "series": [{ "id": "requests", "name": "Requests", "values": [1460, 1610] }] },
    "children": [
      { "component": "ChartAxis", "props": { "type": "x" } },
      { "component": "ChartLine", "props": { "ids": ["requests"] } }
    ]
  }
  ```

- A part's value can be text: in Markdown the text between the part tags, with inline Markdown
  (`<KeyValueListItem label="Region">US East</KeyValueListItem>`); in page JSON a string in
  `children` (`{ "component": "KeyValueListItem", "props": { "label": "Region" }, "children": ["US East"] }`).
- A Markdown pipe table renders as the Azion UI `Table`; write a pipe table, not a tag.
- On the site, place a scene on a band with no texture behind it: `console-showcase-section` with
  `variant: "diagram"` draws its scene on the plain canvas. The texture goes behind text only
  (see `azion-ui-styling`); `SitePage` marks every content scene so a texture beside it hides itself.
- Some components are app-only, and the registry says why (an editor, a live log, a run explorer,
  the data-driven table). Show their content another way: a code fence, a `Chart`, a pipe table.

## Don't

- Don't screenshot a component into a docs page or a site page because it has no tag or entry
  yet. Ask for the channel; it is an Azion UI gap.
- Don't copy a component into a docs or site project to make it render from content. The content
  calls the package's own component.

## Why

The owner's decision RV-F2-1 (2026-11-18): the app, the docs and the site show the same things
(a request path, a pricing table, a quote), and two copies drift. One component with three ways
in keeps one look, one accessibility contract and one place to fix.
