# Documentation

The documentation shell. A reader comes to learn one task and leave, so the shell keeps the page readable and the next page close. It is `DocLayout`, composed once in the app around `RouterView`: the layout owns the docs header, the navigation rail, the "On this page" rail, the search palette and the footer, and the document itself scrolls with the header and both rails sticky. This block's primary is that `App.vue`; every variant is a page body, only its `<article>`, rendered in the layout's default slot. A page feeds the outline by rendering its section headings as anchored `DocHeading`s: each one registers with the layout, so the app passes nothing per page.

## When to use

- Every documentation, guide or reference page, and the docs home.

## When not to use

- Marketing pages: `shell/shell-site`. Product pages: `shell/shell-console`.

## Building blocks

### A. Layout — `DocLayout` (required)

Composed once around the router view: copy the primary as `App.vue` and replace the stand-in guide in its `<slot>` with `<RouterView />`. `navigation` is the docs tree as data (groups of rows with `id`, `label` and `href`; an inline subsection is a row with `children` and `defaultOpen`), `sections` the header's section links, `home` where the Azion ShellDocs mark links, and `outline-groups` the GitHub and Community links under the outline. The outline itself comes from the page: every anchored level 2 or 3 `DocHeading` (and every `DocChangelogEntry`) registers with the layout, in document order. It renders the single main landmark, the rail from `lg` (a drawer below it), the outline from `xl` on pages that have one, and the ⌘K palette of every navigation page. Leave `active-id` empty so the current row follows the route. A site whose products each have their own tree picks `navigation` in `App.vue` from the route (a computed over the path), never in the page.

### B. Header actions — `IconButton` (required)

In the `actions` slot: GitHub, `variant="outline"`, with an `ariaLabel`. In the footer, the small `ghost` social links.

### C. Console — `Button` (required)

`secondary`, last in the `actions` slot.

### D. Theme — `ThemeSwitcher` (required)

In the `navigation-footer` slot, labelled `Theme`; the layout shows it at the foot of the rail and of the drawer.

### E. Call to action — `DocCallToAction` (optional)

In the `aside` slot, under the outline: "Ready to build?" with a primary and a secondary link. It shows only on pages with an outline, so the one shared call to action never lands on the docs home.

### F. Masthead — `DocPageHeader` (required)

The first thing in the article: breadcrumb, title, deck, and on real pages the last-updated date and the meta actions.

### G. Running text — `DocProse` (required)

Everything under the masthead; it sets the running text and gives the headings their type scale.

### H. Section headings — `DocHeading` (required)

One per section, with an `anchor`: an anchored level 2 or 3 heading is an outline entry, named by its own text, so the outline can never list a missing heading. The layout tracks which heading is in view and scrolls a chosen entry under the sticky header. A heading without `anchor` stays out of the outline.

### I. Footer — `Footer` (required)

In the `footer` slot, `variant="content"`, under a top rule: `Footer.Column` with `Footer.Link` items, then the brand, social, status and language slots. The footer lays the bottom bar out as one row (the brand and the social icons at the start, the status and the language at the end) and stacks it below `md`, in CSS.

### J. Brand — `Brand` (required)

In the footer only; the header mark belongs to the layout.

### K. System status — `StatusIndicator` (required)

In the footer's status slot.

### L. Language — `Select` (required)

In the footer's language slot, trigger labelled `Language`.

## Do

- Compose `DocLayout` once in the app's root around `RouterView` (the primary); each route renders only its `<article>`.
- For a real page, start from a variant (Article, Reference, Landing, AgentSetup, AgentGuide): each is a page body built from the `Doc*` parts only, with no layout of its own. `webkit add shell/shell-docs --variant Article` copies the shell and the page side by side; keep the shell as `App.vue` and route to the page.
- Give every section `DocHeading` an `anchor`; the layout lists those headings as the outline.
- Put everything under `DocPageHeader` in one `DocProse`.
- Give every navigation row an `id` and an `href` (an in-app path is followed with the router); keep the rail scoped to the current product; the header section links switch products.
- Build a docs home from the Landing variant: `DocHero` with `CopyPromptButton`, then `DocAgentCard` above the Console / CLI / API cards; its headings carry no `anchor`, so the page shows no outline rail.
- Build an index of peers (agents, SDKs, integrations) from AgentSetup: pick (a `Tabs` filter over a `DocCardGroup`, with `data-doc-block` on `Tabs` inside `DocProse`), compare (a `Table`), understand (glossary `DocCard`s). Give each peer its own page from AgentGuide.
- Render copy authored as Markdown with MDX tags (a content file, a CMS field, a sentence in data) with `DocMarkdown` inside `DocProse`; the headings it renders are `DocHeading`s with slug ids and join the outline on their own. AgentGuide uses it for its step bodies and accordion answers.
- Show a comparison of peers or a list of tools as a `DataTable` (`bordered`, imported from `data-table`) inside an element with `data-doc-block data-doc-chrome`, so the prose rules stay off it; a yes/no cell is a check or minus glyph with a visually hidden `Yes` / `No`, a category cell a `Tag` with `severity="neutral"`.
- Write the deck as the outcome (`By the end of this tutorial, …`), one action per `DocSteps.Step`, with its command as a `CodeBlock` inside the same step.

## Don't

- Don't put a `ScrollArea`, an `h-screen` frame or any inner scroll region around the article: the document scrolls, so find in page, scroll restoration and full-page captures work.
- Don't render a `<main>` in a page; the layout already renders the only one.
- Don't render `DocLayout` in a page, and don't repeat the header, the search, the navigation rail, the outline or the footer there.
- Don't hand-write the outline, the pager or the masthead; the layout's outline rail (fed by the anchored headings), `DocPreviousNext` and `DocPageHeader` own their markup and labels.
- Don't pass page data up to the layout through route meta or props: the page's headings register on their own.
- Don't put a `DocHeading` outside `DocProse` (it renders at body size), and don't drop a `Button` row straight into `DocProse`: wrap it in an element with `data-doc-chrome`.
- Don't measure the viewport in script to place the footer brand; put it in the `brand` slot and the footer places it in CSS.
- Don't reuse the console rail here; docs navigation is pages, not modules.

## Copy

- **Article headings:** verb-led tasks in sentence case: `Create the function`, `Verify the response`.
- **Navigation rows:** page titles exactly as the `h1` reads.
- **Step titles:** imperative, ending with a period when the step is a sentence: `Open Azion Console.`
- **Landing groups:** `Start by interface`, `Start by objective`, `Ready-made templates`, `Follow along`; card link labels are a verb and the object (`Install the CLI`).

## Accessibility

- A comparison table's yes/no glyphs are `aria-hidden` with a visually hidden `Yes` / `No` beside them; the agent name cell is a link with the mark `aria-hidden`.
- One main landmark: the layout's. The article is an `<article>` inside it, never a second `<main>`.
- One `h1` per article (the masthead or the hero); `DocHeading` levels follow it in order (2, then 3 under a 2), and outline entries target those ids.
- Landmarks: the header is a banner, the rail and the outline are labelled navigation regions, the footer is contentinfo; `Tab` runs header → rail → article → outline → footer.
- Choosing an outline entry moves focus to its heading and clears the sticky header.

## States

- Default: the chrome (the app's `App.vue`) around a stand-in guide; rail from `lg` (drawer below), outline from the guide's headings with the GitHub and Community groups and the `DocCallToAction` from `xl`, the full footer under the article. The preview renders every variant inside it.
- Article: a tutorial page body from the `Doc*` parts, pager in both directions, outline with an indented level 3 entry.
- Reference: a product reference page with a callout, the request-path diagram, a JSON rule and a term list; pager forward only.
- AgentSetup: an index page; the picker tabs filter the agent cards, the comparison table scrolls inside its frame on a narrow page, the outline indents its three level 3 entries.
- AgentGuide: one agent's page; steps with code, the tools table, prompts, accordions collapsed by default, pager in both directions.
- Landing: the documentation home page body; navigation rail, no outline rail (unanchored headings), `DocHero` with `CopyPromptButton`, `DocAgentCard`, entry-point grids, pager forward to the first page.

## Related

- `DocLayout` — the component this block shows.
- `shell/shell-console` (`ConsoleLayout`) and `shell/shell-site` (`SiteLayout`) — the console and marketing counterparts.
