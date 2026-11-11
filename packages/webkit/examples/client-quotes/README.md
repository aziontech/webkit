# ClientQuotes

The proof band of a solution page: one client quote at a time, picked from a row of client cards, and a link to every success story.

Each solution page leads the row with the client closest to its audience. All eight solution pages use it.

The band is the `ClientQuotes` component from `@aziontech/webkit/client-quotes`; it composes `SectionModule`, `FrameBox`, `QuoteTabs` and `Button`.

## Examples

### Default

The Retail page's row, led by Dafiti. Magalu, HeroSpark and Zoop use their color logo files; Dafiti, Axur and Contabilizei use a registered `mark` drawn in the theme's ink.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` are bound straight onto the component:

- `items` lists the clients in row order, one card each; six fill the row.
- `items[].text`, `name` and `jobTitle` make the quote.
- `items[].logo` is a color logo file and wins over `mark`, a registered logo name drawn in the theme's ink.
- `clientName` names the card; it is required with a `logo` file.
- An item without `text`, or with nothing to draw on its card, is skipped.
- `primaryAction` is the button under the quote; it needs `label` and `href`, and `trailing` adds the chevron.
- No site page uses this block yet, so this entry is built from the Retail story.

Example:

Site JSON: [`site-default.json`](./site-default.json)
