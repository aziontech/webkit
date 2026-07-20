---
name: webkit-ui-craft
description: Umbrella entry for building product UI on @aziontech/webkit with taste and PRO UX. Explains the 3 principles and the non-negotiable rules, then routes to the focused skills — structure (ux-heuristics, usability, ui-states, form, navigation), foundation (baseline-ui), cross-cutting quality (accessibility, content, responsive, theming, performance, i18n, data-viz), polish (motion, impeccable, delight), and verification (ui-verify).
status: active
last_updated: 2026-07-20
---

# Skill: webkit-ui-craft

## Purpose

Make UI built **on top of** `@aziontech/webkit` + `@aziontech/theme` look and feel like the design
system intended: technical, minimal, polished, PRO-UX-first. This is the **map** to a pack of focused
skills — it carries the shared principles and routes each task to the skill that owns the detail. It
is for **consuming** apps (composing screens from shipped components and tokens), not for authoring
webkit primitives.

## How to use

- `/webkit-ui-craft` — apply the principles below to all UI work in this conversation and route to the
  right child skill for the task at hand.
- `/webkit-ui-craft <file>` — run the progression as a review: structure (`/webkit-ux-heuristics` →
  `/webkit-ui-states` → `/webkit-usability`) → foundation (`/webkit-baseline-ui`) → cross-cutting
  quality (accessibility, responsive, theming) → polish (`/webkit-motion-polish` →
  `/webkit-impeccable-polish`, then `/webkit-delight` only if a moment earns it) → verify
  (`/webkit-ui-verify`). Output each child skill's findings under its own heading.

## The 3 principles

1. **Tech language.** Infrastructure-grade product UI: copy and visuals are precise, calm, and literal
   — no emoji-as-decoration, no marketing fluff inside the product.
2. **Minimal and polished.** Remove before you add. Every element earns its place; ornament is the
   exception that has to justify itself.
3. **PRO UX first.** Get flow, states, and feedback right before any aesthetic pass. A beautiful
   screen with a missing empty/error/loading state is not done.

## The non-negotiable rules (detail lives in the owning skill)

1. **Components only** — compose from `@aziontech/webkit`; never hand-roll a button/input/modal/
   dropdown the system ships. (Find them via the webkit MCP `suggest_component` or
   `node_modules/@aziontech/webkit/catalog.json`.) See `/webkit-usage`, `/webkit-ds-adoption`.
2. **Tokens only** — color, typography, shape, spacing, shadow come from `@aziontech/theme`; no hex,
   `rgb`, `hsl`, or Tailwind palette. See `/webkit-baseline-ui`.
3. **Typography hierarchy** — only the `text-*` tokens, never inverted (`text-heading-* >
text-body-* > text-label-* > text-overline-*`). See `/webkit-baseline-ui`.
4. **Spacing rhythm** — one `--spacing-*` step, applied consistently. See `/webkit-baseline-ui`.
5. **Contain the page** — cap reading/content width with `max-w-[var(--container-*)]`, keep
   data-dense surfaces fluid; never a raw `px`/`rem` width. The full container doctrine (fluid-first
   shell, focused-flow centering) lives in `/webkit-baseline-ui`.
6. **Token motion only** — `animate-*` utilities + `duration-*`/`ease-*` tokens, with a
   `motion-reduce:*` escape; no animation library. See `/webkit-motion-polish`.
7. **Accessible & localizable by construction** — labels, focus, ARIA state, target size; no
   hardcoded strings. See `/webkit-accessibility-implementation`, `/webkit-i18n-readiness`.
8. **Works in both themes** — style through role tokens so light and dark need no per-theme edits.
   See `/webkit-theming-dark-mode`.

## The progression — route by phase

Run roughly in this order; polish amplifies a sound structure, it can't rescue a broken one.

| Phase      | Goal                                                                   | Skill                                  |
| ---------- | ---------------------------------------------------------------------- | -------------------------------------- |
| Mechanics  | Import path, tokens, tree-shaking                                      | `/webkit-usage`                        |
| Structure  | Right component + Nielsen heuristics; the 3 states must exist          | `/webkit-ux-heuristics`                |
| Structure  | The full loading/empty/error/partial state surface, per component      | `/webkit-ui-states`                    |
| Structure  | Async behavior: lock the scope while running, toast request errors     | `/webkit-usability`                    |
| Structure  | Accessible forms: fieldset/legend, submit-time required/invalid        | `/webkit-form`                         |
| Structure  | The two console shells; one GlobalHeader; user always visible          | `/webkit-navigation`                   |
| Foundation | Deslop: components-only, tokens-only, hierarchy, rhythm, containers    | `/webkit-baseline-ui`                  |
| Quality    | WCAG 2.2 AA on the composition: focus, ARIA, live regions, targets     | `/webkit-accessibility-implementation` |
| Quality    | UX writing: actionable errors, specific CTAs, consistent vocabulary    | `/webkit-content-microcopy`            |
| Quality    | How the screen reorganizes across sizes; nav collapses to a drawer     | `/webkit-responsive-layout`            |
| Quality    | Both themes work with zero per-theme edits                             | `/webkit-theming-dark-mode`            |
| Quality    | Perceived performance: optimistic UI, zero layout shift, debounce      | `/webkit-performance-ux`               |
| Quality    | Localizable by construction: no hardcoded strings, text expansion, RTL | `/webkit-i18n-readiness`               |
| Quality    | Charts mapped to tokens: form by question, palette, anatomy            | `/webkit-data-viz`                     |
| Polish     | Smooth motion with tokens only                                         | `/webkit-motion-polish`                |
| Polish     | The "feels finished" cross-screen sign-off                             | `/webkit-impeccable-polish`            |
| Polish     | One earned, restrained moment of delight                               | `/webkit-delight`                      |
| Verify     | Drive the screen: both themes, widths, console, axe, states            | `/webkit-ui-verify`                    |
| Migrate    | Adopt webkit incrementally in an existing app; coverage scorecard      | `/webkit-ds-adoption`                  |

## When to invoke

- Building or reviewing a product screen/flow that consumes `@aziontech/webkit`.
- The user asks for "polish", "make this feel better", "deslop", "is this good UX", "review this UI".
- You're about to write UI on top of webkit and want the constraints and the right child skill loaded.

## Definition of Done

- [ ] The right child skill ran for the task (structure before polish).
- [ ] Every component is from `@aziontech/webkit`; every visual value is a token.
- [ ] Structure is sound (states, feedback, a11y) before any polish or delight was added.
- [ ] The screen was verified for real (`/webkit-ui-verify`), not assumed — both themes, no console errors.
