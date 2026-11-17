# Rule: marketing page sections

A marketing band (hero, features, pricing, FAQ, newsletter, footer) is a **page section**: a
complete webkit component published at `@aziontech/webkit/<name>`, where `<name>` is the section's `_id` in
the site JSON. The site places it from
JSON. Never rebuild a band from primitives when a section exists.

Which sections a page uses, in which order, with which hero, labels and assets is the Web Design
Guide, rule `webkit-site-pages` (SD-01 to SD-25); a page task runs through `/webkit-site-pages`.

## Do

- Find the section with the webkit MCP: `suggest_component` with the band's purpose ("pricing page",
  "newsletter sign-up") returns it with `recommendation: "section"`; `list_components` with category
  `sections` lists all of them.
- Import it from its flat path and name the binding after it:
  `import PricingPlansSection from '@aziontech/webkit/pricing-plans-section'`.
- Pass the site JSON entry's props as the whole API: `<PricingPlansSection v-bind="section.props" />`. The
  `_id` in the JSON is the section's name.
- Place sections inside the page column: `SectionContainer` (`max-width="site"`) with a
  `SectionGap` between sections. The section's own root is the band; it never sets its own width.
- For a section with a form (lead form, newsletter): listen to `submit` (`(event, values)`) and send
  from the site. The section never posts. Feed the outcome back through its `loading`, `submitted`
  and `error` props; the messages come from the JSON.
- Compose the site chrome once: `SiteLayout` (`@aziontech/webkit/site-layout`) in `App.vue`, with
  the `SiteHeaderSection` data as `navigation` and the `SiteFooterSection` data as `footer`, around `RouterView`. It
  places `SiteHeaderSection` first and `SiteFooterSection` last, unwrapped, and opens the ⌘K palette from the bar's
  search. A page is only its sections, in the layout's slot. The `shell/site` block is this
  layout with the azion.com data: copy it as the app shell, never per page.
  `SiteHeaderSection` drops Login from the bar on a phone, as azion.com does; leave
  `secondaryActionOnPhones` off. `SiteFooterSection` draws its own top rule, frame and closing bottom rule.
- Size a screen-filling hero under `SiteHeaderSection` with the `--layout-header-height` token: `HeroSection`
  takes it out of the screen by default, and a bare `Hero variant="screen"` takes
  `offset="var(--layout-header-height)"`. Never a literal (`56px`, `3.5rem`).
- End the page column on a closing section (`ClosingCallToActionSection` and its `-newsletter`,
  `-agents`, `-templates` variants) with nothing after it: it draws the hatched closing frame
  itself. A page that ends on any other band closes with `SectionGap hatch` + the closing
  `RegistrationFrame` of `shell/site`.
- Reach for the section's own switches before anything else: `ClientQuotesSection` `autoplay` /
  `autoplayInterval` / `v-model`, `ArticleHighlightSection` `v-model`, `CapabilityGridSection` `titleAlign`,
  `MediaSplitSection` action `variant` (`ghost` for a quiet "Learn more" text button), `SiteFooterSection` link
  `external`, `CapabilityGridSection` items with `href` for a linked grid, `ProcessScrollSection` `pinned`
  (a band that pins while its tall cards slide sideways), a `HeroFormSection` field's
  `visuallyHiddenLabel` (a field labelled by its placeholder) and `NetworkSection` outcomes without
  `logo`. A `NetworkSection` benefit always carries its `icon`, and a `CapabilityGridSection` gives
  every item an `icon` (benefits) or none (resources, text columns).
- A header that opens a run of bands inside a page (`MediaSplitStackSection`, a `SectionTitle` over
  a `SectionStack`) is the medium `SectionTitle`; `size="large"` is for a page's opening title only.
- A titled row of cards that scrolls sideways, with the previous/next arrows on the title row ("See
  how to use", "Industries"), is `CardCarouselSection` (`card-carousel-section`): each card takes `eyebrow`,
  `title`, `description`, `href` and `linkLabel`. Do not compose it from `Carousel` and `Eyebrow`.
- A media band (`MediaSplitSection`, a `MediaSplitStackSection` band) always has a picture, and it is
  a drawn asset: an illustration (a name of the illustration registry) or a registered scene; a
  product console widget is one (set `widget`, a `ConsoleMockup` name). The sections take no picture
  URL: art in `FeatureTilesSection`, `MediaSplitSection` and `MediaSplitStackSection` is an
  `illustration` name. Request-flow diagrams and code never go in a media band:
  a diagram is a `ConsoleShowcaseSection` with `variant="diagram"`, code a `FeatureScrollSection`
  step with `code`. Do not drop to `MediaSplit` and its `media` slot to get around it.
- Give a grid section (contact channels, features, use cases, articles) as many items as the content
  has. Its card grid balances the rows itself — the fewest rows the column cap allows on the
  narrowest track count that keeps them, so an even count fills every row (under three columns
  2 → halves, 4 → 2 × 2), and a short last row keeps the column width with its trailing cells left
  empty, as azion.com does (5 → 3 + 2, 7 → 3 + 3 + 1). Never stretch the last row yourself.
- Import the logos, badges and illustrations a section shows from
  `@aziontech/webkit/assets/<file>` (`import zoop from '@aziontech/webkit/assets/zoop-extended-color.svg'`)
  and pass the import as the item's `logo` / `src`; `catalog.json` lists the files under `imports`
  with `"kind": "asset"`. Photos, covers and banners are the site's content: pass URLs the app
  serves, or `@aziontech/webkit/assets/placeholder-image.svg` until it has them.

## Do not

- Do not import a section from `/src/` or with a category prefix (`@aziontech/webkit/sections/pricing-plans-section`
  no longer exists).
- Do not pass slots or extra props a section does not declare. If the JSON needs a new field, the
  section changes in webkit first.
- Do not wrap a section in your own `max-w-*`, padding or border to change its look. Spacing between
  bands is `SectionGap`.
- Do not build the site header or footer from `AppHeader`, `NavigationMenu` or `Footer`, and do
  not place `SiteHeaderSection` / `SiteFooterSection` in a page: `SiteLayout` owns them, once.
- Do not wrap `SiteFooterSection` or `SiteHeaderSection` in a `div` with `border-t`, `border-b` or padding: the
  rules double and the frame drifts off the page column.
- Do not pad an item list with placeholders, drop an item, or pick `columns` from the item count to
  make a grid "fit"; and do not compose a fixed `grid-cols-3` of cards yourself — `CardGrid` with its
  default `layout="balanced"` is the grid.
- Do not let the form section fetch, and do not fake a success state in the component.
- Do not copy a root-relative `/marketing-components/…` or `/media/…` URL from azion.com or the
  WebKit docs site into another app: it does not serve it and the image breaks (lint
  `webkit/no-root-relative-asset`).
- Do not put a `SectionGap` or a closing `RegistrationFrame` after a closing section: the hatch doubles
  (`webkit/no-gap-after-closing-section`).
- Do not wrap a bare `CapabilityGridSection` in a `SectionModule` to move its title: set `titleAlign`, or
  its capability headings rise to `h2`.

## Correct

```vue
<script setup lang="ts">
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import PricingPlansSection, {
    type PricingPlansSectionProps
  } from '@aziontech/webkit/pricing-plans-section'
  import NewsletterSection, {
    type NewsletterSectionProps
  } from '@aziontech/webkit/newsletter-section'

  interface Props {
    /** The page JSON, one entry per section, each holding that section's props. */
    page: {
      pricing: { props: PricingPlansSectionProps }
      newsletter: { props: NewsletterSectionProps }
    }
  }

  defineProps<Props>()
  const subscribe = async (event: SubmitEvent, values: Record<string, string>) => {
    /* post values to the site endpoint, then set the section's loading / submitted / error props */
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />
    <PricingPlansSection v-bind="page.pricing.props" />
    <SectionGap hatch />
    <NewsletterSection
      v-bind="page.newsletter.props"
      @submit="subscribe"
    />
  </SectionContainer>
</template>
```
