# Footer

> Page footer for marketing, docs and console surfaces: the bottom-of-page counterpart to `AppHeader`. A canvas-colored shell of two bands divided by a hairline rule. Matches the Webkit Footer component set (Figma node 5467:1638, `Type=Default` / `Type=Mobile`). **Two bands.** Top to bottom: the link columns, then the bottom bar. The bottom bar is one row, as azion.com draws it: the brand at the start, the social icons after it, and the status indicator with the language select at the end. There is no separate brand band: the brand sits at the start of the bar at every width, at the 18px height `AppHeaderBrand` gives the header's mark. **Three placements, chosen with `variant`.** - `content` is the default: the bands run full bleed across whatever zone holds the footer and the footer draws no rule above itself. Every band carries `--spacing-lg` inside it — the value `--layout-boundary-inline` resolves to — so the first column title opens on the page boundary by construction. - `site` closes a marketing page and mirrors the site header: it spans the full width of the page with no side rules, opens on a plain full-width top rule with no corner marks, the same clean line as the header's, and insets its content to the header's own measure (`--layout-measure-site-header`), so the first column title and the brand line up under the header's brand at every width. The inset is one custom property (`--footer-inset`, `max(0%, (100% - measure) / 2)`) set on the root and added to each band's own padding, so the band rules stay full width. - `console` is the slim bar under a console page: one row with a top rule, the brand (and any social buttons) at the start, the links of each `Footer.Column` inline after it — the column title becomes the visually hidden name of its `nav` — and the status and language at the end. It wraps onto a second row when the zone is narrow. **Responsive.** The column grid folds from four columns to the 2×2 mobile grid below `md` (768px). The bottom bar stacks below `md`: the brand and the social icons on the first line, the status and the language at the two ends of the second. From `md` it is one row, its two clusters at the two ends, and it wraps instead of clipping when the zone is narrower than both together. All of it is CSS, so the server HTML and the hydrated page are the same tree. Content (links, labels, languages, status, brand) always comes from the consumer; the component owns anatomy, tokens, and responsiveness.

- Import: `import FooterRoot from '@aziontech/webkit/footer-root'`
- Compound import (dot notation, not tree-shakeable): `import Footer from '@aziontech/webkit/footer'`
- Category: layout · Surface: app · Structure: composition
- API as JSON: [footer.json](footer.json)

## When to use

- Use Footer to compose a footer in product, docs or the console.
- Rendering page JSON, or you need a whole band with no custom content → the section (`site-footer-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`footer`).
- The page-level footer of a site or application, paired with `AppHeader`.
- Grouped navigation links at the bottom of the page plus a brand/social/status bar.

## Do

- Compose every band from existing DS components (`Brand`, `IconButton variant="ghost" size="small"`, `StatusIndicator`, `Select`); never rebuild them inside the slots.
- Put `Brand size="small"` in the `brand` slot and make it the home link with `homeHref` (`home-href="/"`) instead of wrapping it in a hand-made anchor: the footer owns the link's focus ring and hover. The footer sizes the mark to the header's 18px.
- Keep column titles short (one or two words) — they are group labels, not headings for prose.
- Give every social `IconButton` an `aria-label`; the footer cannot name them for you.
- Keep the social `IconButton`s at `size="small"`: a 28px box keeps the brand and seven icons beside the status pair on one row from `md`.
- Provide four columns for the canonical desktop presentation; the grid folds to two columns below `md` on its own.
- In `console`, give each column only a few short links (Docs, Status, Legal); the column title is still required, because it names the `nav` for assistive tech.
- Pick the placement from the page: `site` under a marketing page whose header is `SiteHeaderSection`, `console` under a console page, `content` — the default — anywhere else.

## Don’t

- The bottom area of a panel, table, sidebar, or overlay → use that component's own footer part (`panel-footer`, `table-footer`, `sidebar-footer`, `popover-footer`).
- A single standalone link inside body content → use `link` instead of `Footer.Link`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [app-header](app-header.md) — the top-of-page chrome counterpart; the `site` placement spans the page the way the site header does, and the brand takes the header brand's height.
- [brand](brand.md), `icon-button`, `status-indicator`, `select` — the components consumers compose inside the bands; the footer reimplements none of them.
- [site-footer-section](site-footer-section.md) — the marketing site's data-driven footer section, the one `SiteLayout` renders. Use `site-footer-section` for a site page fed from section JSON and `Footer` when composing the bands by hand.
- [registration-frame](registration-frame.md) — draws the plain top rule in the `site` and `console` placements (no corner marks).

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the contentinfo landmark. Empty uses the locale catalog (`Footer`). |
| `variant` | `'content' \| 'site' \| 'console'` | `'content'` | false | Where the footer sits: `content` (the default) runs the bands full bleed across the zone that holds it; `site` spans the page like the site header, opening on a plain full-width rule, like the header's, and insetting its content to the header measure; `console` is one slim bar under a console page, the brand and the links of each column on one line with the status and language at its end. |
| `homeHref` | `string` | `''` | false | When set, the brand slot renders inside one home link to this URL, with the focus ring and the hover of a link. |
| `homeAriaLabel` | `string` | `''` | false | Accessible name of the home link. Empty uses the locale catalog (`Azion home`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Root: the `Footer.Column` items; a 2-column grid that becomes 4 columns at `md`, or one inline row in `console`. |
| `brand` | — | Root: the brand lockup that opens the bottom bar, its mark sized to 18px; inside the home link when `homeHref` is set. |
| `social` | — | Root: the social icon buttons, after the brand at the start of the bottom bar. |
| `status` | — | Root: the system status indicator, at the end of the bottom bar. |
| `language` | — | Root: the language select, after the status. |
| `default` | — | `footer-column`: its `Footer.Link` items. |
| `default` | — | `footer-link`: the link label. |

## Sub-component imports

- `@aziontech/webkit/footer-column`
- `@aziontech/webkit/footer-link`

## Sub-components

- `footer-column/footer-column.vue` — one navigation column: a muted title labelling a stacked group of `Footer.Link` items. Renders a `nav` labelled by its title so each group is a navigable landmark. In the `console` placement the title is visually hidden (still the `nav`'s name) and the links run in a row. Props: `title: string` (required) — column group label, rendered above the links and used as the accessible name of the column landmark. Slot: `default` — its `Footer.Link` items.
- `footer-link/footer-link.vue` — one text link inside a column; the root is the anchor itself, so consumer attributes (`target`, `rel`) land on the `a`. Props: `href: string` (required) — destination URL of the link. Slot: `default` — the link label.

## States

- Visual states: `default` on the shell and columns; `default`, `hover`, `focus-visible`, `active`, `visited` on `footer-link`.
- Placement: `data-variant="content" | "site" | "console"` on the root (from `variant`); the bands and `footer-column` read it through the named group (`group-data-[variant=…]/footer:`).
- No `data-state`; the shell has no interactive states — slotted children own their own.
- Home link (`homeHref` set to a safe URL): the brand cell holds an anchor (`${testId}__home`) with an opacity hover and the `--ring-color` focus ring offset against `--bg-canvas`; empty or unsafe renders the brand alone.

## Accessibility

- Root renders as `<footer>` — the implicit `contentinfo` landmark — with `aria-label` from `ariaLabel`.
- Each `footer-column` renders a `<nav>` labelled via `aria-labelledby` pointing at its title (`useId`), so link groups are unique, navigable landmarks; in `console` the title is visually hidden and still names the `nav`.
- Keyboard map: none on the shell; `Tab` moves through links and controls in DOM order (columns, brand, social, status, language); `Enter` activates.
- Visible focus on links: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- The home link (`homeHref`) is a native anchor named by `homeAriaLabel` (locale fallback `footer.home`), so the logo link always has a name; the brand mark inside it is decoration of that name.
- Contrast ≥4.5:1 for column titles and links on `--bg-canvas`.
- `motion-reduce:transition-none` on the link color transition.
- Touch target: text links are drawn at their text height with `--spacing-xs` between them on a fine pointer; on a coarse pointer each link is 44 px tall (`pointer-coarse:min-h-11`) and the column drops its gap, so the links tile the column without overlapping.

## Right-to-left

- Logical properties only (`me-*`, `ms-auto`, `border-e`, `start`/`end` marks), so under `dir="rtl"` the brand stays at the start edge (the right) and the status and language move to the left.

## Internationalization

- Every string is the consumer's (links, titles, status, languages, brand label); the built-in strings come from the locale catalog: the landmark name `Footer` (`footer.label`, overridden by `ariaLabel`) and the home link name `Azion home` (`footer.home`, overridden by `homeAriaLabel`).
- Long translations wrap: the bar is `flex-wrap`, the columns grow, nothing truncates.

## Responsive

- Below `md`: two-column link grid; the bar stacks the brand and icons over the status and language. From `md`: four columns and a one-row bar that wraps rather than clips. `site` re-centres its content on the header measure at every width; `console` wraps its single row.

## Examples

### Default

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
    aria-label="Footer"
    home-href="/"
  >
    <Footer.Column title="Products">
      <Footer.Link href="/products/applications">Applications</Footer.Link>
      <Footer.Link href="/products/firewall">Firewall</Footer.Link>
      <Footer.Link href="/products/object-storage">Object Storage</Footer.Link>
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
      <Footer.Link href="/contact">Talk to sales</Footer.Link>
      <Footer.Link href="/support">Help center</Footer.Link>
      <Footer.Link href="https://status.azion.com/">System status</Footer.Link>
    </Footer.Column>
    <template #brand>
      <Brand size="small" />
    </template>
    <template #social>
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-github"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-linkedin"
        aria-label="Azion on LinkedIn"
        href="https://www.linkedin.com/company/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-youtube"
        aria-label="Azion on YouTube"
        href="https://www.youtube.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-x-brand"
        aria-label="Azion on X"
        href="https://x.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-instagram"
        aria-label="Azion on Instagram"
        href="https://www.instagram.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-discord"
        aria-label="Azion on Discord"
        href="https://discord.gg/azion"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-reddit"
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
      <div class="w-28">
        <Select
          v-model="language"
          placeholder="Language"
        >
          <Select.Trigger aria-label="Language">
            <template #leading>
              <i
                class="az az-globe text-(--text-muted)"
                aria-hidden="true"
              />
            </template>
          </Select.Trigger>
          <Select.Content>
            <Select.Item
              v-for="o in languageOptions"
              :key="o.value"
              :value="o.value"
              >{{ o.label }}</Select.Item
            >
          </Select.Content>
        </Select>
      </div>
    </template>
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
    variant="site"
    aria-label="Footer"
    home-href="/"
  >
    <Footer.Column title="Products">
      <Footer.Link href="/products/applications">Applications</Footer.Link>
      <Footer.Link href="/products/firewall">Firewall</Footer.Link>
      <Footer.Link href="/products/object-storage">Object Storage</Footer.Link>
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
      <Footer.Link href="/contact">Talk to sales</Footer.Link>
      <Footer.Link href="/support">Help center</Footer.Link>
      <Footer.Link href="https://status.azion.com/">System status</Footer.Link>
    </Footer.Column>
    <template #brand>
      <Brand size="small" />
    </template>
    <template #social>
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-github"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-linkedin"
        aria-label="Azion on LinkedIn"
        href="https://www.linkedin.com/company/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-youtube"
        aria-label="Azion on YouTube"
        href="https://www.youtube.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-x-brand"
        aria-label="Azion on X"
        href="https://x.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-instagram"
        aria-label="Azion on Instagram"
        href="https://www.instagram.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-discord"
        aria-label="Azion on Discord"
        href="https://discord.gg/azion"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-reddit"
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
      <div class="w-28">
        <Select
          v-model="language"
          placeholder="Language"
        >
          <Select.Trigger aria-label="Language">
            <template #leading>
              <i
                class="az az-globe text-(--text-muted)"
                aria-hidden="true"
              />
            </template>
          </Select.Trigger>
          <Select.Content>
            <Select.Item
              v-for="o in languageOptions"
              :key="o.value"
              :value="o.value"
              >{{ o.label }}</Select.Item
            >
          </Select.Content>
        </Select>
      </div>
    </template>
  </Footer>
</template>
```

### Console

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
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
    variant="console"
    aria-label="Footer"
    home-href="/"
    home-aria-label="Azion console home"
  >
    <Footer.Column title="Resources">
      <Footer.Link href="https://www.azion.com/en/documentation/">Docs</Footer.Link>
      <Footer.Link href="https://www.azion.com/en/support/">Support</Footer.Link>
      <Footer.Link href="https://www.azion.com/en/documentation/agreements/privacy-policy/"
        >Privacy</Footer.Link
      >
    </Footer.Column>
    <template #brand>
      <Brand size="small" />
    </template>
    <template #status>
      <StatusIndicator
        severity="success"
        label="All systems operational"
      />
    </template>
    <template #language>
      <div class="w-28">
        <Select
          v-model="language"
          placeholder="Language"
        >
          <Select.Trigger aria-label="Language">
            <template #leading>
              <i
                class="az az-globe text-(--text-muted)"
                aria-hidden="true"
              />
            </template>
          </Select.Trigger>
          <Select.Content>
            <Select.Item
              v-for="o in languageOptions"
              :key="o.value"
              :value="o.value"
              >{{ o.label }}</Select.Item
            >
          </Select.Content>
        </Select>
      </div>
    </template>
  </Footer>
</template>
```
