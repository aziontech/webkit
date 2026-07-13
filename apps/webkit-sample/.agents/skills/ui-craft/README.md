# UI-craft pack

A pack of guidance/review skills for building **product UIs and prototypes on top of**
`@aziontech/webkit` + `@aziontech/theme` with frontend taste and PRO UX. These are the
consumer-side counterpart to the primitive-authoring pipeline (`/spec-create` → `/component-create`).

Every skill auto-registers as a slash command (folder name = command). Each has two modes:

- `/<skill>` — apply its constraints to UI work in the current conversation.
- `/<skill> <file>` — review a file and report **violations (quoted line) · why (1 sentence) · fix
  (code-level)**.

All skills cite **only real tokens and components** — they link to [`DESIGN.md`](../../docs/DESIGN.md)
for the token catalog and to `packages/webkit/package.json#exports` for import paths, and stay
consistent with [`styling.md`](../../rules/styling.md), [`dependencies.md`](../../rules/dependencies.md),
[`no-invention.md`](../../rules/no-invention.md), and [`migration.md`](../../rules/migration.md).

## Principles

1. **Tech language** — precise, calm, literal. Infrastructure-grade, not marketing.
2. **Minimal and polished** — remove before you add; ornament must justify itself.
3. **PRO UX first** — flow, states, and feedback before aesthetics or delight.

## The skills

| Skill | Use it to | Order |
|---|---|---|
| [`ui-craft`](./SKILL.md) | Umbrella entry: principles, rules, routing, full-pass review. | entry |
| [`ux-heuristics`](../ux-heuristics/SKILL.md) | Get the flow right: right component, states (loading/empty/error), feedback, Nielsen heuristics. | 1 |
| [`baseline-ui`](../baseline-ui/SKILL.md) | Deslop: components-only, tokens-only, typography hierarchy, spacing rhythm. | 2 |
| [`motion-polish`](../motion-polish/SKILL.md) | Smooth motion using only animate tokens + `motion-reduce` escapes. | 3 |
| [`impeccable-polish`](../impeccable-polish/SKILL.md) | Final taste pass: hierarchy, rhythm, state completeness, optical balance. | 4 |
| [`delight`](../delight/SKILL.md) | One earned, restrained moment — never everywhere. | 5 (optional) |

## Progression

**PRO UX first → Minimal & Polished → earned delight.** Don't reach for `motion-polish` or `delight`
while `ux-heuristics` still flags a missing state. Polish amplifies a sound structure; it can't rescue
a broken one.
