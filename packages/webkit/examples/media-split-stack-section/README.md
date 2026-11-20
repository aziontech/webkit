# MediaSplitStackSection

The core of a product page: a run of copy-beside-art bands, each stating one claim. From `lg` up the bands pin under the site header and pile on each other as the page scrolls.

Every band sits on the same small pixelate texture, fading toward the top. A band with a link is a link as a whole. A claim shown by code is a `FeatureScrollSection` step with `code`; a band never shows code or a request-flow diagram.

The band is the `MediaSplitStackSection` component from `@aziontech/webkit/media-split-stack-section`; it composes `Module`, `ModuleHeader`, `SplitStack` and `MediaSplit`, with `Illustration` scenes and `Button` actions. Every picture sits at the closing end of its band. It uses `_id: 'media-split-stack-section'`.

## Examples

### Solutions

The five solution areas Home stacks inside Why Azion, each a large, centered band with an outlined "Learn more" button. The first band draws the `quick-start-with-templates` illustration; the others use `Illustration` scenes too.

Example: [`site-solutions.vue`](./site-solutions.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `bands` are the solutions, each a `title`, a `description`, an `action` (`label` and `href`, the button and the link the whole band follows unless the band sets its own `href`), an optional `eyebrow`, and a `scene`, a `widget` or an `illustration` name from the registry.
- `anchor` is the run's id for in-page links; `description` sits under the section title. With a title the band headlines are `h3`.
- A band without `action` has no button and no link. Every band needs a picture; one without renders without its media cell and warns in development.

Example:

Site JSON: [`site-solutions.json`](./site-solutions.json)
