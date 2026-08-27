<script setup>
  // The app's search affordance, at the TRAILING end of the global bar — the console's and
  // the documentation's alike, leading the actions on that side.
  //
  // It used to sit at the top of the NAVIGATION RAIL in both shells (the console's
  // AppSidebar carried a readonly field; the docs carried their own DocsSearchTrigger).
  // It moved here for the reason Google Cloud's console puts it in the bar: search is not
  // part of the navigation tree, it is the way PAST it. A trigger inside the rail is only
  // reachable while the rail is — expanded, not dragged narrow, and on a viewport wide
  // enough to have one — while the bar is on screen in every one of those states.
  //
  // The wide shape is a BUTTON, not a field: the palette owns the typing. A readonly input
  // that opens something else is a field lying about what typing into it does — which is
  // what the console's rail had, down to a `[&_input]:cursor-pointer` undoing the caret it
  // should never have shown.
  //
  // It WEARS THE FIELD'S CHROME, value for value, because it is the same affordance as
  // every other search in the app — the list search over a table, the hub bar's — and each
  // of those is a DS `InputText`, at the `medium` this bar runs. So nothing visual here is
  // a choice; it is
  // read off `inputs/input-text`'s own root: `bg-(--bg-surface)` inside
  // `border-(--border-default)` at `rounded-(--shape-elements)`, `gap-(--spacing-xs)
  // px-(--spacing-sm)`, `h-8` (its `medium`), the leading glyph muted in its own span, and
  // the LABEL at `text-label-sm` in `--text-muted` — the input's own text token and its
  // placeholder colour, 12px, not the 14px `text-label-md` this file used to render. Two
  // behaviours come across with it: the border strengthens on hover only while the control
  // is NOT focused (the DS guards that with `:not(:focus-within)`; a button's equivalent is
  // `:focus-visible`), and the ring offset resolves `--input-ring-offset`, the DS's own
  // documented host hook, declared here as `--bg-surface` because this field sits on the
  // bar and not on the canvas the DS defaults to. It is the same expression `input-text`
  // uses, on `focus-visible` rather than its `focus-within` because a button takes focus
  // itself; `duration-moderate-01` is the token spelling of the DS field's own 150ms.
  //
  // What does NOT come across is `cursor-text`. This is a button, and the pointer is the
  // one place parity would be a lie.
  //
  // TWO CONTROLS, ONE JOB, and never both on screen. Given room, the 224px search bar
  // below (`w-56`, down from a centred 644px band); given less, the DESIGN
  // SYSTEM's own `IconButton` — not this file's bar squeezed into a square. The narrow
  // shape sits beside the bar's other icon-only controls (the console's nav hamburger, the
  // docs' menu button, both `outlined` at `medium`), so it has to BE one of them: same
  // 32px box, same border and surface tokens, same ghost/active layers, same focus ring,
  // and it inherits every fix those get. A hand-rolled lookalike drifts the first time the
  // DS retunes any of that.
  //
  // Rendering both and hiding one is the only way a CSS query can choose between two
  // different components. It costs one inert button, and `display: none` takes the hidden
  // one out of the accessibility tree too, so exactly one is exposed at any width.
  //
  // THE SWITCH IS A CONTAINER QUERY ON THE BAR, not a viewport breakpoint, because the two
  // shells do not run out of room at the same viewport: the console's bar lives in the
  // content zone beside a 300px rail, so at any window it is ~300px narrower than the docs
  // bar, which spans the whole window. A viewport rule tuned for one is wrong for the other
  // by exactly the rail.
  //
  // The BAR is the container, not the region this control sits in. It sits in the trailing
  // cluster now, beside the other actions — and that cluster is `shrink-0` and sized by its
  // contents, so `container-type: inline-size` on it would have no width of its own to
  // report (containment cuts it off from its contents, and it has no other source). The
  // header root is `w-full`: its width comes from the zone it spans and never from what is
  // in it, which is exactly what a container query needs. Each shell marks its own
  // `<GlobalHeader>` `@container`.
  //
  // 224px is a size decision — a control that sits with the other controls, not a band
  // across the bar. `w-56` and not a container-ladder rung, because the ladder starts at
  // 256px (`--container-3xs`) and has nothing this small; `w-56` is `calc(var(--spacing) *
  // 56)` and `--spacing` is `0.25rem`, so it is a real 224px (probed, not assumed — the
  // theme does not declare `--spacing` itself, it comes from Tailwind's own `@theme`).
  // 47rem (752px) is MEASURED, by forcing the wide shape at every width and sweeping for the
  // point where the fuller of the two bars — the console's, carrying a breadcrumb plus
  // Create + Agent + avatar — runs its centre spacer to zero. That is 740px of bar; 752
  // clears it by 12. The docs bar's own cluster fits down to ~432, so one threshold for both
  // costs it the wide shape between ~480 and 800px of window — a square is an honest search
  // affordance at that size, and one number that is provably safe beats two that each need
  // re-measuring whenever a cluster gains a control. Below the threshold both shells show
  // the square; the control is never rendered at some in-between width (a half-length search
  // bar reads as a broken field; a square reads as a button).
  //
  // THE QUERY MEASURES THE CONTENT BOX. Both bars pad themselves by the page boundary
  // (`--layout-boundary-inline`, 24px a side from `sm`), and a container query evaluates
  // against the container's content box — so the number here is 48px SMALLER than the bar
  // width you would measure in devtools. Proven rather than assumed: at a console window of
  // 1100 the bar is exactly 800px wide and a 50rem threshold did NOT match, because the
  // content box is 752. Retune this whenever the boundary token moves.
  //
  // THE LABEL HAS TO FIT, and the field does not stretch for it. Measured on the live bar
  // with Sora RESOLVED: the chrome takes 102.9px of the 224 — 2px of border, 24px of
  // padding, 16px across the two gaps, the 16px glyph and the 44.9px keycap — leaving a
  // **121.1px** text box. `Search` inks at 42.3px there, so the label has real slack now
  // that it runs at the input's 12px instead of 14px: about 17 average characters, enough
  // that `Search commands` (113.0px) would fit where `Search documentation` (139.5px)
  // truncates. Both shells still pass `Search` — the trigger hints, and each palette's own
  // input carries the long form (`Search navigation and commands`, `Search
  // documentation`). Measure any replacement the same way — `await document.fonts.ready`,
  // then a Range over the text node — because Sora is wider than the fallback that renders
  // before it loads, and the difference is not small: the console's old 30-character label
  // measured 212px against the fallback and 240px in Sora.
  //
  // The threshold is spelled `@min-[47rem]` rather than a named rung on purpose. Tailwind
  // resolves `@xs`/`@sm`/… from the `--container-*` values declared inside `@theme`, and
  // this theme declares its container ladder in `:root` instead — so `@xs` compiles to
  // Tailwind's own default 20rem rather than the ladder's 348px. A named rung here would be
  // a number nobody chose. Moving the ladder into `@theme` would fix the rungs system-wide,
  // but it also moves every `@sm`/`@md` container query already in the app — not a side
  // effect this control gets to cause.
  //
  // `h-8` is `InputText size="medium"` and `IconButton size="medium"` at once — the same
  // 32px the console's controls row runs (SplitButton, IconButton, Avatar). A bar reads as
  // one size ladder or as none.
  //
  // THE FILL IS THE DS INPUT'S OWN `--bg-surface`, not the `--bg-canvas` this file used to
  // carry to look recessed. Surface-on-surface is what a DS field looks like on a bar — the
  // hub's own header does exactly this with a real `InputText`, unmodified — and the border
  // is what separates the two: `--border-default` is `surface-100` against light's
  // `surface-0` bar and `surface-800` against dark's `surface-900`, so the edge is drawn in
  // both themes. The keycap keeps its own `--bg-surface` fill and now matches the field it
  // sits in, so it reads by its border and bottom rule rather than by a fill contrast — the
  // same way it reads inside every DS surface. The narrow shape keeps `outlined`'s own
  // surface, because there it is a button and should look like its neighbours.
  import IconButton from '@aziontech/webkit/icon-button'
  import Kbd from '@aziontech/webkit/kbd'

  // Two roots, so there is no single element for a consumer's attributes to land on.
  // Both call sites pass none; anything either shape needs belongs in this file.
  defineOptions({ inheritAttrs: false })

  defineProps({
    // The visible text in the wide shape, and the accessible name of BOTH — so it says
    // what the palette actually searches rather than a bare "Search".
    label: { type: String, default: 'Search' }
  })

  // Event-first, like every other activation event in this app.
  defineEmits(['click'])
</script>

<template>
  <!-- Narrow: the DS control, hidden the moment the bar fits. `@min-[47rem]:hidden` beats
       IconButton's own `inline-flex` because a variant is emitted after the plain utility
       it fights — the same reason the bar's `@min-[47rem]:flex` beats its `hidden`. -->
  <IconButton
    icon="pi pi-search"
    kind="outlined"
    size="medium"
    :aria-label="label"
    aria-keyshortcuts="Meta+K"
    class="@min-[47rem]:hidden"
    @click="$emit('click', $event)"
  />

  <!-- Wide: the search bar — a button in the DS field's chrome. Verified against a real
       `InputText size="medium"` on the same page, light and dark: 32px tall, the same fill
       (#fff / #0a0a0a), the same 1px border (#dadada / #2b2b2b), 6px radius, 12px padding,
       8px gap, 150ms, and a 12px/18px `--text-muted` label beside a `--text-muted`
       glyph. -->
  <button
    type="button"
    :aria-label="label"
    aria-keyshortcuts="Meta+K"
    class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-left text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
    @click="$emit('click', $event)"
  >
    <span
      class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
      aria-hidden="true"
    >
      <i class="pi pi-search" />
    </span>
    <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">{{ label }}</span>
    <Kbd
      meta
      size="small"
      class="shrink-0"
      >K</Kbd
    >
  </button>
</template>
