# Template Gallery

> The templates band of a solution page: a framed media split whose copy side invites the reader to start from a template and whose media side is a scrolling two-column wall of deployable template cards, closed by a ticker of the frameworks and clouds it works with. Each card is a mark, a title, one line and a deploy action. It is a page section — the site places it from a `{ _id: 'template-gallery', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `media-split`, `scroll-area`, `card-grid`, `button`, `frame-box` and `ticker` rather than owning any anatomy of its own.

- Import: `import TemplateGallery from '@aziontech/webkit/template-gallery'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [template-gallery.json](https://github.com/aziontech/webkit/blob/main/.specs/template-gallery.json)

## When to use

- On a solution page (Retail, Web Apps, AI Workloads, Security, Performance, Streaming) to show the templates a reader can deploy right away.
- Whenever a band pairs one pitch with a long, browsable list of deployable starters.

## Do

- Keep the wall to an even number of templates so the two columns end level.
- Turn on `invertInDark` only for a mark whose artwork ships in dark ink, so it stays legible on the dark theme.
- Set `templatesAriaLabel` so the scrolling wall is announced by name.

## Don’t

- For a grid of features with artwork → use `feature-tiles`.
- For a ticker of marks alone → compose `ticker` directly.
- For a handful of icon-led use cases → use `use-cases`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-split](media-split.md) — the framed copy-and-media split the band is built on; it owns the band's named region.
- [ticker](ticker.md) — the row of framework and cloud marks that closes the band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the media split as its `h2` and naming its region. |
| `description` | `string` | `''` | false | Paragraph under the headline. |
| `primaryAction` | `TemplateGalleryAction` | `undefined` | false | First button under the copy, drawn as the large secondary button; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `secondaryAction` | `TemplateGalleryAction` | `undefined` | false | Second button under the copy, drawn as the large outlined button; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `templates` | `TemplateGalleryTemplate[]` | `[]` | false | The template cards of the scrolling wall, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped. |
| `deployLabel` | `string` | `''` | false | Label of the deploy button on each card; a card renders its button only when both this and its `href` are set. |
| `templatesAriaLabel` | `string` | `''` | false | Accessible name of the scrolling wall of templates. |
| `tickerLabel` | `string` | `''` | false | Overline above the row of marks. |
| `tickerMarks` | `string[]` | `[]` | false | Registry names of the frameworks and clouds in the row of marks, in order; the ticker is omitted when empty. |

## Assets

- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: `default`
- Hovering a card lights its deploy button
- Empty: when no template carries a title the band renders nothing — not the split, not the ticker

## Accessibility

- Visible focus: owned by the composed `button`s and the `scroll-area`.
- Keyboard map: `Tab` reaches the copy's actions, the scrolling wall and each card's deploy link in reading order; `Enter` follows a link. Nothing else in the band is interactive.
- ARIA: the band's root is a plain `div`, because `media-split` already renders the band's region named by its title; the wall is `scroll-area`'s region named by `templatesAriaLabel`; the template marks are decorative (`aria-hidden`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): card titles `var(--text-default)`, card lines `var(--text-muted)`; marks flagged `invertInDark` invert under the dark theme.
- `motion-reduce:transition-none motion-reduce:transform-none` — the button hover and the ticker scroll belong to `button` and `ticker`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the deploy buttons are medium `button`s, the copy's actions are large.

## Examples

### Default

```vue
<script setup>
  import TemplateGallery from '@aziontech/webkit/template-gallery'
</script>

<template>
  <TemplateGallery
    eyebrow="Your Stack, Your Way"
    title="Quick Start with Templates"
    description="Launch storefronts faster with pre-built templates and starter kits. Deploy complete projects in seconds with popular frameworks."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
    :templates="[
      {
        title: 'AI Inference Starter Kit',
        description: 'Create an application that runs AI models close to users.',
        icon: 'ai ai-edge-functions',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      },
      {
        title: 'Next.js Commerce',
        description: 'Ecommerce template built with Next.js and Shopify.',
        icon: 'ai-cor ai-next',
        invertInDark: true,
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      },
      {
        title: 'Astro Odyssey',
        description: 'A modern business marketing website theme/starter built with Astro.',
        icon: 'ai-cor ai-astro',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      },
      {
        title: 'SvelteKit Commerce',
        description: 'Ecommerce template built with SvelteKit and Shopify.',
        icon: 'ai-cor ai-svelte',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      }
    ]"
    deploy-label="Deploy now"
    templates-aria-label="Templates you can deploy"
    ticker-label="Compatible with Your Stack"
    :ticker-marks="['nextjs', 'astro', 'react', 'vue', 'angular', 'nuxt']"
  />
</template>
```
