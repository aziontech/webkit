# Documentation

The documentation shell. A reader comes to learn one task and leave, so the shell keeps the page readable and the next page close: the docs header on top, a rail of the current product's pages from `lg`, a reading column that scrolls on its own, the "On this page" outline from `xl`, and the footer inside the reading column's scroller so the bands sit between the rail and the outline.

## When to use

- Every documentation, guide or reference page.

## When not to use

- Marketing pages: `shells/website`. Product pages: `shells/console`.

## Building blocks

### A. Header — `GlobalHeader` (required)

Default `content` placement, `aria-label="Azion documentation"`; the same bar as `headers/docs-header`.

### B. Icon actions — `IconButton` (required)

The navigation trigger below `lg`, Search and GitHub in the header, and the small `transparent` social links in the footer, each with an `aria-label`.

### C. Brand — `Brand` (required)

In the header with the Docs tag, and in the footer: it leads the social row from `lg` and moves to the signature band below it.

### D. Section links — `NavigationMenu` (required from lg)

The top-level documentation sections in the header.

### E. Console — `Button` (required)

`secondary`, last in the header.

### F. Rail — `Sidebar` (required from lg)

`aria-label="Docs"`, the width of `--container-2xs`, holding the page menu and the theme switcher in its footer. Below `lg` it leaves and the header trigger opens the navigation.

### G. Theme — `ThemeSwitcher` (required)

In the rail footer, labelled `Theme`.

### H. Page menu — `MenuRoot` (required)

The rail's page navigation for the current product.

### I. Product group — `MenuGroup` (required)

One per product (`Functions`), with the product name as its heading.

### J. Page link — `MenuItem` (required)

One per page, the current page `selected`.

### K. Reading column — `ScrollArea` (required)

The article and the footer scroll inside it, so the header, rail and outline stay put.

### L. Footer — `Footer` (required)

`kind="content"`, inside the scroller: `Footer.Column` with `Footer.Link` items, then the social, status, language and brand slots. It stacks below `md`.

### M. System status — `StatusIndicator` (required)

In the footer's status slot.

### N. Language — `Select` (required)

In the footer's language slot, trigger labelled `Language`.

## Do

- Keep the outline's items equal to the article's `h2` headings.
- Keep the rail scoped to the current product; the header links switch products.
- Let the footer run full bleed across the zone between rail and outline.

## Don't

- Don't put the footer outside the scroller: it would stay pinned and eat the reading height.
- Don't reuse the console rail here; docs navigation is pages, not modules.

## Copy

- **Outline heading:** `On this page`.
- **Article headings:** verb-led tasks in sentence case: `Create the function`, `Verify the response`.
- **Menu items:** page titles exactly as the `h1` reads.

## Accessibility

- One `h1` per article; outline links target the `h2` ids.
- `ScrollArea` keeps keyboard scrolling working; the article is reachable without passing through the rail.
- Each `nav` (header sections, rail, outline) is labelled so screen reader users can tell them apart.

## States

- Default: the only state; rail from `lg`, outline from `xl`, footer stacked below `md`.

## Related

- `headers/docs-header` — the header on its own.
- `shells/website` — the marketing counterpart that shares the footer.
