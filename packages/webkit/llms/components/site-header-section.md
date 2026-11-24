# Site Header Section

> The marketing site's own navigation: a sticky bar with the Azion mark, the mega-menu triggers and plain links, and the contact, login and sign-up actions, plus the sheet that carries the same tree below `xl`. It is a page section — the site places it from a `{ _id: 'site-header-section', props }` entry and binds `props` straight onto it — and it composes `app-header`, `brand`, `navigation-menu`, `icon-button`, `search-trigger`, `button`, `drawer`, `panel-header`, `panel-footer`, `scroll-area` and `sidebar-menu`. Each mega-menu lists its panel as columns of groups, and the sheet's drill-down tree is projected from the same menus, so an entry added to a panel is in both. The open state of the sheet, its drill path and the bar's inline inset are local state. Search is the collapsible `search-trigger`, first in the bar's end group (before contact, login and sign-up, so the call to action closes the bar): the section owns no palette, it emits `search` (on a click and on ⌘K / Ctrl K) and the page opens its own `command`, as every header does under `rules/webkit-header-search.md`.

- Import: `import SiteHeaderSection from '@aziontech/webkit/site-header-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [site-header-section.json](site-header-section.json)

## When to use

- Use SiteHeaderSection for the marketing site's top bar (mega-menus and mobile sheet).
- At the top of every marketing page, once.

## Do

- Keep a panel to one, two or four columns; only the four-column panel is stretched to the page column.
- Stack a short group under another in the same column (Platform under Observe) instead of adding a fifth column.
- Give every entry an `href`; an entry without one links to `#`.
- Listen to `search` and open the page's `Command` from it (`@search="searchOpen = true"` beside `<Command v-model:open="searchOpen">`); the trigger already carries ⌘K / Ctrl K.
- Leave `secondaryActionOnPhones` off: on a phone the bar keeps the menu button, the mark, search and the call to action, as azion.com does, and Login stays in the sheet footer.
- Keep search in the bar at every width, never only inside the sheet: one tap reaches it on a phone, as on Vercel, Supabase, Stripe, Tailwind and Cloudflare docs.
- Sticky parts further down the page (a plan table's head row) stop under the bar through `--layout-sticky-top`, which defaults to the bar's height.
- The bar is `--layout-header-height` tall: `HeroSection` already takes it out of a screen-filling band; a bare `Hero variant="screen"` takes `offset="var(--layout-header-height)"`, never a literal length.
- Don't wrap the bar, add a second search button beside it, or bind ⌘K yourself.

## Don’t

- For the Console's application header → use `app-header` directly.
- For an in-page list of links → use `navigation-menu` or `sidebar-menu` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [app-header](app-header.md) — the bar primitive the navigation is rendered in.
- [navigation-menu](navigation-menu.md) — the mega-menu the bar opens from `xl` up.
- [sidebar-menu](sidebar-menu.md) — the drill-down tree the sheet carries below `xl`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `home` | `string` | `'/'` | false | Where the Azion mark links. |
| `menus` | `SiteHeaderSectionMenu[]` | `—` | true | The mega-menus, in bar order; each is `{ value, label, columns }` where `columns` is an array of columns, each holding groups of `{ label, href?, items }` and each item `{ label, description?, href?, icon? }`. |
| `links` | `SiteHeaderSectionLink[]` | `[]` | false | Bar entries that open no panel, after the menus; each is `{ label, href }`. |
| `contact` | `SiteHeaderSectionLink` | `undefined` | false | Contact link set in the bar from `xl` up and last in the sheet's tree; `{ label, href }`. |
| `primaryAction` | `SiteHeaderSectionLink` | `undefined` | false | The sign-up button, filled, in the bar and in the sheet footer; `{ label, href }`. |
| `secondaryAction` | `SiteHeaderSectionLink` | `undefined` | false | The login button beside it, in the bar from `sm` up and in the sheet footer; `{ label, href }`. |
| `secondaryActionOnPhones` | `boolean` | `false` | false | Keeps the login button in the bar below `sm` too; off, it steps out on phones, as on azion.com, and stays in the sheet footer. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `search` | `(event: MouseEvent \| KeyboardEvent)` |  |

## States

- Visual states: `default`; the sheet is `open` or closed (local state, owned by `drawer`)
- Closing the sheet resets its drill path; following a leaf of the tree closes the sheet
- The sheet closes on its own when the viewport reaches `xl` (80rem), where the bar shows every entry and the menu button is gone
- The bar reads its own inline inset on mount and on resize, so the four-column panel's collision padding lands it on the page column's leading edge
- Each panel's column count is mirrored on `data-columns` and drives its track count; only a four-column panel is stretched to the page column
- An absent `contact`, `primaryAction` or `secondaryAction` is omitted from the bar and the sheet
- The secondary action steps out of the bar below `sm` unless `secondaryActionOnPhones`; the sheet footer always carries it

## Accessibility

- Visible focus: the mark link draws the ring token; triggers, items and buttons own theirs.
- Keyboard map: `Tab` moves through the bar; ⌘K / Ctrl K fires `search` (a mounted `Command` claims the shortcut first); the mega-menu and the sheet own their keyboard models (arrows, `Enter`, `Esc` closes and restores focus to the trigger).
- ARIA: the bar is the `app-header` landmark named "Azion", so the root is a plain `div`; the mark link is named "Azion home"; the bar's mega-menu navigation is named "Main" and the sheet's tree "Main menu", so no landmark repeats the banner's name; the menu button "Open navigation" is an icon button with a name that declares `aria-haspopup="dialog"` and mirrors the sheet in `aria-expanded`; the search trigger is named "Search" and announces `aria-keyshortcuts` (`Meta+K Control+K`); the sheet is titled "Menu".
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link; the sheet and the panels own their reduced-motion fallbacks.
- Touch target ≥40×40 px — the medium buttons and icon buttons meet it.

## Right-to-left

- Layout: logical utilities only; the bar, the panels and the sheet mirror under `dir="rtl"`, and the sheet slides from the end edge as `drawer` places it.
- Icons: the menu, search and arrow glyphs belong to the composed components; the drill-in chevrons mirror as `sidebar-menu` draws them; the mark is not mirrored.
- Keyboard: the mega-menu and the sheet tree own their arrow keys and follow the direction.
- User data: none.

## Internationalization

| Key                                | English source  | Override prop |
| ---------------------------------- | --------------- | ------------- |
| `siteHeaderSection.open`           | Open navigation | —             |
| `siteHeaderSection.home`           | Azion home      | —             |
| `siteHeaderSection.search`         | Search          | —             |
| `siteHeaderSection.menu`           | Menu            | —             |
| `siteHeaderSection.navigation`     | Main            | —             |
| `siteHeaderSection.menuNavigation` | Main menu       | —             |

- Formatting: none; menu, link and action labels are the page's own text.

## Responsive

- Container queries: none; the bar switches at viewport breakpoints.
- Narrow (below `xl`, 80rem): the menus, links and contact leave the bar for the sheet behind the menu button; below `sm` the secondary action steps out unless `secondaryActionOnPhones`. When the bar's content box is under 20rem (a 320 px phone) the AZION wordmark gives way to the reduced "A" mark, so the sign-up button never covers it. Reaching `xl` while the sheet is open closes it.
- Search: the `search-trigger` is first in the end group at every width. While the bar's content box is 47rem (752 px) or wider it is the field — magnifier, `Search` and the `⌘K` keycap (`Ctrl K` off Apple platforms, drawn by `kbd`); narrower (tablet and phone) it folds to a 32 × 32 px magnifier button named "Search", with the label as a tooltip and a 44 px touch area, beside the call to action. It never moves into the sheet. On a touch screen (`pointer: coarse`) the keycap is hidden at every width, since there is no keyboard to press it; the field keeps its label. Every form opens the same palette: the click and ⌘K / Ctrl K both emit `search`.
- Touch: medium buttons and icon buttons meet 40 px; the home mark carries an invisible `aria-hidden` touch target that extends its hit area to 44×44 px on a coarse pointer; the phone navigation rows are `SidebarMenu` rows (44 px on a coarse pointer); the mega-menu opens on click as well as hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the sheet scrolls inside `scroll-area`.

## Examples

### Default

```vue
<script setup>
  import Command from '@aziontech/webkit/command'
  import SiteHeaderSection from '@aziontech/webkit/site-header-section'
  import { ref } from 'vue'

  const searchOpen = ref(false)

  const searchPages = ['Functions', 'Applications', 'Firewall', 'Pricing', 'Documentation']

  const menus = [
    {
      value: 'solutions',
      label: 'Solutions',
      columns: [
        [
          {
            label: 'By Need',
            items: [
              { label: 'Application Development', description: 'Build and run applications' },
              {
                label: 'Performance and Reliability',
                description: 'Improve application performance and reliability'
              },
              { label: 'Artificial Intelligence (AI)', description: 'Build and run AI workloads' },
              { label: 'Application Security', description: 'Secure applications and networks' },
              { label: 'Media and Streaming', description: 'Deliver media and streaming content' }
            ]
          }
        ],
        [
          {
            label: 'By Industry',
            items: [
              { label: 'Financial Services', description: 'Speed up digital financial services' },
              { label: 'Technology', description: 'Build high-performance applications' },
              { label: 'Retail', description: 'Build high-performance shopping experiences' }
            ]
          }
        ]
      ]
    },
    {
      value: 'products',
      label: 'Products',
      columns: [
        [
          {
            label: 'Build',
            items: [
              { label: 'Workloads', description: 'Serve an application on your domain, globally' },
              { label: 'Applications', description: 'Deliver and configure web applications' },
              {
                label: 'Functions',
                description: 'Run code globally with low latency and no cold starts'
              },
              { label: 'Cache', description: 'Speed up delivery and reduce origin load' },
              {
                label: 'Application Accelerator',
                description: 'Speed up dynamic content and APIs'
              },
              {
                label: 'Image Processor',
                description: 'Resize, crop, and convert images on the fly'
              },
              { label: 'AI Inference', description: 'Run AI inference close to users' },
              { label: 'AI Gateway', description: 'Route, secure and log every model call' },
              { label: 'Durable Objects', description: 'Run stateful code worldwide' },
              {
                label: 'Orchestrator',
                description: 'Deploy, manage, monitor and automate workloads'
              }
            ]
          }
        ],
        [
          {
            label: 'Store',
            items: [
              { label: 'SQL Database', description: 'Store relational and structured data' },
              { label: 'Object Storage', description: 'Store and deliver data globally' },
              { label: 'KV Store', description: 'Store key-value data with low latency' }
            ]
          }
        ],
        [
          {
            label: 'Secure',
            items: [
              {
                label: 'Web Application Firewall (WAF)',
                description: 'Block common attacks, enforce policies'
              },
              {
                label: 'Firewall',
                description: 'Filter every request before it reaches your code'
              },
              { label: 'DDoS Protection', description: 'Stop volumetric attacks automatically' },
              { label: 'Bot Manager', description: 'Block bots and protect traffic' },
              {
                label: 'Network Shield',
                description: 'Stop network attacks before they reach you'
              },
              { label: 'Edge DNS', description: 'Resolve DNS quickly and securely' },
              {
                label: 'Load Balancer',
                description: 'Spread traffic across origins and drop unhealthy ones'
              }
            ]
          }
        ],
        [
          {
            label: 'Observe',
            items: [
              {
                label: 'Data Stream',
                description: 'Stream event data to your tools as it happens'
              },
              { label: 'Real-Time Events', description: 'Query request-level logs in real time' },
              {
                label: 'Real-Time Metrics',
                description: 'See traffic and performance as they happen'
              },
              { label: 'Edge Pulse', description: 'Measure real user performance in the browser' }
            ]
          },
          {
            label: 'Platform',
            items: [
              { label: 'Our Network', description: 'Global delivery across 100+ data centers' }
            ]
          }
        ]
      ]
    },
    {
      value: 'developer',
      label: 'Developer',
      columns: [
        [
          {
            label: 'Docs',
            items: [
              { label: 'Azion Docs', description: 'Documentation and technical references' },
              { label: 'Guides', description: 'Practical, step-by-step guides' },
              { label: 'Dev Tools', description: 'CLI, API, and Terraform tools' },
              { label: 'Release Notes', description: 'Product updates and new features' }
            ]
          }
        ],
        [
          {
            label: 'API',
            items: [{ label: 'API Reference', description: 'Automate Azion with the API' }]
          },
          {
            label: 'Community',
            items: [
              {
                label: 'Join our community',
                description: 'Developers and the Azion team on Discord',
                icon: 'az-color az-discord'
              }
            ]
          }
        ]
      ]
    },
    {
      value: 'resources',
      label: 'Resources',
      columns: [
        [
          {
            label: 'Content',
            items: [
              { label: 'Blog', description: 'Insights and industry trends' },
              { label: 'Learning', description: 'Fundamentals, subject by subject' },
              { label: 'Resource Hub', description: 'Useful materials in one place' },
              { label: 'Success Stories', description: 'Real results from our customers' },
              { label: 'Partners', description: 'Let’s build together' },
              { label: 'Marketplace', description: 'Ready-made apps and solutions' }
            ]
          }
        ],
        [
          {
            label: 'Services',
            items: [
              { label: 'Support', description: 'Expert help when you need it' },
              { label: 'Professional Services', description: 'Specialist guidance to move faster' }
            ]
          }
        ]
      ]
    }
  ]

  const links = [{ label: 'Pricing', href: '#' }]

  const contact = { label: 'Contact', href: '#' }

  const primaryAction = { label: 'Start for free', href: '#' }

  const secondaryAction = { label: 'Login', href: '#' }
</script>

<template>
  <SiteHeaderSection
    home="#"
    :menus="menus"
    :links="links"
    :contact="contact"
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
    @search="searchOpen = true"
  />
  <Command v-model:open="searchOpen">
    <Command.Input placeholder="Search azion.com" />
    <Command.List>
      <Command.Empty>No page matches your search.</Command.Empty>
      <Command.Group label="Pages">
        <Command.Item
          v-for="page in searchPages"
          :key="page"
          :value="page"
          >{{ page }}</Command.Item
        >
      </Command.Group>
    </Command.List>
  </Command>
</template>
```
