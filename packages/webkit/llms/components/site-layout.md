# Site Layout

> The marketing site's chrome, composed once in the app: `SiteNav` on top, the page's sections in the layout's `<main>`, `SiteFooter` at the foot, and the `Command` search palette wired to the bar's search button and to ⌘K / Ctrl K. The navigation and the footer are data (the `SiteNav` and `SiteFooter` props), the canvas is painted with the theme tokens so a dark site never shows an unpainted page below the fold, and the palette lists every destination of the navigation by default. Site pages are only their sections, rendered through the default slot; they never repeat the bar or the footer.

- Import: `import SiteLayout from '@aziontech/webkit/site-layout'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [site-layout.json](https://github.com/aziontech/webkit/blob/main/.specs/site-layout.json)

## When to use

- Every public marketing page (home, product, solution, company, legal): put one `SiteLayout` in the app's root (around `RouterView`) and render each page's sections as its default slot.
- A site that needs the Azion navigation, footer and search palette without hand-composing `GlobalHeader`, `NavigationMenu`, `Footer`, `SearchTrigger` and `Command`.

## Do

- Compose the layout once, in the app's root; each route renders only its sections. Never add `SiteNav`, `SiteFooter`, `GlobalHeader` or `Footer` to a page.
- The site is dark: set `data-theme="dark"` on `<html>` (in `index.html`), so the layout, the teleported menus and the palette all resolve the dark tokens.
- Bind the real navigation and footer data once (`navigation`, `footer`); give every navigation item an `href` so it also appears in the search palette.
- Add extra palette groups (articles, docs results) in the `search` slot; listen to `search-select` for them.
- The page renders no `<main>` of its own: the layout owns the landmark.

## Don’t

- The signed-in console → `ConsoleLayout`. Documentation → `DocLayout`.
- A one-off landing page with no site navigation (a campaign form) → render the sections on their own.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- SiteNav` — the bar and its mega-menus; `navigation` is bound onto it.
- SiteFooter` — the footer; `footer` is bound onto it (`kind="site"` closes a framed page).
- SectionContainer`, `SectionGap` — the frame the page's sections stack in, inside the slot.
- Command` — the search palette the bar's search button opens.
- shells/website` — the block that shows this layout with the azion.com navigation and footer.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `navigation` | `SiteLayoutNavigation` | `—` | true | The bar, bound onto `SiteNav`: `{ menus, home?, links?, contact?, primaryAction?, secondaryAction?, secondaryActionOnPhones? }`. |
| `footer` | `SiteLayoutFooter` | `undefined` | false | The footer, bound onto `SiteFooter`: `{ kind?, home?, columns?, socials?, statusLabel?, languages? }`; `kind` defaults to `site`. No footer when absent. |
| `searchPlaceholder` | `string` | `''` | false | Placeholder of the palette's input. Empty uses the locale catalog (`Search the site`). |
| `searchOpen` | `boolean` | `false` | false | Two-way value (`v-model:searchOpen`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `navigate` | `(event: MouseEvent \| KeyboardEvent, page: SiteLayoutPage)` | Fired when a navigation destination is chosen in the palette (`{ label, href }`); the layout then follows it (with the app's router for an in-site path). Event first. |
| `search-select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fired when a palette item from the `search` slot is chosen. Event first. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The page's sections, rendered inside the layout's `<main>`. |
| `search` | { query: string } | Extra `Command.Group`s listed before the navigation destinations. |

## v-model

| Model                 | Type      | Default | Emits               | Notes                                                                               |
| --------------------- | --------- | ------- | ------------------- | ----------------------------------------------------------------------------------- |
| `v-model:search-open` | `boolean` | `false` | `update:searchOpen` | Whether the search palette is open; the bar's search button and ⌘K / Ctrl K set it. |

## States

- Visual states: `default`; the palette `open` / `closed`; the bar's sheet and mega-menus own their states (`SiteNav`).
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid` (the sections own their states).

## Accessibility

- Landmarks: the bar is the `SiteNav` banner named "Azion"; the sections are inside the layout's single `<main>`; the footer is the `SiteFooter` `contentinfo`. A page must not render a second `<main>`.
- Keyboard map: `Tab` runs bar → page → footer; `⌘K` / `Ctrl K` opens the palette (owned by `Command`); in the palette `ArrowUp` / `ArrowDown` move, `Enter` chooses, `Escape` closes and returns focus. The bar's menus and sheet own their keyboard models.
- Visible focus and contrast: owned by the composed components; the canvas tokens keep text ≥ 4.5:1 in light and dark.

## Right-to-left

- Layout: logical utilities only; `SiteNav` and `SiteFooter` mirror their own rows.
- Icons: none of its own.
- Keyboard: arrow handling is `Command`'s and `SiteNav`'s, both direction-aware.
- User data: destination labels render inside `Command.Item` with `dir="auto"`.

## Internationalization

| Key                            | English source                 | Override prop       |
| ------------------------------ | ------------------------------ | ------------------- |
| `siteLayout.searchPlaceholder` | `Search the site`              | `searchPlaceholder` |
| `siteLayout.searchEmpty`       | `No page matches your search.` | —                   |
| `siteLayout.pages`             | `Pages`                        | —                   |

- Formatting: none. Navigation and footer text is consumer data.

## Responsive

- Container queries: none of its own; `SiteNav` switches to its sheet below `xl` and `SiteFooter` reflows its rows.
- Narrow: the main column is full width; the sections own their measure (`SectionContainer`).
- Touch: owned by the composed components.
- Reflow: no horizontal scroll at 320 px; the page scrolls the document (no inner scroll area), so a full-page capture shows the whole page.

## Examples

### Default

```vue
<script setup lang="ts">
  import HeroBand from '@aziontech/webkit/hero-band'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SiteLayout, {
    type SiteLayoutFooter,
    type SiteLayoutNavigation
  } from '@aziontech/webkit/site-layout'

  const navigation: SiteLayoutNavigation = {
    home: '/en/',
    menus: [
      {
        value: 'products',
        label: 'Products',
        columns: [
          [
            {
              label: 'Build',
              items: [
                {
                  label: 'Functions',
                  description: 'Run serverless code close to your users',
                  href: '/en/products/functions/'
                },
                {
                  label: 'Applications',
                  description: 'Deliver and accelerate your applications',
                  href: '/en/products/applications/'
                }
              ]
            }
          ],
          [
            {
              label: 'Secure',
              items: [
                {
                  label: 'Firewall',
                  description: 'Stop attacks before they reach your origin',
                  href: '/en/products/firewall/'
                }
              ]
            }
          ]
        ]
      }
    ],
    links: [{ label: 'Pricing', href: '/en/pricing/' }],
    contact: { label: 'Contact', href: '/en/contact/' },
    secondaryAction: { label: 'Login', href: 'https://console.azion.com/login' },
    primaryAction: { label: 'Start for free', href: 'https://console.azion.com/signup' }
  }

  const footer: SiteLayoutFooter = {
    home: '/en/',
    columns: [
      {
        title: 'Products',
        links: [
          { label: 'Functions', href: '/en/products/functions/' },
          { label: 'Firewall', href: '/en/products/firewall/' }
        ]
      },
      {
        title: 'Company',
        links: [
          { label: 'About us', href: '/en/about-us/' },
          { label: 'Careers', href: '/en/careers/' }
        ]
      }
    ],
    socials: [
      { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' }
    ],
    statusLabel: 'All Systems Operational',
    languages: ['EN', 'PT-BR', 'ES']
  }
</script>

<template>
  <SiteLayout
    :navigation="navigation"
    :footer="footer"
  >
    <HeroBand
      kind="centered"
      eyebrow="Functions"
      title="Run code where your users are"
      description="Deploy serverless functions to the edge network in seconds."
      :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
      :secondary-action="{ label: 'Talk to an expert', href: '/en/contact/' }"
    />
    <SectionContainer max-width="site">
      <SectionGap hatch />
    </SectionContainer>
  </SiteLayout>
</template>
```
