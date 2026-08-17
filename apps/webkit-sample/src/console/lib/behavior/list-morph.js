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
  enterFromClass: '-translate-y-[var(--spacing-xxs)] opacity-0',
  leaveActiveClass:
    'absolute! w-full transition-[opacity,translate]! duration-moderate-01! ease-productive-exit! motion-reduce:transition-none!',
  leaveToClass: '-translate-y-[var(--spacing-xxs)] opacity-0'
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
  enterFromClass: 'translate-y-[var(--spacing-xxs)] opacity-0',
  leaveActiveClass:
    'transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none',
  leaveToClass: '-translate-y-[var(--spacing-xxs)] opacity-0'
}
