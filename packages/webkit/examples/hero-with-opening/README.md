# HeroWithOpening

The large title band with the sales arguments that open the page right under it. Each argument is an icon, a title and one sentence on a thin frame grid, three to a row.

The grid starts at the hero floor with no hatched gap between them, so the arguments read as the second half of the hero. The hatched gap comes after the grid, before the next section.

The band is the `HeroWithOpening` component from `@aziontech/webkit/hero-with-opening`; it composes `Hero`, `Hero.Title`, `Button`, `SectionContainer`, `SectionModule`, `FrameBox`, `CardGrid`, `Topic` and `SectionGap`.

## Examples

### Six arguments

Two rows of three. Use six when the page argues on breadth.

Example: [`site-six-arguments.vue`](./site-six-arguments.vue)

##### Use it on the site

Add this entry to the `hero` array of the page JSON. `_id` picks the block and `props` fill it:

- `eyebrow` is the overline above the headline, and `title` is the page h1. The block renders nothing without a title. A title longer than 45 characters widens its column, so it breaks into two lines instead of three.
- `description` is the sentence under the headline.
- `primaryAction` and `secondaryAction` take a `label`, an `href`, an optional `target` and an optional `trailing`, which closes the label on a chevron. A button shows only when it has both a label and a link.
- `items` are the arguments in reading order. Three fill a row, so use three or six. Each takes an `icon` class, a short `title` and a one-sentence `description`.

Example:

Site JSON: [`site-six-arguments.json`](./site-six-arguments.json)

<hr
  style={{
    margin: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Three arguments

One row of three, for a page that argues on a few strong claims.

Example: [`site-three-arguments.vue`](./site-three-arguments.vue)

##### Use it on the site

Add this entry to the `hero` array of the page JSON. `_id` picks the block and `props` fill it:

- `eyebrow`, `title`, `description` and the two actions work as in the six-argument example.
- `items` are the arguments in reading order. Three fill a row, so use three or six.

Example:

Site JSON: [`site-three-arguments.json`](./site-three-arguments.json)
