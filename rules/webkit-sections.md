# Rule: marketing page sections

A marketing band (hero, features, pricing, FAQ, newsletter, footer) is a **page section**: a
complete webkit component published at `@aziontech/webkit/<name>`, where `<name>` is the section's `_id` in
the site JSON. The site places it from
JSON. Never rebuild a band from primitives when a section exists.

## Do

- Find the section with the webkit MCP: `suggest_component` with the band's purpose ("pricing page",
  "newsletter sign-up") returns it with `recommendation: "section"`; `list_components` with category
  `sections` lists all of them.
- Import it from its flat path and name the binding after it:
  `import PricingPlans from '@aziontech/webkit/pricing-plans'`.
- Pass the site JSON entry's props as the whole API: `<PricingPlans v-bind="section.props" />`. The
  `_id` in the JSON is the section's name.
- Place sections inside the page column: `SectionContainer` (`max-width="site"`) with a
  `SectionGap` between sections. The section's own root is the band; it never sets its own width.
- For a section with a form (lead form, newsletter): listen to `submit` (`(event, values)`) and send
  from the site. The section never posts. Feed the outcome back through its `loading`, `submitted`
  and `error` props; the messages come from the JSON.
- Close the page with `SiteFooter` as the last child of the page shell, unwrapped. It draws its own
  top rule, its frame and its closing bottom rule, and ends on the bottom bar from `lg`.
- Give a grid section (contact channels, features, use cases, articles) as many items as the content
  has. Its card grid balances the rows itself — the fewest rows the column cap allows, a short last
  row sharing the width evenly: under three columns 2 → halves, 4 → 2 × 2, 5 → 3 + 2. No row ends
  on an empty cell.

## Do not

- Do not import a section from `/src/` or with a category prefix (`@aziontech/webkit/sections/pricing-plans`
  no longer exists).
- Do not pass slots or extra props a section does not declare. If the JSON needs a new field, the
  section changes in webkit first.
- Do not wrap a section in your own `max-w-*`, padding or border to change its look. Spacing between
  bands is `SectionGap`.
- Do not wrap `SiteFooter` or `SiteNav` in a `div` with `border-t`, `border-b` or padding: the
  rules double and the frame drifts off the page column.
- Do not pad an item list with placeholders, drop an item, or pick `columns` from the item count to
  make a grid "fit"; and do not compose a fixed `grid-cols-3` of cards yourself — `CardGrid` with its
  default `layout="balanced"` is the grid.
- Do not let the form section fetch, and do not fake a success state in the component.

## Correct

```vue
<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import PricingPlans from '@aziontech/webkit/pricing-plans'
  import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'

  defineProps({ page: { type: Object, required: true } })
  const subscribe = async (event, values) => {
    /* post values to the site endpoint, then set the section's loading / submitted / error props */
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />
    <PricingPlans v-bind="page.pricing.props" />
    <SectionGap hatch />
    <ClosingCallToActionNewsletter
      v-bind="page.newsletter.props"
      @submit="subscribe"
    />
    <SectionGap hatch />
  </SectionContainer>
</template>
```
