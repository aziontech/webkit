# CapabilityGrid

A grid of platform capabilities under one section title: each cell an icon, a title and a sentence, with one or two calls to action under the headline.

The band is the `CapabilityGrid` component from `@aziontech/webkit/capability-grid`; it composes `SectionModule`, `SectionTitle`, `FrameBox`, `CardGrid`, `Topic` and `Button`.

## Examples

### Default

Three capabilities in a three-column grid with one action under the headline.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the section title.
- `primaryAction` (and an optional `secondaryAction`) are the buttons under the headline, each a `label`, an `href` and `trailing` for the chevron.
- `items[]` are the capabilities, each an `icon`, a `title`, a `description` and optional `points`.

Example:

Site JSON: [`site-default.json`](./site-default.json)
