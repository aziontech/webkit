# Subject Library

> A library of learning subjects in a divider grid: each subject is one framed card with its name, what it covers and a list of its article links, and an optional closing call to action spans the grid's last two cells so the grid ends without an empty cell. It is a page section — the site places it from a `{ _id: 'subject-library', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `frame-box`, `card-grid`, `call-to-action` and `button` rather than owning any anatomy of its own.

- Import: `import SubjectLibrary from '@aziontech/webkit/subject-library'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [subject-library.json](https://github.com/aziontech/webkit/blob/main/.specs/subject-library.json)

## When to use

- On the Learning Center index, to list every subject with the articles that teach it.
- Whenever a page needs a grid of topic cards that each carry a short list of links, closed by one call to action.

## Do

- Give every subject a unique `slug`; it is the card's `id`, so a `#slug` link lands on it.
- Keep the subject count at a multiple of three plus one when `closing` is set, so the closing cell fills the last row exactly.
- Keep each subject's articles to a handful; the card grows with its list.

## Don’t

- For a grid of features with artwork → use `feature-tiles`.
- For a filterable list of rows → use `listing-browser`.
- Inside another band's cell → compose `frame-box` and `call-to-action` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [call-to-action](call-to-action.md) — the `lead` band drawn in the closing cell.
- [card-grid](card-grid.md) — the divider grid the subject cards sit in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page `id` of the band, the target of a `#hash` link. |
| `subjects` | `SubjectLibrarySubject[]` | `[]` | false | The subject cards, in order; each is `{ slug, title, description, articles }` where every article is `{ label, href }`. Subjects without a title or a linked article are skipped. |
| `closing` | `SubjectLibraryClosing` | `undefined` | false | Call to action across the grid's last two cells; `{ eyebrow, title, titleMuted, description, primaryAction, secondaryAction }` where each action is `{ label, href, trailing?, target? }`. Omitted when absent. |

## States

- Visual states: `default`
- Three columns from the large breakpoint, one below the small one, on `card-grid`'s `fixed` layout (equal tracks whatever the count), so the closing cell really spans two columns from the small breakpoint up and takes two thirds of the last row on desktop, as on azion.com's learning page
- Empty: when no subject carries a title and a linked article the band renders nothing — not the grid, not the closing cell

## Accessibility

- Visible focus: each article link draws `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)`; the closing buttons own theirs.
- Keyboard map: `Tab` moves through the article links in reading order, then the closing actions; `Enter` follows one. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` carrying `anchor` as its `id`; each subject is an `h3` over a `role="list"` of links; the closing cell is `call-to-action`'s own section, named by its title.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): titles `var(--text-default)`, descriptions and links `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the article link colour transition carries `motion-reduce:transition-none`.
- Touch target ≥40×40 px — the closing actions are large `button`s; article links are inline text links inside a list.

## Examples

### Default

```vue
<script setup>
  import SubjectLibrary from '@aziontech/webkit/subject-library'
</script>

<template>
  <SubjectLibrary
    anchor="subjects"
    :subjects="[
      {
        slug: 'bots',
        title: 'Bots',
        description:
          'Bots are automated software programs that perform repetitive tasks on websites and applications.',
        articles: [
          {
            label: 'What is a Bot?',
            href: 'https://www.azion.com/en/learning/bots/what-is-a-bot/'
          },
          {
            label: 'What is Bot Management?',
            href: 'https://www.azion.com/en/learning/bots/what-is-bot-management/'
          }
        ]
      },
      {
        slug: 'cdn',
        title: 'CDN',
        description: 'Reduce latency by caching static content on servers close to the user.',
        articles: [
          { label: 'What is a CDN?', href: 'https://www.azion.com/en/learning/cdn/what-is-a-cdn/' },
          {
            label: 'What is Caching?',
            href: 'https://www.azion.com/en/learning/cdn/what-is-caching/'
          }
        ]
      }
    ]"
    :closing="{
      eyebrow: 'Next step',
      title: 'Put what you learned to work.',
      titleMuted: 'On Azion.',
      description:
        'Deploy your first application in minutes, or talk to an expert about your architecture.',
      primaryAction: { label: 'Start for free', href: '/signup' },
      secondaryAction: { label: 'Talk to a specialist', href: '/contact', trailing: true }
    }"
  />
</template>
```
