# StickyCarousel

A numbered row of cards that pins under the site header and slides sideways as the page scrolls, until the last card is in view.

The band is the `StickyCarousel` component from `@aziontech/webkit/sticky-carousel`; it composes `SectionModule` and `SectionTitle`.

## Examples

### Default

Six reasons, pinned while the page scrolls.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the section title.
- `items[]` are the cards, each a `title` and a `description`.

Example:

Site JSON: [`site-default.json`](./site-default.json)
