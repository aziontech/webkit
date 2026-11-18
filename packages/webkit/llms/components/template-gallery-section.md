# Template Gallery Section

> The templates band of a solution page: a framed media split whose copy side invites the reader to start from a template and whose media side is a scrolling two-column wall of deployable template cards, closed by a marquee of the frameworks and clouds it works with. Each card is a mark, a title, one line and a deploy action. It is a page section — the site places it from a `{ _id: 'template-gallery-section', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `media-split`, `scroll-area`, `card-grid`, `button`, `registration-frame` and `marquee` rather than owning any anatomy of its own. With `closing` set it is the page's closing band: the hatched closing frame follows it, with no rules of its own, because the site footer under it opens with one (`hatch` turns that frame off when another closing band stacks directly below and draws the shared one).

- Import: `import TemplateGallerySection from '@aziontech/webkit/template-gallery-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [template-gallery-section.json](template-gallery-section.json)

## When to use

- Use TemplateGallerySection on marketing pages to show deployable templates; set `closing` when it is the last band.
- On a solution page (Retail, Web Apps, AI Workloads, Security, Performance, Streaming) to show the templates a reader can deploy right away.
- Whenever a band pairs one pitch with a long, browsable list of deployable starters.

## Do

- Keep the wall to an even number of templates so the two columns end level.
- Turn on `invertInDark` only for a mark whose artwork ships in dark ink, so it stays legible on the dark theme.
- Set `templatesAriaLabel` so the scrolling wall is announced by name.
- Set `closing` only on the last band of the page, right above `site-footer-section`: it draws the hatched closing frame itself, so nothing follows it inside the page column (no trailing `SectionGap`, no closing `RegistrationFrame`).
- Turn `hatch` off only on a closing band that another closing band follows directly; the last one keeps the frame.

## Don’t

- For a grid of features with artwork → use `feature-tiles-section`.
- For a marquee of marks alone → compose `marquee` directly.
- For a handful of icon-led use cases → use `customer-use-cases-section`.
- For a closing ask with links or a command and no templates → use `closing-call-to-action-section`; for an email sign-up close → use `newsletter-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-split](media-split.md) — the framed copy-and-media split the band is built on; it owns the band's named region.
- [marquee](marquee.md) — the row of framework and cloud marks that closes the band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Eyebrow above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the media split as its `h2` and naming its region. |
| `description` | `string` | `''` | false | Paragraph under the headline. |
| `primaryAction` | `SectionTitleAction` | `undefined` | false | First button under the copy, drawn as the large secondary button; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `secondaryAction` | `SectionTitleAction` | `undefined` | false | Second button under the copy, drawn as the large outlined button; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `templates` | `TemplateGallerySectionTemplate[]` | `[]` | false | The template cards of the scrolling wall, in order; each is `{ title, description?, icon?, invertInDark?, href? }` where `href` makes the whole card a link to the template. Templates without a title are skipped. |
| `deployLabel` | `string` | `''` | false | Label of the deploy button on each card; a card renders its button only when both this and its `href` are set. |
| `templatesAriaLabel` | `string` | `''` | false | Accessible name of the scrolling wall of templates. |
| `marqueeLabel` | `string` | `''` | false | Eyebrow above the row of marks. |
| `marqueeMarks` | `string[]` | `[]` | false | Registry names of the frameworks and clouds in the row of marks, in order; the marquee is omitted when empty. |
| `closing` | `boolean` | `false` | false | Makes the band the page's closing band: the hatched closing frame follows it, as the closing call to action draws it. |
| `hatch` | `boolean` | `true` | false | Draws the hatched closing frame under a `closing` band; turn it off when another closing band stacks directly below and draws the shared frame. Ignored without `closing`. |

## Assets

- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Marquee` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: `default`
- A card with an `href` is a link target as a whole: a click anywhere on it follows the `href` (and a modified or middle click opens it in a new tab, as any link does), the pointer turns to the hand over it, and hovering it lights its deploy button. With a deploy button the card keeps one tab stop — the button — and the card-wide link is a pointer-only target hidden from assistive technology; without a deploy button the card-wide link is the card's one tab stop, named by the template title
- A card without an `href` is not interactive: no hand pointer, no hover light
- Empty: when no template carries a title the band renders nothing — not the split, not the marquee, not the closing frame
- `closing`: the tall hatched closing frame (`data-hatch="true"`, decorative) follows the band; `hatch` off drops it

## Accessibility

- Visible focus: owned by the composed `button`s and the `scroll-area`; a card-wide link that is a card's only tab stop draws `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset` over the card.
- Keyboard map: `Tab` reaches the copy's actions, the scrolling wall and each card's one link (its deploy button, or the card itself when it has none) in reading order; `Enter` follows a link. Nothing else in the band is interactive.
- ARIA: the band's root is a plain `div`, because `media-split` already renders the band's region named by its title; the wall is `scroll-area`'s region named by `templatesAriaLabel`; the template marks and the closing frame are decorative (`aria-hidden`, or no content); a card-wide link duplicated by a deploy button is `aria-hidden` with `tabindex="-1"`, so each card is announced once.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): card titles `var(--text-default)`, card lines `var(--text-muted)`; marks flagged `invertInDark` invert under the dark theme.
- `motion-reduce:transition-none motion-reduce:transform-none` — the button hover and the marquee scroll belong to `button` and `marquee`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the deploy buttons are medium `button`s, the copy's actions are large.

## Right-to-left

- Layout: logical utilities and the composed components' own mirroring, so the ask and the template grid follow the reading direction.
- Icons: action chevrons mirror (owned by `button`).
- Keyboard: unchanged.

## Internationalization

- No built-in strings: every visible string arrives through props.

## Responsive

- The composed `media-split` splits on its own width: from a band 60rem wide the ask and the template grid sit side by side as two equal halves, in a docs preview as on a full-width page; a narrower band (a phone, a tablet, a narrow column) stacks the ask over the grid.
- The headline keeps two lines from the split up: in a band 60 to 72rem wide the large copy cell pads `var(--spacing-xl)` instead of `var(--spacing-2xl)` (owned by `media-split`), which leaves the `heading-xl` headline room for its longest line. It wraps naturally (`text-wrap: balance` from the type scale); no line breaks are written into the copy.
- The template grid keeps two columns inside its half; titles and descriptions wrap, and each deploy button stays inside its card.
- The grid scrolls inside its `scroll-area`, at least 36rem tall and 44rem once the band splits (the root is a size container for this).
- No horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import TemplateGallerySection from '@aziontech/webkit/template-gallery-section'
</script>

<template>
  <TemplateGallerySection
    anchor="templates"
    eyebrow="Your Stack, Your Way"
    title="Quick Start with Templates"
    description="Launch storefronts faster with pre-built templates and starter kits. Deploy complete projects in seconds with popular frameworks."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
    :templates="[
      {
        title: 'AI Inference Starter Kit',
        description: 'Create an application that runs AI models close to users.',
        icon: 'az az-functions',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      },
      {
        title: 'Next.js Commerce',
        description: 'Ecommerce template built with Next.js and Shopify.',
        icon: 'az-color az-nextjs',
        invertInDark: true,
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      },
      {
        title: 'Astro Odyssey',
        description: 'A modern business marketing website theme/starter built with Astro.',
        icon: 'az-color az-astro',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      },
      {
        title: 'SvelteKit Commerce',
        description: 'Ecommerce template built with SvelteKit and Shopify.',
        icon: 'az-color az-svelte',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
      }
    ]"
    deploy-label="Deploy now"
    templates-aria-label="Templates you can deploy"
    marquee-label="Compatible with Your Stack"
    :marquee-marks="['nextjs', 'astro', 'react', 'vue', 'angular', 'nuxt']"
  />
</template>
```

### Closing

```vue
<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import TemplateGallerySection from '@aziontech/webkit/template-gallery-section'

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
      icon: 'az az-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Commerce',
      description: 'Ecommerce template built with Next.js and Shopify.',
      icon: 'az-color az-nextjs',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Astro Odyssey',
      description: 'A business marketing website built with Astro.',
      icon: 'az-color az-astro',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js AI Chatbot',
      description: 'A server-rendered Next.js App Router AI chatbot.',
      icon: 'az-color az-nextjs',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'SvelteKit Commerce',
      description: 'Ecommerce template built with SvelteKit and Shopify.',
      icon: 'az-color az-svelte',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Multi-tenant Starter',
      description: 'A minimal multi-tenant Next.js starter.',
      icon: 'az-color az-nextjs',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Cosmic Agency Website',
      description: "A template built on Cosmic's React components.",
      icon: 'az-color az-react',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Functions Starter Kit',
      description: 'A “Hello World” originless app powered by functions.',
      icon: 'az az-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <TemplateGallerySection
      closing
      anchor="contact"
      title="Start from a template. Ship it today."
      description="Deploy a ready-made starter in seconds, then make it yours."
      :primary-action="primaryAction"
      :secondary-action="secondaryAction"
      :templates="templates"
      deploy-label="Deploy"
      templates-aria-label="Templates you can deploy"
      :hatch="false"
    />
    <SectionGap hatch />

    <ClosingCallToActionSection
      variant="panel"
      title="Ready to talk?"
      description="Tell us what you are building and a specialist will reach out."
      :primary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
    />
  </SectionContainer>
</template>
```
