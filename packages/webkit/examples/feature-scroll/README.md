# FeatureScroll

A list of features with the media that shows each one. The band pins under the site header while the page scrolls; as the reader scrolls, the open feature moves on and the media beside it changes to match. On the site the media is a live console widget; here an `Illustration` stands in for it.

It is the sibling of `StickyScrollCode`: the same pinned band, with media in place of a code sample. Below `lg` it turns into a FeatureTiles grid: each feature becomes a tile, its media over the title and description.

The band is the `FeatureScroll` component from `@aziontech/webkit/feature-scroll`; it composes `SectionModule`, `SectionTitle`, `FrameBox`, `StickyStack`, `TextureMaterial`, `Button`, `CardGrid`, `MediaTile` and `Illustration`.

## Stories

### Default

The Workloads band: five features, from the workloads list to gradual rollouts and rollback, each shown by its own illustration. Each feature carries its own docs button under its description, shown only while the feature is open.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the section title.
- `items[]` are the features in reading order, each a `title`, a `description` and the `illustration` that shows it.
- `items[].action` is the feature's own button, with `label`, `href` and `trailing` for the chevron; it shows under the description while the feature is open.

Example:

Site JSON: [`site-default.json`](./site-default.json)
