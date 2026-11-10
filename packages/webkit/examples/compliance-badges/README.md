# ComplianceBadges

The compliance band of a solution page: a short statement that the platform meets audit requirements, next to a grid of certification badges and a link to the compliance page.

Three columns on desktop, two on a phone. Retail, Financial Services and Technology use it.

The band is the `ComplianceBadges` component from `@aziontech/webkit/compliance-badges`; it composes `SectionModule`, `MediaSplit` and `CardGrid`, with the badge files from `@aziontech/webkit/assets`.

## Stories

### Default

The five certifications those pages list, SOC 2 & 3, PCI DSS, LGPD, GDPR and CCPA, plus a `See more` cell in the sixth slot.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `eyebrow`, `title` and `description` fill the text side.
- `certifications[]` takes a `label`, a `badge` image and its `alt` text. A badge without a label or an image is skipped.
- `primaryAction` is the closing cell; it needs both `label` and `href`.
- `ariaLabel` names the badge list for screen readers.

Example:

Site JSON: [`site-default.json`](./site-default.json)
