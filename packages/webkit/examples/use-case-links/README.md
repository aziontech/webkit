# UseCaseLinks

A grid of use cases that points at the ways a product is applied, under a header with an overline, a headline and a description. Each cell is itself the link, so the band needs no buttons. Application Accelerator uses it.

The band is the `UseCaseLinks` component from `@aziontech/webkit/use-case-links`; it composes `SectionModule`, `SectionTitle` and `CardGrid kind="divider"`, with a `Topic` per cell.

## Examples

### Topics

Six linked cells from the Application Accelerator page. Each cell shows an arrow on its headline because it has a link.

Example: [`site-topics.vue`](./site-topics.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow` is the short overline above the headline.
- `title` is the headline of the section.
- `description` is the supporting sentence under the headline.
- `items[]` are the use cases in reading order; three fill a row.
- Each item takes an `icon` class, a `title`, a one-sentence `description` and the `href` the whole cell links to.

Example:

Site JSON: [`site-topics.json`](./site-topics.json)
