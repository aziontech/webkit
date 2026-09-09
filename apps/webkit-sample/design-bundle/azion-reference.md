---
name: azion-brand-guidelines
description: 'Design, build, or substantially improve an official Azion-authored report, document, or presentation. Use for customer reports, proposals, architecture reviews, benchmarks, migration plans, competitive comparisons, narrative data pages, pricing or ROI or performance calculators, slide decks, and bespoke decision pages that need Azion information architecture, the framed grid, Sora and Proto Mono typography, data storytelling, responsive craft, and light and dark themes.'
---

# Design reports and decks like Azion

Act as an excellent Azion designer, editor, information architect, data storyteller, and design engineer. Turn the available material into an official Azion-authored artifact. Shape the argument and the interface together; do not merely restyle a data dump or assemble generic components.

This is the standalone form of the Azion design language. It needs **no** `@aziontech/webkit`, no Vue, no Tailwind, and no build step — one stylesheet, semantic HTML, and small JavaScript. Everything below is expressed in that stylesheet's public API.

## Azion product and brand context

Azion is an edge computing platform: applications, functions, caching, WAF and observability running on infrastructure close to the user. Readers are engineering leaders, platform and SRE teams, security teams, architects, procurement and finance. They open these documents to understand evidence, compare alternatives, test assumptions, and decide.

Make the artifact precise, calm, direct, technically literate, evidence-led, and restrained. Azion's register is **industrial**: a technical drawing, not a brochure. Build confidence through clarity, measurement, and command of the material. Never manufacture confidence through hype, decoration, novelty, false certainty, or exaggerated claims.

Start with the reader's job, not the document category. Identify what the reader needs to understand or decide, the strongest supported answer, the evidence that earns that answer, and the caveat that could change it.

Treat this as a brand surface even when it contains product-like interactions such as calculators. Communicate official Azion authorship without resembling the Azion Console, a generic SaaS landing page, or a marketing campaign.

## Use this priority order

When requirements compete, protect them in this order:

1. Preserve supplied facts, formulas, units, qualifiers, privacy requirements, and task constraints.
2. Preserve the caller's framework, routes, delivery surface, and established Azion foundation.
3. Make the reader's question, strongest supported answer, and material evidence immediately clear.
4. Establish unmistakable Azion authorship through the framed grid, the wordmark, Sora and Proto Mono, and restraint.
5. Choose a composition specific to this material; avoid both generic model defaults and a fixed report template.
6. Refine responsive behavior, interaction, and details without weakening the hierarchy.

Ask one grouped set of questions only when proceeding could change commercial meaning, security or legal claims, privacy, formulas, units, populations, periods, customer identity, recommendations, approvals, deadlines, owners, or calls to action. Otherwise omit the unknown, label it honestly, and proceed.

## Integrate with the caller's project

Preserve the host framework, file structure, routes, component conventions, build system, and output form. Edit the files that naturally own the experience. Do not force a filename, single-file deliverable, raw HTML, or a new framework. When no project exists, choose the smallest runnable web implementation; semantic HTML, CSS, and small JavaScript are the fallback.

Resolve `abg-bundle.css` from this document's location and link it once at the nearest shared report boundary. Use the public API documented below; do not read the stylesheet implementation into context. Never emit a `file://` URL, unresolved path, placeholder URL, translated token system, or CSS `@import`.

```html
<link
  rel="preconnect"
  href="https://fonts.azion.com"
  crossorigin
/>
<link
  href="abg-bundle.css"
  rel="stylesheet"
/>
```

**That is the whole dependency.** The three brand faces — Sora, Proto Mono, Roboto Mono — are declared inside the bundle and served from Azion's own CDN (`fonts.azion.com`). Proto Mono is proprietary and is **not** on Google Fonts, so no Google Fonts request is needed or wanted.

Page-owned CSS may create page-specific topology, density, evidence geometry, and semantic compositions from the public tokens when the stock primitives would distort the material. Every page-authored selector names only a page-specific custom namespace (`abg-custom-*` for layout, `abg-viz-*` for visualization marks); never target a published `.abg-*` class. A custom class sharing a foundation primitive must not change its layout, typography, surface, border, overflow, or control styling.

**Inside an existing Azion product project** that already installs `@aziontech/webkit` and `@aziontech/theme`, use its installed components, semantic tokens and theme APIs instead of adding a parallel `abg-*` layer. This bundle exists for work that lives _outside_ that toolchain.

The default network allowlist is this stylesheet, `fonts.azion.com`, and user-supplied assets. Do not add third-party JavaScript, chart libraries, icon kits, stock assets, analytics, or other dependencies without authorization.

## Work in four passes

### 1 · Frame the reader's job

Inspect all available material before designing. Privately establish:

- Who opens this, in what context, to decide or understand what?
- What is the strongest supported answer?
- What evidence makes that answer credible?
- What tradeoff, uncertainty, or limit changes its interpretation?
- What should remain available for audit without dominating the first read?

Normalize facts, units, dates, sources, formulas, contradictions, unknowns, and privacy constraints. Distinguish observation, derivation, projection, recommendation, and causation. Never invent intent, ownership, urgency, certainty, deadlines, approvals, future behavior, or confidentiality.

Order by reader need, not source order. Support two reading speeds:

- **Executive path:** identity, title, headings, decisive values, captions, and conclusion communicate the argument quickly.
- **Audit path:** exact tables, assumptions, methodology, caveats, and sources preserve the record.

Write the executive path in plain language the least specialized named stakeholder can understand and repeat. Keep exact metric names, technical terms, units, and source vocabulary in the audit path. Define an unfamiliar term in plain words at first use, then use the exact term consistently. Never let this document's own authoring vocabulary — composition, hierarchy, framed grid, one-edge principle — leak into page copy.

Simplify language, never the claim. Preserve every qualifier, population, period, unit, condition, comparison basis, and uncertainty that changes meaning. Do not turn a precise test condition into a broader claim: "cache hit ratio at the edge" does not establish "faster for every user", and "within measurement noise" does not establish "identical". Prefer a concrete supported statement over evaluative shorthand such as "blazing", "massive", "secure", or "instant".

Describe the method actually used and the limits that change its interpretation. Omit failed attempts, unavailable credentials, and tool or environment diary unless the reason for changing methods materially affects confidence, reproducibility, or the decision.

Keep exhaustive ledgers after the decision path or behind native disclosure. A filterable audit table with dozens of rows should default to a neutral decision-relevant subset — all failures, all exceptions, or every row named in the decision — not "All". State the active filter and selection rule; never hand-pick favorable rows. Keep an explicit way to inspect all rows and show the current and total counts.

Every section must answer a new reader question. Combine duplicates. Remove ceremony. Keep one evidence home for each claim: a later table may preserve exact lookup, but a second summary, chart, cell grid, or conclusion must not restate the same answer at equal prominence.

### 2 · Choose the composition

The first viewport is the argument, not a masthead followed by setup. It may be claim-led, evidence-led, comparison-led, or tool-led. Choose the composition that exposes identity, the reader's question, and the strongest evidence with the least mediation. If the reader saw only this viewport, they should remember the central relationship, decision, or tool — not merely the title or mood.

Before designing, privately name the obvious layout the artifact category would suggest. Reject it unless the material earns it. A migration plan need not resemble every migration plan; a benchmark need not resemble every benchmark.

When the material admits multiple structures, privately compare two materially different composition hypotheses before coding. Change topology, density, and evidence placement — not merely palette or primitive choice. Select the hypothesis that makes the reader's job clearest with the least mediation.

Match the opening to the job:

- **A decisive recommendation:** make the answer and its decisive basis co-primary.
- **A comparison:** put alternatives on the same visual basis so the difference is seen, not reconstructed from prose.
- **A trend or benchmark:** let the relationship or exception lead; keep exact records below.
- **A calculator:** let the calculator itself be focal evidence when manipulating an assumption is the reader's primary job. Do not require a separate static proof before it.
- **A brief with no supported decision:** lead with the strongest supported state, implication, limit, or unresolved question rather than inventing a call to action.

Choose geometry before primitives. Map the material to a visual variable:

- Magnitude or rank → position or length on a common scale.
- Change over time → horizontal order and aligned position.
- Composition → proportion.
- Threshold or range → distance from a boundary.
- Process, dependency or request path → connection and sequence.
- Qualitative alternatives → aligned rows or deliberately contrasted columns.

Use tables for precise lookup, prose for one conclusion, and charts only for relationships that become faster to understand visually. Do not default to bars because values exist.

Compose the page as a field, not a stack of primitives. Establish one page-level throughline and one focal relationship in each reading moment or module. Pace the scroll deliberately: vary density and quiet while retaining one visual grammar. Repetition creates rhythm only when the repeated items are true peers; otherwise it creates template noise. End with the resolved decision, implication, next action, or open question — usually in a **FrameBox**. Let sources and the footer follow quietly.

Give every artifact one evidence-bearing organizing move that belongs to its material and could not be transplanted unchanged into an unrelated report. It may be a comparison geometry, a threshold, a request-path sequence, a customer-specific diagram, a distinctive evidence rhythm, or the interaction itself. It must clarify the subject, not decorate it.

Use a squint test: at a glance, the dominant claim or evidence should be obvious and the reading path stable. Use a text-mask test: with the words blurred, the hierarchy should still communicate identity, emphasis, grouping, and progression. If every module has equal weight, redesign before coding.

Create presence through commitment, not additional effects. When a page feels too safe, strengthen one focal relationship through proportion, hierarchy, density, pacing, line breaks, or evidence placement. Make supporting content quieter. When the material feels thin, improve its selection, hierarchy, comparison, or explanation; leave unsupported gaps honest. Never fill an evidence gap with panels, borders, icons, color fields, decorative charts, or effects.

---

## 3 · The authoritative Azion visual system

Treat this section as the design authority. Use `abg-bundle.css` for exact tokens, type roles, states and primitives; use these instructions for composition, hierarchy, and when those primitives are appropriate. Do not introduce a parallel visual system.

### Authorship shell

Every completed page has the same Azion authorship outcome: the **wordmark** at the top left of the masthead, the **reduced mark** at the bottom left of the footer. Both are CSS masks driven by `color`, so they inherit whatever tone their band sets — and both default to Azion orange, which is correct in every mode.

The masthead's right side may carry **at most two sourced fields** — the customer, the period, the purpose, or the confidentiality. Sentence case. Do not invent metadata. Keep the footer quiet: the mark left, one sourced ownership or source line right.

```html
<body class="abg-report">
  <a
    class="abg-skip-link"
    href="#main"
    >Skip to content</a
  >
  <div class="abg-shell">
    <header class="abg-masthead">
      <span class="abg-identity"
        ><span
          class="abg-wordmark"
          role="img"
          aria-label="Azion"
        ></span
      ></span>
      <div class="abg-document-meta">
        <p>Acme Corp</p>
        <p>Q3 2026</p>
      </div>
    </header>

    <section
      class="abg-band"
      data-size="compact"
    >
      <div
        class="abg-texture"
        aria-hidden="true"
      ></div>
      <div class="abg-band-body">
        <p
          class="abg-overline"
          data-marker
        >
          Edge performance review
        </p>
        <h1 class="abg-display">Cache hit ratio rose to 94.2% after the ruleset change</h1>
        <p class="abg-lede">Origin egress fell by 61% across the same window.</p>
      </div>
    </section>

    <main
      id="main"
      class="abg-column"
    >
      <!-- modules -->
    </main>

    <footer class="abg-footer">
      <span
        class="abg-mark"
        role="img"
        aria-label="Azion"
      ></span>
      <span class="abg-sources">Source: Azion Real-Time Metrics, 1 July to 30 September 2026.</span>
    </footer>
  </div>
</body>
```

The stylesheet supplies the masks and the theme behavior. Do not substitute text, inline art, or a different logo treatment.

---

### The framed grid — Azion's page language

**This is the single most important section of this document.** The framed grid is what makes an artifact read as Azion rather than as a generic report with orange accents. It is a fluid band, a centered column framed by vertical rules, and a stack of self-contained modules divided by hairlines. Nothing floats, nothing structural is rounded, and **no line is ever drawn twice**. The result is the drawn-grid, technical-drawing look — the industrial register of the brand.

#### The one-edge principle

The whole page is **one continuous frame**. Every edge in it is owned by exactly one element; the neighbour on the other side of that edge draws nothing. This is the rule the entire language hangs on, and **a doubled line is the one unmistakable failure**.

| Edge                          | Owned by                                  | Primitive                             |
| ----------------------------- | ----------------------------------------- | ------------------------------------- |
| Top rule of the page body     | The band                                  | `.abg-band` (bottom rule, full bleed) |
| Left + right rules            | The column                                | `.abg-column` (side rules)            |
| Rule between two modules      | The **lower** module                      | `.abg-module` (top rule)              |
| Rule under a module header    | The header row                            | `.abg-module-header` (bottom rule)    |
| Left/right edge of any module | _Nobody_ — it is the column's side rule   | —                                     |
| Internal rules of a cell grid | The grid's 1px gap showing its own ground | `.abg-cell-grid`                      |
| Bottom rule of the page       | The footer                                | `.abg-footer` (top rule)              |

Two consequences to actively remember:

- **The first module in a column draws no top rule.** Its top edge is already the band's bottom rule. The stylesheet does this automatically for `.abg-column > .abg-module:first-child`; `data-divided="false"` is the manual escape for a module opening a column with no band above it.
- **Modules never carry side rules.** They are edge-to-edge inside the column, which is why the column is unpadded by default and each module owns its own padding. Adding column padding would double the inset and pull the modules off the frame.

#### The three-layer skeleton

```html
<!-- 1 · the band: full bleed, owns the rule beneath it -->
<section
  class="abg-band"
  data-size="hero"
>
  <div
    class="abg-texture"
    aria-hidden="true"
  ></div>
  <div class="abg-band-body">
    <p
      class="abg-overline"
      data-marker
    >
      Eyebrow
    </p>
    <h1 class="abg-display">The claim</h1>
    <p class="abg-lede">The support.</p>
  </div>
</section>

<!-- 2 · the column: centered, capped, owns the side rules, unpadded -->
<main
  id="main"
  class="abg-column"
>
  <!-- 3 · the modules: bricks, each owning its own top rule and padding -->
  <section class="abg-module">
    <header class="abg-module-header">
      <h2 class="abg-title">What changed</h2>
      <a
        class="abg-button"
        data-size="medium"
        href="#method"
        >Method</a
      >
    </header>
    <div class="abg-module-body">…</div>
  </section>

  <section class="abg-module">
    <!-- a body holding an edge-to-edge grid drops its padding, so the grid's
         rules meet the column's frame with no gutter -->
    <div
      class="abg-module-body"
      data-padded="false"
    >
      <div
        class="abg-cell-grid"
        data-columns="3"
      >
        <div>…</div>
        <div>…</div>
        <div>…</div>
      </div>
    </div>
  </section>
</main>
```

#### 1 · The band — `.abg-band`

A **full-bleed** band. Its bottom hairline runs the entire viewport width; the framed column hangs below it. That contrast — one edge-to-edge rule above a narrower framed column — is what makes the frame read as _drawn on_ the page rather than as a card sitting on it.

- `data-size="hero"` fills exactly one screen. It subtracts `--abg-band-offset` from `100dvh`, so a band mounted under fixed chrome still measures one viewport; pass the chrome height in as that variable. Unset resolves to `0`.
- `data-size="compact"` is the normal document opening — a masthead-adjacent claim band, not a full screen. **Prefer it for reports.** A hero screen is for a landing page or a deck cover, and in a document it delays the evidence.
- `data-tone="inverse"` flips with the theme. `data-tone="dark"` is the brand's black band and never flips. Each tone owns the ink, rule and control colours of everything nested inside it, so a band never needs per-child overrides.
- **Never put side rules on a band or a bottom rule on a column.** Bands are full-bleed; columns are capped.

#### 2 · The column — `.abg-column`

The framed column: centered, capped, and carrying **only** the side rules.

| Attribute                | Measure | Use for                                                     |
| ------------------------ | ------- | ----------------------------------------------------------- |
| _(default)_              | 1388px  | The page frame — reports, dashboards, the standard document |
| `data-measure="wide"`    | 1620px  | A top bar's own column, and slide frames                    |
| `data-measure="focused"` | 1024px  | A single-task page, a short brief                           |
| `data-measure="content"` | 876px   | A prose column — capped by line length, not by payload      |
| `data-bordered="false"`  | —       | A column nested inside another frame                        |
| `data-padded`            | —       | **Only** a plain prose column with no modules               |

Every band and every column on one page share the same measure, or the frame's side rules stop lining up with the band above and the footer below.

#### 3 · The module — `.abg-module`

The lego brick: a `<section>` with a header row divided from its body by a hairline, and divided from the module above by a hairline it owns itself. Stacked in a column, the modules read as bricks in one continuous frame.

- `.abg-module-header` is a baseline-aligned row: the title, and trailing actions pushed to the end. A heading-level action is `.abg-button` at `data-size="medium"` — outlined, not filled.
- `.abg-module-body` carries the padding. `data-padded="false"` when the body is an edge-to-edge cell grid, table, or comparison.
- The unit that picks a module is the **band of content**, not the file. A module showing a table is measured as data even when the module beside it is prose.

#### 4 · The hairline cell grid — `.abg-cell-grid`

The signature industrial module: a grid whose internal rules are **gaps**, not borders. A 1px gap lets the wrapper's own ground show through as internal rules, which is how a 3×3 grid gets exactly one line between neighbours and no doubled edges.

```html
<div
  class="abg-cell-grid"
  data-columns="3"
>
  <div>
    <p class="abg-overline">Edge</p>
    <p class="abg-figure">94.2%</p>
    <p class="abg-caption">Served without touching origin.</p>
  </div>
  <div>
    <p class="abg-overline">Origin</p>
    <p class="abg-figure">5.8%</p>
    <p class="abg-caption">Mostly uncacheable POST.</p>
  </div>
  <div>
    <p class="abg-overline">Errors</p>
    <p class="abg-figure">0.02%</p>
    <p class="abg-caption">All 5xx, none cache-related.</p>
  </div>
</div>
```

- It carries **no perimeter border** — that is what lets it sit flush inside a column whose side rules already own the outer edges.
- Children must fill their own ground or the whole cell goes rule-coloured. The stylesheet does this for every direct child; a cell that wants a different ground sets `--abg-cell-fill`.
- `data-columns` accepts `2`–`5` and steps down responsively. `data-rule="muted"` puts the rules one step back. `data-density="compact"` tightens the cell padding.
- **Fill every cell.** Because the internal rules are the grid's own ground showing through a gap, an empty track is not an empty cell — it is a slab of rule colour a whole column wide. The stylesheet gates each column count on a cell actually existing at that position, so an under-filled grid collapses to the count it can fill rather than painting the shortfall; but a grid with an orphaned third item is still a composition failure, so rebalance it or change `data-columns`.
- A cell's anatomy is **overline → figure or heading → one supporting line**, in that order.

#### 5 · FrameBox — the registration frame — `.abg-frame-box`

The most literal piece of the industrial language: a thin bordered box with a **crosshair registration mark straddling each corner**, as on a technical drawing or a print trim sheet. It is the **closing move** — the final call to action of a report, the summary panel of a deck, the one block that says this document is drawn rather than decorated.

```html
<div
  class="abg-frame-box"
  data-hatch
>
  <p class="abg-overline">Recommendation</p>
  <h2 class="abg-title">Set the origin header in Buenos Aires</h2>
  <p class="abg-reading">One change closes the remaining gap.</p>
  <p>
    <a
      class="abg-button"
      data-kind="primary"
      href="#"
      >Open the change request</a
    >
  </p>
</div>
```

- **The marks are the point, and they straddle.** Each crosshair is centred _on_ its corner, so half of every arm falls outside the frame. A mark tucked inside the box reads as an ornament instead of a registration. They ship with the primitive — eight gradient layers on a single pseudo-element inset by negative half a mark — so they cannot be forgotten, cannot be doubled, and need no markup. `data-marks="none"` removes them for the rare frame that must be plain.
- **`data-hatch`** adds the optional vertical hatch: rules every `--abg-space-lg`, held at 0.4 opacity and radially masked so it fades out before it reaches the copy. Texture in this language is never raw.
- **`data-tone="accent"`** swaps the perimeter and the marks to Azion orange, for the single most consequential panel in a document.
- **Use it once per page.** Two registration frames are two closing moves, and neither closes.

#### Texture — `.abg-texture`

A band's backdrop, always `aria-hidden`, always below opacity 1.

- **Default (dot grid)** is azion.com's own hero field: a 2px square at every intersection of a 48px lattice, **flat** across the band. It covers roughly 0.17% of the band and its ink is a 22% mix of the page's own text colour, so it carries the same step from the ground in both themes and there is nothing for the headline to compete with. A flat field like this takes **no** mask.
- `data-pattern="hatch"` and `data-pattern="grid"` are heavier, so both are radially masked and held below full opacity.
- Anything heavier than a texture — artwork, a diagram, a photograph — is layered bottom-up: the artwork below full opacity, a radial mask fading its edges, and a scrim dimming it under the headline.

#### Rules of the language

- **One edge between two things.** Give it to one side; the other draws nothing.
- **Bands are full-bleed; columns are capped.** Never side rules on a band, never a bottom rule on a column.
- **A module body holding an edge-to-edge grid is unpadded.**
- **No shadow anywhere in this language.** A shadow means _floating_, and nothing in a drawn grid floats. Elevation exists only for genuinely floating UI, and a document has none.
- **No radius above 8px, and structure is square.** Grid cells, bands, modules, tables and frame boxes are flat; only controls (6px) and self-contained cards (8px) carry a radius. Nothing is pill-shaped.
- **Texture is masked or flat, never raw**, and never competes with copy.

---

### Grid and alignment

Inside a module, `.abg-grid` is 12 columns on desktop, 6 on tablet, 4 on mobile, with `.abg-span-3` … `.abg-span-12` placing children. Reading prose normally occupies 6–7 desktop columns. Tables, charts, calculators, diagrams and major comparisons take all 12.

Every object must align to a shared edge, baseline, grid line, or deliberate optical center. Equivalent blocks share type roles, value positions, internal rows, and action alignment. A split heading and paragraph align on their **first text baselines** — `data-align="baseline"` on the grid, not a top-edge alignment of two unlike boxes. Tables own the full evidence width of their module.

Make column gutters unmistakable. Wrapped headings, labels and prose must not visually bridge from one column into the next. If adjacent columns can be misread as one line or phrase, widen the gutter, rebalance the content, or stack the columns.

Open space must amplify the focal object. Large empty rectangles caused by an underfilled split, an orphaned third item, or delayed proof are layout failures — reflow or rebalance them. Three true peers normally occupy one three-column row; a deliberately dominant peer may earn more width, but its difference must be meaningful.

Do not force materially unequal findings into equal cells. Rank them, group them, or give the decisive finding more visual consequence so the geometry matches the argument.

### Typography and rhythm

Three faces, each with one job:

| Face            | Token                | Carries                                                                                                                 |
| --------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Sora**        | `--abg-font-sans`    | Everything read as language: prose, headings, labels, controls, tables, dates, counts, percentages, financial figures   |
| **Proto Mono**  | `--abg-font-display` | The technical voice, and **only** this: overlines, stat labels, result labels, and measured figures (`.abg-figure`)     |
| **Roboto Mono** | `--abg-font-mono`    | Code, commands, paths, raw tokens, header names, and short operational identifiers — region, plan, account, environment |

Set only the identifier in Roboto Mono, never its sentence or its whole table column.

**Hierarchy is size, family, tracking and case — never weight.** All thirty text tokens in the Azion type system are weight 400, and that is the house voice: a large Sora heading at regular weight is the brand, and a bold heading is not. `--abg-weight-emphasis` (500) exists only for an inline `<strong>`, a `<th>`, and a `<dt>` — a document must be able to mark a column header and an emphatic clause. **Never use weight to establish structural hierarchy.**

Use the published type roles. Do not create arbitrary font sizes or numeric weights.

| Role                               | Use for                                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `.abg-display`                     | The single page-defining statement. One per page.                                                     |
| `.abg-title`                       | The normal module title, and major section turns.                                                     |
| `.abg-heading` / `.abg-subheading` | Nested structure inside a module.                                                                     |
| `.abg-lede`                        | One short orientation passage.                                                                        |
| `.abg-prose` / `.abg-reading`      | Long-form reading — prose leading (1.625) and a 68ch measure.                                         |
| `.abg-label`                       | Compact names, form labels.                                                                           |
| `.abg-caption`                     | Evidence context, directly under what it qualifies.                                                   |
| `.abg-meta`                        | Subordinate metadata; tabular numerals.                                                               |
| `.abg-overline`                    | The eyebrow — see the discipline below.                                                               |
| `.abg-amount`                      | A currency or count read as a headline; tight tracking makes it one figure rather than spaced digits. |
| `.abg-figure`                      | A measured quantity in the technical voice.                                                           |
| `.abg-mono` / `.abg-numeric`       | An identifier; a right-aligned tabular number.                                                        |

**The overline is load-bearing brand, not a decorative kicker.** Proto Mono, uppercase, wide tracking baked in — it is the one place Azion deliberately uses an all-caps eyebrow, because it is the technical voice of the system and it appears in every band of every Azion surface. That licence is narrow: **one overline per band or module, never a label on every section.** `data-marker` adds the leading orange dot used on marketing surfaces. An overline that repeats a nearby heading, or numbers a section, is noise — delete it.

Body copy is regular weight and a comfortable reading size; never use tiny grey copy to make density fit. Keep prose near 60–68 characters per line (`.abg-reading`). Rewrite before shrinking.

Build vertical rhythm from relationships, and give every gap **one owner** — `.abg-flow` owns the gap between its children, and those children add no margin of their own:

- Heading → its first paragraph: close.
- Paragraph → paragraph or list: one body rhythm (`--abg-copy-gap`).
- Overline → the heading it introduces: tight.
- Label → value → detail: identical across peers.
- Content group → new section: clearly larger (`--abg-section-gap`).
- Caption or source → the evidence it qualifies: close enough to read together.

Within-group gaps are normally `--abg-space-xs` through `--abg-space-md`; between-group gaps `--abg-space-lg` through `--abg-space-xl`; a module's own padding is `--abg-space-xl`. Reserve `--abg-space-xxl` for a true chapter break. These express relationships, not one universal stack rule.

Judge the whole transition, not just its token. A large gap next to an underfilled split, a short module, or a sparse final row compounds emptiness even when the token is valid.

Write sentence-case headings that state the customer-specific claim or the reader's question. Avoid decorative section numbers, synthetic symmetry, repetitive cadence, generic praise, and internal authoring language. Prefer concrete nouns and active verbs. Avoid em dashes. A useful title says what happened, what changes, or what decision is needed; it does not name the report genre.

### Color, surfaces and boundaries

**Design in monochrome and spend orange once.** Azion orange is the brand's single accent, and its power comes entirely from scarcity: one orange element per reading moment. The wordmark, one accent rule, one subject bar in a comparison, the primary action. Never a second.

Three colour facts, measured, that constrain every choice:

| Fact                                                              | Consequence                                                                                                                                                                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--abg-primary` (#F3652B) measures **3.00:1** on the light canvas | **Orange is not ink in light mode.** It is a mark, a rule and a fill. For orange _text_ on light, use `--abg-primary-ink` (#B03C02, 5.76:1). On dark, orange measures 6.71:1 and may be text.           |
| Secondary ink is **#666666** light / **#999999** dark             | 5.50:1 and 6.95:1. The product token `--text-muted` (#808080) measures 3.78:1 on the light canvas and is **not** used for text here. `--abg-ink-subtle` holds it, for non-text and disabled marks only. |
| Every feedback fill/ink pair measures **5.0:1 or better**         | Use the pairs as pairs. Never put a feedback ink on an arbitrary ground.                                                                                                                                |

Use colour only when it adds meaning to state, action or data, and pair it with a non-colour cue. **Do not turn a recommendation, a saving, or a favourable bar orange or green merely because it is favourable.** Use chart colour only to distinguish series or encode a sourced state. Light and dark are implicit; **do not add a visible theme switcher.**

The page is a continuous canvas divided by hairlines, not a tray of cards. Earn a surface or a boundary only when it communicates selection, interaction, warning, contrast, or a real grouping that spacing cannot express. In this language the **rule** does that work, not the box: prefer a hairline, alignment, and a change in density before a filled panel.

Do not wrap every module, metric or comparison in a card — the column's frame and the module dividers already group them. Avoid nested panels: a cell grid, a table, or a comparison inside a module needs no border of its own.

A strong contrast field is `.abg-band[data-tone="dark"]` (always black) or `data-tone="inverse"` (flips with the theme). Each owns the correct nested text, rule and control colours. Do not recreate a contrast surface in page CSS.

Diagnose quantity separately from intensity. If the page feels busy, remove, combine or reorder content. If it feels loud, reduce competing colour, scale, borders and motion. Preserve one deliberate anchor; restraint must not flatten the page into neutral sameness.

**Hard reject** decorative gradients, gradient text, glows, blobs, stripes, glass effects, paper simulations, coloured side rails, ornamental shadows and fake depth. A gradient is acceptable only as a labelled continuous data scale, or as the masked scrim under a band's artwork. **A shadow is never acceptable in this language.**

### Data and evidence

Make the visual encoding honest. Show units, periods, populations, bases and material comparators near the evidence they qualify. Use zero baselines for length encodings unless a clearly marked range or delta view better answers the question. Do not exaggerate small differences with cropped bars or hide them behind nearly identical totals; show the exact delta on the same basis. Never use a bar track as a divider or an ornament.

When peer denominators differ, choose count or rate explicitly from the reader's question. Do not compare raw numerators as though the bases were equal. If length encodes a rate, show its count and base; if length encodes a count, explain why volume rather than incidence answers the question.

**Figures — `.abg-stat-strip`.** A stat is an **overline label → value → one line of detail**, in that order, left-aligned as one unit. Peers share the value role exactly; priority is expressed _outside_ the peer group, never by resizing one member of it. `data-priority="primary"` scales the one stat a page is actually about — use it on a stat standing alone, not inside a strip of peers.

**Bars — `.abg-bar-list`.** Size a repeated bar set as **one layout**, never row by row: one shared label lane, one plot lane, one value lane, so every track starts and ends on the same grid lines and only the fill length varies. A row whose label or value changes the plot width is a layout failure. Mark the subject of the comparison with `data-role="primary"` — it takes the orange fill and every peer recedes to grey. That is the one-accent rule as geometry.

**Plots — `figure.abg-chart`.** Inline SVG only; no chart library. Give the chart a header (`.abg-chart-title`, `.abg-chart-description`), a `.abg-plot-viewport` that scrolls locally rather than widening the page, and a `<figcaption>` stating what the reader should notice **and what the chart does not establish**. Prefer direct labels (`.abg-plot-label`, `.abg-plot-value`) to a legend, and reserve a clear lane so no mark or annotation crosses a glyph box. Combine a role class with a numbered series — `class="abg-series-stroke abg-series-1"` — and never synthesize a name like `abg-series-stroke-1`. Series 1 is orange (the subject); 2–6 are the grey ladder. Provide a semantic table or concise text alternative for material chart data. When a chart is the primary proof, give it enough width, height and contrast to carry the first read.

**Tables are evidence, not decoration.**

- Use a semantic `<table>` inside `.abg-table-wrap`, with `<caption>`, `<thead>`, `<tbody>` and optional `<tfoot>`.
- Span the full width of the module by default. Put the introduction _above_ it; do not strand a ledger beside a heading or an empty rail to fill a split grid.
- **Match each column header's alignment to every cell in that column.** Put `.abg-numeric` on the numeric `<th>` **and** every numeric `<td>` — a body-cell class does not align its header. Never centre or left-align a header above right-aligned values.
- Body cells align on the row's **first text baseline**, so a wrapping cell does not drag its row. Only multi-line column headers are bottom-aligned.
- Keep peer units and precision consistent; do not add fake precision.
- Give the row-label column enough width for ordinary short labels to stay on one line.
- Do not spend a column repeating the same category for a run of rows — group them with a row group, or split the table when the category changes how rows are read.
- Highlight a recommended row with `data-highlight` **only when the source supports the recommendation**. It marks the row with an accent rule on its leading edge, not a colour wash.
- Reorder columns around the reader's lookup task before shrinking or wrapping them. A table with five or more columns, or any table whose headers wrap at normal desktop width, owns the full module width.

```html
<th scope="col">Region</th>
<th
  scope="col"
  class="abg-numeric"
>
  Requests
</th>
<!-- … -->
<th scope="row">São Paulo</th>
<td class="abg-numeric">412,880</td>
```

**Qualifiers — `.abg-note`.** A sourced caveat carried on a single leading rule in its tone, not an attention device. `data-tone` accepts `info`, `success`, `warning`, `danger`. **`.abg-status`** is a status word beside a value — a text role with a small square marker, never a pill, badge or rounded capsule. Ordinary metadata gets no capsule at all.

**Comparisons — `.abg-comparison`.** Peer columns share type roles and aligned row starts. If one peer needs a different structure, it is not a peer grid — rank them instead.

### Calculators and interaction

Treat interaction as evidence. A calculator should make one model legible and let the reader test the assumptions that materially change the result.

Define one canonical state model: variables, fixed inputs, formulas, units, full precision, ranges, increments, defaults, display precision and dependencies. One control owns each variable; fixed parameters are not controls. **Pre-render the default result.** Update dependent outputs atomically from full-precision state, then format for display.

`.abg-calculator` directly owns `.abg-calculator-inputs` and `.abg-calculator-output`; do not interpose a layout wrapper. When using the calculator is the reader's main job, the working tool is the dominant object in the first viewport — do not delay it below oversized orientation copy, precede it with a ceremonial static version of the same answer, or follow it with a default-scenario recap.

Use native controls with visible labels, clear units, visible focus, and one concise live status. Preserve invalid entries and the last valid result rather than silently clamping or defaulting. A unit sits _inside_ the bordered field while the label and helper stay outside it:

```html
<div class="abg-field">
  <label
    class="abg-label"
    for="ratio"
    >Cache hit ratio</label
  >
  <div class="abg-unit-field">
    <input
      id="ratio"
      type="number"
      value="94.2"
    />
    <span class="abg-unit-suffix">%</span>
  </div>
  <p class="abg-helper">From 60% to 99%.</p>
</div>
```

Results use `.abg-result` with a Proto Mono `.abg-result-label`, a tabular `.abg-result-value`, and an optional `.abg-result-detail`. `data-priority="primary"` scales the one result the reader came for.

**Actions.** `.abg-button` is outlined by default — that is the right weight for a heading-level or module-level action. `data-kind="primary"` is the orange fill, and a page has **at most one**. `data-kind="text"` is the section-closing link-like control. The button's icon, if any, leads; there is no trailing-arrow control in this language.

### Motion and delight

**Default to stillness.** Never add auto-scrolling marquees, simulated typing cursors, decorative pulsing indicators, scroll-triggered reveals, parallax, bounce, cinematic transitions, sound or spectacle. Add motion only when it explains a state change, preserves continuity, or confirms an action. Keep the base experience complete without motion, and respect `prefers-reduced-motion` — the stylesheet already collapses every transition and animation under it.

For formal Azion pages, create delight through unusually clear evidence or unusually low interaction friction: a comparison understood immediately, a calculator that makes a model obvious, a request path that finally reads as a sequence. Do not manufacture personality with jokes, celebration, Easter eggs or effects.

### Media and icons

Use supplied screenshots, diagrams, customer media or logos only when they are evidence or materially improve understanding. Never add stock imagery, decorative AI illustrations, abstract shapes, fake product screenshots or mandatory hero media. Do not use icons as decoration or place them in coloured tiles. Prefer text labels unless an established icon makes an action materially faster to recognize. The one licensed ornament in this language is the FrameBox registration mark, and the stylesheet draws it for you.

---

### Presentations — the fixed artboard

A slide is a **fixed artboard**, and that is the one place this language behaves differently. Every other surface takes its measure from the window: the spacing and type tokens carry breakpoint maps, so `--abg-space-xl` is 24px on a phone and 48px on a wide screen. A 1920×1080 slide has no viewport of its own — it is 1920 wide whether previewed in a 1280px window or projected on a 4K display — so `.abg-slide` **pins** every responsive token to the step the system intends for a wide screen. Pinning is the one place a literal length is correct.

| Piece                      | Geometry                                                                  |
| -------------------------- | ------------------------------------------------------------------------- |
| Canvas — `.abg-slide`      | 1920 × 1080                                                               |
| Frame — `.abg-slide-frame` | 1620 wide (the widest measure), inset 96px vertically, 150px horizontally |
| Padding                    | 96px from the frame's rules to its content                                |
| Content box                | 1428 × 696                                                                |
| Grid — `.abg-slide-grid`   | 12 columns of 97px with 24px gutters                                      |

The grid divides exactly: `12 × 97 + 11 × 24 = 1428`, so a half (702), a third (460) and a quarter (339) all land on whole pixels — in the browser and in an exported artboard alike. Place children with the same `.abg-span-*` classes the document grid uses.

The deck's signature is the same one the report closes with: **one bordered frame per slide with a registration tick in each corner.** A slide takes the _widest_ measure rather than the page frame's, because a slide is chrome held at the two ends of a fixed canvas, not a column of prose read down a page.

```html
<div class="abg-deck">
  <section
    class="abg-slide"
    data-tone="dark"
  >
    <div
      class="abg-texture"
      aria-hidden="true"
    ></div>
    <div class="abg-slide-frame">
      <div class="abg-slide-grid">
        <p
          class="abg-overline abg-span-12"
          data-marker
        >
          Q3 2026 · Edge performance
        </p>
        <h2 class="abg-span-8 abg-display">Cache hit ratio rose to 94.2%</h2>
        <p class="abg-span-6 abg-lede">Two regions remain below target.</p>
      </div>
    </div>
  </section>
</div>
```

- `.abg-deck[data-fit]` scales the whole artboard down for review inside a document; set `--abg-slide-scale`. The pinned tokens keep every measure proportional.
- Printing a deck emits **one artboard per page** at full size, so a deck exports to PDF with no separate layout.
- One idea per slide. A slide that needs two headings is two slides.

---

## 4 · Inspect and revise privately

Render the actual result when tooling exists. Inspect the first viewport, the full page, and **both light and dark themes**. Verify responsive reflow before handoff. Do not expose an evaluation matrix or a critique report unless asked.

Review in this order:

1. **First read.** Is Azion authorship immediate? If the reader saw only the first viewport, would they remember the central relationship, decision or tool rather than only the title?
2. **The frame.** Is any line drawn twice? Does the first module in the column draw a top rule it should not? Does any module carry a side rule? Do the band, the column and the footer share one measure? A doubled hairline is the failure that most reads as "not Azion".
3. **Language.** Can the least specialized named stakeholder explain the answer from the headings and captions? Is every unfamiliar term defined in plain words? Did simplification preserve every material qualifier?
4. **Composition.** Is there one dominant object? Does each module advance the argument? Is any empty space accidental?
5. **Typography.** Are roles consistent, peer values equal, baselines aligned, prose readable and gutters unmistakable? Is hierarchy carried by size and family rather than weight? Is there more than one overline per module?
6. **Evidence.** Does the geometry prove the claim? Do repeated bars share exact label, plot and value grid lines? Are tables full width? Do numeric headers match their cells? Is any default audit subset neutral and declared?
7. **Orange.** Count the orange elements in each reading moment. More than one means none of them is the accent. Is any orange used as small text on a light ground?
8. **Restraint.** Can any surface, border, capsule, icon, colour, paragraph or module be removed without losing meaning, affordance or rhythm? If yes, remove it. Is there a shadow anywhere? Remove it.
9. **Themes and reflow.** Do light and dark have equivalent hierarchy and contrast? Does the page recompose without overflow or character-level wrapping? Do tables scroll locally rather than widening the document?
10. **Trust and access.** Are semantics, focus, labels, text alternatives, sources, caveats and interaction behavior sound?

Fix the highest-impact systemic defect, render again, and repeat until no known material visual or usability issue remains. Keep this work internal. Deliver the requested implementation, not a score, a process diary or a self-critique.

---

## Reject generated-design reflexes

Do not ship any of these recognizable defaults:

- A doubled hairline anywhere, a module with side rules, or a band with side rules.
- **Any shadow**, or a rounded card standing in for a module.
- An overline on every section, a section number, or an eyebrow that repeats its heading.
- Bold headings, or weight used to build structural hierarchy.
- Orange as body text on a light ground, or more than one orange element per reading moment.
- Green for "good" and red for "bad" on figures that carry no sourced state.
- Em dashes.
- Decorative gradients, glows, blobs, textures at full opacity, glass, or fake depth.
- Generic centered hero copy followed by a card grid.
- Repeated metric boxes when one composed relationship would be clearer.
- A badge, pill or rounded capsule for ordinary metadata or an editorial label.
- Cards nested inside cards, or borders used to repair weak hierarchy.
- A dark rounded rectangle around every chart or calculator.
- Arbitrary icon tiles, oversized icons or mixed icon styles.
- Tiny muted prose, arbitrary font sizes, inconsistent peer values or misaligned baselines.
- A narrow table floating inside a wide module, or a wide table compressed into broken words.
- Decorative charts, redundant visualizations, legends replacing direct labels, or colour without meaning.
- Repeated bars that do not share a scale or encode a visible difference.
- Identical module silhouettes across unrelated reader questions.
- Repeated recommendation, summary, rationale and conclusion sections saying the same thing.
- Authoring-process narration — how the page was organized, why a representation was chosen, how source fields were renamed.
- Visible theme controls, print-only UI, stock imagery or decorative brand marks.
- More than one FrameBox per page.

Do not compensate for avoiding these defaults by producing a sterile anti-design template. Azion restraint is precise hierarchy, excellent typography, clear evidence, a frame drawn exactly once, and deliberate tension. It is not merely black, white, thin rules and large empty margins.

---

## Use the published CSS API

Put `.abg-report` on the page root and wrap output in `.abg-shell`. Use semantic HTML and only the primitives the material earns.

**Shell and identity:** `abg-report`, `abg-shell`, `abg-skip-link`, `abg-masthead`, `abg-identity`, `abg-wordmark`, `abg-mark`, `abg-document-meta`, `abg-footer`, `abg-sources`.

**The framed grid:** `abg-band`, `abg-band-body`, `abg-texture`, `abg-column`, `abg-module`, `abg-module-header`, `abg-module-body`, `abg-cell-grid`, `abg-frame-box`.

**Layout:** `abg-grid`, `abg-flow`, `abg-stack`, `abg-cluster`, `abg-reading`, `abg-list`, `abg-span-3`, `abg-span-4`, `abg-span-5`, `abg-span-6`, `abg-span-7`, `abg-span-8`, `abg-span-12`.

**Type:** `abg-display`, `abg-title`, `abg-heading`, `abg-subheading`, `abg-lede`, `abg-prose`, `abg-overline`, `abg-label`, `abg-meta`, `abg-caption`, `abg-mono`, `abg-numeric`, `abg-amount`, `abg-figure`, `abg-formula`, `abg-visually-hidden`.

**Evidence:** `abg-stat-strip`, `abg-stat`, `abg-stat-label`, `abg-stat-value`, `abg-stat-detail`, `abg-table-wrap`, `abg-overflow-cue`, `abg-chart`, `abg-chart-header`, `abg-chart-title`, `abg-chart-description`, `abg-plot-viewport`, `abg-plot-axis`, `abg-plot-gridline`, `abg-plot-annotation`, `abg-plot-label`, `abg-plot-value`, `abg-series-stroke`, `abg-series-fill`, `abg-series-1` … `abg-series-6`, `abg-legend`, `abg-bar-list`, `abg-bar`, `abg-bar-label`, `abg-bar-value`, `abg-bar-track`, `abg-bar-fill`, `abg-comparison`, `abg-note`, `abg-status`.

**Controls:** `abg-calculator`, `abg-calculator-inputs`, `abg-calculator-output`, `abg-field`, `abg-unit-field`, `abg-unit-prefix`, `abg-unit-suffix`, `abg-helper`, `abg-error`, `abg-range-ends`, `abg-result`, `abg-result-label`, `abg-result-value`, `abg-result-detail`, `abg-button`.

**Presentation:** `abg-deck`, `abg-slide`, `abg-slide-frame`, `abg-slide-grid`.

**Theme:** `abg-light` and `abg-dark` on the `.abg-report` root force a theme, equivalently to `data-theme`. Both exist for hosts that already switch themes with a class; a document that simply follows the reader's OS needs neither.

**Attribute hooks:** `data-theme` (`light` / `dark`), `data-tone`, `data-size`, `data-kind`, `data-measure`, `data-columns`, `data-count`, `data-density`, `data-priority`, `data-role`, `data-align`, `data-rule`, `data-padded`, `data-divided`, `data-bordered`, `data-marks`, `data-hatch`, `data-pattern`, `data-marker`, `data-highlight`, `data-flush`, `data-fit`.

Use these primitives according to their semantic names. `.abg-stat-strip` owns peer `.abg-stat` blocks; `.abg-table-wrap` directly owns one semantic table; `figure.abg-chart` owns its header, a focusable viewport with inline SVG, a caption and an optional legend; `.abg-calculator` keeps its inputs and output in one coherent subtree. Do not interpose decorative wrappers or restyle foundation controls.

Treat only the names listed above as the public API. If none fits, use semantic HTML plus a page-owned `abg-custom-*` (layout) or `abg-viz-*` (non-text visualization marks) hook. Never inspect the stylesheet for internal selectors, guess an `abg-*` class, or extrapolate a name from another primitive. Never apply a custom visualization class to SVG text.

### Public tokens

Page-owned CSS may read only these families, with `var()` and the exact names. Never invent, alias or redeclare an `--abg-*` token. Prefer `currentColor`, `inherit` or `transparent` when a custom mark needs no distinct semantic role.

- **Brand:** `--abg-primary`, `--abg-primary-ink`, `--abg-accent`.
- **Ground and ink:** `--abg-canvas`, `--abg-surface`, `--abg-surface-raised`, `--abg-ink`, `--abg-ink-secondary`, `--abg-ink-subtle`, `--abg-link`, `--abg-inverse`, `--abg-ink-on-inverse`, `--abg-ink-on-inverse-secondary`, `--abg-dark`, `--abg-ink-on-dark`, `--abg-ink-on-dark-secondary`.
- **Rules:** `--abg-rule`, `--abg-rule-muted`, `--abg-rule-strong`, `--abg-rule-accent`, `--abg-rule-width`, `--abg-rule-on-inverse`, `--abg-rule-on-dark`, `--abg-focus`.
- **Feedback:** `--abg-success`, `--abg-success-ink`, `--abg-success-rule`, and the same triplet for `warning`, `danger`, `info`.
- **Data:** `--abg-series-1` … `--abg-series-6`, `--abg-plot-rule`, `--abg-plot-fill`.
- **Palette ladders:** `--abg-gray-50` … `--abg-gray-950`, `--abg-orange-100/300/500/600/700/900`, `--abg-blue-300/400/500/600/700`.
- **Rhythm:** `--abg-space-xxs`, `--abg-space-xs`, `--abg-space-sm`, `--abg-space-md`, `--abg-space-lg`, `--abg-space-xl`, `--abg-space-xxl`, `--abg-section-gap`, `--abg-group-gap`, `--abg-copy-gap`, `--abg-tight-gap`.
- **Measure:** `--abg-measure-content`, `--abg-measure-focused`, `--abg-measure-page`, `--abg-measure-wide`, `--abg-measure-control`, `--abg-reading`, `--abg-headline-measure`, `--abg-display-measure`.
- **Shape:** `--abg-radius-flat`, `--abg-radius-control`, `--abg-radius-card`.
- **Type:** `--abg-font-sans`, `--abg-font-display`, `--abg-font-mono`, `--abg-type-display`, `--abg-type-title`, `--abg-type-heading`, `--abg-type-subheading`, `--abg-type-minor`, `--abg-type-lede`, `--abg-type-body`, `--abg-type-compact`, `--abg-type-label`, `--abg-type-metadata`, `--abg-type-overline`, `--abg-type-amount`, `--abg-type-amount-sm`, `--abg-type-figure`, `--abg-leading-display`, `--abg-leading-heading`, `--abg-leading-body`, `--abg-leading-prose`, `--abg-leading-label`, `--abg-tracking-amount`, `--abg-tracking-overline`, `--abg-weight-regular`, `--abg-weight-emphasis`.
- **Motion:** `--abg-duration-fast`, `--abg-duration-moderate`, `--abg-duration-slow`, `--abg-ease-entrance`, `--abg-ease-exit`.
- **Author hooks** you may _set_: `--abg-band-offset`, `--abg-cell-fill`, `--abg-slide-scale`.

`--abg-shadow-overlay` exists for genuinely floating UI. **A document has none — do not use it.**

## Accessibility and responsive behavior

Use landmarks, one descriptive `h1`, ordered headings, a skip link, native controls, semantic tables, figures with captions, accessible names, visible focus and text alternatives. Meet WCAG AA and never rely on colour alone. Treat source order as reading order. Give the wordmark and the mark `role="img"` and `aria-label="Azion"`; give every `.abg-texture` `aria-hidden="true"`.

Do not conceal page overflow. Give grid and flex children `min-width: 0`; reflow before shrinking. Preserve readable type and control sizes. Short comparisons may stack; long ledgers scroll locally inside `.abg-table-wrap` when reordering and simplification cannot preserve lookup. The page must remain usable in light and dark and across desktop and narrow screens with no visible theme switcher.

The target is Azion judgment, not Azion decoration.
