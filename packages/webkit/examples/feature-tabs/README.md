# FeatureTabs

A band that walks through the features behind one claim, one at a time. Up to three tabs sit on one side and the active tab's media on the other: its code file, the band's live scene or its illustration. The Functions page uses it for its Observability section.

The tabs advance on a timer. It pauses under the pointer or keyboard focus, and never runs under reduced motion.

The band is the `FeatureTabs` component from `@aziontech/webkit/feature-tabs`; it composes `SectionModule`, `SectionTitle`, `FrameBox`, `MediaTabs`, `CodeBlock`, `Illustration`, `Button` and `MiniButton`.

## Examples

### Default

The Observability band from Functions: Trace, Logs and Request path, each held for 5.2 seconds. Each tab shows one `Illustration` scene, named by its `illustration`.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` make the section title.
- `tabs` are up to three features, each a `title`, a `description` and its media: a `code` file, or an `illustration` name and its `illustrationLabel`. Give each a `value` when the band draws a `scene`.
- `scene` is a live scene drawn for every tab without code, `{ component, props? }`; it gets the open tab's `value` as `tab`.
- `autoplayInterval` is how long each tab holds, in milliseconds (5200 by default); `copyAriaLabel` names the copy button of a code file.
- `primaryAction` is the button beside the section title (a small link under the frame when there is no title), a `label`, an `href` and `trailing` for the chevron. Leave it out to drop it.

Example:

Site JSON: [`site-default.json`](./site-default.json)
