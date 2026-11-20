# Site Footer Section

> The footer under every marketing page: the link columns, then the social row beside the status indicator and the language select. It is a page section — the site places it from a `{ _id: 'site-footer-section', props }` entry and binds `props` straight onto it — and it composes `footer`, `brand`, `icon-button`, `status-indicator` and `language-select`. The bottom bar is one row, as azion.com draws it: the Azion mark (the footer's `brand` slot) and the small social icon buttons at the start, the status indicator (`status`) and the compact language switcher, a `LanguageSelect` with `variant="ghost"` (round flag and country code, `language`), at the end; below `md` it stacks, the mark and icons over the status and language. In the `site` placement the footer spans the page like `site-header-section`, opening on a full-width rule with a corner mark at each end, with no side rules. The layout is CSS only, so the server HTML and the hydrated page are the same tree. The language select keeps its own value unless the page binds `v-model:language`; its options are BCP 47 tags (`EN`, `PT-BR`, `ES`), each shown with its round flag and its name in its own language.

- Import: `import SiteFooterSection from '@aziontech/webkit/site-footer-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [site-footer-section.json](site-footer-section.json)

## When to use

- Use SiteFooterSection for the marketing site footer from page JSON.
- Rendering page JSON, or you need a whole band with no custom content → the section (`site-footer-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`footer`).
- As the last block of every marketing page.

## Do

- **Do** render it as the last child of the page shell, as is: in `site` it draws its own full-width top rule with its corner marks.
- **Don't** wrap it in a bordered or padded `div` (`border-t`, `py-*`): the rules double.
- Use `variant: 'site'` under a marketing page, so the footer spans the page like its header and opens on its own rule; the page above must not draw a bottom rule of its own.
- Keep four link columns so the grid fills at `md`.
- Set `target: '_blank'` on a link that leaves azion.com (Community, Status): it opens in a new tab, draws the external-link glyph after the label and tells assistive tech it opens a new tab. Never add the glyph yourself.
- Give every social link a `label` that names the network, since the button shows only the glyph.

## Don’t

- Inside the product console or the docs → compose `footer` directly.
- For a closing ask above the footer → use `closing-call-to-action-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [footer](footer.md) — the composition footer this section fills.
- [closing-call-to-action-section](closing-call-to-action-section.md) — the band that sits right above it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `SiteFooterSectionVariant` | `'site'` | false | Where the footer sits: `site` spans the page like the site header under its own top rule, `content` runs the bands full bleed under a hairline. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the footer landmark. Empty uses the locale catalog (`Footer`). |
| `home` | `string` | `''` | false | Destination of the Azion mark; the mark is not rendered when empty. |
| `homeAriaLabel` | `string` | `''` | false | Accessible name of the Azion mark link. Empty uses the locale catalog (`Azion home`). |
| `columns` | `SiteFooterSectionColumn[]` | `[]` | false | The link columns, in order; each is `{ title, links }` where every link is `{ label, href, target? }`; a `_blank` link opens in a new tab and closes on the external-link glyph. |
| `socials` | `SiteFooterSectionSocial[]` | `[]` | false | The profile icon buttons, in order; each is `{ icon, label, href }` where `label` names the button for assistive tech. They open in a new tab. |
| `statusLabel` | `string` | `''` | false | Line of the system status indicator; the indicator is not rendered when empty. |
| `languages` | `string[]` | `[]` | false | BCP 47 tags of the languages offered (`EN`, `PT-BR`, `ES`); each shows its round flag and its name in its own language, and the first one is selected until `v-model:language` holds another. The language select is not rendered when empty. |
| `languageAriaLabel` | `string` | `''` | false | Accessible name of the language select, also its placeholder. Empty uses the locale catalog (`Language`). |
| `language` | `string` | `''` | false | Two-way value (`v-model:language`). |

## v-model

| Model              | Type     | Default | Emits             | Notes                                                                                                                                                                                              |
| ------------------ | -------- | ------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:language` | `string` | `''`    | `update:language` | The chosen option of the language select, one of `languages`. Empty shows the first option; choosing one emits it, so the page can switch its locale. Unbound, the select keeps its value locally. |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop on the footer
- The Azion mark opens the bottom bar at every width, in the footer's `brand` slot
- The status indicator sits in the footer's `status` slot and the language select in its `language` slot; below `md` they share the bottom bar at its two ends, from `md` they sit side by side at its end
- The social buttons are small icon buttons
- The status indicator, the language select and the Azion mark each render only when their prop is set
- A link whose `target` is `_blank` sets `rel="noopener noreferrer"` and `data-external`, draws the `az az-external-link` glyph after its label in the label's own colour (hidden from assistive tech) and appends the catalog's “(opens in a new tab)” as screen-reader text
- Server render and hydration: one mark, placed by CSS only, so the server HTML, the first client render and every later render are the same tree — nothing moves on mount.

## Accessibility

- Visible focus: the mark link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; links, icon buttons and the select own theirs.
- Keyboard map: `Tab` moves through the column links, the mark, the social buttons and the language select; the select opens with `Enter` / `Space` and moves with the arrows, owned by `language-select`.
- ARIA: the `footer` is the `contentinfo` landmark named by `ariaLabel`; each column is titled; the mark link is named by `homeAriaLabel`, each social button by its `label`, the select by `languageAriaLabel`; an external link's name ends with “(opens in a new tab)” from the locale catalog.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link's opacity transition.
- Touch target ≥24×24 px — the social buttons are small `icon-button`s (28 px, above the 24 px WCAG 2.5.8 minimum; the design keeps the social row quiet), the language select follows `language-select` (32 px, `medium`); the column links and the Azion mark link rely on the WCAG 2.5.8 spacing exception (see Responsive).

## Right-to-left

- Layout: logical utilities only; the Azion mark stays at the start edge and the bottom bar's start and end follow the direction.
- Icons: the external-link glyph, the social glyphs and the language flags are not mirrored.
- Keyboard: no arrow-key handling of its own; the select owns its arrows.
- User data: none.

## Internationalization

| Key                          | English source       | Override prop       |
| ---------------------------- | -------------------- | ------------------- |
| `siteFooterSection.label`    | Footer               | `ariaLabel`         |
| `siteFooterSection.home`     | Azion home           | `homeAriaLabel`     |
| `siteFooterSection.language` | Language             | `languageAriaLabel` |
| `common.newTab`              | (opens in a new tab) | —                   |

- Formatting: none; link labels, the status line and the language options are the page's own text.

## Responsive

- Container queries: none; the bottom bar switches at the `md` viewport breakpoint.
- Narrow (below `md`, 768 px; the footer reads the viewport, not its container): the bottom bar stacks — the Azion mark and the social icons first, then the status indicator and the language select at its two ends — and the columns fold to two as `footer` lays them out.
- Touch: the small social buttons (28 px) and the select follow `icon-button` and `language-select`; the column links (26 px apart) and the Azion mark link (16 px tall, clear of the social buttons) are smaller than 24 px and rely on the WCAG 2.5.8 spacing exception; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import SiteFooterSection from '@aziontech/webkit/site-footer-section'

  const columns = [
    {
      title: 'Products',
      links: [
        {
          label: 'Functions',
          href: '#'
        },
        {
          label: 'Cache',
          href: '#'
        },
        {
          label: 'Object Storage',
          href: '#'
        },
        {
          label: 'SQL Database',
          href: '#'
        },
        {
          label: 'WAF',
          href: '#'
        },
        {
          label: 'Edge DNS',
          href: '#'
        },
        {
          label: 'Data Stream',
          href: '#'
        }
      ]
    },
    {
      title: 'Solutions',
      links: [
        {
          label: 'Web Apps',
          href: '#'
        },
        {
          label: 'AI',
          href: '#'
        },
        {
          label: 'Application Security',
          href: '#'
        },
        {
          label: 'Financial Services',
          href: '#'
        },
        {
          label: 'Retail',
          href: '#'
        },
        {
          label: 'Technology',
          href: '#'
        }
      ]
    },
    {
      title: 'Developers',
      links: [
        {
          label: 'Docs',
          href: '#'
        },
        {
          label: 'API Reference',
          href: '#'
        },
        {
          label: 'Dev Tools',
          href: '#'
        },
        {
          label: 'Release Notes',
          href: '#'
        },
        {
          label: 'Marketplace',
          href: '#'
        },
        {
          label: 'Status',
          href: '#',
          target: '_blank'
        }
      ]
    },
    {
      title: 'Company',
      links: [
        {
          label: 'About',
          href: '#'
        },
        {
          label: 'Customers',
          href: '#'
        },
        {
          label: 'Partners',
          href: '#'
        },
        {
          label: 'Careers',
          href: '#'
        },
        {
          label: 'Blog',
          href: '#'
        },
        {
          label: 'Contact',
          href: '#'
        }
      ]
    }
  ]

  const socials = [
    {
      icon: 'az az-github',
      label: 'Azion on GitHub',
      href: 'https://github.com/aziontech'
    },
    {
      icon: 'az az-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    {
      icon: 'az az-youtube',
      label: 'Azion on YouTube',
      href: 'https://www.youtube.com/aziontech'
    },
    {
      icon: 'az az-x-brand',
      label: 'Azion on X',
      href: 'https://x.com/aziontech'
    },
    {
      icon: 'az az-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    {
      icon: 'az az-discord',
      label: 'Azion on Discord',
      href: 'https://discord.gg/azion'
    },
    {
      icon: 'az az-reddit',
      label: 'Azion on Reddit',
      href: 'https://www.reddit.com/r/aziontech'
    }
  ]

  const languages = ['EN', 'PT-BR', 'ES']
</script>

<template>
  <SiteFooterSection
    variant="site"
    aria-label="Footer"
    home="#"
    home-aria-label="Azion home"
    :columns="columns"
    :socials="socials"
    status-label="All Systems Operational"
    :languages="languages"
    language-aria-label="Language"
  />
</template>
```

### Language

```vue
<script setup>
  import SiteFooterSection from '@aziontech/webkit/site-footer-section'
  import { ref } from 'vue'

  const columns = [
    {
      title: 'Company',
      links: [
        { label: 'About us', href: '#' },
        { label: 'Careers', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Blog', href: '#' }
      ]
    }
  ]

  const language = ref('PT-BR')
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-md)">
    <SiteFooterSection
      v-model:language="language"
      variant="content"
      home="#"
      :columns="columns"
      :languages="['EN', 'PT-BR', 'ES']"
    />
    <p class="px-(--spacing-md) text-body-sm text-(--text-muted)">Page language: {{ language }}</p>
  </div>
</template>
```
