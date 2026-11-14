# HeroCopyOnTopArt

An opening band whose copy sits over a flow of resource nodes, level by level, the lit node marking the product the page is about.

The band is the `HeroCopyOnTopArt` component from `@aziontech/webkit/hero-copy-on-top-art`; it composes `Hero`, the flow nodes and `Button`.

## Examples

### Default

Two domains routing to one workload, which serves an application and a firewall.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the copy.
- `primaryAction` and `secondaryAction` are the two buttons.
- `levels[]` are the rows of the flow, each `nodes[]` of `{ eyebrow, icon, title, label, severity, lit? }`.

Example:

Site JSON: [`site-default.json`](./site-default.json)
