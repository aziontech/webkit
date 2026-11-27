# ProcessScrollSection

A numbered row of process stages under a section title; with `pinned` the row pins under the site header and slides as the page scrolls.

The band is the `ProcessScrollSection` component from `@aziontech/ui/process-scroll-section`; it composes `Module` and `ModuleHeader`.

## Examples

### Default

Four stages from commit to production.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the section title.
- `steps[]` are the stages, each a `title` and a `description`.
- `pinned` pins the row while the page scrolls past it.

Example:

Site JSON: [`site-default.json`](./site-default.json)
