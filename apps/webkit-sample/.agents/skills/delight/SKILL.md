---
name: delight
description: Add a single earned moment of delight in a restrained Tech/Minimal register — token-driven motion and product-specific copy only. No new libraries, no confetti, no custom keyframes. Each moment is <1s, skippable, motion-reduce-safe, and never blocks the core flow.
status: active
last_updated: 2026-06-29
---

# Skill: delight

## Purpose

Find the *one* moment where a touch of personality turns a functional interface into one users
remember — and add it there, only there. In an infrastructure product the register is technical and
minimal: delight is precision and responsiveness, not whimsy. Delight everywhere reads as noise.

## How to use

- `/delight`
  Identify earned delight moments in the current work and implement at most one or two, within the
  constraints below.
- `/delight <file>`
  Review the file: point out where a restrained moment would be earned, and flag any existing
  "delight" that is noise, blocks the flow, or breaks a token/dependency rule.

## When to invoke

- **Last**, after `ux-heuristics` → `baseline-ui` → `motion-polish` → `impeccable-polish` all pass.
- The user explicitly asks for personality / a finishing touch / a moment of delight.

## Where delight is earned (moments, not pages)

- **Completion** — a task finished (saved, deployed, published).
- **First-time** — first successful action / onboarding milestone.
- **Error recovery** — softening a frustrating moment with a calm, helpful tone.
- **Milestone** — a meaningful threshold crossed.

Reliability and consistency carry the rest of the experience. Do not sprinkle delight across hover
states and every button — that's exactly the noise the Minimal principle warns against.

## Constraints (restrained register)

- **Token-driven motion only.** Implement with the catalogued `animate-*` utilities and
  `duration-*` / `ease-*` / `curve` tokens (see [`/motion-polish`](../motion-polish/SKILL.md)). A
  satisfying state change is a `transform`/`opacity` transition on the right curve — nothing more.
- **No new dependencies.** No `canvas-confetti`, `gsap`, `framer-motion`, lottie, sound libraries, or
  any package — [`dependencies.md`](../../rules/dependencies.md) forbids them. No component-local
  `@keyframes`.
- **Copy is the cheapest delight.** Product-specific, technical, warm-not-cute microcopy on empty,
  success, and error states. Write what the product actually did
  ("Deployed to 24 edge locations" beats "All done! 🎉").
- **Never block.** Each moment is `< 1s`, skippable, and never delays core functionality. Delight
  amplifies; it never gates the task.
- **Accessible.** Every motion carries a `motion-reduce:*` escape; nothing relies on sound; never
  hide a needed affordance behind a discovery.
- **Vary, don't repeat.** A celebratory state shown identically every time becomes wallpaper — keep it
  subtle enough to wear well on the 100th view.

## Anti-patterns (reject these)

- AI-slop loading copy: "Herding pixels", "Teaching robots to dance", "Consulting the magic 8-ball".
  Instantly machine-generated. Write messages specific to what the product is doing.
- Confetti / glow / multicolor gradients as a default celebration (also banned by `baseline-ui`).
- Delight that obscures the result, or that the user can't skip.
- Personality during a critical error — be empathetic and clear, not playful.

## Review output

For `/delight <file>`, output two short lists:

```
Earned moments to add:
+ <file>:<line>  deploy success — replace generic toast copy with the concrete result + a
  fade-in (animate-fade-in motion-reduce:animate-none). <1s, non-blocking.

Noise to remove:
✗ <file>:<line>  confetti on every button click — blocks flow, needs a forbidden lib, reads as noise.
  fix: remove; reserve a single subtle success transition for task completion only.
```

## References

- Motion tokens: [`/motion-polish`](../motion-polish/SKILL.md) and [`DESIGN.md`](../../docs/DESIGN.md) § Animations.
- No-lib rule: [`dependencies.md`](../../rules/dependencies.md).
- Restraint baseline: [`/baseline-ui`](../baseline-ui/SKILL.md) (no gradient/glow unless requested).

## Definition of Done

- [ ] At most one or two earned moments, at meaningful points (completion / first-time / recovery / milestone).
- [ ] Implemented with token motion + copy only — no new lib, no `@keyframes`, no confetti.
- [ ] Each moment is `< 1s`, skippable, non-blocking, with a `motion-reduce:*` escape.
- [ ] Copy is product-specific and technical — no AI-slop filler.
- [ ] Nothing playful sits on a critical error path.
