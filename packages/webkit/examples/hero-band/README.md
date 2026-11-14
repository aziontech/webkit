# HeroBand

The opening band of a page: an eyebrow, the page headline, a lead and up to two calls to action, laid out by `kind`, with an optional scene above or under the copy.

The band is the `HeroBand` component from `@aziontech/webkit/hero-band`; it composes `Hero`, `SectionModule`, `FrameBox` and `Button`.

## Examples

### Title band

The product-page opening: the headline beside its lead, with both actions.

Example: [`site-title-band.vue`](./site-title-band.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `kind` picks the layout (`centered`, `title-band`, `centered-band`, `compact-band`, `pixel-floor`, `copy-beside-art`, `copy-on-top-art`) and `size` the headline step.
- `eyebrow`, `title` and `description` fill the copy.
- `primaryAction` and `secondaryAction` are the two buttons, each a `label`, an `href` and `trailing` for the chevron.

Example:

Site JSON: [`site-title-band.json`](./site-title-band.json)

### Scene

A centered opening with a console scene entering under the copy.

Example: [`site-scene.vue`](./site-scene.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- The props work as in the title band.
- `scenes.bottom` (or `scenes.top`) names the scene drawn under (or above) the copy, from the scene registry, with its own `props`.

Example:

Site JSON: [`site-scene.json`](./site-scene.json)
