# Article Cards Section

> A titled row of three linked article cards on one hairline frame grid with no gutter, stacking to one column on mobile. Each card is a single link: a 16:9 media cell holding the article's cover — or, when it has none, the client's mark in one flat ink that follows the theme — then the headline, the deck and a `meta` overline pinned to the foot. It is a page section — the site places it from a `{ _id: 'article-cards-section', props }` entry and binds `props` straight onto it — and it composes `module`, `module-header`, `registration-frame` and `card-grid`. `variant` places the heading only: `start` at the start (an article's closing row), `center` centred over the cards under an overline (a landing-page band); the cards keep the same shape in both.

- Import: `import ArticleCardsSection from '@aziontech/ui/article-cards-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [article-cards-section.json](article-cards-section.json)

## When to use

- To close a blog post with its related articles, or a success story with its related stories.
- To show three stories as a landing-page band under a centred heading.

## Do

- Give a card either `image` or `mark`; the mark is drawn only when there is no cover.
- Keep the band to three cards so the frame row stays full.
- Set `target: '_blank'` on a card whose article lives on another site; it opens in a new tab and says so to assistive technology.

## Don’t

- For the full, filterable list of articles → use `article-index-section`.
- For one featured article selected from a wall → use `article-highlight-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-grid](card-grid.md) — the frame grid the cards sit on.
- [article-highlight-section](article-highlight-section.md) — the blog's opening band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `align` | `ArticleCardsSectionAlign` | `'start'` | false | Placement of the heading: `start` sets it at the start, `center` centres it over the cards. |
| `anchor` | `string` | `''` | false | Id set on the band so an in-page `#hash` link can target it. |
| `eyebrow` | `string` | `''` | false | Eyebrow above the heading. |
| `title` | `string` | `''` | false | Headline of the band; the band renders no header when empty. |
| `items` | `ArticleCardsSectionItem[]` | `[]` | false | The cards, in order; each is `{ id, href, title, description, meta, image?, mark?, target? }`; a card whose `target` is `_blank` opens in a new tab. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the card grid. |

## States

- Visual states: `default`, `hover` (the card lifts to the raised surface and its media scales up), `focus-visible` (inset ring)
- `data-align` mirrors the `align` prop and places the heading
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set
- `anchor` sets the band's `id`; a card whose `target` is `_blank` links with `rel="noopener"`
- A card title clamps to two lines (`line-clamp-2`); the clamp is visual only, so the full title stays in the accessibility tree, with no `title` attribute.
- Broken cover: an `image` that fails to load is dropped, so the cover shows its `mark` when it has one and otherwise the plain `--bg-surface` panel, never the browser's broken-image glyph.

## Accessibility

- Visible focus: each card is one link with an inset `focus-visible` ring.
- Keyboard map: `Tab` moves card to card; `Enter` follows the link.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the grid is a `group` named by `ariaLabel` when set; the headline is the section title's `h2` and each card's headline an `h3`; a cover is decorative (`alt=""`), a client mark is named by the client; a `_blank` card appends the visually hidden `(opens in a new tab)` to its name.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted` on the canvas.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — the whole card is the target.

## Right-to-left

- Layout: logical utilities only; the frame grid mirrors through `CardGrid`.
- Icons: none; a client mark is a logo and never mirrors.
- Keyboard: unchanged (`Tab` order follows the DOM).
- User data: none.

## Internationalization

| Key                                 | English source         | Override prop |
| ----------------------------------- | ---------------------- | ------------- |
| `articleCardsSection.opensInNewTab` | `(opens in a new tab)` | —             |

- Formatting: none. Every other string is editorial copy that arrives through props.

## Responsive

- Container queries: none; the grid is three columns from `md` and one column below (from `CardGrid`).
- Narrow (≤ 640 px): the cards stack in one column and keep the 16:9 media cell.
- Touch: the whole card is the target.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import ArticleCardsSection from '@aziontech/ui/article-cards-section'
  import placeholderImage from '@aziontech/ui/assets/placeholder-image.svg'
</script>

<template>
  <ArticleCardsSection
    align="start"
    title="Related articles"
    aria-label="Related articles"
    :items="[
      {
        id: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        title: 'How do you reduce AI agent latency?',
        description:
          'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
        meta: 'SEP 23, 2026 • 8 min read',
        image: placeholderImage
      },
      {
        id: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        title: 'Best Cloudflare alternatives and competitors',
        description:
          'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
        meta: 'SEP 22, 2026 • 13 min read',
        image: placeholderImage
      },
      {
        id: 'which-azion-plan-is-right-for-your-project',
        href: '/blog/which-azion-plan-is-right-for-your-project',
        title: 'Which Azion plan is right for your project?',
        description:
          'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
        meta: 'SEP 22, 2026 • 7 min read',
        image: placeholderImage
      }
    ]"
  />
</template>
```

### Alignments

```vue
<script setup>
  import ArticleCardsSection from '@aziontech/ui/article-cards-section'
  import gpaExtendedReversed from '@aziontech/ui/assets/gpa-extended-reversed.svg'
  import netshoesExtendedReversed from '@aziontech/ui/assets/netshoes-extended-reversed.svg'
  import placeholderImage from '@aziontech/ui/assets/placeholder-image.svg'
  import rennerExtendedColor from '@aziontech/ui/assets/renner-extended-color.svg'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ArticleCardsSection
      align="start"
      title="Related articles"
      aria-label="Related articles"
      :items="[
        {
          id: 'how-to-reduce-ai-agent-latency',
          href: '/blog/how-to-reduce-ai-agent-latency',
          title: 'How do you reduce AI agent latency?',
          description:
            'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
          meta: 'SEP 23, 2026 • 8 min read',
          image: placeholderImage
        },
        {
          id: 'cloudflare-alternatives-and-competitors',
          href: '/blog/cloudflare-alternatives-and-competitors',
          title: 'Best Cloudflare alternatives and competitors',
          description:
            'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
          meta: 'SEP 22, 2026 • 13 min read',
          image: placeholderImage
        },
        {
          id: 'which-azion-plan-is-right-for-your-project',
          href: '/blog/which-azion-plan-is-right-for-your-project',
          title: 'Which Azion plan is right for your project?',
          description: 'Compare Azion’s Hobby, Pro, and Enterprise plans.',
          meta: 'SEP 22, 2026 • 7 min read',
          image: placeholderImage
        }
      ]"
    />
    <ArticleCardsSection
      align="center"
      eyebrow="Success cases"
      title="When our customers succeed, we succeed"
      aria-label="When our customers succeed, we succeed"
      :items="[
        {
          id: 'netshoes',
          href: '/success-cases/netshoes',
          title: 'Netshoes blocks 4M+ threats in 6 months with Azion WAF',
          description:
            'Netshoes strengthened its e-commerce security and improved the shopping experience.',
          meta: 'FEB 4, 2022 • 4 min read',
          mark: {
            name: 'Netshoes',
            logo: netshoesExtendedReversed
          }
        },
        {
          id: 'renner',
          href: '/success-cases/renner',
          title: 'Lojas Renner optimizes its online shopping journey with Azion',
          description: 'Faster product pages allowed Renner to scale its e-commerce platform.',
          meta: 'AUG 10, 2021 • 4 min read',
          mark: { name: 'Renner', logo: rennerExtendedColor }
        },
        {
          id: 'gpa',
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
