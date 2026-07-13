---
name: ux-heuristics
description: PRO-UX-first prototyping and review — get the flow, states, and feedback right using the correct @aziontech/webkit component for each job. Maps Nielsen heuristics to real components (loading→Skeleton, destructive→Dialog, errors→Field*/Message, empty→one action).
status: active
last_updated: 2026-06-29
---

# Skill: ux-heuristics

## Purpose

Make the interface behave correctly before it's made to look good. Most UI slop is not a styling
problem — it's a missing loading state, an error in the wrong place, an empty screen with no next
step, or a destructive action with no confirmation. This skill enforces the right component and the
right behavior for each moment, with Nielsen's heuristics as the lens.

## How to use

- `/ux-heuristics`
  Apply the heuristic checklist to any flow you design or build in this conversation.
- `/ux-heuristics <file>`
  Review the file's flow against the checklist and output, per gap:
  - the exact line / element (quoted),
  - which heuristic it breaks (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Designing or reviewing a flow, form, list, or screen — **before** `baseline-ui` / `motion-polish`.
- The user asks "is this good UX", "what am I missing", "review this flow".

## Component map (the right tool per moment)

| Moment | Use | Don't |
|---|---|---|
| Loading content | `@aziontech/webkit/skeleton` (structural) | a bare spinner for whole-page content |
| Inline / button busy | `@aziontech/webkit/spinner` | blocking the UI with no indicator |
| Destructive / irreversible action | `@aziontech/webkit/dialog` (confirm) | a silent immediate action |
| Field validation error | `@aziontech/webkit/field-*` + `@aziontech/webkit/message` **next to the field** | a global toast for a field error |
| Page / section status | `@aziontech/webkit/message`, `@aziontech/webkit/status-indicator` | inventing a banner |
| Tooltip help | `@aziontech/webkit/tooltip` | title attribute only |
| Contextual actions / menu | `@aziontech/webkit/dropdown-menu` | a hand-rolled popover |
| Side surface | `@aziontech/webkit/panel`, `@aziontech/webkit/drawer` | a fixed div without focus management |
| Field label | `@aziontech/webkit/label` | placeholder-as-label |

Overlays (`dialog`, `drawer`, `dropdown-menu`, `panel`) must trap focus and restore it on close — use
`@aziontech/webkit/use-focus-trap`; don't rebuild focus/escape behavior by hand.

## Heuristic checklist

1. **Visibility of system status.** Every async action shows progress (`skeleton`/`spinner`) and a
   result (`message`/`status-indicator`). Nothing happens silently.
2. **Match the real world.** Labels and copy are literal and technical (see the Tech-language
   principle). No cute renaming of standard actions.
3. **User control & freedom.** Destructive actions confirm via `dialog`; long actions are cancelable;
   provide an undo where feasible. Always an obvious way back/out.
4. **Consistency & standards.** Same action → same component, same place, same label across the app.
5. **Error prevention.** Disable/guard invalid actions; validate before submit; never block paste.
6. **Recognition over recall.** Show options (`dropdown-menu`), don't make users remember; use `label`
   not placeholder-as-label.
7. **Flexibility.** Keyboard reachable; focus-visible rings present; sensible tab order.
8. **Aesthetic & minimalist.** Every element earns its place — defer ornament to the polish skills.
9. **Help users recover from errors.** Errors appear next to where the action happens (`field-*` +
   `message`), say what went wrong and how to fix it — not just "Error".
10. **Help & documentation.** Inline help via `tooltip` where a control is non-obvious.

## Three states every surface needs

- **Loading** — `skeleton` for content shape, `spinner` for inline/button busy.
- **Empty** — one clear next action (a `@aziontech/webkit/button`), and a one-line reason it's empty.
- **Error** — recoverable, located next to the cause, with a retry/fix affordance.

A surface that fetches or submits but is missing any of these three is **not done** — flag it.

## Scope

This skill is structure, not aesthetics. Defer delight explicitly: get the states and feedback right
first, then hand off. Do **not** add motion or personality here.

## Review output

For `/ux-heuristics <file>`, list gaps grouped by heuristic. Each:

```
✗ <file>:<line>  delete handler fires immediately on click
  heuristic: User control & freedom — irreversible action with no confirmation.
  fix: wrap in @aziontech/webkit/dialog confirm; primary action "Delete", default focus on Cancel.
```

End with: `flow sound` or `N gaps — fix before polish`.

## References

- Component paths: `packages/webkit/package.json#exports`.
- Focus management: `@aziontech/webkit/use-focus-trap`.
- Next steps: [`/baseline-ui`](../baseline-ui/SKILL.md) for tokens/hierarchy,
  [`/impeccable-polish`](../impeccable-polish/SKILL.md) for state-completeness sign-off.

## Definition of Done

- [ ] Every moment uses the correct webkit component (see map).
- [ ] Every async surface has loading + empty + error states.
- [ ] Destructive actions confirm; errors sit next to their cause; paste is never blocked.
- [ ] Overlays trap and restore focus via `use-focus-trap`.
- [ ] No motion or delight added here (structure only).
