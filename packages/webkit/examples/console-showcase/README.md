# ConsoleShowcase

A framed console scene under a section title, with tabs that play one beat of the scene each.

The band is the `ConsoleShowcase` component from `@aziontech/webkit/console-showcase`; it composes `SectionModule`, `SectionTitle`, `ToggleGroup`, `RegistrationFrame`, `Texture` and `Button`. The scene comes from the page entry's `scenes`.

## Examples

### Default

Three tabs over the Application console scene, cropped at the foot.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the section title.
- `tabs[]` are the views, each a `value` handed to the scene as `tab` and a `title`.
- `crop` clips a share of the scene off its foot from the medium breakpoint up.
- `primaryAction` (and an optional `secondaryAction`) are the buttons under the headline.
- `scenes.scene` names the scene drawn in the frame, from the scene registry.

Example:

Site JSON: [`site-default.json`](./site-default.json)
