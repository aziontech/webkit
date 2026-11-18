# Rule: site pages — the Web Design Guide (SD-01 to SD-25)

The design rules for every Azion web page: the marketing site, campaign landing pages and any
page an app renders with `SitePage` and the page sections. Each rule has a stable ID, is stated
once, here, and is cited by that ID in reviews, reports and checks. A retired ID stays in the
index and is never reused. These rules hold for web pages only: product UI (the console, sign-in
screens, settings, create flows) follows `/webkit-product-screens` and never takes an SD rule.

How a section is found, imported and fed is rule `webkit-sections`; how the column is measured
is rule `webkit-page-layout`. This rule says what a page may put on that column, and why. The
skill that runs a page task end to end is `/webkit-site-pages`.

Each rule is written the same way: the rule, **Incorrect**, **Correct**, **Why** and
**Exceptions** (`none` when there are none).

## Where the content comes from

WebKit owns the design: which sections a page uses, the hero, the frame, the assets, the action
labels. Marketing owns the content, in its own toolkit, and WebKit only points there:

| Content                                                      | Source (marketing)                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Positioning, claims, metrics, use cases, personas, customers | the `azion-kb` knowledge base (`product-marketing/`, `gtm-definitions/`) |
| Voice, headline patterns, every label not listed in SD-04    | the `azion-brand-voice` skill                                            |
| Product names                                                | `azion-kb` `company-definitions/product-naming.md`                       |
| Required, forbidden and deprecated terms; editorial style    | `azion-kb` `brand-guidelines/terminology.md`, `editorial-style.md`       |
| Translation into pt-BR and es                                | the `translate-content` skill                                            |

When this rule and any other design document disagree about a design decision, this rule wins
and the other document is fixed.

Four parts are the marketing site's own decisions: the action labels (SD-04), the product and
Solution page patterns (SD-22, SD-23), the line budgets (SD-24) and Photography and generated
art. The site's documentation decides them. WebKit keeps them here as the sample its examples,
blocks and demos follow, and updates them when the site's documentation changes; for the site,
its documentation wins.

## Index

| ID    | Rule                                                        |
| ----- | ----------------------------------------------------------- |
| SD-01 | Sections come only from the WebKit page sections            |
| SD-02 | A page starts from the section's own site JSON              |
| SD-03 | Section copy is frozen until someone asks                   |
| SD-04 | Action labels come from the WebKit list                     |
| SD-05 | A band hero is followed by no gap                           |
| SD-06 | The client marquee belongs to the screen hero               |
| SD-07 | A short headline breaks in two lines, a long one in three   |
| SD-08 | Retired; the ID is not reused                               |
| SD-09 | Every hero has an eyebrow with the `//` prefix              |
| SD-10 | Section eyebrows are optional and plain                     |
| SD-11 | A band no section covers becomes a section first            |
| SD-12 | Creative pages keep the content base                        |
| SD-13 | Assets come from the WebKit asset bank                      |
| SD-14 | Brand marks in colour first                                 |
| SD-15 | The page speaks the project language                        |
| SD-16 | Marketing facts come from the knowledge base                |
| SD-17 | Product names and terms follow the knowledge base           |
| SD-18 | Pick an illustration by what it draws, not by its name      |
| SD-19 | A missing illustration is reported, not approximated        |
| SD-20 | Illustrations side by side carry the same visual weight     |
| SD-21 | A framed box checks its containers before drawing its edges |
| SD-22 | A product page follows the product pattern                  |
| SD-23 | A Solution page follows the Solution pattern                |
| SD-24 | Copy fits its rendered line budget                          |
| SD-25 | A section prop holds plain text, never markdown             |

## Composition and frame

### SD-01 · Sections come only from the WebKit page sections

Every band on a page is a WebKit page section (`list_components` with category `sections`, or
`llms/components/*-section.md`), in a `variant` its spec documents.

- **Incorrect:** a pricing page draws a plan matrix from `Table` and `Card` in the page file; a
  hero uses a `variant` value its spec does not list.
- **Correct:** the matrix is `plan-comparison-section`; the hero's `variant` is one of the values
  in `hero-section`'s Props table.

**Why:** the sections are the reviewed catalog of the design. A band outside it has no reviewed
layout, content shape or accessibility, and nobody else can find it.

**Exceptions:** none. Hand-built pages are covered by SD-11.

### SD-02 · A page starts from the section's own site JSON

A new page or band is seeded verbatim from the section's site JSON example
(`examples/<name>/site-*.json`, printed in the component's docs page and its `llms` page), so it
opens on reviewed Azion copy and bank assets, never on placeholder copy.

- **Incorrect:** a new band opens with "Your headline here" and a stock photo, to fill in later.
- **Correct:** the band opens with the title, description, actions and assets of the site JSON
  example of the layout picked; copy changes afterwards only on request (SD-03).

**Why:** the example is already reviewed for voice, facts and assets. Placeholder copy reaches
production more often than anyone plans.

**Exceptions:** none.

### SD-11 · A band no section covers becomes a section first

A page is `SitePage` (or the sections in the site column) and nothing else. A band no section
covers is added to WebKit as a section first (`/webkit-adoption`, "file the gap upstream"), then
placed like any other.

- **Incorrect:** a page renders `SitePage` and hand-builds one more band in its own markup below.
- **Correct:** the band is specified and built as a WebKit section, released, and listed in the
  page JSON.

**Why:** a hand-built band skips the review, drifts from the system and cannot be reused on the
next page.

**Exceptions:** pages that are tools rather than landing pages stay hand-built on purpose: the
careers page, the success-case library and the hero gallery.

### SD-12 · Creative pages keep the content base

A campaign or other creative page may arrange sections in its own order, but keeps the sources:
facts from the knowledge base (SD-16), labels from SD-04, assets from the bank (SD-13).

- **Incorrect:** a campaign page uses stock photography, a claim with no source and a label
  invented for the campaign.
- **Correct:** the campaign arranges sections in its own order with bank assets, sourced claims and
  listed labels; art the bank lacks is reported (SD-19), not drawn.

**Why:** a creative page is still an Azion page. Its freedom is in the composition, not in the
sources.

**Exceptions:** none.

### SD-15 · The page speaks the project language

Colours, type, spacing and motion come from `@aziontech/theme` tokens (rule `webkit-tokens`). Each
edge of the frame has one owner, the page has one `h1` (the hero's), the hero and the first band
sit on one vertical, and no rule sits on the window edge.

- **Incorrect:** a band draws its own top rule under the bottom rule of the band above it; a
  section adds a second `h1`; a colour is typed as a hex value.
- **Correct:** each edge is drawn once by the band that owns it, the hero carries the only `h1`,
  every value is a token.

**Why:** the framed column is what makes the site read as one system. A doubled rule or a raw
colour shows on every screen it reaches.

**Exceptions:** none.

### SD-21 · A framed box checks its containers before drawing its edges

`RegistrationFrame` draws, by default, a rule on each edge (`borders="all"`) and a registration
mark in each corner (`marks="all"`). Before placing one, check the section, the grid cell, the card
and any frame it sits in or against, and hand every edge one of them already draws to that owner
(`flush`, or `borders` without that side). Only the rules are deduplicated; the four corner marks
stay.

- **Incorrect:** a frame inside a section that already draws its frame, every edge left on, so the
  left, right and bottom rules show twice; two frames side by side each drawing the shared edge.
- **Correct:** the inner frame takes `flush` for the sides its section draws; frames in a row hand
  the shared edge to one neighbour (`flush="left"`); every frame keeps its corner marks.

**Why:** the frame cannot see its containers. Left at its default inside another frame it doubles
the hairline, which reads as a rendering bug at every width.

**Exceptions:** none. Turning a corner mark off is a design decision for the section, not a fix
for a doubled rule.

## Heroes

A hero is one of two families. A **band hero** is a ruled strip at the top of the column:
`hero-section` `variant` `title-band`, `center-band` and `compact-band`. A **screen hero** fills
the first screen: `center`, `copy-beside-art`, `copy-on-top-art` and `pixel-floor`. Which variant
each page type opens with is the matrix in `hero-section`'s When to use. Every hero carries one
primary action followed by one outlined action (`primaryAction`, `secondaryAction`), labelled from
SD-04.

### SD-05 · A band hero is followed by no gap

After a band hero, the first column section opens on the hero's bottom rule: its `SitePage` entry
takes `gap: 'none'`.

- **Incorrect:** a `title-band` hero, a hatched `Spacer`, then the first section.
- **Correct:** `{ _id: 'capability-grid-section', gap: 'none', props }` as the first entry of
  `sections` under a `title-band` hero.

**Why:** a band hero is already a ruled strip of the column; a gap under it cuts the opening off
from the content it introduces.

**Exceptions:** the Blog: its `title-band` hero (`size: 'medium'`) is followed by a small gap
(`gap: 'small'`). A screen hero may be followed by a gap.

### SD-06 · The client marquee belongs to the screen hero

The client marquee (`marqueeMarks`) appears only on the `center` screen hero, and only on Home and
the product index page. No band hero carries one.

- **Incorrect:** a Support page opens with a `center-band` hero carrying a strip of client logos;
  a product page opens on `center` with the marquee.
- **Correct:** the Support page keeps `center-band` and drops the strip; the product page opens on
  `title-band` with `marqueeMarks` left empty.

**Why:** a band hero is a compact strip; the marquee needs the first screen to read as proof, not
decoration.

**Exceptions:** none.

### SD-07 · A short headline breaks in two lines, a long one in three

`titleLength` matches the copy: `short` for a headline of up to about 50 characters, set on the
narrow headline measure so it breaks over two lines; `long` for about 51 to 90 characters, set on
the full column so it breaks over three at most. A headline over about 90 characters is
rewritten. Count the string as it renders, in each locale.

- **Incorrect:** a 30-character headline set `long`, so it runs on one line; an 80-character
  headline left `short`, so it runs to four lines.
- **Correct:** the length setting matches the copy, and the rendered headline holds two lines when
  short and three when long.

**Why:** a fixed line count gives every opening the same rhythm, whatever the page.

**Exceptions:** the count is measured at desktop widths (1280 and 1440 px). At phone widths most
headlines wrap further; the count is reported there, never failed.

### SD-09 · Every hero has an eyebrow with the `//` prefix

Every hero carries an `eyebrow`, and the hero draws it with its `//` prefix. On a product page the
eyebrow is the product's name as the site menu writes it.

- **Incorrect:** a hero with no eyebrow, or an eyebrow that types its own `//` into the string.
- **Correct:** `eyebrow: 'Cache'`, which the hero renders as `// Cache`.

**Why:** the eyebrow places the page in the site before the headline is read, and the prefix is
part of the site's typographic signature.

**Exceptions:** none. Section eyebrows are SD-10.

## Sections

### SD-10 · Section eyebrows are optional and plain

A section below the hero may carry an `eyebrow` or not. When it does, the eyebrow is plain text:
the `//` prefix belongs to the hero and the pricing sections (`plan-comparison-section`) only.

- **Incorrect:** a review asks for an eyebrow on every band; a band types `// ` into its eyebrow.
- **Correct:** a band carries an eyebrow when it helps the reader place it, as plain text, and goes
  without one otherwise.

**Why:** an eyebrow on every band stops reading as a signal; the hero's (SD-09) is the one that is
required.

**Exceptions:** none.

### SD-22 · A product page follows the product pattern

A product page runs these bands in this order, and a band without the content its count asks for
is left out (no empty band, no gap for it):

| #   | Band            | Section                                      | Content                                                                                      |
| --- | --------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | Hero            | `hero-section` `title-band`, `size: 'large'` | eyebrow = the product's menu name, `titleLength: 'short'`, Start for free + Docs, no marquee |
| 2   | Highlights      | `capability-grid-section`                    | 3 or 6 items, each with an icon; opens on the hero's rule (SD-05)                            |
| 3   | Features        | `feature-widgets-section`                    | exactly 3, each with its own bank illustration, none repeated                                |
| 4   | Use cases       | `customer-use-cases-section`                 | exactly 4 Use Cases of the catalog; left out with fewer                                      |
| 5   | Integrations    | `feature-scroll-section`                     | 4 to 7 integrations with a docs code sample; left out with fewer than 4; the only code slot  |
| 6   | Customer quotes | `client-quotes-section`                      | the product category's shared quotes                                                         |
| 7   | FAQ             | `faq-section`                                | 6 to 12 questions, the first "What is <product>?"                                            |
| 8   | Closing         | `closing-call-to-action-section`             | the category's shared closing band, `variant: 'primary'`                                     |

- **Incorrect:** a product page with a `platform-directory-section`, a `recognition-marquee-section`,
  a `compliance-logos-section`, a `network-section`, a `stats-section`, a mid-page
  `template-gallery-section`, a second closing band, a `media-split-section` with `codeTabs`, the
  linked use-case grid of `capability-grid-section`, or a client marquee in the hero.
- **Correct:** the eight bands above, the ones without content left out, the same bands and counts
  in every language.

**Why:** the pattern was decided once for every product (2026-10-20); a page that drifts from it
reads as a different site and breaks the comparison between products.

**Exceptions:** Our Network is a platform resource, not a product, and keeps its own layout. A
product that is not generally available, or has no published docs, swaps the hero actions for
Talk to sales and no docs link (SD-04).

### SD-23 · A Solution page follows the Solution pattern

| #   | By Need                                   | By Industry                             |
| --- | ----------------------------------------- | --------------------------------------- |
| 1   | `hero-section` `title-band`               | `hero-section` `title-band`             |
| 2   | `capability-grid-section`, 6 items        | `capability-grid-section`, 3 or 6 items |
| 3   | `media-split-stack-section`, 2 to 4 bands | `media-split-stack-section`, 4 bands    |
| 4   | `template-gallery-section`, optional      | `template-gallery-section`, optional    |
| 5   | `client-quotes-section`                   | `client-quotes-section`                 |
| 6   | `platform-directory-section`              | `compliance-logos-section`              |
| 7   | `network-section`                         | `platform-directory-section`            |
| 8   | `recognition-marquee-section`             | `recognition-marquee-section`           |
| 9   | `faq-section`, 6 to 11 questions          | `faq-section`, 6 to 11 questions        |
| 10  | `closing-call-to-action-section`          | `closing-call-to-action-section`        |

One `media-split-stack-section` band per catalog Use Case, each with one bank asset and a Docs
action, never two bands on the same docs page; the template gallery, when present, holds an even
number of at least 6 templates.

- **Incorrect:** a Solution page with a reference-architecture band, a resource grid, or a client
  marquee in the hero.
- **Correct:** the bands above in order, the shared bands (quotes, directory, network, compliance,
  recognition, closing) identical to the ones every other page shows.

**Why:** the Solution pages are read side by side; one pattern makes them comparable and lets the
shared bands stay one source.

**Exceptions:** none.

## Copy and labels

### SD-03 · Section copy is frozen until someone asks

No title, description, eyebrow, label or quote changes unless the person asked for that change,
to that section, in this session.

- **Incorrect:** asked to switch the Cache hero to another layout, the agent also rewrites its
  description to fit.
- **Correct:** the layout changes and the description stays; if the copy no longer fits, the agent
  says so and waits.

**Why:** copy carries reviewed facts, voice and translations in three languages. A silent edit
breaks all three without anyone deciding it.

**Exceptions:** none.

### SD-04 · Action labels come from the WebKit list

The page actions use these labels, exactly as written (WebKit owns this list; the sections ship
no label of their own):

| Action                                                             | Label            | Goes to                                    |
| ------------------------------------------------------------------ | ---------------- | ------------------------------------------ |
| Hero primary                                                       | `Start for free` | the console sign-up                        |
| Hero secondary, and any band's single link to the docs             | `Docs`           | the docs page of that product or Use Case  |
| Hero secondary on a Solution page; the closing band's contact      | `Talk to sales`  | the contact page of that language          |
| Hero primary of a product not generally available, or without docs | `Talk to sales`  | the contact page; no docs link on the page |

`Docs` stays `Docs` in every language; the other labels are translated with `translate-content`.
Any other label (a card's link, a band's secondary action) comes from `azion-brand-voice`. One
primary and one outlined action per hero; no phone numbers.

- **Incorrect:** `Start free`, `Start for Free`, `Talk to a specialist`, or two primary actions in
  one hero.
- **Correct:** `primaryAction: { label: 'Start for free', href }`, `secondaryAction: { label: 'Docs', href }`.

**Why:** one lexicon tells the visitor the same action has the same name everywhere and keeps
conversion data comparable.

**Exceptions:** navigation labels in the site header and footer.

### SD-16 · Marketing facts come from the knowledge base

Positioning, claims, metrics, use cases, personas and proof are read from `azion-kb` before any
copy is drafted. A slot with no source stays out of the page and goes into the report.

- **Incorrect:** a hero states a performance figure no knowledge-base file holds; a quote band names
  a customer with no case study behind it.
- **Correct:** every claim in the brief carries its knowledge-base path; a slot with no source is
  left out and listed.

**Why:** a page is a public claim. The knowledge base is where marketing keeps the claims it
stands behind.

**Exceptions:** none. A product with no messaging in the knowledge base gets it written by
marketing before the page is built.

### SD-17 · Product names and terms follow the knowledge base

Product names follow `company-definitions/product-naming.md` and terms follow
`brand-guidelines/terminology.md`, both in `azion-kb`. No deprecated name, no forbidden term.

- **Incorrect:** "edge application", "edge firewall", "edge location".
- **Correct:** "Applications", "Firewall", "data center".

**Why:** a product name is part of the product; a deprecated one on the site contradicts the
console and the docs.

**Exceptions:** none.

### SD-24 · Copy fits its rendered line budget

Copy is measured in rendered lines at 1280 × 800 on the English page, next to SD-07:

| Page     | Field                               | Lines     |
| -------- | ----------------------------------- | --------- |
| Product  | headline / subheadline              | 1–2 / 1–3 |
| Product  | highlight title / description       | 1–2 / 2–4 |
| Product  | feature and integration description | 1–4       |
| Solution | headline / subheadline              | ≤ 2 / ≤ 3 |
| Solution | capability title / description      | ≤ 2 / 2–5 |
| Solution | band title / description            | ≤ 2 / 2–3 |
| Solution | template description (at 1024)      | ≤ 2       |

- **Incorrect:** a highlight description that runs to six lines, or one line that leaves the card
  half empty.
- **Correct:** the copy is cut or extended within the budget, and the report lists any field the
  person keeps outside it.

**Why:** equal line counts keep cards in a row the same height and the page's rhythm even.

**Exceptions:** pt-BR and es may run one line longer; phone widths are reported, never failed.

### SD-25 · A section prop holds plain text, never markdown

A section renders its props as text. Emphasis is the hero's `highlight`; a link is an action.

- **Incorrect:** `description: 'Run **anywhere** with [Functions](https://example.com)'`.
- **Correct:** `description: 'Run anywhere with Functions'`, and the link as the band's
  `primaryAction`.

**Why:** the asterisks and brackets render literally on the page and in its translations.

**Exceptions:** none.

## Assets

The bank is what WebKit ships: the client and partner marks, badges and illustrations under
`@aziontech/webkit/assets/<file>`, the illustration and scene names the sections take
(`llms/foundations/illustrations.md`, MCP `list_assets`), and the icon classes of
`@aziontech/icons`.

### SD-13 · Assets come from the WebKit asset bank

Logos, icons, illustrations and diagrams come from the bank in their approved variants. No remote
image URL and no local copy.

- **Incorrect:** a logo loaded from an azion.com URL, or an SVG pasted into the page's folder.
- **Correct:** `import zoop from '@aziontech/webkit/assets/zoop-extended-color.svg'` passed as the
  item's `logo`; an illustration named from the registry.

**Why:** the bank holds the approved version of each asset with its light and dark variants. A
copied or remote file goes stale and breaks the dark theme.

**Exceptions:** blog and case-study covers are CMS content, not design assets: the site serves
them (rule `webkit-sections`).

### SD-14 · Brand marks in colour first

A brand mark uses its colour version (`CompanyLogo` `variant="color"`). Without one: in a marquee or logo
wall, the muted text tone (`variant="current"` under muted text); elsewhere the default text tone
(`current`), then `monochrome`.

- **Incorrect:** a black mark where a colour version exists; a muted mark outside a marquee.
- **Correct:** the colour version wherever it exists; the muted tone only in a strip of many marks.

**Why:** a mark in its own colour is how a brand is recognised; a strip mutes its marks so many
logos read as one line of proof.

**Exceptions:** none. Every fallback is checked for contrast in both themes.

### SD-18 · Pick an illustration by what it draws, not by its name

Render the candidates (the docs site's illustration foundation, or the section's example) and
look before assigning one. A name is not evidence of what an asset draws.

- **Incorrect:** an e-commerce band gets the scene whose name mentions retail, unrendered; it draws
  customer stacks.
- **Correct:** the band gets the scene whose drawing shows a store, a cart and a product grid, and
  the report says it was checked by render.

**Why:** some names describe the use an asset was first made for, not what it shows; no lint or
type check catches the wrong art.

**Exceptions:** none.

### SD-19 · A missing illustration is reported, not approximated

When no bank illustration shows the band's subject, the work stops and the gap is reported with
the closest candidates. A stand-in goes on the page only when the person picks it, and stays
listed as a stand-in until the bank has the right art. New art is added to the bank first, then
used.

- **Incorrect:** the closest scene placed without a word, or a local file another page carries.
- **Correct:** "the bank has no multi-tenant SaaS scene; closest: …", the person picks one, the
  report lists it as a stand-in.

**Why:** a silent stand-in hides a gap nobody files; a local copy breaks SD-13 and goes stale.

**Exceptions:** none.

### SD-20 · Illustrations side by side carry the same visual weight

Illustrations in one row or stack fill a similar share of their canvas, measured on the drawn
content in the rendered page, not on the canvas size.

- **Incorrect:** three stacked bands, one drawing filling half its canvas, another most of it.
- **Correct:** scenes whose drawings fill a similar share; when no fitting set matches, the report
  lists each share and the person decides.

**Why:** the eye compares neighbours; uneven fill reads as uneven importance or a layout bug.

**Exceptions:** none.

### Photography and generated art

A photo the site serves is warm, high-contrast and accented with the brand primary; blue, cyan,
green and magenta are reduced or removed, or the photo is black and white. Art generated for the
bank follows the same bias: the brand primary and accent scales and the neutrals, on the neutral
background and surface tokens, never a background that lowers the logo's contrast. Generated art
enters the bank (SD-19) before any page uses it.

### Defects in the bank go to WebKit

A misleading asset name, a typo inside an artwork or a missing scene is a WebKit defect: report it
on the WebKit repo, never work around it with a local copy or an edited file. Until the fix ships,
SD-18 and SD-19 cover the page.

## Verify

Render the page at 390, 768, 1280 and 1440 px in the light and the dark theme (`/webkit-ui-verify`)
and read the DOM, not a screenshot by eye:

- Hero: SD-04, SD-05, SD-06, SD-07, SD-09.
- Frame: SD-01, SD-11, SD-15, SD-21.
- Page pattern and copy: SD-03, SD-16, SD-17, SD-22, SD-23, SD-24, SD-25.
- Assets: SD-13, SD-14, SD-18, SD-19, SD-20.

Report findings by rule ID, each with the width and theme where it shows. Copy and label findings
go to the person to decide.
