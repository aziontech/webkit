# ClientMosaic

A mosaic of client stories, each tile linking to that client's success case. Home shows it after the analyst recognitions.

Two tiles tell a story: a headline over the client's photo, with a "Learn more" link. The other tiles show a client logo, and the whole tile is the link. Logos on the canvas follow the theme; on the white and orange tiles they turn black.

The band is the `ClientMosaic` component from `@aziontech/webkit/client-mosaic`; it composes `SectionModule`, `FrameBox`, `BentoGrid` (`BentoGrid.Cell`) and `MiniButton`.

## Stories

### Default

Home's mosaic in four columns, two on a phone. Netshoes leads as a large story tile, GPA runs two rows tall, and six logo tiles fill the rest.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `stories` holds up to two stories: the first leads at two by two, the second stands two rows tall.
- `stories[].photo`, `logo`, `text` and `href` fill a story tile.
- `logos` holds up to six linked logos; each needs `logo` and `logoAlt` (the name screen readers hear).
- `linkLabel` is the link text under each story.
- `ariaLabel` names the mosaic for screen readers.
- Each story and logo may set `fill` (`canvas`, `surface`, `white` or `primary`) and `logoTreatment` (`monochrome`, `knockout` or `as-is`); placement follows the order: the first story spans two by two, the next stories two rows tall, then the logos one cell each.

Example:

Site JSON: [`site-default.json`](./site-default.json)
