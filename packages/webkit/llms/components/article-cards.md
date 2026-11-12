# Article Cards

> A titled row of three linked article cards on one hairline frame grid with no gutter, stacking to one column on mobile. Each card is a single link: a 16:9 media cell holding the article's cover — or, when it has none, the client's mark in one flat ink that follows the theme — then the headline, the deck and a `meta` overline pinned to the foot. It is a page section — the site places it from a `{ _id: 'article-cards', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box` and `card-grid`. `kind` places the heading only: `left` at the start (an article's closing row), `centered` centred over the cards under an overline (a landing-page band); the cards keep the same shape in both.

- Import: `import ArticleCards from '@aziontech/webkit/article-cards'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-cards.json](https://github.com/aziontech/webkit/blob/main/.specs/article-cards.json)

## When to use

- To close a blog post with its related articles, or a success story with its related stories.
- To show three stories as a landing-page band under a centred heading.

## Do

- Give a card either `image` or `mark`; the mark is drawn only when there is no cover.
- Keep the band to three cards so the frame row stays full.

## Don’t

- For the full, filterable list of articles → use `article-index-blog` or `article-index-resource-hub`.
- For one featured article selected from a wall → use `article-highlight`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-grid](card-grid.md) — the frame grid the cards sit on.
- [article-highlight](article-highlight.md) — the blog's opening band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `ArticleCardsKind` | `'left'` | false | Placement of the heading: `left` sets it at the start, `centered` centres it over the cards. |
| `eyebrow` | `string` | `''` | false | Overline above the heading. |
| `title` | `string` | `''` | false | Headline of the band; the band renders no header when empty. |
| `items` | `ArticleCardsItem[]` | `[]` | false | The cards, in order; each is `{ key, href, title, description, meta, image?, mark? }`. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the card grid. |

## States

- Visual states: `default`, `hover` (the card lifts to the raised surface and its media scales up), `focus-visible` (inset ring)
- `data-kind` mirrors the `kind` prop and places the heading
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set

## Accessibility

- Visible focus: each card is one link with an inset `focus-visible` ring.
- Keyboard map: `Tab` moves card to card; `Enter` follows the link.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the grid is a `group` named by `ariaLabel` when set; the headline is the section title's `h2` and each card's headline an `h3`; a cover is decorative (`alt=""`), a client mark is named by the client.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted` on the canvas.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — the whole card is the target.

## Examples

### Default

```vue
<script setup>
  import ArticleCards from '@aziontech/webkit/article-cards'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleCards
    kind="left"
    title="Related Articles"
    aria-label="Related Articles"
    :items="[
      {
        key: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        title: 'How Do You Reduce AI Agent Latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
        meta: 'SEP 23, 2026 • 8 min read',
        image: placeholderImage
      },
      {
        key: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        title: 'Best Cloudflare Alternatives and Competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
        meta: 'SEP 22, 2026 • 13 min read',
        image: placeholderImage
      },
      {
        key: 'which-azion-plan-is-right-for-your-project',
        href: '/blog/which-azion-plan-is-right-for-your-project',
        title: 'Which Azion Plan Is Right for Your Project?',
        description:
          'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
        meta: 'SEP 22, 2026 • 7 min read',
        image: placeholderImage
      }
    ]"
  />
</template>
```

### Types

```vue
<script setup>
  import ArticleCards from '@aziontech/webkit/article-cards'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ArticleCards
      kind="left"
      title="Related Articles"
      aria-label="Related Articles"
      :items="[
        {
          key: 'how-to-reduce-ai-agent-latency',
          href: '/blog/how-to-reduce-ai-agent-latency',
          title: 'How Do You Reduce AI Agent Latency?',
          description:
            'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
          meta: 'SEP 23, 2026 • 8 min read',
          image: placeholderImage
        },
        {
          key: 'cloudflare-alternatives-and-competitors',
          href: '/blog/cloudflare-alternatives-and-competitors',
          title: 'Best Cloudflare Alternatives and Competitors',
          description:
            'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
          meta: 'SEP 22, 2026 • 13 min read',
          image: placeholderImage
        },
        {
          key: 'which-azion-plan-is-right-for-your-project',
          href: '/blog/which-azion-plan-is-right-for-your-project',
          title: 'Which Azion Plan Is Right for Your Project?',
          description: 'Compare Azion’s Hobby, Pro, and Enterprise plans.',
          meta: 'SEP 22, 2026 • 7 min read',
          image: placeholderImage
        }
      ]"
    />
    <ArticleCards
      kind="centered"
      eyebrow="Success cases"
      title="When our customers succeed, we succeed"
      aria-label="When our customers succeed, we succeed"
      :items="[
        {
          key: 'netshoes',
          href: '/success-cases/netshoes',
          title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
          description:
            'Netshoes strengthened its e-commerce security and improved the shopping experience.',
          meta: 'FEB 4, 2022 • 4 min read',
          mark: {
            name: 'Netshoes',
            logo: netshoesExtendedReversed
          }
        },
        {
          key: 'renner',
          href: '/success-cases/renner',
          title: 'Lojas Renner Optimizes Online Shopping Journey with Azion',
          description: 'Faster product pages allowed Renner to scale its e-commerce platform.',
          meta: 'AUG 10, 2021 • 4 min read',
          mark: { name: 'Renner', logo: rennerExtendedColor }
        },
        {
          key: 'gpa',
          href: '/success-cases/gpa',
          title: 'GPA solved a cyberattack and reduced costs by 30%',
          description:
            'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack and reduced costs by 30%.',
          meta: 'MAY 6, 2025 • 4 min read',
          mark: { name: 'GPA', logo: gpaExtendedReversed }
        }
      ]"
    />
  </div>
</template>
```
