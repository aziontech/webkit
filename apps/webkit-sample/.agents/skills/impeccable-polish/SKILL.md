---
name: impeccable-polish
description: Final taste pass that ties the pack together — verify typography hierarchy, spacing rhythm, state completeness (hover/focus/active/disabled, loading/empty/error), consistent radii & elevation, optical balance, and accent restraint. The "feels finished" sign-off.
status: active
last_updated: 2026-06-29
---

# Skill: impeccable-polish

## Purpose

The last 10% that separates "functional" from "finished". Run after `ux-heuristics`, `baseline-ui`,
and `motion-polish` — this pass checks the things those skills each touch but no single one
guarantees end-to-end: a coherent type scale, a steady spacing rhythm, every state accounted for, and
optical balance. Minimal and polished is the bar.

## How to use

- `/impeccable-polish`
  Hold UI work in this conversation to the sign-off checklist below.
- `/impeccable-polish <file>`
  Review the file and output, per issue:
  - the exact line / element (quoted),
  - why it falls short (1 short sentence),
  - the concrete fix.

## When to invoke

- Final review before shipping a screen / prototype.
- The user says "make this feel done / finished / premium", "tighten this up".

## The sign-off checklist

### 1. Typography hierarchy & consistency

- One coherent scale; no skipped or inverted levels. A heading is never smaller than a label
  (`text-heading-* > text-body-* > text-label-* > text-overline-*`).
- Only `text-*` tokens; no raw sizes, no `leading-*`/`tracking-*` overrides.
- `text-balance` on headings, `text-pretty` on body, `tabular-nums` on data, `truncate`/`line-clamp`
  in dense UI.
- Muted/secondary text uses `text-[var(--text-muted)]`, not an opacity hack.

### 2. Spacing rhythm

- A single, predictable step between related elements — all from `--spacing-*`.
- Consistent section padding; aligned gaps within repeating rows/cards.
- Related items grouped tighter than unrelated ones (proximity reads as grouping).

### 3. State completeness

- Every interactive element has **hover, focus-visible, active, and disabled** states (focus-visible
  ring via `ring-[var(--ring-color)]`).
- Every async surface has **loading, empty, and error** (cross-check with `ux-heuristics`).
- Selected / current states are visible (`--bg-selected`, `--border-selected`).

### 4. Shape & elevation coherence

- Radii from `--shape-*`, applied consistently per role (all cards `--shape-card`, all inputs
  `--shape-elements`).
- Elevation from `--shadow-*`, monotonic with stacking (overlays `--shadow-md`+, cards `--shadow-sm`);
  not every surface floats.

### 5. Optical balance & restraint

- Alignment: shared left edges, consistent optical centers; icons aligned to text baseline
  (`text-[length:inherit] leading-none`).
- One accent per view; the rest is surface + text + border tokens.
- No gradient/glow unless requested; no decorative ornament that doesn't serve the task.
- Remove anything that doesn't earn its place — Minimal and polished.

## Review output

For `/impeccable-polish <file>`, group issues by checklist section. Each:

```
✗ <file>:<line>  <button class="... focus:outline-none">  (no visible focus state)
  why: keyboard users lose track of focus; fails state completeness.
  fix: add focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1
```

End with a verdict: `finished` or `N issues across <sections>`.

## References

- Token catalog: [`DESIGN.md`](../../docs/DESIGN.md) (§ Typography, § Spacing, § Shapes, § Shadows, § Interactive states).
- Upstream passes: [`/ux-heuristics`](../ux-heuristics/SKILL.md), [`/baseline-ui`](../baseline-ui/SKILL.md), [`/motion-polish`](../motion-polish/SKILL.md).
- Optional final touch: [`/delight`](../delight/SKILL.md) — only if a moment earns it.

## Definition of Done

- [ ] Type scale coherent; hierarchy never inverted; `text-balance`/`text-pretty`/`tabular-nums` applied.
- [ ] Spacing rhythm steady from one scale; grouping reads via proximity.
- [ ] All interactive states present; all async states present; selected/current visible.
- [ ] Radii and elevation coherent per role.
- [ ] One accent per view; no unrequested ornament; nothing superfluous remains.
