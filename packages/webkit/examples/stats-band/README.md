# StatsBand

A row of big figures that proves the claims around it are measured. Each figure is a number with an optional qualifier and unit, and a one-line caption. Products places it after the platform guarantees; Partners opens with it under the hero form.

The band is the `StatsBand` component from `@aziontech/webkit/stats-band`; it composes `SectionModule`, `FrameBox` and `BigNumbers`, which picks its column count from the number of figures.

## Stories

### Reach

The Products page's figures: each value has a unit beside it (`ms`, `/7`, `%`) and no qualifier.

Example: [`site-reach.vue`](./site-reach.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `items[].value` is the figure itself.
- `items[].suffix` is the unit after the figure.
- `items[].label` says what the figure measures.
- Three figures fill the row.

Example:

Site JSON: [`site-reach.json`](./site-reach.json)

<hr
  style={{
    margin: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Partners

The Partners page's figures: two values open with a `+` qualifier and the third ends with a `%` unit.

Example: [`site-partners.vue`](./site-partners.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `items[].prefix` is the qualifier before the figure, in the accent color.
- `items[].value` is the figure itself.
- `items[].suffix` is the unit after the figure.
- `items[].label` says what the figure measures.

Example:

Site JSON: [`site-partners.json`](./site-partners.json)
