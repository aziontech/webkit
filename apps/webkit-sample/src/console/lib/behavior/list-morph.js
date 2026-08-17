// The MORPH — what a list does when its rows are added, removed or reordered — and the
// SWAP, what a region does when its whole contents are replaced. Two presets, one file,
// because they are the two halves of the same question and picking the wrong one is the
// bug this module exists to prevent: a list that morphs when it should have swapped
// animates every row of the old content out and every row of the new content in, five
// separate little journeys for what the reader experienced as one switch.
//
//   MORPH_TRANSITION — the rows are the SAME list changing (a reorder, an add, a remove).
//   BLOCK_SWAP       — the contents are a DIFFERENT list (the Rules Engine changing phase,
//                      a wizard step). One block leaves, one block arrives.
//
// ── THE MORPH ─────────────────────────────────────────────────────────────────────
//
// Vue's `TransitionGroup` FLIPs positions for you: it measures each keyed child before
// and after the change and applies the inverse transform, so the rows glide to their new
// places instead of teleporting. This module supplies the timing and the leave, and it
// supplies them in ONE place because two lists were about to carry their own copy — the
// rule builder's repeaters (CreateRuleDrawer) and the Rules Engine table, where the order
// is the execution order and a row that jumps gives the reader no way to see what moved.
//
// FOUR THINGS HERE ARE LOAD-BEARING, and each was measured rather than assumed — every
// one of them fails silently, with the class compiling and nothing moving.
//
//   THE TIMING IS THE THEME'S NAMED UTILITIES. `duration-moderate-02`,
//     `ease-expressive-entrance` and friends are real classes the theme emits, so there
//     is no millisecond and no cubic-bezier written here.
//   THE MOVE NAMES `transform` AND `translate`. `TransitionGroup` sets an inline
//     `transform` for the FLIP, but a row that also carries a Tailwind `translate-*`
//     utility is animating the standalone `translate` property — that is what v4's
//     translate utilities compile to (.claude/rules/styling.md). Naming one animates
//     one, with no error.
//   THE MOVE IS `!important`, AND HAS TO BE. Vue does not just apply the move class and
//     hope: it PROBES it first, and if the probed element reports no transform transition
//     it skips the move entirely. A child that already declares its own
//     `transition-property` therefore beats the move class on source order and silently
//     switches the whole FLIP off. `Table.Row` is exactly such a child — it ships
//     `transition-colors duration-150` for its hover fill — and measured, the row
//     reported `transition-property: color, background-color, …` at 0.11s and moved in
//     ZERO interpolated frames. The important flag wins that probe, and it applies only
//     for the length of the move.
//   THE LEAVING ROW IS TAKEN OUT OF FLOW, `position: absolute`. This is what makes a
//     REMOVE stop glitching, and it is the whole reason the leave is not just an opacity
//     fade. A leaving row that stays in flow holds its full height (and the column's
//     `gap`) for the length of its fade, so the rows under it sit still and then snap up
//     the instant it unmounts — the jump the fade was supposed to cover. Absolute removes
//     it from the flow in the first frame, so the survivors start their FLIP immediately
//     and glide into the space while the removed row fades on top of it. `left`/`top`
//     stay `auto`, so the box resolves to its STATIC position and the row fades exactly
//     where it already was; `w-full` is required because an absolute box shrink-wraps.
//     The container must be `relative` — every list using this preset says so.
//   THE LEAVE IS `!important` FOR THE SAME REASON THE MOVE IS, and it is the half that
//     is easy to leave out. A draggable row carries `relative` of ITS OWN (drag-reorder.js
//     draws the drop indicator with a `before` pseudo-element, which needs a positioned
//     parent), and Tailwind emits `.relative` AFTER `.absolute` in its position group — so
//     at equal specificity the row wins and the leaving row never leaves the flow. The
//     class is applied, nothing errors, and the removal snaps exactly as it did before:
//     measured on the rule builder's criteria repeater, 2 distinct heights across the
//     whole removal, against 15 once the flag is there. The `transition-property` needs
//     the same flag, because the row already declares one.
//
// ENTER AND LEAVE TAKE THE SAME TIME (`duration-moderate-01`), deliberately: adding a row
// and removing one are the same weight of edit, and a remove that lingers longer than an
// add reads as the list resisting. Only the MOVE is longer, because travelling three rows
// is genuinely further than fading in place.

/** Spread onto a `TransitionGroup` with `v-bind`. The container must be `relative`. */
export const MORPH_TRANSITION = {
  moveClass:
    'transition-[transform,translate,opacity]! duration-moderate-02! ease-expressive-entrance! motion-reduce:transition-none!',
  enterActiveClass:
    'transition-all duration-moderate-01 ease-productive-entrance motion-reduce:transition-none',
  enterFromClass: '-translate-y-(--spacing-xxs) opacity-0',
  leaveActiveClass:
    'absolute! w-full transition-[opacity,translate]! duration-moderate-01! ease-productive-exit! motion-reduce:transition-none!',
  leaveToClass: '-translate-y-(--spacing-xxs) opacity-0'
}

/**
 * Spread onto a `Transition` with `v-bind`, around a KEYED wrapper element.
 *
 * `mode: 'out-in'` is what makes it read as a replacement rather than a dissolve: the old
 * block is gone before the new one arrives, so the reader never sees two lists at once.
 * The key has to sit on a plain wrapper ELEMENT — keying a component instead renders the
 * incoming block blank on an `out-in` swap.
 *
 * Fast on the way out and only slightly slower on the way in: the reader asked for the
 * other list and is waiting for it, so the exit owes them nothing but speed.
 */
export const BLOCK_SWAP = {
  mode: 'out-in',
  enterActiveClass:
    'transition-[opacity,translate] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none',
  enterFromClass: 'translate-y-(--spacing-xxs) opacity-0',
  leaveActiveClass:
    'transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none',
  leaveToClass: '-translate-y-(--spacing-xxs) opacity-0'
}

// ── THE COLLAPSE ──────────────────────────────────────────────────────────────────
//
// The morph above fades a leaving row OUT OF FLOW and lets its neighbours FLIP up into
// the space. That is right for a table, where a row is one line and the survivors moving
// is the whole story. It is wrong for a REPEATER whose rows are tall and differ in height
// — a rule's behavior, an argument's field card. There the row vanishing at full size
// while the list jumps up reads as a delete happening to the LIST; what the reader did
// was close one row.
//
// So this preset collapses the row itself: its own height travels to zero on the way out
// and up from zero on the way in, and the rows below simply follow. Same tokens, same
// discipline as every other height animation in this console (../format/animate-height.js
// and the skill it comes from):
//
//   MEASURED WHILE STILL `auto`, pinned only for the length of the move, and released
//     back to `auto` after — a height left pinned stops answering a resize or a late font.
//   CLIPPED ONLY WHILE MOVING (`overflow` is set in the hook and cleared with the height),
//     because a permanent `overflow: hidden` shaves the focus ring off any control sitting
//     flush with the row's edge.
//   THE GAP COLLAPSES WITH IT. A flex column's `gap` is not part of the row's height, so a
//     row easing to zero still holds its gap and the list snaps that many pixels shut at
//     the end. The hooks read the parent's real `row-gap` and ease a negative
//     `margin-block-end` by exactly that much, so the space closes all the way.
//
// Vue drives the timing from the CSS classes (the hooks only set values), so there is no
// millisecond here either — and no `done()` callback, which is what Vue would need only
// if this ran with `css: false`.
//
// FAST, because a remove is interaction feedback and not a scene: `fast-02` each way, and
// the move a step longer at `moderate-01` because crossing three rows is genuinely further
// than closing in place.

/** The parent's real row gap, in px — `0` when the list has none (an ItemList's dividers). */
const rowGapOf = (el) => {
  const parent = el.parentElement
  if (!parent) return 0
  const gap = parseFloat(globalThis.getComputedStyle(parent).rowGap)
  return Number.isFinite(gap) ? gap : 0
}

/** Pin the height for the move; `''` releases it back to `auto`. */
const setBox = (el, height, margin) => {
  el.style.height = height
  el.style.marginBlockEnd = margin
}

const release = (el) => {
  setBox(el, '', '')
  el.style.overflow = ''
}

/**
 * Commit the from-value, in this frame.
 *
 * The usual trick for an entrance is two nested `requestAnimationFrame`s, and here that is
 * WRONG — measurably. Vue times a transition by probing the element right after it applies
 * the active class; a height that only starts changing two frames later finishes two
 * frames after Vue's timeout, so Vue calls `after-enter`, the hook releases the height to
 * `auto`, and the row snaps the rest of the way. Measured: 3 distinct heights across the
 * whole entrance, against 9 on the leave that was already synchronous.
 *
 * Reading `offsetHeight` forces the pending style to be applied NOW, which is all the rAFs
 * were ever buying — so the from-value is committed and the to-value still lands inside
 * the frame Vue is timing from.
 */
const commit = (el) => void el.offsetHeight

/** Spread onto a `TransitionGroup` with `v-bind`. The container must be `relative`. */
export const MORPH_COLLAPSE = {
  moveClass:
    'transition-[transform,translate,opacity]! duration-moderate-01! ease-productive-entrance! motion-reduce:transition-none!',
  // `!` for the same reason the leave and the move carry it, and it is the easiest of the
  // three to leave off: a repeater row declares a `transition-property` of its own (the
  // drag preset animates `opacity, outline-color`), and Tailwind emits it after this
  // class — so at equal specificity the row wins and the height never transitions.
  // Measured on the arguments list: 2 distinct heights across the whole entrance without
  // the flag, 8 with it.
  enterActiveClass:
    'transition-[height,margin,opacity]! duration-fast-02! ease-productive-entrance! motion-reduce:transition-none!',
  enterFromClass: 'opacity-0',
  leaveActiveClass:
    'transition-[height,margin,opacity]! duration-fast-02! ease-productive-exit! motion-reduce:transition-none!',
  leaveToClass: 'opacity-0',

  onEnter(el) {
    const gap = rowGapOf(el)
    el.style.overflow = 'hidden'
    // Measure while `auto` — the height the row is arriving at — then travel from zero.
    el.style.height = 'auto'
    const to = el.offsetHeight
    setBox(el, '0px', `-${gap}px`)
    commit(el)
    setBox(el, `${to}px`, '0px')
  },
  onAfterEnter: release,
  onEnterCancelled: release,

  onLeave(el) {
    const gap = rowGapOf(el)
    el.style.overflow = 'hidden'
    setBox(el, `${el.offsetHeight}px`, '0px') // pin what the reader is looking at
    commit(el)
    setBox(el, '0px', `-${gap}px`)
  }
}
