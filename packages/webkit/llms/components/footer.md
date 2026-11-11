# Footer

> Page footer for marketing and product surfaces: the bottom-of-page counterpart to `GlobalHeader`. A canvas-colored shell divided into bands by hairline rules. Matches the Webkit Footer component set (Figma node 5467:1638, `Type=Default` / `Type=Mobile`). **Four bands.** Top to bottom: the link columns, a row carrying the social icons and the status/language pair, and the signature band (the brand beside its tagline, in its own `FrameBox` with corner marks). **Two placements, chosen with `kind` — the same two `GlobalHeader` has, and the bands are identical in both.** `content` is the default: the bands run full bleed across whatever zone holds the footer, and the footer adds no inset of its own because every band already carries `--spacing-lg` inside it — the value `--layout-boundary-inline` resolves to — so the first column title opens on the page boundary by construction. `site` closes a framed marketing page: the bands take the site column (`layout-column-site`: capped at `--layout-measure-site`, inset by `--layout-boundary-inline` once the window is narrower than that), side rules run down both edges, two hatched `FrameBox` gutters flank them from `2xl`, and a hatched band closes the frame below. Those three hold no content and stay out of the a11y tree. The hero band, the framed sections and this footer resolve to that one measure, which is the only reason the border-x running down the page is continuous; the top bar is deliberately one rung wider (`--layout-measure-site-header`). The frame apparatus belongs to `site` alone, and not as a matter of taste: on a full-bleed footer the side rules land on the zone's own edges, where a hairline reads as a seam against the bezel rather than as a frame, and the `flex-1` gutters — with no slack to grow into — collapse to zero width while still painting their borders and corner marks onto the bands' own edges. **The two Figma variants are one component switching by CSS**, and the switch is not one breakpoint: - The **column grid** folds from four columns to the 2×2 mobile grid below `md` (768px). - The **bands recombine at `md`**: stacked, their order is links → status/language → signature → social icons (the Mobile variant's order); from `md` the social icons and the status pair share one row above the signature. All four bands are cells of **one** grid, so each is a single element in a single place in the DOM at every width — the order is `order-*` when stacked and explicit row/column placement from `md`. A wrapper row that existed only on desktop would mean two copies of the markup, so two copies of the consumer's slot content. - **Row two sizes its two bands by content** (`md:grid-cols-[auto_auto]`), not in half: each band takes what it holds and the two share the slack, so the status pair never wraps while the social band still has room, and the social band wraps only when the zone is narrower than both together. A 50/50 split gave the social band 427px of an 853px docs reading column, 13px short of the brand mark and seven large icons — a premature wrap in every zone narrower than the viewport. - The **gutters appear at `2xl`** (1536px) in the `site` placement, not with the rest of the desktop presentation, because that is the first breakpoint past the measure itself (1388px). Gated any earlier they resolve to zero width and still paint their borders and corner marks on the measure's own edges — the gate moves with the measure, and was `xl` while the measure was 1192px. - Between the measure and that breakpoint the row therefore holds **one** child, so it carries `justify-center`: a capped item in an unjustified flex row is left-aligned, which would put the footer's frame up to 148px left of the centred frame it closes. With it the footer's column lands on the page column's own vertical wherever the cap is active — measured equal at 1440, 1536, 1920 and 2560. - Within the status pair, **`language` and `status` swap order** between the two variants (the phone leads with the select, the row ends with it), which is why they are two slots the row reverses rather than one cluster the consumer orders. Content (links, labels, languages, status, brand, tagline) always comes from the consumer; the component owns anatomy, tokens, and responsiveness.

- Import: `import FooterRoot from '@aziontech/webkit/footer-root'`
- Compound import (dot notation, not tree-shakeable): `import Footer from '@aziontech/webkit/footer'`
- Category: layout · Surface: product · Structure: composition
- API as JSON: [footer.json](https://github.com/aziontech/webkit/blob/main/.specs/footer.json)

## When to use

- The page-level footer of a site or application, paired with `GlobalHeader`.
- Grouped navigation links at the bottom of the page plus a brand/social/status bar.

## Do

- Compose every band from existing DS components (`Brand`, `IconButton kind="transparent" size="small"`, `StatusIndicator`, `Select`); never rebuild them inside the slots.
- Keep column titles short (one or two words) — they are group labels, not headings for prose.
- Give every social `IconButton` an `ariaLabel`; the footer cannot name them for you.
- Keep the social `IconButton`s at `size="small"`: a 28px box holds the brand mark and seven icons in 356px, which fits beside the status pair in the narrowest zone a shell gives the footer (the docs reading column at `lg`, 724px wide). At `large` the same row is 440px and wraps there.
- Provide four columns for the canonical desktop presentation; the grid folds to two columns below `md` on its own.
- Keep each band close to the canonical content (up to ~7 social icons; one status indicator; one language select; one brand lockup; a one-line tagline). Every band grows past its `min-h-14` floor rather than clipping, so a longer status string or an extra icon wraps safely — but a much heavier cluster belongs in the columns, not in a band.
- Give the `tagline` slot plain text, not a heading element: the footer already wraps it in the `.text-heading-xl` measure, and a real `h*` in a `contentinfo` landmark competes with the page's own outline.
- Pick the placement from the page, not from the look: `site` on a page that is a framed marketing column (its hero, sections and this footer share one measure), `content` — the default — anywhere the footer closes an app or docs zone. A `site` footer under an unframed page draws a frame nothing above it continues.
- Leave the gutters and the column frame alone — they are the `site` frame's own page material, and the placement decides them. A page that needs more air below the footer adds a `SectionGap`, and one that needs none is not this design.

## Don’t

- The bottom area of a panel, table, sidebar, or overlay → use that component's own footer part (`panel-footer`, `table-footer`, `sidebar-footer`, `popover-footer`).
- A single standalone link inside body content → use `link` instead of `Footer.Link`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [global-header](global-header.md) — the top-of-page chrome counterpart; same shell philosophy (regions composed by the consumer).
- [brand](brand.md), `icon-button`, `status-indicator`, `select` — the components consumers compose inside the bands; the footer reimplements none of them.
- [frame-box](frame-box.md) — the footer's own frame: the hatched gutters, the framed column and the signature box are `FrameBox` instances (`borders` / `marks` / `hatch`).

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the contentinfo landmark. Empty uses the locale catalog (`Footer`). |
| `kind` | `'content' \| 'site'` | `'content'` | false | Where the footer sits: `content` is the default — the bands run full bleed across whatever zone holds the footer, opening on the page boundary; `site` closes a framed marketing page instead, capping the bands at the site measure and drawing the frame that page carries: the side rules, the hatched gutters and the corner marks, closing on a full-bleed bottom rule. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Root: the `Footer.Column` items; laid out as a 2-column grid that becomes 4 columns at `md`. |
| `social` | — | Root: the social icon buttons. Renders its own band; centered stacked, at the row's start from `md`. |
| `status` | — | Root: the system status indicator. Shares the status band with `language`. |
| `language` | — | Root: the language select. Rendered _before_ `status` when stacked and _after_ it from `md`, per the two Figma variants. |
| `brand` | — | Root: the brand lockup of the signature band. |
| `tagline` | — | Root: the one-line tagline; the footer wraps it in the `.text-heading-xl` measure. |
| `default` | — | footer-column`: its `Footer.Link` items. |
| `default` | — | footer-link`: the link label. |

## Sub-component imports

- `@aziontech/webkit/footer-column`
- `@aziontech/webkit/footer-link`

## Sub-components

- `footer-column/footer-column.vue` — one navigation column: a muted title labelling a stacked group of `Footer.Link` items. Renders a `nav` labelled by its title so each group is a navigable landmark. Props: `title: string` (required) — column group label, rendered above the links and used as the accessible name of the column landmark. Slot: `default` — its `Footer.Link` items.
- `footer-link/footer-link.vue` — one text link inside a column; the root is the anchor itself, so consumer attributes (`target`, `rel`) land on the `a`. Props: `href: string` (required) — destination URL of the link. Slot: `default` — the link label.

## States

- Visual states: `default` on the shell and columns; `default`, `hover`, `focus-visible`, `active`, `visited` on `footer-link`.
- Placement: `data-kind="content" | "site"` on the root (from `kind`); the bands read it through `group-data-[kind=site]:` for the cap and the bottom rule, the column `FrameBox` draws its side rules and corner marks only in `site`, and the gutters render only in `site`.
- No `data-state`; the shell has no interactive states — slotted children own their own.

## Accessibility

- Root renders as `<footer>` — the implicit `contentinfo` landmark — with `aria-label` from `ariaLabel`.
- The two hatched gutters carry `aria-hidden="true"`: they hold no content, so without it a screen reader announces two empty groups at the end of every page.
- Each `footer-column` renders a `<nav>` labelled via `aria-labelledby` pointing at its title (`useId`), so link groups are unique, navigable landmarks.
- Keyboard map: none on the shell; `Tab` moves through links in DOM order; `Enter` activates.
- Visible focus on links: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Contrast ≥4.5:1 for column titles and links on `--bg-canvas`.
- `motion-reduce:transition-none` on the link color transition.
- Touch target: text links follow the platform convention for footer link lists (<40px height); justified deviation — targets are full-width-of-text with `--spacing-xs` separation.

## Examples

### DefaultFooter

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const language = ref('en')
  const languageOptions = [
    { value: 'en', label: 'EN' },
    { value: 'pt-br', label: 'PT-BR' },
    { value: 'es', label: 'ES' }
  ]
</script>

<template>
  <Footer aria-label="Footer">
    <Footer.Column title="Products">
      <Footer.Link href="/products/edge-application">Edge Application</Footer.Link>
      <Footer.Link href="/products/edge-firewall">Edge Firewall</Footer.Link>
      <Footer.Link href="/products/edge-storage">Edge Storage</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Developers">
      <Footer.Link href="/documentation">Docs</Footer.Link>
      <Footer.Link href="/blog">Blog</Footer.Link>
      <Footer.Link href="/integrations">Integrations</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Company">
      <Footer.Link href="/about">About us</Footer.Link>
      <Footer.Link href="/careers">Careers</Footer.Link>
      <Footer.Link href="/legal">Legal</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Support">
      <Footer.Link href="/contact">Talk to a specialist</Footer.Link>
      <Footer.Link href="/support">Help center</Footer.Link>
      <Footer.Link href="https://status.azion.com/">System status</Footer.Link>
    </Footer.Column>
    <template #social>
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-github"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-linkedin"
        aria-label="Azion on LinkedIn"
        href="https://www.linkedin.com/company/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-youtube"
        aria-label="Azion on YouTube"
        href="https://www.youtube.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-twitter"
        aria-label="Azion on X"
        href="https://x.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-instagram"
        aria-label="Azion on Instagram"
        href="https://www.instagram.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-discord"
        aria-label="Azion on Discord"
        href="https://discord.gg/azion"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-reddit"
        aria-label="Azion on Reddit"
        href="https://www.reddit.com/r/aziontech"
        target="_blank"
      />
    </template>
    <template #status>
      <StatusIndicator
        severity="success"
        label="All Systems Operational"
      />
    </template>
    <template #language>
      <div class="w-24">
        <Select
          v-model="language"
          placeholder="Language"
        >
          <Select.Trigger aria-label="Language" />
          <Select.Content>
            <Select.Option
              v-for="o in languageOptions"
              :key="o.value"
              :value="o.value"
              >{{ o.label }}</Select.Option
            >
          </Select.Content>
        </Select>
      </div>
    </template>
    <template #brand>
      <a
        href="/"
        aria-label="Azion home"
      >
        <Brand size="large" />
      </a>
    </template>
    <template #tagline>The web platform for modern workloads</template>
  </Footer>
</template>
```

### SitePlacement

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const language = ref('en')
  const languageOptions = [
    { value: 'en', label: 'EN' },
    { value: 'pt-br', label: 'PT-BR' },
    { value: 'es', label: 'ES' }
  ]
</script>

<template>
  <Footer
    kind="site"
    aria-label="Footer"
  >
    <Footer.Column title="Products">
      <Footer.Link href="/products/edge-application">Edge Application</Footer.Link>
      <Footer.Link href="/products/edge-firewall">Edge Firewall</Footer.Link>
      <Footer.Link href="/products/edge-storage">Edge Storage</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Developers">
      <Footer.Link href="/documentation">Docs</Footer.Link>
      <Footer.Link href="/blog">Blog</Footer.Link>
      <Footer.Link href="/integrations">Integrations</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Company">
      <Footer.Link href="/about">About us</Footer.Link>
      <Footer.Link href="/careers">Careers</Footer.Link>
      <Footer.Link href="/legal">Legal</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Support">
      <Footer.Link href="/contact">Talk to a specialist</Footer.Link>
      <Footer.Link href="/support">Help center</Footer.Link>
      <Footer.Link href="https://status.azion.com/">System status</Footer.Link>
    </Footer.Column>
    <template #social>
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-github"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-linkedin"
        aria-label="Azion on LinkedIn"
        href="https://www.linkedin.com/company/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-youtube"
        aria-label="Azion on YouTube"
        href="https://www.youtube.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-twitter"
        aria-label="Azion on X"
        href="https://x.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-instagram"
        aria-label="Azion on Instagram"
        href="https://www.instagram.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-discord"
        aria-label="Azion on Discord"
        href="https://discord.gg/azion"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-reddit"
        aria-label="Azion on Reddit"
        href="https://www.reddit.com/r/aziontech"
        target="_blank"
      />
    </template>
    <template #status>
      <StatusIndicator
        severity="success"
        label="All Systems Operational"
      />
    </template>
    <template #language>
      <div class="w-24">
        <Select
          v-model="language"
          placeholder="Language"
        >
          <Select.Trigger aria-label="Language" />
          <Select.Content>
            <Select.Option
              v-for="o in languageOptions"
              :key="o.value"
              :value="o.value"
              >{{ o.label }}</Select.Option
            >
          </Select.Content>
        </Select>
      </div>
    </template>
    <template #brand>
      <a
        href="/"
        aria-label="Azion home"
      >
        <Brand size="large" />
      </a>
    </template>
    <template #tagline>The web platform for modern workloads</template>
  </Footer>
</template>
```
