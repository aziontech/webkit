# Article Highlight

> The band that opens a blog under its hero. One article is shown large — its cover beside its overline, headline, deck, read time and a button into it — over a wall of the highlight articles that acts as its selector. The wall is a tablist and the large article its panel; selecting a title on the wall swaps the panel, and every article is drawn invisibly under the panel so the band keeps the height of its tallest article and never jumps. With four or more articles the wall runs four across. It is a page section — the site places it from a `{ _id: 'article-highlight', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `card-grid` and `button`; the selection is local state.

- Import: `import ArticleHighlight from '@aziontech/webkit/article-highlight'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-highlight.json](https://github.com/aziontech/webkit/blob/main/.specs/article-highlight.json)

## When to use

- To open a blog or a resource page with its newest or most important articles.

## Do

- Feature three or four articles; four fill the wall four across.
- Give a `highlightImage` cropped for the panel when the cover does not read at that size.

## Don’t

- For a closing row of related articles → use `article-cards`.
- For the full list of articles → use `article-index-blog`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [article-cards](article-cards.md) — the closing row of related articles.
- [card-grid](card-grid.md) — the frame grid the wall of titles sits on.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `items` | `ArticleHighlightItem[]` | `[]` | false | The highlight articles in wall order, the first selected on load; each is `{ key, href, image, highlightImage?, meta, title, description, readTime }`. |
| `actionLabel` | `string` | `''` | false | Label of the button into the selected article; the button is omitted when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the wall of titles. |

## States

- Visual states: `default`, `hover` (a wall title lights, the panel cover scales up), `focus-visible` (inset ring), `selected` (`data-active` on the selected wall title)
- `data-columns` on the wall: four columns with four or more articles, three otherwise
- Empty: when `items` is empty the band renders nothing
- Reflow: the hidden layout sizer is `min-w-0`, so the panel never grows past a 320 px box.

## Accessibility

- Visible focus: the panel headline link and every wall title show an inset `focus-visible` ring.
- Keyboard map: on the wall, `ArrowRight` / `ArrowDown` select the next title, `ArrowLeft` / `ArrowUp` the previous one (wrapping), `Home` the first and `End` the last; selection follows focus and only the selected title is in the tab order (roving `tabindex`).
- ARIA: the wall is a `tablist` named by `ariaLabel`, each title a `tab` with `aria-selected` and `aria-controls`; the panel is a `tabpanel` labelled by the selected tab; the panel headline is an `h2` whose link covers the article; the invisible sizer is `aria-hidden` and `inert`; covers are decorative (`alt=""`). Ids come from `useId`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted` on the canvas.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every wall title is a full-cell button.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the external-link arrow does not mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move between the highlighted articles, swapped under `dir="rtl"` (`logicalArrowKey`).
- User data: article titles in another script keep their own direction.

## Examples

### Default

```vue
<script setup>
  import ArticleHighlight from '@aziontech/webkit/article-highlight'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleHighlight
    anchor="articles"
    action-label="Read article"
    aria-label="Highlight articles"
    :items="[
      {
        key: 'ship-portfolio-two-commands-azion-cli',
        href: '/blog/ship-portfolio-two-commands-azion-cli',
        image: placeholderImage,
        highlightImage: placeholderImage,
        meta: 'Developers • SEP 25, 2026',
        title: 'How I Shipped My Portfolio in Just Two Commands',
        description:
          'See how a portfolio site went from template to live URL with just azion init and azion deploy.',
        readTime: '9 min read'
      },
      {
        key: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        image: placeholderImage,
        highlightImage: placeholderImage,
        meta: 'Serverless • SEP 23, 2026',
        title: 'How Do You Reduce AI Agent Latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
        readTime: '8 min read'
      },
      {
        key: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        image: placeholderImage,
        highlightImage: placeholderImage,
        meta: 'Security • SEP 22, 2026',
        title: 'Best Cloudflare Alternatives and Competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
        readTime: '13 min read'
      },
      {
        key: 'which-azion-plan-is-right-for-your-project',
        href: '/blog/which-azion-plan-is-right-for-your-project',
        image: placeholderImage,
        highlightImage: placeholderImage,
        meta: 'Company news • SEP 22, 2026',
        title: 'Which Azion Plan Is Right for Your Project?',
        description: 'Compare Azion’s Hobby, Pro, and Enterprise plans.',
        readTime: '7 min read'
      }
    ]"
  />
</template>
```
