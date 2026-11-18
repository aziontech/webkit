# Doc Markdown

> Renders a documentation page written in Markdown with Mintlify-style MDX component tags into the documentation components. Prose becomes plain semantic HTML (headings, paragraphs, lists, block quotes, rules, tables, inline code, links, bold, italic) that the surrounding `DocProse` styles, and the component tags (`<Note>`, `<Steps>`, `<CardGroup>`, `<Tabs>`, `<CodeGroup>`, `<Update>`, `<Tooltip>` …) mount `DocCallout`, `DocSteps`, `DocCardGroup`, `DocTabs`, `DocCodeGroup`, `DocChangelogEntry`, `HoverCard` and the rest. Headings render as `DocHeading` with unique slug ids, and the named export `parseDocMarkdown` returns the same headings (for a standalone `DocTableOfContents`; inside `DocLayout` the rendered `DocHeading`s fill the outline on their own) and the frontmatter (for `DocPageHeader`). It is a small in-house reader of a fixed MDX subset, not an MDX compiler: no JSX expressions, no imports, no script, and no `v-html`, so a page's source can never run code.

- Import: `import DocMarkdown from '@aziontech/webkit/doc-markdown'`
- Category: docs · Surface: docs · Structure: monolithic
- API as JSON: [doc-markdown.json](doc-markdown.json)

## When to use

- Use DocMarkdown for a whole documentation page written in MDX; model Markdown that arrives while it renders uses StreamingResponse.
- A docs page whose content is authored as `.mdx` / Markdown text (a content folder, a CMS field, a string in data) instead of hand-composed Doc components.
- Copy held in data that carries inline markup (a sentence with code and a link in a block's fixture) and should render the same as a page paragraph.

## Do

- Wrap it in `DocProse`; inside `DocLayout` the headings it renders register with the layout's outline, so the page passes nothing. Read the frontmatter (and, for a standalone `DocTableOfContents`, the headings) from the same source: `const { headings, frontmatter } = parseDocMarkdown(source)`.
- Write one component tag per line block; a one-line callout (`<Note>Copy.</Note>`) is fine. Attribute values are strings, numbers, booleans or a string list (`tags={["API", "CLI"]}`); anything else stays literal text.
- Repeated headings are fine: the second `Test it` gets the id `test-it-2`, so anchors and the outline stay unique.
- Use `components` to swap the component a tag mounts (your own `Card`) or to add a block tag your docs use; never fork the parser.
- Write in-app links as root-relative paths (`/docs/domains`): they follow the app's router. `javascript:`, protocol-relative and other unsafe URLs render as their link text.

## Don’t

- A page composed by hand from `DocHeading`, `DocCallout`, `DocSteps` … → compose them directly inside `DocProse`; there is nothing to parse.
- Chat or AI responses streamed as Markdown → `StreamingResponse` / `ChatMessage`.
- Arbitrary MDX with JSX expressions, imports or custom script → compile it with an MDX toolchain in the app; this component reads a fixed subset only.
- Code with no prose around it → `CodeBlock` or `DocCodeGroup`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `DocProse` — wrap this component in it; it owns the type scale, the block rhythm and the copyable inline code chips.
- `DocHeading` — every Markdown heading renders as one, with the slug id the outline points at.
- `DocLayout` — its outline lists the rendered `DocHeading`s with no wiring. `DocTableOfContents` — takes `parseDocMarkdown(source).headings` as `items` when used without the layout.
- `DocPageHeader` — takes the frontmatter's `title` and `description`.
- `DocCallout`, `DocSteps`, `DocStep`, `DocCardGroup`, `DocCard`, `DocItem`, `DocAccordionGroup`, `DocAccordion`, `DocTabs`, `DocTab`, `DocCodeGroup`, `DocFrame`, `DocPrompt`, `DocChangelogEntry` — what the tags mount.
- `HoverCard` — an inline `<Tooltip tip title linkLabel href>` tag renders as a HoverCard: the term is a dotted-underlined button, the card shows the title, the definition and an optional link.
- `RegistrationFrame`, `ItemList` — the frame and list an `<ItemGroup>` renders its `<Item>` rows in.
- `StreamingResponse` — renders chat Markdown with the AI layer's reader; this component reuses that reader's inline tokenizer and `safeHref` and adds the MDX block tags, document heading levels and anchors a docs page needs, which a chat bubble must not have.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `source` | `string` | `''` | false | The page source: optional frontmatter, then Markdown with MDX component tags. |
| `components` | `Record<string, Component>` | `{}` | false | Replaces the component a block tag mounts, or adds a block tag, keyed by tag name (`Card`, `Note`). The tag's attributes become props. |

## States

- Visual states: `default` only; the component renders what the source holds.
- Lazy tags: a code group, tabs, an accordion, a frame, an item row or a prompt renders once its async chunk loads (in place on the server and on hydration).
- Empty: an empty `source` renders the empty root (no placeholder; the page owns its empty state).
- Unknown or malformed input: an unknown capitalized tag, an unclosed tag or an unsupported attribute expression stays literal text rather than disappearing; an unclosed tag runs to the end of the source.
- Links: a root-relative `href` is followed with the app's router (`useAppNavigation`); an `http(s)` link opens in a new tab with `rel="noreferrer"` and an announced suffix; a URL that is not `http(s)`, `mailto`, root-relative or a `#fragment` renders as plain text (the shared `safeHref` of the AI layer's Markdown reader).
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid` (static content).

## Accessibility

- Semantics: headings are real `h1`–`h4` (`DocHeading`) in source order with unique ids; lists are `ul` / `ol`; a table is a real `table` with `th scope="col"` header cells, wrapped in a horizontally scrollable region; a rule is `hr`; a quote is `blockquote`.
- Keyboard map: no keyboard handling of its own; links, heading anchors, tabs, accordions and code copy buttons are the mounted components' and follow their maps.
- Links: an external link announces `(opens in a new tab)` through a visually hidden suffix; link text is the author's.
- Visible focus: owned by `DocProse` (links) and the mounted components.
- Contrast: table header text `var(--text-muted)` and body text `var(--text-default)` on `var(--bg-surface)` meet 4.5:1 in both themes; no disabled state.
- Pattern: native document semantics; no WAI-ARIA APG widget of its own.
- Inside a callout, an item row or a prompt, paragraphs render as block spans so no `p` nests inside the component's own paragraph.

## Right-to-left

- Layout: logical utilities only (`text-start` on table cells, logical list padding from `DocProse`); a column aligned with `:---:` / `---:` keeps the author's `center` / `end` alignment, with `right` mapped to `end`.
- Icons: none of its own; the mounted components mirror their glyphs.
- Keyboard: none of its own.
- User data: the source text renders as is; code renders inside `DocCodeGroup`, which isolates its direction.

## Internationalization

| Key             | English source         | Override prop |
| --------------- | ---------------------- | ------------- |
| `common.newTab` | `(opens in a new tab)` | —             |

- Formatting: none. All visible text is the source's; code sample labels fall back to `DocCodeGroup`'s language names.

## Responsive

- Container queries: none of its own; `DocCardGroup`, `DocChangelogEntry` and the other mounted components respond to their containers.
- Narrow (≤ 640 px): a wide table scrolls inside its own region instead of the page; everything else reflows with `DocProse`.
- Touch: targets are the mounted components'; inline links follow `DocProse`.
- Reflow: no horizontal page scroll at 320 px and 200 % zoom; the exception is a wide table, which scrolls inside its region (WCAG 1.4.10 data-table exception).

## Examples

### Default

````vue
<script setup lang="ts">
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '---',
    'title: First deploy',
    'description: Deploy a template and see it served from the edge.',
    '---',
    '',
    '## Before you start',
    '',
    'You need an Acme account. Log in with `acme login`, then read the [CLI reference](https://example.com/docs/cli).',
    '',
    '- A project folder with a `package.json`',
    '- Node.js 22 or later',
    '',
    '<Note>A first deploy takes about a minute.</Note>',
    '',
    '## Deploy with the CLI',
    '',
    '<Steps>',
    '  <Step title="Install the CLI">',
    '    <CodeGroup>',
    '    ```bash npm',
    '    npm install -g acme-cli',
    '    ```',
    '    ```bash pnpm',
    '    pnpm add -g acme-cli',
    '    ```',
    '    </CodeGroup>',
    '  </Step>',
    '  <Step title="Deploy">Run `acme deploy` from the project folder.</Step>',
    '</Steps>',
    '',
    '## Limits',
    '',
    '| Plan | Builds per day |',
    '| :--- | ---: |',
    '| Free | 100 |',
    '| Pro | 1,000 |',
    '',
    '## Next steps',
    '',
    '<CardGroup cols={2}>',
    '  <Card title="Domains" icon="az az-globe" href="/docs/domains">Point your own domain at the deploy.</Card>',
    '  <Card title="Cache" icon="az az-bolt" href="/docs/cache">Cache static assets at the edge.</Card>',
    '</CardGroup>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
````

### Components

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import DocMarkdown, { parseDocMarkdown } from '@aziontech/webkit/doc-markdown'
  import DocTableOfContents from '@aziontech/webkit/doc-table-of-contents'
  import DocProse from '@aziontech/webkit/doc-prose'

  const components = { Alert }

  const source = [
    '## Maintenance',
    '',
    '<Alert severity="warning" label="Deploys pause on March 9, 2026, from 02:00 to 03:00 UTC." />',
    '',
    'Requests keep being served during the window; only new deploys wait.',
    '',
    '## Changelog',
    '',
    '<Update label="March 2, 2026" description="v2.4.0" tags={["CLI"]}>Deploys start 30% faster.</Update>'
  ].join('\n')

  const { headings } = parseDocMarkdown(source, components)
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-lg) md:flex-row">
    <DocProse class="min-w-0 flex-1">
      <DocMarkdown
        :source="source"
        :components="components"
      />
    </DocProse>
    <div class="md:w-(--container-3xs)">
      <DocTableOfContents :items="headings" />
    </div>
  </div>
</template>
```
