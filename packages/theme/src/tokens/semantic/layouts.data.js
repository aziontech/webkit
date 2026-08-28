/**
 * Layout tokens — the console's container system.
 *
 * Three decisions, expressed once: how far content sits from the app chrome
 * (BOUNDARY), how far things sit from each other (RHYTHM), and how wide a reading
 * column may get (MEASURE).
 *
 * A DERIVED GROUP: every value here is a `var()` reference to `--spacing-*` /
 * `--container-*`. Never write a literal length in this file. That indirection is the
 * whole point — the spacing scale is already fluid (`--spacing-lg` is 1rem, then
 * 1.5rem from `sm`), and `var()` is substituted at USE time on the element, so a
 * layout token follows the breakpoint override without owning a breakpoint map of its
 * own. Giving these their own maps would duplicate the spacing scale into layout and
 * let the two drift.
 */
export const layoutsData = {
  // BOUNDARY — content ↔ app chrome.
  'layout-boundary-inline': 'var(--spacing-lg)',
  'layout-boundary-end': 'var(--spacing-lg)',
  'layout-boundary-start': 'var(--spacing-lg)',

  /*
   * RHYTHM — two levels, nothing else.
   *
   * THE PAGE SHAPE. The page stack never carries a vertical `gap`. It holds the
   * heading and ONE element below it, and that element carries the BAND step:
   *
   *   <div class="layout-column layout-boundary flex min-w-0 flex-col">
   *     <PageHeading />
   *     <section class="layout-section-start flex flex-col
   *                     gap-(--layout-section-gap)">      the bands
   *       <section class="flex flex-col gap-(--layout-group-gap)">…</section>
   *       <form    class="flex flex-col gap-(--layout-group-gap)">…</form>
   *     </section>
   *   </div>
   *
   * So there are exactly three levels, each owning one decision: the BOUNDARY sets the
   * page's top inset, the PARENT SECTION spaces the sections inside it with
   * --layout-section-gap, and each of those sections spaces its own parts with
   * --layout-group-gap (its title over its card, its controls over the table they
   * narrow). Every page carries the parent section, whether it holds one section or
   * seven, so the shape is the same to read and a second section needs no rework.
   *
   * TWO TOKENS, TUNED SEPARATELY. The space above the first section belongs to the
   * BOUNDARY (--layout-boundary-start) and the space between sections belongs to the
   * PARENT (--layout-section-gap), so either moves without the other. Today the
   * section step is one stop larger than the boundary step: the page opens tight under
   * its heading and then separates its sections more firmly than the parts inside any
   * one of them. Retune either here and every page follows — no page restates a step.
   *
   * A `gap` is right on the parent section and inside a section, and wrong on the page
   * stack: within the parent every child IS a section, so one rule spaces them all; on
   * the page stack the heading and the parent are different kinds of thing.
   * `.layout-group-start` covers the one case a parent cannot: a group whose parts are
   * already direct siblings of the page stack.
   */
  'layout-section-gap': 'var(--spacing-xl)', // between sections of a parent
  'layout-group-gap': 'var(--spacing-md)', // within a band

  /*
   * MEASURE — the widest a page column may get, by context. Five values, because the
   * reason a column is capped differs with how wide its payload actually is.
   *
   * DATA pages (home, the product overviews, lists, detail dashboards) are capped so a
   * table that runs to the viewport edge on an ultrawide screen doesn't put its row
   * actions a head-turn away from the name that identifies the row. They still want
   * every pixel they can get: more columns visible is the point.
   *
   * This is THE STANDARD PAGE CONTAINER — the one measure a main page column takes
   * unless it has a reason not to, and the reason is always a narrower payload (a form,
   * a hero, prose), never a wider one. It was 1620px (`7xl`) and is now 1388px (`6xl`),
   * a single width for home, the overviews and every listing, in both their empty and
   * populated states. `6xl` is the ladder's nearest slot to the 1300px the design review
   * asked for; the ladder is an anchored geometric progression
   * (primitives/shape/container.js), so it has no 1300 and does not get one for a page
   * decision — the page snaps to the scale, the scale does not bend to the page.
   *
   * FOCUSED pages are one task whose payload is still multi-column — a template deploy
   * hero, a running-deployment log, a release composer's review column — so they stay
   * wide enough for those bands to breathe, and no wider. Home used to sit here; it is
   * a usage rail beside a list of every resource an account owns, which is the DATA
   * measure's job, and it took that measure with its empty state (a page that changed
   * width when the account gained its first resource was reading as two pages).
   *
   * FORM pages (settings, in-page edit forms) are a single stacked column of fields.
   * Past ~1200px the extra width lands entirely inside the controls: a label sits at
   * the far left of a 1600px row from the input it names, and the eye has to travel
   * the whole measure to pair them.
   *
   * CONTENT pages are the one column capped by TYPOGRAPHY rather than by layout. Prose
   * is read line by line, and past ~90 characters the eye loses the start of the next
   * line on the return sweep — a limit that has nothing to do with how wide the payload
   * is, which is why it is far tighter than every other measure here and why it does not
   * move when a rail collapses and frees up room. A documentation page is already
   * flanked by two rails; this caps what is between them.
   *
   * IT IS NAMED FOR THE PAYLOAD, NOT FOR THE SECTION. The cap is a line length, so every
   * page whose payload is flowing copy takes it — documentation today, the blog and any
   * other article page next — and none of them has to re-derive the same limit under a
   * name that says "docs". By the same rule, a page inside the documentation that is NOT
   * read line by line (its home, a directory of cards) takes a wider measure: what picks
   * the column is the payload, never the URL.
   */
  'layout-measure': 'var(--container-6xl)', // 1388px — the standard page container
  'layout-measure-focused': 'var(--container-4xl)', // 1024px — single-task heroes
  'layout-measure-form': 'var(--container-4xl)', // 1024px — settings, forms
  'layout-measure-form-create': 'var(--container-5xl)', // 1192px — create flows
  'layout-measure-content': 'var(--container-3xl)', // 876px — prose columns (docs, blog)

  /*
   * MEASURE (site) — the marketing site's columns, and the only measures in this file
   * that are not a console page's. There are TWO, because the page and the bar above it
   * do not answer the same question.
   *
   * --layout-measure-site IS THE PAGE'S FRAME. The azion.com pages are a single
   * vertical frame: the hero's inner column, every section below it, the docs home and
   * the footer all sit on the SAME centred column, and the border-x that runs down the
   * page is only continuous because they agree to the pixel. That is why this is a token
   * rather than a width re-typed per band — the frame is one decision, and one place is
   * where it has to live.
   *
   * --layout-measure-site-header IS THE BAR'S, AND IT IS DELIBERATELY ONE RUNG WIDER.
   * A bar is chrome, not content: it carries the brand at one end of the window and the
   * account actions at the other, held apart by a navigation region in the middle, so it
   * wants the room a reading frame deliberately refuses. Held to the page's measure that
   * middle region ran out of room on a laptop long before the page did. The bar is the
   * ONE band allowed outside the frame, and it says so in a token of its own — which is
   * also what keeps the exception reviewable in both directions: nobody widens the bar by
   * retuning the page, and nobody widens the page by retuning the bar.
   *
   * The two part company only above the caps, and by a fixed step. Measured against the
   * page frame: one shared inset up to 1280, 2px apart at 1440 (the frame has just
   * capped), 82 at 1600, and a flat 92 from 1668 up, where the bar caps too — half the
   * 232px between the two measures, less the boundary the bar keeps.
   *
   * Both are rungs of the shared container ladder (primitives/shape/container.js), not
   * numbers chosen for a page. The page snaps to the scale, the scale does not bend to
   * the page, which is the same rule --layout-measure follows. They are their own tokens
   * rather than references to a console measure because the questions differ: a console
   * measure caps a PAYLOAD (a table, a form), while these are the widths of a FRAME and
   * of the chrome above it. Retuning any of the three must not move the others.
   */
  'layout-measure-site': 'var(--container-6xl)', // 1388px — the marketing site column
  'layout-measure-site-header': 'var(--container-7xl)', // 1620px — the site bar, one rung wider
  /*
   * MEASURE (control) — the widest the *right side* of an item-group field row may
   * get. An ItemGroup row is two columns: the content names the field (title +
   * guidance) on the left, the actions hold the control on the right. That right side
   * is `flex-1` + `justify-end`, so this cap is what decides where the control
   * actually sits — raise it and the control grows leftward, toward the label that
   * names it; lower it and the control pins to the right edge with the gap opening up
   * in between.
   *
   * The default is deliberately tight: a settings row reads as "name → current value",
   * and a narrow value column keeps a scannable right edge down the whole card. A
   * create form inverts that priority — the fields ARE the page's payload, several are
   * radio blocks carrying their own descriptions, and the user is filling them in
   * rather than scanning them — so the create band opens this up (see
   * `.layout-form-create`). One token, retuned per band, instead of the cap being
   * re-typed on every row.
   */
  'layout-measure-control': 'var(--container-3xs)' // 256px — settings rows
}

/*
 * --layout-column-measure is deliberately NOT a token: it is a per-class local that
 * each column utility declares and the shared geometry below reads, so a fifth column
 * class inherits the whole behaviour by naming one measure.
 */
const COLUMN_MEASURE = {
  'layout-column': 'var(--layout-measure)',
  'layout-column-focused': 'var(--layout-measure-focused)',
  'layout-column-form': 'var(--layout-measure-form)',
  'layout-form-create': 'var(--layout-measure-form-create)',
  'layout-column-content': 'var(--layout-measure-content)'
}

/**
 * A centered column at the measure — every page carries one of these, list pages
 * included. Full-bleed is the absence of all five classes, not a `w-full`.
 *
 * THE BOUNDARY IS NOT PART OF THE MEASURE. A `padded` page gets its boundary from the
 * app shell, on the scroll box OUTSIDE the capped block, so the measure lands as
 * CONTENT width. A page that carries the boundary ITSELF puts it on the same block as
 * the measure, and there `box-sizing: border-box` makes the cap swallow the inset:
 * 1388px of cap minus 24px a side is a 1340px content column, 48px narrower than the
 * same measure gives a padded page. That is the measure describing something other
 * than content, which is the one job it has.
 *
 * So when the boundary rides along, the cap grows by exactly the inset it now
 * contains, and both shapes resolve to the same content column at every viewport.
 * Which means a page can gain or lose its own boundary — pick up a tab bar, drop one,
 * move from padded to self-padded — without moving a pixel.
 *
 * The widening nests HERE, on the column, rather than on the boundary utilities.
 * Specificity is (0,2,0) either way, so correctness does not decide it; three things
 * do. Both declarations that can set `max-width` stay in one block, in reading order.
 * `.layout-boundary` stays what its name says — three padding declarations — instead
 * of shipping a four-way `:is()` into every consumer that uses it with no column
 * anywhere. And a fifth column class still costs one line, because these are generated
 * from COLUMN_MEASURE and the nested rule comes along with it.
 */
const columnUtility = (measure, extra) => ({
  '--layout-column-measure': measure,
  ...extra,
  'margin-inline': 'auto',
  width: '100%',
  'max-width': 'var(--layout-column-measure)',
  '&:is(.layout-boundary, .layout-boundary-inline)': {
    'max-width': 'calc(var(--layout-column-measure) + 2 * var(--layout-boundary-inline))'
  }
})

export const layoutsUtilities = {
  /*
   * The page boundary. Padding, never margin: a top margin on an `h-full` child of a
   * padded scroll box overflows by exactly the margin (h-full resolves against the
   * parent's content box, the margin sits outside it) and the overflow lands as a
   * silent clip at the bottom of a table.
   */
  'layout-boundary': {
    'padding-inline': 'var(--layout-boundary-inline)',
    'padding-block-start': 'var(--layout-boundary-start)',
    'padding-block-end': 'var(--layout-boundary-end)'
  },

  /*
   * The inline half of the boundary, alone — for a band that takes the page's side
   * inset but owns its own vertical padding: a create flow's sticky action bar, whose
   * `py` is a bar height, not a page boundary. Naming it is what lets the MEASURE rule
   * above see a self-inset band and treat it exactly like the scrolling body it sits
   * under, which is the whole point of a sticky bar.
   */
  'layout-boundary-inline': {
    'padding-inline': 'var(--layout-boundary-inline)'
  },

  /*
   * The BOUNDARY step, as a margin — carried by the PARENT SECTION that sits directly
   * below the heading. Exactly ONE element per page stack carries it. Never put it on
   * a section INSIDE the parent: `gap` and `margin` both apply in a flex column, so
   * the two add up and that section lands at twice the step.
   *
   * The `:first-child` rule zeroes the margin when the element that carries it happens
   * to render first (a page with no heading; a stack whose opening band is
   * conditional) — the boundary's padding is that band's top space, so the class is
   * safe to carry unconditionally. This is what makes the margin model safe when the
   * band ABOVE is conditional: a module list renders its controls row only when it has
   * rows, so on an empty account the empty-state band becomes the first child and
   * opens at exactly the boundary step. `v-if` bands are absent from the DOM, so
   * `:first-child` reads the rendered truth.
   *
   * `margin-block-start` (not `margin-top`) to stay on the logical axis the boundary
   * tokens use. Safe here because these stacks are flex containers, where a child's
   * margin never collapses out of its parent.
   */
  'layout-section-start': {
    'margin-block-start': 'var(--layout-boundary-start)',
    '&:first-child': { 'margin-block-start': '0' }
  },

  /*
   * The GROUP step, as a margin — the fallback for a group whose parts are already
   * direct siblings of the page stack, where a wrapper is the wrong answer. The band
   * element normally IS that wrapper (`gap: var(--layout-group-gap)`), and that is the
   * form to prefer: it names the group in the markup.
   */
  'layout-group-start': {
    'margin-block-start': 'var(--layout-group-gap)',
    '&:first-child': { 'margin-block-start': '0' }
  },

  ...Object.fromEntries(
    Object.entries(COLUMN_MEASURE).map(([name, measure]) => [
      name,
      columnUtility(
        measure,
        // The create band retunes the control cap for everything inside it. On a
        // 1192px column a 256px control side left every input pinned to the far right,
        // a head-turn away from the label naming it; 472px pulls the control back
        // toward its label and gives the radio blocks room to read.
        name === 'layout-form-create'
          ? { '--layout-measure-control': 'var(--container-md)' }
          : undefined
      )
    ])
  ),

  /*
   * THE SITE FRAME — the marketing page's column, and the one column in this file whose
   * cap is a FRAME width rather than a content width.
   *
   * IT IS INSET FROM THE WINDOW AT EVERY WIDTH, and that is the whole reason it exists as
   * a utility. On a wide screen the inset is free: --layout-measure-site is narrower than
   * the window, `margin-inline: auto` centres the column, and its rules read as the page's
   * vertical frame with canvas either side. Below the cap that stops doing anything — the
   * column becomes the window — and the two rules land ON the window edges, where a
   * hairline is not a frame, it is a seam against the bezel. So the frame that organises
   * the whole desktop layout simply ceased to exist on a phone, and the headline above it
   * (which pads by the boundary) opened a boundary inside a rule drawn at x=0.
   *
   * ONE `min()` COVERS THE WHOLE RANGE, WITH NO BREAKPOINT. The cap is whichever binds
   * first: the measure, or the window less a boundary a side. While the measure is the
   * smaller the column is capped and centred and the boundary term is inert; once the
   * window is narrower than the measure — precisely where the cap has stopped working —
   * the boundary term takes over and IS the inset. The two mechanisms hand off to each
   * other, so a phone gets the same framed column a desktop gets, one boundary in from
   * each edge.
   *
   * NO PADDING, DELIBERATELY. The inset belongs to the frame, not to the copy: the bands
   * inside are grids whose `gap-px` rules have to reach the frame's own verticals, and a
   * padding here would pull them off it. A band that wants its content inset too adds
   * `layout-boundary-inline` on top (that is what SectionContainer's `padded` does).
   *
   * This is the shape /site/pricing worked out band by band and carried in a wrapper div;
   * as a utility it is one element, pixel-identical at every width, and every other page
   * and the footer get it by naming the column instead of re-deriving it.
   */
  'layout-column-site': {
    'margin-inline': 'auto',
    width: '100%',
    'max-width': 'min(var(--layout-measure-site), 100% - 2 * var(--layout-boundary-inline))'
  },

  /*
   * The control side of an item-group field row: the same geometry every settings row
   * hand-repeated, with the cap coming from --layout-measure-control so a band retunes
   * all of its rows at once.
   *
   * `flex-1` + `justify-end` rather than a fixed width: the row stays two-column at
   * every viewport (the control side yields to a long field name instead of wrapping),
   * and controls inside still pass `w-full` to fill the cap.
   *
   * THE `:not(#\#)` IS LOAD-BEARING, and it is the one place in this file that needs a
   * specificity hack. This class is applied to a component whose own root already
   * carries `shrink-0`, and Vue merges both class lists onto one element. As plain
   * unlayered CSS this rule won this tie; as an `@utility` it sorts BEFORE the core
   * utilities, so `shrink-0` would win and the control side could no longer yield to a
   * long field name. `#\#` is an id no element can carry, so the selector always
   * matches while reading (1,1,0) — Tailwind's own important-strategy idiom. It stays
   * variant-safe (`.md\:layout-field-control:not(#\#)`), unlike an `&:is(…)` bump.
   * Applied to this utility ONLY: the other eight have no live conflict, and the hack
   * would needlessly outrank legitimate consumer overrides.
   */
  'layout-field-control': {
    '&:not(#\\#)': {
      display: 'flex',
      flex: '1 1 0%',
      'justify-content': 'flex-end',
      'max-width': 'var(--layout-measure-control)'
    }
  }
}

export default { layoutsData, layoutsUtilities }
