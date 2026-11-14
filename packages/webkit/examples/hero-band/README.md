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

### Centered carousel

The home page hero. It fills one screen, with a dot field fading in from the top, the headline centered and the client strip on the floor. The solution pages use the same band with their own copy and clients.

Example: [`site-centered-carousel.vue`](./site-centered-carousel.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-band` and `kind` is `centered`.
- `title` is the page h1, and `highlight` paints its opening words in the brand accent. The block renders nothing without a title.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `tickerLabel` is the overline above the client strip, and `tickerMarks` lists the client marks in order. The strip shows only when it has marks.
- `headerOffset` takes the site header out of the hero height, so header and hero fill exactly the first screen; it defaults to the `SiteNav` bar's `--layout-header-height`, and an empty value is for a page with no header above the hero.

Example:

Site JSON: [`site-centered-carousel.json`](./site-centered-carousel.json)

### Title band small

The title band at the medium height, for a page whose bands start right under the headline (Contact).

Example: [`site-title-band-small.vue`](./site-title-band-small.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-band`, `kind` is `title-band` and `size` is `medium`, the default.
- The other props work as in the title band.

Example:

Site JSON: [`site-title-band-small.json`](./site-title-band-small.json)

### Title band carousel

The Learning Center hero, and the Support page's. The same band with the client strip on its floor, for list and catalogue pages that open on proof.

Example: [`site-title-band-carousel.vue`](./site-title-band-carousel.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-band`, `kind` is `title-band` and `size` is `large`.
- `title` is the page h1, and `highlight` paints its opening words in the brand accent. The block renders nothing without a title.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `tickerLabel` is the overline above the client strip, and `tickerMarks` lists the client marks in order. The strip shows only when it has marks.

Example:

Site JSON: [`site-title-band-carousel.json`](./site-title-band-carousel.json)

### Pixel floor

The AI Inference hero. Left-aligned copy over an animated pixel field that stands on the floor under the client strip. The light drifts across the field and stops under reduced motion.

Example: [`site-pixel-floor.vue`](./site-pixel-floor.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-band` and `kind` is `pixel-floor`.
- `title` is the page h1, and `highlight` paints its opening words in the brand accent. The block renders nothing without a title.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `tickerLabel` is the overline above the client strip, and `tickerMarks` lists the client marks in order. The strip shows only when it has marks.

Example:

Site JSON: [`site-pixel-floor.json`](./site-pixel-floor.json)

### Copy beside art

Copy on one side and a wide illustration on the other, with the client strip on the floor. The illustration bleeds past the column edge from medium widths up. The migration guides open with it.

Example: [`site-copy-beside-art.vue`](./site-copy-beside-art.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-band` and `kind` is `copy-beside-art`.
- `eyebrow` is a short overline above the headline.
- `title` is the page h1, and `highlight` paints its opening words in the brand accent. The block renders nothing without a title.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `illustration` names the illustration beside the copy, and `illustrationAriaLabel` describes it for screen readers.
- `tickerLabel` is the overline above the client strip, and `tickerMarks` lists the client marks in order. The strip shows only when it has marks.

Example:

Site JSON: [`site-copy-beside-art.json`](./site-copy-beside-art.json)
