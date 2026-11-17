# SiteFooterSection

The footer under every marketing page: four link columns, then one bottom bar: the Azion mark and the social icons at the start, the status indicator and the language select at the end.

`Footer variant="site"` spans the page like the site header: it opens on a full-width rule with a corner mark at each end, draws no side rules, and insets its columns and bottom bar to the header’s measure. The page above must not draw a bottom rule of its own.

The band is the `SiteFooterSection` component from `@aziontech/webkit/site-footer-section`; it composes `Footer` (`Footer.Column`, `Footer.Link`), `Brand`, `IconButton`, `StatusIndicator` and `Select`.

## Examples

### Default

The site’s own footer. The Azion mark opens the bottom bar at the header brand’s height, the social icons follow it, and the status and language close it; below `md` the bar stacks into those two halves. The language select’s values are the labels the reader sees, since its trigger shows the value.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `variant` is `site` under a marketing page; `home` is where the Azion mark links. Without `home` the mark is left out.
- `ariaLabel` names the footer landmark, `homeAriaLabel` the Azion mark and `languageAriaLabel` the language select, for assistive tech.
- `columns[]` are the link columns, each a `title` and its `links[]` (`label`, `href`, and `target: '_blank'` for a link that leaves the site: it opens in a new tab and closes on the external-link glyph, like `Status` here).
- `socials[]` are the profile icon buttons, each an `icon`, a `label` for assistive tech and an `href`.
- `statusLabel` is the line beside the language select, and `languages[]` are the select's options as the reader sees them; the first one is selected.

Example:

Site JSON: [`site-default.json`](./site-default.json)
