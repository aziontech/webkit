---
name: structure-decide
description: Decide `monolithic` vs `composition` using the shadcn-vue criterion. Pure decision; never writes code.
status: active
last_updated: 2026-05-22
---

# Skill: structure-decide

## Purpose

Apply the shadcn-vue rule consistently:

> Use Composition Pattern only when the consumer needs to **reorder or omit** parts the root exposes. Otherwise, monolithic with props + slots.

When in doubt, choose `monolithic`. Atoms (Button, IconButton, Tag, Badge, Spinner, Currency) are always monolithic.

## When to invoke

- During `/spec-create`, before writing the `structure:` frontmatter.
- Re-check during `/component-create` when the spec is `approved` (defense in depth).

## Inputs

- The spec's Purpose, Props, Slots, and Sub-components sections (or the user's verbal description during `/spec-create`).
- The `figma-discover` JSON if available (for the `regions` array).

## Workflow

1. **Apply the decision tree:**
   - If the spec lists Sub-components → `composition`.
   - If the regions array includes a header + body + footer with optional reordering or omission → `composition`.
   - If the component is an atom (no slots beyond `default`, no sub-anatomy) → `monolithic`.
   - If the component has props + slots but fixed layout → `monolithic`.
   - Otherwise → `monolithic` (default when in doubt).
2. **Reference the canonicals** to confirm:
   - Composition: Dialog, Tabs, Accordion, composed Card, DropdownMenu, Sheet/Drawer, Form fields.
   - Monolithic with slots: `card-pricing.vue` (fixed layout, slot inversions).
   - Atomic: `button.vue`, `icon-button.vue`.
3. **Emit** a single line with the verdict and a one-sentence rationale:
   ```
   structure: composition
   rationale: Consumer reorders/omits Header, Body, Footer.
   ```
   or
   ```
   structure: monolithic
   rationale: Fixed layout with optional default + actions slots.
   ```

## Outputs

- Two lines: `structure: <verdict>` and `rationale: <one sentence>`.

## Rules

- **Do not** choose Composition reflexively for "complex" components — the decision is about reordering, not about size.
- **Do not** restate the shadcn-vue criterion in the output — just the verdict and rationale.
- **Do not** edit the spec from this skill (the orchestrator writes the frontmatter).

## Fallbacks

- Spec lacks the information needed → emit `BLOCKED: spec missing <section>`.

## Definition of Done

- [ ] Two-line verdict emitted.
- [ ] Verdict is one of `monolithic` or `composition`.
- [ ] Rationale references the criterion concretely.
