# UseCases

The band a product page closes its argument with: one framed cell that names the product and links to its docs, beside the handful of things you would use it for.

The title cell is the simplest variant of the media-and-title split: an overline, a headline, a one-line lead and a single "View docs" button pinned to the foot of the cell. The use cases sit in `CardGrid` frame cells that draw their own rules and corner marks, each a short title over one sentence.

The band is the `UseCases` component from `@aziontech/webkit/use-cases`; it composes `SectionModule`, `FrameBox`, `CardGrid`, `Topic`, `Overline` and `Button`.

## Stories

### Default

Four use cases of equal weight in a two-by-two set, each a short title over one sentence.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the title cell.
- `primaryAction` is the button pinned to the foot of the title cell, a `label`, an `href` and `trailing` for the chevron.
- `items[]` are the four use cases, each an `icon`, a `title` and a `description`.

Example:

Site JSON: [`site-default.json`](./site-default.json)
