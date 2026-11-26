# TemplateGallerySection

The templates band of a solution page. Copy on one side invites the reader to start from a template; on the other, a scrolling wall of deployable templates. A marquee of the frameworks and clouds it works with closes the band.

Each template card is a mark, a title, one line and a `Deploy now` action. Retail, Web Apps, AI Workloads, Security, Performance and Streaming use it.

The band is the `TemplateGallerySection` component from `@aziontech/webkit/template-gallery-section`; it composes `Module`, `MediaSplit`, `ScrollArea`, `CardGrid`, `Button`, `RegistrationFrame` and `Marquee` (and `Texture` on the closing frame with `closing`).

## Examples

### Default

The Retail page's band, with its storefront description and the first eight deploy templates. Marks that ship in dark ink invert under the dark theme.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `anchor` is the band's id for in-page links.
- `eyebrow`, `title` and `description` fill the copy.
- `primaryAction` and `secondaryAction` are the two buttons under the copy (`Start for free` and `Talk to sales`), each a `label`, an `href` and `trailing` for the chevron.
- `templates[]` fill the wall: `title`, `description`, `icon` and the `href` the whole card and its deploy button link to. Turn on `invertInDark` for a mark that ships in dark ink only. A template without a title is skipped.
- `deployLabel` is the label of the button on each card; a card without an `href` shows no button.
- `templatesAriaLabel` names the wall for screen readers.
- `marqueeLabel` and `marqueeMarks` fill the row of marks. An unknown name renders as a wordmark.

Example:

Site JSON: [`site-default.json`](./site-default.json)

### Closing

The close that starts from a template: the same band, set last on the page with `closing`, so the tall hatched closing frame follows it and nothing else does (no trailing `Spacer`). Turn `hatch` off when another closing band stacks right under it and draws the page's one closing frame.

Example: [`site-closing.vue`](./site-closing.vue)

##### Use it on the site

Add this entry, last, to the `sections` array of the page JSON. It takes the props of the Default entry plus:

- `closing: true` makes it the page's closing band.
- `hatch: false` drops its closing frame when another closing band follows it directly.

Example:

Site JSON: [`site-closing.json`](./site-closing.json)
