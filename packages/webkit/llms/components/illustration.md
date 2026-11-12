# Illustration

> Renders an **official product illustration** — one of the scenes drawn in the Assets library in Figma and exported as an SVG that ships with this package. `name` selects a scene from a closed registry; there is no way to assemble artwork out of markup, so a page can only render illustrations design has actually signed off, and a scene can never drift between the screens that use it. The library is drawn once, in dark mode. The scene is drawn into the page as inline SVG and every colour it carries is repainted from the `illustration` theme foundation of `@aziontech/theme` — `--illustration-*` roles that alias the global tokens — so the one export follows light and dark like the rest of the page.

- Import: `import Illustration from '@aziontech/webkit/illustration'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [illustration.json](https://github.com/aziontech/webkit/blob/main/.specs/illustration.json)

## When to use

- An empty state, error page, onboarding step, or marketing tile needs a diagrammatic illustration of a product concept (a deploy, a request path, a connected service).
- The same concept appears on more than one screen and must be the same drawing every time.
- The artwork must scale to its container without rasterizing or re-exporting.

## Do

- Leave the illustration decorative (no `ariaLabel`) unless it carries information the surrounding copy does not. A decorative illustration is hidden from assistive tech, which keeps screen readers out of a graphic that adds nothing.
- Size the illustration from the call site with a class. The root is `w-full` at the canvas aspect ratio, so a narrower column simply gets a smaller scene.
- Pick the scene that draws the claim next to it, not the one whose filename matches the page title.
- Find the names in `llms/foundations/illustrations.md` (installed under `node_modules/@aziontech/webkit/llms/`), the MCP tool `list_assets` (`kind: "illustration"`) or the Assets example. Never guess a name from a file name or a page title: an unknown name renders the placeholder.
- To add a scene, export the frame from the Figma assets library (592×300 for a scene, the tile's own size for a tile or crop), drop the `.svg` into `src/assets/illustrations/`, and register it in `registry.ts`. The test fails while a drawing in the folder is unregistered. Never hand-draw one.
- Leave `<Illustration />` unnamed where a scene is still being drawn: the placeholder frame reserves the space and reads as unfinished on the screen, which is louder than a gap nobody notices.

## Don’t

- A single glyph is enough → use an icon from `@aziontech/icons` (`<i class="ai ai-…">`).
- The artwork is a brand mark (a client logo, a framework mark) → those are brand assets, not illustrations.
- The whole component is "no data here, with a title and an action" → use `empty-state`, which already owns that layout and may embed an `Illustration`.
- The graphic is a live data visualization → that is a chart, not an illustration.
- The scene you need is not in the registry → it has to be drawn in Figma and exported first. Do not approximate it in markup.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [empty-state](empty-state.md) — the surrounding layout (illustration + title + description + actions); reach for it first and put an `Illustration` inside it.
- [flow](flow.md) — a real interactive node/edge diagram driven by data; `Illustration` is decorative and static by comparison.
- [skeleton](skeleton.md) — the loading placeholder; an illustration is never a loading state.
- svg/azion/*` — drawn brand marks, for artwork that is not part of the illustration library.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | `''` | no | Name of an official scene in the illustration asset library. |
| `ariaLabel` | `string` | `''` | no | Accessible name; empty keeps the illustration decorative and hidden from assistive tech. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.

## States

- Visual states: `default` — an illustration is decorative and has no `hover`, `focus-visible`, `disabled`, `loading`, or `active` state, and is never interactive.
- Most scenes are drawn on the one 592×300 canvas, so they line up with each other in a grid; a few tiles and crops (`ai-gateway`, `azion-highlight`, `azion-rest-api`, `branches`, `ddos-protection`, `distributed-apis-tile`, `personal-tokens`, `real-time-metrics-error-rate`, `real-time-metrics-status-codes`, `usage-chart`) keep the canvas they were drawn on. The root declares 592×300 as its intrinsic `width`/`height` until the SVG loads, which reserves the box, then the scene's own canvas, and renders at its container's width at that aspect ratio. A call site that wants it smaller caps it with a class.
- A `name` that resolves to no scene — empty, or not in the registry — renders the **placeholder**: a tinted frame reading `PLACE DESIGN ASSET`, marked `data-placeholder`, on the 592×300 canvas. An unregistered `name` also warns in the console, naming where the valid names are listed; neither case throws, and neither collapses the layout. The placeholder is always decorative, `ariaLabel` or not: it draws no scene, so announcing a description of the missing artwork would describe something that is not on the page.
- While a registered scene's SVG is still resolving, the frame already on screen stays — the placeholder never flashes in front of a scene that is about to arrive.
- Theme: each colour of the export palette maps to one `--illustration-*` role (see § Tokens), resolved where the scene renders, so a scene inside a `[data-theme]` subtree follows that subtree. A translucent ground colour is a drop shadow and stays as drawn; colours that read the same in both themes (window controls, framework marks, the dot map) stay as drawn too. Masks, clip paths and filters are never repainted.
- Every instance scopes the SVG's internal ids, so two scenes — or two copies of one — on the same page never resolve each other's gradients, masks or filters.

## Accessibility

- Visible focus: _not applicable_ — an illustration is never focusable or interactive, so it declares no focus ring.
- Keyboard map: _none_ — no interactive elements, nothing in the tab order.
- ARIA: the root is an inline `<svg>`. With no `ariaLabel` it carries `aria-hidden="true"` and no role, so assistive tech skips a purely decorative graphic; with an `ariaLabel` it carries `role="img"` and the label as its `aria-label`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the component declares no text and no colour. An exported scene is decorative shape, not information — no meaning is conveyed by the artwork alone, so the copy beside it must carry the claim.
- Touch target ≥40×40 px: _not applicable_ — nothing here is a target.

## Examples

### Default

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <Illustration name="modern-frontends" />
</template>
```

### Assets

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <div class="grid grid-cols-2 gap-(--spacing-lg)">
    <Illustration name="ai-applications" />
    <Illustration name="ai-gateway" />
    <Illustration name="api-endpoints" />
    <Illustration name="automate-threat-mitigation" />
    <Illustration name="azion-highlight" />
    <Illustration name="azion-rest-api" />
    <Illustration name="azion-to-akamai" />
    <Illustration name="azion-to-aws" />
    <Illustration name="azion-to-cloudflare" />
    <Illustration name="azion-to-fastly" />
    <Illustration name="azion-to-vercel" />
    <Illustration name="branches" />
    <Illustration name="build-applications" />
    <Illustration name="build-databases-from-code" />
    <Illustration name="combine-data-and-vector-search" />
    <Illustration name="content-and-media-delivery" />
    <Illustration name="content-and-media-delivery-globe" />
    <Illustration name="custom-allowed-rules" />
    <Illustration name="custom-rules-mitigation" />
    <Illustration name="ddos-protection" />
    <Illustration name="deploy-secure-mcp-server" />
    <Illustration name="detect-and-classify" />
    <Illustration name="distributed-apis" />
    <Illustration name="distributed-apis-tile" />
    <Illustration name="distributed-sql-for-resilient-global-reads" />
    <Illustration name="dns-protection" />
    <Illustration name="enable-owasp-protection-with-customizable-rules" />
    <Illustration name="fastest-path-to-live-website" />
    <Illustration name="global-network" />
    <Illustration name="implement-api-gateway-security" />
    <Illustration name="improve-application-performance-and-reliability" />
    <Illustration name="infrastructure-as-code" />
    <Illustration name="intent-to-policy" />
    <Illustration name="live-debugging" />
    <Illustration name="low-latency" />
    <Illustration name="mitigation-actions" />
    <Illustration name="modern-frontends" />
    <Illustration name="multi-format-optimization-with-automatic-detection" />
    <Illustration name="network-lists-rules-engine" />
    <Illustration name="no-idle-no-waste" />
    <Illustration name="personal-tokens" />
    <Illustration name="preview" />
    <Illustration name="profiles-per-application" />
    <Illustration name="programmable-security" />
    <Illustration name="protect-financial-applications" />
    <Illustration name="quick-start-with-templates" />
    <Illustration name="read-at-the-edge" />
    <Illustration name="real-time-metrics-error-rate" />
    <Illustration name="real-time-metrics-status-codes" />
    <Illustration name="replicated-reads" />
    <Illustration name="reputation-intelligence-for-enhanced-protection" />
    <Illustration name="request-inspection" />
    <Illustration name="retail-application-modernization" />
    <Illustration name="runtime" />
    <Illustration name="saas-platforms" />
    <Illustration name="stay-in-control" />
    <Illustration name="stream-security-events-for-investigation-and-response" />
    <Illustration name="url-based-transformations-without-api-complexity" />
    <Illustration name="usage-chart" />
    <Illustration name="white-gloves-when-it-matters" />
  </div>
</template>
```

### Placeholder

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <Illustration />
</template>
```
