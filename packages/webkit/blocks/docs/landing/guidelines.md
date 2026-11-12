# Docs landing

The front door of the documentation. Readers arrive without a page in mind: a new user who wants the first step, a developer who knows the tool they want (Console, CLI, API), or someone with a goal (build, accelerate, secure). The landing sends each of them to one page in a click. It has no outline rail, because it has no reading order of its own; the column holds grids of entry points instead.

## When to use

- The home of a documentation site, or of one product's documentation.
- A developer portal start page that routes to guides, tools and references.

## When not to use

- A page that teaches or describes one thing from top to bottom: use `docs/article`.
- The marketing home: use `shells/website` and the page sections.
- A list of every page: the rail already lists them; don't repeat it as a grid.

## Building blocks

### A. Docs bar — `GlobalHeader`, `Brand`, `NavigationMenu`, `IconButton`, `SearchTrigger`, `Button`

The bar of `headers/docs-header`, with Search as a `collapsible` `SearchTrigger` (`Search docs`) inside an `@container`. On the landing, search is the most-used control, so it keeps its field form whenever the bar is wide enough.

### B. Rail — `Sidebar`, `MenuRoot`, `MenuGroup`, `MenuItem`, `ThemeSwitcher`

From `lg`. Getting started first, with Overview selected, then Platform resources. Rows pass `icon=""`. The `ThemeSwitcher` sits in the rail footer.

### C. Welcome — `ScrollArea`, `DocPageHeader`, `Button`, `DocPrompt`

`DocPageHeader` with no breadcrumb and no meta actions carries the page's `h1` and one sentence. Under it go one primary `Button` (Get started) and a `DocPrompt` the reader copies into a coding agent.

### D. Entry points — `DocProse`, `DocHeading`, `DocCardGroup`, `DocCard`

The groups sit in one `DocProse`, which gives `DocHeading` its type scale. Each group is a `section` labelled by its `DocHeading`. Start by interface opens with one full-width `DocCard` (eyebrow `Recommended`, agent setup) over three `DocCard`s with a `link-label`. Start by objective uses two columns. Templates use four columns with framework glyphs (`ai ai-react`, `ai ai-next`…) and two on a phone. An "Also useful" line in `DocProse` closes a group when it has more than the grid shows.

### E. Footer — `DocPagination`, `Footer`, `StatusIndicator`

`DocPagination` points forward to the first page in reading order. The `content` placement `Footer` follows inside the column's scroller.

## Do

- Name each card by its destination and give it one sentence on what the reader will do there.
- Keep each group to one grid of at most eight cards.
- Order the groups from the broadest entry (interface) to the narrowest (templates).

## Don't

- Don't add an outline rail; the landing has no headings to follow.
- Don't use the marketing `Banner` here; at docs scale it outweighs the page title. A full-width `DocCard` with an eyebrow does the job.
- Don't link a card to another landing; link to a page that starts the task.

## Copy

- **Title:** `Welcome to Azion Docs`, or the product name for a product landing.
- **Group headings:** `Start by interface`, `Start by objective`, `Ready-made templates`, `Follow along`.
- **Card titles:** the destination, sentence case: `Build your application`. **Link labels:** a verb and the object: `Install the CLI`.
- **External cards:** say where the link goes in the label: `Join the Discord`.

## Accessibility

- Heading order: the `h1` from `DocPageHeader`, then one `h2` per group from `DocHeading`; cards carry no headings above `h3`.
- Landmarks: the bar, the rail (`Documentation`), `main` with one `section` per group (`aria-labelledby` its heading), and the footer.
- Focus order follows the reading order; every card is one link, and external ones open a new tab.
- The `DocPrompt` copy result is announced by its own live region.

## States

- `Default`: the only state; the landing is static content and has no loading, empty or error form.

## Related

- `docs/article`: the pages the landing links to.
- `shells/documentation`: the chrome alone.
- `headers/docs-header`: the bar alone.
