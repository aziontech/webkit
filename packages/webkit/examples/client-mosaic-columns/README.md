# ClientMosaicColumns

A row of client columns, each painted in the client's colours with its logo and a one-line story linking to the case.

The band is the `ClientMosaicColumns` component from `@aziontech/webkit/client-mosaic-columns`; it composes `SectionModule` and `FrameBox`.

## Examples

### Default

Three client stories side by side.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `ariaLabel` names the list of stories.
- `linkLabel` is the cue under each story.
- `cells[]` are the clients, each a `name`, a `logo`, an `href`, a `story` and a `logoTreatment`.

Example:

Site JSON: [`site-default.json`](./site-default.json)
