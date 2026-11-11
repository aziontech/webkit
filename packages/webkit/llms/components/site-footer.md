# Site Footer

> The footer under every marketing page: the link columns, then the social row beside the status indicator and the language select. It is a page section — the site places it from a `{ _id: 'site-footer', props }` entry and binds `props` straight onto it — and it composes `footer`, `brand`, `icon-button`, `status-indicator` and `select`. From `lg` the Azion mark leads the social row; below it the mark moves to the footer's signature band, so the icons get the row to themselves. The language select keeps its own value locally; its options are the labels the reader sees.

- Import: `import SiteFooter from '@aziontech/webkit/site-footer'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [site-footer.json](https://github.com/aziontech/webkit/blob/main/.specs/site-footer.json)

## When to use

- As the last block of every marketing page.

## Do

- Use `kind: 'site'` under a framed marketing page, so the footer draws the page frame and closes on its bottom rule; the page above must not draw a bottom rule of its own.
- Keep four link columns so the grid fills at `md`.
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
| `columns` | `SiteFooterColumn[]` | `[]` | false | The link columns, in order; each is `{ title, links }` where every link is `{ label, href }`. |
| `socials` | `SiteFooterSocial[]` | `[]` | false | The profile icon buttons, in order; each is `{ icon, label, href }` where `label` names the button for assistive tech. They open in a new tab. |
| `statusLabel` | `string` | `''` | false | Line of the system status indicator; the indicator is not rendered when empty. |
| `languages` | `string[]` | `[]` | false | Options of the language select, as the reader sees them; the first one is selected. The select is not rendered when empty. |
| `languageAriaLabel` | `string` | `''` | false | Accessible name of the language select, also its placeholder. Empty uses the locale catalog (`Language`). |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop on the footer
- From `lg` the Azion mark leads the social row; below `lg` it renders in the footer's signature band
- The status indicator, the language select and the Azion mark each render only when their prop is set
- Server render and hydration: the `lg` check runs only after mount, so the server HTML and the first client render both place the Azion mark in the signature band and match; from `lg` it moves to the social row on mount.

## Accessibility

- Visible focus: the mark link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; links, icon buttons and the select own theirs.
- Keyboard map: `Tab` moves through the column links, the mark, the social buttons and the language select; the select opens with `Enter` / `Space` and moves with the arrows, owned by `select`.
- ARIA: the `footer` is the `contentinfo` landmark named by `ariaLabel`; each column is titled; the mark link is named by `homeAriaLabel`, each social button by its `label`, the select by `languageAriaLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link's opacity transition.
- Touch target ≥40×40 px — owned by `icon-button` and `select`.

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
          href: '#'
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
