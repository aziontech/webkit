---
name: webkit-layout
description: The page container system — how a page built on @aziontech/webkit gets its width, its inset from the app chrome, and its vertical rhythm. Fixes the three-level page shape (boundary → parent section → band), the five measures and what picks one (the payload, never the URL), why the boundary is not part of the measure and what that buys, the two rhythm steps and the margin form for a band whose parent cannot carry a gap, the site frame, and the control cap inside an item-group field row. Everything comes from the `layout-*` utilities and tokens in @aziontech/theme — a page never writes its own `mx-auto max-w-*`, and full-bleed is the absence of a column class, not a `w-full`. Use when building any page, adding a sticky action bar, wondering how wide a page should be, or reviewing a page whose column drifts left, whose bar misaligns with the body it submits, or whose sections breathe unevenly.
status: active
last_updated: 2026-09-21
scope: general
enforced_by: [webkit-styling, webkit-tokens, ui-verify, review]
---

# Skill: webkit-layout

## Purpose

A page makes exactly three layout decisions: **how far its content sits from the app chrome**
(boundary), **how wide the content column may get** (measure), and **how far things sit from each
other** (rhythm). `@aziontech/theme` ships all three as `layout-*` utilities and tokens, so a page
_names_ its decisions instead of re-deriving them.

This matters more than it sounds. A hand-rolled `mx-auto max-w-(--container-7xl)` is correct on the
page you write it on and wrong on the next one, because nothing ties the two together: one page caps
at `7xl`, the sibling tab caps at `6xl`, the sticky footer under them caps at neither, and the
buttons drift right of the form they submit. Naming the decision makes alignment structural — the
scrolling body and its action bar align because they carry the same class, not because two numbers
happened to match.

## How to use

- `/webkit-layout` — shape any page in this conversation with the system below.
- `/webkit-layout <file>` — review that page: per gap report the quoted line, the rule it breaks in
  one sentence, and the concrete fix.

Related: `/webkit-lists` (the index page this shape carries) · `/webkit-create-surface` (page vs
drawer, and the commit bar that must align with its form) · `/webkit-navigation` (the shell that owns
the boundary on a padded page) · `/webkit-baseline-ui` (tokens, typography, spacing scale).

## When to invoke

- Starting any new page, or asking how wide it should be.
- Adding a sticky action bar, tab bar, or footer under a scrolling body.
- Reviewing a page whose content drifts to the left edge on a wide screen, whose bar misaligns with
  the body above it, or whose sections breathe unevenly.
- You are about to write `mx-auto`, `max-w-`, `w-full`, or a page-level `p-(--spacing-*)`.
- The page changes width between two states (empty vs populated) or between two sibling tabs.

---

## 1. Three levels, and no fourth

Every page is the same three nested decisions. Each level owns exactly one, and no level restates
another's.

```vue
<template>
  <main class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading title="Applications" />

    <section class="layout-section-start flex flex-col gap-(--layout-section-gap)">
      <section class="flex flex-col gap-(--layout-group-gap)">…</section>
      <form class="flex flex-col gap-(--layout-group-gap)">…</form>
    </section>
  </main>
</template>
```

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
      kind="text"
      label="Cancel"
    />
    <Button label="Save" />
  </footer>
</template>
```

Same column class, same inline boundary, on both — so the bar's buttons land inside the form's own
right edge by construction. Naming the inline half is what lets the measure rule see a self-inset
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

## Hard rules

- **NEVER** hand-roll a page cap: no `mx-auto max-w-(--container-*)`, no `max-w-[…]`, no `max-w-5xl`
  on a page root. Carry a column class.
- **NEVER** `w-full` to mean full-bleed. Full-bleed is the absence of a column class.
- **MUST** keep the column class identical across a band's parts that have to align — the scrolling
  body and its sticky bar — and across sibling states of the same page (empty vs populated).
- **MUST** put the boundary on a block as **padding**, never margin.
- **MUST** carry `layout-section-start` on exactly one element per page stack. Never on a section
  inside the parent — `gap` and `margin` add up.
- **NEVER** put a vertical `gap` on the page stack itself.
- **NEVER** introduce a third rhythm step beside `--layout-section-gap` and `--layout-group-gap`.
- **NEVER** write a responsive variant for the boundary or the rhythm — the tokens are already fluid.
- **MUST** pick the measure from the payload, never from the route, and only ever narrower than
  `layout-column`.
- **NEVER** cap the app shell — the sidebar, the global header, the content zone's own inset stay
  fluid. The cap lives on the page's own column.

## Review output

Per gap:

```
✗ ApplicationsList.vue:12
  quoted: <main class="mx-auto w-full max-w-(--container-7xl) p-(--spacing-lg)">
  rule:   a page carries a column class and a boundary, never a hand-rolled cap
  fix:    class="layout-column layout-boundary flex min-w-0 flex-col" — the cap then grows by
          the inset it contains, so this page and a padded sibling land on the same column

✗ CreateWorkload.vue:84
  quoted: <footer class="sticky bottom-0 mx-auto max-w-(--container-4xl) px-(--spacing-lg)">
  rule:   a bar aligns with the body it submits by carrying the SAME column class
  fix:    layout-column-form layout-boundary-inline — the form above uses layout-column-form

✗ ZoneDetail.vue:31
  quoted: <section class="layout-section-start flex flex-col gap-(--layout-section-gap)">
            <section class="layout-section-start …">
  rule:   layout-section-start belongs to exactly one element per page stack
  fix:    drop it from the inner section — the parent's gap already spaces it; carrying both
          lands this section at twice the step

✗ Settings.vue:55
  quoted: <div class="flex flex-1 justify-end" style="max-width: 256px">
  rule:   the control cap is a token so a band retunes all of its rows at once
  fix:    class="layout-field-control"
```

Close with `Layout sound` or `N gaps — fix before polish`.

## References

- `/webkit-lists` — the index page this shape carries, and the controls-row band.
- `/webkit-create-surface` — where a create lives, and the commit bar that must align with its form.
- `/webkit-navigation` — the app shell, and who owns the boundary on a padded page.
- `/webkit-baseline-ui` — tokens, typography hierarchy, the spacing scale these derive from.
- **Foundations → Layout** in Storybook — the live catalog of every measure and utility.
- `semantic/layouts` in `@aziontech/theme` — the tokens and utilities themselves, with the reasoning
  for each decision recorded beside it.

## Definition of Done

- [ ] The page carries a column class chosen by its payload — or none at all, deliberately, for
      full-bleed.
- [ ] No `mx-auto`, `max-w-*`, or `w-full` standing in for the container system.
- [ ] The boundary is on the page or on the shell, as padding, and the cap absorbs it either way.
- [ ] Exactly one `layout-section-start` per page stack; no vertical `gap` on the page stack.
- [ ] Rhythm is the two steps only — section between sections, group inside one.
- [ ] A controls row and the thing it narrows sit in one band at the group step.
- [ ] A sticky bar carries the same column class and `layout-boundary-inline` as its body.
- [ ] Sibling states of the page (empty, populated, each tab) resolve to the same column.
- [ ] Field rows use `layout-field-control`, not a hand-set width.
- [ ] Verified at phone, laptop and ultrawide in both themes with `/webkit-ui-verify`.
