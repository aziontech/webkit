# LogoWallQuote

A wall of client logos with one of those clients quoted beside it, in one frame. The Solutions page uses it under a section title.

Use it instead of hand-rolling the same split, as Cache, Application Accelerator and Our Network do today. Each logo can be tuned per theme: white artwork flips on light, dark artwork flips on dark, and a client with a file per theme shows the right one.

The band is the `LogoWallQuote` component from `@aziontech/webkit/logo-wall-quote`; it composes `SectionModule`, `SectionTitle`, `FrameBox`, `LogoWall`, `Quote` and `Button`.

## Stories

### Default

From the Solutions page: nine client logos, each linked to its success case, beside a Zoop quote. A linked logo lifts and shows "Read story" on hover and focus.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow` and `title` fill the section title.
- `logos[]` takes a `name`, a `logo` file and an optional `href` to the success case.
- `logoLight` adds a second file for the light theme.
- `logoTreatment` is `as-is`, `monochrome` (a one-ink logo drawn in the theme's ink) or `invert-light` (a reversed logo flipped on the light theme).
- `quote` takes `text`, `name`, `jobTitle`, `logo` and `logoAlt`; `primaryAction` is its button, with `label`, `href`, `trailing` and an optional `target`.
- No site page uses this block yet, so this entry is built from the Solutions story.

Example:

Site JSON: [`site-default.json`](./site-default.json)
