# PlatformDirectorySection

A directory of Azion's products, in four columns under a section title. Each column is a product group (Build, Store, Secure, Observe), and each row is an icon, a product name and one line about it, linking to that product.

Home shows it right under the hero. The solution, product and Pricing pages repeat it.

The band is the `PlatformDirectorySection` component from `@aziontech/webkit/platform-directory-section`; it composes `Module`, `ModuleHeader`, `RegistrationFrame` and `LinkDirectory`.

## Examples

### Primitives

The Home band: a title over fifteen Azion products, framed with corner marks. Products the site hosts link by path, the rest go to azion.com.

Example: [`site-primitives.vue`](./site-primitives.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `title` heads the section, with an optional `eyebrow` above it and a one-sentence `description` under it; `ariaLabel` names the directory for screen readers (it falls back to the title).
- `anchor` sets the band's id, so a page can link to it with a `#hash`.
- `groups` sets the columns: a `title` and its `items`.
- Each item takes an `icon` class, a `title`, a `description` and an `href`. An item without a title or a link is skipped, and so is a group left with no items.

Example:

Site JSON: [`site-primitives.json`](./site-primitives.json)

### Three groups

The directory takes one column per group, up to four: three groups fan out to three columns, and between the small and the large breakpoints the third spans the row. A single group spans the whole row. No group count leaves an empty cell.

Example: [`three-groups.vue`](./three-groups.vue)

### With header

An eyebrow above the headline and one sentence under it, the way the pricing, products and solution pages head the directory. The `anchor` lets a page link to the band with a `#hash`.

Example: [`with-header.vue`](./with-header.vue)
