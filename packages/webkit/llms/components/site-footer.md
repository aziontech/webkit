# Site Footer

> The footer under every marketing page: the link columns, then the social row beside the status indicator and the language select. It is a page section — the site places it from a `{ _id: 'site-footer', props }` entry and binds `props` straight onto it — and it composes `footer`, `brand`, `icon-button`, `status-indicator` and `select`. From `md` the Azion mark leads the social row and the status indicator sits beside the language select on the bottom bar; below `md`, as on azion.com, there is no mark and no signature band, and the status indicator stacks over the language select, both at the start. The layout is CSS only, so the server HTML and the hydrated page are the same tree. The language select keeps its own value unless the page binds `v-model:language`; its options are the labels the reader sees.

- Import: `import SiteFooter from '@aziontech/webkit/site-footer'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [site-footer.json](https://github.com/aziontech/webkit/blob/main/.specs/site-footer.json)

## When to use

- As the last block of every marketing page.

## Do

- **Do** render it as the last child of the page shell, as is: it draws its own top rule, its frame and its closing bottom rule.
- **Don't** wrap it in a bordered or padded `div` (`border-t`, `py-*`): the rules double and the frame drifts off the page column.
- Use `kind: 'site'` under a framed marketing page, so the footer draws the page frame and closes on its bottom rule; the page above must not draw a bottom rule of its own.
- Keep four link columns so the grid fills at `md`.
- Set `external: true` on a link that leaves azion.com (Community, Status): it opens in a new tab, draws the external-link glyph after the label and tells assistive tech it opens a new tab. Never add the glyph or `target` yourself.
- Give every social link a `label` that names the network, since the button shows only the glyph.

## Don’t

- Inside the product console or the docs → compose `footer` directly.
- For a closing ask above the footer → use `closing-call-to-action`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [footer](footer.md) — the composition footer this section fills.
- [closing-call-to-action](closing-call-to-action.md) — the band that sits right above it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `SiteFooterKind` | `'site'` | false | Where the footer sits: `site` closes a framed marketing page and draws its frame, `content` runs the bands full bleed. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the footer landmark. Empty uses the locale catalog (`Footer`). |
| `home` | `string` | `''` | false | Destination of the Azion mark; the mark is not rendered when empty. |
| `homeAriaLabel` | `string` | `''` | false | Accessible name of the Azion mark link. Empty uses the locale catalog (`Azion home`). |
| `columns` | `SiteFooterColumn[]` | `[]` | false | The link columns, in order; each is `{ title, links }` where every link is `{ label, href, external? }`; an `external` link opens in a new tab and closes on the external-link glyph. |
| `socials` | `SiteFooterSocial[]` | `[]` | false | The profile icon buttons, in order; each is `{ icon, label, href }` where `label` names the button for assistive tech. They open in a new tab. |
| `statusLabel` | `string` | `''` | false | Line of the system status indicator; the indicator is not rendered when empty. |
| `languages` | `string[]` | `[]` | false | Options of the language select, as the reader sees them; the first one is selected until `v-model:language` holds another. The select is not rendered when empty. |
| `languageAriaLabel` | `string` | `''` | false | Accessible name of the language select, also its placeholder. Empty uses the locale catalog (`Language`). |
| `language` | `string` | `''` | false | Two-way value (`v-model:language`). |

## v-model

| Model              | Type     | Default | Emits             | Notes                                                                                                                                                                                              |
| ------------------ | -------- | ------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:language` | `string` | `''`    | `update:language` | The chosen option of the language select, one of `languages`. Empty shows the first option; choosing one emits it, so the page can switch its locale. Unbound, the select keeps its value locally. |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop on the footer
- The footer never renders a signature band, so it ends on its social row on every width; the Azion mark leads the social row from `md` and is not shown below it
- Below `md` the status indicator stacks over the language select at the start of the bottom bar; from `md` they sit side by side at its end
- The status indicator, the language select and the Azion mark each render only when their prop is set
- An `external` link sets `target="_blank"` and `rel="noopener noreferrer"`, draws the `pi pi-external-link` glyph after its label in the label's own colour (hidden from assistive tech) and appends the catalog's “(opens in a new tab)” as screen-reader text
- Server render and hydration: the mark is always in the DOM and CSS shows it from `md`, so the server HTML, the first client render and every later render are the same tree — nothing moves on mount.

## Accessibility

- Visible focus: the mark link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; links, icon buttons and the select own theirs.
- Keyboard map: `Tab` moves through the column links, the mark, the social buttons and the language select; the select opens with `Enter` / `Space` and moves with the arrows, owned by `select`.
- ARIA: the `footer` is the `contentinfo` landmark named by `ariaLabel`; each column is titled; the mark link is named by `homeAriaLabel`, each social button by its `label`, the select by `languageAriaLabel`; an external link's name ends with “(opens in a new tab)” from the locale catalog.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link's opacity transition.
- Touch target ≥40×40 px — owned by `icon-button` and `select`; the column links and the Azion mark link rely on the WCAG 2.5.8 spacing exception (see Responsive).

## Right-to-left

- Layout: logical utilities only (`me-` on the mark); the bottom bar's start and end follow the direction.
- Icons: the external-link glyph, the social glyphs and the globe are not mirrored.
- Keyboard: no arrow-key handling of its own; the select owns its arrows.
- User data: none.

## Internationalization

| Key                   | English source       | Override prop       |
| --------------------- | -------------------- | ------------------- |
| `siteFooter.label`    | Footer               | `ariaLabel`         |
| `siteFooter.home`     | Azion home           | `homeAriaLabel`     |
| `siteFooter.language` | Language             | `languageAriaLabel` |
| `siteFooter.newTab`   | (opens in a new tab) | —                   |

- Formatting: none; link labels, the status line and the language options are the page's own text.

## Responsive

- Container queries: none; the bottom bar switches at the `md` viewport breakpoint.
- Narrow (below `md`, 768 px; the footer reads the viewport, not its container): no Azion mark; the status indicator stacks over the language select at the start of the bar; the columns stack as `footer` lays them out.
- Touch: social buttons and the select follow `icon-button` and `select`; the column links (26 px apart) and the Azion mark link (16 px tall, clear of the social buttons) are smaller than 24 px and rely on the WCAG 2.5.8 spacing exception; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import SiteFooter from '@aziontech/webkit/site-footer'

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
          external: true
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
      icon: 'pi pi-github',
      label: 'Azion on GitHub',
      href: 'https://github.com/aziontech'
    },
    {
      icon: 'pi pi-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    {
      icon: 'pi pi-youtube',
      label: 'Azion on YouTube',
      href: 'https://www.youtube.com/aziontech'
    },
    {
      icon: 'ai ai-x',
      label: 'Azion on X',
      href: 'https://x.com/aziontech'
    },
    {
      icon: 'pi pi-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    {
      icon: 'pi pi-discord',
      label: 'Azion on Discord',
      href: 'https://discord.gg/azion'
    },
    {
      icon: 'pi pi-reddit',
      label: 'Azion on Reddit',
      href: 'https://www.reddit.com/r/aziontech'
    }
  ]

  const languages = ['EN', 'PT-BR', 'ES']
</script>

<template>
  <SiteFooter
    kind="site"
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
  import SiteFooter from '@aziontech/webkit/site-footer'
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
    <SiteFooter
      v-model:language="language"
      kind="content"
      home="#"
      :columns="columns"
      :languages="['EN', 'PT-BR', 'ES']"
    />
    <p class="px-(--spacing-md) text-body-sm text-(--text-muted)">Page language: {{ language }}</p>
  </div>
</template>
```
