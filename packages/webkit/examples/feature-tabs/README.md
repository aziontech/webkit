# FeatureTabs

A band that walks through the features behind one claim, one at a time. Up to three tabs sit on one side and the active tab's picture on the other. The Functions page uses it for its Observability section.

The tabs advance on a timer. It pauses under the pointer or keyboard focus, and never runs under reduced motion.

The band is the `FeatureTabs` component from `@aziontech/webkit/feature-tabs`; it composes `SectionModule`, `SectionTitle`, `FrameBox`, `MediaTabs`, `Illustration` and `MiniButton`.

## Stories

### Default

The Observability band from Functions: Trace, Logs and Request path, each held for 5.2 seconds. Each tab shows one `Illustration` scene, named by its `illustration`.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` make the section title.
- `tabs` are up to three features, each a `title`, a `description`, an `illustration` name and its `illustrationLabel`.
- `primaryAction` is the small link under the frame, a `label`, an `href` and `trailing` for the chevron. Leave it out to drop the link.

Example:

Site JSON: [`site-default.json`](./site-default.json)
