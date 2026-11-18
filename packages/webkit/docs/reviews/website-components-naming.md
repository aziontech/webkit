# Website components: split and naming review

Date: 2026-11-18. Branch: `review/website-naming` (local, not pushed). Status: **proposed, waiting
for the owner's approval** (DECISIONS.md rows WN01–WN06).

## The question

WebKit keeps its website-facing components in three category folders under
`packages/webkit/src/components/`:

- `docs/`: 23 components for the documentation site, all named `doc-*`.
- `marketing/`: 27 building pieces for the marketing site, named with plain words (`hero`, `faq`,
  `stats`, `section-title`).
- `section/`: 46 whole page bands for the marketing site, all named `*-section`.

The owner asked two things. Do the three name shapes (a `doc-` prefix, a `-section` suffix, plain
words) disagree with each other and with the rest of the library, which uses plain names such as
`button`, `dialog`, `table` and `tabs`? And is the three-way split itself right?

## Short answer

**The split is right, and the three shapes are deliberate. Each carries one meaning that the plain
name could not carry in a single flat namespace.** The comparison with mature systems below backs
that. The real problems are smaller and specific:

1. Two names have no noun and name a label or a behaviour instead of the thing:
   `doc-on-this-page` and `sticky-stack`.
2. Five pieces in `marketing/` are not marketing pieces. They are generic layout and content
   pieces that an app or the docs site uses too: `carousel`, `embed`, `texture`, `card-grid` and
   `bento-grid`.
3. The docs site's navigation does not say how the two marketing groups relate. It shows
   "Marketing" and "Sections" as unrelated siblings, and it describes the pieces as "building
   blocks", although the library reserves "block" for a copyable screen. The examples' titles
   call the pieces "Primitives", a word the theme already uses for raw token values.
4. Nothing checks the `doc-` convention, while the `-section` one is checked.

This branch fixes all four. It renames two components, moves five folders (their import paths do
not change), relabels the navigation and adds one naming check. It leaves the 46 page-section names
and the site's page JSON ids alone. Changing them is possible, but it would only fix small
wording drifts (see "Not changed").

## Current state

### What each name shape means today

| Shape            | Where        | Meaning                                                                                                                                                                                                                                                                                                                    | Machine check                              |
| ---------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `doc-<thing>`    | `docs/`      | Only for the documentation site. The `<thing>` is usually the Mintlify MDX tag that `DocMarkdown` maps to it (`<Callout>` → `doc-callout`, `<CardGroup>` → `doc-card-group`, `<Tabs>`/`<Tab>` → `doc-tabs`/`doc-tab`, `<Steps>` → `doc-steps`, `<Frame>` → `doc-frame`, `<Prompt>` → `doc-prompt`, `<Item>` → `doc-item`). | none (added on this branch: `docs-prefix`) |
| `<thing>`        | `marketing/` | A piece you compose by hand in an SFC, with slots: a band primitive (`hero`, `faq`, `stats`, `call-to-action`), an item (`feature-item`, `media-tile`, `quote`) or the page frame (`section-container`, `section-gap`, `section-module`, `section-stack`, `section-title`, `site-page`).                                   | none needed: the plain default             |
| `<what>-section` | `section/`   | A whole band that the marketing site places from page JSON. Its name is the `_id` the JSON writes, so it takes props only (no slots).                                                                                                                                                                                      | `section-suffix` (N12)                     |

### Where the names overlap

These pairs are intentional. Each is one band offered at two levels (piece and ready band) or on
two surfaces (marketing and docs). The suffix or prefix is the only thing that tells them apart in
the one flat namespace (`@aziontech/webkit/<name>`):

| Concept               | Marketing piece                             | Page section                                                                                         | Docs                                    | App          |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------ |
| Opening band          | `hero`                                      | `hero-section`, `hero-form-section`                                                                  | `doc-hero`                              | —            |
| Closing ask           | `call-to-action`                            | `closing-call-to-action-section`, `newsletter-section`                                               | `doc-call-to-action`                    | —            |
| Questions             | `faq`                                       | `faq-section`                                                                                        | `doc-accordion-group` + `doc-accordion` | `accordion`  |
| Figures               | `stats`                                     | `stats-section`                                                                                      | —                                       | —            |
| Logos                 | `logo-wall`, `marquee`                      | `logo-wall-section`, `compliance-logos-section`, `investor-marks-section`                            | —                                       | `logo`       |
| Testimonials          | `quote`, `quote-tabs`                       | `client-quotes-section`, `recognition-marquee-section`                                               | —                                       | —            |
| Copy beside a picture | `media-split`, `media-tabs`, `sticky-stack` | `media-split-section`, `media-split-stack-section`, `feature-tabs-section`, `feature-scroll-section` | —                                       | —            |
| Card grid             | `card-grid`, `bento-grid`                   | `capability-grid-section`, `feature-tiles-section`                                                   | `doc-card-group` + `doc-card`           | `card`       |
| Tabs                  | `media-tabs`, `quote-tabs`                  | —                                                                                                    | `doc-tabs` + `doc-tab`                  | `tabs`       |
| Callout               | —                                           | —                                                                                                    | `doc-callout`                           | `alert`      |
| Pager                 | —                                           | —                                                                                                    | `doc-previous-next`                     | `pagination` |

### Inconsistencies found

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                     | Severity                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| F1  | `doc-on-this-page` is named after its visible heading ("On this page"), not after the thing. It has no noun, which breaks naming.md's "modifier first, noun last". Every docs framework calls it a table of contents (`TableOfContents`, `TOC`).                                                                                                                                            | real                             |
| F2  | `sticky-stack` names how it behaves (it pins, it stacks), not what it shows. It is the scroll-driven twin of `media-tabs`: claims on one side, one picture on the other, and the scroll position picks the claim. It also reads like a relative of the unrelated `section-stack`. Its page section is `feature-scroll-section`, while `media-tabs` pairs with `feature-tabs-section`.       | real                             |
| F3  | `carousel`, `embed` and `texture` are generic content pieces, and `card-grid` and `bento-grid` are generic layout grids (built on `registration-frame`, which already lives in `layout/`). `texture` is painted by `console-mockup` and `doc-agent-card`, and `card-grid` is used by the docs home and the `browser-frame` examples. Filed under Marketing, an app author never finds them. | real                             |
| F4  | The docs site's navigation shows "Marketing" and "Sections" as siblings with no stated link. The Marketing lead says "building blocks", although "block" means a copyable screen (naming.md § 3). The example titles say `Marketing/Primitives`, and "primitives" already names the raw token layer of `@aziontech/theme`.                                                                  | real (wording)                   |
| F5  | The `doc-` convention is not machine-checked, so a docs piece without the prefix, or a `doc-` name outside `docs/`, would pass CI.                                                                                                                                                                                                                                                          | gap                              |
| F6  | `settings-section` (layout, console) ends in `-section` but is not a page section, so the suffix does not mean only "page band".                                                                                                                                                                                                                                                            | minor, outside the three folders |
| F7  | Page-section wording drifts: `client-*` (three sections) against `customer-use-cases-section`, and `*-logos-section` against `investor-marks-section`. The words come from the marketing site's own `_id`s (`customer-use-cases`, `investor-marks`), carried over with `-section` appended.                                                                                                 | minor                            |
| F8  | The `docs/` folder is plural-looking while the prefix is singular `doc-`. Both are in the closed lists (category `docs`, naming.md § 12).                                                                                                                                                                                                                                                   | cosmetic, not changed            |

## How mature systems do it

### Documentation components

| System                                                                                           | Content pieces (callout, steps, cards, tabs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Page parts (layout, page, TOC, pager)                                                                                                                                                                                          | Surface prefix?                                                                     |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [Mintlify](https://www.mintlify.com/docs/components/callouts)                                    | `Callout` (+ `Note`, `Tip`, `Warning`, `Info`, `Check`, `Danger`), [`Steps`/`Step`](https://www.mintlify.com/docs/components/steps), [`Card`, `Columns`](https://www.mintlify.com/docs/components/cards), [`CodeGroup`](https://www.mintlify.com/docs/components/code-groups), [`Tabs`/`Tab`](https://www.mintlify.com/docs/components/tabs), [`AccordionGroup`/`Accordion`](https://www.mintlify.com/docs/components/accordions), [`Frame`](https://www.mintlify.com/docs/components/frames), [`Update`](https://www.mintlify.com/docs/components/update), [`Prompt`](https://www.mintlify.com/docs/components/prompt) | not exposed                                                                                                                                                                                                                    | no                                                                                  |
| [Fumadocs UI](https://fumadocs.dev/docs/ui/layouts/page)                                         | `Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`, `Accordions`/`Accordion`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `DocsLayout`, `DocsPage`, `DocsTitle`, `DocsDescription`, `DocsBody`, `TOC`, `InlineTOC`                                                                                                                                       | **`Docs` on page parts only**                                                       |
| [Docusaurus](https://docusaurus.io/docs/markdown-features/admonitions)                           | `Admonition`, `Tabs`/`TabItem`, `CodeBlock`, `Details`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `DocItem`, `DocPaginator`, `DocCard`, `DocCardList`, `DocSidebar`, `DocBreadcrumbs`, `TOC` (theme in [docusaurus-theme-classic](https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-theme-classic/src/theme)) | **`Doc` on doc-page parts**, next to `Blog*`, because one theme serves two surfaces |
| [VitePress](https://vitepress.dev/guide/markdown)                                                | Markdown containers (`::: tip`, `::: code-group`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `VPDoc`, `VPDocFooter`, `VPDocAsideOutline`, `VPHero`                                                                                                                                                                          | `VP` on everything, and `VPDoc` on doc parts                                        |
| [Starlight](https://starlight.astro.build/reference/overrides/)                                  | `Aside`, [`CardGrid`/`Card`/`LinkCard`](https://starlight.astro.build/components/card-grids/), `Steps`, [`Tabs`/`TabItem`](https://starlight.astro.build/components/tabs/)                                                                                                                                                                                                                                                                                                                                                                                                                                              | `PageTitle`, `TableOfContents`, `Pagination`, `Sidebar`                                                                                                                                                                        | no                                                                                  |
| [Nextra](https://nextra.site/docs/built-ins/callout)                                             | `Callout`, `Cards`, `Steps`, `Tabs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `Layout`, `Navbar`, `Footer`                                                                                                                                                                                                   | no                                                                                  |
| [Primer Doctocat](https://primer.style/doctocat)                                                 | `Note`, `Caption`, `DoDontContainer`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `table-of-contents`, `page-footer`                                                                                                                                                                                             | no, because it is a separate package                                                |
| [Carbon Gatsby theme](https://github.com/carbon-design-system/gatsby-theme-carbon)               | `InlineNotification`, `Aside`, `Accordion`, `Tabs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `PageHeader`, `AnchorLinks`, `NextPrevious`                                                                                                                                                                                    | no, because it is a separate package                                                |
| [Cloudscape](https://cloudscape.design/components/help-panel/index.html.md), Atlassian, Material | no docs-site kit (Cloudscape's Help panel is an app component)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | —                                                                                                                                                                                                                              | —                                                                                   |

What this shows: plain names win when the docs kit is **its own package**, where `Tabs` collides
with nothing. A prefix appears exactly when **one package serves more than one surface**
(Docusaurus `Doc*` beside `Blog*`, Fumadocs `Docs*`, VitePress `VPDoc*`). WebKit is that case: the
same flat namespace already holds the app's `tabs`, `accordion`, `card`, `alert`, `hero` and
`pagination`. The common names for the two pieces we rename are `TableOfContents`/`TOC` (Starlight,
Fumadocs, Docusaurus, Primer) and `Pagination`/`DocPaginator`/`NextPrevious` for the pager.

### Marketing pieces and page sections

| System                                                                                            | Split                                                                                                                                                                                                                                                                              | Section names                                                                                                                        | Prefix or suffix?                  |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| [Tailwind Plus](https://tailwindcss.com/plus/ui-blocks/marketing)                                 | Marketing → **Page Sections** (Hero Sections, Feature Sections, CTA Sections, Bento Grids, Pricing Sections, Header Sections, Newsletter Sections, Stats, Testimonials, Logo Clouds, FAQs, Footers…) · **Elements** (Headers = the nav bar, Flyout Menus, Banners) · Page Examples | category labels, not component names                                                                                                 | "Sections" in most labels, not all |
| [Supabase www](https://github.com/supabase/supabase/tree/master/apps/www/components)              | `Sections/` folder plus `Layouts/` (`SectionContainer`, `SectionHeading`)                                                                                                                                                                                                          | `FeaturesSection`, `CustomerQuotesSection`, `UseCasesSection`, `CTASection` next to `ProductHeader`, `CTABanner`, `FaqList`, `Quote` | `Section` suffix on about half     |
| [Supabase design system](https://supabase.com/design-system/docs)                                 | Atom / Fragment components, UI patterns                                                                                                                                                                                                                                            | no marketing set (app `Page Section`, `Page Container`)                                                                              | —                                  |
| [shadcn/ui blocks](https://ui.shadcn.com/blocks), [shadcn-vue](https://www.shadcn-vue.com/blocks) | app screens only (sidebar, login, signup, dashboard)                                                                                                                                                                                                                               | `login-03`, `sidebar-07`                                                                                                             | —                                  |
| [Vercel Geist](https://vercel.com/geist/introduction)                                             | about 80 app components, no marketing sections                                                                                                                                                                                                                                     | —                                                                                                                                    | —                                  |
| [Flowbite](https://flowbite-svelte.com/blocks/marketing)                                          | Blocks → Marketing                                                                                                                                                                                                                                                                 | Hero Sections, Feature Sections, CTA Sections, FAQ Sections, Customer Logos, Footer Sections                                         | "Sections" labels                  |
| [Aceternity](https://ui.aceternity.com/blocks)                                                    | Blocks                                                                                                                                                                                                                                                                             | Hero Sections, Feature Sections, Logo Clouds, Stats Sections, FAQs, Footers                                                          | "Sections" labels                  |
| [Mantine UI](https://ui.mantine.dev/)                                                             | Page sections · Application UI                                                                                                                                                                                                                                                     | Hero headers, Features section, Frequently asked questions                                                                           | —                                  |
| [Magic UI](https://magicui.design/docs/components)                                                | free atoms (Marquee, Bento Grid, Globe) · Pro page sections                                                                                                                                                                                                                        | Header, Hero, Feature, Pricing, FAQ, Footer                                                                                          | no                                 |

What this shows: every catalog that has marketing sections separates **pieces** (Tailwind's
"Elements", Magic UI's atoms) from **whole page sections**, which is exactly our
`marketing/` + `section/` split. "Section" is the shared word for a whole band, but most catalogs
use it as a category label, not in the component name. Supabase's own site code, the one real
codebase in the set, puts it in the name about half the time (`UseCasesSection`,
`CustomerQuotesSection`). **Nobody prefixes by surface** (`marketing-`, `site-`).

WebKit does need the word in the name, because two reasons stack. The namespace is flat, so `faq`
and the ready FAQ band cannot both be called `faq`. And the section's name is the page JSON `_id`,
so the name is the contract with the marketing site. N12 ("every page section ends in `-section`")
is the consistent, always-applied version of what Supabase does half the time, and it matches the
catalogs' "… Sections" labels. **Keep it.**

## Recommendation

1. **Keep the three surfaces and the three folders.** Docs pieces, marketing pieces and page
   sections are the split every comparable system makes (docs kits apart, and Tailwind's Elements
   apart from Page Sections).
2. **Keep the three name shapes, and write down why each exists**, in one new naming.md section
   ("Website components"):
   - `doc-<thing>` for every docs-site piece. The prefix exists because the flat namespace already
     holds the plain app names, as in Docusaurus. It applies to the whole folder, never to part of
     it: dropping it only where the plain name is free (`code-group`, `prose`, `frame`) would leave
     a mixed set where nobody can tell which pieces are docs-only. The `<thing>` is the MDX tag
     when `DocMarkdown` renders one, otherwise a noun.
   - Plain `<thing>` for a marketing piece composed by hand.
   - `<what>-section` for a page band placed from page JSON (N12, unchanged).
3. **Fix the outliers:**
   - `doc-on-this-page` → **`doc-table-of-contents`** (F1). This is the standard name, and it has
     a noun. The visible heading stays "On this page".
   - `sticky-stack` → **`media-scroll`** (F2). It is the scroll-driven twin of `media-tabs`, which
     mirrors the existing section pair `feature-tabs-section` / `feature-scroll-section`.
   - `doc-previous-next` **stays** as it is. "Previous / next" is plain, matches Carbon's
     `NextPrevious`, and `doc-pagination` is the retired 5.x name that 6.0 already replaced
     (`v6.json`). Bringing it back would trip `export-retired`.
4. **Move the five generic pieces out of `marketing/`** (F3): `carousel`, `embed` and `texture`
   go to `content/`, and `card-grid` and `bento-grid` go to `layout/`, next to `registration-frame`.
   Import paths do not change (`@aziontech/webkit/card-grid`), because the category never appears
   in the public name (imports.md).
5. **Make the docs navigation say what the groups are** (F4): "Docs", "Marketing" (pieces) and
   "Page sections" (ready bands), each with a lead that says when to pick it. The examples' title
   level `Marketing/Primitives` becomes `Marketing/Elements`, Tailwind's word.
6. **Check the `doc-` convention** (F5): a new naming rule `docs-prefix` requires every component
   in `docs/` to start with `doc-`, and allows `doc-` names only in `docs/`. It is the mirror of
   `section-suffix`.

## Rename and move map

| Old                                                     | New                                                              | Kind          | Migration                                                                                   |
| ------------------------------------------------------- | ---------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------- |
| `@aziontech/webkit/doc-on-this-page` · `DocOnThisPage`  | `@aziontech/webkit/doc-table-of-contents` · `DocTableOfContents` | rename        | `v6.json` components, `webkit migrate` rewrites imports and tags                            |
| `DocOnThisPageItem` (and the other exported types)      | `DocTableOfContentsItem`, …                                      | type rename   | via the component entry                                                                     |
| `data-testid="doc-on-this-page"` (+ `__…` parts)        | `doc-table-of-contents`                                          | test id       | `v6-testids.json`                                                                           |
| i18n `docOnThisPage.*`                                  | `docTableOfContents.*`                                           | message keys  | locale catalogs (en, es, pt-BR)                                                             |
| `@aziontech/webkit/sticky-stack` · `StickyStack`        | `@aziontech/webkit/media-scroll` · `MediaScroll`                 | rename        | `v6.json` components; the 5.x `@index-change` rule moves to `v6-props.json["media-scroll"]` |
| `StickyStackItem` (and the other exported types)        | `MediaScrollItem`, …                                             | type rename   | via the component entry                                                                     |
| `data-testid="sticky-stack"` (+ parts)                  | `media-scroll`                                                   | test id       | `v6-testids.json`                                                                           |
| `marketing/carousel`                                    | `content/carousel`                                               | folder move   | none (import path unchanged)                                                                |
| `marketing/embed`                                       | `content/embed`                                                  | folder move   | none                                                                                        |
| `marketing/texture`                                     | `content/texture`                                                | folder move   | none                                                                                        |
| `marketing/card-grid`                                   | `layout/card-grid`                                               | folder move   | none                                                                                        |
| `marketing/bento-grid`                                  | `layout/bento-grid`                                              | folder move   | none                                                                                        |
| examples title `Components/Marketing/Primitives/<Name>` | `Components/Marketing/Elements/<Name>`                           | docs taxonomy | none                                                                                        |
| docs nav "Sections"                                     | "Page sections"                                                  | label         | none                                                                                        |

Page JSON: **no `_id` changes.** `doc-table-of-contents` and `media-scroll` are not page sections,
so the site's stored pages keep rendering untouched.

## Not changed, and why

| Option                                                                                                       | Why not (now)                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drop the `doc-` prefix (Mintlify-style plain names)                                                          | It collides with `tabs`, `accordion`, `card`, `hero`, `call-to-action` and `pagination`, and `callout` is a banned market alias of `alert`. Dropping it only where the name is free gives a mixed set. Docusaurus is the closest analogue and keeps its prefix. |
| One surface prefix for the marketing site too (`site-hero`, `site-faq`)                                      | No catalog does this. It would rename 27 pieces and 46 sections and every page `_id`, for no gain in meaning.                                                                                                                                                   |
| Drop the `-section` suffix (N12)                                                                             | `faq`/`faq-section`, `hero`/`hero-section` and `stats`/`stats-section` would collide in the flat namespace, and the `_id` contract would lose its marker.                                                                                                       |
| Merge `marketing/` and `section/` into one folder                                                            | The folder is what `SitePage`'s registry and the `section-suffix` check key on, and the docs nav shows the two levels separately on purpose.                                                                                                                    |
| `customer-use-cases-section` → `use-cases-section`, `investor-marks-section` → `investor-logos-section` (F7) | They are real wording drifts, but each changes a page `_id` that the marketing site stores. Possible with a data alias in `sitePageSectionAliases`. **Owner decision WN05.**                                                                                    |
| Rename the console's `settings-section` (F6)                                                                 | It is outside the three folders, and the rename would touch every console settings page. **Owner decision WN06.**                                                                                                                                               |
| `docs/` → `doc/` folder (F8)                                                                                 | Cosmetic. The category is in the closed list, and it never reaches a public name.                                                                                                                                                                               |
| `doc-item` → a longer noun                                                                                   | `doc-item` is the component behind the MDX `<Item>` tag. The `doc-<tag>` rule keeps it.                                                                                                                                                                         |

## Risks

- **Breaking for 5.x apps**: `doc-on-this-page` and `sticky-stack` shipped in 5.x. 6.0 is the one
  clean break: `webkit migrate v6` rewrites both from `v6.json`, and `webkit/no-deprecated-name`
  flags any left over. No alias is kept (deprecation.md).
- **Docs links**: `/components/doc-on-this-page` and `/components/sticky-stack` become
  `/components/doc-table-of-contents` and `/components/media-scroll`. Moved folders keep their URLs
  (the URL has no category).
- **Visual baselines**: the two renamed examples' screenshots are renamed with them (same pixels,
  new path). No regeneration is needed for the moves, because the baseline path has no category.
- **Spec checksums**: the renamed and moved specs get fresh body checksums. Their status stays
  `implemented`.

## Open owner decisions

| ID   | Question                                                                                                                      | My call                          |
| ---- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| WN01 | Keep the three surfaces and folders (docs, marketing, section) and the three name shapes, now written down in naming.md § 24. | yes                              |
| WN02 | Rename `doc-on-this-page` → `doc-table-of-contents` and `sticky-stack` → `media-scroll` in 6.0.                               | yes                              |
| WN03 | Move `carousel`, `embed`, `texture` → `content/` and `card-grid`, `bento-grid` → `layout/`.                                   | yes                              |
| WN04 | Relabel the docs nav ("Page sections") and the example titles (`Marketing/Elements`), and add the `docs-prefix` check.        | yes                              |
| WN05 | Rename the two drifting page sections (`customer-use-cases-section`, `investor-marks-section`) with a page-data alias.        | not now: the site owns the ids   |
| WN06 | Rename the console's `settings-section` so that `-section` means only a page band.                                            | not now: separate console change |

## Results on this branch

| Check                                                                                            | Result                                                                               |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `pnpm --filter @aziontech/webkit run gates` (with a `!` PR title)                                | pass, every gate (naming, catalog, API diff, migrations, size, specs, toolkit tests) |
| `pnpm lint:webkit`                                                                               | pass                                                                                 |
| `pnpm typecheck:webkit`                                                                          | pass                                                                                 |
| Vitest browser, 23 files: the renamed and moved components and every component that imports them | 677 of 678 pass                                                                      |
| `pnpm build:docs`, `pnpm build:demos`                                                            | pass                                                                                 |

Pre-existing failure, not caused here: `hero-title.test.ts` › "closes the eyebrow with the blinking
cursor" expects an `.animate-blink` element that `hero-title.vue` no longer renders on the base
commit `0dc12b196` either (the file is unchanged on this branch).

Not run: the styled visual suite (`apps/visual`), whose baselines come only from the CI container.
The two renamed examples' baselines were renamed, not regenerated.

## Inventory

How to read the counts: "Blocks" and "Docs app" count the files that import the component by its
public path. "Other examples" counts example files outside the component's own folder.
"Other components" counts components that import it by relative path (a page section counts once,
through `site-page`'s registry).

Before this branch (names and folders as they were):

### `docs/`

| Component             | What it is                                                                                                                               | Blocks | Other examples | Docs app | Other components |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -----: | -------------: | -------: | ---------------: |
| `doc-accordion`       | One collapsible entry inside a DocAccordionGroup.                                                                                        |      1 |              2 |        0 |                1 |
| `doc-accordion-group` | The FAQ and "expand for detail" block of a documentation page.                                                                           |      1 |              1 |        0 |                1 |
| `doc-agent-card`      | The "Your AI agent, fluent in Azion" card that opens the first section of a documentation home.                                          |      1 |              0 |        0 |                0 |
| `doc-callout`         | The admonition a documentation page interrupts itself with —                                                                             |      4 |              0 |        0 |                1 |
| `doc-call-to-action`  | The closing offer of a documentation page, parked at the foot of the "On this page" rail after the outline.                              |      1 |              1 |        0 |                0 |
| `doc-card`            | One cell of the grid a documentation page scans across:                                                                                  |      5 |              2 |        2 |                1 |
| `doc-card-group`      | The framed, responsive grid a DocCard set sits in.                                                                                       |      5 |              0 |        2 |                1 |
| `doc-changelog-entry` | One entry in a changelog:                                                                                                                |      0 |              0 |        0 |                1 |
| `doc-code-group`      | One or more code samples of the same thing in different languages or package managers, rendered on CodeBlock so the docs inherit its…    |      1 |              0 |        0 |                1 |
| `doc-frame`           | The bordered surface every screenshot, diagram and clip in a documentation page sits on, so no media floats loose on the canvas and all… |      1 |              0 |        0 |                1 |
| `doc-heading`         | A documentation section heading that is also the link to itself.                                                                         |      6 |              2 |        0 |                1 |
| `doc-hero`            | The masthead of a documentation home:                                                                                                    |      1 |              0 |        0 |                0 |
| `doc-item`            | One row of the documentation's related-content list:                                                                                     |      2 |              0 |        0 |                1 |
| `doc-layout`          | The documentation chrome, composed once in the app:                                                                                      |      1 |              0 |        0 |                0 |
| `doc-markdown`        | Renders a documentation page written in Markdown with Mintlify-style MDX component tags into the documentation components.               |      1 |              0 |        0 |                0 |
| `doc-on-this-page`    | The "On this page" rail:                                                                                                                 |      0 |              1 |        1 |                2 |
| `doc-page-header`     | The masthead of a documentation page:                                                                                                    |      5 |              2 |        6 |                0 |
| `doc-previous-next`   | The previous / next pair that closes a documentation page.                                                                               |      5 |              0 |        0 |                0 |
| `doc-prompt`          | DocPrompt renders text the reader is meant to **run, not read** —                                                                        |      2 |              0 |        0 |                1 |
| `doc-prose`           | The typography contract every documentation page inherits.                                                                               |      9 |              7 |        4 |                1 |
| `doc-steps`           | The ordered walkthrough from the docs frame:                                                                                             |      2 |              0 |        0 |                1 |
| `doc-tab`             | One panel inside DocTabs.                                                                                                                |      1 |              1 |        0 |                1 |
| `doc-tabs`            | Alternative paths through the same instruction ("macOS / Linux / Windows", "Console / CLI").                                             |      1 |              1 |        0 |                1 |

### `marketing/`

| Component           | What it is                                                                                                                        | Blocks | Other examples | Docs app | Other components |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -----: | -------------: | -------: | ---------------: |
| `backdrop`          | The decorative backdrop a site, hub or docs band stands on, for a Hero background slot or any band with relative overflow-hidden: |      0 |              0 |        0 |                0 |
| `bento-grid`        | A mosaic of unequal cells on one set of shared rules:                                                                             |      0 |              0 |        0 |                3 |
| `call-to-action`    | The closing ask of a marketing page:                                                                                              |      0 |              3 |        0 |                2 |
| `card-grid`         | The responsive cell grid of the page language, in three registers:                                                                |      0 |              3 |        1 |               16 |
| `carousel`          | A horizontally scrollable track of cards with snap points and a pair of step controls.                                            |      0 |              0 |        0 |                1 |
| `diagram`           | A node-and-connector diagram for marketing pages:                                                                                 |      1 |              0 |        0 |                1 |
| `embed`             | A responsive iframe for third-party content —                                                                                     |      0 |              0 |        0 |                0 |
| `faq`               | The frequently-asked-questions band of a marketing page:                                                                          |      0 |              0 |        0 |                1 |
| `feature-item`      | One claim stated in three parts:                                                                                                  |      0 |              4 |        0 |                6 |
| `hero`              | The opening band of a page:                                                                                                       |      1 |              0 |        1 |                2 |
| `link-directory`    | A directory of destinations laid out in columns on one set of shared hairlines:                                                   |      0 |              0 |        0 |                1 |
| `logo-wall`         | The customer-proof band of a marketing page:                                                                                      |      0 |              0 |        0 |                3 |
| `marquee`           | An endlessly looping row of brand marks —                                                                                         |      0 |              1 |        0 |                2 |
| `media-split`       | A two-column band pairing a block of copy with a piece of media —                                                                 |      0 |              2 |        0 |                4 |
| `media-tabs`        | A band split in two:                                                                                                              |      0 |              2 |        0 |                2 |
| `media-tile`        | One cell of a media band:                                                                                                         |      0 |              0 |        0 |                2 |
| `quote`             | A single customer testimonial:                                                                                                    |      0 |              4 |        0 |                4 |
| `quote-tabs`        | A testimonial band a reader browses by client:                                                                                    |      0 |              0 |        0 |                1 |
| `section-container` | The framed content column:                                                                                                        |      1 |             70 |        1 |                3 |
| `section-gap`       | The empty registration frame that divides two page sections.                                                                      |      1 |             68 |        0 |                2 |
| `section-module`    | The brick of the page column:                                                                                                     |      1 |              7 |        1 |               40 |
| `section-stack`     | A run of framed bands that follow one another down the page, each one drawn as two registration frames —                          |      0 |              0 |        0 |                1 |
| `section-title`     | The framed header row that opens a page section:                                                                                  |      0 |              4 |        0 |               37 |
| `site-page`         | The page renderer of the marketing site:                                                                                          |      0 |              0 |        0 |                0 |
| `stats`             | A band of headline figures —                                                                                                      |      1 |              0 |        0 |                2 |
| `sticky-stack`      | A band that pins to the viewport and is read by scrolling through it:                                                             |      0 |              0 |        0 |                1 |
| `texture`           | The one decorative surface every band in the system is painted on:                                                                |      1 |              3 |        0 |               20 |

### `section/`

| Component                        | What it is                                                                                                                                | Blocks | Other examples | Docs app | Other components |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -----: | -------------: | -------: | ---------------: |
| `architecture-tabs-section`      | The architecture band of a product page:                                                                                                  |      0 |              0 |        0 |                1 |
| `article-body-section`           | The reading page of an article.                                                                                                           |      0 |              0 |        0 |                1 |
| `article-cards-section`          | A titled row of three linked article cards on one hairline frame grid with no gutter, stacking to one column on mobile.                   |      0 |              0 |        0 |                1 |
| `article-highlight-section`      | The band that opens a blog under its hero.                                                                                                |      0 |              0 |        0 |                1 |
| `article-index-section`          | Every article or resource of a blog or a resource hub as one ruled list, with the controls to narrow it on one row.                       |      0 |              0 |        0 |                1 |
| `capability-grid-section`        | A framed grid of claims or links under an optional section title:                                                                         |      0 |              0 |        0 |                1 |
| `card-carousel-section`          | The titled card-carousel-section band of a product or solution page:                                                                      |      0 |              0 |        0 |                1 |
| `client-mosaic-section`          | The client mosaic:                                                                                                                        |      0 |              0 |        0 |                1 |
| `client-quotes-section`          | The client-stories band:                                                                                                                  |      0 |              0 |        0 |                1 |
| `client-story-columns-section`   | Three featured success stories side by side:                                                                                              |      0 |              0 |        0 |                1 |
| `cli-terminal-section`           | The Azion CLI band of a product page:                                                                                                     |      0 |              0 |        0 |                1 |
| `closing-call-to-action-section` | The last ask at the end of a landing page, followed by a hatched closing frame with no rules of its own, because the site footer under…   |      0 |              2 |        0 |                1 |
| `competitor-comparison-section`  | The capability-by-capability comparison of Azion with one competitor on a migration landing page:                                         |      0 |              0 |        0 |                1 |
| `compliance-logos-section`       | The compliance band:                                                                                                                      |      0 |              0 |        0 |                1 |
| `console-showcase-section`       | A full-width framed panel that presents a product scene (a console mock or a diagram) under a section title, on a texture, with optional… |      0 |              2 |        0 |                1 |
| `contact-hub-section`            | The band under the Contact title band:                                                                                                    |      0 |              0 |        0 |                1 |
| `copy-command-section`           | A one-line command or agent prompt with a copy button, set in a large InputGroup under hero or section copy ("npm create azion", "Ask…    |      0 |              2 |        0 |                2 |
| `customer-use-cases-section`     | The "what teams use it for" band of a product page:                                                                                       |      0 |              0 |        0 |                1 |
| `faq-section`                    | The frequently asked questions band near the end of a landing page:                                                                       |      0 |              0 |        0 |                1 |
| `feature-scroll-section`         | The walkthrough band of a product page:                                                                                                   |      0 |              0 |        0 |                1 |
| `feature-tabs-section`           | The feature walkthrough band of a product page:                                                                                           |      0 |              0 |        0 |                1 |
| `feature-tiles-section`          | The reasons band of a marketing page:                                                                                                     |      0 |              0 |        0 |                1 |
| `feature-widgets-section`        | The "three ways to start" band of a product page:                                                                                         |      0 |              0 |        0 |                1 |
| `hero-form-section`              | The opening band of a lead-capture page, where the form is the reason for the page:                                                       |      0 |              0 |        0 |                1 |
| `hero-section`                   | The opening band of a marketing page:                                                                                                     |      0 |              3 |        0 |                1 |
| `investor-marks-section`         | The investors band:                                                                                                                       |      0 |              0 |        0 |                1 |
| `job-posting-section`            | The body of a careers posting page, under the posting's title band:                                                                       |      0 |              0 |        0 |                1 |
| `listing-index-section`          | The full, browsable listing of a page such as the Careers jobs list:                                                                      |      0 |              0 |        0 |                1 |
| `listing-table-section`          | A titled preview of a longer listing:                                                                                                     |      0 |              0 |        0 |                1 |
| `logo-wall-section`              | The customers band:                                                                                                                       |      0 |              0 |        0 |                1 |
| `media-split-section`            | One claim beside its picture, on its own frame:                                                                                           |      0 |              0 |        0 |                1 |
| `media-split-stack-section`      | A run of large media-split bands that pile up under the site header as the page scrolls, each a centered claim with an outlined "learn…   |      0 |              0 |        0 |                1 |
| `network-section`                | The infrastructure band of a marketing page:                                                                                              |      0 |              0 |        0 |                1 |
| `newsletter-section`             | The closing band whose ask is a newsletter sign-up:                                                                                       |      0 |              0 |        0 |                1 |
| `photo-marquee-section`          | The office band of the careers page:                                                                                                      |      0 |              0 |        0 |                1 |
| `plan-comparison-section`        | The feature-by-feature matrix under the plan cards on Pricing:                                                                            |      0 |              0 |        0 |                1 |
| `platform-directory-section`     | A directory of Azion's products under a section title:                                                                                    |      0 |              0 |        0 |                1 |
| `pricing-plans-section`          | The plan cards at the top of Pricing:                                                                                                     |      0 |              0 |        0 |                1 |
| `process-scroll-section`         | The stages of a process as a row of numbered dark cards on a pixel texture, under a section title.                                        |      0 |              0 |        0 |                1 |
| `recognition-marquee-section`    | The analyst-recognition band:                                                                                                             |      0 |              0 |        0 |                1 |
| `site-footer-section`            | The footer under every marketing page:                                                                                                    |      0 |              0 |        0 |                1 |
| `site-header-section`            | The marketing site's own navigation:                                                                                                      |      0 |              0 |        0 |                1 |
| `stats-section`                  | The proof-by-numbers band of a marketing page:                                                                                            |      0 |              0 |        0 |                1 |
| `story-index-section`            | Every success story of a company as one filterable library.                                                                               |      0 |              0 |        0 |                1 |
| `subject-grid-section`           | A library of learning subjects in a divider grid:                                                                                         |      0 |              0 |        0 |                1 |
| `template-gallery-section`       | The templates band of a solution page:                                                                                                    |      0 |              0 |        0 |                1 |
