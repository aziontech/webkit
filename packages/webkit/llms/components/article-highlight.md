# Article Highlight

> The band that opens a blog under its hero. One article is shown large — its cover beside its overline, headline, deck, read time and a button into it — over a wall of the highlight articles that acts as its selector. The wall is a tablist and the large article its panel; selecting a title on the wall swaps the panel, and every article is drawn invisibly under the panel so the band keeps the height of its tallest article and never jumps. With four or more articles the wall runs four across. It is a page section — the site places it from a `{ _id: 'article-highlight', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `card-grid` and `button`; the selection is local state.

- Import: `import ArticleHighlight from '@aziontech/webkit/article-highlight'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-highlight.json](https://github.com/aziontech/webkit/blob/main/.specs/article-highlight.json)

## When to use

- To open a blog or a resource page with its newest or most important articles.

## Do

- Feature three to five articles; the wall sets one column per article from `lg`, so five sit in one row of five as on azion.com's blog.
- Give a `highlightImage` cropped for the panel when the cover does not read at that size.
- Bind `v-model` (the selected index) to open on an article other than the first; the band never advances on its own, so it holds whatever the reader or the page picked.

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
| `items` | `ArticleHighlightItem[]` | `[]` | false | The highlight articles in wall order, the one at the bound index (the first by default) selected on load; each is `{ key, href, image, highlightImage?, meta, title, description, readTime }`. |
| `actionLabel` | `string` | `''` | false | Label of the button into the selected article; the button is omitted when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the wall of titles. |
| `modelValue` | `number` | `0` | false | Two-way value (`v-model`). |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model` | `number` | `0` | `update:modelValue` | Index of the selected article; left unbound the band starts on the first one. A click or an arrow key writes the new index back; an index past the ends is clamped to the wall. |

## States

- Visual states: `default`, `hover` (a wall title lights, the panel cover scales up), `focus-visible` (inset ring), `selected` (`data-active` on the selected wall title)
- `data-columns` on the wall: one column per article from `lg`, three at least and five at most
- Empty: when `items` is empty the band renders nothing
- The band has no timer: the selected article changes only on a click, an arrow key or a bound `modelValue`
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

### Selected

```vue
<script setup>
  import ArticleHighlight from '@aziontech/webkit/article-highlight'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import { ref } from 'vue'

  const selected = ref(1)
</script>

<template>
  <ArticleHighlight
    v-model="selected"
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
