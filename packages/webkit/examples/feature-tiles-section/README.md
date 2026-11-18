# FeatureTilesSection

A row of reasons, each a picture over a short bold title and a sentence. Home uses it for "Why Azion", and Pricing for why its pricing works the way it does.

The tiles sit on a hairline frame grid with no padding, so the artwork runs to the rules.

The band is the `FeatureTilesSection` component from `@aziontech/webkit/feature-tiles-section`; it composes `Module`, `RegistrationFrame`, `CardGrid` and `MediaTile`, with `ModuleHeader` for the heading and `Illustration` for each tile's picture, a scene of the illustration registry. `variant` picks the layout: `artwork` (four columns, marks on every corner) or `illustrated` (three columns, marks on the bottom rule).

## Examples

### Artwork

Home's "Why Azion" band: an eyebrow, a title and a description over four tiles, each picture a registered `Illustration` drawn in the tile's 170:128 artwork frame.

Example: [`site-artwork.vue`](./site-artwork.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `variant` is `artwork`.
- `eyebrow`, `title` and `description` make the heading. Without a title the heading is left out.
- `tiles` are the reasons, each a `title`, a `description` and an `illustration` name from the registry. A tile without an illustration renders without a picture.

Example:

Site JSON: [`site-artwork.json`](./site-artwork.json)

<hr
  style={{
    margin: 'var(--spacing-2xl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Illustrated

Pricing's band: three tiles with no heading, each picture a registered `Illustration`, scaled per tile and filling the tile's width.

Example: [`site-illustrated.vue`](./site-illustrated.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `variant` is `illustrated`; `anchor` is the band's id for in-page links.
- `tiles` are the reasons, each a `title`, a `description`, an `illustration` name and its `scale`.

Example:

Site JSON: [`site-illustrated.json`](./site-illustrated.json)
