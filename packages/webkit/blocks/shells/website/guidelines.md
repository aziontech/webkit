# Website

The marketing shell. A visitor scans to decide whether Azion fits, so the page is one continuous frame: a sticky site header, a hero band that states the offer and the two next steps, every section stacked inside one framed container separated by hatched gaps, and the site footer closing the frame. The hero, sections and footer all resolve to the site measure, which is what keeps the side rules continuous down the page.

## When to use

- Product, solution and landing pages on the public site.

## When not to use

- Documentation: `shells/documentation`. Product UI: `shells/console`.

## Building blocks

### A. Header — `GlobalHeader` (required)

`kind="site"` in a sticky wrapper; the same bar as `headers/site-header`.

### B. Icon actions — `IconButton` (required)

The navigation trigger below `xl` and Search in the header; the small `transparent` social links in the footer.

### C. Brand — `Brand` (required)

In the header, and in the footer leading the social row from `lg` or in the signature band below it.

### D. Primary navigation — `NavigationMenu` (required from xl)

The five top-level links with the `contrast` mega-menu popup.

### E. Actions — `Button` (required)

Header actions (Contact, Login, Start for free) and the hero's primary and outlined large buttons.

### F. Opening band — `Hero` (required)

`kind="band"`, `size="large"`, `max-width="site"`; `Hero.Title` carries the eyebrow, title, description and the two actions, centred.

### G. Frame — `SectionContainer` (required)

`max-width="site"`; every section after the hero stacks inside it.

### H. Separator — `SectionGap` (required)

`hatch` between sections. Use it instead of margins.

### I. Section — `SectionModule` (required)

One per section; here unpadded and undivided around a framed figure row.

### J. Framed area — `FrameBox` (required)

Draws borders and corner marks; the closing frame uses `borders="none"` so it draws no rule of its own.

### K. Figures — `BigNumbers` (optional)

A row of headline figures inside a `FrameBox`.

### L. Texture — `TextureMaterial` (optional)

`kind="lines"`, the decorative fill of the closing frame.

### M. Footer — `Footer` (required)

`kind="site"`, with columns, social, status, language and brand slots; the hairline above it mirrors the hero's top rule.

### N. System status — `StatusIndicator` (required)

In the footer's status slot.

### O. Language — `Select` (required)

In the footer's language slot, trigger labelled `Language`.

## Do

- Keep every band on the site measure; one off-measure section breaks the side rules.
- Separate sections with `SectionGap`, not with spacing utilities.
- Keep one primary action per band.

## Don't

- Don't nest a second `SectionContainer`.
- Don't put interactive content inside `TextureMaterial`; it is decoration.

## Copy

- **Hero title:** the outcome in sentence case, under ten words. **Eyebrow:** the product name: `Functions`.
- **Hero actions:** match the header's wording and capitalization (`Start for free`, `Talk to a specialist`); the sample's hero reads `Start for Free`, which should follow the header.
- **Figures:** a number and a short noun phrase.

## Accessibility

- One `h1` (the hero title) per page; sections use `h2`.
- The sticky header must not cover anchor targets; scroll with an offset.
- Decorative textures and hatches are hidden from assistive technology.

## States

- Default: the only state.

## Related

- `headers/site-header` — the header on its own.
- `shells/documentation` — shares the footer anatomy in its `content` placement.
