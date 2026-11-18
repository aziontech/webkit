# Rule: content channels — one component, three ways in

A content component (a diagram, a table, a callout, a card, stats, a quote, logos, code, a chart)
is written once and used in three places. Each place has its own way in, and a content component
is usable through all three unless the WebKit channel registry records why not.

| Channel | Who writes it                     | Way in                                                                                |
| ------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| `app`   | a developer, in an app or block   | `import FlowDiagram from '@aziontech/webkit/flow-diagram'`                            |
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
  parts is for Vue.

## Don't

- Don't screenshot a component into a docs page or a site page because it has no tag or entry
  yet. Ask for the channel; it is a WebKit gap.
- Don't copy a component into a docs or site project to make it render from content. The content
  calls the package's own component.

## Why

The owner's decision RV-F2-1 (2026-11-18): the app, the docs and the site show the same things
(a request path, a pricing table, a quote), and two copies drift. One component with three ways
in keeps one look, one accessibility contract and one place to fix.
