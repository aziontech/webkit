# Website (`shells/website`)

> The website shell: `SiteLayout` composed once in the app around RouterView, so the chrome is never rebuilt per page. The navigation is the SiteNav data (the azion.com mega-menus, Pricing, Contact, Login and Start for free, every item with its `href`) in `navigation`, and the footer is the SiteFooter data (`kind: 'site'`, columns, socials, status line, languages) in `footer`; the layout paints the canvas, owns the single `<main>`, and opens a ⌘K / Ctrl K Command palette that lists every navigation destination. Every page is only its sections in the default slot: one `Hero` band opening the page, then every section stacked inside one framed `SectionContainer max-width="site"` separated by hatched `SectionGap`s, ending on a closing frame that draws no rule of its own, so the SiteFooter closes the page frame. The hero, the sections and the footer all resolve to the site measure, which is the only reason the side rules running down the page are continuous. Built from `SiteLayout`, `Hero`, `Button`, `SectionContainer`, `SectionGap`, `SectionModule`, `FrameBox`, `BigNumbers` and `TextureMaterial`. The full mega-menus and the navigation sheet are documented on Templates › Marketing › Shell › SiteNav.

- Surface: marketing
- Source: `blocks/shells/website/website.vue` in `@aziontech/webkit`
- MCP: `get_pattern("shells/website")`
- Components: [BigNumbers](../../components/big-numbers.md), [Button](../../components/button.md), [FrameBox](../../components/frame-box.md), [Hero](../../components/hero.md), [SectionContainer](../../components/section-container.md), [SectionGap](../../components/section-gap.md), [SectionModule](../../components/section-module.md), [SiteLayout](../../components/site-layout.md), [TextureMaterial](../../components/texture-material.md)
- Skills: `webkit-layout`

## Asked as

site shell; marketing site layout; landing page layout; website layout; marketing page frame; layout do site; estrutura do site; página de marketing; website shell; marketing site shell; site layout component; SiteLayout; layout do site com SiteNav

The marketing shell: one continuous frame — the site bar, a hero band that states the offer and the two next steps, every section stacked inside one framed container separated by hatched gaps, and the site footer closing the frame. The chrome is `SiteLayout`, composed once in the app around `RouterView` with the `SiteNav` and `SiteFooter` data; each page is only its sections, in the layout's slot.

## When to use

- Product, solution, company and landing pages on the public site.

## When not to use

- Documentation: `shells/documentation`. Product UI: `shells/console`.
- A one-off campaign page with no site navigation: render its sections on their own.

## Building blocks

### A. Site chrome — `SiteLayout` (required)

Composed once in the app's root around `RouterView`. `navigation` is the `SiteNav` data (menus, Pricing link, Contact, Login, Start for free) with an `href` on every item, so each one is also a palette destination; `footer` is the `SiteFooter` data with `kind: 'site'` (columns, socials, status line, languages). It owns the bar, the single `<main>`, the footer, the ⌘K / Ctrl K search palette and the canvas paint.

### B. Opening band — `Hero` (required)

`kind="band"`, `size="large"`, `max-width="site"`; `Hero.Title` carries the eyebrow, title, description and the two actions, centred.

### C. Actions — `Button` (required)

The hero's primary and outlined large buttons, worded like the bar's actions.

### D. Frame — `SectionContainer` (required)

`max-width="site"`; every section after the hero stacks inside it.

### E. Separator — `SectionGap` (required)

`hatch` between sections. Use it instead of margins.

### F. Section — `SectionModule` (required)

One per section; here unpadded and undivided around a framed figure row.

### G. Framed area — `FrameBox` (required)

Draws borders and corner marks; the closing frame uses `borders="none"` so it draws no rule of its own and hands the corner to the footer. When the page ends on a closing section (`ClosingCallToAction`, `ClosingCallToActionNewsletter`, `ClosingCallToActionAgents`, `ClosingCallToActionTemplates`), drop both the trailing `SectionGap` and this closing frame: the section draws its own, and a second one doubles the close (`webkit/no-gap-after-closing-section`).

### H. Figures — `BigNumbers` (optional)

A row of headline figures inside a `FrameBox`.

### I. Texture — `TextureMaterial` (optional)

`kind="lines"`, the decorative fill of the closing frame.

## Do

- Compose `SiteLayout` once, in the app's root, and render each route's sections in its default slot.
- Set `data-theme="dark"` on `<html>` (in `index.html`) for the dark site, so the layout, the teleported mega-menus and the palette all resolve the dark tokens.
- Keep every band on the site measure; one off-measure section breaks the side rules.
- Give every navigation item an `href`; add extra palette groups (articles, docs results) in the `search` slot.
- Separate sections with `SectionGap`, not with spacing utilities.
- Keep one primary action per band.

## Don't

- Never add `SiteNav`, `SiteFooter`, `GlobalHeader` or `Footer` to a page; the layout already renders them.
- Never render a second `<main>`; the layout owns the landmark.
- Don't wrap the layout's slot content in a border, padding or `max-w-*` of its own.
- Don't nest a second `SectionContainer`.
- Don't put interactive content inside `TextureMaterial`; it is decoration.

## Copy

- **Hero title:** the outcome in sentence case, under ten words. **Eyebrow:** the product name: `Functions`.
- **Hero actions:** match the bar's wording and capitalization (`Start for free`, `Talk to a specialist`).
- **Figures:** a number and a short noun phrase.
- **Palette placeholder:** `Search azion.com`.

## Accessibility

- Landmarks come from the layout: the bar is the banner named "Azion", the page is its single `main`, the footer is the `contentinfo`.
- One `h1` (the hero title) per page; sections use `h2`.
- ⌘K / Ctrl K opens the palette; `Escape` closes it and returns focus to the bar's search button.
- The sticky bar must not cover anchor targets; scroll with an offset.
- Decorative textures and hatches are hidden from assistive technology.

## States

- Default: the page with the palette closed; the palette opens from the bar's search button or ⌘K / Ctrl K, and the bar's mega-menus and sheet own their states.

## Related

- `shells/console` — the signed-in counterpart, on `ConsoleLayout`.
- `shells/documentation` — the docs counterpart, shares the footer anatomy in its `content` placement.
- `headers/site-header` — the bar on its own.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_pattern("shells/website", { variant })`, or the file under `blocks/shells/website/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SiteLayout, {
    type SiteLayoutFooter,
    type SiteLayoutNavigation
  } from '@aziontech/webkit/site-layout'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  const navigation: SiteLayoutNavigation = {
    home: '/en/',
    menus: [
      {
        value: 'solutions',
        label: 'Solutions',
        columns: [
          [
            {
              label: 'By Need',
              items: [
                {
                  label: 'Application Development',
                  description: 'Build and run applications',
                  href: '/en/solutions/application-development/'
                },
                {
                  label: 'Performance and Reliability',
                  description: 'Improve application performance and reliability',
                  href: '/en/solutions/performance-and-reliability/'
                },
                {
                  label: 'Artificial Intelligence (AI)',
                  description: 'Build and run AI workloads',
                  href: '/en/solutions/ai/'
                },
                {
                  label: 'Application Security',
                  description: 'Secure applications and networks',
                  href: '/en/solutions/application-security/'
                },
                {
                  label: 'Media and Streaming',
                  description: 'Deliver media and streaming content',
                  href: '/en/solutions/media-and-streaming/'
                }
              ]
            }
          ],
          [
            {
              label: 'By Industry',
              items: [
                {
                  label: 'Financial Services',
                  description: 'Speed up digital financial services',
                  href: '/en/solutions/financial-services/'
                },
                {
                  label: 'Technology',
                  description: 'Build high-performance applications',
                  href: '/en/solutions/technology/'
                },
                {
                  label: 'Retail',
                  description: 'Build high-performance shopping experiences',
                  href: '/en/solutions/retail/'
                }
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
                {
                  label: 'Workloads',
                  description: 'Serve an application on your domain, globally',
                  href: '/en/products/workloads/'
                },
                {
                  label: 'Applications',
                  description: 'Deliver and configure web applications',
                  href: '/en/products/applications/'
                },
                {
                  label: 'Functions',
                  description: 'Run code globally with low latency and no cold starts',
                  href: '/en/products/functions/'
                },
                {
                  label: 'Cache',
                  description: 'Speed up delivery and reduce origin load',
                  href: '/en/products/cache/'
                },
                {
                  label: 'Application Accelerator',
                  description: 'Speed up dynamic content and APIs',
                  href: '/en/products/application-accelerator/'
                },
                {
                  label: 'Image Processor',
                  description: 'Resize, crop, and convert images on the fly',
                  href: '/en/products/image-processor/'
                },
                {
                  label: 'AI Inference',
                  description: 'Run AI inference close to users',
                  href: '/en/products/ai-inference/'
                },
                {
                  label: 'AI Gateway',
                  description: 'Route, secure and log every model call',
                  href: '/en/products/ai-gateway/'
                },
                {
                  label: 'Durable Objects',
                  description: 'Run stateful code worldwide',
                  href: '/en/products/durable-objects/'
                },
                {
                  label: 'Orchestrator',
                  description: 'Deploy, manage, monitor and automate workloads',
                  href: '/en/products/orchestrator/'
                }
              ]
            }
          ],
          [
            {
              label: 'Store',
              items: [
                {
                  label: 'SQL Database',
                  description: 'Store relational and structured data',
                  href: '/en/products/sql-database/'
                },
                {
                  label: 'Object Storage',
                  description: 'Store and deliver data globally',
                  href: '/en/products/object-storage/'
                },
                {
                  label: 'KV Store',
                  description: 'Store key-value data with low latency',
                  href: '/en/products/kv-store/'
                }
              ]
            }
          ],
          [
            {
              label: 'Secure',
              items: [
                {
                  label: 'Web Application Firewall (WAF)',
                  description: 'Block common attacks, enforce policies',
                  href: '/en/products/web-application-firewall/'
                },
                {
                  label: 'Firewall',
                  description: 'Filter every request before it reaches your code',
                  href: '/en/products/firewall/'
                },
                {
                  label: 'DDoS Protection',
                  description: 'Stop volumetric attacks automatically',
                  href: '/en/products/ddos-protection/'
                },
                {
                  label: 'Bot Manager',
                  description: 'Block bots and protect traffic',
                  href: '/en/products/bot-manager/'
                },
                {
                  label: 'Network Shield',
                  description: 'Stop network attacks before they reach you',
                  href: '/en/products/network-shield/'
                },
                {
                  label: 'Edge DNS',
                  description: 'Resolve DNS quickly and securely',
                  href: '/en/products/edge-dns/'
                },
                {
                  label: 'Load Balancer',
                  description: 'Spread traffic across origins and drop unhealthy ones',
                  href: '/en/products/load-balancer/'
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
                  description: 'Stream event data to your tools as it happens',
                  href: '/en/products/data-stream/'
                },
                {
                  label: 'Real-Time Events',
                  description: 'Query request-level logs in real time',
                  href: '/en/products/real-time-events/'
                },
                {
                  label: 'Real-Time Metrics',
                  description: 'See traffic and performance as they happen',
                  href: '/en/products/real-time-metrics/'
                },
                {
                  label: 'Edge Pulse',
                  description: 'Measure real user performance in the browser',
                  href: '/en/products/edge-pulse/'
                }
              ]
            },
            {
              label: 'Platform',
              items: [
                {
                  label: 'Our Network',
                  description: 'Global delivery across 100+ data centers',
                  href: '/en/network-map/'
                }
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
                {
                  label: 'Azion Docs',
                  description: 'Documentation and technical references',
                  href: '/en/documentation/'
                },
                {
                  label: 'Guides',
                  description: 'Practical, step-by-step guides',
                  href: '/en/documentation/products/guides/'
                },
                {
                  label: 'Dev Tools',
                  description: 'CLI, API, and Terraform tools',
                  href: '/en/documentation/devtools/'
                },
                {
                  label: 'Release Notes',
                  description: 'Product updates and new features',
                  href: '/en/documentation/products/release-notes/'
                }
              ]
            }
          ],
          [
            {
              label: 'API',
              items: [
                {
                  label: 'API Reference',
                  description: 'Automate Azion with the API',
                  href: 'https://api.azion.com/'
                }
              ]
            },
            {
              label: 'Community',
              items: [
                {
                  label: 'Join our community',
                  description: 'Developers and the Azion team on Discord',
                  icon: 'ai-cor ai-discord',
                  href: 'https://discord.gg/azion'
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
                {
                  label: 'Blog',
                  description: 'Insights and industry trends',
                  href: '/en/blog/'
                },
                {
                  label: 'Learning',
                  description: 'Fundamentals, subject by subject',
                  href: '/en/learning/'
                },
                {
                  label: 'Resource Hub',
                  description: 'Useful materials in one place',
                  href: '/en/resources/'
                },
                {
                  label: 'Success Stories',
                  description: 'Real results from our customers',
                  href: '/en/success-stories/'
                },
                {
                  label: 'Partners',
                  description: 'Let’s build together',
                  href: '/en/partners/'
                },
                {
                  label: 'Marketplace',
                  description: 'Ready-made apps and solutions',
                  href: '/en/marketplace/'
                }
              ]
            }
          ],
          [
            {
              label: 'Services',
              items: [
                {
                  label: 'Support',
                  description: 'Expert help when you need it',
                  href: '/en/support/'
                },
                {
                  label: 'Professional Services',
                  description: 'Specialist guidance to move faster',
                  href: '/en/professional-services/'
                }
              ]
            }
          ]
        ]
      }
    ],
    links: [{ label: 'Pricing', href: '/en/pricing/' }],
    contact: { label: 'Contact', href: '/en/contact-sales/' },
    primaryAction: { label: 'Start for free', href: 'https://console.azion.com/signup' },
    secondaryAction: { label: 'Login', href: 'https://console.azion.com/login' }
  }

  const footer: SiteLayoutFooter = {
    kind: 'site',
    home: '/en/',
    homeAriaLabel: 'Azion home',
    columns: [
      {
        title: 'Products',
        links: [
          { label: 'Functions', href: '/en/products/functions/' },
          { label: 'Cache', href: '/en/products/cache/' },
          { label: 'Object Storage', href: '/en/products/object-storage/' },
          { label: 'SQL Database', href: '/en/products/sql-database/' },
          { label: 'WAF', href: '/en/products/web-application-firewall/' },
          { label: 'Edge DNS', href: '/en/products/edge-dns/' },
          { label: 'Data Stream', href: '/en/products/data-stream/' }
        ]
      },
      {
        title: 'Solutions',
        links: [
          { label: 'Web Apps', href: '/en/solutions/application-development/' },
          { label: 'AI', href: '/en/solutions/ai/' },
          { label: 'Application Security', href: '/en/solutions/application-security/' },
          { label: 'Financial Services', href: '/en/solutions/financial-services/' },
          { label: 'Retail', href: '/en/solutions/retail/' },
          { label: 'Technology', href: '/en/solutions/technology/' }
        ]
      },
      {
        title: 'Developers',
        links: [
          { label: 'Docs', href: '/en/documentation/' },
          { label: 'API Reference', href: 'https://api.azion.com/' },
          { label: 'Dev Tools', href: '/en/documentation/devtools/' },
          { label: 'Release Notes', href: '/en/documentation/products/release-notes/' },
          { label: 'Marketplace', href: '/en/marketplace/' },
          { label: 'Status', href: 'https://status.azion.com/' }
        ]
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/en/about/' },
          { label: 'Customers', href: '/en/success-stories/' },
          { label: 'Partners', href: '/en/partners/' },
          { label: 'Careers', href: '/en/careers/' },
          { label: 'Blog', href: '/en/blog/' },
          { label: 'Contact', href: '/en/contact-sales/' }
        ]
      }
    ],
    socials: [
      { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
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
      { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
      {
        icon: 'pi pi-instagram',
        label: 'Azion on Instagram',
        href: 'https://www.instagram.com/aziontech'
      },
      { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
      { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
    ],
    statusLabel: 'All Systems Operational',
    languages: ['EN', 'PT-BR', 'ES'],
    languageAriaLabel: 'Language'
  }

  const figures = [
    { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
    { value: '24', suffix: '/7', label: 'Support on every plan' },
    { value: '99.99', suffix: '%', label: 'Availability, contractual' }
  ]
</script>

<template>
  <SiteLayout
    :navigation="navigation"
    :footer="footer"
    search-placeholder="Search azion.com"
  >
    <Hero
      kind="band"
      size="large"
      max-width="site"
    >
      <Hero.Title
        centered
        eyebrow="Functions"
        eyebrow-prefix="//"
        title="Run serverless code at the edge"
        description="Functions execute on 100+ data centers worldwide, with no servers to provision and nothing to scale by hand."
      >
        <template #actions>
          <Button
            label="Start for free"
            kind="primary"
            size="large"
            href="https://console.azion.com/signup"
          />
          <Button
            label="Talk to a specialist"
            kind="outlined"
            size="large"
            href="/en/contact-sales/"
          />
        </template>
      </Hero.Title>
    </Hero>

    <SectionContainer max-width="site">
      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <BigNumbers :items="figures" />
        </FrameBox>
      </SectionModule>

      <SectionGap hatch />

      <FrameBox
        borders="none"
        marks="all"
        data-hatch="true"
        class="h-[calc(var(--spacing-xxl)*2)]"
      >
        <TextureMaterial kind="lines" />
      </FrameBox>
    </SectionContainer>
  </SiteLayout>
</template>
```
