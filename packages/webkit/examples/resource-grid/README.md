# ResourceGrid

A band that points readers to further reading on solution pages. Short copy sits beside a grid of linked resource cards, each a title and one sentence. A card that leaves the site opens in a new tab.

Financial Services and Technology use it.

The band is the `ResourceGrid` component from `@aziontech/webkit/resource-grid`; it composes `SectionModule`, `MediaSplit`, `CardGrid`, `Topic`, `Button` and, past four cards, `ScrollArea`.

## Examples

### Default

The four Financial Services resources under the default Go Deeper eyebrow: two pages on the site and two blog posts that open in a new tab. Every row takes the height of its tallest card, so the four cards are the same size however long their copy runs. The whole card is the link: hovering anywhere on it lights the topic.

Example: [`site-default.vue`](./site-default.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `eyebrow`, `title` and `description` fill the copy beside the grid.
- `items[]` holds the cards: `title`, `description` and `href`. A full `http` link opens in a new tab, and a card without a title is skipped. Four cards fill the grid; past four, the grid scrolls (see Scrollable below).
- `primaryAction` adds a button under the copy: a `label`, an `href`, `trailing` for the chevron and an optional `target`. It is dropped when its label or link is missing.

Example:

Site JSON: [`site-default.json`](./site-default.json)

### Scrollable

Six Technology resources. Past four cards, the band keeps the height of its copy and the grid scrolls inside a `ScrollArea`. Each row is as tall as its own cards, so the next row shows partway in under the fade and reads as more to come. Once the band stacks, below the `lg` breakpoint, every card shows and nothing scrolls. With four cards or fewer there is no scroll area at all.

Example: [`site-scrollable.vue`](./site-scrollable.vue)

##### Use it on the site

The same entry as Default, with six `items`:

Site JSON: [`site-scrollable.json`](./site-scrollable.json)
