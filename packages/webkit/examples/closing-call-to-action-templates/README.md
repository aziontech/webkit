# ClosingCallToActionTemplates

The close that starts from a template. It is `ClosingCallToActionTemplates` from `@aziontech/webkit/closing-call-to-action-templates`.

## Examples

### Default

The close that starts from a template. A framed split: the ask on the left, headline, sentence and two actions over the waving pixelated texture of the `primary` close, and a two-column grid of deployable template cards on the right that scrolls inside a fixed height, its top and bottom fading out, the same wall as `TemplateGallery`. Below `lg` the two stack, the ask first. The tall closing frame follows.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `anchor` is the band's id for in-page links, `contact` by convention.
- `title` is the headline and `description` the sentence under it.
- `primaryAction` is the white button and `secondaryAction` the outlined one beside it. Each takes a `label`, an `href`, `trailing` for the chevron and an optional `target`.
- `templates` are the cards of the grid, six to eight so it overflows and scrolls. Each takes a `title`, a one-line `description`, an `icon` class for its mark, `invertInDark` for a mark drawn in dark ink only, and the `href` of its deploy button. `deployLabel` labels every deploy button, and `templatesAriaLabel` names the scrolling grid for assistive tech.

Example:

Site JSON: [`site-default.json`](./site-default.json)
