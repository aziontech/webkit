# CapabilityGridSection

A grid of claims or links under one section title: each cell an optional icon, a title and a sentence, with one or two calls to action under the headline. An item with an `href` links its whole cell, so the same band lists use cases or resources that each have their own page.

The band is the `CapabilityGridSection` component from `@aziontech/webkit/capability-grid-section`; it composes `SectionModule`, `SectionTitle`, `RegistrationFrame`, `CardGrid`, `FeatureItem` and `Button`.

## Examples

### Default

Three capabilities in a three-column grid with one action under the headline.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the section title.
- `primaryAction` (and an optional `secondaryAction`) are the buttons under the headline, each a `label`, an `href` and `trailing` for the chevron.
- `items[]` are the capabilities, each a `title`, a `description`, and an optional `icon`, `points` and `href` (the page the whole cell links to).

Example:

Site JSON: [`site-default.json`](./site-default.json)
