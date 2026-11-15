# FeatureScroll

A list of features with the media that shows each one. The band pins under the site header while the page scrolls; as the reader scrolls, the open feature moves on and the media beside it changes to match. The media is a live console scene (an item `scene` naming a `ConsoleMockup`), a one-file code sample (an item `code`) or an `Illustration`.

Below `lg` it turns into a FeatureTiles grid: each feature becomes a tile, its media over the title and description.

The band is the `FeatureScroll` component from `@aziontech/webkit/feature-scroll`; it composes `SectionModule`, `SectionTitle`, `RegistrationFrame`, `StickyStack`, `Texture`, `Button`, `CardGrid`, `MediaTile`, `CodeBlock` and `Illustration`.

## Examples

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

### Code

From the Web Apps page: five capabilities, each pinning the one file you would write for it (`code`: `fileName`, `code`, `language`, `fileIcon`, `copyAriaLabel`), with a docs button under the open step; an action's `type` and `target` are optional.

Example: [`site-code.vue`](./site-code.vue)

Site JSON: [`site-code.json`](./site-code.json)
