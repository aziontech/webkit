# Rule: marketing page sections

A marketing band (hero, features, pricing, FAQ, newsletter, footer) is a **page section**: a
complete webkit component published at `@aziontech/webkit/sections/<name>`. The site places it from
JSON. Never rebuild a band from primitives when a section exists.

## Do

- Find the section with the webkit MCP: `suggest_component` with the band's purpose ("pricing page",
  "newsletter sign-up") returns it with `recommendation: "section"`; `list_components` with category
  `sections` lists all of them.
- Import it from its section path and name the binding after the last segment:
  `import PricingPlans from '@aziontech/webkit/sections/pricing-plans'`.
- Pass the site JSON entry's props as the whole API: `<PricingPlans v-bind="section.props" />`. The
  `_id` in the JSON is the section's name.
- Place sections inside the page column: `SectionContainer` (`max-width="site"`) with a
  `SectionGap` between sections. The section's own root is the band; it never sets its own width.
- For a section with a form (lead form, newsletter): listen to `submit` (`(event, values)`) and send
  from the site. The section never posts. Feed the outcome back through its `loading`, `submitted`
  and `error` props; the messages come from the JSON.

## Do not

- Do not import a section from a single-segment path (`@aziontech/webkit/pricing-plans`) or from
  `/src/`. Sections are the one family with a two-segment path: `sections/<name>`.
- Do not pass slots or extra props a section does not declare. If the JSON needs a new field, the
  section changes in webkit first.
- Do not wrap a section in your own `max-w-*`, padding or border to change its look. Spacing between
  bands is `SectionGap`.
- Do not let the form section fetch, and do not fake a success state in the component.

## Correct

```vue
<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import PricingPlans from '@aziontech/webkit/sections/pricing-plans'
  import ClosingCallToActionNewsletter from '@aziontech/webkit/sections/closing-call-to-action-newsletter'

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
