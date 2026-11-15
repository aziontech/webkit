# HeroSection

The opening band of a page: an eyebrow, the page headline, a lead and up to two calls to action, laid out by `variant`, with an optional scene above or under the copy.

The band is the `HeroSection` component from `@aziontech/webkit/hero-section`; it composes `Hero`, `Button`, the `FlowDiagram` nodes for a topology, and `SectionContainer`, `SectionModule`, `RegistrationFrame`, `CardGrid` and `FeatureItem` for the argument grid.

## Examples

### Title band

The product-page opening: the headline beside its lead, with both actions.

Example: [`site-title-band.vue`](./site-title-band.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `variant` picks the layout (`center`, `title-band`, `center-band`, `compact-band`, `pixel-floor`, `copy-beside-art`, `copy-on-top-art`) and `size` the headline step.
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

- `_id` is `hero-section` and `variant` is `center`.
- `title` is the page h1, and `titleHighlight` paints its opening words in the brand accent. The block renders nothing without a title.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `marqueeLabel` is the overline above the client strip, and `marqueeMarks` lists the client marks in order. The strip shows only when it has marks.
- `headerOffset` takes the site header out of the hero height, so header and hero fill exactly the first screen; it defaults to the `SiteHeader` bar's `--layout-header-height`, and an empty value is for a page with no header above the hero.

Example:

Site JSON: [`site-centered-carousel.json`](./site-centered-carousel.json)

### Title band small

The title band at the medium height, for a page whose bands start right under the headline (Contact).

Example: [`site-title-band-small.vue`](./site-title-band-small.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-section`, `variant` is `title-band` and `size` is `medium`, the default.
- The other props work as in the title band.

Example:

Site JSON: [`site-title-band-small.json`](./site-title-band-small.json)

### Title band carousel

The Learning Center hero, and the Support page's. The same band with the client strip on its floor, for list and catalogue pages that open on proof.

Example: [`site-title-band-carousel.vue`](./site-title-band-carousel.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-section`, `variant` is `title-band` and `size` is `large`.
- `title` is the page h1, and `titleHighlight` paints its opening words in the brand accent. The block renders nothing without a title.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `marqueeLabel` is the overline above the client strip, and `marqueeMarks` lists the client marks in order. The strip shows only when it has marks.

Example:

Site JSON: [`site-title-band-carousel.json`](./site-title-band-carousel.json)

### Pixel floor

The AI Inference hero. Left-aligned copy over an animated pixel field that stands on the floor under the client strip. The light drifts across the field and stops under reduced motion.

Example: [`site-pixel-floor.vue`](./site-pixel-floor.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-section` and `variant` is `pixel-floor`.
- `title` is the page h1, and `titleHighlight` paints its opening words in the brand accent. The block renders nothing without a title.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `marqueeLabel` is the overline above the client strip, and `marqueeMarks` lists the client marks in order. The strip shows only when it has marks.

Example:

Site JSON: [`site-pixel-floor.json`](./site-pixel-floor.json)

### Copy beside art

Copy on one side and a wide illustration on the other, with the client strip on the floor. The illustration bleeds past the column edge from medium widths up. The migration guides open with it.

Example: [`site-copy-beside-art.vue`](./site-copy-beside-art.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-section` and `variant` is `copy-beside-art`.
- `eyebrow` is a short overline above the headline.
- `title` is the page h1, and `titleHighlight` paints its opening words in the brand accent. The block renders nothing without a title.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `illustration` names the illustration beside the copy, and `illustrationAriaLabel` describes it for screen readers.
- `marqueeLabel` is the overline above the client strip, and `marqueeMarks` lists the client marks in order. The strip shows only when it has marks.

Example:

Site JSON: [`site-copy-beside-art.json`](./site-copy-beside-art.json)

### Topology

Copy centered over a flow of resource nodes, level by level, the lit node marking the product the page is about: two domains routing to one workload, which serves an application and a firewall.

Example: [`site-topology.vue`](./site-topology.vue)

##### Use it on the site

Add this entry to the `hero` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `_id` is `hero-section` and `variant` is `copy-on-top-art`.
- `eyebrow`, `title`, `description` and the two actions work as in the title band.
- `levels[]` are the columns of the flow, left to right, each `nodes[]` of `{ eyebrow, icon, title, label, severity, lit? }`. A node with no title is skipped. The flow is drawn only when the entry has no `scenes`.

Example:

Site JSON: [`site-topology.json`](./site-topology.json)

### Arguments

The large title band with the sales arguments that open the page right under it. Each argument is an icon, a title and one sentence on a thin frame grid, three to a row. The grid starts at the hero floor with no hatched gap between them, so the arguments read as the second half of the hero; the hatched gap comes after the grid.

Example: [`site-arguments.vue`](./site-arguments.vue)

##### Use it on the site

Add this entry to the `hero` array of the page JSON. `_id` picks the block and `props` fill it:

- `_id` is `hero-section`, `size` is `large`, and `variant` stays the default `title-band`.
- `eyebrow`, `title`, `description` and the two actions work as in the title band. Set `titleLength` to `long` for a headline that would run to three lines.
- `items` are the arguments in reading order. Three fill a row, so use three or six. Each takes an `icon` class, a short `title` and a one-sentence `description`.

Example:

Site JSON: [`site-arguments.json`](./site-arguments.json)
