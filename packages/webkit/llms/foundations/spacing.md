# Spacing and layout

> Page levels, the five measures, the two rhythm steps and the spacing scale.

## 1. Three levels, and no fourth

Every page is the same three nested decisions. Each level owns exactly one, and no level restates
another's.

```vue
<template>
  <main class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeader title="Applications" />

    <section class="layout-section-start flex flex-col gap-(--layout-section-gap)">
      <section class="flex flex-col gap-(--layout-group-gap)">…</section>
      <form class="flex flex-col gap-(--layout-group-gap)">…</form>
    </section>
  </main>
</template>
```

- **The heading** is `PageHeader` (`@aziontech/webkit/page-header`): the page's only h1, its
  description, and the page's own actions. A band inside the page is titled by a `SectionHeader`
  (`@aziontech/webkit/section-header`), or by a `SettingsSection` (`@aziontech/webkit/settings-section`)
  on a settings page — never by a second hand-written header block.
- **The boundary** (`layout-boundary`) sets the page's inset from the app chrome — sides, top and
  bottom — and its top inset is the space above the heading.
- **The parent section** spaces the sections inside it with `--layout-section-gap`. Every page carries
  one, whether it holds one section or seven, so the shape reads the same everywhere and a second
  section needs no rework.
- **Each section** spaces its own parts with `--layout-group-gap`: its title over its card, its
  controls row over the table those controls narrow.

**The page stack never carries a vertical `gap`.** It holds the heading and one element below it, and
that element carries the step. A `gap` is right on the parent section (within it, every child _is_ a
section, so one rule spaces them all) and wrong on the page stack (the heading and the parent are
different kinds of thing).

**`layout-section-start` goes on exactly one element per page stack** — the parent section directly
below the heading. Never on a section _inside_ the parent: `gap` and `margin` both apply in a flex
column, so the two add up and that section lands at twice the step.

It is safe to carry unconditionally. The utility zeroes its own margin when it happens to render
first, so a page with no heading, or one whose opening band is a `v-if`, opens at exactly the
boundary step. `v-if` bands are absent from the DOM, so `:first-child` reads the rendered truth.

## 2. The measure — five columns, picked by the payload

A page does not pick its own `max-w-*`. It carries one of five column classes, chosen by **what the
page's payload is**.

| Class                   | Measure                        | Today  | Payload                                                                            |
| ----------------------- | ------------------------------ | ------ | ---------------------------------------------------------------------------------- |
| `layout-column`         | `--layout-measure`             | 1620px | **The standard page container.** Lists, home, product overviews, detail dashboards |
| `layout-column-focused` | `--layout-measure-focused`     | 1024px | One task, still multi-column — a deploy hero, a running log, a review column       |
| `layout-column-form`    | `--layout-measure-form`        | 1024px | Settings and in-page edit forms — a single stacked column of fields                |
| `layout-form-create`    | `--layout-measure-form-create` | 1192px | Dedicated create pages (also retunes the control cap — see §7)                     |
| `layout-column-content` | `--layout-measure-content`     | 876px  | Prose — documentation, blog                                                        |

`layout-column` is the default. Take a different one only when the payload is **narrower**, never
wider.

Three things worth internalizing about the choice:

- **A form is capped for pairing, not for legibility.** Past ~1200px the extra width lands entirely
  inside the controls: the label sits at the far left of a 1600px row from the input it names, and
  the eye travels the whole measure to pair them.
- **Prose is capped by typography, not by layout.** Past ~90 characters the eye loses the start of
  the next line on the return sweep. That limit has nothing to do with how wide the payload is, which
  is why it is far tighter than every other measure and why it does **not** move when a rail collapses
  and frees up room.
- **The cap is named for the payload, never for the section.** A documentation _article_ takes the
  content measure; the documentation _home_ — a directory of cards, not read line by line — takes a
  wider one. What picks the column is the payload, never the URL.

**Full-bleed is the absence of all five**, never a `w-full`.

**The band picks the class, not the file.** A tab showing a table is measured as data even when the
tab beside it is a form. And within one band the class must be the same everywhere it has to align —
the scrolling body _and_ its sticky bar — or the footer's buttons drift right of the form they submit.

**Keep the measure identical across sibling states.** A page that changes width when the account
gains its first resource reads as two different pages; give the empty state the same column as the
populated one.

### Why the numbers are what they are

The measures are rungs of the shared container ladder — an anchored geometric progression. A page
snaps to the scale; the scale does not bend to a page. If a review asks for "about 1300", the answer
is the rung, not a new number.

## 3. The boundary is not part of the measure

`layout-boundary` sets all three insets; `layout-boundary-inline` sets the sides only, for a band
that takes the page's side inset but owns its own vertical padding (a sticky bar, whose `py` is a bar
height, not a page boundary).

Who carries it depends on the shell:

- A **padded** page gets its boundary from the app shell, on the scroll box _outside_ the capped
  block, so the measure lands as content width.
- A page that carries the boundary **itself** puts it on the same block as the measure.

Those two would normally disagree. With `box-sizing: border-box`, 1620px of cap minus 24px a side is
a 1572px content column — 48px narrower than the same measure gives a padded page. That is the
measure describing something other than content, which is the one job it has.

**So when the boundary rides along, the cap grows by exactly the inset it now contains.** Both shapes
resolve to the same content column at every viewport, which means a page can gain or lose its own
boundary — pick up a tab bar, drop one, move from padded to self-padded — without moving a pixel.

This is automatic, and it is the reason a sticky bar works:

```vue
<template>
  <main class="overflow-auto">
    <form class="layout-column-form layout-boundary-inline flex flex-col pt-(--layout-section-gap)">
      …
    </form>
  </main>

  <footer
    class="layout-column-form layout-boundary-inline sticky bottom-0 flex justify-end gap-(--spacing-sm) py-(--spacing-md)"
  >
    <Button
      kind="transparent"
      label="Cancel"
    />
    <Button label="Save" />
  </footer>
</template>
```

Same column class, same inline boundary, on both — so the bar's buttons land inside the form's own
right edge by construction. `SaveBar kind="plain"` (`@aziontech/webkit/save-bar`) is this footer,
already carrying `layout-column-form layout-boundary-inline`; reach for it instead of writing the bar. Naming the inline half is what lets the measure rule see a self-inset
band and treat it exactly like the scrolling body it sits under.

**The boundary is padding, never margin.** A top margin on an `h-full` child of a padded scroll box
overflows by exactly the margin — `h-full` resolves against the parent's content box, the margin sits
outside it — and the overflow lands as a silent clip at the bottom of a table.

## 4. Rhythm — two steps, and no third

| Token                  | Today          | Between                      |
| ---------------------- | -------------- | ---------------------------- |
| `--layout-section-gap` | `--spacing-xl` | the sections of a parent     |
| `--layout-group-gap`   | `--spacing-md` | the parts inside one section |

That is the whole scale. A third step is how a page starts drifting from its siblings.

The section step is deliberately one stop larger than the boundary step: the page opens tight under
its heading, then separates its sections more firmly than the parts inside any one of them. The space
_above_ the first section belongs to the boundary and the space _between_ sections belongs to the
parent, so either retunes without the other — and every page follows, because no page restates a step.

**Prefer the `gap` form.** The band element is normally the wrapper, and `gap-(--layout-group-gap)` on
it names the group in the markup.

**`layout-group-start` is the fallback** for the one case a parent cannot cover: a group whose parts
are already direct siblings of the page stack, where adding a wrapper is the wrong answer.

A common miss: a controls row and the table it narrows are **one band**, joined at the group step.
The section step is the gap _above_ the band, not inside it.

## 5. Every value is a reference

Layout tokens are a **derived** group: each one is a `var()` reference to the spacing or container
scale. Never a literal length.

That indirection is the point. The spacing scale is already fluid — `--spacing-lg` is 1rem, then
1.5rem from `sm` — and `var()` is substituted at _use_ time on the element, so a layout token follows
the breakpoint override without owning a breakpoint map of its own. A layout token with its own map
would duplicate the spacing scale and let the two drift.

Practical consequence: you never write a responsive variant for the boundary or the rhythm. They are
already responsive.

## 6. The site frame

The marketing site has its own column, and it is a **frame** rather than a content cap.

```vue
<template>
  <div class="layout-column-site border-x border-(--border-default)">…</div>
</template>
```

`layout-column-site` is inset from the window **at every width**, which is the whole reason it is a
utility rather than a `max-w-()`. On a wide screen the inset is free: the measure is narrower than the
window, the column centres, and its rules read as the page's vertical frame with canvas either side.
Below the cap that stops doing anything — the column becomes the window — and the rules land _on_ the
window edges, where a hairline is not a frame, it is a seam against the bezel.

One `min()` covers the whole range with no breakpoint: the cap is whichever binds first, the measure
or the window less a boundary a side. The two mechanisms hand off to each other, so a phone gets the
same framed column a desktop gets.

**It carries no padding, deliberately.** The inset belongs to the frame, not to the copy: the bands
inside are grids whose hairline rules have to reach the frame's own verticals, and a padding here
would pull them off it. A band that wants its content inset too adds `layout-boundary-inline` on top.

The site bar is **one rung wider** than the page, via `--layout-measure-site-header`. A bar is chrome,
not content: it carries the brand at one end and the account actions at the other, held apart by a
navigation region that ran out of room on a laptop when held to the reading frame. It is the one band
allowed outside the frame, and it says so in a token of its own — which is what keeps the exception
reviewable in both directions. Nobody widens the bar by retuning the page, and nobody widens the page
by retuning the bar.

The bar is **`--layout-header-height`** tall (56px, the `GlobalHeader` height). A band that fills the
first screen under it takes that token out of the screen: `HeroBand` does by default (`headerOffset`),
and a bare `Hero kind="screen"` takes `offset="var(--layout-header-height)"`. Never a literal.

**A grid of cards fills its rows.** A framed or divided card grid (`CardGrid`, and every section
built on it) takes `columns` as the most a row may hold, not how many it must: by default
(`layout="balanced"`) it uses the fewest rows that cap allows on the narrowest track count that keeps
them, so a count that splits evenly fills every row — under three columns 2 → halves, 3 → thirds,
4 → 2 × 2. A short last row keeps the column width and leaves its trailing tracks empty, as azion.com
does (5 → 3 + 2, 7 → 3 + 3 + 1; under four, 7 → 4 + 3): a stretched last cell reads as a different,
wider card. `layout="fixed"` is for tiles whose width must not change (square logo walls, a cell
spanning rows or columns, a floor that keeps its track count).

**The footer closes the frame and nothing follows it.** `SiteLayout` places `SiteFooter` as its last
child, unwrapped — a page never adds one. The page ends on its bottom bar at every width: the brand
leads the social row from `md`; on phones there is no wordmark row and the status line stacks over
the language select.

## 7. The control cap in a field row

An item-group field row is two columns: the content names the field (title + guidance) on the left,
the actions hold the control on the right.

```vue
<template>
  <div class="layout-field-control">
    <Select
      v-model="region"
      :options="regions"
      class="w-full"
    />
  </div>
</template>
```

`layout-field-control` is `flex-1` + `justify-end` capped at `--layout-measure-control`, so the row
stays two-column at every viewport — the control side yields to a long field name instead of wrapping
— and controls inside still pass `w-full` to fill the cap.

The cap decides where the control actually **sits**: raise it and the control grows leftward toward
the label that names it; lower it and the control pins to the right edge with the gap opening up in
between.

The default (256px) is deliberately tight, because a settings row reads as "name → current value" and
a narrow value column keeps a scannable right edge down the whole card. **A create page inverts that
priority** — the fields _are_ the payload, several carry their own descriptions, and the user is
filling them in rather than scanning them — so `layout-form-create` retunes the cap to 472px for
everything inside it. One token, retuned per band, instead of a width re-typed on every row.

## Spacing and layout tokens

| Group | Count | Tokens |
| --- | --- | --- |
| spacing | 36 | `--spacing-1` · `--spacing-10` · `--spacing-11` · `--spacing-12` · `--spacing-14` · `--spacing-16` · `--spacing-2` · `--spacing-20` · `--spacing-24` · `--spacing-28` · `--spacing-3` · `--spacing-32` · `--spacing-36` · `--spacing-4` · `--spacing-40` · `--spacing-44` · `--spacing-48` · `--spacing-5` · `--spacing-52` · `--spacing-56` · `--spacing-6` · `--spacing-60` · `--spacing-64` · `--spacing-7` · `--spacing-72` · `--spacing-8` · `--spacing-80` · `--spacing-9` · `--spacing-96` · `--spacing-lg` · `--spacing-md` · `--spacing-sm` · `--spacing-xl` · `--spacing-xs` · `--spacing-xxl` · `--spacing-xxs` |
| layout | 15 | `--layout-boundary-end` · `--layout-boundary-inline` · `--layout-boundary-start` · `--layout-column-measure` · `--layout-group-gap` · `--layout-header-height` · `--layout-measure` · `--layout-measure-content` · `--layout-measure-control` · `--layout-measure-focused` · `--layout-measure-form` · `--layout-measure-form-create` · `--layout-measure-site` · `--layout-measure-site-header` · `--layout-section-gap` |
| container | 16 | `--container-2xl` · `--container-2xs` · `--container-3xl` · `--container-3xs` · `--container-4xl` · `--container-5xl` · `--container-6xl` · `--container-7xl` · `--container-lg` · `--container-max-width` · `--container-md` · `--container-px` · `--container-py` · `--container-sm` · `--container-xl` · `--container-xs` |
| size | 28 | `--size-10` · `--size-11` · `--size-12` · `--size-14` · `--size-16` · `--size-2` · `--size-20` · `--size-24` · `--size-28` · `--size-3` · `--size-32` · `--size-36` · `--size-4` · `--size-40` · `--size-44` · `--size-48` · `--size-5` · `--size-52` · `--size-56` · `--size-6` · `--size-60` · `--size-64` · `--size-7` · `--size-72` · `--size-8` · `--size-80` · `--size-9` · `--size-96` |
| width | 13 | `--width-2xl` · `--width-2xs` · `--width-3xl` · `--width-3xs` · `--width-4xl` · `--width-5xl` · `--width-6xl` · `--width-7xl` · `--width-lg` · `--width-md` · `--width-sm` · `--width-xl` · `--width-xs` |
| height | 28 | `--height-10` · `--height-11` · `--height-12` · `--height-14` · `--height-16` · `--height-2` · `--height-20` · `--height-24` · `--height-28` · `--height-3` · `--height-32` · `--height-36` · `--height-4` · `--height-40` · `--height-44` · `--height-48` · `--height-5` · `--height-52` · `--height-56` · `--height-6` · `--height-60` · `--height-64` · `--height-7` · `--height-72` · `--height-8` · `--height-80` · `--height-9` · `--height-96` |
| inset | 3 | `--inset-shadow-2xs` · `--inset-shadow-sm` · `--inset-shadow-xs` |
| breakpoint | 5 | `--breakpoint-2xl` · `--breakpoint-lg` · `--breakpoint-md` · `--breakpoint-sm` · `--breakpoint-xl` |
