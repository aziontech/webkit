# CustomerSpotlight

A row of client cards painted in each client's colours; the hovered or focused card opens to its story line, and the whole card links to the case.

The band is the `CustomerSpotlight` component from `@aziontech/webkit/customer-spotlight`; it composes `SectionModule` and `FrameBox`.

## Examples

### Default

Three client cards; each card paints the client registry's colours for its name.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `items[]` are the cards, each a `name`, a reversed `logo`, an `href`, a `description` and an optional `brand` (`{ base, glow }`).
- `linkLabel` and `ariaLabel` override the built-in "Read story" and "Customer stories".

Example:

Site JSON: [`site-default.json`](./site-default.json)
