# FeatureWidgets

A band that shows several ways in to the same product, each as a picture over a short caption. Two or three cells share a row on a thin frame grid, and each cell can end in a link, a button that copies a prompt, or both. The Functions page uses it for "Start where you already work".

Each cell holds a live fragment of the console (a `scene`) that wakes while the pointer is over it, or an `Illustration`. The grid collapses to one column on a phone.

The band is the `FeatureWidgets` component from `@aziontech/webkit/feature-widgets`; it composes `SectionModule`, `SectionTitle`, `RegistrationFrame`, `BentoGrid`, `Illustration`, `Button` and `HighlightButton`.

## Examples

### Default

The Functions "Get started" band: three cells, each a path from a prompt to a deployed function. Each cell shows the illustration of its path over the caption.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `anchor` is the band's id for in-page links.
- `eyebrow`, `title` and `description` make the section title; without a `title` the title is dropped. `primaryAction` and `secondaryAction` are the buttons under it, each a `label`, an `href` and `trailing` for the chevron.
- `titleVariant` aligns the section title: `center` (the default), `start` or `split`.
- `columns` is `2` (the default), `3` or `4`, the cells per row from the medium breakpoint up.
- `items` are the cells in reading order, each a `title`, a `description` and the `scene` (`{ component, props? }`) or `illustration` shown above them.
- A cell ends in an `action` (a `label` and an `href`, rendered as an outlined link), a `copy` (a `label` and the `text` to put on the clipboard, rendered as a highlighted button that reads `copiedLabel`, Copied by default, for two seconds), or both.

Example:

Site JSON: [`site-default.json`](./site-default.json)
