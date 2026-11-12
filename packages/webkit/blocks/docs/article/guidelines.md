# Docs article

One page of the documentation, from the bar to the footer. A reader lands here from search, from the console or from an agent, in the middle of a task. They need to know where they are (the breadcrumb and the rail), what the page gives them (the title and the deck), the shortest path through it (a chooser, steps and commands they can copy) and where to go next. The tutorial and the reference page share the chrome and the masthead; only the column's content changes.

## When to use

- A tutorial, a how-to guide or a getting-started page with steps and commands.
- A product or tool reference page (overview, request path, rule structure, limits).
- Any page that lives inside `shells/documentation` and reads top to bottom.

## When not to use

- The documentation home, with its grids of entry points and no reading order: use `docs/landing`.
- A changelog: compose `DocUpdate` entries in the same shell.
- Marketing pages: use `shells/website` and the page sections.
- Help inside the product: use `HelpPanel` or `TutorialPanel`, never a full docs page.

## Building blocks

### A. Docs bar — `GlobalHeader`, `Brand`, `NavigationMenu`, `IconButton`, `SearchTrigger`, `Button`

The bar of `headers/docs-header`, with Search as a `SearchTrigger` (`collapsible`, label `Search docs`) inside an `@container`, so it is the ⌘K field when the bar is wide and the magnifier when it is narrow. GitHub is an outlined `IconButton`; Console is the secondary `Button`, last.

### B. Product rail — `Sidebar`, `MenuRoot`, `MenuGroup`, `MenuItem`, `MenuSub`, `MenuSubContent`, `MenuSubTrigger`, `ThemeSwitcher`

From `lg`. One `MenuGroup` named after the product or section. The current page's section is a `MenuSub` opened by default (`kind="inline"`), and the current page is the `selected` `MenuItem`. The `ThemeSwitcher` sits in the rail footer.

### C. Reading column — `ScrollArea`, `DocPageHeader`, `DocProse`, `DocHeading`

The column scrolls inside its own `ScrollArea` with the `layout-column-content` measure. `DocPageHeader` opens it: the breadcrumb, the `h1`, one sentence of deck, `last-updated` and the meta actions (Copy as Markdown, View as Markdown, Agent setup). Everything under the masthead sits in one `DocProse`: it sets the running text and gives `DocHeading` its type scale, while the other `Doc*` parts mark themselves as chrome and keep their own styles. Every section is a `DocHeading` with an `id` that the outline links to.

### D. Paths and asides — `DocCardGroup`, `DocCard`, `DocCallout`, `DocPrompt`

When there is more than one way through the page, it opens with a `DocCardGroup` chooser that links to each path's heading. `DocCallout` holds a tip (`kind="tip"`) or a note (`kind="info"`), never the main instruction. `DocPrompt` holds the prompt the reader hands to a coding agent.

### E. Steps and code — `DocSteps`, `DocStep`, `CodeBlock`

Numbered instructions are `DocStep`s, each a short imperative title. A command sits inside its step as a `CodeBlock` (no line numbers for one-liners). Output and test commands get their own `CodeBlock` under a `Test it` heading.

### F. Leaving the page — `FrameBox`, `ItemList`, `DocItem`, `DocPagination`

Next steps is a `DocCardGroup` (three columns for a tutorial, two for a reference page). Related resources are `DocItem` rows in an `ItemList` inside a `FrameBox`. `DocPagination` closes the column with the previous and next pages in reading order.

### G. Outline rail — `DocOnThisPage`, `DocCta`

From `xl`. `DocOnThisPage` lists the `h2` and `h3` headings, lights the active one and carries the GitHub and Community link groups. `DocCta` is last in the rail, once per page.

### H. Footer — `Footer`, `StatusIndicator`

The `content` placement inside the column's scroller, so it spans the column and not the rails, with the system status.

## Do

- Write the deck as the outcome: what will be true when the reader finishes.
- Give every `h2` and `h3` an `id` and list the same headings in `DocOnThisPage`.
- Put one action in each step, and the command for that action inside the same step.
- Link a chooser card to the heading of its path on the same page.

## Don't

- Don't hand-write the outline, the pager or the masthead. The `Doc*` parts own their markup, links and labels.
- Don't put a `DocCallout` between a step and its command.
- Don't add a second `DocCta` in the column; the rail carries the page's one offer.
- Don't nest the rail menu more than three levels, and pass `icon=""` to its rows: `MenuItem` draws a home glyph by default.
- Don't put a `DocHeading` outside `DocProse`; it renders at body size there.
- Don't drop a `Button` row straight into `DocProse`: the prose restyles its `<a>` and the label loses contrast. Wrap the row in an element with `data-doc-chrome`.

## Copy

- **Title:** the task or the product, sentence case: `First deploy in a few minutes`, `Applications`.
- **Deck:** one sentence that names the outcome: `By the end of this tutorial, an application will be live…`.
- **Step titles:** imperative, ending with a period when the step is a sentence: `Open Azion Console.`.
- **Headings:** nouns or short imperatives: `Before you start`, `Test it`, `Next steps`.
- **Search:** short enough to fit the field: `Search docs`.

## Accessibility

- Heading order: one `h1` (`DocPageHeader`), then `h2` sections and `h3` subsections from `DocHeading`; no level skipped.
- Landmarks: the bar (`GlobalHeader`, `Azion documentation`), the rail (`Sidebar`, named after the product), `main`, the outline rail (`complementary`) and the footer.
- Focus order follows the reading order: bar, rail, column (masthead, content, pager), outline, footer. The ⌘K field is a real button with `aria-keyshortcuts`.
- `DocOnThisPage` marks the active heading with `aria-current`; code blocks announce their copy result through their own live region.

## States

- `Tutorial`: the primary; a getting-started page with a chooser, steps, commands, an agent prompt and the pager in both directions.
- `Reference`: a product reference page; an info callout, the request-path diagram, a JSON rule and the term list, with the pager forward only.

## Related

- `shells/documentation`: the chrome alone, without a page.
- `headers/docs-header`: the bar alone.
- `docs/landing`: the documentation home.
