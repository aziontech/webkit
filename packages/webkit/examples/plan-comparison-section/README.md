# PlanComparisonSection

A table that compares plans feature by feature, under the plan cards on Pricing. Each plan gets a column, each product gets a band, and each cell says what that plan includes.

A cell shows a check-circle mark when the feature is included, a circle-minus mark when it is not (each with a tooltip of its label), or the allowance as text. Screen readers hear each value with its row and its plan. The plan header stays on screen while you scroll, and the recommended plan gets an accent bar.

On small screens the table shows one plan at a time, picked from a select in the header.

The Support page's tier comparison is the same table: pass the support tiers as `plans`.

The band is the `PlanComparisonSection` component from `@aziontech/webkit/plan-comparison-section`; it composes `SectionModule`, `Select`, `Button`, `Eyebrow`, `Hint`, `Tag` and `Link`, and keeps the plan picked on small screens as local state.

## Examples

### Plan Matrix

Hobby, Pro and Enterprise across four of the Pricing product sections. Each plan button repeats the action of its card, and the last row links to the on-demand rates. Narrow the canvas below 1024px to see the plan picker, which opens on Pro.

Example: [`site-plan-matrix.vue`](./site-plan-matrix.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `plans` sets the columns: an `id` the picker selects by, `name`, `highlighted` for the recommended plan, and an `action` button (`label`, `href`). The highlighted plan gets the secondary button, the others an outlined one. A plan without a name is dropped.
- `sections` sets the product bands: `eyebrow`, `title`, `description` and `rows`.
- `rows[].values` holds one cell per plan, in plan order: `✓` (or `true`) for included, `—` for not included, any other text as written, empty for a blank cell.
- `rows[].group` makes the row a group heading. `hint` adds an info button that opens a popover defining the label, and `tag` adds a tag next to the label.
- `caption` names the table and `columnLabel` heads the feature column. `includedLabel` and `excludedLabel` are the tooltip and screen-reader texts of the marks (empty uses the locale's Included and Not included), and `pickerAriaLabel` names the narrow-screen plan picker, whose list has a search field.
- `primaryAction` (`label`, `href`) adds the closing link, which opens in a new tab.
- `anchor` sets the band's `id`, so a page can link to `#comparison`.

Example:

Site JSON: [`site-plan-matrix.json`](./site-plan-matrix.json)

### Hints and marks

Rows whose label needs a definition carry a `hint`: the info button opens a popover titled with the label. Included and not-included cells show their marks with a tooltip. The table has no closing link, so its last row draws the closing rule.

Example: [`hints-and-marks.vue`](./hints-and-marks.vue)

### Support tiers

Developer, Business, Enterprise and Mission-Critical as the columns of the Support page, across the Support and the Professional Services bands, each band closing on its pricing link. Tiers are plans: give each one an `id`, a `name`, a `description` and an `action`.

Example: [`support-tiers.vue`](./support-tiers.vue)

### Tier Matrix

The Support page's site entry: Developer starts a free account, the other tiers hand off to the contact page, and Enterprise is the recommended tier.

Example: [`site-tier-matrix.vue`](./site-tier-matrix.vue)

Site JSON: [`site-tier-matrix.json`](./site-tier-matrix.json)
