# Closing Call To Action Templates

> The close for a page whose last ask is "start from a template": a framed split whose start cell carries the ask — headline, sentence and two actions, start-aligned — over the pixelated, waving texture of the `primary` close, and whose end cell is a scrolling two-column grid of deployable template cards, each with its mark, name, one line and a deploy button, its top and bottom fading out; then the tall hatched closing frame. Below `lg` the cells stack, the ask first. It merges the `primary` close of `closing-call-to-action` with the scrolling template wall of `template-gallery`. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-templates', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `scroll-area`, `card-grid`, `card-grid-cell`, `frame-box` and `texture-material`.

- Import: `import ClosingCallToActionTemplates from '@aziontech/webkit/closing-call-to-action-templates'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [closing-call-to-action-templates.json](https://github.com/aziontech/webkit/blob/main/.specs/closing-call-to-action-templates.json)

## When to use

- To close a framework, solution or developer page on a ready-to-deploy start rather than on a sign-up alone.

## Do

- Give the grid six to eight templates so it overflows its height and reads as scrollable; an even count keeps its two columns full.
- Keep each template line to one short sentence so the cards keep one height.
- Give every card an `href` and set `deployLabel`, or no card shows its deploy button.
- Place it last on the page, right above `site-footer`, after a hatched `section-gap`. It draws the hatched closing frame itself, so nothing follows it inside the page column: no trailing `SectionGap` and no closing `FrameBox` + `TextureMaterial` (the `shells/website` close is for a page that ends on any other band). `webkit/no-gap-after-closing-section` flags the doubled close.

## Don’t

- For a close on one or two link actions → use `closing-call-to-action` (`primary` for the same loud register without the templates).
- For a mid-page band that browses many templates beside its copy → use `template-gallery`.
- For a close whose reader may be an agent → use `closing-call-to-action-agents`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [closing-call-to-action](closing-call-to-action.md) — the `primary` close, centred, without the template grid.
- [template-gallery](template-gallery.md) — a scrolling wall of templates beside its copy, as a mid-page band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` and naming its region; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `ClosingCallToActionTemplatesAction` | `undefined` | false | The white button under the copy; `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent. |
| `secondaryAction` | `ClosingCallToActionTemplatesAction` | `undefined` | false | The outlined button beside the primary one; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `templates` | `ClosingCallToActionTemplatesTemplate[]` | `[]` | false | The template cards of the scrolling grid beside the copy, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped and the grid is omitted when none is left. |
| `deployLabel` | `string` | `''` | false | Label of the deploy button on each card; a card renders its button only when both this and its `href` are set. |
| `templatesAriaLabel` | `string` | `''` | false | Accessible name of the scrolling grid of templates. |

## States

- Visual states: `default`
- Hovering a card shows the pointer cursor and lights its deploy button
- Layout: from `lg` up the ask and the grid sit side by side; below it they stack, the ask first, and the grid drops to one column below `sm`
- Overflow: the grid holds a fixed height (32rem, 38rem from `lg`) and scrolls vertically, its top and bottom fading out
- Empty: when `title` is empty the band renders nothing but its root; without titled templates the grid is omitted and the ask stands alone in the band; a card without `href` (or without `deployLabel`) shows no deploy button

## Accessibility

- Visible focus: owned by the composed `button`s.
- Keyboard map: `Tab` reaches the band's two actions, then the scrolling grid and each card's deploy link in reading order; the arrow keys scroll the focused grid; `Enter` follows a link.
- ARIA: the root is a plain `div`; the split is a `section` region named by `title`, whose headline is the `h2`. The scrolling grid is `scroll-area`'s region named by `templatesAriaLabel`; the texture and the template marks are decorative (`aria-hidden`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): card titles `var(--text-default)`, card lines `var(--text-muted)`; marks flagged `invertInDark` invert under the dark theme.
- `motion-reduce:transition-none motion-reduce:transform-none` — the waving texture, the button hover and the scrolling belong to `texture-material`, `button` and `scroll-area`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the band's actions are large `button`s, the deploy buttons medium.

## Examples

### Default

```vue
<script setup>
  import ClosingCallToActionTemplates from '@aziontech/webkit/closing-call-to-action-templates'

  const primaryAction = {
    label: 'Start for free',
    href: '/signup'
  }

  const secondaryAction = {
    label: 'Browse all templates',
    href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates',
    trailing: true
  }

  const templates = [
    {
      title: 'AI Inference Starter Kit',
      description: 'Run AI models close to your users.',
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
      description: 'A business marketing website built with Astro.',
      icon: 'ai-cor ai-astro',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js AI Chatbot',
      description: 'A server-rendered Next.js App Router AI chatbot.',
      icon: 'ai-cor ai-next',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'SvelteKit Commerce',
      description: 'Ecommerce template built with SvelteKit and Shopify.',
      icon: 'ai-cor ai-svelte',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Multi-tenant Starter',
      description: 'A minimal multi-tenant Next.js starter.',
      icon: 'ai-cor ai-next',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Cosmic Agency Website',
      description: "A template built on Cosmic's React components.",
      icon: 'ai-cor ai-react',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Functions Starter Kit',
      description: 'A “Hello World” originless app powered by functions.',
      icon: 'ai ai-edge-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    }
  ]
</script>

<template>
  <ClosingCallToActionTemplates
    anchor="contact"
    title="Start from a template. Ship it today."
    description="Deploy a ready-made starter in seconds, then make it yours."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
    :templates="templates"
    deploy-label="Deploy"
    templates-aria-label="Templates you can deploy"
  />
</template>
```
