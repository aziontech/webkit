# PlatformDirectory

A directory of Azion's products, in four columns under a section title. Each column is a product group (Build, Store, Secure, Observe), and each row is an icon, a product name and one line about it, linking to that product.

Home shows it right under the hero. The solution, product and Pricing pages repeat it.

The band is the `PlatformDirectory` component from `@aziontech/webkit/platform-directory`; it composes `SectionModule`, `SectionTitle`, `FrameBox` and `ColumnNavigation`.

## Stories

### Primitives

The Home band: a title over fifteen Azion products, framed with corner marks. Products the site hosts link by path, the rest go to azion.com.

Example: [`site-primitives.vue`](./site-primitives.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `title` heads the section, and `ariaLabel` names the directory for screen readers.
- `groups` sets the columns: a `title` and its `items`.
- Each item takes an `icon` class, a `title`, a `description` and an `href`. An item without a title or a link is skipped, and so is a group left with no items.

Example:

Site JSON: [`site-primitives.json`](./site-primitives.json)
