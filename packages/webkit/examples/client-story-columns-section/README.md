# ClientStoryColumnsSection

A row of client columns, each painted in the client's colours with its logo and a one-line story linking to the case.

The band is the `ClientStoryColumnsSection` component from `@aziontech/webkit/client-story-columns-section`; it composes `SectionModule` and `RegistrationFrame`.

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

### Reveal on hover

Three client cards; each opens on hover or focus to reveal its story, and stays open on narrow screens.

Example: [`site-reveal-hover.vue`](./site-reveal-hover.vue)

##### Use it on the site

- `reveal: "hover"` turns each column into one card that opens on hover or focus.
- `cells[]` take a reversed `logo` and an optional `logoWidth` (default `35%`).
- `linkLabel` and `ariaLabel` override the built-in "Read story" and "Customer stories".

Example:

Site JSON: [`site-reveal-hover.json`](./site-reveal-hover.json)
