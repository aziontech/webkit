# Documentation

The documentation shell. A reader comes to learn one task and leave, so the shell keeps the page readable and the next page close. It is `DocLayout`, composed once in the app around `RouterView`: the layout owns the docs header, the navigation rail, the "On this page" rail, the search palette and the footer, and the document itself scrolls with the header and both rails sticky. Every docs page is only its article.

## When to use

- Every documentation, guide or reference page, and the docs home.

## When not to use

- Marketing pages: `shells/website`. Product pages: `shells/console`.

## Building blocks

### A. Layout — `DocLayout` (required)

Composed once around the router view. `navigation` is the docs tree as data (groups of rows with `id`, `label` and `href`; an inline subsection is a row with `children` and `defaultOpen`), `sections` the header's section links, `home` where the Azion Docs mark links, `outline` the article's headings (`{ id, text, depth }`) and `outline-groups` the GitHub and Community links under them. It renders the single main landmark, the rail from `lg` (a drawer below it), the outline from `xl`, and the ⌘K palette of every navigation page. In an app leave `active-id` empty so the current row follows the route; the preview has no router, so it passes the current row's id.

### B. Header actions — `IconButton` (required)

In the `actions` slot: GitHub, `kind="outlined"`, with an `ariaLabel`. In the footer, the small `transparent` social links.

### C. Console — `Button` (required)

`secondary`, last in the `actions` slot.

### D. Theme — `ThemeSwitcher` (required)

In the `navigation-footer` slot, labelled `Theme`; the layout shows it at the foot of the rail and of the drawer.

### E. Call to action — `DocCta` (optional)

In the `aside` slot, under the outline: "Ready to build?" with a primary and a secondary link.

### F. Masthead — `DocPageHeader` (required)

The first thing in the article: breadcrumb, title, deck, and on real pages the last-updated date and the meta actions.

### G. Running text — `DocProse` (required)

Everything under the masthead; it sets the running text and gives the headings their type scale.

### H. Section headings — `DocHeading` (required)

One per outline entry, with the same `id` the `outline` item carries: the layout tracks which heading is in view and scrolls a chosen entry under the sticky header.

### I. Footer — `Footer` (required)

In the `footer` slot, `kind="content"`, under a top rule: `Footer.Column` with `Footer.Link` items, then the social, status, language and brand slots. With `signature="compact"` the brand leads the social row from `lg` (`hidden lg:inline-flex`) and the signature band carries it below `lg`, in CSS.

### J. Brand — `Brand` (required)

In the footer only; the header mark belongs to the layout.

### K. System status — `StatusIndicator` (required)

In the footer's status slot.

### L. Language — `Select` (required)

In the footer's language slot, trigger labelled `Language`.

## Do

- Compose `DocLayout` once in the app's root around `RouterView`; each route renders only its `<article>`.
- For a real page, start from a variant (Article, Reference, Landing): the variants build the article from the `Doc*` parts only.
- Give every `DocHeading` an `id` and pass the same ids, in document order, as `outline`.
- Put everything under `DocPageHeader` in one `DocProse`.
- Give every navigation row an `id` and an `href` (an in-app path is followed with the router); keep the rail scoped to the current product; the header section links switch products.
- Build a docs home from the Landing variant: `DocHero` with `CopyPromptButton`, then `DocAgentCard` above the Console / CLI / API cards; pass no `outline`.
- Write the deck as the outcome (`By the end of this tutorial, …`), one action per `DocStep`, with its command as a `CodeBlock` inside the same step.

## Don't

- Don't put a `ScrollArea`, an `h-screen` frame or any inner scroll region around the article: the document scrolls, so find in page, scroll restoration and full-page captures work.
- Don't render a `<main>` in a page; the layout already renders the only one.
- Don't repeat the header, the search, the navigation rail, the outline or the footer in a page.
- Don't hand-write the outline, the pager or the masthead; the layout's outline rail, `DocPagination` and `DocPageHeader` own their markup and labels.
- Don't give a `DocHeading` an id the `outline` does not list, or list an id no heading carries.
- Don't put a `DocHeading` outside `DocProse` (it renders at body size), and don't drop a `Button` row straight into `DocProse`: wrap it in an element with `data-doc-chrome`.
- Don't measure the viewport in script to place the footer brand; the `lg:` utilities and `signature="compact"` decide it in CSS.
- Don't reuse the console rail here; docs navigation is pages, not modules.

## Copy

- **Article headings:** verb-led tasks in sentence case: `Create the function`, `Verify the response`.
- **Navigation rows:** page titles exactly as the `h1` reads.
- **Step titles:** imperative, ending with a period when the step is a sentence: `Open Azion Console.`
- **Landing groups:** `Start by interface`, `Start by objective`, `Ready-made templates`, `Follow along`; card link labels are a verb and the object (`Install the CLI`).

## Accessibility

- One main landmark: the layout's. The article is an `<article>` inside it, never a second `<main>`.
- One `h1` per article (the masthead or the hero); `DocHeading` levels follow it in order (2, then 3 under a 2), and outline entries target those ids.
- Landmarks: the header is a banner, the rail and the outline are labelled navigation regions, the footer is contentinfo; `Tab` runs header → rail → article → outline → footer.
- Choosing an outline entry moves focus to its heading and clears the sticky header.

## States

- Default: the chrome around a short guide; rail from `lg` (drawer below), outline with the GitHub and Community groups and the `DocCta` from `xl`, the full footer under the article.
- Article: a tutorial page from the `Doc*` parts, pager in both directions, outline with an indented level 3 entry.
- Reference: a product reference page with a callout, the request-path diagram, a JSON rule and a term list; pager forward only.
- Landing: the documentation home; navigation rail, no outline rail, `DocHero` with `CopyPromptButton`, `DocAgentCard`, entry-point grids, pager forward to the first page.

## Related

- `DocLayout` — the component this block shows.
- `headers/docs-header` — the header on its own.
- `shells/console` (`ConsoleLayout`) and `shells/website` (`SiteLayout`) — the console and marketing counterparts.
