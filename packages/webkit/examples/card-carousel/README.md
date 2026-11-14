# CardCarousel

A row of use-case cards that scrolls sideways, each card an eyebrow, a title, a sentence and a link.

The band is the `CardCarousel` component from `@aziontech/webkit/card-carousel`; it composes `Carousel` and `Card`.

## Examples

### Default

Four use cases of one product in a scrolling row.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `title` names the row.
- `items[]` are the cards, each an `eyebrow`, a `title`, a `description`, an `href` and the `linkLabel` of its link.

Example:

Site JSON: [`site-default.json`](./site-default.json)
