# Website

The marketing shell: one continuous frame — the site bar, a hero band that states the offer and the two next steps, every section stacked inside one framed container separated by hatched gaps, and the site footer closing the frame. The chrome is `SiteLayout`, composed once in the app around `RouterView` with the `SiteNav` and `SiteFooter` data; each page is only its sections, in the layout's slot.

## When to use

- Product, solution, company and landing pages on the public site.

## When not to use

- Documentation: `shells/documentation`. Product UI: `shells/console`.
- A one-off campaign page with no site navigation: render its sections on their own.

## Building blocks

### A. Site chrome — `SiteLayout` (required)

Composed once in the app's root around `RouterView`. `navigation` is the `SiteNav` data (menus, Pricing link, Contact, Login, Start for free) with an `href` on every item, so each one is also a palette destination; `footer` is the `SiteFooter` data with `kind: 'site'` (columns, socials, status line, languages). It owns the bar, the single `<main>`, the footer, the ⌘K / Ctrl K search palette and the canvas paint.

### B. Opening band — `Hero` (required)

`kind="band"`, `size="large"`, `max-width="site"`; `Hero.Title` carries the eyebrow, title, description and the two actions, centred.

### C. Actions — `Button` (required)

The hero's primary and outlined large buttons, worded like the bar's actions.

### D. Frame — `SectionContainer` (required)

`max-width="site"`; every section after the hero stacks inside it.

### E. Separator — `SectionGap` (required)

`hatch` between sections. Use it instead of margins.

### F. Section — `SectionModule` (required)

One per section; here unpadded and undivided around a framed figure row.

### G. Framed area — `FrameBox` (required)

Draws borders and corner marks; the closing frame uses `borders="none"` so it draws no rule of its own and hands the corner to the footer. When the page ends on a closing section (`ClosingCallToAction`, `ClosingCallToActionNewsletter`, `ClosingCallToActionAgents`, `ClosingCallToActionTemplates`), drop both the trailing `SectionGap` and this closing frame: the section draws its own, and a second one doubles the close (`webkit/no-gap-after-closing-section`).

### H. Figures — `BigNumbers` (optional)

A row of headline figures inside a `FrameBox`.

### I. Texture — `TextureMaterial` (optional)

`kind="lines"`, the decorative fill of the closing frame.

## Do

- Compose `SiteLayout` once, in the app's root, and render each route's sections in its default slot.
- Set `data-theme="dark"` on `<html>` (in `index.html`) for the dark site, so the layout, the teleported mega-menus and the palette all resolve the dark tokens.
- Keep every band on the site measure; one off-measure section breaks the side rules.
- Give every navigation item an `href`; add extra palette groups (articles, docs results) in the `search` slot.
- Separate sections with `SectionGap`, not with spacing utilities.
- Keep one primary action per band.

## Don't

- Never add `SiteNav`, `SiteFooter`, `GlobalHeader` or `Footer` to a page; the layout already renders them.
- Never render a second `<main>`; the layout owns the landmark.
- Don't wrap the layout's slot content in a border, padding or `max-w-*` of its own.
- Don't nest a second `SectionContainer`.
- Don't put interactive content inside `TextureMaterial`; it is decoration.

## Copy

- **Hero title:** the outcome in sentence case, under ten words. **Eyebrow:** the product name: `Functions`.
- **Hero actions:** match the bar's wording and capitalization (`Start for free`, `Talk to a specialist`).
- **Figures:** a number and a short noun phrase.
- **Palette placeholder:** `Search azion.com`.

## Accessibility

- Landmarks come from the layout: the bar is the banner named "Azion", the page is its single `main`, the footer is the `contentinfo`.
- One `h1` (the hero title) per page; sections use `h2`.
- ⌘K / Ctrl K opens the palette; `Escape` closes it and returns focus to the bar's search button.
- The sticky bar must not cover anchor targets; scroll with an offset.
- Decorative textures and hatches are hidden from assistive technology.

## States

- Default: the page with the palette closed; the palette opens from the bar's search button or ⌘K / Ctrl K, and the bar's mega-menus and sheet own their states.

## Related

- `shells/console` — the signed-in counterpart, on `ConsoleLayout`.
- `shells/documentation` — the docs counterpart, shares the footer anatomy in its `content` placement.
- `headers/site-header` — the bar on its own.
